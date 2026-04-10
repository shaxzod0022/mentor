'use client';

import React, { useState } from 'react';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

export default function LoginForm({ role, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getRoleColor = () => {
    const colors = {
      super_admin: 'rgb(139, 92, 246)',
      admin: 'rgb(59, 130, 246)',
      teacher: 'rgb(20, 184, 166)',
      mentor: 'rgb(16, 185, 129)',
      student: 'rgb(107, 114, 128)',
    };
    return colors[role] || 'rgb(59, 130, 246)';
  };

  const accentColor = getRoleColor();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-500 ml-1">Email manzilingiz</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-indigo-500 transition-colors">
            <Mail size={20} />
          </div>
          <input
            type="email"
            required
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:bg-white transition-all duration-300"
            style={{ '--tw-ring-color': accentColor }}
            placeholder="example@mail.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-500 ml-1">Parol</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-indigo-500 transition-colors">
            <Lock size={20} />
          </div>
          <input
            type="password"
            required
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:bg-white transition-all duration-300"
            style={{ '--tw-ring-color': accentColor }}
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full relative py-4 rounded-xl text-white font-bold overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group shadow-lg"
        style={{ 
          backgroundColor: accentColor,
          boxShadow: `0 10px 25px -5px ${accentColor}60`
        }}
      >
        <div className="relative flex items-center justify-center gap-2">
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              Kirish
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </div>
      </button>
    </form>
  );
}
