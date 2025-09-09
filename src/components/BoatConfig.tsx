import React from 'react';
import { Anchor } from 'lucide-react';

interface BoatConfigProps {
  boatType: 'motor' | 'sail';
  draft: number;
  onBoatTypeChange: (type: 'motor' | 'sail') => void;
  onDraftChange: (draft: number) => void;
}

export default function BoatConfig({
  boatType,
  draft,
  onBoatTypeChange,
  onDraftChange
}: BoatConfigProps) {
  return (
    <div className="space-y-4"> 
      {/* Type de bateau */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Type de bateau
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onBoatTypeChange('motor')}
            className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${
              boatType === 'motor' 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl">🚤</div>
            <span className="font-medium">Bateau moteur</span>
          </button>
          
          <button
            onClick={() => onBoatTypeChange('sail')}
            className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${
              boatType === 'sail' 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl">⛵</div>
            <span className="font-medium">Voilier</span>
          </button>
        </div>
      </div>

      {/* Tirant d'eau */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Anchor className="w-4 h-4 inline mr-2" />
          Tirant d'eau (mètres)
        </label>
        <div className="relative">
          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={draft}
            onChange={(e) => onDraftChange(parseFloat(e.target.value) || 0)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 1.5"
          />
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
            m
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {boatType === 'motor' 
            ? 'Profondeur nécessaire pour l\'hélice' 
            : 'Profondeur nécessaire pour la quille/dérive'}
        </p>
      </div>
    </div>
  );
}