export type ProductCategory = 'acai' | 'creme-de-ninho' | 'sorvetes' | 'cupuacu';

export type ToppingCategory = 'granola' | 'fruit' | 'complemento' | 'syrup' | 'extra';

export interface Topping {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly emoji: string;
  readonly category: ToppingCategory;
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly longDescription: string;
  readonly price: number;
  readonly originalPrice?: number;
  readonly category: ProductCategory;
  readonly image: string;
  readonly badge?: 'bestseller' | 'new' | 'promo' | 'hot';
  readonly rating: number;
  readonly reviewCount: number;
  readonly availableToppingIds: string[];
  readonly defaultToppingIds: string[];
  readonly nutritionalInfo: NutritionalInfo;
  readonly tags: string[];
  readonly inStock: boolean;
  readonly preparationTime: number;
  readonly promoEligible: boolean;
}

/**
 * Anti-tampering design: CartItem stores ONLY identifiers, NEVER prices.
 * All monetary values are computed at runtime from the immutable catalog.
 */
export interface CartItem {
  readonly id: string;
  readonly productId: string;
  readonly quantity: number;
  readonly selectedToppingIds: ReadonlyArray<string>;
  readonly notes?: string;
}

/**
 * ResolvedCartItem is computed, never persisted.
 * Used exclusively for display and calculation from catalog sources.
 */
export interface ResolvedCartItem {
  cartItem: CartItem;
  product: Product;
  selectedToppings: Topping[];
  unitPrice: number;
  totalPrice: number;
}

export interface PromoResult {
  label: string;
  discountAmount: number;
  eligiblePairCount: number;
}

export interface CartTotals {
  subtotal: number;
  promoDiscount: number;
  couponDiscount: number;
  deliveryFee: number;
  total: number;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  address?: Address;
  createdAt: Date;
  loyaltyPoints: number;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivering'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'pix' | 'credit-card' | 'debit-card';

export interface PaymentDetails {
  method: PaymentMethod;
  pixKey?: string;
  cardLast4?: string;
  cardBrand?: string;
}

export interface Order {
  id: string;
  userId?: string;
  items: ResolvedCartItem[];
  status: OrderStatus;
  totals: CartTotals;
  address: Address;
  payment: PaymentDetails;
  notes?: string;
  estimatedDelivery: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  paymentMethod: PaymentMethod;
  cardNumber?: string;
  cardHolder?: string;
  cardExpiry?: string;
  cardCvv?: string;
  notes?: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type SortOption = 'popular' | 'price-asc' | 'price-desc' | 'newest' | 'rating';
