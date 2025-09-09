import React from "react";

type Props = {
  className?: string;
  hullColor?: string;
  strokeColor?: string;
  sailColor?: string;
};

export default function SailboatSVG({
  className,
  hullColor = "#d1d5db",
  strokeColor = "#111827",
  sailColor = "#f9fafb",
}: Props) {
  return (
    <svg viewBox="0 0 200 260" className={className} aria-label="Voilier (vue avant)">
      <g transform="scale(0.4) translate(150,100)">
      <path d="M40,100 L160,100 Q172,136 152,186 Q100,226 48,186 Q28,136 40,100 Z"
            fill={hullColor} stroke={strokeColor} strokeWidth={2}/>
        </g> 
      <g transform="translate(0,-20)">
      <rect x="98" y="28" width="4" height="74" fill="#4b5563"/>
      <path d="M102,32 L150,100 L102,100 Z" fill={sailColor} stroke={strokeColor} strokeWidth={1.5}/>
      </g>
      <g transform="translate(0,-80)">
      <path d="M98,186 L102,186 L102,214 Q100,220 98,214 Z" fill="#6b7280" stroke={strokeColor} strokeWidth={1}/>
      </g>
      <g transform="translate(0,-80)">
      <circle id="draft-anchor" cx="100" cy="219" r="2.5" fill={strokeColor}/>
      </g>
    </svg>
  );
}