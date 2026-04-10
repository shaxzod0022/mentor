"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import RoleSelector from "@/components/login/RoleSelector";
import LoginForm from "@/components/login/LoginForm";
import authService from "@/services/auth.service";

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError("");
    try {
      const data = await authService.login(
        credentials.email,
        credentials.password,
      );

      const actualRole = data.user.role;
      const isAdminRole = actualRole === "super_admin" || actualRole === "admin";

      // Logic:
      // 1. Admin/Super Admin can log in via any portal (including none)
      // 2. Teacher, Mentor, Student MUST select their specific role correctly

      if (!isAdminRole) {
        if (!selectedRole) {
          throw new Error("Iltimos, kirish uchun o'zingizga tegishli rolni tanlang (Ustoz, Mentor yoki O'quvchi).");
        }
        if (selectedRole !== actualRole) {
          const roleLabel = actualRole === 'teacher' ? 'Ustoz' : actualRole === 'mentor' ? 'Mentor' : 'O\'quvchi';
          throw new Error(`Sizning rolingiz ${roleLabel}. Iltimos, ${roleLabel} tugmasini tanlang.`);
        }
      }

      // Smart redirection
      if (isAdminRole || actualRole === "teacher" || actualRole === "mentor") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Kirishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden bg-slate-50">
      {/* Dynamic Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-200/40 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/40 blur-[120px]" />

      <div className="w-full max-w-4xl relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Xush kelibsiz
          </h1>
          <p className="text-slate-500 text-lg max-w-md mx-auto">
            Mentorlik platformasiga kirish uchun rolingizni tanlang va
            ma'lumotlarni kiriting
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle Inner Glow */}
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-indigo-100 to-transparent" />

          <div className="relative z-10">
            <RoleSelector
              selectedRole={selectedRole}
              onSelect={setSelectedRole}
            />

            <div className="max-width-md mx-auto mt-12 min-h-[400px]">
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {!selectedRole && (
                  <div className="mb-8 text-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Administratorlar kirishi</p>
                  </div>
                )}
                
                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium animate-shake">
                    {error}
                  </div>
                )}

                <LoginForm
                  role={selectedRole || 'admin'}
                  onSubmit={handleLogin}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-4px);
          }
          75% {
            transform: translateX(4px);
          }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </main>
  );
}
