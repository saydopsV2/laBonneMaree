import React, { useState, useEffect } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';

interface Port {
  name: string;
  type: string;
  altitude: number;
}

interface PortSelectorProps {
  selectedPort: Port | null;
  onPortChange: (port: Port) => void;
}

export default function PortSelector({ selectedPort, onPortChange }: PortSelectorProps) {
  const [ports, setPorts] = useState<Port[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Simulation du chargement des ports depuis ports.txt
    const mockPorts: Port[] = [
      { name: "Arcachon Port de Plaisance", type: "Port", altitude: 3.0 },
      { name: "Arcachon Port de Travail", type: "Port", altitude: 2.8 },
      { name: "La Teste", type: "Port", altitude: 0 },
      { name: "La Teste", type: "Cale", altitude: -0.8 },      
      { name: "Gujan Larros", type: "Port", altitude: -1 },
      { name: "Arès Port", type: "Port", altitude: 1.0 },
      { name: "Port de la Vigne", type: "Port", altitude: 2.3 },
    ];
    setPorts(mockPorts);
  }, []);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <MapPin className="w-4 h-4 inline mr-2" />
        Port ou cale de mise à l'eau
      </label>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <div>
          {selectedPort ? (
            <>
              <span className="font-medium">{selectedPort.name}</span>
              <span className="text-sm text-gray-500 ml-2">
                ({selectedPort.type}, {selectedPort.altitude.toFixed(1)}m Côte Marine)
              </span>
            </>
          ) : (
            <span className="text-gray-500">Sélectionner un port...</span>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          {ports.map((port, index) => (
            <button
              key={index}
              onClick={() => {
                onPortChange(port);
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium">{port.name}</div>
              <div className="text-sm text-gray-500">
                {port.type} - Altitude: {port.altitude.toFixed(1)}m Côte Marine
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}