import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { SketchfabAstronaut } from '../3d/SketchfabAstronaut';
import { ChevronDown, HeartPulse, Activity, Brain } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { t, isRtl } = useLanguage();

  const scrollToNext = () => {
    const el = document.getElementById('belt');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-8 overflow-hidden"
    >
      {/* Background Cosmic Starfield & Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
        {/* Left Column: Text & Mission Pitch */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="lg:col-span-7 flex flex-col gap-5 text-start"
        >
          {/* Mission Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs w-fit shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className={isRtl ? 'font-arabic font-bold text-xs' : 'font-mono tracking-wider'}>
              {t.badge}
            </span>
          </div>

          {/* Glowing Hero Title */}
          <div className="space-y-1">
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white leading-tight">
              <span className="bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                WENAS
              </span>{' '}
              <span className="text-cyan-400 font-arabic font-black drop-shadow-[0_0_35px_rgba(6,182,212,0.6)]">
                (ونس)
              </span>
            </h1>
            <p className={`text-lg sm:text-2xl font-medium text-cyan-300/90 tracking-wide ${isRtl ? 'font-arabic font-semibold' : 'font-sans'}`}>
              {t.tagline}
            </p>
          </div>

          {/* Introduction Paragraph */}
          <p className={`text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl ${isRtl ? 'font-arabic text-slate-200' : ''}`}>
            {t.heroSub}
          </p>

          {/* Core Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl glass-panel flex items-start gap-2.5 hover:border-cyan-500/40 transition-colors">
              <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 shrink-0">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div>
                <h4 className={`text-xs font-bold text-slate-200 ${isRtl ? 'font-arabic text-sm' : 'font-mono'}`}>
                  {isRtl ? 'حزام Astro-EMS' : 'Astro-EMS Belt'}
                </h4>
                <p className={`text-[11px] text-slate-400 leading-tight mt-0.5 ${isRtl ? 'font-arabic text-xs text-slate-300' : ''}`}>
                  {isRtl ? 'تخطيط قلب مستمر ومؤشرات حيوية' : 'Continuous ECG & cardiopulmonary vitals'}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl glass-panel flex items-start gap-2.5 hover:border-blue-500/40 transition-colors">
              <div className="p-2 rounded-lg bg-blue-950/80 border border-blue-500/30 text-blue-400 shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h4 className={`text-xs font-bold text-slate-200 ${isRtl ? 'font-arabic text-sm' : 'font-mono'}`}>
                  {isRtl ? 'السوار الذكي' : 'Smart Bracelet'}
                </h4>
                <p className={`text-[11px] text-slate-400 leading-tight mt-0.5 ${isRtl ? 'font-arabic text-xs text-slate-300' : ''}`}>
                  {isRtl ? 'تحليل عرق وكشف الكافيين والتوتر' : 'Microfluidic sweat & biomarker sensing'}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl glass-panel flex items-start gap-2.5 hover:border-amber-500/40 transition-colors">
              <div className="p-2 rounded-lg bg-amber-950/80 border border-amber-500/30 text-amber-400 shrink-0">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <h4 className={`text-xs font-bold text-slate-200 ${isRtl ? 'font-arabic text-sm' : 'font-mono'}`}>
                  {isRtl ? 'منظومة الأنس' : 'Grounding Twin'}
                </h4>
                <p className={`text-[11px] text-slate-400 leading-tight mt-0.5 ${isRtl ? 'font-arabic text-xs text-slate-300' : ''}`}>
                  {isRtl ? 'صوت الأم ورذاذ النعناع المهدئ' : "Mother's voice & mint scent grounding"}
                </p>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={scrollToNext}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-[0_0_25px_rgba(6,182,212,0.4)] active:scale-95 ${
                isRtl ? 'font-arabic text-base' : 'text-sm'
              }`}
            >
              <span>{t.exploreBtn}</span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </button>
          </div>
        </motion.div>

        {/* Right Column: 3D Astronaut (Floating Freely in Open Space, No Box, No Border) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="lg:col-span-5 h-[440px] sm:h-[550px] relative overflow-hidden flex items-center justify-center p-0 bg-transparent border-0 shadow-none"
        >
          <SketchfabAstronaut />
        </motion.div>
      </div>
    </section>
  );
};
