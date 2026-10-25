import React, { useEffect, useRef } from 'react';
import { Heart, Activity } from 'lucide-react';
import { VitalStatus } from '../../types/vitals';

interface EcgWaveformProps {
  status: VitalStatus;
  heartRate: number;
}

export const EcgWaveform: React.FC<EcgWaveformProps> = ({ status, heartRate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const statusRef = useRef<VitalStatus>(status);
  const hrRef = useRef<number>(heartRate);

  statusRef.current = status;
  hrRef.current = heartRate;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let x = 0;
    let cyclePhase = 0; // 0 to 1 representing one cardiac cycle

    // Trace buffer to draw fading continuous oscilloscope trail
    const points: { x: number; y: number; alpha: number; color: string }[] = [];

    const getColor = (s: VitalStatus) => {
      switch (s) {
        case 'emergency':
          return { main: '#ef4444', glow: 'rgba(239, 68, 68, 0.45)' };
        case 'stress':
          return { main: '#f59e0b', glow: 'rgba(245, 158, 11, 0.45)' };
        case 'caffeine':
          return { main: '#00e1ff', glow: 'rgba(0, 225, 255, 0.45)' };
        case 'normal':
        default:
          return { main: '#00f0ff', glow: 'rgba(0, 240, 255, 0.45)' };
      }
    };

    // Cardiac P-Q-R-S-T synthesis function
    const getCardiacY = (phase: number, baseH: number, s: VitalStatus): number => {
      const mid = baseH / 2;
      const amp = s === 'emergency' ? 1.4 : s === 'caffeine' ? 1.25 : 1.0;

      // P wave (atrial depolarization)
      if (phase >= 0.1 && phase < 0.22) {
        const pNorm = (phase - 0.1) / 0.12;
        return mid - Math.sin(pNorm * Math.PI) * 12 * amp;
      }
      // PR segment (flat baseline)
      if (phase >= 0.22 && phase < 0.32) {
        return mid;
      }
      // Q wave (initial septal deflection)
      if (phase >= 0.32 && phase < 0.36) {
        const qNorm = (phase - 0.32) / 0.04;
        return mid + Math.sin(qNorm * Math.PI) * 8 * amp;
      }
      // R wave (massive ventricular depolarization spike)
      if (phase >= 0.36 && phase < 0.44) {
        const rNorm = (phase - 0.36) / 0.08;
        return mid - Math.sin(rNorm * Math.PI) * 58 * amp;
      }
      // S wave (negative deflection)
      if (phase >= 0.44 && phase < 0.49) {
        const sNorm = (phase - 0.44) / 0.05;
        return mid + Math.sin(sNorm * Math.PI) * 16 * amp;
      }
      // ST segment
      if (phase >= 0.49 && phase < 0.58) {
        return mid;
      }
      // T wave (ventricular repolarization)
      if (phase >= 0.58 && phase < 0.76) {
        const tNorm = (phase - 0.58) / 0.18;
        return mid - Math.sin(tNorm * Math.PI) * 20 * amp;
      }
      // Baseline / Isoelectric phase
      return mid + (Math.random() * 2 - 1);
    };

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const currentS = statusRef.current;
      const currentHr = hrRef.current;
      const colors = getColor(currentS);

      // Fade out previous trace
      ctx.fillStyle = 'rgba(5, 11, 24, 0.18)';
      ctx.fillRect(0, 0, width, height);

      // Render subtle ECG oscilloscope grid lines
      ctx.strokeStyle = 'rgba(15, 35, 60, 0.35)';
      ctx.lineWidth = 1;

      // Draw horizontal grid lines
      for (let gy = 20; gy < height; gy += 25) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
        ctx.stroke();
      }
      // Draw vertical grid lines
      for (let gx = 0; gx < width; gx += 30) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
        ctx.stroke();
      }

      // Advance cardiac cycle
      // BPM / 60 = beats per second. Frame rate ~ 60fps
      const beatsPerSecond = currentHr / 60;
      const phaseDelta = beatsPerSecond / 60;
      cyclePhase = (cyclePhase + phaseDelta) % 1;

      // Advance oscilloscope X position
      const speed = width / (60 * (60 / currentHr)); // sweeps across screen relative to heart rate
      x += Math.max(2, speed);

      // Wrap around when reaching right boundary
      if (x >= width) {
        x = 0;
      }

      // Clear upcoming slice ahead of lead scanline
      ctx.fillStyle = 'rgb(5, 11, 24)';
      ctx.fillRect(x, 0, 22, height);

      const y = getCardiacY(cyclePhase, height, currentS);

      // Store in trace buffer
      points.push({ x, y, alpha: 1.0, color: colors.main });
      if (points.length > 250) {
        points.shift();
      }

      // Draw luminous trace
      if (points.length > 2) {
        ctx.save();
        ctx.lineWidth = 2.4;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.shadowColor = colors.main;
        ctx.shadowBlur = 8;
        ctx.strokeStyle = colors.main;

        ctx.beginPath();
        let isStarted = false;
        for (let i = 0; i < points.length; i++) {
          const pt = points[i];
          // Don't connect wrap-around jump
          if (i > 0 && Math.abs(pt.x - points[i - 1].x) > 30) {
            ctx.stroke();
            ctx.beginPath();
            isStarted = false;
          }
          if (!isStarted) {
            ctx.moveTo(pt.x, pt.y);
            isStarted = true;
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }
        ctx.stroke();

        // Glowing scanning point at current lead
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = colors.main;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const getRhythmLabel = () => {
    switch (status) {
      case 'emergency':
        return {
          title: 'CRITICAL TACHYCARDIA // HIGH STRESS',
          desc: 'HR > 145 BPM - Smart Penalty Interventions Active',
          color: 'text-red-400',
        };
      case 'stress':
        return {
          title: 'STRESS-INDUCED TACHYCARDIA',
          desc: 'HR Elevated with Cortisol Spike (Aromatherapy Active)',
          color: 'text-amber-400',
        };
      case 'caffeine':
        return {
          title: 'PHYSIOLOGICAL CAFFEINE TACHYCARDIA',
          desc: 'Elevated HR - Sweat sensor: Caffeine confirmed safe',
          color: 'text-cyan-400',
        };
      case 'normal':
      default:
        return {
          title: 'NORMAL SINUS RHYTHM',
          desc: 'Nominal resting baseline: 60 - 80 BPM',
          color: 'text-emerald-400',
        };
    }
  };

  const rhythm = getRhythmLabel();

  return (
    <div className="relative rounded-xl border border-slate-800/80 bg-slate-950/80 p-3.5 shadow-xl backdrop-blur-md overflow-hidden">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-950/70 border border-cyan-500/30">
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold tracking-wider text-slate-200">
                LEAD-II TELEMETRY ECG
              </span>
              <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-slate-800 text-slate-400">
                25mm/s
              </span>
            </div>
            <p className={`text-[11px] font-mono font-medium ${rhythm.color}`}>
              {rhythm.title}
            </p>
          </div>
        </div>

        {/* Big BPM Counter with Heart icon */}
        <div className="flex items-baseline gap-2">
          <Heart className={`w-5 h-5 transition-transform ${status === 'emergency' ? 'text-red-500 animate-bounce' : status === 'stress' ? 'text-amber-400' : 'text-cyan-400'}`} />
          <div className="text-right">
            <span className="font-mono text-3xl font-bold tracking-tight text-white">
              {heartRate}
            </span>
            <span className="ml-1 text-xs font-mono text-slate-400">BPM</span>
          </div>
        </div>
      </div>

      {/* Real-time Oscilloscope Canvas */}
      <div className="relative w-full h-28 bg-[#030814] rounded-lg border border-slate-800/70 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={460}
          height={112}
          className="w-full h-full block"
        />
        {/* Subtle Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.35)_51%)] bg-[length:100%_4px] opacity-40" />
      </div>

      {/* Telemetry Footer */}
      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800/60 text-[10px] font-mono text-slate-400">
        <span>PR: 148ms | QRS: 82ms | QTc: 410ms</span>
        <span className="text-slate-300 font-medium">{rhythm.desc}</span>
      </div>
    </div>
  );
};
