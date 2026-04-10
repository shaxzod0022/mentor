"use client";

import React from "react";
import AddUserModal from "@/components/admin/AddUserModal";
import EditUserModal from "@/components/admin/EditUserModal";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import {
  Search,
  UserPlus,
  Filter,
  CheckCircle2,
  XCircle,
  Shield,
  GraduationCap,
  User as UserIcon,
  AlertCircle,
  Edit,
  Trash2,
} from "lucide-react";
import { useUsers } from "@/hooks/useUsers";

const tabs = [
  { id: "all", label: "Hamma" },
  { id: "teacher", label: "Ustozlar" },
  { id: "mentor", label: "Mentorlar" },
  { id: "student", label: "O'quvchilar" },
];

const roleIcons = {
  super_admin: { icon: Shield, color: "text-rose-600", bg: "bg-rose-50" },
  admin: { icon: Shield, color: "text-blue-600", bg: "bg-blue-50" },
  teacher: {
    icon: GraduationCap,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  mentor: { icon: UserIcon, color: "text-emerald-600", bg: "bg-emerald-50" },
  student: { icon: UserIcon, color: "text-slate-600", bg: "bg-slate-50" },
};

export default function UsersPage() {
  const {
    users,
    activeTab,
    searchQuery,
    setSearchQuery,
    loading,
    page,
    setPage,
    totalPages,
    totalUsers,
    isAddModalOpen,
    setIsAddModalOpen,
    editingUser,
    setEditingUser,
    deletingUser,
    setDeletingUser,
    actionLoading,
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage,
    currentUser,
    handleTabChange,
    handleDelete,
    refreshUsers
  } = useUsers();

  const userTabs = [
    { id: "all", label: "Hamma" },
    ...(currentUser?.role === 'super_admin' || currentUser?.role === 'admin' 
      ? [{ id: "admin", label: "Adminlar" }] 
      : []),
    { id: "teacher", label: "Ustozlar" },
    { id: "mentor", label: "Mentorlar" },
    { id: "student", label: "O'quvchilar" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Foydalanuvchilarni boshqarish
          </h1>
          <p className="text-slate-500 text-sm">
            Platformadagi barcha foydalanuvchilar ro'yxati va ularning rollari
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 group"
        >
          <UserPlus
            size={18}
            className="group-hover:rotate-12 transition-transform"
          />
          Foydalanuvchi qo'shish
        </button>
      </div>

      {(successMessage || errorMessage) && (
        <div
          className={`p-4 border rounded-2xl flex items-center justify-between gap-3 text-sm font-medium animate-in slide-in-from-top-4 ${
            successMessage
              ? "bg-emerald-50 border-emerald-100 text-emerald-700"
              : "bg-rose-50 border-rose-100 text-rose-700"
          }`}
        >
          <div className="flex items-center gap-3">
            {successMessage ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            {successMessage || errorMessage}
          </div>
          <button
            onClick={() => {
              setSuccessMessage("");
              setErrorMessage("");
            }}
            className="p-1 rounded-lg transition-colors hover:bg-black/5"
          >
            <XCircle size={18} />
          </button>
        </div>
      )}

      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar">
          {userTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-indigo-600 transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="FISH yoki email orqali qidirish..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-500 transition-all duration-300 text-sm font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-4xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                <th className="px-8 py-5">Foydalanuvchi</th>
                <th className="px-8 py-5">Email</th>
                <th className="px-8 py-5">Ro'yxatdan o'tgan sana</th>
                <th className="px-8 py-5 text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="py-20 text-center text-slate-400 font-medium"
                  >
                    Yuklanmoqda...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="py-20 text-center text-slate-400 font-medium"
                  >
                    Topilmadi
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const roleData = roleIcons[user.role] || roleIcons.student;
                  const Icon = roleData.icon;
                  const isSelf = currentUser?._id === user._id;

                  return (
                    <tr
                      key={user._id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm ${roleData.bg} ${roleData.color} border border-white shadow-sm`}
                          >
                            {user.firstName[0]}
                            {user.lastName[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {user.firstName} {user.lastName}
                            </p>
                            <div
                              className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${roleData.bg} ${roleData.color}`}
                            >
                              <Icon size={10} />
                              {user.role?.replace("_", " ")}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm text-slate-600">
                        {user.email}
                      </td>
                      <td className="px-8 py-5 text-sm text-slate-500 font-medium">
                        {new Date(user.createdAt).toLocaleString("uz-UZ", {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!isSelf && (
                            <>
                              <button
                                onClick={() => setEditingUser(user)}
                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-indigo-100 hover:shadow-sm rounded-xl transition-all"
                                title="Tahrirlash"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => setDeletingUser(user)}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white border border-transparent hover:border-rose-100 hover:shadow-sm rounded-xl transition-all"
                                title="O'chirish"
                              >
                                <Trash2 size={18} />
                              </button>
                            </>
                          )}
                          {isSelf && (
                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mr-4">
                              O'zingiz
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {!loading && totalPages > 0 && (
          <div className="px-8 py-5 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Jami: <span className="text-slate-900 ml-1">{totalUsers} ta foydalanuvchi</span>
            </p>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
              >
                <Filter className="rotate-90" size={18} />
              </button>
              
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                      page === i + 1
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                        : 'text-slate-400 hover:text-slate-900 hover:bg-white hover:border-slate-200 border border-transparent'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
              >
                <Filter className="-rotate-90" size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={(msg) => {
          setSuccessMessage(msg);
          refreshUsers();
        }}
      />

      {editingUser && (
        <EditUserModal
          isOpen={!!editingUser}
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSuccess={(msg) => {
            setSuccessMessage(msg);
            refreshUsers();
          }}
        />
      )}

      {deletingUser && (
        <DeleteConfirmModal
          isOpen={!!deletingUser}
          userName={`${deletingUser.firstName} ${deletingUser.lastName}`}
          loading={actionLoading}
          onClose={() => setDeletingUser(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
