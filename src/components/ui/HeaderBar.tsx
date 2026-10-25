import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Eye, EyeOff, Box, Activity, ShieldCheck, AlertTriangle } from 'lucide-react';
import { VitalStatus } from '../../types/vitals';

interface HeaderBarProps {
  status: VitalStatus;
  audioMuted: boolean;
  toggleAudio: () => void;
  isUiCollapsed: boolean;
  setIsUiCollapsed: (val: boolean | ((prev: boolean) => boolean)) => void;
  openModelModal: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  status,
  audioMuted,
  toggleAudio,
  isUiCollapsed,
  setIsUiCollapsed,
  openModelModal,
}) => {
  // Mission Elapsed Time timer
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(14820); // starts at ~04:07:00

  useEffect(() => {
    const timer = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const formatMet = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `T+${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'emergency':
        return {
          bg: 'bg-red-500/20 text-red-300 border-red-500/40',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-red-400" />,
          label: 'CRITICAL ALERT // LEVEL-3',
        };
      case 'stress':
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: <Activity className="w-3.5 h-3.5 text-amber-400" />,
          label: 'STRESS INTERVENTION ACTIVE',
        };
      case 'caffeine':
        return {
          bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />,
          label: 'SWEAT SENSOR: CAFFEINE SAFE',
        };
      case 'normal':
      default:
        return {
          bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
          label: 'EVA HOMEOSTASIS NOMINAL',
        };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <header className="relative z-20 flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-950/75 border-b border-slate-800/80 backdrop-blur-md">
      {/* Left: NASA Branding & Mission Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-cyan-500/40 shadow-inner">
          <span className="font-mono font-bold text-xs tracking-tighter text-cyan-300">NASA</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-sans font-bold text-sm tracking-wider text-white uppercase">
              Smart Astronaut Vital System
            </h1>
            <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono tracking-widest bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 rounded">
              SPACE APPS
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span>CDR ALEX VANCE</span>
            <span className="text-slate-600">|</span>
            <span>ARTEMIS VII EVA-3</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400 font-semibold">{formatMet(elapsedSeconds)}</span>
          </div>
        </div>
      </div>

      {/* Middle: Vital Status Pill */}
      <div className="flex items-center">
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-medium transition-colors duration-300 ${statusBadge.bg}`}>
          {statusBadge.icon}
          <span>{statusBadge.label}</span>
        </div>
      </div>

      {/* Right: Action Utilities */}
      <div className="flex items-center gap-1.5">
        {/* 3D Model URL Config Modal Button */}
        <button
          onClick={openModelModal}
          title="Configure / Swap 3D Model URL"
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-slate-300 bg-slate-900/80 hover:bg-slate-800 hover:text-cyan-300 border border-slate-700/80 rounded-md transition-colors"
        >
          <Box className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline">3D Model</span>
        </button>

        {/* Audio Mute/Unmute */}
        <button
          onClick={toggleAudio}
          title={audioMuted ? 'Unmute Biometric Synthesizer' : 'Mute Biometric Synthesizer'}
          className={`p-1.5 rounded-md border text-xs font-mono transition-colors ${
            audioMuted
              ? 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
              : 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40 hover:bg-cyan-900/60'
          }`}
        >
          {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Zen Mode / Toggle HUD visibility */}
        <button
          onClick={() => setIsUiCollapsed((prev) => !prev)}
          title={isUiCollapsed ? 'Show HUD Panels' : 'Cinema Mode (Hide HUD)'}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-slate-300 bg-slate-900/80 hover:bg-slate-800 hover:text-cyan-300 border border-slate-700/80 rounded-md transition-colors"
        >
          {isUiCollapsed ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{isUiCollapsed ? 'Show HUD' : 'Zen View'}</span>
        </button>
      </div>
    </header>
  );
};
