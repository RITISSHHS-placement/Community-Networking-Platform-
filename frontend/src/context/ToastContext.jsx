import { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ show: false, msg: '' });
  const timerRef = useRef(null);

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className={`toast${toast.show ? ' show' : ''}`} role="status" aria-live="polite">
        <span className="t-dot" />
        <span>{toast.msg}</span>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
