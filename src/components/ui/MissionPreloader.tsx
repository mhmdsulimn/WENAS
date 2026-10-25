import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Orbit, Activity, ShieldCheck, Sparkles, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface MissionPreloaderProps {
  onComplete: () => void;
}

export const MissionPreloader: React.FC<MissionPreloaderProps> = ({ onComplete }) => {
  const { isRtl } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const calibrationSteps = isRtl
    ? [
        'تهيئة الاتصال المداري والبيئة ثلاثية الأبعاد...',
        'تحميل مجسم رائد الفضاء والتوأم الرقمي بدقة عالية...',
        'معايرة مصفوفة الحساسات الحيوية وحزام الصدر (Astro-EMS)...',
        'مزامنة شريحة استشعار العرق والكورتيزول (Smart Bracelet)...',
        'تفعيل منظومة الأنس (صوت الأم ورذاذ النعناع)... المنظومة جاهزة!',
      ]
    : [
        'Initializing deep-space orbital connection and 3D pipeline...',
        'Loading high-fidelity 3D Astronaut Digital Twin...',
        'Calibrating Astro-EMS chest belt cardiopulmonary sensors...',
        'Synchronizing sweat microfluidic biomarker patch...',
        'WENAS solace countermeasures active. Launching mission!',
      ];

  useEffect(() => {
    // Smooth realistic simulation of 3D asset preloading & calibration
    const interval = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          window.clearInterval(interval);
          return 100;
        }
        // Progress increment with realistic acceleration
        const increment = prev < 30 ? 3.5 : prev < 75 ? 2.2 : prev < 90 ? 4.0 : 6.0;
        const next = Math.min(100, prev + increment);

        // Update step text based on progress thresholds
        if (next < 25) setCurrentStepIndex(0);
        else if (next < 50) setCurrentStepIndex(1);
        else if (next < 75) setCurrentStepIndex(2);
        else if (next < 92) setCurrentStepIndex(3);
        else setCurrentStepIndex(4);

        return next;
      });
    }, 60);

    return () => window.clearInterval(interval);
  }, []);

  // When progress reaches 100%, hold briefly for a polished finish then auto-dismiss
  useEffect(() => {
    if (progress >= 100) {
      const timer = window.setTimeout(() => {
        onComplete();
      }, 550);
      return () => window.clearTimeout(timer);
    }
  }, [progress, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020510] text-slate-100 overflow-hidden select-none px-4"
    >
      {/* Background Cosmic Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-cyan-600/10 blur-[160px] rounded-full" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-600/10 blur-[130px] rounded-full" />
        {/* Subtle Radar Coordinates */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:32px_32px] opacity-15" />
      </div>

      <div className="relative z-10 w-full max-w-lg flex flex-col items-center text-center space-y-6">
        {/* Animated Gyroscopic Telemetry Core */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Outer Rotating Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/40"
          />
          {/* Inner Counter-Rotating Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-2 rounded-full border border-cyan-300/60"
          />
          {/* Pulsing Core */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/40 to-blue-600/40 border border-cyan-400/60 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.6)]">
            <Orbit className="w-6 h-6 text-cyan-300 animate-pulse" />
          </div>
        </div>

        {/* Project Title & Tagline */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono tracking-widest shadow-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>NASA SPACE APPS CHALLENGE</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            WENAS{' '}
            <span className="text-cyan-400 font-arabic drop-shadow-[0_0_25px_rgba(6,182,212,0.6)]">
              (ونس)
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-arabic font-medium max-w-md">
            {isRtl
              ? 'المنظومة الذكية للرعاية الفسيولوجية والدعم النفسي لرواد الفضاء'
              : 'Autonomous Physiological & Psychological Astronaut Support Ecosystem'}
          </p>
        </div>

        {/* Progress Section */}
        <div className="w-full space-y-3 pt-4">
          {/* Status Message & Percent */}
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-300 flex items-center gap-1.5 font-medium truncate max-w-[80%]">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
              <span className={isRtl ? 'font-arabic' : ''}>
                {calibrationSteps[currentStepIndex]}
              </span>
            </span>
            <span className="text-cyan-400 font-bold tracking-wider shrink-0">
              {Math.round(progress)}%
            </span>
          </div>

          {/* Glowing Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-900 border border-cyan-500/30 overflow-hidden p-0.5 shadow-inner">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.8)]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>

          {/* Telemetry Hardware Badges */}
          <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${progress > 25 ? 'bg-emerald-400' : 'bg-slate-700'}`} />
              3D ASTRONAUT
            </span>
            <span className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${progress > 60 ? 'bg-emerald-400' : 'bg-slate-700'}`} />
              ASTRO-EMS BELT
            </span>
            <span className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${progress > 85 ? 'bg-emerald-400' : 'bg-slate-700'}`} />
              SMART BRACELET
            </span>
          </div>
        </div>

        {/* Skip Button (in case user wants to enter immediately) */}
        <button
          onClick={onComplete}
          className="pt-2 text-xs text-slate-400 hover:text-cyan-300 font-mono transition-colors flex items-center gap-1"
        >
          <span className={isRtl ? 'font-arabic' : ''}>
            {isRtl ? 'تخطي التحميل والدخول فوراً' : 'Skip & Enter Mission'}
          </span>
          <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </motion.div>
  );
};
