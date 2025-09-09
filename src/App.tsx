import React, { useState, useEffect } from 'react';
import { Waves, Settings, Bell } from 'lucide-react';
import BoatDepthOverlay from './components/BoatDepthOverlay';
import TideInfoPanel from './components/TideInfoPanel';
import PortSelector from './components/PortSelector';
import BoatConfig from './components/BoatConfig';
import { useTideData } from './hooks/useTideData';

interface Port {
  name: string;
  type: string;
  altitude: number;
}

function App() {
  const [selectedPort, setSelectedPort] = useState<Port | null>(null);
  const [boatType, setBoatType] = useState<'motor' | 'sail'>('motor');
  const [draft, setDraft] = useState(1.5);
  const [showConfig, setShowConfig] = useState(true);

  const { tideData } = useTideData(selectedPort?.altitude || 0);

  // Persistence des préférences
  useEffect(() => {
    const saved = localStorage.getItem('bonne-maree-config');
    if (saved) {
      const config = JSON.parse(saved);
      if (config.selectedPort) setSelectedPort(config.selectedPort);
      if (config.boatType) setBoatType(config.boatType);
      if (config.draft) setDraft(config.draft);
      setShowConfig(false);
    }
  }, []);

  useEffect(() => {
    if (selectedPort) {
      localStorage.setItem('bonne-maree-config', JSON.stringify({
        selectedPort,
        boatType,
        draft
      }));
    }
  }, [selectedPort, boatType, draft]);

  // Enregistrement du service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  }, []);

  const calculateSafetyStatus = () => {
    if (!tideData) return 'safe';
    const threshold = draft + 0.5;
    if (tideData.currentDepth < threshold) return 'danger';
    if (tideData.currentDepth < threshold + 0.3) return 'warning';
    return 'safe';
  };

  const calculateTimeToLimit = () => {
    // Simulation du calcul du temps restant
    return '2h 15min';
  };

  const tideInfo = tideData ? {
    currentHeight: tideData.currentHeight,
    currentDepth: tideData.currentDepth,
    clearance: Math.max(0, tideData.currentDepth - draft),
    nextPM: tideData.nextPM,
    nextBM: tideData.nextBM,
    coefficient: tideData.coefficient,
    timeToSafetyLimit: calculateTimeToLimit(),
    status: calculateSafetyStatus() as 'safe' | 'warning' | 'danger'
  } : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-cyan-50 to-blue-200">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Waves className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">La Bonne Marée</h1>
                <p className="text-sm text-gray-600">Bassin d'Arcachon</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowConfig(!showConfig)}
                className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50">
                <Bell className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {showConfig ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Configuration de votre embarcation
              </h2>
              
              <div className="space-y-6">
                <PortSelector
                  selectedPort={selectedPort}
                  onPortChange={setSelectedPort}
                />
                
                <BoatConfig
                  boatType={boatType}
                  draft={draft}
                  onBoatTypeChange={setBoatType}
                  onDraftChange={setDraft}
                />
                
                {selectedPort && (
                  <button
                    onClick={() => setShowConfig(false)}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Valider la configuration
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            {selectedPort && tideInfo ? (
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Visualisation principale */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          {selectedPort.name}
                        </h2>
                        <p className="text-gray-600">
                          {selectedPort.type} - Altitude: {selectedPort.altitude.toFixed(1)}m Côte Marine
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Tirant d'eau</p>
                        <p className="text-lg font-bold text-gray-900">{draft.toFixed(1)}m</p>
                      </div>
                    </div>
                    
                    <BoatDepthOverlay
                      boat={boatType}
                      draftMeters={draft}
                      tideHeightMeters={tideInfo.currentHeight}
                      portAltitudeMeters={selectedPort.altitude}
                    />
                  </div>
                </div>

                {/* Panel d'informations */}
                <div className="lg:col-span-1">
                  <TideInfoPanel tideInfo={tideInfo} />
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <button
                  onClick={() => setShowConfig(true)}
                  className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Configurer mon bateau
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur border-t border-white/20 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600">
          <p className="text-sm">
            © 2025 La Bonne Marée - Application de surveillance des marées du Bassin d'Arcachon
          </p>
          <p className="text-xs mt-2">
            Données officielles - Mise à jour en temps réel - Marge de sécurité: 50cm
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;