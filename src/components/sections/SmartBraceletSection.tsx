import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { SmartBraceletCanvas } from '../3d/SmartBraceletCanvas';
import { Coffee, Flame, RotateCcw, Droplet, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { VitalStatus, SweatBiomarkers } from '../../types/vitals';

interface SmartBraceletSectionProps {
  status: VitalStatus;
  biomarkers: SweatBiomarkers;
  onCaffeine: () => void;
  onStress: () => void;
  onReset: () => void;
}

export const SmartBraceletSection: React.FC<SmartBraceletSectionProps> = ({
  status,
  biomarkers,
  onCaffeine,
  onStress,
  onReset,
}) => {
  const { t, isRtl } = useLanguage();
  const isCaffeine = status === 'caffeine';
  const isStress = status === 'stress';

  return (
    <section
      id="bracelet"
      className={`relative min-h-screen py-24 px-4 sm:px-8 transition-colors duration-700 ${
        isStress ? 'bg-amber-950/20' : isCaffeine ? 'bg-cyan-950/20' : 'bg-transparent'
      }`}
    >
      {/* Ambient Glow */}
      {isStress && (
        <div className="absolute inset-0 pointer-events-none animate-pulse bg-amber-500/10 blur-[160px]" />
      )}
      {isCaffeine && (
        <div className="absolute inset-0 pointer-events-none bg-cyan-500/10 blur-[160px]" />
      )}

      <div className="max-w-7xl mx-auto w-full space-y-10 relative z-10">
        {/* Section Header with Scroll Animation */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="space-y-3 text-start"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 font-medium">
            <span className={isRtl ? 'font-arabic font-bold text-xs' : 'font-mono'}>
              {t.braceletSection.badge}
            </span>
          </div>
          <div className="flex flex-wrap items-baseline gap-3">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              {t.braceletSection.title}
            </h2>
            <span className="text-xl sm:text-3xl font-bold text-cyan-400/90 font-arabic">
              ({t.braceletSection.arabicTitle})
            </span>
          </div>
          <p className={`text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed ${isRtl ? 'font-arabic text-slate-200' : ''}`}>
            {t.braceletSection.desc}
          </p>
        </motion.div>

        {/* Side-by-Side Grid: 3D Model on one side, Dashboard on the other */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (3D Interactive Model) */}
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 40 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-5 space-y-3"
          >
            <SmartBraceletCanvas
              status={status}
              isCaffeine={isCaffeine}
              isStress={isStress}
            />
          </motion.div>

          {/* Right Column (Sweat Sensor Dashboard & Alerts) */}
          <motion.div
            initial={{ opacity: 0, x: isRtl ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            className="lg:col-span-7 space-y-5"
          >
            {/* Conditional Alerts for Caffeine and Stress */}
            {isCaffeine && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl glass-panel border-2 border-cyan-400 text-cyan-200 space-y-2 shadow-[0_0_35px_rgba(6,182,212,0.3)]"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-6 h-6 text-cyan-300 shrink-0" />
                  <div>
                    <h4 className={`text-sm font-bold uppercase text-cyan-300 ${isRtl ? 'font-arabic' : 'font-mono tracking-wider'}`}>
                      {t.braceletSection.caffeineAlertTitle}
                    </h4>
                    <p className={`text-base font-extrabold text-white mt-0.5 ${isRtl ? 'font-arabic' : 'font-mono'}`}>
                      {t.braceletSection.caffeineAlertMessage}
                    </p>
                  </div>
                </div>
                <p className={`text-xs text-slate-300 ${isRtl ? 'pr-8 font-arabic' : 'pl-8'}`}>
                  {isRtl
                    ? 'أكدت مصفوفة العرق امتصاص 28.4 ملغ/ل كافيين. تسارع نبضات القلب فسيولوجي حميد، وتم قفل أي إنذار كاذب تلقائياً.'
                    : 'Sweat patch identified 28.4 mg/L caffeine metabolite. Tachycardia is classified non-pathological with all false alarms muted.'}
                </p>
              </motion.div>
            )}

            {isStress && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl glass-panel-warning border-2 border-amber-400 text-amber-200 space-y-2 shadow-[0_0_40px_rgba(245,158,11,0.35)]"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-6 h-6 text-amber-400 animate-spin shrink-0" />
                  <div>
                    <h4 className={`text-sm font-bold uppercase text-amber-300 ${isRtl ? 'font-arabic' : 'font-mono tracking-wider'}`}>
                      {t.braceletSection.stressAlertTitle}
                    </h4>
                    <p className={`text-base font-extrabold text-white mt-0.5 ${isRtl ? 'font-arabic' : 'font-mono'}`}>
                      {t.braceletSection.stressAlertMessage}
                    </p>
                  </div>
                </div>
                <p className={`text-xs text-slate-300 ${isRtl ? 'pr-8 font-arabic' : 'pl-8'}`}>
                  {isRtl
                    ? 'ارتفع هرمون الكورتيزول إلى 36.5 ميكروغرام/ديسيلتر. تم فتح قناة صوت الأم المهدئة ورش رذاذ النعناع الموضعي فوراً.'
                    : "Cortisol spike detected at 36.5 μg/dL. Autonomous ground protocol engaged: streaming mother's comforting vocal frequency & dispensing micro-peppermint mist."}
                </p>
              </motion.div>
            )}

            {!isCaffeine && !isStress && (
              <div className="p-3.5 rounded-xl glass-panel border border-cyan-500/20 flex items-center justify-between text-xs text-cyan-300">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className={isRtl ? 'font-arabic font-semibold text-sm' : 'font-mono'}>
                    {isRtl
                      ? 'مصفوفة العرق في حالة استقرار - لا مؤشرات كافيين أو كورتيزول'
                      : 'Epidermal sweat patch calibrated - Zero stimulant or stress anomaly'}
                  </span>
                </span>
                <span className="text-slate-500 font-mono text-[11px]">Auto-BioLink 99.8%</span>
              </div>
            )}

            {/* Sweat Biomarker Cards */}
            <div className="p-4 rounded-2xl glass-panel space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-cyan-400" />
                  <span className={`text-xs font-bold uppercase text-white ${isRtl ? 'font-arabic text-sm' : 'font-mono tracking-wider'}`}>
                    {t.braceletSection.biomarkersTitle}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  REF: NASA-ASTRO-SWEAT-42
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {/* Caffeine Level */}
                <div className={`p-3 rounded-xl border transition-all ${
                  biomarkers.caffeineDetected
                    ? 'bg-cyan-950/50 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                    : 'bg-slate-900/60 border-slate-800'
                }`}>
                  <div className={`text-[10px] text-slate-400 mb-1 ${isRtl ? 'font-arabic font-semibold text-xs' : 'font-mono'}`}>
                    {t.braceletSection.biomarkers.caffeine}
                  </div>
                  <div className={`text-xl font-bold font-mono ${
                    biomarkers.caffeineDetected ? 'text-cyan-300' : 'text-slate-200'
                  }`}>
                    {biomarkers.caffeineLevel}{' '}
                    <span className="text-xs text-slate-400 font-mono">mg/L</span>
                  </div>
                  <div className="mt-1">
                    {biomarkers.caffeineDetected ? (
                      <span className={`text-[9px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 ${isRtl ? 'font-arabic font-bold text-[10px]' : 'font-mono'}`}>
                        {isRtl ? 'تم رصد جرعة' : 'SPIKE DETECTED'}
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono text-slate-500">&lt;2.0 NOMINAL</span>
                    )}
                  </div>
                </div>

                {/* Cortisol Stress Hormone */}
                <div className={`p-3 rounded-xl border transition-all ${
                  isStress
                    ? 'bg-amber-950/50 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                    : 'bg-slate-900/60 border-slate-800'
                }`}>
                  <div className={`text-[10px] text-slate-400 mb-1 ${isRtl ? 'font-arabic font-semibold text-xs' : 'font-mono'}`}>
                    {t.braceletSection.biomarkers.cortisol}
                  </div>
                  <div className={`text-xl font-bold font-mono ${
                    isStress ? 'text-amber-300' : 'text-slate-200'
                  }`}>
                    {biomarkers.cortisolLevel}{' '}
                    <span className="text-xs text-slate-400 font-mono">μg/dL</span>
                  </div>
                  <div className="mt-1">
                    {biomarkers.cortisolLevel > 20 ? (
                      <span className={`text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 ${isRtl ? 'font-arabic font-bold text-[10px]' : 'font-mono'}`}>
                        {isRtl ? 'ارتفاع كورتيزول' : 'ELEVATED STRESS'}
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono text-emerald-400">&lt;15 NOMINAL</span>
                    )}
                  </div>
                </div>

                {/* Hydration */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className={`text-[10px] text-slate-400 mb-1 ${isRtl ? 'font-arabic font-semibold text-xs' : 'font-mono'}`}>
                    {t.braceletSection.biomarkers.hydration}
                  </div>
                  <div className="text-xl font-bold font-mono text-white">
                    {biomarkers.hydrationLevel}%
                  </div>
                  <div className="text-[9px] font-mono text-emerald-400 mt-1">OPTIMAL</div>
                </div>

                {/* Electrolytes */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className={`text-[10px] text-slate-400 mb-1 ${isRtl ? 'font-arabic font-semibold text-xs' : 'font-mono'}`}>
                    {t.braceletSection.biomarkers.electrolytes}
                  </div>
                  <div className="text-xl font-bold font-mono text-white">
                    {biomarkers.electrolyteBalance}{' '}
                    <span className="text-xs text-slate-400 font-mono">mmol/L</span>
                  </div>
                  <div className="text-[9px] font-mono text-slate-400 mt-1">LACTIC: 1.2</div>
                </div>
              </div>
            </div>

            {/* Interactive Control Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Caffeine Spike Button */}
              <button
                onClick={onCaffeine}
                className={`flex-1 min-w-[180px] flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold transition-all duration-300 active:scale-95 ${
                  isCaffeine
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.6)] ring-2 ring-cyan-300'
                    : 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900/60 hover:border-cyan-400 shadow-lg'
                } ${isRtl ? 'font-arabic text-sm' : 'font-mono text-xs tracking-wider'}`}
              >
                <Coffee className="w-4 h-4 text-cyan-400" />
                <span>{t.braceletSection.caffeineBtn}</span>
              </button>

              {/* Stress Button */}
              <button
                onClick={onStress}
                className={`flex-1 min-w-[180px] flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold transition-all duration-300 active:scale-95 ${
                  isStress
                    ? 'bg-amber-400 text-slate-950 shadow-[0_0_25px_rgba(251,191,36,0.6)] ring-2 ring-amber-300'
                    : 'bg-amber-950/70 text-amber-300 border border-amber-500/40 hover:bg-amber-900/60 hover:border-amber-400 shadow-lg'
                } ${isRtl ? 'font-arabic text-sm' : 'font-mono text-xs tracking-wider'}`}
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>{t.braceletSection.stressBtn}</span>
              </button>

              {/* Reset Button */}
              <button
                onClick={onReset}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold bg-slate-900/90 text-slate-300 border border-slate-700/80 hover:bg-slate-800 hover:text-white transition-all active:scale-95 ${
                  isRtl ? 'font-arabic text-sm' : 'font-mono text-xs tracking-wider'
                }`}
              >
                <RotateCcw className="w-4 h-4 text-slate-400" />
                <span>{t.beltSection.resetBtn}</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
