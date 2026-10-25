import { useState, useEffect, useCallback, useRef } from 'react';
import { VitalStatus, VitalSignMetrics, SweatBiomarkers, InterventionStatus, NotificationLog } from '../types/vitals';
import { sound } from '../audio/soundSystem';

const BASE_METRICS: Record<VitalStatus, { hrMin: number; hrMax: number; o2: number; temp: number; resp: number; bpSys: number; bpDia: number }> = {
  normal: { hrMin: 68, hrMax: 76, o2: 99.1, temp: 37.0, resp: 14, bpSys: 118, bpDia: 76 },
  caffeine: { hrMin: 114, hrMax: 124, o2: 98.8, temp: 37.1, resp: 18, bpSys: 126, bpDia: 80 },
  stress: { hrMin: 98, hrMax: 108, o2: 98.2, temp: 37.3, resp: 21, bpSys: 134, bpDia: 86 },
  emergency: { hrMin: 148, hrMax: 165, o2: 92.4, temp: 38.6, resp: 29, bpSys: 158, bpDia: 98 },
};

const BASE_BIOMARKERS: Record<VitalStatus, SweatBiomarkers> = {
  normal: {
    caffeineDetected: false,
    caffeineLevel: 0.8,
    cortisolLevel: 11.2,
    hydrationLevel: 94,
    electrolyteBalance: 142,
    lacticAcid: 1.2,
  },
  caffeine: {
    caffeineDetected: true,
    caffeineLevel: 28.4, // Spiked caffeine biomarker
    cortisolLevel: 12.8,
    hydrationLevel: 91,
    electrolyteBalance: 139,
    lacticAcid: 1.5,
  },
  stress: {
    caffeineDetected: false,
    caffeineLevel: 1.1,
    cortisolLevel: 36.5, // Spiked stress biomarker
    hydrationLevel: 88,
    electrolyteBalance: 136,
    lacticAcid: 2.1,
  },
  emergency: {
    caffeineDetected: false,
    caffeineLevel: 1.4,
    cortisolLevel: 58.0, // High distress
    hydrationLevel: 78,
    electrolyteBalance: 128,
    lacticAcid: 4.8,
  },
};

export type CameraViewPreset = 'full' | 'visor' | 'chest' | 'plss';

export function useVitalStore() {
  const [status, setStatus] = useState<VitalStatus>('normal');
  const [metrics, setMetrics] = useState<VitalSignMetrics>({
    heartRate: 72,
    oxygenSaturation: 99.1,
    coreTemperature: 37.0,
    respirationRate: 14,
    bloodPressureSystolic: 118,
    bloodPressureDiastolic: 76,
    suitPressure: 29.6, // kPa (standard ISS EMU ~ 4.3 psi)
  });
  const [biomarkers, setBiomarkers] = useState<SweatBiomarkers>(BASE_BIOMARKERS.normal);
  
  const [intervention, setIntervention] = useState<InterventionStatus>({
    active: false,
    title: 'NORMAL HOMEOSTASIS',
    message: 'All vital telemetry within nominal EVA operating parameters.',
    severity: 'normal',
    timestamp: '00:00:00',
    actions: {
      audioIntervention: 'idle',
      aromatherapyMint: 'off',
      mediaSystem: 'active',
      oxygenBoost: 'normal',
    },
  });

  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>([
    {
      id: 'init-1',
      time: '00:01:24',
      type: 'info',
      title: 'Biometric Link Established',
      details: 'Sweat microfluidic sensor array calibrated and synched.',
    },
    {
      id: 'init-2',
      time: '00:02:10',
      type: 'success',
      title: 'EVA Digital Twin Active',
      details: 'Suit telemetry telemetry online. Cardiac rhythm stable.',
    },
  ]);

  const [audioMuted, setAudioMuted] = useState<boolean>(false);
  const [cameraView, setCameraView] = useState<CameraViewPreset>('full');
  const [isUiCollapsed, setIsUiCollapsed] = useState<boolean>(false);
  const [isModelModalOpen, setIsModelModalOpen] = useState<boolean>(false);
  const [activeModelUrl, setActiveModelUrl] = useState<string>(''); // empty means high-performance procedural NASA twin

  const hrTickRef = useRef<number>(72);
  const statusRef = useRef<VitalStatus>(status);
  statusRef.current = status;

  // Add notification helper
  const addLog = useCallback((type: NotificationLog['type'], title: string, details: string) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setNotificationLogs((prev) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        time: timeStr,
        type,
        title,
        details,
      },
      ...prev.slice(0, 19),
    ]);
  }, []);

  // Action: Trigger Normal / Reset
  const triggerReset = useCallback(() => {
    setStatus('normal');
    setBiomarkers(BASE_BIOMARKERS.normal);
    sound.playClick('reset');
    setIntervention({
      active: false,
      title: 'SYSTEM RESTORED: NOMINAL BASELINE',
      message: 'Autonomous counter-measures deactivated. Vitals normalized to 60-80 BPM.',
      severity: 'normal',
      timestamp: new Date().toTimeString().split(' ')[0],
      actions: {
        audioIntervention: 'idle',
        aromatherapyMint: 'off',
        mediaSystem: 'active',
        oxygenBoost: 'normal',
      },
    });
    addLog('success', 'Reset Executed', 'Vital telemetry returned to resting nominal state.');
  }, [addLog]);

  // Action: Caffeine Spike
  const triggerCaffeine = useCallback(() => {
    setStatus('caffeine');
    setBiomarkers(BASE_BIOMARKERS.caffeine);
    sound.playClick('action');
    setIntervention({
      active: true,
      title: 'SWEAT SENSOR: CAFFEINE DETECTED, NO ALARM',
      message: 'Sweat microfluidics identified 28.4 mg/L caffeine metabolite. Heart rate spike confirmed non-pathological.',
      severity: 'info',
      timestamp: new Date().toTimeString().split(' ')[0],
      actions: {
        audioIntervention: 'idle',
        aromatherapyMint: 'off',
        mediaSystem: 'active',
        oxygenBoost: 'normal',
      },
    });
    addLog('info', 'Sweat Sensor: Caffeine Detected, No Alarm', 'Microfluidic patch confirmed caffeine absorption. Tachycardia classified safe.');
  }, [addLog]);

  // Action: Stress Spike
  const triggerStress = useCallback(() => {
    setStatus('stress');
    setBiomarkers(BASE_BIOMARKERS.stress);
    sound.playClick('action');
    sound.playSoothingVoiceAndMintAroma();
    setIntervention({
      active: true,
      title: 'STRESS DETECTED: SMART INTERVENTION PROTOCOL',
      message: "Stress Detected - Playing Mother's Voice & Releasing Mint Scent",
      severity: 'warning',
      timestamp: new Date().toTimeString().split(' ')[0],
      actions: {
        audioIntervention: 'playing_voice',
        aromatherapyMint: 'dispensing',
        mediaSystem: 'active',
        oxygenBoost: 'enriched',
      },
    });
    addLog('warning', "Stress Detected - Playing Mother's Voice & Releasing Mint Scent", 'Cortisol 36.5 μg/dL. Calming audio channel engaged & suit micro-nebulizer open.');
  }, [addLog]);

  // Action: Red Emergency
  const triggerEmergency = useCallback(() => {
    setStatus('emergency');
    setBiomarkers(BASE_BIOMARKERS.emergency);
    sound.playEmergencyAlarm();
    setIntervention({
      active: true,
      title: 'CRITICAL EMERGENCY: SMART PENALTY ACTIVE',
      message: 'Critical Condition - Smart Penalty: Media Paused',
      severity: 'critical',
      timestamp: new Date().toTimeString().split(' ')[0],
      actions: {
        audioIntervention: 'alarm_active',
        aromatherapyMint: 'off',
        mediaSystem: 'paused',
        oxygenBoost: 'critical_reserve',
      },
    });
    addLog('alert', 'Critical Condition - Smart Penalty: Media Paused', 'Severe distress tachycardic alert. Secondary astronaut entertainment systems suspended.');
  }, [addLog]);

  // Continuous physiological micro-oscillation (simulating real human bio-fluctuations)
  useEffect(() => {
    const interval = window.setInterval(() => {
      const currentStatus = statusRef.current;
      const target = BASE_METRICS[currentStatus];
      
      // Random physiological jitter
      const targetHr = target.hrMin + Math.random() * (target.hrMax - target.hrMin);
      hrTickRef.current += (targetHr - hrTickRef.current) * 0.25;
      
      setMetrics((prev) => ({
        heartRate: Math.round(hrTickRef.current),
        oxygenSaturation: Number((target.o2 + (Math.random() * 0.4 - 0.2)).toFixed(1)),
        coreTemperature: Number((target.temp + (Math.random() * 0.1 - 0.05)).toFixed(1)),
        respirationRate: Math.round(target.resp + (Math.random() * 2 - 1)),
        bloodPressureSystolic: Math.round(target.bpSys + (Math.random() * 4 - 2)),
        bloodPressureDiastolic: Math.round(target.bpDia + (Math.random() * 3 - 1.5)),
        suitPressure: Number((29.6 + (Math.random() * 0.1 - 0.05)).toFixed(2)),
      }));
    }, 900);

    return () => window.clearInterval(interval);
  }, []);

  // Periodic heartbeat sound sync when unmuted
  useEffect(() => {
    let timeoutId: number;
    const playNextBeat = () => {
      const bpm = hrTickRef.current;
      const intervalMs = Math.max(300, (60 / bpm) * 1000);
      
      // Only play audible heartbeat blip if not muted and if user interacted
      sound.playHeartbeatPulse();
      timeoutId = window.setTimeout(playNextBeat, intervalMs);
    };

    timeoutId = window.setTimeout(playNextBeat, 1000);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const toggleAudio = useCallback(() => {
    setAudioMuted((prev) => {
      const next = !prev;
      sound.setMuted(next);
      return next;
    });
  }, []);

  return {
    status,
    metrics,
    biomarkers,
    intervention,
    notificationLogs,
    audioMuted,
    toggleAudio,
    cameraView,
    setCameraView,
    isUiCollapsed,
    setIsUiCollapsed,
    isModelModalOpen,
    setIsModelModalOpen,
    activeModelUrl,
    setActiveModelUrl,
    triggerReset,
    triggerCaffeine,
    triggerStress,
    triggerEmergency,
  };
}

export type VitalStore = ReturnType<typeof useVitalStore>;
