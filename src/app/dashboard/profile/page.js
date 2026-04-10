'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Save, 
  Loader2, 
  CheckCircle,
  AlertCircle 
} from 'lucide-react';
import authService from '@/services/auth.service';

export default function StudentProfile() {
  const user = authService.getCurrentUser();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setStatus({ type: 'error', message: 'Parollar mos kelmadi!' });
      return;
    }

    try {
      setLoading(true);
      setStatus({ type: '', message: '' });
      
      await authService.updateProfile(user._id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        newPassword: formData.newPassword
      });

      setStatus({ type: 'success', message: 'Ma\'lumotlar muvaffaqiyatli yangilandi' });
      setFormData(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Xatolik yuz berdi' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profil sozlamalari</h1>
        <p className="text-slate-500 text-sm">Shaxsiy ma'lumotlaringizni ko'rish va parolni yangilash</p>
      </div>

      <div className="bg-white rounded-4xl border border-slate-100 shadow-sm overflow-hidden text-center p-8 mb-6">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
             <User size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-1">{user?.firstName} {user?.lastName}</h3>
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full w-fit mx-auto">
            {user?.role}
          </p>
      </div>

      <div className="bg-white rounded-4xl border border-slate-100 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
          {status.message && (
            <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border animate-in slide-in-from-top-2
              ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}
            >
              {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              {status.message}
            </div>
          )}

          <div className="p-4 bg-amber-50 text-amber-700 border border-amber-100 rounded-2xl flex items-center gap-3 text-xs font-bold mb-6">
             <AlertCircle size={16} /> Ism, familiya va emailni o'zgartirish uchun adminga murojaat qiling
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 ml-1">Ism</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text"
                  required
                  disabled
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all opacity-50 cursor-not-allowed"
                  value={formData.firstName}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 ml-1">Familiya</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text"
                  required
                  disabled
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all opacity-50 cursor-not-allowed"
                  value={formData.lastName}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 ml-1">Email manzilingiz</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <Mail size={18} />
              </div>
              <input 
                type="email"
                required
                disabled
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all opacity-50 cursor-not-allowed"
                value={formData.email}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Parolni yangilash</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 ml-1">Yangi parol</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input 
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500 transition-all"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 ml-1">Parolni tasdiqlang</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input 
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500 transition-all"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">Parolni o'zgartirishni hohlamasangiz, bo'sh qoldiring</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-12 py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-indigo-100"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Saqlash</>}
          </button>
        </form>
      </div>
    </div>
  );
}
