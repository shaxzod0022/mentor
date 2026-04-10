'use client';

import React, { useState, useEffect } from 'react';
import { X, FileText, Play, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import materialService from '@/services/material.service';

export default function AddMaterialModal({ isOpen, onClose, onSuccess, courseId, material }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    videoUrl: '',
    pdf: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (material) {
      setFormData({
        name: material.name,
        description: material.description || '',
        videoUrl: material.videoUrl || '',
        pdf: null,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        videoUrl: '',
        pdf: null,
      });
    }
  }, [material, isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Faqat PDF fayllarni yuklash mumkin!');
        return;
      }
      setFormData({ ...formData, pdf: file });
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (material) {
        await materialService.updateMaterial(material._id, formData);
        onSuccess('Material muvaffaqiyatli yangilandi');
      } else {
        await materialService.createMaterial({ ...formData, courseId });
        onSuccess('Material muvaffaqiyatli qo\'shildi');
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 pb-4 flex items-center justify-between border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{material ? 'Materialni tahrirlash' : 'Yangi material'}</h2>
              <p className="text-slate-400 text-xs font-medium">Barcha maydonlarni to'ldiring</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-700 text-sm font-medium animate-in slide-in-from-top-2">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Material nomi</label>
            <input
              type="text"
              required
              placeholder="Masalan: 1-mavzu bo'yicha qo'llanma"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500 transition-all text-sm font-medium"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Izoh (ixtiyoriy)</label>
            <textarea
              placeholder="Material haqida qisqacha ma'lumot..."
              rows="2"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500 transition-all text-sm font-medium resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">YouTube Video Link (ixtiyoriy)</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                <Play size={16} />
              </div>
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500 transition-all text-sm font-medium"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">PDF Fayl (ixtiyoriy)</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => document.getElementById('pdf-upload').click()}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-dashed transition-all font-bold text-xs ${
                  formData.pdf ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300'
                }`}
              >
                <FileText size={16} />
                {formData.pdf ? formData.pdf.name : (material?.pdfUrl ? 'Fayl yuklangan (almashtirish)' : 'PDF tanlash')}
              </button>
              {formData.pdf && (
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, pdf: null})}
                  className="p-3 text-rose-500 bg-rose-50 rounded-2xl hover:bg-rose-100 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            <input 
              id="pdf-upload"
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-50 text-slate-600 py-3.5 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all active:scale-95"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-2 bg-indigo-600 text-white py-3.5 px-8 rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 group flex items-center justify-center gap-2"
            >
              {loading ? 'Saqlanmoqda...' : (
                <>
                  <CheckCircle2 size={18} className="group-hover:rotate-12 transition-transform" />
                  Saqlash
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
