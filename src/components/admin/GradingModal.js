"use client";

import React, { useState } from "react";
import {
  X,
  CheckCircle,
  Loader2,
  AlertCircle,
  Strikethrough,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import submissionRepository from "@/repositories/submission.repository";

export default function GradingModal({
  isOpen,
  onClose,
  submission,
  onSuccess,
}) {
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !submission) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numGrade = parseFloat(grade);

    if (isNaN(numGrade) || numGrade < 0 || numGrade > 10) {
      setError("Baho 0 va 10 oralig'ida bo'lishi kerak!");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await submissionRepository.assignGrade(submission._id, {
        grade: numGrade,
        feedback,
      });

      onSuccess("Baho muvaffaqiyatli qo'yildi");
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Baholashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-4xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <CheckCircle size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Vazifani baholash</h3>
              <p className="text-xs text-slate-400 font-medium">
                {submission.student?.firstName} {submission.student?.lastName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-medium border border-red-100">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div className="space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-500">Material</span>
              <span className="text-sm font-bold text-slate-900">
                {submission.material?.name}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-500">Fayl</span>
              <a
                href={`http://localhost:8080${submission.submissionUrl}`}
                target="_blank"
                className="text-xs font-black text-indigo-600 flex items-center gap-1 hover:underline"
              >
                PDFni ko'rish <ExternalLink size={12} />
              </a>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 ml-1">
              Baho (max 10)
            </label>
            <input
              type="number"
              step="0.1"
              max="10"
              min="0"
              required
              placeholder="Masalan: 8.5"
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl py-3.5 px-4 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500 transition-all font-bold text-lg"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 ml-1 flex items-center gap-2">
              <MessageSquare size={14} /> Izoh (ixtiyoriy)
            </label>
            <textarea
              rows={3}
              placeholder="O'quvchiga tavsiyalar qoldiring..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl py-3.5 px-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500 transition-all text-sm font-medium"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-emerald-100"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Baholashni saqlash"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
