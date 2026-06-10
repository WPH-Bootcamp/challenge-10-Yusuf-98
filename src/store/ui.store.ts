'use client';

import { create } from 'zustand';

interface PaymentSuccessData {
  date: string;
  paymentMethod: string;
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  total: number;
}

interface UIState {
  paymentSuccessData: PaymentSuccessData | null;
  setPaymentSuccess: (data: PaymentSuccessData) => void;
  clearPaymentSuccess: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  paymentSuccessData: null,
  setPaymentSuccess: (data) => set({ paymentSuccessData: data }),
  clearPaymentSuccess: () => set({ paymentSuccessData: null }),
}));
