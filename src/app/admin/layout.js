'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import authService from '@/services/auth.service';
import { SocketProvider } from '@/context/SocketContext';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user || (user.role !== 'super_admin' && user.role !== 'admin' && user.role !== 'teacher' && user.role !== 'mentor')) {
      router.push('/login');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) return null;

  return (
    <SocketProvider>
      <div className="min-h-screen bg-slate-50">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:pl-72' : 'lg:pl-72'}`}>
          <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
          <main className="p-4 sm:p-8 max-w-7xl mx-auto">
            {children}
          </main>
        </div>
      </div>
    </SocketProvider>
  );
}
