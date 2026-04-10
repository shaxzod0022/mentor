import { useState, useEffect } from 'react';
import userRepository from '../repositories/user.repository';
import authService from '../services/auth.service';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCurrentUser(authService.getCurrentUser());
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to page 1 on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userRepository.getAll({
        page,
        limit: 10,
        role: activeTab === "all" ? undefined : activeTab,
        search: debouncedSearch
      });
      setUsers(data.users);
      setTotalPages(data.totalPages);
      setTotalUsers(data.totalUsers);
    } catch (error) {
      console.error("Users loading error:", error);
      setErrorMessage("Foydalanuvchilarni yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    setActionLoading(true);
    setErrorMessage("");
    try {
      const responseStatus = await userRepository.delete(deletingUser._id);
      setSuccessMessage(responseStatus.message);
      setDeletingUser(null);
      fetchUsers();
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message || "O'chirishda xatolik yuz berdi");
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, activeTab, debouncedSearch]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setPage(1);
  };

  return {
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
    refreshUsers: fetchUsers
  };
};
