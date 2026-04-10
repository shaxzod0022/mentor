"use client";

import React, { useEffect, useState } from "react";
import {
  Bell,
  Search,
  Menu,
  User,
  Clock,
  CheckCircle2,
  Trash2,
  ExternalLink,
} from "lucide-react";
import authService from "@/services/auth.service";
import { useSocket } from "@/context/SocketContext";
import Link from "next/link";

export default function AdminHeader({ onMenuClick }) {
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllRead } = useSocket();

  useEffect(() => {
    setUser(authService.getCurrentUser());
    setMounted(true);
  }, []);

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const mins = Math.floor(diff / 1000 / 60);
    if (mins < 60) return `${mins} daqiqa oldin`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} soat oldin`;
    return new Date(date).toLocaleDateString();
  };

  if (!mounted) return null;

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button
          onClick={onMenuClick}
          className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg lg:hidden"
        >
          <Menu size={24} />
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-6">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-lg transition-all ${showNotifications ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"}`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
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
                    onClick={() => {
                      markAllRead();
                    }}
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
                <div className="p-3 bg-slate-50/50 text-center border-t border-slate-50">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Xabarlar tarixi
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block" />

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {user?.role?.replace("_", " ")}
            </p>
          </div>
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
