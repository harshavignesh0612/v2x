
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm p-4 border-b border-gray-700 w-full">
      <div className="container mx-auto flex items-center gap-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a7.5 7.5 0 0110.606 0M15.889 9.172a3.5 3.5 0 014.95 0M4.111 9.172a3.5 3.5 0 004.95 0" />
        </svg>
        <h1 className="text-2xl font-bold text-white tracking-wider">
          V2X Communication Simulator
        </h1>
      </div>
    </header>
  );
};
