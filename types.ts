
export type VehicleStatus = 'NORMAL' | 'BRAKING' | 'ALERT';

export interface Vehicle {
  id: string;
  x: number;
  y: number;
  speed: number;
  targetSpeed: number;
  status: VehicleStatus;
  color: string;
  alertTimer: number; // A countdown for how long the alert status lasts
}

export interface LogEntry {
  timestamp: Date;
  message: string;
  vehicleId?: string;
}

export interface GeminiVehicleConfig {
    id: string;
    x: number; // 0-100
    lane: number; // 1, 2, or 3
    speed: number; // e.g. 1-10
    color: string;
}
