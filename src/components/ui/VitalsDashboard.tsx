import React from 'react';
import { Wind, Thermometer, Gauge, Activity, Waves } from 'lucide-react';
import { VitalSignMetrics, VitalStatus } from '../../types/vitals';

interface VitalsDashboardProps {
  metrics: VitalSignMetrics;
  status: VitalStatus;
}

export const VitalsDashboard: React.FC<VitalsDashboardProps> = ({ metrics, status }) => {
  const getStatusColor = (isWarning: boolean, isCritical: boolean) => {
    if (isCritical) return 'text-red-400 border-red-500/40 bg-red-950/20';
    if (isWarning) return 'text-amber-400 border-amber-500/40 bg-amber-950/20';
    return 'text-cyan-400 border-slate-800/80 bg-slate-900/60';
  };

  const isEmergency = status === 'emergency';
  const isStress = status === 'stress';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
      {/* SpO2 Card */}
      <div className={`p-3 rounded-xl border backdrop-blur-md transition-colors ${getStatusColor(false, isEmergency && metrics.oxygenSaturation < 95)}`}>
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-mono tracking-wider">OXYGEN SAT (SpO2)</span>
          <Wind className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-mono text-2xl font-bold text-white tracking-tight">
            {metrics.oxygenSaturation}%
          </span>
          <span className="text-[10px] font-mono text-emerald-400">NOMINAL &gt;95%</span>
        </div>
        <div className="w-full bg-slate-800/80 h-1 rounded-full mt-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${metrics.oxygenSaturation < 95 ? 'bg-red-500' : 'bg-cyan-400'}`}
            style={{ width: `${Math.min(100, metrics.oxygenSaturation)}%` }}
          />
        </div>
      </div>

      {/* Respiration Rate */}
      <div className={`p-3 rounded-xl border backdrop-blur-md transition-colors ${getStatusColor(isStress, isEmergency)}`}>
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-mono tracking-wider">RESPIRATION</span>
          <Waves className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-mono text-2xl font-bold text-white tracking-tight">
            {metrics.respirationRate}
          </span>
          <span className="text-[10px] font-mono text-slate-400">RPM (12-20)</span>
        </div>
        <div className="w-full bg-slate-800/80 h-1 rounded-full mt-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${isEmergency ? 'bg-red-500' : isStress ? 'bg-amber-400' : 'bg-cyan-400'}`}
            style={{ width: `${Math.min(100, (metrics.respirationRate / 35) * 100)}%` }}
          />
        </div>
      </div>

      {/* Blood Pressure */}
      <div className={`p-3 rounded-xl border backdrop-blur-md transition-colors ${getStatusColor(isStress, isEmergency)}`}>
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-mono tracking-wider">BLOOD PRESSURE</span>
          <Activity className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-mono text-2xl font-bold text-white tracking-tight">
            {metrics.bloodPressureSystolic}/{metrics.bloodPressureDiastolic}
          </span>
          <span className="text-[10px] font-mono text-slate-400">mmHg</span>
        </div>
        <p className="text-[10px] font-mono text-slate-400 mt-2">
          MAP: {Math.round((metrics.bloodPressureSystolic + 2 * metrics.bloodPressureDiastolic) / 3)} mmHg
        </p>
      </div>

      {/* Core Body Temp & Suit Pressure */}
      <div className={`p-3 rounded-xl border backdrop-blur-md transition-colors ${getStatusColor(false, isEmergency)}`}>
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-mono tracking-wider">CORE TEMP / SUIT</span>
          <Thermometer className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-2xl font-bold text-white tracking-tight">
              {metrics.coreTemperature}°
            </span>
            <span className="text-[10px] font-mono text-slate-400">C</span>
          </div>
          <div className="text-right">
            <span className="font-mono text-xs font-semibold text-cyan-300">
              {metrics.suitPressure}
            </span>
            <span className="text-[9px] font-mono text-slate-400 ml-0.5">kPa</span>
          </div>
        </div>
        <p className="text-[10px] font-mono text-emerald-400 mt-2 flex items-center gap-1">
          <Gauge className="w-3 h-3 inline" /> EMU EMU Pressure 4.3 psi
        </p>
      </div>
    </div>
  );
};
