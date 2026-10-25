import React from 'react';
import { Droplet, Coffee, Zap, BatteryCharging, CheckCircle2 } from 'lucide-react';
import { SweatBiomarkers, VitalStatus } from '../../types/vitals';

interface BiomarkerPanelProps {
  biomarkers: SweatBiomarkers;
  status: VitalStatus;
}

export const BiomarkerPanel: React.FC<BiomarkerPanelProps> = ({ biomarkers, status }) => {
  return (
    <div className="rounded-xl border border-slate-800/80 bg-slate-950/80 p-3.5 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-2.5 pb-1.5 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-cyan-950/80 border border-cyan-500/30">
            <Droplet className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
              Sweat Microfluidic Biosensor Array
            </h3>
            <p className="text-[10px] font-mono text-slate-400">
              Epidermal Telemetry Patch #EP-84
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/50 text-cyan-300 border border-cyan-500/30">
          <CheckCircle2 className="w-3 h-3 text-cyan-400" />
          <span>REAL-TIME STREAM</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        {/* Caffeine Biomarker */}
        <div className={`p-2 rounded-lg border transition-all ${
          biomarkers.caffeineDetected
            ? 'bg-cyan-950/40 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
            : 'bg-slate-900/50 border-slate-800/80'
        }`}>
          <div className="flex items-center justify-between text-slate-400 mb-0.5">
            <span className="text-[10px] font-mono">CAFFEINE</span>
            <Coffee className={`w-3.5 h-3.5 ${biomarkers.caffeineDetected ? 'text-cyan-400' : 'text-slate-500'}`} />
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`font-mono text-lg font-bold ${biomarkers.caffeineDetected ? 'text-cyan-300' : 'text-slate-200'}`}>
              {biomarkers.caffeineLevel}
            </span>
            <span className="text-[9px] font-mono text-slate-400">mg/L</span>
          </div>
          <div className="mt-1">
            {biomarkers.caffeineDetected ? (
              <span className="inline-block text-[9px] font-mono px-1 py-0.2 bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/30">
                ACTIVE INGESTION
              </span>
            ) : (
              <span className="text-[9px] font-mono text-slate-500">BASELINE &lt;2.0</span>
            )}
          </div>
        </div>

        {/* Cortisol Biomarker */}
        <div className={`p-2 rounded-lg border transition-all ${
          status === 'stress' || status === 'emergency'
            ? 'bg-amber-950/40 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
            : 'bg-slate-900/50 border-slate-800/80'
        }`}>
          <div className="flex items-center justify-between text-slate-400 mb-0.5">
            <span className="text-[10px] font-mono">CORTISOL (STRESS)</span>
            <Zap className={`w-3.5 h-3.5 ${status === 'stress' ? 'text-amber-400' : 'text-slate-500'}`} />
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`font-mono text-lg font-bold ${status === 'stress' ? 'text-amber-300' : 'text-slate-200'}`}>
              {biomarkers.cortisolLevel}
            </span>
            <span className="text-[9px] font-mono text-slate-400">μg/dL</span>
          </div>
          <div className="mt-1">
            {biomarkers.cortisolLevel > 25 ? (
              <span className="inline-block text-[9px] font-mono px-1 py-0.2 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                ELEVATED DISTRESS
              </span>
            ) : (
              <span className="text-[9px] font-mono text-emerald-400">NORMAL &lt;15</span>
            )}
          </div>
        </div>

        {/* Hydration */}
        <div className="p-2 rounded-lg border bg-slate-900/50 border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-0.5">
            <span className="text-[10px] font-mono">HYDRATION</span>
            <Droplet className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-lg font-bold text-slate-200">
              {biomarkers.hydrationLevel}%
            </span>
          </div>
          <div className="mt-1">
            <span className="text-[9px] font-mono text-emerald-400">HYDRATED</span>
          </div>
        </div>

        {/* Electrolytes */}
        <div className="p-2 rounded-lg border bg-slate-900/50 border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-0.5">
            <span className="text-[10px] font-mono">ELECTROLYTES</span>
            <BatteryCharging className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-lg font-bold text-slate-200">
              {biomarkers.electrolyteBalance}
            </span>
            <span className="text-[9px] font-mono text-slate-400">mmol/L</span>
          </div>
          <div className="mt-1">
            <span className="text-[9px] font-mono text-slate-400">LACTIC: {biomarkers.lacticAcid}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
