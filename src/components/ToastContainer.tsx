import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-3.5 rounded-xl shadow-xl flex items-start gap-3 border text-xs font-medium animate-in slide-in-from-bottom-3 duration-200 ${
            toast.type === 'error'
              ? 'bg-rose-950 text-rose-100 border-rose-800'
              : toast.type === 'info'
              ? 'bg-slate-900 text-white border-slate-700'
              : toast.type === 'warning'
              ? 'bg-amber-950 text-amber-100 border-amber-800'
              : 'bg-slate-900 text-emerald-300 border-slate-700'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          ) : toast.type === 'info' ? (
            <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          )}

          <div className="flex-1 leading-snug">{toast.message}</div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white p-0.5 rounded shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
