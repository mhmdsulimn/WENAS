import React from 'react';
import { Camera, User, Crosshair, Radio, Shield } from 'lucide-react';
import { CameraViewPreset } from '../../state/useVitalStore';

interface CameraControlsProps {
  currentView: CameraViewPreset;
  onSelectView: (view: CameraViewPreset) => void;
}

export const CameraControls: React.FC<CameraControlsProps> = ({ currentView, onSelectView }) => {
  const views: { id: CameraViewPreset; label: string; icon: React.ReactNode }[] = [
    { id: 'full', label: 'Full Orbit', icon: <User className="w-3 h-3" /> },
    { id: 'visor', label: 'Visor HUD', icon: <Crosshair className="w-3 h-3" /> },
    { id: 'chest', label: 'Biometrics Core', icon: <Radio className="w-3 h-3" /> },
    { id: 'plss', label: 'PLSS Life Support', icon: <Shield className="w-3 h-3" /> },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-slate-950/70 border border-slate-800/80 rounded-xl backdrop-blur-md">
      <div className="px-2 py-1 text-[10px] font-mono text-slate-400 flex items-center gap-1 border-r border-slate-800 mr-0.5">
        <Camera className="w-3 h-3 text-cyan-400" />
        <span className="hidden sm:inline">CAM</span>
      </div>
      {views.map((v) => (
        <button
          key={v.id}
          onClick={() => onSelectView(v.id)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
            currentView === v.id
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          {v.icon}
          <span className="text-[11px]">{v.label}</span>
        </button>
      ))}
    </div>
  );
};
