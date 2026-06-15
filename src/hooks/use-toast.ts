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

type ToastInput = Omit<ToastState, 'id' | 'open'>;

let count = 0;
type Listener = (toasts: ToastState[]) => void;
const listeners: Listener[] = [];
let memToasts: ToastState[] = [];

function dispatch(state: ToastState[]) {
  memToasts = state;
  listeners.forEach((l) => l(state));
}

export function toast(input: ToastInput) {
  const id = String(++count);
  dispatch([...memToasts, { ...input, id, open: true }]);
  setTimeout(() => {
    dispatch(memToasts.map((t) => (t.id === id ? { ...t, open: false } : t)));
  }, 3500);
}

export function useToast() {
  const [toasts, setToasts] = React.useState<ToastState[]>(memToasts);

  React.useEffect(() => {
    listeners.push(setToasts);
    return () => {
      const i = listeners.indexOf(setToasts);
      if (i > -1) listeners.splice(i, 1);
    };
  }, []);

  return { toasts, toast };
}
