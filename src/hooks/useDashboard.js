import { useState, useEffect } from 'react';
import userRepository from '../repositories/user.repository';

export const useDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [courseStats, setCourseStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await userRepository.getStats();
      setStats(data.stats);
      setRecentUsers(data.recentUsers || []);
      setRecentActivity(data.recentActivity || []);
      setCourseStats(data.courseStats || []);
    } catch (err) {
      console.error('Stats loading error:', err);
      const message = err.message || (typeof err === 'string' ? err : 'Ma\'lumotlarni yuklashda xatolik yuz berdi');
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    stats,
    recentUsers,
    recentActivity,
    courseStats,
    loading,
    error,
    refreshData: fetchDashboardData
  };
};
