
import React from 'react';
import { Vehicle } from '../types';
import { VehicleComponent } from './Vehicle';

interface SimulationCanvasProps {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onVehicleSelect: (id: string) => void;
  communicationRange: number;
}

export const SimulationCanvas: React.FC<SimulationCanvasProps> = ({ vehicles, selectedVehicleId, onVehicleSelect, communicationRange }) => {
  const brakingVehicle = vehicles.find(v => v.status === 'BRAKING');

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex-grow relative overflow-hidden">
      <svg width="100%" height="240" viewBox="0 0 1200 240" preserveAspectRatio="xMidYMid meet">
        {/* Road Background */}
        <rect x="0" y="0" width="1200" height="240" fill="#2D3748" />

        {/* Lane Lines */}
        {[1, 2].map(i => (
          <line
            key={i}
            x1="0"
            y1={i * 80}
            x2="1200"
            y2={i * 80}
            stroke="#A0AEC0"
            strokeWidth="3"
            strokeDasharray="20 20"
          />
        ))}

        {/* Communication Range Indicator */}
        {brakingVehicle && (
          <circle 
            cx={brakingVehicle.x} 
            cy={brakingVehicle.y} 
            r={communicationRange}
            fill="rgba(239, 68, 68, 0.1)"
            stroke="rgba(239, 68, 68, 0.5)"
            strokeWidth="2"
            strokeDasharray="5 5"
          >
            <animate 
              attributeName="r"
              from="0"
              to={communicationRange}
              dur="0.5s"
              fill="freeze"
            />
          </circle>
        )}

        {/* Vehicles */}
        {vehicles.map(vehicle => (
          <VehicleComponent
            key={vehicle.id}
            vehicle={vehicle}
            isSelected={vehicle.id === selectedVehicleId}
            onClick={() => onVehicleSelect(vehicle.id)}
          />
        ))}
      </svg>
      <div className="absolute top-2 left-2 bg-black/50 p-1 px-2 rounded-md text-xs text-gray-300">
        3-LANE HIGHWAY
      </div>
    </div>
  );
};
