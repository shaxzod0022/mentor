"use client";

import React from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { useCourses } from "@/hooks/useCourses";
import AddCourseModal from "@/components/admin/courses/AddCourseModal";
import EditCourseModal from "@/components/admin/courses/EditCourseModal";
import DeleteCourseModal from "@/components/admin/courses/DeleteCourseModal";
import authService from "@/services/auth.service";

export default function CoursesPage() {
  const {
    courses,
    loading,
    isAddModalOpen,
    setIsAddModalOpen,
    editingCourse,
    setEditingCourse,
    deletingCourse,
    setDeletingCourse,
    actionLoading,
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage,
    handleDelete,
    refreshCourses,
  } = useCourses();

  const user = authService.getCurrentUser();
  const isTeacher = user?.role === "teacher";
  const isMentor = user?.role === "mentor";

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace("/api", "")
    : "https://mentor-back-production.up.railway.app";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Kurslarni boshqarish
          </h1>
          <p className="text-slate-500 text-sm">
            {isMentor
              ? "Sizga biriktirilgan kurslar ro'yxati"
              : "Platformadagi barcha kurslar ro'yxati va ularni boshqarish"}
          </p>
        </div>
        {!isTeacher && !isMentor && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 group"
          >
            <Plus
              size={18}
              className="group-hover:rotate-90 transition-transform"
            />
            Yangi kurs qo'shish
          </button>
        )}
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

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-slate-100 p-4 space-y-4 animate-pulse"
            >
              <div className="aspect-video bg-slate-100 rounded-3xl" />
              <div className="space-y-2">
                <div className="h-4 bg-slate-100 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-20 text-center space-y-4">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mx-auto">
            <BookOpen size={40} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Kurslar mavjud emas
            </h3>
            <p className="text-slate-500">
              Hozircha hech qanday kurs qo'shilmagan.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-3xl border border-slate-100 p-4 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group border-b-4 border-b-transparent hover:border-b-indigo-500"
            >
              <div className="relative aspect-video rounded-3xl overflow-hidden mb-4">
                <img
                  src={`${API_BASE_URL}${course.image}`}
                  alt={course.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/admin/courses/${course._id}`}
                    className="p-2 bg-white shadow-lg rounded-xl text-slate-600 hover:text-indigo-600 transition-colors"
                    title="Boshqarish"
                  >
                    <BookOpen size={16} />
                  </Link>
                  {!isTeacher && !isMentor && (
                    <>
                      <button
                        onClick={() => setEditingCourse(course)}
                        className="p-2 bg-white shadow-lg rounded-xl text-slate-600 hover:text-indigo-600 transition-colors"
                        title="Tahrirlash"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setDeletingCourse(course)}
                        className="p-2 bg-white shadow-lg rounded-xl text-slate-600 hover:text-rose-600 transition-colors"
                        title="O'chirish"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="px-2">
                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                  {course.name}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-3">
                  {course.description || "Tavsif berilmagan."}
                </p>
                <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest gap-2"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddCourseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={(msg) => {
          setSuccessMessage(msg);
          refreshCourses();
        }}
      />

      {editingCourse && (
        <EditCourseModal
          isOpen={!!editingCourse}
          course={editingCourse}
          onClose={() => setEditingCourse(null)}
          onSuccess={(msg) => {
            setSuccessMessage(msg);
            refreshCourses();
          }}
        />
      )}

      <DeleteCourseModal
        isOpen={!!deletingCourse}
        courseName={deletingCourse?.name}
        loading={actionLoading}
        onClose={() => setDeletingCourse(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
