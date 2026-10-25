import React from 'react';
import { History, ShieldAlert, Sparkles, Coffee, CheckCircle } from 'lucide-react';
import { NotificationLog } from '../../types/vitals';

interface NotificationLogsDrawerProps {
  logs: NotificationLog[];
  isOpen: boolean;
  onToggle: () => void;
}

export const NotificationLogsDrawer: React.FC<NotificationLogsDrawerProps> = ({
  logs,
  isOpen,
  onToggle,
}) => {
  const getIcon = (type: NotificationLog['type']) => {
    switch (type) {
      case 'alert':
        return <ShieldAlert className="w-3.5 h-3.5 text-red-400 shrink-0" />;
      case 'warning':
        return <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case 'info':
        return <Coffee className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
      case 'success':
      default:
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    }
  };

  return (
    <div className="rounded-xl border border-slate-800/80 bg-slate-950/80 p-3 shadow-xl backdrop-blur-md">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-xs font-mono font-semibold text-slate-300 hover:text-white"
      >
        <div className="flex items-center gap-1.5">
          <History className="w-3.5 h-3.5 text-cyan-400" />
          <span>AUTONOMOUS INTERVENTION TELEMETRY LOG</span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">
          {isOpen ? '[ COLLAPSE ]' : `[ ${logs.length} EVENTS ]`}
        </span>
      </button>

      {isOpen && (
        <div className="mt-2.5 max-h-40 overflow-y-auto space-y-1.5 pr-1 text-[11px] font-mono border-t border-slate-800/60 pt-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-1.5 rounded bg-slate-900/50 border border-slate-800/60 flex items-start gap-2"
            >
              {getIcon(log.type)}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-semibold text-slate-200 truncate">{log.title}</span>
                  <span className="text-[9px] text-slate-500 shrink-0">{log.time}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{log.details}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
