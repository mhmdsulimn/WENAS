import React from 'react';
import { Coffee, Flame, AlertOctagon, RotateCcw } from 'lucide-react';
import { VitalStatus } from '../../types/vitals';

interface ActionControlsProps {
  status: VitalStatus;
  onCaffeine: () => void;
  onStress: () => void;
  onEmergency: () => void;
  onReset: () => void;
}

export const ActionControls: React.FC<ActionControlsProps> = ({
  status,
  onCaffeine,
  onStress,
  onEmergency,
  onReset,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5 p-2 rounded-2xl bg-slate-950/85 border border-slate-800/90 shadow-2xl backdrop-blur-xl">
      {/* 1. Caffeine Spike Button */}
      <button
        onClick={onCaffeine}
        className={`relative group flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold tracking-wider transition-all duration-200 active:scale-95 ${
          status === 'caffeine'
            ? 'bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.6)] ring-2 ring-cyan-300'
            : 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900/60 hover:border-cyan-400'
        }`}
      >
        <Coffee className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
        <span>CAFFEINE SPIKE</span>
      </button>

      {/* 2. Stress Button */}
      <button
        onClick={onStress}
        className={`relative group flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold tracking-wider transition-all duration-200 active:scale-95 ${
          status === 'stress'
            ? 'bg-amber-400 text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.6)] ring-2 ring-amber-300'
            : 'bg-amber-950/60 text-amber-300 border border-amber-500/40 hover:bg-amber-900/60 hover:border-amber-400'
        }`}
      >
        <Flame className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
        <span>STRESS</span>
      </button>

      {/* 3. Red Emergency Button */}
      <button
        onClick={onEmergency}
        className={`relative group flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold tracking-wider transition-all duration-200 active:scale-95 ${
          status === 'emergency'
            ? 'bg-red-600 text-white shadow-[0_0_25px_rgba(239,68,68,0.8)] ring-2 ring-red-400 animate-pulse'
            : 'bg-red-950/60 text-red-300 border border-red-500/50 hover:bg-red-900/60 hover:border-red-400'
        }`}
      >
        <AlertOctagon className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
        <span>RED EMERGENCY</span>
      </button>

      {/* 4. Reset Button */}
      <button
        onClick={onReset}
        className="relative group flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold tracking-wider bg-slate-900 text-slate-300 border border-slate-700/80 hover:bg-slate-800 hover:text-white hover:border-slate-500 transition-all duration-200 active:scale-95"
      >
        <RotateCcw className="w-4 h-4 text-slate-400 group-hover:rotate-180 transition-transform duration-500" />
        <span>RESET</span>
      </button>
    </div>
  );
};
