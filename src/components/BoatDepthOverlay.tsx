import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import MotorboatSVG from "./MotorboatSVG";
import SailboatSVG from "./SailboatSVG";

type BoatType = "motor" | "sail";

export default function BoatDepthOverlay({
  boat = "motor",
  pxPerMeter = 50,
  seabedY = 450,
  draftMeters = 1.5,
  tideHeightMeters = 2.4,
  portAltitudeMeters = 0.8,
}: {
  boat?: BoatType;
  pxPerMeter?: number;
  seabedY?: number;
  draftMeters?: number;
  tideHeightMeters?: number;
  portAltitudeMeters?: number;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [anchorY, setAnchorY] = useState<number | null>(null);

  const depthMeters = tideHeightMeters + portAltitudeMeters;
  const clearanceMeters = Math.max(0, depthMeters - draftMeters);

  const threshold = draftMeters + 0.5;
  const severity =
    depthMeters < threshold ? "red" :
    depthMeters < threshold + 0.3 ? "orange" : "green";

  const color = severity === "red" ? "#ef4444" :
    severity === "orange" ? "#f59e0b" : "#22c55e";

  const scaleZeroY = seabedY - portAltitudeMeters * pxPerMeter;
  const waterY = scaleZeroY - tideHeightMeters * pxPerMeter;

  const boatHeight = 300; // approximation SVG
  const immersionDepth = boatHeight / 3;
  const boatY = waterY - (boatHeight - immersionDepth);

  useEffect(() => {
    if (!svgRef.current) return;
    const anchor = svgRef.current.querySelector<SVGCircleElement>("#draft-anchor");
    if (!anchor) return;

    const ctm = anchor.getCTM();
    if (!ctm) return;

    const p = svgRef.current.createSVGPoint();
    p.x = parseFloat(anchor.getAttribute("cx") || "0");
    p.y = parseFloat(anchor.getAttribute("cy") || "0");
    const tp = p.matrixTransform(ctm);
    setAnchorY(tp.y + boatY);
  }, [boat, boatY]);

  return (
    <div className="relative w-full h-96 bg-gradient-to-b from-sky-200 to-blue-400 rounded-xl overflow-hidden">
      <svg ref={svgRef} viewBox="0 0 400 500" className="w-full h-full">
        {/* Fond sableux */}
        <rect x="0" y={seabedY} width="400" height="100" fill="#b45309" />
        <rect x="0" y={seabedY - 5} width="400" height="5" fill="#92400e" />

        {/* Échelle hydrométrique */}
        <g transform="translate(20,0)">
          <rect x="0" y={seabedY - 10} width="30" height="10" fill="#374151" rx="2" />
          <rect x="0" y={scaleZeroY - 6 * pxPerMeter} width="30" height={seabedY - (scaleZeroY - 6 * pxPerMeter)}
                fill="white" stroke="#374151" strokeWidth="2" rx="5" />
          {[...Array(7)].map((_, i) => {
            const meterValue = i - 1;
            const graduationY = scaleZeroY - meterValue * pxPerMeter;
            if (graduationY >= scaleZeroY - 6 * pxPerMeter && graduationY <= seabedY) {
              return (
                <g key={i}>
                  <line x1="30" y1={graduationY} x2="40" y2={graduationY} 
                        stroke="#374151" strokeWidth={meterValue === 0 ? 3 : 1} />
                  <text x="45" y={graduationY + 5} fontSize="12" 
                        fill={meterValue === 0 ? "#1e40af" : "#374151"} 
                        fontWeight={meterValue === 0 ? "bold" : "normal"}>
                    {meterValue}m
                  </text>
                  {meterValue === 0 && <text x="45" y={graduationY + 18} fontSize="10" fill="#1e40af">Côte Marine</text>}
                </g>
              );
            }
            return null;
          })}
          <circle cx="15" cy={waterY} r="4" fill="#3b82f6" stroke="white" strokeWidth="2" />
          <text x="50" y={waterY - 8} fontSize="11" fill="#1e40af" fontWeight="bold">
            {tideHeightMeters.toFixed(2)}m
          </text>
        </g>

        {/* Niveau d'eau animé */}
        <motion.rect
          x="0"
          y={waterY}
          width="400"
          height={seabedY - waterY}
          fill="none"
          animate={{ y: waterY }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Vagues animées */}
        <motion.path
          d={`M0,${waterY} Q100,${waterY-8} 200,${waterY} T400,${waterY} V${seabedY} H0 Z`}
          fill="url(#waveGradient)"
          animate={{ 
            d: [
              `M0,${waterY} Q100,${waterY-8} 200,${waterY} T400,${waterY} V${seabedY} H0 Z`,
              `M0,${waterY} Q100,${waterY+8} 200,${waterY} T400,${waterY} V${seabedY} H0 Z`,
              `M0,${waterY} Q100,${waterY-8} 200,${waterY} T400,${waterY} V${seabedY} H0 Z`
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        <line x1="0" y1={waterY} x2="400" y2={waterY} stroke="#1e40af" strokeWidth="2" strokeDasharray="5,5" opacity="0.8" />

        {/* Bateau */}
        <motion.g transform={`translate(200, ${boatY})`} animate={{ y: boatY }} transition={{ duration: 2, ease: "easeInOut" }}>
          {boat === "motor" ? <MotorboatSVG className="w-32 h-auto" /> : <SailboatSVG className="w-32 h-auto" />}
        </motion.g>

        {/* Marge de sécurité */}
        {anchorY !== null && (
          <g>
            <line x1="320" y1={anchorY} x2="320" y2={seabedY} stroke={color} strokeWidth="3"
                  markerEnd="url(#arrowhead)" markerStart="url(#arrowhead-reverse)" />
            <rect x="330" y={(anchorY + seabedY)/2 - 15} width="60" height="30" fill="white" stroke={color} strokeWidth="1" rx="5"/>
            <text x="360" y={(anchorY + seabedY)/2 - 5} textAnchor="middle" fontSize="10" fontWeight="bold" fill={color}>
              {clearanceMeters.toFixed(1)}m
            </text>
            <text x="360" y={(anchorY + seabedY)/2 + 8} textAnchor="middle" fontSize="8" fill="#6b7280">
              marge
            </text>
          </g>
        )}

        {/* Indicateur de profondeur totale */}
        <g transform="translate(70, 0)">
          <line x1="0" y1={waterY} x2="0" y2={seabedY}
                stroke="#0ea5e9" strokeWidth="2" strokeDasharray="3,3"/>
          <rect x="-25" y={(waterY + seabedY)/2 - 12} width="50" height="24" 
                fill="white" stroke="#0ea5e9" strokeWidth="1" rx="4"/>
          <text x="0" y={(waterY + seabedY)/2 - 2} textAnchor="middle"
                fontSize="9" fontWeight="bold" fill="#0ea5e9">
            {depthMeters.toFixed(1)}m
          </text>
          <text x="0" y={(waterY + seabedY)/2 + 8} textAnchor="middle"
                fontSize="7" fill="#6b7280">
            profondeur
          </text>
        </g>
        
        {/* Dégradés et marqueurs */}
        <defs>
          <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1e40af" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.8" />
          </linearGradient>
          <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill={color} />
          </marker>
          <marker id="arrowhead-reverse" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M8,0 L0,4 L8,8 Z" fill={color} />
          </marker>
        </defs>
      </svg>
      
    </div>
  ); 
}
