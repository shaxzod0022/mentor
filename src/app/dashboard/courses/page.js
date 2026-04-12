"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Search,
  ArrowRight,
  User,
  Clock,
  LayoutGrid,
  List,
} from "lucide-react";
import Link from "next/link";
import courseService from "@/services/course.service";

export default function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await courseService.getAllCourses();
        setCourses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-400 font-medium">
        Yuklanmoqda...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Mening kurslarim
          </h1>
          <p className="text-slate-500 text-sm">
            Siz ishtirok etayotgan barcha o'quv kurslari
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Kursni qidirish..."
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-full md:w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex bg-white border border-slate-200 rounded-xl p-1 shrink-0">
            <button
              onClick={() => setView("grid")}
              className={`p-1.5 rounded-lg transition-colors ${view === "grid" ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:text-slate-600"}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-1.5 rounded-lg transition-colors ${view === "list" ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:text-slate-600"}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="p-20 bg-white rounded-4xl border border-dashed border-slate-200 text-center space-y-4">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto text-slate-300">
            <BookOpen size={40} />
          </div>
          <div className="max-w-xs mx-auto">
            <h3 className="text-lg font-bold text-slate-900">
              Kurslar topilmadi
            </h3>
            <p className="text-sm text-slate-500">
              Siz hozircha hech qanday kursga biriktirilmagansiz yoki qidiruv
              natijasi yo'q.
            </p>
          </div>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Link
              key={course._id}
              href={`/dashboard/courses/${course._id}`}
              className="bg-white rounded-4xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={
                    course.image
                      ? `http://localhost:8080${course.image}`
                      : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"
                  }
                  alt={course.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent flex items-end p-6">
                  <div className="w-full flex items-center justify-between text-white">
                    <span className="text-xs font-bold uppercase tracking-widest bg-indigo-500/50 backdrop-blur-md px-3 py-1 rounded-full">
                      Kurs
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                      <Clock size={12} />
                      12-hafta
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {course.name}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-6 leading-relaxed">
                  {course.description ||
                    "Ushbu kurs haqida hozircha qo'shimcha ma'lumot yo'q."}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-3">
                    {(course.students?.slice(0, 3) || []).map((_, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600"
                      >
                        <User size={14} />
                      </div>
                    ))}
                    {course.students?.length > 3 && (
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-50 flex items-center justify-center text-[10px] font-black text-indigo-600">
                        +{course.students.length - 3}
                      </div>
                    )}
                    {(course.students?.length || 0) === 0 && (
                      <p className="text-xs font-bold text-slate-400">
                        Hozircha o'quvchilar yo'q
                      </p>
                    )}
                  </div>
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map((course) => (
            <Link
              key={course._id}
              href={`/dashboard/courses/${course._id}`}
              className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6 hover:shadow-md transition-shadow group"
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                <img
                  src={
                    course.image
                      ? `http://localhost:8080${course.image}`
                      : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"
                  }
                  alt={course.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                  {course.name}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-1 truncate max-w-md">
                  {course.description}
                </p>
              </div>
              <div className="hidden md:flex items-center gap-12 px-8">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Davomiylik
                  </p>
                  <p className="text-sm font-bold text-slate-700">
                    12 Haftalik
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    O'quvchilar
                  </p>
                  <p className="text-sm font-bold text-slate-700">
                    {course.students?.length || 0} ta o'quvchi
                  </p>
                </div>
              </div>
              <div className="p-3 text-slate-300 group-hover:text-indigo-600 transition-colors">
                <ArrowRight size={24} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
