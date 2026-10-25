import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, Volume2, Wind, PauseCircle, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { sound } from '../../audio/soundSystem';

export const GroundingSection: React.FC = () => {
  const { t, isRtl } = useLanguage();

  const playVoiceChime = () => {
    sound.playSoothingVoiceAndMintAroma();
  };

  const playEmergencySiren = () => {
    sound.playEmergencyAlarm();
  };

  return (
    <section id="grounding" className="relative min-h-screen py-24 px-4 sm:px-8 border-t border-slate-900/80">
      <div className="max-w-7xl mx-auto w-full space-y-12 relative z-10">
        {/* Section Header with Scroll Animation */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center max-w-3xl mx-auto space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs bg-amber-950/70 border border-amber-500/30 text-amber-300 font-medium">
            <HeartHandshake className="w-4 h-4 text-amber-400" />
            <span className={isRtl ? 'font-arabic font-bold text-xs' : 'font-mono'}>
              {t.groundingSection.badge}
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {t.groundingSection.title}
          </h2>
          <p className={`text-sm sm:text-base text-slate-300 leading-relaxed ${isRtl ? 'font-arabic text-slate-200' : ''}`}>
            {t.groundingSection.desc}
          </p>
        </motion.div>

        {/* 3 Pillars Grid with Staggered Scroll Animations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: Mother's Voice */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            className="p-6 rounded-2xl glass-panel border border-amber-500/30 space-y-4 hover:border-amber-400/60 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
              <Volume2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`text-lg font-bold text-white mb-1.5 ${isRtl ? 'font-arabic' : ''}`}>
                {t.groundingSection.voiceTitle}
              </h3>
              <p className={`text-xs sm:text-sm text-slate-300 leading-relaxed ${isRtl ? 'font-arabic' : ''}`}>
                {t.groundingSection.voiceDesc}
              </p>
            </div>
            <button
              onClick={playVoiceChime}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all active:scale-95 shadow-md ${
                isRtl ? 'font-arabic text-sm' : 'font-mono text-xs'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isRtl ? 'استمع إلى النغمة المهدئة' : "Test Mother's Voice Synth"}</span>
            </button>
          </motion.div>

          {/* Pillar 2: Olfactory Mint Scent */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="p-6 rounded-2xl glass-panel border border-emerald-500/30 space-y-4 hover:border-emerald-400/60 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
              <Wind className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`text-lg font-bold text-white mb-1.5 ${isRtl ? 'font-arabic' : ''}`}>
                {t.groundingSection.mintTitle}
              </h3>
              <p className={`text-xs sm:text-sm text-slate-300 leading-relaxed ${isRtl ? 'font-arabic' : ''}`}>
                {t.groundingSection.mintDesc}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span className={isRtl ? 'font-arabic text-xs' : 'font-mono'}>
                {isRtl ? 'ناقل عطري تحت ليزري 0.5 مل/د' : '0.5 ml/min pulsed ultrasonic aerosol'}
              </span>
            </div>
          </motion.div>

          {/* Pillar 3: Smart Penalty */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            className="p-6 rounded-2xl glass-panel border border-red-500/30 space-y-4 hover:border-red-400/60 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.25)]">
              <PauseCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`text-lg font-bold text-white mb-1.5 ${isRtl ? 'font-arabic' : ''}`}>
                {t.groundingSection.penaltyTitle}
              </h3>
              <p className={`text-xs sm:text-sm text-slate-300 leading-relaxed ${isRtl ? 'font-arabic' : ''}`}>
                {t.groundingSection.penaltyDesc}
              </p>
            </div>
            <button
              onClick={playEmergencySiren}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30 transition-all active:scale-95 shadow-md ${
                isRtl ? 'font-arabic text-sm' : 'font-mono text-xs'
              }`}
            >
              <PauseCircle className="w-4 h-4" />
              <span>{isRtl ? 'تجربة إنذار العقوبة الذكية' : 'Test Emergency Siren'}</span>
            </button>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="pt-16 border-t border-slate-900 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-sm font-mono text-cyan-400 font-bold">
            <span>Copyright @WENAS Team</span>
          </div>
          <p className={`text-xs text-slate-400 max-w-xl mx-auto ${isRtl ? 'font-arabic' : ''}`}>
            {t.footer.rights}
          </p>
          <p className={`text-[11px] text-slate-500 ${isRtl ? 'font-arabic' : 'font-mono'}`}>
            {t.footer.spaceAppsQuote}
          </p>
        </div>
      </div>
    </section>
  );
};
