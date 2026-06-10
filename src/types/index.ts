// ── Auth ─────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  address?: string;
}

export interface AuthResponse {
  success?: boolean;
  message?: string;
  token?: string;
  access_token?: string;
  user?: User;
  data?: {
    token?: string;
    user?: User;
  };
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

// ── Restaurant ───────────────────────────────────────────────────────────────
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

// ── Filter ───────────────────────────────────────────────────────────────────
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

// ── Cart ─────────────────────────────────────────────────────────────────────
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

// ── Order ────────────────────────────────────────────────────────────────────
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

// ── Review ───────────────────────────────────────────────────────────────────
export interface ReviewPayload {
  transactionId: string;
  restaurantId: string;
  star: number;
  comment: string;
  menuIds?: string[];
}
