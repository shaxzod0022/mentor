"use client";

import React from "react";
import {
  Users,
  GraduationCap,
  UserCheck,
  ShieldCheck,
  TrendingUp,
  BookOpen,
  FileText,
  Activity,
  LogIn,
  PlusCircle,
  Pencil,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { useDashboard } from "@/hooks/useDashboard";
import authService from "@/services/auth.service";

export default function AdminDashboard() {
  const { stats, recentUsers, recentActivity, loading, error } = useDashboard();
  const user = authService.getCurrentUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-400 font-medium">
        Yuklanmoqda...
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      label: "O'quvchilar",
      value: stats?.student,
      icon: UserCheck,
      color: "blue",
    },
    {
      label: "Ustozlar",
      value: stats?.teacher,
      icon: GraduationCap,
      color: "violet",
    },
    {
      label: "Kurslar",
      value: stats?.courses,
      icon: BookOpen,
      color: "emerald",
    },
    {
      label: "Materiallar",
      value: stats?.materials,
      icon: FileText,
      color: "amber",
    },
    ...(user?.role === "owner" || user?.role === "super_admin" || user?.role === "admin"
      ? [
          {
            label: (user?.role === "owner" || user?.role === "super_admin") ? "Boshqaruvchilar" : "Moderatorlar",
            value: stats ? (stats.admin || 0) + (stats.super_admin || 0) + (stats.owner || 0) : 0,
            icon: ShieldCheck,
            color: "rose",
          },
        ]
      : []),
    {
      label: "Jami foydalanuvchilar",
      value: stats?.total,
      icon: Users,
      color: "indigo",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm">
          Platformaning umumiy ko'rsatkichlari
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          const colors = {
            indigo: "bg-indigo-50 text-indigo-600",
            blue: "bg-blue-50 text-blue-600",
            emerald: "bg-emerald-50 text-emerald-600",
            violet: "bg-violet-50 text-violet-600",
            rose: "bg-rose-50 text-rose-600",
            amber: "bg-amber-50 text-amber-600",
          };

          return (
            <div
              key={i}
              className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${colors[card.color]}`}
              >
                <Icon size={24} />
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                {card.label}
              </p>
              <h3 className="text-2xl font-extrabold text-slate-900">
                {card.value || 0}
              </h3>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity (Last 2 Days) */}
        <div className="lg:col-span-2 bg-white rounded-4xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <Activity size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Oxirgi amallar</h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  Oxirgi 48 soat ichida
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[400px]">
            {recentActivity.length === 0 ? (
              <div className="p-12 text-center space-y-3 opacity-40">
                <Activity size={40} className="mx-auto text-slate-300" />
                <p className="text-sm font-bold text-slate-500 text-center">
                  Hozircha amallar mavjud emas
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {recentActivity.map((log) => {
                  const getActionIcon = (action) => {
                    if (action.includes("LOGIN"))
                      return {
                        icon: LogIn,
                        color: "text-emerald-500",
                        bg: "bg-emerald-50",
                      };
                    if (action.includes("CREATE"))
                      return {
                        icon: PlusCircle,
                        color: "text-indigo-500",
                        bg: "bg-indigo-50",
                      };
                    if (action.includes("UPDATE"))
                      return {
                        icon: Pencil,
                        color: "text-amber-500",
                        bg: "bg-amber-50",
                      };
                    if (action.includes("DELETE"))
                      return {
                        icon: Trash,
                        color: "text-rose-500",
                        bg: "bg-rose-50",
                      };
                    return {
                      icon: Activity,
                      color: "text-slate-500",
                      bg: "bg-slate-50",
                    };
                  };
                  const {
                    icon: ActionIcon,
                    color,
                    bg,
                  } = getActionIcon(log.action);

                  return (
                    <div
                      key={log._id}
                      className="p-4 hover:bg-slate-50/50 transition-colors flex items-start gap-4"
                    >
                      <div
                        className={`shrink-0 w-8 h-8 rounded-lg ${bg} ${color} flex items-center justify-center mt-1`}
                      >
                        <ActionIcon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-4 mb-0.5">
                          <p className="text-sm font-bold text-slate-900 truncate">
                            {log.userId?.firstName} {log.userId?.lastName}
                          </p>
                          <span className="shrink-0 text-[10px] font-bold text-slate-400 capitalize whitespace-nowrap">
                            {new Date(log.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-1">
                          {log.details}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {new Date(log.createdAt).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
