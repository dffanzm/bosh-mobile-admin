import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";
import LightPillar from "./LightPillar";

// --- ANIMATION VARIANTS (Resep Smooth) ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Jeda antar elemen (Title -> Input -> Btn)
      delayChildren: 0.2, // Nunggu dikit pas awal load
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 }, // Mulai dari bawah dikit & transparan
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 50, // "Pegas" yang lembut
      damping: 20, // Gak membal berlebihan
      duration: 0.8,
    },
  },
};

// --- DATA ---
const ADMIN_ACCOUNTS = [
  { email: "adminboshparfum@gmail.com", pass: "boshparfummobile" },
  { email: "admindev@gmail.com", pass: "farhan,azka,daffa,danu" },
];

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    setTimeout(() => {
      const foundUser = ADMIN_ACCOUNTS.find(
        (u) => u.email === email && u.pass === password
      );

      if (foundUser) {
        if (onLoginSuccess) onLoginSuccess();
      } else {
        setError("Email atau password salah. Coba cek lagi bro.");
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center font-sans bg-[#050505]">
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <LightPillar
          topColor="#5227FF"
          bottomColor="#FF9FFC"
          intensity={1.0}
          rotationSpeed={0.3}
          glowAmount={0.002}
          pillarWidth={3.0}
          pillarHeight={0.4}
          noiseIntensity={0.5}
          pillarRotation={25}
          interactive={false}
          mixBlendMode="lighten"
        />
      </div>

      {/* GLASS CARD CONTAINER */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // Custom smooth bezier
        className="relative z-10 w-full max-w-md p-6 sm:p-10 m-4"
      >
        {/* KACA BLUR */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]"></div>

        {/* FORM CONTENT WRAPPER */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative z-20"
        >
          {/* 1. Header Area */}
          <motion.div variants={itemVariants} className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-md">
              BOSH PARFUME
            </h1>
            <p className="text-gray-400 mt-2 text-xs sm:text-sm tracking-[0.2em] uppercase font-light">
              Admin Access
            </p>
          </motion.div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* 2. Email Input */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-xs font-medium text-gray-400 ml-1 tracking-wide">
                EMAIL
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-violet-400 transition-colors z-10">
                  <User size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all backdrop-blur-sm relative"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </motion.div>

            {/* 3. Password Input */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-xs font-medium text-gray-400 ml-1 tracking-wide">
                PASSWORD
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-violet-400 transition-colors z-10">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-12 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all backdrop-blur-sm relative"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors cursor-pointer z-10"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            {/* 4. Error Message (Animate In/Out) */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2 text-rose-300 text-sm bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 backdrop-blur-md overflow-hidden"
                >
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 5. Button */}
            <motion.button
              variants={itemVariants}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 25px rgba(124, 58, 237, 0.4)",
              }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full group relative overflow-hidden bg-violet-600 hover:bg-violet-700 text-white font-semibold py-4 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />

              <span className="flex items-center justify-center gap-2 tracking-wide">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Accessing...
                  </>
                ) : (
                  <>
                    Sign In Dashboard <LogIn size={18} />
                  </>
                )}
              </span>
            </motion.button>
          </form>

          {/* 6. Footer */}
          <motion.div
            variants={itemVariants}
            className="mt-10 text-center text-[10px] text-gray-600 tracking-widest uppercase"
          >
            &copy; 2025 Bosh Parfume System
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
