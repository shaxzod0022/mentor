"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Play,
  Calendar,
  User,
  CheckCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Video,
  Upload,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import courseService from "@/services/course.service";
import materialService from "@/services/material.service";
import submissionRepository from "@/repositories/submission.repository";
import SubmissionModal from "@/components/admin/SubmissionModal";

export default function StudentCourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [courseData, submissionsData] = await Promise.all([
        courseService.getCourseById(id),
        submissionRepository.getMySubmissions(id),
      ]);
      setCourse(courseData);
      setSubmissions(submissionsData);

      // Fetch materials
      const materialsData = await materialService.getMaterialsByCourse(id);
      setMaterials(materialsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-96 text-slate-400">
        Yuklanmoqda...
      </div>
    );
  if (!course) return <div className="text-center p-20">Kurs topilmadi</div>;

  const getMaterialStatus = (materialId) => {
    const sub = submissions.find(
      (s) => s.material?._id === materialId || s.material === materialId,
    );
    if (!sub) return { label: "Topshirilmagan", color: "slate" };
    if (sub.status === "graded")
      return {
        label: `Baholangan: ${sub.grade}/10`,
        color: "emerald",
        icon: CheckCircle,
      };
    if (sub.status === "reviewed")
      return { label: "Ko'rib chiqilgan", color: "indigo", icon: ShieldCheck };
    return { label: "Topshirilgan", color: "amber", icon: Clock };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Link
        href="/dashboard/courses"
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors group w-fit"
      >
        <ArrowLeft
          size={18}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span className="font-bold text-sm uppercase tracking-widest">
          Kurslarga qaytish
        </span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Materials */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                <BookOpen size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900">
                  {course.name}
                </h1>
                <p className="text-sm text-slate-500">
                  {materials.length} ta o'quv materiali
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {materials.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  Hozircha materiallar yuklanmagan
                </div>
              ) : (
                materials.map((material, i) => {
                  const status = getMaterialStatus(material._id);
                  const StatusIcon = status.icon || TrendingUp;

                  return (
                    <div
                      key={material._id}
                      className="p-6 rounded-3xl border border-slate-50 bg-slate-50/30 hover:bg-white hover:border-indigo-100 transition-all group lg:flex items-center justify-between gap-6"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 shadow-sm transition-colors mt-1">
                          {material.pdfUrl ? (
                            <FileText size={20} />
                          ) : (
                            <Video size={20} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 mb-1">
                            {material.name}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-1 mb-2">
                            {material.description}
                          </p>
                          {material.deadline && (
                            <div
                              className={`flex items-center gap-1.5 text-xs font-bold w-fit px-2 py-1 rounded-md mb-3 ${new Date() > new Date(material.deadline) ? "text-rose-600 bg-rose-50" : "text-amber-600 bg-amber-50"}`}
                            >
                              <Calendar size={12} />
                              Qabul muddati:{" "}
                              {new Date(material.deadline).toLocaleString(
                                "uz-UZ",
                                {
                                  year: "numeric",
                                  month: "numeric",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </div>
                          )}

                          <div className="flex flex-wrap items-center gap-3">
                            {material.pdfUrl && (
                              <a
                                href={`http://localhost:8080${material.pdfUrl}`}
                                target="_blank"
                                className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1"
                              >
                                PDF Yuklab olish <ExternalLink size={10} />
                              </a>
                            )}
                            {material.videoUrl && (
                              <a
                                href={material.videoUrl}
                                target="_blank"
                                className="text-[10px] font-black uppercase text-rose-600 bg-rose-50 px-2 py-1 rounded-md hover:bg-rose-600 hover:text-white transition-all flex items-center gap-1"
                              >
                                Video ko'rish <Play size={10} />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 lg:mt-0 flex items-center gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
                        <div
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold leading-none
                          ${
                            status.color === "emerald"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : status.color === "indigo"
                                ? "bg-indigo-50 text-indigo-600 border-indigo-100"
                                : status.color === "amber"
                                  ? "bg-amber-50 text-amber-600 border-amber-100"
                                  : "bg-slate-100 text-slate-400 border-slate-200"
                          }`}
                        >
                          <StatusIcon size={14} />
                          {status.label}
                        </div>

                        {material.deadline &&
                        new Date() > new Date(material.deadline) ? (
                          <button
                            disabled
                            className="p-3 bg-rose-50 text-rose-400 border border-transparent rounded-xl cursor-not-allowed shadow-none"
                            title="Muddat o'tib ketgan"
                          >
                            <XCircle size={20} />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedMaterial(material);
                              setIsModalOpen(true);
                            }}
                            className="p-3 bg-white text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-100 rounded-xl transition-all shadow-sm"
                            title="Vazifa topshirish"
                          >
                            <Upload size={20} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: Teacher/Mentor Info */}
        <div className="space-y-6">
          {/* Teachers Section */}
          <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <User size={16} className="text-indigo-500" />
              Mas'ul Ustozlar
            </h3>
            <div className="space-y-4">
              {course.teachers?.map((t) => (
                <div
                  key={t._id}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-700">
                    {t.firstName[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {t.firstName} {t.lastName}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Ustoz
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mentors Section */}
          <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-500" />
              Sizning Mentorlaringiz
            </h3>
            <div className="space-y-4">
              {course.mentors?.map((m) => (
                <div
                  key={m._id}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
                    {m.firstName[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {m.firstName} {m.lastName}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Mentor
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedMaterial && (
        <SubmissionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          material={selectedMaterial}
          courseId={course._id}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}
