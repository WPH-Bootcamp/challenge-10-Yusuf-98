'use client';

import * as React from 'react';

type ToastVariant = 'default' | 'success' | 'error';

interface ToastState {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  open: boolean;
}

type Toast = Omit<ToastState, 'id' | 'open'>;

let toastCount = 0;

type Listener = (toasts: ToastState[]) => void;
const listeners: Listener[] = [];
let memoryToasts: ToastState[] = [];

function dispatch(state: ToastState[]) {
  memoryToasts = state;
  listeners.forEach((l) => l(state));
}

export function toast({ title, description, variant = 'default' }: Toast) {
  const id = String(++toastCount);
  dispatch([...memoryToasts, { id, title, description, variant, open: true }]);
  setTimeout(() => {
    dispatch(
      memoryToasts.map((t) => (t.id === id ? { ...t, open: false } : t))
    );
  }, 3500);
}

export function useToast() {
  const [toasts, setToasts] = React.useState<ToastState[]>(memoryToasts);

  React.useEffect(() => {
    listeners.push(setToasts);
    return () => {
      const idx = listeners.indexOf(setToasts);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  return {
    toasts,
    toast,
    dismiss: (id: string) =>
      dispatch(
        memoryToasts.map((t) => (t.id === id ? { ...t, open: false } : t))
      ),
  };
}
