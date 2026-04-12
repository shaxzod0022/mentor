"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  BookOpen,
  ImageIcon,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import courseService from "@/services/course.service";

export default function EditCourseModal({
  isOpen,
  course,
  onClose,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (course) {
      setFormData({
        name: course.name,
        description: course.description || "",
        image: null,
      });
      setPreviewUrl(
        process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL.replace("/api", "")}${course.image}`
          : `https://mentor-back-production.up.railway.app${course.image}`,
      );
    }
  }, [course, isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await courseService.updateCourse(course._id, formData);
      onSuccess(response.message);
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Kursni yangilashda xatolik yuz berdi",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 pb-4 flex items-center justify-between border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Kursni tahrirlash
              </h2>
              <p className="text-slate-400 text-xs font-medium">
                Ma'lumotlarni o'zgartiring
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-700 text-sm font-medium animate-in slide-in-from-top-2">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
              Kurs nomi
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                <BookOpen size={16} />
              </div>
              <input
                type="text"
                required
                placeholder="Masalan: Matematika"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500 transition-all text-sm font-medium"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
              Tavsif (ixtiyoriy)
            </label>
            <textarea
              placeholder="Kurs haqida qisqacha ma'lumot..."
              rows="3"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500 transition-all text-sm font-medium resize-none"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
              Kurs rasmi
            </label>
            <div className="flex items-center gap-4">
              <div className="relative w-32 h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl overflow-hidden flex items-center justify-center group shrink-0">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon
                    size={32}
                    className="text-slate-300 group-hover:text-indigo-400 transition-colors"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <div className="text-xs text-slate-500">
                <p className="font-bold text-slate-700 mb-1">
                  Rasmni o'zgartirish
                </p>
                <p>
                  Yangi rasm tanlash uchun bosing yoki eski rasm qolishi uchun
                  tegmang.
                </p>
                <button
                  type="button"
                  className="mt-2 text-indigo-600 font-bold hover:underline"
                  onClick={() =>
                    document.querySelector('input[type="file"]').click()
                  }
                >
                  Rasm tanlash
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-50 text-slate-600 py-3.5 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all active:scale-95"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-2 bg-indigo-600 text-white py-3.5 px-8 rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
            >
              {loading ? (
                "Saqlanmoqda..."
              ) : (
                <>
                  <CheckCircle2
                    size={18}
                    className="group-hover:rotate-12 transition-transform"
                  />
                  Saqlash
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
