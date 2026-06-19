export const CATEGORY_CONFIG: Record<string, {
  label: string
  emoji: string
  gradient: string
  bg: string
}> = {
  'pizzas-tomate': {
    label: 'Pizzas Tomate',
    emoji: '🍕',
    gradient: 'linear-gradient(135deg, #FF6B35 0%, #CC2222 100%)',
    bg: '#FFF0EE',
  },
  'pizzas-creme': {
    label: 'Pizzas Crème',
    emoji: '🤍',
    gradient: 'linear-gradient(135deg, #F5E6D3 0%, #D4A96A 100%)',
    bg: '#FFF8F0',
  },
  'burgers': {
    label: 'Burgers',
    emoji: '🍔',
    gradient: 'linear-gradient(135deg, #FFD93D 0%, #FF6B35 100%)',
    bg: '#FFFBEE',
  },
  'accompagnements': {
    label: 'Accompagnements',
    emoji: '🍟',
    gradient: 'linear-gradient(135deg, #FFE066 0%, #F59E0B 100%)',
    bg: '#FFFBEB',
  },
  'pizza-kid': {
    label: "Pizza'Kid",
    emoji: '⭐',
    gradient: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)',
    bg: '#F5F3FF',
  },
  'pates': {
    label: 'Pâtes',
    emoji: '🍝',
    gradient: 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 100%)',
    bg: '#FFFBEB',
  },
  'salades': {
    label: 'Salades',
    emoji: '🥗',
    gradient: 'linear-gradient(135deg, #86EFAC 0%, #16A34A 100%)',
    bg: '#F0FDF4',
  },
  'desserts': {
    label: 'Desserts',
    emoji: '🍰',
    gradient: 'linear-gradient(135deg, #FBCFE8 0%, #EC4899 100%)',
    bg: '#FDF2F8',
  },
  'boissons': {
    label: 'Boissons',
    emoji: '🥤',
    gradient: 'linear-gradient(135deg, #93C5FD 0%, #2563EB 100%)',
    bg: '#EFF6FF',
  },
}

export const MENU_CATEGORIES = [
  'pizzas-tomate',
  'pizzas-creme',
  'burgers',
  'accompagnements',
  'pizza-kid',
  'pates',
  'salades',
  'desserts',
  'boissons',
]
