import React from 'react';
import { Bell, Sparkles, Volume2, PauseCircle, Wind, ShieldAlert, Check } from 'lucide-react';
import { InterventionStatus, VitalStatus } from '../../types/vitals';

interface InterventionBannerProps {
  intervention: InterventionStatus;
  status: VitalStatus;
}

export const InterventionBanner: React.FC<InterventionBannerProps> = ({ intervention, status }) => {
  const getBannerConfig = () => {
    switch (status) {
      case 'emergency':
        return {
          bg: 'bg-red-950/80 border-red-500/80 text-red-200 shadow-[0_0_30px_rgba(239,68,68,0.25)]',
          badgeBg: 'bg-red-500 text-white',
          icon: <ShieldAlert className="w-5 h-5 text-red-400" />,
        };
      case 'stress':
        return {
          bg: 'bg-amber-950/80 border-amber-500/80 text-amber-200 shadow-[0_0_30px_rgba(245,158,11,0.2)]',
          badgeBg: 'bg-amber-500 text-slate-950 font-bold',
          icon: <Sparkles className="w-5 h-5 text-amber-400" />,
        };
      case 'caffeine':
        return {
          bg: 'bg-cyan-950/80 border-cyan-500/70 text-cyan-200 shadow-[0_0_30px_rgba(6,182,212,0.18)]',
          badgeBg: 'bg-cyan-500 text-slate-950 font-bold',
          icon: <Bell className="w-5 h-5 text-cyan-400" />,
        };
      case 'normal':
      default:
        return {
          bg: 'bg-slate-950/70 border-slate-800/80 text-slate-300',
          badgeBg: 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40',
          icon: <Check className="w-5 h-5 text-emerald-400" />,
        };
    }
  };

  const config = getBannerConfig();

  return (
    <div className={`rounded-xl border p-3.5 backdrop-blur-md transition-all duration-500 ${config.bg}`}>
      {/* Primary Notification Message */}
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-black/40 border border-white/10 shrink-0">
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold tracking-wider uppercase">
              {intervention.title}
            </span>
            <span className="text-[10px] font-mono opacity-60">
              LOGGED @ {intervention.timestamp}
            </span>
          </div>
          <p className="font-mono text-sm font-semibold mt-0.5 tracking-wide text-white">
            {intervention.message}
          </p>
        </div>
      </div>

      {/* Autonomous Countermeasures Sub-Panel */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-2.5 border-t border-white/10 text-[11px] font-mono">
        {/* Countermeasure 1: Audio */}
        <div className={`p-1.5 rounded flex items-center gap-1.5 border ${
          intervention.actions.audioIntervention === 'playing_voice'
            ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-semibold'
            : intervention.actions.audioIntervention === 'alarm_active'
            ? 'bg-red-500/20 border-red-400 text-red-300 font-semibold'
            : 'bg-black/30 border-white/5 text-slate-400'
        }`}>
          <Volume2 className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">
            {intervention.actions.audioIntervention === 'playing_voice'
              ? "Mother's Voice: Active"
              : intervention.actions.audioIntervention === 'alarm_active'
              ? 'Tactical Alarm: On'
              : 'Audio Comm: Standby'}
          </span>
        </div>

        {/* Countermeasure 2: Mint Scent */}
        <div className={`p-1.5 rounded flex items-center gap-1.5 border ${
          intervention.actions.aromatherapyMint === 'dispensing'
            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-semibold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
            : 'bg-black/30 border-white/5 text-slate-400'
        }`}>
          <Wind className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">
            {intervention.actions.aromatherapyMint === 'dispensing'
              ? 'Mint Scent: Releasing'
              : 'Aroma Diffuser: Off'}
          </span>
        </div>

        {/* Countermeasure 3: Media Smart Penalty */}
        <div className={`p-1.5 rounded flex items-center gap-1.5 border ${
          intervention.actions.mediaSystem === 'paused'
            ? 'bg-red-500/20 border-red-400 text-red-300 font-semibold shadow-[0_0_12px_rgba(239,68,68,0.3)]'
            : 'bg-black/30 border-white/5 text-slate-400'
        }`}>
          <PauseCircle className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">
            {intervention.actions.mediaSystem === 'paused'
              ? 'Smart Penalty: Media Paused'
              : 'Media System: Active'}
          </span>
        </div>

        {/* Countermeasure 4: O2 Routing */}
        <div className={`p-1.5 rounded flex items-center gap-1.5 border ${
          intervention.actions.oxygenBoost === 'critical_reserve'
            ? 'bg-red-500/20 border-red-400 text-red-300 font-semibold'
            : intervention.actions.oxygenBoost === 'enriched'
            ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-semibold'
            : 'bg-black/30 border-white/5 text-slate-400'
        }`}>
          <Wind className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">
            {intervention.actions.oxygenBoost === 'critical_reserve'
              ? 'O2: Critical Reserve'
              : intervention.actions.oxygenBoost === 'enriched'
              ? 'O2: +15% Enriched'
              : 'O2 Route: Nominal'}
          </span>
        </div>
      </div>
    </div>
  );
};
