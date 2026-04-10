"use client";

import React from "react";
import { GraduationCap, Users, User } from "lucide-react";

const roles = [
  {
    id: "teacher",
    label: "Ustoz",
    icon: GraduationCap,
    color: "rgb(20, 184, 166)",
  },
  { id: "mentor", label: "Mentor", icon: Users, color: "rgb(16, 185, 129)" },
  { id: "student", label: "O'quvchi", icon: User, color: "rgb(107, 114, 128)" },
];

export default function RoleSelector({ selectedRole, onSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {roles.map((role) => {
        const Icon = role.icon;
        const isActive = selectedRole === role.id;

        return (
          <button
            key={role.id}
            onClick={() => onSelect(role.id)}
            className={`
              relative flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 group
              ${
                isActive
                  ? "bg-white border-2 shadow-xl shadow-slate-200"
                  : "bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-lg hover:shadow-slate-100"
              }
            `}
            style={{
              borderColor: isActive ? role.color : "transparent",
            }}
          >
            <div
              className={`p-3 rounded-xl transition-all duration-300 mb-2 
                ${isActive ? "scale-110 shadow-md" : "scale-100"}`}
              style={{
                backgroundColor: isActive ? role.color : "#fff",
                color: isActive ? "white" : "rgba(15, 23, 42, 0.4)",
                boxShadow: isActive ? `0 4px 12px ${role.color}40` : "none",
              }}
            >
              <Icon size={24} />
            </div>
            <span
              className={`text-xs font-bold transition-all duration-300 ${isActive ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"}`}
            >
              {role.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
