import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Excluir Definitivamente',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-[#1B1D21] border border-[#292C31] rounded-2xl w-full max-w-sm p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#E45B5B]/15 border border-[#E45B5B]/30 flex items-center justify-center text-[#E45B5B] shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-[#F5F5F5]">{title}</h3>
            <p className="text-xs text-[#92969F]">Ação irreversível</p>
          </div>
        </div>

        <p className="text-xs text-[#92969F] leading-relaxed mb-6">{message}</p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-xs font-medium text-[#92969F] hover:text-[#F5F5F5] hover:bg-[#202227] transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-[#E45B5B] hover:bg-[#c94949] text-white text-xs font-bold transition-colors cursor-pointer shadow-md shadow-[#E45B5B]/20 disabled:opacity-50"
          >
            {loading ? 'Excluindo...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
