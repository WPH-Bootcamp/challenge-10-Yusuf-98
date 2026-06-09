'use client';

import { create } from 'zustand';

interface UIState {
  mobileMenuOpen: boolean;
  reviewModalOpen: boolean;
  reviewOrderId: string | null;
  reviewRestaurantId: string | null;
  reviewTransactionId: string | null;
  paymentSuccessData: {
    date: string;
    paymentMethod: string;
    subtotal: number;
    deliveryFee: number;
    serviceFee: number;
    total: number;
  } | null;

  setMobileMenuOpen: (open: boolean) => void;
  openReviewModal: (data: {
    orderId: string;
    restaurantId: string;
    transactionId: string;
  }) => void;
  closeReviewModal: () => void;
  setPaymentSuccess: (data: UIState['paymentSuccessData']) => void;
  clearPaymentSuccess: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  mobileMenuOpen: false,
  reviewModalOpen: false,
  reviewOrderId: null,
  reviewRestaurantId: null,
  reviewTransactionId: null,
  paymentSuccessData: null,

  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

  openReviewModal: ({ orderId, restaurantId, transactionId }) =>
    set({
      reviewModalOpen: true,
      reviewOrderId: orderId,
      reviewRestaurantId: restaurantId,
      reviewTransactionId: transactionId,
    }),

  closeReviewModal: () =>
    set({
      reviewModalOpen: false,
      reviewOrderId: null,
      reviewRestaurantId: null,
      reviewTransactionId: null,
    }),

  setPaymentSuccess: (data) => set({ paymentSuccessData: data }),
  clearPaymentSuccess: () => set({ paymentSuccessData: null }),
}));
