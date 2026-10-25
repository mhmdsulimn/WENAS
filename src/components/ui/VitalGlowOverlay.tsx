import React from 'react';
import { VitalStatus } from '../../types/vitals';

interface VitalGlowOverlayProps {
  status: VitalStatus;
}

export const VitalGlowOverlay: React.FC<VitalGlowOverlayProps> = ({ status }) => {
  // Glow configuration depending on vital status
  const getGlowStyles = () => {
    switch (status) {
      case 'emergency':
        return {
          glow: 'inset 0 0 90px rgba(239, 68, 68, 0.28), 0 0 60px rgba(239, 68, 68, 0.15)',
          border: 'border-red-500/30',
          accent: 'text-red-400',
        };
      case 'stress':
        return {
          glow: 'inset 0 0 70px rgba(245, 158, 11, 0.2), 0 0 45px rgba(245, 158, 11, 0.12)',
          border: 'border-amber-500/30',
          accent: 'text-amber-400',
        };
      case 'caffeine':
        return {
          glow: 'inset 0 0 50px rgba(6, 182, 212, 0.18), 0 0 35px rgba(6, 182, 212, 0.1)',
          border: 'border-cyan-500/30',
          accent: 'text-cyan-400',
        };
      case 'normal':
      default:
        return {
          glow: 'inset 0 0 40px rgba(0, 240, 255, 0.1), 0 0 25px rgba(0, 240, 255, 0.05)',
          border: 'border-cyan-500/20',
          accent: 'text-cyan-400',
        };
    }
  };

  const styleConfig = getGlowStyles();

  return (
    <div
      className="absolute inset-0 pointer-events-none transition-all duration-700 select-none overflow-hidden"
      style={{
        boxShadow: styleConfig.glow,
        zIndex: 5,
      }}
    >
      {/* Sci-Fi HUD Corner Brackets */}
      <div className={`absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 ${styleConfig.border} transition-colors duration-500`} />
      <div className={`absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 ${styleConfig.border} transition-colors duration-500`} />
      <div className={`absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 ${styleConfig.border} transition-colors duration-500`} />
      <div className={`absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 ${styleConfig.border} transition-colors duration-500`} />

      {/* Subtle Tactical HUD Grid Lines */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 flex flex-col gap-1 text-[9px] font-mono tracking-widest text-slate-500/60 uppercase">
        <span>LAT // 28.5721° N</span>
        <span>LON // 80.6480° W</span>
        <span>ALT // 408.2 KM</span>
        <span>ORB // REV-1204</span>
      </div>

      <div className="absolute top-1/2 right-4 -translate-y-1/2 text-right flex flex-col gap-1 text-[9px] font-mono tracking-widest text-slate-500/60 uppercase">
        <span>BIO-LINK // ENCRYPTED</span>
        <span>SWEAT PATCH // ONLINE</span>
        <span>TELEM // LOW-LATENCY</span>
        <span>STATUS // {status.toUpperCase()}</span>
      </div>
    </div>
  );
};
