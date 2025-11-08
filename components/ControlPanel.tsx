
import React, { useState } from 'react';

interface ControlPanelProps {
  onTriggerBrake: () => void;
  selectedVehicleId: string | null;
  simulationRunning: boolean;
  onToggleSimulation: () => void;
  onReset: () => void;
  onGenerateScenario: (prompt: string) => void;
  isLoading: boolean;
}

const presetPrompts = [
    "A fast car approaching a slow-moving truck in the same lane.",
    "Two cars side-by-side with another one trying to merge between them.",
    "Heavy traffic with all cars moving slowly.",
    "A single car speeding on an empty highway at night.",
];

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onTriggerBrake,
  selectedVehicleId,
  simulationRunning,
  onToggleSimulation,
  onReset,
  onGenerateScenario,
  isLoading
}) => {
  const [prompt, setPrompt] = useState<string>('');

  const handleGenerate = () => {
    if (prompt.trim()) {
        onGenerateScenario(prompt);
    }
  };
  
  const handlePreset = (preset: string) => {
    setPrompt(preset);
    onGenerateScenario(preset);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Simulation Controls */}
        <div className="space-y-2">
            <h3 className="font-bold text-lg text-blue-300">Simulation Controls</h3>
            <div className="flex gap-2">
                <button onClick={onToggleSimulation} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2">
                    {simulationRunning ? (
                      <><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v4a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg> Pause</>
                    ) : (
                      <><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg> Play</>
                    )}
                </button>
                <button onClick={onReset} className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm10 8a1 1 0 011-1h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 111.885-.666A5.002 5.002 0 0014.001 13H11a1 1 0 01-1-1z" clipRule="evenodd" /></svg> Reset
                </button>
            </div>
            <button
                onClick={onTriggerBrake}
                disabled={!selectedVehicleId || !simulationRunning}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 disabled:bg-red-900 disabled:cursor-not-allowed disabled:text-gray-400"
            >
                Trigger Sudden Brake for {selectedVehicleId || '...'}
            </button>
        </div>

        {/* AI Scenario Generator */}
        <div className="space-y-2 md:col-span-2">
            <h3 className="font-bold text-lg text-blue-300">AI Scenario Generator</h3>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe a traffic scenario..."
                    className="flex-grow bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                />
                <button onClick={handleGenerate} disabled={isLoading || !prompt.trim()} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 disabled:bg-green-900 disabled:cursor-not-allowed flex items-center justify-center">
                    {isLoading ? <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : 'Generate'}
                </button>
            </div>
             <div className="flex flex-wrap gap-2 text-sm">
                {presetPrompts.map(p => (
                    <button key={p} onClick={() => handlePreset(p)} disabled={isLoading} className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded-md text-xs transition-colors duration-200 disabled:opacity-50">
                        {p}
                    </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
