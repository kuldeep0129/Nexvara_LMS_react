import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, MoreVertical } from 'lucide-react';
import { adminData } from '../../data/adminMockData';

export default function AdminDashboard() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 200 } }
  };

  // Chart ke liye max value nikal rahe hain
  const maxRevenue = Math.max(...adminData.revenueChart.map(d => d.amount));

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible"
      className="space-y-8"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Overview 🚀</h1>
          <p className="text-gray-500 mt-1">Monitor your platform's growth and manage users.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-50 transition-all shadow-sm">
            Download Report
          </button>
          <button className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-4 py-2 rounded-xl font-semibold transition-all shadow-lg shadow-purple-500/30">
            + Add User
          </button>
        </div>
      </div>

      {/* 1. Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminData.stats.map((stat, index) => (
          <motion.div 
            key={index} 
            variants={itemVariants}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${stat.color}`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-sm font-semibold ${stat.isPositive ? 'text-green-600' : 'text-red-500'}`}>
                {stat.isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {stat.change}
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* 2. Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Revenue Chart (ERD: Payments) */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-gray-800">Revenue Analytics</h2>
            <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-1.5 outline-none">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>

          {/* Custom CSS/SVG Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 mt-4">
            {adminData.revenueChart.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1 group">
                <div className="relative w-full flex justify-center h-full items-end">
                  {/* Tooltip on Hover */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">
                    ₹{(item.amount / 1000)}k
                  </div>
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${(item.amount / maxRevenue) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="w-full max-w-[40px] bg-gradient-to-t from-[#7c3aed] to-[#a78bfa] rounded-t-md group-hover:from-[#6d28d9] group-hover:to-[#8b5cf6] transition-colors relative"
                  />
                </div>
                <span className="text-xs text-gray-500 mt-4 font-medium">{item.month}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Users (ERD: Users) */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Users</h2>
            <button className="text-sm font-semibold text-[#7c3aed] hover:underline">View All</button>
          </div>
          
          <div className="space-y-4 flex-1">
            {adminData.recentUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-gray-600 shrink-0">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-800 text-sm truncate">{user.name}</h4>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${user.role === 'Teacher' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {user.role}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-1">{user.joinedAt}</p>
                </div>
                <button className="text-gray-400 hover:text-gray-800">
                  <MoreVertical size={16} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}