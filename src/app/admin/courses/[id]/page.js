'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  Users, 
  GraduationCap, 
  UserPlus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  XCircle,
  BookOpen,
  FileText,
  Plus,
  Play,
  ExternalLink,
  Edit,
  History,
  Eye,
  CheckCircle,
  Clock,
  MessageSquare
} from 'lucide-react';
import courseService from '@/services/course.service';
import materialService from '@/services/material.service';
import submissionRepository from '@/repositories/submission.repository';
import AssignUsersModal from '@/components/admin/courses/AssignUsersModal';
import AddMaterialModal from '@/components/admin/courses/AddMaterialModal';
import DeleteMaterialModal from '@/components/admin/courses/DeleteMaterialModal';
import GradingModal from '@/components/admin/GradingModal';
import authService from '@/services/auth.service';

export default function CourseDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('teachers');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [deletingMaterial, setDeletingMaterial] = useState(null);
  const user = authService.getCurrentUser();
  const isTeacher = user?.role === 'teacher';
  const isMentor = user?.role === 'mentor';
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
    fetchMaterials();
    fetchSubmissions();
  }, [id]);

  const fetchSubmissions = async () => {
    try {
      const data = await submissionRepository.getCourseSubmissions(id);
      setSubmissions(data);
    } catch (err) {
      console.error('Submissions load error:', err);
    }
  };

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const data = await courseService.getCourseById(id);
      setCourse(data);
    } catch (err) {
      setErrorMessage('Kurs ma\'lumotlarini yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const fetchMaterials = async () => {
    try {
      const data = await materialService.getMaterialsByCourse(id);
      setMaterials(data);
    } catch (err) {
      console.error('Materials load error:', err);
    }
  };

  const handleAssign = async (userIds) => {
    setActionLoading(true);
    setErrorMessage('');
    try {
      const updatedAssignments = {
        teachers: activeTab === 'teachers' ? userIds : course.teachers.map(u => u._id),
        mentors: activeTab === 'mentors' ? userIds : course.mentors.map(u => u._id),
        students: activeTab === 'students' ? userIds : course.students.map(u => u._id),
      };

      await courseService.assignUsersToCourse(id, updatedAssignments);
      setSuccessMessage('Foydalanuvchilar muvaffaqiyatli saqlandi');
      setIsAssignModalOpen(false);
      fetchCourseDetails();
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message || 'Saqlashda xatolik yuz berdi');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteMaterial = (material) => {
    setDeletingMaterial(material);
  };

  const confirmDeleteMaterial = async () => {
    setActionLoading(true);
    try {
      await materialService.deleteMaterial(deletingMaterial._id);
      setSuccessMessage('Material o\'chirildi');
      setDeletingMaterial(null);
      fetchMaterials();
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setErrorMessage('O\'chirishda xatolik yuz berdi');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleGrading = async (subId) => {
    try {
      setActionLoading(true);
      await submissionRepository.toggleGrading(subId);
      setSuccessMessage('Vazifa holati o\'zgartirildi');
      fetchSubmissions();
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setErrorMessage('Xatolik yuz berdi');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-slate-400 font-medium">Yuklanmoqda...</div>;
  if (!course) return <div className="p-20 text-center text-rose-500 font-bold">Kurs topilmadi</div>;

  const currentUsers = activeTab === 'teachers' ? course.teachers : activeTab === 'mentors' ? course.mentors : course.students;
  const roleTitle = activeTab === 'teachers' ? 'Ustozlar' : activeTab === 'mentors' ? 'Mentorlar' : 'O\'quvchilar';
  const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8080';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="p-2.5 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{course.name}</h1>
          <p className="text-slate-500 text-sm">Kurs materiallari va foydalanuvchilarini boshqarish</p>
        </div>
      </div>

      {(successMessage || errorMessage) && (
        <div className={`p-4 border rounded-2xl flex items-center justify-between gap-3 text-sm font-medium animate-in slide-in-from-top-4 ${
          successMessage ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-rose-50 border-rose-100 text-rose-700"
        }`}>
          <div className="flex items-center gap-3">
            {successMessage ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {successMessage || errorMessage}
          </div>
          <button onClick={() => { setSuccessMessage(''); setErrorMessage(''); }} className="p-1 rounded-lg hover:bg-black/5">
            <XCircle size={18} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Course Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
            <div className="aspect-video rounded-3xl overflow-hidden">
               <img 
                src={`${API_URL}${course.image}`} 
                alt={course.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900">{course.name}</h3>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">{course.description || 'Tavsif yo\'q'}</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-2 shadow-sm space-y-1">
            {[
              { id: 'teachers', label: 'Ustozlar', icon: GraduationCap, count: course.teachers.length },
              { id: 'mentors', label: 'Mentorlar', icon: Users, count: course.mentors.length },
              { id: 'students', label: 'O\'quvchilar', icon: Users, count: course.students.length },
              { id: 'materials', label: 'Materiallar', icon: FileText, count: materials.length },
              { id: 'submissions', label: 'Vazifalar', icon: History, count: submissions.length },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all font-bold text-sm ${
                    activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span>{tab.label}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] ${activeTab === tab.id ? 'bg-white/20' : 'bg-slate-100 text-slate-400'}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {activeTab === 'materials' ? 'O\'quv materiallari' : activeTab === 'submissions' ? 'O\'quvchilar vazifalari' : roleTitle}
              </h2>
              {activeTab === 'materials' ? (
                // Only Admin/Mentor/Teacher can add materials (though mentor CRUD is in route)
                <button 
                  onClick={() => { setEditingMaterial(null); setIsMaterialModalOpen(true); }}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 group"
                >
                  <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                  Material qo'shish
                </button>
              ) : activeTab === 'submissions' ? (
                <div className="flex items-center gap-2">
                   <div className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                      {submissions.filter(s => s.status === 'pending').length} ta yangi
                   </div>
                </div>
              ) : (
                // Restriction: Teachers cannot manage other teachers, Mentors cannot manage teachers/mentors
                !((isTeacher && activeTab === 'teachers') || (isMentor && (activeTab === 'teachers' || activeTab === 'mentors'))) && (
                  <button 
                    onClick={() => setIsAssignModalOpen(true)}
                    className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-600 hover:text-white transition-all group"
                  >
                    <UserPlus size={18} className="group-hover:rotate-12 transition-transform" />
                    {roleTitle}ni boshqarish
                  </button>
                )
              )}
            </div>

            <div className="flex-1 p-8">
              {activeTab === 'materials' ? (
                materials.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center">
                      <FileText size={32} />
                    </div>
                    <p className="font-bold text-slate-500">Materiallar mavjud emas</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {materials.map(material => (
                      <div key={material._id} className="p-6 rounded-3xl border border-slate-50 bg-slate-50/50 hover:bg-white hover:border-indigo-100 transition-all group relative">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <h4 className="font-bold text-slate-900 flex items-center gap-2">
                              {material.name}
                              {material.pdfUrl && <FileText size={14} className="text-rose-500" />}
                              {material.videoUrl && <Play size={14} className="text-red-600" />}
                            </h4>
                            <p className="text-sm text-slate-500 font-medium">{material.description || 'Izoh qoldirilmagan'}</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {material.videoUrl && (
                              <a 
                                href={material.videoUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:text-red-600 hover:border-red-100 transition-all"
                              >
                                <Play size={14} /> Video
                              </a>
                            )}
                            {material.pdfUrl && (
                              <a 
                                href={`${API_URL}${material.pdfUrl}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 hover:border-rose-100 transition-all"
                              >
                                <FileText size={14} /> PDF
                              </a>
                            )}
                            <div className="w-px h-6 bg-slate-200 mx-1" />
                            <button 
                              onClick={() => { setEditingMaterial(material); setIsMaterialModalOpen(true); }}
                              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteMaterial(material)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : activeTab === 'submissions' ? (
                submissions.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center">
                      <History size={32} />
                    </div>
                    <p className="font-bold text-slate-500">Hozircha vazifalar topshirilmagan</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {submissions.map(sub => (
                      <div key={sub._id} className="p-6 rounded-3xl border border-slate-50 bg-slate-50/50 hover:bg-white hover:border-indigo-100 transition-all group">
                         <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm font-bold text-slate-700">
                                  {sub.student?.firstName[0]}
                               </div>
                               <div>
                                  <h4 className="font-bold text-slate-900">{sub.student?.firstName} {sub.student?.lastName}</h4>
                                  <p className="text-xs text-slate-500 font-medium">Material: {sub.material?.name}</p>
                               </div>
                            </div>

                            <div className="flex items-center gap-3">
                               <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest
                                  ${sub.status === 'graded' ? 'bg-emerald-50 text-emerald-600' : 
                                    sub.status === 'reviewed' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}
                               >
                                  {sub.status === 'graded' ? `Baholangan: ${sub.grade}` : 
                                   sub.status === 'reviewed' ? 'Ko\'rib chiqildi' : 'Kutilmoqda'}
                               </div>

                               <div className="flex items-center gap-1">
                                  <a 
                                    href={`http://localhost:8080${sub.submissionUrl}`} 
                                    target="_blank" 
                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                    title="PDFni ko'rish"
                                  >
                                     <Eye size={18} />
                                  </a>
                                  
                                  {/* Mentor review action */}
                                  {(user.role === 'mentor' || user.role === 'admin' || user.role === 'super_admin') && (
                                    <button 
                                      onClick={() => handleToggleGrading(sub._id)}
                                      disabled={actionLoading}
                                      className={`p-2 rounded-lg transition-all ${sub.isGradeable ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                                      title={sub.isGradeable ? "Baholash yopish" : "Baholashga ruxsat berish"}
                                    >
                                       <CheckCircle size={18} />
                                    </button>
                                  )}

                                  {/* Grading action for higher roles */}
                                  {(user.role === 'teacher' || user.role === 'admin' || user.role === 'super_admin') && (
                                    <button 
                                      onClick={() => {
                                        if (!sub.isGradeable && user.role === 'teacher') return;
                                        setSelectedSubmission(sub);
                                        setIsGradingModalOpen(true);
                                      }}
                                      disabled={!sub.isGradeable && user.role === 'teacher'}
                                      className={`p-2 rounded-lg transition-all ${
                                        !sub.isGradeable && user.role === 'teacher'
                                          ? 'text-slate-200 cursor-not-allowed'
                                          : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                                      }`}
                                      title={!sub.isGradeable && user.role === 'teacher' ? "Mentor tasdiqlashi kutilmoqda" : "Baholash"}
                                    >
                                       <Edit size={18} />
                                    </button>
                                  )}
                               </div>
                            </div>
                         </div>
                         {sub.feedback && (
                            <div className="mt-4 p-3 bg-white border border-slate-100 rounded-2xl flex items-start gap-2">
                               <MessageSquare size={14} className="text-slate-300 mt-0.5" />
                               <p className="text-xs text-slate-500 italic">"{sub.feedback}"</p>
                            </div>
                         )}
                      </div>
                    ))}
                  </div>
                )
              ) : (
                currentUsers.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center">
                      <Users size={32} />
                    </div>
                    <p className="font-bold text-slate-500">Hali hech kim biriktirilmagan</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentUsers.map(user => (
                      <div key={user._id} className="flex items-center justify-between p-4 rounded-3xl border border-slate-50 bg-slate-50/50 hover:bg-white hover:border-indigo-100 transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-bold text-xs text-indigo-600 border border-slate-100 shadow-sm">
                            {user.firstName[0]}{user.lastName[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <AssignUsersModal 
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onAssign={handleAssign}
        role={activeTab === 'teachers' ? 'teacher' : activeTab === 'mentors' ? 'mentor' : 'student'}
        activeUsers={currentUsers}
      />

      <AddMaterialModal
        isOpen={isMaterialModalOpen}
        onClose={() => setIsMaterialModalOpen(false)}
        onSuccess={(msg) => {
          setSuccessMessage(msg);
          fetchMaterials();
        }}
        courseId={id}
        material={editingMaterial}
      />

      <DeleteMaterialModal
        isOpen={!!deletingMaterial}
        materialName={deletingMaterial?.name}
        loading={actionLoading}
        onClose={() => setDeletingMaterial(null)}
        onConfirm={confirmDeleteMaterial}
      />

      <GradingModal 
        isOpen={isGradingModalOpen}
        onClose={() => setIsGradingModalOpen(false)}
        submission={selectedSubmission}
        onSuccess={(msg) => {
          setSuccessMessage(msg);
          fetchSubmissions();
        }}
      />
    </div>
  );
}
