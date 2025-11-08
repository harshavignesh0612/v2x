
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { SimulationCanvas } from './components/SimulationCanvas';
import { ControlPanel } from './components/ControlPanel';
import { LogPanel } from './components/LogPanel';
import { Vehicle, LogEntry, VehicleStatus } from './types';
import { generateScenarioFromPrompt } from './services/geminiService';

const SIMULATION_WIDTH = 1200;
const COMMUNICATION_RANGE = 250;
const LANE_HEIGHT = 80;

const initialVehicles: Vehicle[] = [
  { id: 'V1', x: 100, y: LANE_HEIGHT * 2.5, speed: 1.5, status: 'NORMAL', color: 'blue-500', alertTimer: 0, targetSpeed: 1.5 },
  { id: 'V2', x: 400, y: LANE_HEIGHT * 2.5, speed: 1.5, status: 'NORMAL', color: 'green-500', alertTimer: 0, targetSpeed: 1.5 },
  { id: 'V3', x: 250, y: LANE_HEIGHT * 1.5, speed: 1.8, status: 'NORMAL', color: 'purple-500', alertTimer: 0, targetSpeed: 1.8 },
  { id: 'V4', x: 50, y: LANE_HEIGHT * 0.5, speed: 2, status: 'NORMAL', color: 'yellow-500', alertTimer: 0, targetSpeed: 2 },
];

const App: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>('V1');
  const [simulationRunning, setSimulationRunning] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const requestRef = useRef<number>();

  const addLog = useCallback((message: string, vehicleId?: string) => {
    setLogs(prev => [{ timestamp: new Date(), message, vehicleId }, ...prev.slice(0, 99)]);
  }, []);

  const triggerBrakeEvent = useCallback((vehicleId: string) => {
    addLog(`EVENT: Vehicle ${vehicleId} initiated a SUDDEN BRAKE.`, vehicleId);
    setVehicles(prev => prev.map(v => v.id === vehicleId ? { ...v, status: 'BRAKING', targetSpeed: 0, speed: 0 } : v));

    const brakingVehicle = vehicles.find(v => v.id === vehicleId);
    if (!brakingVehicle) return;

    // V2V Communication
    vehicles.forEach(otherVehicle => {
      if (otherVehicle.id === vehicleId) return;
      const distance = Math.abs(brakingVehicle.x - otherVehicle.x);
      if (distance <= COMMUNICATION_RANGE) {
        addLog(`V2V: ${vehicleId} -> ${otherVehicle.id} [BRAKE_WARNING]`, otherVehicle.id);
        setVehicles(prev => prev.map(v => v.id === otherVehicle.id ? { ...v, status: 'ALERT', alertTimer: 100, targetSpeed: v.speed * 0.5 } : v));
      }
    });
  }, [vehicles, addLog]);

  const updateSimulation = useCallback(() => {
    if (!simulationRunning) return;
    setVehicles(prevVehicles =>
      prevVehicles.map(v => {
        let { x, speed, status, alertTimer, targetSpeed } = v;

        // Smoothly adjust speed to target speed
        if (speed < targetSpeed) {
          speed = Math.min(targetSpeed, speed + 0.05);
        } else if (speed > targetSpeed) {
          speed = Math.max(targetSpeed, speed - 0.05);
        }
        
        x += speed;
        if (x > SIMULATION_WIDTH + 50) {
          x = -50;
        }

        if (status === 'ALERT') {
          alertTimer -= 1;
          if (alertTimer <= 0) {
            status = 'NORMAL';
            targetSpeed = (v.y / LANE_HEIGHT) < 1 ? 2 : ((v.y / LANE_HEIGHT) < 2 ? 1.8 : 1.5); // Reset to default speed for lane
          }
        }
        
        return { ...v, x, speed, status, alertTimer, targetSpeed };
      })
    );
    requestRef.current = requestAnimationFrame(updateSimulation);
  }, [simulationRunning]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateSimulation);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [updateSimulation]);

  const handleGenerateScenario = async (prompt: string) => {
    setIsLoading(true);
    addLog(`AI: Generating new scenario from prompt: "${prompt}"`);
    try {
        const newVehiclesConfig = await generateScenarioFromPrompt(prompt);
        const newVehicles: Vehicle[] = newVehiclesConfig.map(config => ({
            id: config.id,
            x: config.x * (SIMULATION_WIDTH / 100), // Scale x from 0-100 to simulation width
            y: LANE_HEIGHT * (3 - config.lane + 0.5), // lane 1 -> y=2.5*h, 2->1.5*h, 3->0.5*h
            speed: config.speed / 5, // Scale speed
            targetSpeed: config.speed / 5,
            status: 'NORMAL',
            color: `${config.color.toLowerCase()}-500`,
            alertTimer: 0,
        }));
        setVehicles(newVehicles);
        setSelectedVehicleId(newVehicles.length > 0 ? newVehicles[0].id : null);
        addLog(`AI: Scenario generated successfully with ${newVehicles.length} vehicles.`);
    } catch (error) {
        console.error("Failed to generate scenario:", error);
        addLog(`AI: Error - Could not generate scenario. Please try again.`);
    } finally {
        setIsLoading(false);
    }
  };
  
  const resetSimulation = () => {
    addLog("SYSTEM: Simulation reset to initial state.");
    setVehicles(initialVehicles);
    setSelectedVehicleId('V1');
    setLogs([]);
  }

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen font-sans flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col lg:flex-row p-4 gap-4">
        <div className="flex-grow flex flex-col gap-4">
          <SimulationCanvas 
            vehicles={vehicles} 
            selectedVehicleId={selectedVehicleId}
            onVehicleSelect={setSelectedVehicleId}
            communicationRange={COMMUNICATION_RANGE}
          />
          <ControlPanel 
            onTriggerBrake={() => selectedVehicleId && triggerBrakeEvent(selectedVehicleId)}
            selectedVehicleId={selectedVehicleId}
            simulationRunning={simulationRunning}
            onToggleSimulation={() => setSimulationRunning(prev => !prev)}
            onReset={resetSimulation}
            onGenerateScenario={handleGenerateScenario}
            isLoading={isLoading}
          />
        </div>
        <LogPanel logs={logs} />
      </main>
    </div>
  );
};

export default App;
