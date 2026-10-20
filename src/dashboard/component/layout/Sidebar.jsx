import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Sidebar({ isOpen, toggleSidebar, links, role }) {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const navigate = useNavigate();
  
  // localStorage se user ka data utha rahe hain
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const displayName = user?.fullName || user?.userName || "User"; 

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const profilePath = `/${role.toLowerCase()}/profile`;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && !isDesktop && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: isDesktop ? 0 : (isOpen ? 0 : -280) }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-screen w-[260px] bg-[#13131f] text-white z-50 flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <div className="text-xl font-bold tracking-wide cursor-pointer" onClick={() => navigate(`/${role.toLowerCase()}`)}>
            Nexvara <span className="text-[#8b5cf6]">{role}</span>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin scrollbar-thumb-gray-700">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => { if(!isDesktop) toggleSidebar(); }}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive ? 'text-white font-semibold' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] rounded-xl -z-10 shadow-lg shadow-purple-500/20"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  {link.icon && (
                    <span className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'} transition-colors`}>
                      {link.icon}
                    </span>
                  )}
                  <span>{link.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Profile Bottom (Dynamic Name) */}
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={() => { navigate(profilePath); if (!isDesktop) toggleSidebar(); }}
            className="flex items-center gap-3 w-full bg-white/5 hover:bg-white/10 p-3 rounded-xl mb-3 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] flex items-center justify-center font-bold text-sm shrink-0 uppercase">
              {displayName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{displayName}</p>
              <p className="text-xs text-gray-400 capitalize">{role} Profile</p>
            </div>
          </button>

          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
}