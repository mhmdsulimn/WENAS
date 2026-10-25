export type VitalStatus = 'normal' | 'caffeine' | 'stress' | 'emergency';

export interface VitalSignMetrics {
  heartRate: number; // BPM
  oxygenSaturation: number; // SpO2 %
  coreTemperature: number; // °C
  respirationRate: number; // Breaths/min
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  suitPressure: number; // kPa
}

export interface SweatBiomarkers {
  caffeineDetected: boolean;
  caffeineLevel: number; // mg/L
  cortisolLevel: number; // μg/dL (Stress hormone)
  hydrationLevel: number; // %
  electrolyteBalance: number; // mmol/L
  lacticAcid: number; // mmol/L
}

export interface InterventionStatus {
  active: boolean;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical' | 'normal';
  timestamp: string;
  actions: {
    audioIntervention: 'idle' | 'playing_voice' | 'alarm_active';
    aromatherapyMint: 'off' | 'dispensing';
    mediaSystem: 'active' | 'paused' | 'override';
    oxygenBoost: 'normal' | 'enriched' | 'critical_reserve';
  };
}

export interface NotificationLog {
  id: string;
  time: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  title: string;
  details: string;
}
