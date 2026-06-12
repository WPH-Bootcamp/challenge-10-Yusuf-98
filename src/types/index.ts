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
  id: string | number;
  name: string;
  logo?: string;
  images?: string[];
  star?: number;
  rating?: number;
  reviewCount?: number;
  place?: string;
  location?: string;
  distance?: number;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  priceRange?: { min: number; max: number };
  description?: string;
}

export interface MenuItem {
  id: string | number;
  name?: string;
  foodName?: string;
  price: number;
  image?: string;
  category?: string;
  type?: string;
  description?: string;
  restaurantId?: string | number;
}

export interface Review {
  id: string | number;
  userId?: string | number;
  userName?: string;
  userAvatar?: string;
  user?: {
    id: number;
    name: string;
    avatar?: string | null;
  };
  restaurantId?: string | number;
  star: number;
  comment: string;
  createdAt: string;
  menuIds?: string[];
}

export interface RestaurantDetail extends Restaurant {
  menu?: MenuItem[];
  menus?: MenuItem[];
  reviews: Review[];
  averageRating?: number;
  totalMenus?: number;
  totalReviews?: number;
  coordinates?: { lat: number; long: number };
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
  id: string | number;
  menuId?: string | number;
  restaurantId?: string | number;
  quantity: number;
  itemTotal?: number;
  menu: {
    id: string | number;
    foodName?: string;
    name?: string;
    price: number;
    image?: string;
    type?: string;
  };
  restaurant?: {
    id: string | number;
    name: string;
    logo?: string;
  };
}

export interface CartGroup {
  restaurant: {
    id: string | number;
    name: string;
    logo?: string;
  };
  items: CartItem[];
  subtotal?: number;
  total?: number;
}

// ── Order ────────────────────────────────────────────────────────────────────
export type OrderStatus =
  | 'preparing'
  | 'on_the_way'
  | 'delivered'
  | 'done'
  | 'canceled';

export interface OrderItem {
  menuId: string | number;
  menuName?: string;
  name?: string;
  price: number;
  image?: string;
  quantity: number;
  itemTotal?: number;
}

export interface Order {
  id: string | number;
  transactionId?: string;
  status: OrderStatus;
  paymentMethod: string;
  deliveryAddress: string;
  phone?: string;
  pricing?: {
    subtotal: number;
    serviceFee: number;
    deliveryFee: number;
    totalPrice: number;
  };
  total?: number;
  restaurants?: {
    restaurant: {
      id: string | number;
      name: string;
      logo?: string;
    };
    items: OrderItem[];
    subtotal: number;
  }[];
  items?: OrderItem[];
  restaurant?: {
    id: string | number;
    name: string;
    logo?: string;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface CheckoutPayload {
  restaurants: {
    restaurantId: string | number;
    items: { menuId: string | number; quantity: number }[];
  }[];
  deliveryAddress: string;
  phone?: string;
  paymentMethod: string;
  notes?: string;
}

// ── Review ───────────────────────────────────────────────────────────────────
export interface ReviewPayload {
  transactionId: string;
  restaurantId: string | number;
  star: number;
  comment: string;
  menuIds?: (string | number)[];
}
