'use client';

import React from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import { 
  Trophy, 
  BookOpen, 
  CheckCircle, 
  Star,
  TrendingUp,
  ArrowRight,
  User,
  GraduationCap
} from 'lucide-react';
import Link from 'next/link';
import authService from '@/services/auth.service';

export default function StudentDashboard() {
  const { stats, courseStats, loading, error } = useDashboard();
  const user = authService.getCurrentUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-400 font-medium">
        Yuklanmoqda...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 text-red-600 rounded-3xl border border-red-100 flex items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-500 shadow-sm">
          <TrendingUp size={24} />
        </div>
        <div>
          <h3 className="font-bold">Xatolik yuz berdi</h3>
          <p className="text-sm opacity-80">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Section */}
      <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 blur-3xl transition-transform duration-700 group-hover:scale-110" />
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            Salom, {user?.firstName}! 👋
          </h1>
          <p className="text-slate-500 font-medium max-w-lg leading-relaxed">
            Bugun nimani o'rganamiz? Bilim olishda davom eting va o'z maqsadlaringiz sari intiling.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <BookOpen size={24} />
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Faol kurslar</p>
          <h3 className="text-2xl font-black text-slate-900">{stats?.activeCourses || 0}</h3>
        </div>
        
        <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
            <CheckCircle size={24} />
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Topshirilgan vazifalar</p>
          <h3 className="text-2xl font-black text-slate-900">{stats?.totalSubmissions || 0}</h3>
        </div>

        <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4">
            <Star size={24} />
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">O'rtacha baho</p>
          <h3 className="text-2xl font-black text-slate-900">{stats?.averageGrade || 0} <span className="text-sm font-bold text-slate-400">/ 10</span></h3>
        </div>

        <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-4">
            <Trophy size={24} />
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Jami baholangan</p>
          <h3 className="text-2xl font-black text-slate-900">{stats?.gradedSubmissions || 0}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rankings/Leaderboard Placeholder Based on Actual Data */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Kurslardagi natijalaringiz</h2>
            <Link href="/dashboard/courses" className="text-indigo-600 text-sm font-bold hover:underline flex items-center gap-1">
              Barchasi <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-4">
            {courseStats && courseStats.length > 0 ? courseStats.map((cs, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-indigo-100 transition-colors group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <GraduationCap size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{cs.courseName}</h4>
                      <p className="text-xs text-slate-500 font-medium">{cs.totalStudents} ta o'quvchi orasida</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-2 text-indigo-600 mb-1">
                      <Trophy size={16} />
                      <span className="text-lg font-black">{cs.rank}-o'rin</span>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                        <span className="text-xs font-bold text-slate-400">O'rtacha:</span>
                        <span className="text-sm font-black text-slate-700">{cs.avgGrade}</span>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
                <div className="p-12 bg-white rounded-4xl border border-dashed border-slate-200 text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                        <BookOpen size={32} />
                    </div>
                    <div>
                        <p className="font-bold text-slate-500">Hozircha kurslarda ishtirok etmayapsiz</p>
                        <p className="text-sm text-slate-400">Kurslarga qo'shilish uchun admin bilan bog'laning</p>
                    </div>
                </div>
            )}
          </div>
        </div>

        {/* Quick Profile Edit Card */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm text-center">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
               <User size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">{user?.firstName} {user?.lastName}</h3>
            <p className="text-sm text-slate-400 font-medium mb-6">{user?.email}</p>
            <Link 
              href="/dashboard/profile"
              className="block w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-[0.98] shadow-lg shadow-slate-100"
            >
              Profilga o'tish
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
