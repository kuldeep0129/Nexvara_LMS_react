import { motion } from 'framer-motion';

export default function DeveloperIllustration() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: '400px' }}>
        
        {/* Background Glow */}
        <circle cx="250" cy="200" r="150" fill="url(#paint0_radial)" opacity="0.4" />

        {/* Desk */}
        <path d="M100 320 H400" stroke="#2d2d3d" strokeWidth="8" strokeLinecap="round" />

        {/* Laptop Base */}
        <path d="M180 320 L160 260 H340 L320 320 Z" fill="#1e1e2d" stroke="#3b3b4f" strokeWidth="2" strokeLinejoin="round" />
        
        {/* Laptop Screen */}
        <rect x="170" y="150" width="160" height="110" rx="8" fill="#151520" stroke="#3b3b4f" strokeWidth="2" />
        
        {/* Code Lines Animation */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.2, delayChildren: 0.5 }}
        >
          <motion.rect x="185" y="170" width="40" height="4" rx="2" fill="#a78bfa" initial={{ width: 0 }} animate={{ width: 40 }} transition={{ duration: 0.5 }} />
          <motion.rect x="185" y="185" width="80" height="4" rx="2" fill="#3b82f6" initial={{ width: 0 }} animate={{ width: 80 }} transition={{ duration: 0.5, delay: 0.2 }} />
          <motion.rect x="195" y="200" width="60" height="4" rx="2" fill="#10b981" initial={{ width: 0 }} animate={{ width: 60 }} transition={{ duration: 0.5, delay: 0.4 }} />
          <motion.rect x="195" y="215" width="30" height="4" rx="2" fill="#f59e0b" initial={{ width: 0 }} animate={{ width: 30 }} transition={{ duration: 0.5, delay: 0.6 }} />
          <motion.rect x="185" y="230" width="50" height="4" rx="2" fill="#a78bfa" initial={{ width: 0 }} animate={{ width: 50 }} transition={{ duration: 0.5, delay: 0.8 }} />
          
          {/* Cursor Blinking */}
          <motion.rect 
            x="240" y="230" width="2" height="4" fill="#ffffff" 
            animate={{ opacity: [1, 0, 1] }} 
            transition={{ repeat: Infinity, duration: 1 }} 
          />
        </motion.g>

        {/* Student Body */}
        <path d="M270 260 Q300 200 310 150" stroke="#3b3b4f" strokeWidth="20" strokeLinecap="round" />
        <path d="M210 260 Q240 200 230 150" stroke="#3b3b4f" strokeWidth="20" strokeLinecap="round" />
        
        {/* Student Head */}
        <motion.circle 
          cx="250" cy="120" r="30" fill="#e2e8f0"
          animate={{ y: [0, -4, 0] }} 
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        />
        
        {/* Hair */}
        <path d="M220 110 Q250 80 280 110 Q280 130 270 120 Q250 100 230 120 Q220 130 220 110" fill="#1e1e2d" />

        {/* Arms working */}
        <motion.path 
          d="M220 200 Q200 250 220 280" stroke="#3b3b4f" strokeWidth="12" strokeLinecap="round"
          animate={{ rotate: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }}
        />
        <motion.path 
          d="M280 200 Q300 250 280 280" stroke="#3b3b4f" strokeWidth="12" strokeLinecap="round"
          animate={{ rotate: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}
        />

        {/* Coffee Cup */}
        <rect x="330" y="290" width="20" height="30" rx="4" fill="#2d2d3d" />
        <path d="M350 295 Q360 295 360 305 Q360 315 350 315" stroke="#2d2d3d" strokeWidth="4" fill="none" />
        
        {/* Coffee Steam Animation */}
        <motion.path 
          d="M335 280 Q340 270 335 260" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" fill="none"
          animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }} 
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />

        <defs>
          <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(250 200) rotate(90) scale(150)">
            <stop stopColor="#7c3aed" stopOpacity="0.2" />
            <stop offset="1" stopColor="#7c3aed" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}