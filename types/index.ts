export type PizzaSize = 'moyenne' | 'mega'
export type OrderType = 'delivery' | 'pickup'
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled'

export interface MenuItem {
  id: string
  name: string
  description?: string
  ingredients?: string
  basePrice: number
  megaPrice?: number
  category: MenuCategory
  isHalal?: boolean
  isVegetarian?: boolean
  isBestSeller?: boolean
  note?: string
}

export interface CartItem {
  id: string
  menuItemId: string
  name: string
  size?: PizzaSize
  price: number
  quantity: number
}

export interface DeliveryZone {
  name: string
  cities: string[]
  fee: number
}

export interface OrderFormData {
  customerName: string
  phone: string
  orderType: OrderType
  address?: string
  city?: string
  deliveryFee?: number
}

export interface Order {
  id?: string
  created_at?: string
  customer_name: string
  phone: string
  order_type: OrderType
  address?: string
  city?: string
  delivery_fee: number
  items: CartItem[]
  subtotal: number
  total: number
  status: OrderStatus
  stripe_payment_intent_id?: string
  notes?: string
}

export type MenuCategory =
  | 'pizzas-tomate'
  | 'pizzas-creme'
  | 'burgers'
  | 'accompagnements'
  | 'pizza-kid'
  | 'pates'
  | 'salades'
  | 'desserts'
  | 'boissons'
