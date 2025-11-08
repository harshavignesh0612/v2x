
import React from 'react';
import { Vehicle } from '../types';
import { CarIcon } from './icons/CarIcon';
import { AlertIcon } from './icons/AlertIcon';

interface VehicleProps {
  vehicle: Vehicle;
  isSelected: boolean;
  onClick: () => void;
}

export const VehicleComponent: React.FC<VehicleProps> = ({ vehicle, isSelected, onClick }) => {
  const { id, x, y, status, color } = vehicle;

  const statusClasses: Record<typeof status, string> = {
    NORMAL: `text-${color}`,
    BRAKING: `text-red-500 animate-pulse`,
    ALERT: `text-orange-400`,
  };

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      className="cursor-pointer transition-transform duration-100 ease-linear"
    >
      <CarIcon className={`w-16 h-16 transform -translate-x-8 -translate-y-8 ${statusClasses[status]}`} />

      {isSelected && (
        <g>
          <circle cx="0" cy="0" r="25" fill="none" stroke="cyan" strokeWidth="2" />
          <animateTransform 
              attributeName="transform"
              attributeType="XML"
              type="rotate"
              from="0 0 0"
              to="360 0 0"
              dur="2s"
              repeatCount="indefinite"
          />
        </g>
      )}

      {status === 'ALERT' && (
        <g transform="translate(0, -30)">
          <AlertIcon className="w-5 h-5 text-orange-400 animate-bounce" />
        </g>
      )}

      {status === 'BRAKING' && (
        <g transform="translate(0, -30)">
          <AlertIcon className="w-5 h-5 text-red-500 animate-ping absolute" />
          <AlertIcon className="w-5 h-5 text-red-500" />
        </g>
      )}

      <text x="0" y="25" textAnchor="middle" fill="white" fontSize="12px" fontWeight="bold">
        {id}
      </text>
    </g>
  );
};
