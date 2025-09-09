import React from "react";
import { Clock, Waves, AlertTriangle, CheckCircle } from "lucide-react";

interface TideInfo {
  currentHeight: number;
  currentDepth: number;
  clearance: number;
  nextPM: { time: string; height: number };
  nextBM: { time: string; height: number };
  coefficient: number;
  timeToSafetyLimit: string;
  status: "safe" | "warning" | "danger";
}
 
export default function TideInfoPanel({ tideInfo }: { tideInfo: TideInfo }) {
  const getStatusColor = () => {
    switch (tideInfo.status) {
      case "safe": return "text-green-600 bg-green-50";
      case "warning": return "text-orange-600 bg-orange-50";
      case "danger": return "text-red-600 bg-red-50";
    }
  };

  const getStatusIcon = () => {
    switch (tideInfo.status) {
      case "safe": return <CheckCircle className="w-5 h-5" />;
      case "warning": return <AlertTriangle className="w-5 h-5" />;
      case "danger": return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getStatusText = () => {
    switch (tideInfo.status) {
      case "safe": return "Navigation sécurisée";
      case "warning": return "Attention - Marge faible";
      case "danger": return "Danger - Profondeur insuffisante";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      {/* Status général */}
      <div className={`rounded-lg p-4 flex items-center space-x-3 ${getStatusColor()}`}>
        {getStatusIcon()}
        <div>
          <h3 className="font-bold text-lg">{getStatusText()}</h3>
          <p className="text-sm opacity-80">
            Marge de sécurité: {tideInfo.clearance.toFixed(2)}m
          </p>
        </div>
      </div>

      {/* Informations actuelles */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Waves className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Marée</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">
            {tideInfo.currentHeight.toFixed(2)}m
          </p>
        </div>

        <div className="bg-cyan-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-4 h-4 bg-cyan-600 rounded"></div>
            <span className="text-sm font-medium text-cyan-800">Profondeur</span>
          </div>
          <p className="text-2xl font-bold text-cyan-900">
            {tideInfo.currentDepth.toFixed(2)}m
          </p>
        </div>
      </div>

      {/* Compte à rebours */}
      {tideInfo.timeToSafetyLimit && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-800">Décompte avant échouage</span>
          </div>
          <p className="text-xl font-bold text-gray-900">
            {tideInfo.timeToSafetyLimit}
          </p>
        </div>
      )}

      {/* Prochaines marées */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-800">Prochaines marées</h4>
        <div className="grid grid-cols-1 gap-3">
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
            <div>
              <span className="text-sm font-medium text-blue-800">Pleine Mer (PM)</span>
              <p className="text-lg font-bold text-blue-900">{tideInfo.nextPM.time}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-blue-900">
                {tideInfo.nextPM.height.toFixed(2)}m
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
            <div>
              <span className="text-sm font-medium text-orange-800">Basse Mer (BM)</span>
              <p className="text-lg font-bold text-orange-900">{tideInfo.nextBM.time}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-orange-900">
                {tideInfo.nextBM.height.toFixed(2)}m
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-3">
          <span className="text-sm font-medium text-purple-800">Coefficient du jour</span>
          <p className="text-2xl font-bold text-purple-900">{tideInfo.coefficient}</p>
        </div>
      </div>
    </div>
  );
}