
import React from 'react';
import { LogEntry } from '../types';

interface LogPanelProps {
  logs: LogEntry[];
}

export const LogPanel: React.FC<LogPanelProps> = ({ logs }) => {
  return (
    <div className="w-full lg:w-96 bg-gray-800 rounded-lg p-4 border border-gray-700 flex flex-col h-64 lg:h-auto">
      <h2 className="text-xl font-bold text-blue-300 border-b border-gray-700 pb-2 mb-2 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
        Communication Log
      </h2>
      <div className="flex-grow overflow-y-auto pr-2 font-mono text-sm space-y-2">
        {logs.length === 0 && <p className="text-gray-500">Log empty. Start the simulation.</p>}
        {logs.map((log, index) => (
          <div key={index} className="flex gap-2 items-start">
            <span className="text-gray-500">{log.timestamp.toLocaleTimeString()}</span>
            <p className={`flex-1 ${log.message.includes('ERROR') ? 'text-red-400' : log.message.startsWith('V2V') ? 'text-green-400' : 'text-gray-300'}`}>
              {log.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
