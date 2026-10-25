import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { ChestBeltCanvas } from '../3d/ChestBeltCanvas';
import { EcgWaveform } from '../ui/EcgWaveform';
import { AlertOctagon, RotateCcw, ShieldAlert, PauseCircle, Wind, Thermometer, Waves } from 'lucide-react';
import { VitalStatus, VitalSignMetrics } from '../../types/vitals';

interface ChestBeltSectionProps {
  status: VitalStatus;
  metrics: VitalSignMetrics;
  onEmergency: () => void;
  onReset: () => void;
}

export const ChestBeltSection: React.FC<ChestBeltSectionProps> = ({
  status,
  metrics,
  onEmergency,
  onReset,
}) => {
  const { t, isRtl } = useLanguage();
  const isEmergency = status === 'emergency';

  return (
    <section
      id="belt"
      className={`relative min-h-screen py-24 px-4 sm:px-8 transition-colors duration-700 ${
        isEmergency ? 'bg-red-950/20' : 'bg-transparent'
      }`}
    >
      {/* Flashing Red Emergency Ambient Glow */}
      {isEmergency && (
        <div className="absolute inset-0 pointer-events-none animate-pulse bg-red-600/10 blur-[160px]" />
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
              {t.beltSection.badge}
            </span>
          </div>
          <div className="flex flex-wrap items-baseline gap-3">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              {t.beltSection.title}
            </h2>
            <span className="text-xl sm:text-3xl font-bold text-cyan-400/90 font-arabic">
              ({t.beltSection.arabicTitle})
            </span>
          </div>
          <p className={`text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed ${isRtl ? 'font-arabic text-slate-200' : ''}`}>
            {t.beltSection.desc}
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
            <ChestBeltCanvas status={status} isEmergency={isEmergency} />
          </motion.div>

          {/* Right Column (Glassmorphism Dashboard & Live Chart) */}
          <motion.div
            initial={{ opacity: 0, x: isRtl ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            className="lg:col-span-7 space-y-5"
          >
            {/* Live Heart Rate ECG Waveform Graph */}
            <EcgWaveform status={status} heartRate={metrics.heartRate} />

            {/* Critical Emergency Banner if Triggered */}
            {isEmergency ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl glass-panel-danger border-2 border-red-500 text-red-200 space-y-2 shadow-[0_0_40px_rgba(239,68,68,0.35)]"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-6 h-6 text-red-400 animate-bounce shrink-0" />
                  <div>
                    <h4 className={`text-sm font-bold uppercase text-red-300 ${isRtl ? 'font-arabic' : 'font-mono tracking-wider'}`}>
                      {t.beltSection.emergencyAlertTitle}
                    </h4>
                    <p className={`text-base font-extrabold text-white mt-0.5 ${isRtl ? 'font-arabic' : 'font-mono'}`}>
                      {t.beltSection.emergencyAlertMessage}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-black/50 border border-red-500/30 flex items-start gap-2 text-xs">
                  <PauseCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <span className={`font-bold text-red-300 ${isRtl ? 'font-arabic' : ''}`}>
                      {t.beltSection.smartPenaltyTitle}:{' '}
                    </span>
                    <span className={`text-slate-300 ${isRtl ? 'font-arabic' : ''}`}>
                      {t.beltSection.smartPenaltyDesc}
                    </span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="p-3 rounded-xl glass-panel border border-cyan-500/20 flex items-center justify-between text-xs text-cyan-300">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className={isRtl ? 'font-arabic font-semibold text-sm' : 'font-mono'}>
                    {t.beltSection.statusNominal}
                  </span>
                </span>
                <span className="text-slate-500 font-mono text-[11px]">Astro-EMS Channel A1</span>
              </div>
            )}

            {/* Vital Signs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl glass-panel hover:border-cyan-500/40 transition-colors">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className={`text-[10px] ${isRtl ? 'font-arabic font-semibold text-xs' : 'font-mono'}`}>
                    {t.beltSection.metrics.spo2}
                  </span>
                  <Wind className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="text-xl font-bold font-mono text-white">
                  {metrics.oxygenSaturation}%
                </div>
                <div className="text-[9px] font-mono text-emerald-400 mt-1">
                  {t.beltSection.metrics.spo2Nominal}
                </div>
              </div>

              <div className="p-3 rounded-xl glass-panel hover:border-cyan-500/40 transition-colors">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className={`text-[10px] ${isRtl ? 'font-arabic font-semibold text-xs' : 'font-mono'}`}>
                    {t.beltSection.metrics.resp}
                  </span>
                  <Waves className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="text-xl font-bold font-mono text-white">
                  {metrics.respirationRate}{' '}
                  <span className="text-xs text-slate-400 font-mono">RPM</span>
                </div>
                <div className="text-[9px] font-mono text-slate-400 mt-1">12-20 NOMINAL</div>
              </div>

              <div className="p-3 rounded-xl glass-panel hover:border-cyan-500/40 transition-colors">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className={`text-[10px] ${isRtl ? 'font-arabic font-semibold text-xs' : 'font-mono'}`}>
                    {t.beltSection.metrics.temp}
                  </span>
                  <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="text-xl font-bold font-mono text-white">
                  {metrics.coreTemperature}°C
                </div>
                <div className="text-[9px] font-mono text-slate-400 mt-1">37.0°C BASELINE</div>
              </div>

              <div className="p-3 rounded-xl glass-panel hover:border-cyan-500/40 transition-colors">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className={`text-[10px] ${isRtl ? 'font-arabic font-semibold text-xs' : 'font-mono'}`}>
                    {t.beltSection.metrics.bp}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">mmHg</span>
                </div>
                <div className="text-xl font-bold font-mono text-white">
                  {metrics.bloodPressureSystolic}/{metrics.bloodPressureDiastolic}
                </div>
                <div className="text-[9px] font-mono text-slate-400 mt-1">NORMOTENSIVE</div>
              </div>
            </div>

            {/* Interactive Control Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onEmergency}
                className={`flex-1 min-w-[200px] flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl font-bold transition-all duration-300 active:scale-95 ${
                  isEmergency
                    ? 'bg-red-600 text-white shadow-[0_0_30px_rgba(239,68,68,0.8)] ring-2 ring-red-400 animate-pulse'
                    : 'bg-red-950/70 text-red-300 border border-red-500/50 hover:bg-red-900/60 hover:border-red-400 shadow-lg'
                } ${isRtl ? 'font-arabic text-sm' : 'font-mono text-xs tracking-wider'}`}
              >
                <AlertOctagon className="w-4 h-4 text-red-400" />
                <span>{t.beltSection.emergencyBtn}</span>
              </button>

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
