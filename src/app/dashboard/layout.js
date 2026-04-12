"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import authService from "@/services/auth.service";
import {
  LayoutDashboard,
  BookOpen,
  LogOut,
  GraduationCap,
  Bell,
  Clock,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { SocketProvider, useSocket } from "@/context/SocketContext";

function DashboardHeader({ user }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllRead } = useSocket();

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const mins = Math.floor(diff / 1000 / 60);
    if (mins < 60) return `${mins} daqiqa oldin`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} soat oldin`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <header className="bg-white border-b border-slate-200 h-20 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
          <GraduationCap size={24} />
        </div>
        <span className="text-xl font-bold text-slate-900 hidden sm:block">
          Mentor<span className="text-indigo-600">Pro</span>
        </span>
      </div>

      <nav className="flex items-center gap-2 sm:gap-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all font-semibold text-sm"
        >
          <LayoutDashboard size={18} />
          <span className="hidden md:block">Bosh sahifa</span>
        </Link>
        <Link
          href="/dashboard/courses"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all font-semibold text-sm"
        >
          <BookOpen size={18} />
          <span className="hidden md:block">Kurslarim</span>
        </Link>
        <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block" />

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-xl transition-all ${showNotifications ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:bg-slate-50 hover:text-indigo-600"}`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            )}
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-slate-100 rounded-3xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                  <h3 className="font-bold text-slate-900">Bildirishnomalar</h3>
                  <button
                    onClick={() => markAllRead()}
                    className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline"
                  >
                    Hammasini o'qish
                  </button>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-10 text-center text-slate-400">
                      <Bell size={32} className="mx-auto mb-2 opacity-20" />
                      <p className="text-sm">Bildirishnomalar yo'q</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <Link
                        key={n._id}
                        href={n.link || "#"}
                        onClick={() => {
                          markAsRead(n._id);
                          setShowNotifications(false);
                        }}
                        className={`p-4 flex gap-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 ${!n.isRead ? "bg-indigo-50/30" : ""}`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            n.type.includes("SUBMISSION")
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-indigo-50 text-indigo-600"
                          }`}
                        >
                          {n.type.includes("SUBMISSION") ? (
                            <CheckCircle2 size={18} />
                          ) : (
                            <ExternalLink size={18} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm leading-snug ${!n.isRead ? "font-bold text-slate-900" : "text-slate-600"}`}
                          >
                            {n.message}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock size={12} className="text-slate-300" />
                            <span className="text-[10px] text-slate-400 font-medium">
                              {formatTime(n.createdAt)}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 pl-2">
          <Link
            href={"/dashboard/profile"}
            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold border-2 border-white shadow-sm"
          >
            {user.firstName[0]}
          </Link>
          <button
            onClick={() => {
              authService.logout();
              window.location.href = "/login";
            }}
            className="p-2 text-slate-400 hover:text-red-600 transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>
    </header>
  );
}

export default function StudentLayout({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const user = authService.getCurrentUser();

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/login");
    } else {
      setAuthorized(true);
    }
  }, [router, user]);

  if (!authorized) return null;

  return (
    <SocketProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <DashboardHeader user={user} />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </SocketProvider>
  );
}
