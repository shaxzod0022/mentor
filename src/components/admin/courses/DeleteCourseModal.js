'use client';

import React from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';

export default function DeleteCourseModal({ isOpen, onClose, onConfirm, courseName, loading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 pb-0 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mb-6">
            <AlertTriangle size={32} />
          </div>
          
          <h2 className="text-xl font-bold text-slate-900 mb-2">Kursni o'chirish</h2>
          <p className="text-slate-500 text-sm leading-relaxed px-4">
            Haqiqatdan ham <span className="font-bold text-slate-900">"{courseName}"</span> kursini tizimdan butunlay o'chirib yubormoqchimisiz?
          </p>
          <div className="mt-4 p-3 bg-rose-50/50 rounded-xl border border-rose-100/50">
            <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">Diqqat: Kursga tegishli barcha ma'lumotlar o'chib ketadi!</p>
          </div>
        </div>

        <div className="p-8 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-slate-50 text-slate-600 py-3.5 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all active:scale-95 disabled:opacity-50"
          >
            Bekor qilish
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-rose-600 text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-rose-700 transition-all shadow-xl shadow-rose-100 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 group"
          >
            {loading ? 'O\'chirilmoqda...' : (
              <>
                <Trash2 size={18} className="transition-transform group-hover:scale-110" />
                O'chirish
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
