'use client';

import React from 'react';
import { X, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function DeleteMaterialModal({ isOpen, materialName, loading, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 text-center space-y-4">
          <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 mx-auto transform -rotate-6">
            <Trash2 size={40} />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">O'chirishni tasdiqlaysizmi?</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Siz haqiqatdan ham <span className="font-bold text-slate-900">"{materialName}"</span> materialini o'chirib tashlamoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-slate-50 text-slate-600 py-4 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all active:scale-95 disabled:opacity-50"
            >
              Bekor qilish
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 bg-rose-500 text-white py-4 rounded-2xl font-bold text-sm hover:bg-rose-600 transition-all shadow-xl shadow-rose-100 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 group"
            >
              {loading ? 'O\'chirilmoqda...' : (
                <>
                  <Trash2 size={18} className="group-hover:rotate-12 transition-transform" />
                  O'chirish
                </>
              )}
            </button>
          </div>
        </div>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
