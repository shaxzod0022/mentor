'use client';

import React, { useState, useEffect } from 'react';
import { X, Search, CheckCircle2, UserPlus, Users, AlertCircle } from 'lucide-react';
import userRepository from '@/repositories/user.repository';

export default function AssignUsersModal({ isOpen, onClose, onAssign, role, activeUsers }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      setSelectedIds(activeUsers.map(u => u._id));
    }
  }, [isOpen, role]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userRepository.getAll({ role, limit: 100 });
      setUsers(data.users);
    } catch (err) {
      setError('Foydalanuvchilarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const toggleUser = (userId) => {
    setSelectedIds(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAssign(selectedIds);
  };

  const filteredUsers = users.filter(user => 
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[80vh]">
        <div className="p-8 pb-4 flex items-center justify-between border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
              <UserPlus size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {role === 'student' ? 'O\'quvchilarni' : role === 'mentor' ? 'Mentorlarni' : 'Ustozlarni'} biriktirish
              </h2>
              <p className="text-slate-400 text-xs font-medium">Kursga foydalanuvchilarni tanlang</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 pb-0">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-indigo-500 transition-colors">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Qidirish..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500 transition-all text-sm font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-2">
          {loading ? (
            <div className="py-10 text-center text-slate-400 text-sm font-medium">Yuklanmoqda...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-sm font-medium">Foydalanuvchilar topilmadi</div>
          ) : (
            filteredUsers.map(user => (
              <div 
                key={user._id}
                onClick={() => toggleUser(user._id)}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedIds.includes(user._id)
                    ? 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-500/5'
                    : 'bg-white border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                    selectedIds.includes(user._id) ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
                {selectedIds.includes(user._id) && (
                  <CheckCircle2 size={20} className="text-indigo-600 animate-in zoom-in duration-200" />
                )}
              </div>
            ))
          )}
        </div>

        <div className="p-8 pt-4 border-t border-slate-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-50 text-slate-600 py-3.5 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all active:scale-95"
          >
            Bekor qilish
          </button>
          <button
            onClick={handleSubmit}
            className="flex-2 bg-indigo-600 text-white py-3.5 px-8 rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 group flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={18} className="group-hover:rotate-12 transition-transform" />
            Saqlash ({selectedIds.length})
          </button>
        </div>
      </div>
    </div>
  );
}
