'use client';

import React, { useState, useEffect } from 'react';
import { X, User, Mail, Lock, Shield, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '@/services/api';
import authService from '@/services/auth.service';

const ROLES = {
  OWNER: 'owner',
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  TEACHER: 'teacher',
  MENTOR: 'mentor',
  STUDENT: 'student',
};

export default function EditUserModal({ isOpen, onClose, onSuccess, user }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    oldPassword: '', // Not used for direct admin edit but keeping for consistency if needed
    newPassword: '',
    role: ROLES.STUDENT,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableRoles, setAvailableRoles] = useState([]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        oldPassword: '',
        newPassword: '',
        role: user.role || ROLES.STUDENT,
      });
    }

    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      if (currentUser.role === ROLES.OWNER) {
        setAvailableRoles([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER, ROLES.MENTOR, ROLES.STUDENT]);
      } else if (currentUser.role === ROLES.SUPER_ADMIN) {
        setAvailableRoles([ROLES.ADMIN, ROLES.TEACHER, ROLES.MENTOR, ROLES.STUDENT]);
      } else if (currentUser.role === ROLES.ADMIN) {
        setAvailableRoles([ROLES.TEACHER, ROLES.MENTOR, ROLES.STUDENT]);
      } else if (currentUser.role === ROLES.TEACHER) {
        setAvailableRoles([ROLES.MENTOR, ROLES.STUDENT]);
      }
    }
  }, [isOpen, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = { ...formData };
      if (!payload.newPassword) delete payload.newPassword;
      if (!payload.oldPassword) delete payload.oldPassword;

      const response = await api.put(`/users/${user._id}`, payload);
      onSuccess(response.data.message);
      onClose();
    } catch (err) {
      setError(err.message || 'Foydalanuvchi ma\'lumotlarini yangilashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-xl rounded-4xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 pb-4 flex items-center justify-between border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Ma'lumotlarni tahrirlash</h2>
              <p className="text-slate-400 text-xs font-medium">{user.firstName} {user.lastName} profilini yangilash</p>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Ism</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500 transition-all text-sm font-medium"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Familya</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500 transition-all text-sm font-medium"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email manzili</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                <Mail size={16} />
              </div>
              <input
                type="email"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500 transition-all text-sm font-medium"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Yangi parol (ixtiyoriy)</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                <Lock size={16} />
              </div>
              <input
                type="password"
                placeholder="O'zgartirish uchun kiriting"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500 transition-all text-sm font-medium"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Foydalanuvchi roli</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {availableRoles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setFormData({ ...formData, role })}
                  className={`py-2.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${
                    formData.role === role 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                      : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-300'
                  }`}
                >
                  {role.replace('_', ' ')}
                </button>
              ))}
            </div>
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
              className="flex-2 bg-indigo-600 text-white py-3.5 px-8 rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
            >
              {loading ? 'Saqlanmoqda...' : (
                <>
                  <Save size={18} className="group-hover:rotate-12 transition-transform" />
                  Yangilash
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
