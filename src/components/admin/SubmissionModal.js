'use client';

import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  CheckCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';
import submissionRepository from '@/repositories/submission.repository';

export default function SubmissionModal({ isOpen, onClose, material, courseId, onSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type !== 'application/pdf') {
      setError('Faqat PDF fayllarni yuklash mumkin!');
      setFile(null);
      return;
    }
    setError('');
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Iltimos, faylni tanlang!');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const formData = new FormData();
      formData.append('materialId', material._id);
      formData.append('courseId', courseId);
      formData.append('pdf', file);

      await submissionRepository.submit(formData);
      
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setError('');
    setSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-4xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <FileText size={20} />
             </div>
             <div>
                <h3 className="font-bold text-slate-900">Vazifa topshirish</h3>
                <p className="text-xs text-slate-400 font-medium">{material.name}</p>
             </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {success ? (
            <div className="py-12 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle size={32} />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Muvaffaqiyatli yuklandi!</h4>
              <p className="text-sm text-slate-500">Vazifangiz ko'rib chiqish uchun yuborildi.</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-medium border border-red-100 animate-shake">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              <div 
                className={`
                  border-2 border-dashed rounded-3xl p-10 text-center transition-all cursor-pointer relative group
                  ${file ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'}
                `}
              >
                <input 
                  type="file" 
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                
                <div className="space-y-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto transition-colors ${file ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
                    <Upload size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">
                      {file ? file.name : 'PDF faylni tanlang yoki shu yerga tashlang'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Maksimal hajm: 10MB'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl space-y-2">
                <div className="flex items-start gap-2 text-xs text-slate-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1 shrink-0" />
                  <p>Faqat .pdf formatdagi fayllar qabul qilinadi.</p>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1 shrink-0" />
                  <p>Hajmi 10 MB dan oshmasligi kerak.</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !file}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-100"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Topshirish'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
