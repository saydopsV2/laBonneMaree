import React from "react";

type Props = {
  className?: string;
  hullColor?: string;
  strokeColor?: string;
  accentColor?: string;
};

export default function MotorboatSVG({
  className,
  hullColor = "#d1d5db",
  strokeColor = "#111827",
  accentColor = "#93c5fd",
}: Props) {
  return (
    <svg viewBox="0 0 200 240" className={className} aria-label="Bateau moteur (vue avant)">
      <g transform="scale(0.4) translate(150,100)">
      <path d="M40,80 L160,80 Q172,120 152,180 Q100,220 48,180 Q28,120 40,80 Z"
            fill={hullColor} stroke={strokeColor} strokeWidth={2}/>
      </g>  
      <rect x="78" y="38" width="44" height="32" rx="5" ry="5"
            fill="#f3f4f6" stroke={strokeColor} strokeWidth={2}/>
      <circle cx="92" cy="54" r="5" fill={accentColor} stroke={strokeColor} strokeWidth={1}/>
      <circle cx="108" cy="54" r="5" fill={accentColor} stroke={strokeColor} strokeWidth={1}/>
      <g id="prop-group" transform="translate(100,140)">
        <rect x="-2" y="-20" width="4" height="18" fill="#6b7280"/>
        <circle cx="0" cy="0" r="6" fill="#6b7280"/>
        <path d="M0,0 C18,-8 18,8 0,0Z" fill="#6b7280"/>
        <path d="M0,0 C-18,-8 -18,8 0,0Z" fill="#6b7280"/>
        <circle id="draft-anchor" cx="0" cy="8" r="2.5" fill={strokeColor}/>
      </g>
    </svg>
  );
}