import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Edit, UploadCloud, MoreVertical, Loader2,
  Calendar, Users, UserCheck, Activity, FileText, CheckCircle2, PlayCircle, Clock
} from 'lucide-react';
import { useBatchDetails } from '../../../hooks/useBatchDetails';

const TABS = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'teachers', label: 'Teachers', icon: UserCheck },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'live', label: 'Live Classes', icon: PlayCircle },
  { id: 'recorded', label: 'Recorded Classes', icon: FileText },
  { id: 'attendance', label: 'Attendance', icon: CheckCircle2 },
  { id: 'progress', label: 'Progress', icon: Clock },
];

const PLACEHOLDER_TABS = TABS.filter(t => t.id !== 'overview').map(t => t.id);

// Tailwind arbitrary variants: scrollbar hidden on every browser (no <style> tag needed)
const HIDE_SCROLLBAR =
  '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden';

function StatCard({ icon: Icon, label, value, title, className = '' }) {
  return (
    <div className={`bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-100 min-w-0 ${className}`}>
      <p className="text-xs sm:text-sm text-gray-500 mb-1 flex items-center gap-1.5">
        <Icon size={14} className="shrink-0" />
        <span className="truncate">{label}</span>
      </p>
      <p className="text-sm sm:text-base font-semibold text-gray-800 truncate" title={title}>
        {value}
      </p>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="min-w-0">
      <span className="block mb-1 text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-gray-500">
        {label}
      </span>
      <span className="block text-sm font-medium text-gray-700 break-words">{value}</span>
    </div>
  );
}

export default function BatchDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { batch, isLoading, error } = useBatchDetails(id);
  const [activeTab, setActiveTab] = useState('overview');

  if (isLoading) {
    return (
      <div className="flex h-[60vh] sm:h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#7c3aed]" size={40} />
      </div>
    );
  }

  if (error || !batch) {
    return (
      <div className="p-4 sm:p-6 text-center text-red-500 flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-base sm:text-lg font-semibold mb-2">{error || 'Batch not found.'}</p>
        <button
          onClick={() => navigate('/admin/batches')}
          className="text-[#7c3aed] hover:underline font-medium"
        >
          Go back to Batches
        </button>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const s = String(status).toLowerCase();
    if (s === 'active' || s === '1') return 'bg-green-100 text-green-700 border-green-200';
    if (s === 'upcoming' || s === '2') return 'bg-blue-100 text-blue-700 border-blue-200';
    if (s === 'completed' || s === '3') return 'bg-gray-100 text-gray-700 border-gray-200';
    return 'bg-purple-100 text-purple-700 border-purple-200';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  };

  // Tab click par active tab ko center mein scroll karta hai (mobile/tablet pe useful)
  const handleTabClick = (tabId, e) => {
    setActiveTab(tabId);
    e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 py-4 sm:px-6 sm:py-6 space-y-4 sm:space-y-6">

      {/* Back Button */}
      <button
        onClick={() => navigate('/admin/batches')}
        className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#7c3aed] transition-colors"
      >
        <ArrowLeft size={16} /> Back to Batches
      </button>

      {/* Header Section */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">

        {/* Title & Badge */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 break-words leading-tight min-w-0">
              {batch.name}
            </h1>
            <span
              className={`w-max shrink-0 px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(batch.status)}`}
            >
              {batch.status || 'Draft'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-mono bg-gray-50 inline-block max-w-full break-all px-3 py-1 rounded-lg border border-gray-200">
            {batch.code}
          </p>
        </div>

        {/* Action Buttons:
            mobile  -> Edit | Publish | ⋮ (ek hi row, equal width)
            tablet+ -> auto-width buttons, right side / lg pe inline */}
        <div className="grid grid-cols-[1fr_1fr_auto] sm:flex sm:flex-wrap lg:flex-nowrap items-stretch gap-2 sm:gap-3 w-full lg:w-auto shrink-0">
          <button className="flex items-center justify-center gap-2 px-3 sm:px-5 py-2.5 text-sm sm:text-base bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors whitespace-nowrap">
            <Edit size={18} className="shrink-0" />
            <span>Edit<span className="hidden sm:inline"> Batch</span></span>
          </button>

          <button
            className={`flex items-center justify-center gap-2 px-3 sm:px-5 py-2.5 text-sm sm:text-base font-semibold rounded-xl transition-colors shadow-sm whitespace-nowrap ${
              batch.isPublished
                ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                : 'bg-[#7c3aed] text-white hover:bg-[#6d28d9]'
            }`}
          >
            <UploadCloud size={18} className="shrink-0" />
            {batch.isPublished ? 'Unpublish' : 'Publish'}
          </button>

          <button
            aria-label="More actions"
            className="flex items-center justify-center px-3 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Tabs Navigation — scroll sirf is outer wrapper pe, scrollbar hidden */}
      <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100">
        <div
          role="tablist"
          className={`flex overflow-x-auto gap-1 sm:gap-2 p-1.5 sm:p-2 snap-x ${HIDE_SCROLLBAR}`}
        >
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={(e) => handleTabClick(tab.id, e)}
                className={`snap-start shrink-0 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 lg:py-3 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-purple-50 text-[#7c3aed]'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Icon size={16} className={`shrink-0 ${isActive ? 'text-[#7c3aed]' : 'text-gray-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
        {/* Right-edge fade: mobile/tablet pe hint deta hai ki aur tabs scroll honge */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 rounded-r-2xl bg-gradient-to-l from-white to-transparent lg:hidden" />
      </div>

      {/* Tab Content Area */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8 min-h-[320px] sm:min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && (
              <div className="space-y-6 sm:space-y-8">

                {/* Overview Cards: mobile 2 col, tablet 2 col, desktop 3 col */}
                <section>
                  <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 border-b border-gray-100 pb-2">
                    Batch Overview
                  </h2>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                    <StatCard
                      icon={Activity}
                      label="Course"
                      value={batch.courseName || 'N/A'}
                      title={batch.courseName}
                      className="col-span-2 sm:col-span-1"
                    />
                    <StatCard icon={Calendar} label="Start Date" value={formatDate(batch.startDate)} />
                    <StatCard icon={Calendar} label="End Date" value={formatDate(batch.endDate)} />
                    <StatCard icon={Users} label="Total Capacity" value={batch.capacity || 0} />
                    <StatCard icon={Users} label="Enrolled Students" value={batch.totalStudents || 0} />
                    <StatCard icon={UserCheck} label="Assigned Teachers" value={batch.totalTeachers || 0} />
                  </div>
                </section>

                {/* Description */}
                <section>
                  <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 border-b border-gray-100 pb-2">
                    Description
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {batch.description || 'No description provided for this batch.'}
                  </p>
                </section>

                {/* System Info: mobile 2 col, desktop 4 col */}
                <section>
                  <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 border-b border-gray-100 pb-2">
                    System Info
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <InfoItem label="Created At" value={formatDate(batch.createAt)} />
                    <InfoItem label="Created By" value={batch.createBy || 'Admin'} />
                    <InfoItem label="Last Updated" value={formatDate(batch.updateAt)} />
                    <InfoItem label="Updated By" value={batch.updateBy || 'N/A'} />
                  </div>
                </section>
              </div>
            )}

            {/* Placeholders for other tabs */}
            {PLACEHOLDER_TABS.includes(activeTab) && (
              <div className="flex flex-col items-center justify-center h-56 sm:h-64 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200 px-4 text-center">
                <Activity size={40} className="mb-3 sm:mb-4 text-gray-300" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-600 capitalize">
                  {activeTab} Module
                </h3>
                <p className="text-xs sm:text-sm mt-1">
                  This section is under development or data is not available yet.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
