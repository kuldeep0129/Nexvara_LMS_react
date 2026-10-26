import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Mail, Phone, Search, X, ChevronLeft, ChevronRight, MoreVertical, Edit, Shield, GraduationCap, Briefcase } from 'lucide-react';
import { useUsers } from '../../hooks/useUsers';
import EditUserModal from './EditUserModal';

export default function AllUsersList() {
  const { 
    users, isLoading, error, pageNumber, totalPages, totalCount, 
    setPageNumber, toggleStatus, togglingId, fetchUsers 
  } = useUsers();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null); 
  
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter Logic (Search + Role)
  const filteredUsers = users.filter((user) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch = 
      (user.userName || '').toLowerCase().includes(query) ||
      (user.email || '').toLowerCase().includes(query) ||
      (user.mobileNumber || '').includes(query);
      
    const userRole = user.roles?.[0] || user.role || 'Student';
    const matchesRole = roleFilter === 'All' || userRole === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const handleAction = (type, user) => {
    setActiveDropdown(null);
    setSelectedUser(user);
    setModalType(type);
  };

  const handleToggle = async (userId) => {
    const res = await toggleStatus(userId);
    if (!res.success) alert(res.error); 
  };

  // Role Badge Helper
  const getRoleBadge = (role) => {
    switch(role) {
      case 'Admin':
      case 'SuperAdmin': return <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-purple-100 text-purple-700 rounded-md"><Shield size={12}/> {role}</span>;
      case 'Trainer':
      case 'Teacher': return <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-blue-100 text-blue-700 rounded-md"><Briefcase size={12}/> Trainer</span>;
      default: return <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-md"><GraduationCap size={12}/> Student</span>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">All Users</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all registered students, teachers, and admins.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          {/* Role Filter */}
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:border-[#7c3aed] text-sm text-gray-700"
          >
            <option value="All">All Roles</option>
            <option value="Student">Students</option>
            <option value="Trainer">Trainers / Teachers</option>
            <option value="Admin">Admins</option>
          </select>

          {/* Search */}
          <div className="relative w-full md:w-72 flex items-center">
            <Search className="absolute left-4 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7c3aed] text-sm"
            />
            {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 rounded-full"><X size={16} /></button>}
          </div>
        </div>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded-xl">{error}</div>}

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
                <th className="p-4 font-semibold">User</th>
                <th className="p-4 font-semibold">Contact</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="5" className="p-10 text-center"><Loader2 className="animate-spin text-[#7c3aed] mx-auto" size={32} /></td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan="5" className="p-10 text-center text-gray-500">No users found.</td></tr>
              ) : (
                filteredUsers.map((user) => {
                  const primaryRole = user.roles?.[0] || user.role || 'Student';
                  const isActive = user.isActive === 'True' || user.isActive === true;

                  return (
                    <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-gray-50 hover:bg-gray-50/50">
                      
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold shrink-0 overflow-hidden">
                          {user.profileImageUrl ? <img src={user.profileImageUrl} className="w-full h-full object-cover" /> : user.userName?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{user.userName}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1"><Mail size={12}/> {user.email}</p>
                        </div>
                      </td>

                      <td className="p-4">
                        <p className="text-sm text-gray-700 flex items-center gap-1"><Phone size={14}/> {user.mobileNumber || 'N/A'}</p>
                      </td>

                      <td className="p-4">
                        {getRoleBadge(primaryRole)}
                      </td>

                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleToggle(user.userId || user.id)}
                          disabled={togglingId === (user.userId || user.id)}
                          className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                        >
                          <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                          {togglingId === (user.userId || user.id) && <Loader2 className="absolute inset-0 m-auto text-white animate-spin" size={12} />}
                        </button>
                        <p className="text-[10px] font-bold mt-1 text-gray-500 uppercase">{isActive ? 'Active' : 'Inactive'}</p>
                      </td>

                      <td className="p-4 text-right relative">
                        <button 
                          onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                          className="p-2 text-gray-400 hover:text-[#7c3aed] hover:bg-purple-50 rounded-lg transition-colors"
                        >
                          <MoreVertical size={20} />
                        </button>

                        <AnimatePresence>
                          {activeDropdown === user.id && (
                            <motion.div 
                              ref={dropdownRef}
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              className="absolute right-8 top-12 w-36 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-1 overflow-hidden"
                            >
                              <button onClick={() => handleAction('edit', user)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                <Edit size={16} className="text-[#7c3aed]" /> Edit User
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {!isLoading && totalCount > 0 && (
          <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-b-2xl">
            <p className="text-sm text-gray-500">Showing <span className="font-semibold">{(pageNumber - 1) * 10 + 1}</span> to <span className="font-semibold">{Math.min(pageNumber * 10, totalCount)}</span> of <span className="font-semibold">{totalCount}</span></p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber === 1} className="p-2 border rounded-lg disabled:opacity-50"><ChevronLeft size={18} /></button>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => setPageNumber(i + 1)} className={`w-8 h-8 rounded-lg text-sm font-semibold ${pageNumber === i + 1 ? 'bg-[#7c3aed] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{i + 1}</button>
                ))}
              </div>
              <button onClick={() => setPageNumber(pageNumber + 1)} disabled={pageNumber === totalPages} className="p-2 border rounded-lg disabled:opacity-50"><ChevronRight size={18} /></button>
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {modalType === 'edit' && selectedUser && (
          <EditUserModal 
            userId={selectedUser.userId || selectedUser.id} 
            onClose={() => setModalType(null)} 
            onSuccess={() => { fetchUsers(pageNumber); setModalType(null); }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}