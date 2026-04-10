'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Settings, 
  LogOut,
  ChevronRight,
  Bell,
  X
} from 'lucide-react';
import authService from '@/services/auth.service';

export default function AdminSidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const [user, setUser] = React.useState(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setUser(authService.getCurrentUser());
    setMounted(true);
  }, []);

  const role = user?.role;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    ...(role === 'super_admin' || role === 'admin' || role === 'teacher' ? [
      { id: 'users', label: 'Foydalanuvchilar', icon: Users, path: '/admin/users' }
    ] : []),
    { id: 'courses', label: 'Kurslar', icon: GraduationCap, path: '/admin/courses' },
    { id: 'profile', label: 'Profil', icon: Settings, path: '/admin/profile' },
  ];

  if (!mounted) return null;

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-slate-200 z-50 flex flex-col transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-20 flex items-center justify-between px-8 border-b border-slate-100">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white mr-3 shadow-lg shadow-indigo-100">
              <GraduationCap size={20} />
            </div>
            <span className="text-xl font-bold text-slate-900">Mentor<span className="text-indigo-600">Pro</span></span>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-bold">
              {user?.firstName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-0.5">
                {user?.role?.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>

        <nav className="py-8 px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.id}
                href={item.path}
                onClick={onClose}
                className={`
                  flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} className={isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'} />
                  <span className="font-semibold">{item.label}</span>
                </div>
                {isActive && <ChevronRight size={16} />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions Section */}
        <div className="mt-auto p-4 border-t border-slate-100">
          <button
            onClick={() => {
              authService.logout();
              window.location.href = '/login';
            }}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 font-semibold group"
          >
            <LogOut size={20} className="text-slate-400 group-hover:text-red-500" />
            <span>Chiqish</span>
          </button>
        </div>
      </aside>
    </>
  );
}
