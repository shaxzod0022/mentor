'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import authService from '@/services/auth.service';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    oldPassword: '',
    newPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setFormData(prev => ({
        ...prev,
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
      }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await authService.updateProfile(user._id, formData);
      setMessage({ type: 'success', text: response.message || 'Ma\'lumotlar muvaffaqiyatli yangilandi!' });
      // Reset password fields
      setFormData(prev => ({ ...prev, oldPassword: '', newPassword: '' }));
      // Force update user state to refresh header
      const updatedUser = authService.getCurrentUser();
      setUser(updatedUser);
      // Optional: reload to sync all components if needed
      // window.location.reload();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Xatolik yuz berdi' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-8 text-slate-400">Yuklanmoqda...</div>;
  const isMentor = user?.role === 'mentor';
  const isTeacher = user?.role === 'teacher';
  const isAdmin = user?.role === 'admin';
  const isRestricted = isMentor || isTeacher || isAdmin;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profil sozlamalari</h1>
        <p className="text-slate-500 text-sm">Shaxsiy ma'lumotlaringizni shu yerdan boshqarishingiz mumkin</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Card: Avatar/Summary */}
        <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm h-fit">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm mb-4">
              <User size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">{user.firstName} {user.lastName}</h3>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-1 bg-indigo-50 px-3 py-1 rounded-full">
              {user.role?.replace('_', ' ')}
            </p>
            <div className="w-full h-px bg-slate-50 my-6" />
            <p className="text-sm text-slate-400 leading-relaxed italic">
              {isRestricted ? "Siz o'quv jarayonlarini nazorat qilishingiz mumkin." : "Platforma ma'muri sifatida siz barcha jarayonlarni nazorat qilish huquqiga egasiz."}
            </p>
          </div>
        </div>

        {/* Right Card: Form */}
        <div className="md:col-span-2 bg-white p-8 rounded-4xl border border-slate-100 shadow-sm">
          {message.text && (
            <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 animate-in zoom-in duration-300 ${
              message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
            }`}>
              {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span className="text-sm font-medium">{message.text}</span>
            </div>
          )}

          {isRestricted && (
            <div className="mb-6 p-4 bg-amber-50 text-amber-700 border border-amber-100 rounded-2xl flex items-center gap-3 text-xs font-bold">
               <AlertCircle size={16} /> Ism, familiya va emailni o'zgartirish uchun super adminga murojaat qiling
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Ism</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    disabled={isRestricted}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-500 transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Familya</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    disabled={isRestricted}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-500 transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email manzili</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  disabled={isRestricted}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-500 transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-50">
              <p className="text-sm font-bold text-slate-900 mb-4">Parolni o'zgartirish (ixtiyoriy)</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Eski parol</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-500 transition-all duration-300 text-sm"
                      value={formData.oldPassword}
                      onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Yangi parol</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-500 transition-all duration-300 text-sm"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 hover:shadow-2xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed group w-full md:w-auto"
              >
                {loading ? 'Saqlanmoqda...' : (
                  <>
                    <Save size={18} />
                    Ma'lumotlarni saqlash
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
