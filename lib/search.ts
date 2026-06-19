/**
 * Moteur de recherche RAG local — 100% basé sur menu-data.ts
 * Supporte : ingrédients, budget, régime, base, fautes de frappe
 */

import { MENU } from './menu-data'
import type { MenuItem } from '@/types'

// ─── Normalisation ──────────────────────────────────────────────────────────

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // remove accents
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// ─── Distance de Levenshtein (fautes de frappe) ─────────────────────────────

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  )
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j - 1], dp[i][j - 1], dp[i - 1][j])
    }
  }
  return dp[m][n]
}

function fuzzyMatch(query: string, target: string, threshold = 2): boolean {
  if (target.includes(query)) return true
  if (query.length < 4) return false
  const words = target.split(' ')
  return words.some(w => w.length >= 3 && levenshtein(query, w) <= threshold)
}

// ─── Parseurs de requête ────────────────────────────────────────────────────

interface ParsedQuery {
  budget: number | null
  halal: boolean
  vegetarian: boolean
  base: 'tomate' | 'creme' | null
  excludeIngredients: string[]
  terms: string[]
}

const CHEAP_WORDS = ['pas cher', 'economique', 'petit prix', 'abordable']
const HALAL_WORDS = ['halal']
const VEGGIE_WORDS = ['vegetarien', 'veggie', 'vege', 'sans viande', 'vegetarien']
const CREME_WORDS = ['creme', 'blanche', 'base creme']
const TOMATE_WORDS = ['tomate', 'base tomate']

function parseQuery(raw: string): ParsedQuery {
  const q = normalize(raw)
  const result: ParsedQuery = {
    budget: null,
    halal: false,
    vegetarian: false,
    base: null,
    excludeIngredients: [],
    terms: [],
  }

  // Budget : "moins de 13€", "budget 12", "max 15"
  const budgetMatch = q.match(/(?:moins de|budget|max|maximum|sous|jusqu a)\s*(\d+)/i)
  if (budgetMatch) result.budget = parseFloat(budgetMatch[1])
  if (!result.budget && CHEAP_WORDS.some(w => q.includes(w))) result.budget = 12

  // Régimes
  result.halal = HALAL_WORDS.some(w => q.includes(w))
  result.vegetarian = VEGGIE_WORDS.some(w => q.includes(w))

  // Base
  if (CREME_WORDS.some(w => q.includes(w))) result.base = 'creme'
  else if (TOMATE_WORDS.some(w => q.includes(w))) result.base = 'tomate'

  // Exclusions : "sans anchois", "sans champignon"
  const sansMatch = q.matchAll(/sans\s+(\w+)/g)
  for (const m of sansMatch) result.excludeIngredients.push(normalize(m[1]))

  // Termes de recherche restants (après avoir retiré les mots-clés structurels)
  const cleaned = q
    .replace(/(?:moins de|budget|max|maximum|sous|jusqu a)\s*\d+/g, '')
    .replace(/(?:pas cher|economique|petit prix|abordable)/g, '')
    .replace(/(?:halal|vegetarien|veggie|vege|sans viande)/g, '')
    .replace(/(?:base )?(?:creme|blanche|tomate)/g, '')
    .replace(/sans\s+\w+/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  result.terms = cleaned.split(' ').filter(t => t.length >= 2)
  return result
}

// ─── Priorité catégorie (plats principaux avant boissons) ───────────────────

const CATEGORY_PRIORITY: Record<string, number> = {
  'pizzas-tomate':  100,
  'pizzas-creme':   100,
  'burgers':         80,
  'pates':           70,
  'salades':         60,
  'pizza-kid':       50,
  'accompagnements': 20,
  'desserts':        15,
  'boissons':        10,
}

// ─── Scoring ────────────────────────────────────────────────────────────────

function scoreItem(item: MenuItem, parsed: ParsedQuery): number {
  let score = 0
  const name = normalize(item.name)
  const ingredients = normalize(item.ingredients ?? '')

  // Filtres stricts (élimination)
  if (parsed.budget !== null && item.basePrice > parsed.budget) return -1
  if (parsed.halal && !item.isHalal) return -1
  if (parsed.vegetarian && !item.isVegetarian) return -1
  if (parsed.base === 'creme' && !item.category.includes('creme')) return -1
  if (parsed.base === 'tomate' && !item.category.includes('tomate')) return -1
  if (parsed.excludeIngredients.some(ex => ingredients.includes(ex))) return -1

  if (parsed.terms.length === 0 && !parsed.halal && !parsed.vegetarian && !parsed.base && !parsed.budget) {
    return -1 // requête vide → pas de résultats
  }

  // Quand le seul filtre actif est le budget (pas de mots-clés texte),
  // trier par catégorie (plats principaux d'abord) puis par prix croissant.
  const budgetOnly =
    parsed.budget !== null &&
    parsed.terms.length === 0 &&
    !parsed.halal &&
    !parsed.vegetarian &&
    !parsed.base

  if (budgetOnly) {
    const priority = CATEGORY_PRIORITY[item.category] ?? 5
    // Score = priorité catégorie + écart prix (0.5×, secondaire)
    return priority + (parsed.budget! - item.basePrice) * 0.5
  }

  // Scoring des termes
  for (const term of parsed.terms) {
    if (name === term) score += 100
    else if (name.includes(term)) score += 50
    else if (ingredients.includes(term)) score += 40
    else if (fuzzyMatch(term, name)) score += 30
    else if (fuzzyMatch(term, ingredients)) score += 20
  }

  // Bonus régime
  if (parsed.halal && item.isHalal) score += 10
  if (parsed.vegetarian && item.isVegetarian) score += 10

  // Bonus budget secondaire (quand il y a aussi des mots-clés)
  if (parsed.budget !== null) {
    const priority = CATEGORY_PRIORITY[item.category] ?? 5
    score += priority * 0.2 + (parsed.budget - item.basePrice) * 0.5
  }

  return score
}

// ─── Export principal ────────────────────────────────────────────────────────

export interface SearchResult {
  item: MenuItem
  score: number
}

export function searchMenu(query: string): SearchResult[] {
  if (!query.trim()) return []

  const parsed = parseQuery(query)
  const results: SearchResult[] = []

  for (const item of MENU) {
    const score = scoreItem(item, parsed)
    if (score > 0) results.push({ item, score })
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 12)
}

// ─── Suggestions de recherche rapide (chips) ──────────────────────────────

export const QUICK_SEARCHES = [
  { label: '🌿 Végétarien', query: 'végétarien' },
  { label: '✅ Halal', query: 'halal' },
  { label: '💰 Moins de 13€', query: 'moins de 13€' },
  { label: '🍗 Poulet', query: 'poulet' },
  { label: '🥩 Chorizo', query: 'chorizo' },
  { label: '🐟 Thon', query: 'thon' },
  { label: '🧀 4 Fromages', query: '4 fromages' },
  { label: '🫙 Base crème', query: 'base crème' },
]
