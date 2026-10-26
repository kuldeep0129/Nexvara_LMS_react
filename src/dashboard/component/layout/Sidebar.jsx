import { AnimatePresence, motion } from 'framer-motion';

import {
  LogOut,
  X,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  CalendarDays,
  Sparkles,
} from 'lucide-react';

import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { profileService } from '../../services/profileService';

/* =========================================================
   UNIQUE ANIMATION KEYFRAMES
========================================================= */
const SidebarStyles = () => (
  <style>{`
    @keyframes auroraA {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33%      { transform: translate(30px, -25px) scale(1.12); }
      66%      { transform: translate(-20px, 30px) scale(0.95); }
    }
    @keyframes auroraB {
      0%, 100% { transform: translate(0, 0) scale(1); }
      50%      { transform: translate(-45px, -35px) scale(1.18); }
    }
    @keyframes auroraC {
      0%, 100% { transform: translate(0, 0) scale(1); }
      40%      { transform: translate(25px, 35px) scale(0.9); }
      80%      { transform: translate(-30px, -10px) scale(1.1); }
    }
    @keyframes shimmerText {
      0%   { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes spinSlow { to { transform: rotate(360deg); } }
    @keyframes breatheGlow {
      0%, 100% { box-shadow: 0 0 18px rgba(109, 91, 208, 0.45); }
      50%      { box-shadow: 0 0 32px rgba(109, 91, 208, 0.75); }
    }
    @keyframes cardFloat {
      0%, 100% { box-shadow: 0 25px 70px -15px rgba(109,91,208,0.45), 0 0 0 1px rgba(255,255,255,0.4); }
      50%      { box-shadow: 0 30px 85px -15px rgba(109,91,208,0.55), 0 0 0 1px rgba(255,255,255,0.55); }
    }
    .aurora-a { animation: auroraA 20s ease-in-out infinite; }
    .aurora-b { animation: auroraB 26s ease-in-out infinite; }
    .aurora-c { animation: auroraC 22s ease-in-out infinite; }
    .shimmer-active {
      background: linear-gradient(90deg, #ffffff 0%, #e9d5ff 25%, #ffffff 50%, #e9d5ff 75%, #ffffff 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shimmerText 4s linear infinite;
    }
    .spin-slow { animation: spinSlow 6s linear infinite; }
    .breathe-glow { animation: breatheGlow 3s ease-in-out infinite; }
    .float-card { animation: cardFloat 6s ease-in-out infinite; }
    .hud-scrollbar::-webkit-scrollbar { width: 5px; }
    .hud-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .hud-scrollbar::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #A594F9, #6D5BD0);
      border-radius: 999px;
    }
    .dot-grid {
      background-image: radial-gradient(circle, #6D5BD0 1px, transparent 1px);
      background-size: 18px 18px;
    }
  `}</style>
);

export default function Sidebar({
  isOpen,
  toggleSidebar,
  links = [],
  role = 'User',
}) {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' && window.innerWidth >= 1024
  );

  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location?.pathname || '';

  const [displayName, setDisplayName] = useState('User');
  const [profileImage, setProfileImage] = useState(null);
  const [openMenus, setOpenMenus] = useState({});

  /* Fetch profile — unchanged */
  useEffect(() => {
    let isMounted = true;

    const fetchSidebarProfile = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;

        const user = JSON.parse(userStr);
        const extractedId = user?.userId || user?.id || user?.data?.userId;
        const userId =
          typeof extractedId === 'string' || typeof extractedId === 'number'
            ? String(extractedId)
            : '';

        if (!isMounted) return;

        setDisplayName(user?.fullName || user?.userName || 'User');
        if (user?.profileImageUrl) setProfileImage(user.profileImageUrl);
        if (!userId) return;

        let data;
        if (role.toLowerCase() === 'student') {
          data = await profileService.getStudentProfile(userId);
        } else if (
          role.toLowerCase() === 'teacher' ||
          role.toLowerCase() === 'trainer'
        ) {
          data = await profileService.getTeacherProfile(userId);
        }

        if (!isMounted) return;

        const profileData = data?.data || data;
        if (profileData) {
          setDisplayName(
            profileData.userName ||
              profileData.fullName ||
              user?.userName ||
              user?.fullName ||
              'User'
          );

          if (profileData.profileImageUrl) {
            setProfileImage(profileData.profileImageUrl);
            localStorage.setItem(
              'user',
              JSON.stringify({
                ...user,
                profileImageUrl: profileData.profileImageUrl,
                userName: profileData.userName || user?.userName,
              })
            );
          }
        }
      } catch (err) {
        console.error('Sidebar profile fetch failed:', err);
      }
    };

    fetchSidebarProfile();
    return () => {
      isMounted = false;
    };
  }, [role]);

  /* Resize */
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* Auto open submenu */
  useEffect(() => {
    const newOpenMenus = {};
    if (Array.isArray(links)) {
      links.forEach((link) => {
        if (link?.children && Array.isArray(link.children)) {
          const isChildActive = link.children.some(
            (child) =>
              child?.path &&
              (currentPath === child.path ||
                currentPath.startsWith(`${child.path}/`))
          );
          if (isChildActive) newOpenMenus[link.name] = true;
        }
      });
    }
    setOpenMenus((prev) => ({ ...prev, ...newOpenMenus }));
  }, [currentPath, links]);

  const profilePath = `/${role.toLowerCase()}/profile`;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const toggleMenu = (menuName) =>
    setOpenMenus((prev) => ({ ...prev, [menuName]: !prev[menuName] }));

  const closeMobileSidebar = () => {
    if (!isDesktop) toggleSidebar();
  };

  const handleNavigation = (path) => {
    if (path) navigate(path);
    closeMobileSidebar();
  };

  return (
    <>
      <SidebarStyles />

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={toggleSidebar}
            className="fixed inset-0 z-40 bg-[#120a24]/60 backdrop-blur-md lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ==========================================
          SIDEBAR — now a FLOATING CARD
          left/right/top/bottom inset + rounded-[26px]
          so it sits inside the root canvas.
      ========================================== */}
      <motion.aside
        initial={false}
        animate={{ x: isDesktop ? 0 : isOpen ? 0 : -340 }}
        transition={{ type: 'spring', stiffness: 280, damping: 32 }}
        className="
          float-card fixed z-50 flex flex-col overflow-hidden
          rounded-[26px] border border-white/50
          bg-white/55 backdrop-blur-2xl
          left-3 right-auto top-3 bottom-3 w-[calc(100vw-1.5rem)] max-w-[300px]
          lg:left-4 lg:top-4 lg:bottom-4 lg:w-[264px] lg:max-w-none lg:right-auto
        "
      >
        {/* Aurora blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[26px]">
          <div className="aurora-a absolute -top-20 -right-24 h-64 w-64 rounded-full bg-gradient-to-br from-[#a58bfa]/50 to-transparent blur-3xl" />
          <div className="aurora-b absolute top-1/3 -left-20 h-56 w-56 rounded-full bg-gradient-to-tr from-[#7dd3fc]/50 to-transparent blur-3xl" />
          <div className="aurora-c absolute -bottom-16 right-0 h-60 w-60 rounded-full bg-gradient-to-tl from-[#F472B6]/40 to-transparent blur-3xl" />
        </div>

        {/* Dot grid */}
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-[0.035]" />

        {/* Inner corner HUD accents */}
        <div className="pointer-events-none absolute left-3 top-3 h-4 w-4 rounded-tl-md border-l-2 border-t-2 border-white/70" />
        <div className="pointer-events-none absolute right-3 top-3 h-4 w-4 rounded-tr-md border-r-2 border-t-2 border-white/70" />
        <div className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 rounded-bl-md border-l-2 border-b-2 border-white/70" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 rounded-br-md border-r-2 border-b-2 border-white/70" />

        {/* Floating particles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[26px]">
          {[...Array(7)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-[#8D7AE8]/60"
              style={{
                left: `${12 + ((i * 17) % 70)}%`,
                top: `${15 + ((i * 23) % 65)}%`,
              }}
              animate={{
                y: [0, -22, 0],
                x: [0, i % 2 ? 12 : -12, 0],
                opacity: [0.15, 0.7, 0.15],
              }}
              transition={{
                duration: 4 + i * 0.6,
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Header */}
        <div className="relative z-10 flex shrink-0 items-center justify-between border-b border-white/40 px-5 py-5">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleNavigation(`/${role.toLowerCase()}`)}
            className="flex items-center gap-2.5 text-left"
          >
            <div className="relative h-11 w-11">
              <span
                className="spin-slow absolute inset-0 rounded-2xl opacity-70"
                style={{
                  background:
                    'conic-gradient(from 0deg, #8D7AE8, #7dd3fc, #F472B6, #8D7AE8)',
                }}
              />
              <div className="absolute inset-[2px] flex items-center justify-center rounded-[14px] bg-gradient-to-br from-[#8D7AE8] to-[#5B48BE] text-white shadow-inner">
                <LayoutDashboard size={17} />
              </div>
              <motion.span
                className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#F472B6] shadow-md shadow-pink-300"
                animate={{ scale: [1, 1.35, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>

            <div>
              <h2 className="bg-gradient-to-r from-[#5145A0] via-[#7C6ADD] to-[#5145A0] bg-clip-text text-lg font-extrabold tracking-tight text-transparent">
                Nexvara
              </h2>
              <p className="text-[10px] font-medium text-[#9690AA]">
                Learning Management
              </p>
            </div>
          </motion.button>

          <button
            onClick={toggleSidebar}
            className="rounded-xl border border-white/60 bg-white/40 p-2 text-[#938BAA] backdrop-blur transition hover:bg-white/80 hover:text-[#6D5BD0] lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="hud-scrollbar relative z-10 flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-3 flex items-center gap-1.5 px-3 text-[10px] font-bold uppercase tracking-[1.5px] text-[#AAA3BE]">
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Sparkles size={11} className="text-[#8D7AE8]" />
            </motion.span>
            Main Menu
          </p>

          <div className="space-y-1">
            {Array.isArray(links) &&
              links.map((link) => {
                if (!link) return null;

                const hasChildren =
                  Array.isArray(link.children) && link.children.length > 0;
                const menuIsOpen = !!openMenus[link.name];
                const isChildActive =
                  hasChildren &&
                  link.children.some(
                    (child) =>
                      child?.path &&
                      (currentPath === child.path ||
                        currentPath.startsWith(`${child.path}/`))
                  );

                return (
                  <div key={link.name} className="flex flex-col">
                    {hasChildren ? (
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleMenu(link.name)}
                        className={`group relative flex w-full items-center justify-between overflow-hidden rounded-xl border px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
                          isChildActive
                            ? 'border-white/70 bg-white/80 text-[#6D5BD0] shadow-md shadow-purple-200/40 backdrop-blur-xl'
                            : 'border-transparent text-[#85809F] hover:border-white/60 hover:bg-white/50 hover:text-[#6D5BD0] hover:shadow-sm'
                        }`}
                      >
                        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                        <div className="relative flex items-center gap-3">
                          {link.icon && (
                            <motion.span
                              whileHover={{ rotate: 12, scale: 1.15 }}
                              transition={{ type: 'spring', stiffness: 300 }}
                              className={
                                isChildActive
                                  ? 'text-[#6D5BD0]'
                                  : 'text-[#9992AE] group-hover:text-[#6D5BD0]'
                              }
                            >
                              {link.icon}
                            </motion.span>
                          )}
                          <span>{link.name}</span>
                        </div>
                        <motion.span
                          animate={{ rotate: menuIsOpen ? 180 : 0 }}
                          transition={{ duration: 0.25 }}
                          className="relative"
                        >
                          <ChevronDown size={16} className="text-[#AAA3BE]" />
                        </motion.span>
                      </motion.button>
                    ) : (
                      <NavLink
                        to={link.path || '#'}
                        end={link.path === `/${role.toLowerCase()}`}
                        onClick={closeMobileSidebar}
                        className={({ isActive }) =>
                          `group relative flex items-center gap-3 overflow-hidden rounded-xl border px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? 'border-white/30 text-white'
                              : 'border-transparent text-[#85809F] hover:border-white/60 hover:bg-white/50 hover:text-[#6D5BD0] hover:shadow-sm'
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && (
                              <>
                                <motion.div
                                  layoutId={`sidebar-active-${role}`}
                                  initial={false}
                                  transition={{
                                    type: 'spring',
                                    stiffness: 380,
                                    damping: 30,
                                  }}
                                  className="breathe-glow absolute inset-0 rounded-xl bg-gradient-to-r from-[#7C6ADD] via-[#6D5BD0] to-[#5B48BE] ring-1 ring-white/40"
                                />
                                <motion.span
                                  layoutId={`sidebar-beam-${role}`}
                                  className="absolute bottom-2 left-0 top-2 w-[3px] rounded-full bg-white/80"
                                  animate={{ opacity: [0.6, 1, 0.6] }}
                                  transition={{ duration: 1.8, repeat: Infinity }}
                                />
                              </>
                            )}

                            {!isActive && (
                              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                            )}

                            {link.icon && (
                              <motion.span
                                whileHover={{ rotate: 12, scale: 1.15 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                                className={`relative z-10 ${
                                  isActive
                                    ? 'text-white drop-shadow'
                                    : 'text-[#9992AE] group-hover:text-[#6D5BD0]'
                                }`}
                              >
                                {link.icon}
                              </motion.span>
                            )}

                            <span
                              className={`relative z-10 ${
                                isActive ? 'shimmer-active font-semibold' : ''
                              }`}
                            >
                              {link.name}
                            </span>

                            {link.path?.endsWith('/schedule') && (
                              <span
                                className={`relative z-10 ml-auto ${
                                  isActive ? 'text-white/90' : 'text-[#B3A8D9]'
                                }`}
                              >
                                <CalendarDays size={14} />
                              </span>
                            )}

                            {!isActive && (
                              <motion.span
                                className="relative z-10 ml-auto text-[#B3A8D9] opacity-0 transition-opacity group-hover:opacity-100"
                                initial={{ x: -6 }}
                                whileHover={{ x: 0 }}
                              >
                                <ChevronRight size={14} />
                              </motion.span>
                            )}
                          </>
                        )}
                      </NavLink>
                    )}

                    <AnimatePresence initial={false}>
                      {hasChildren && menuIsOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="ml-5 mt-2 space-y-1 border-l border-[#E6DFF5]/80 py-1 pl-3">
                            {link.children.map((child, idx) => (
                              <motion.div
                                key={child.path}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.05 + idx * 0.05 }}
                              >
                                <NavLink
                                  to={child.path || '#'}
                                  onClick={closeMobileSidebar}
                                  className={({ isActive }) =>
                                    `group relative block overflow-hidden rounded-lg border px-3 py-2.5 text-xs font-medium transition-all duration-200 ${
                                      isActive
                                        ? 'border-[#DDD2F8] bg-white/80 text-[#6D5BD0] shadow-sm backdrop-blur'
                                        : 'border-transparent text-[#9690AA] hover:border-white/60 hover:bg-white/50 hover:text-[#6D5BD0] hover:backdrop-blur'
                                    }`
                                  }
                                >
                                  {({ isActive }) => (
                                    <span className="relative flex items-center gap-2">
                                      <motion.span
                                        className={`h-1.5 w-1.5 rounded-full ${
                                          isActive
                                            ? 'bg-[#6D5BD0]'
                                            : 'bg-[#D1C9E5]'
                                        }`}
                                        animate={
                                          isActive
                                            ? {
                                                scale: [1, 1.5, 1],
                                                boxShadow: [
                                                  '0 0 0 rgba(109,91,208,0)',
                                                  '0 0 10px rgba(109,91,208,0.9)',
                                                  '0 0 0 rgba(109,91,208,0)',
                                                ],
                                              }
                                            : {}
                                        }
                                        transition={{
                                          duration: 1.8,
                                          repeat: Infinity,
                                        }}
                                      />
                                      {child.name}
                                    </span>
                                  )}
                                </NavLink>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
          </div>
        </nav>

        {/* Footer */}
        <div className="relative z-10 shrink-0 border-t border-white/40 p-3">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleNavigation(profilePath)}
            className="group relative mb-2 flex w-full items-center gap-3 overflow-hidden rounded-2xl border border-white/70 bg-white/60 p-3 text-left shadow-md shadow-purple-200/30 backdrop-blur-xl transition hover:border-white hover:bg-white/80 hover:shadow-lg hover:shadow-purple-200/50"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

            <div className="relative h-11 w-11 shrink-0">
              <span
                className="spin-slow absolute inset-0 rounded-full opacity-90"
                style={{
                  background:
                    'conic-gradient(from 0deg, #8D7AE8, #7dd3fc, #F472B6, #8D7AE8)',
                }}
              />
              <div className="absolute inset-[2.5px] flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#8D7AE8] to-[#6D5BD0] text-sm font-bold text-white">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={displayName}
                    className="h-full w-full object-cover"
                    onError={() => setProfileImage(null)}
                  />
                ) : (
                  <span>{displayName.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
              </span>
            </div>

            <div className="relative min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-[#514A7A]">
                {displayName}
              </p>
              <p className="mt-0.5 text-[10px] capitalize text-[#A09AB5]">
                {role} Profile
              </p>
            </div>

            <ChevronRight
              size={15}
              className="relative shrink-0 text-[#B2AAC8] transition-transform group-hover:translate-x-0.5"
            />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl border border-transparent px-3.5 py-3 text-xs font-semibold text-[#9992AE] transition-all duration-200 hover:border-rose-200/60 hover:bg-rose-50/70 hover:text-[#D9536D]"
          >
            <LogOut
              size={17}
              className="transition-transform duration-300 group-hover:-translate-x-1 group-hover:rotate-[-8deg]"
            />
            <span>Logout</span>
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
}