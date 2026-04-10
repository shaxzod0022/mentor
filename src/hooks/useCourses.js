import { useState, useEffect } from 'react';
import courseService from '../services/course.service';

export const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [deletingCourse, setDeletingCourse] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getAllCourses();
      setCourses(data);
    } catch (error) {
      console.error("Courses loading error:", error);
      setErrorMessage("Kurslarni yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCourse) return;
    setActionLoading(true);
    setErrorMessage("");
    try {
      await courseService.deleteCourse(deletingCourse._id);
      setSuccessMessage("Kurs muvaffaqiyatli o'chirildi");
      setDeletingCourse(null);
      fetchCourses();
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message || "O'chirishda xatolik yuz berdi");
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return {
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
    refreshCourses: fetchCourses
  };
};
