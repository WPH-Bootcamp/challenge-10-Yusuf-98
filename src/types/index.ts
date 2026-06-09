// Auth Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  address?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}

// Restaurant Types
export interface Restaurant {
  id: string;
  name: string;
  logo?: string;
  images?: string[];
  rating: number;
  reviewCount?: number;
  location: string;
  distance?: number;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  description?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
  description?: string;
  restaurantId?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  restaurantId: string;
  star: number;
  comment: string;
  createdAt: string;
  menuIds?: string[];
}

export interface RestaurantDetail extends Restaurant {
  menu: MenuItem[];
  reviews: Review[];
}

// Cart Types
export interface CartItem {
  id: string;
  menuId: string;
  restaurantId: string;
  quantity: number;
  menu: MenuItem;
  restaurant?: Restaurant;
}

export interface CartGroup {
  restaurant: Restaurant;
  items: CartItem[];
  total: number;
}

// Order Types
export type OrderStatus =
  | 'preparing'
  | 'on_the_way'
  | 'delivered'
  | 'done'
  | 'canceled';

export interface OrderItem {
  menuId: string;
  quantity: number;
  menu: MenuItem;
}

export interface Order {
  id: string;
  restaurantId: string;
  restaurant: Restaurant;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  deliveryAddress: string;
  paymentMethod: string;
  notes?: string;
  createdAt: string;
  transactionId?: string;
}

export interface CheckoutPayload {
  restaurants: {
    restaurantId: string;
    items: { menuId: string; quantity: number }[];
  }[];
  deliveryAddress: string;
  phone?: string;
  paymentMethod: string;
  notes?: string;
}

export interface PaymentSummary {
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  total: number;
}

// Filter Types
export interface RestaurantFilter {
  location?: string;
  range?: number;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  category?: string;
  page?: number;
  limit?: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Review Payload
export interface ReviewPayload {
  transactionId: string;
  restaurantId: string;
  star: number;
  comment: string;
  menuIds?: string[];
}
