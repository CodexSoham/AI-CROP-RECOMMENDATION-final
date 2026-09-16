import React from 'react';

interface KshetraLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'mark-only' | 'horizontal';
  className?: string;
  theme?: 'light' | 'dark' | 'auto';
}

export const KshetraLogo: React.FC<KshetraLogoProps> = ({
  size = 'md',
  variant = 'horizontal',
  className = '',
}) => {
  // Dimensions
  const dimMap = {
    xs: { mark: 22, text: 'text-xs' },
    sm: { mark: 28, text: 'text-sm' },
    md: { mark: 36, text: 'text-lg' },
    lg: { mark: 48, text: 'text-2xl' },
    xl: { mark: 72, text: 'text-4xl' },
  };

  const dim = dimMap[size];

  // SVG Emblem accurately matching b1eb905a-ff1d-46f8-b728-5ce9eef11153.png
  const renderEmblem = () => (
    <svg
      width={dim.mark}
      height={dim.mark}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 group-hover:scale-105"
    >
      <defs>
        {/* Vibrant Agro-Tech Green Gradients */}
        <linearGradient id="kshetraGradPrimary" x1="50" y1="350" x2="350" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#48C74D" />
          <stop offset="50%" stopColor="#6FD73B" />
          <stop offset="100%" stopColor="#8EE336" />
        </linearGradient>

        <linearGradient id="kshetraGradLeaf" x1="160" y1="200" x2="340" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#55CC43" />
          <stop offset="70%" stopColor="#82DC38" />
          <stop offset="100%" stopColor="#9CE734" />
        </linearGradient>

        <linearGradient id="kshetraGradStem" x1="90" y1="50" x2="180" y2="300" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8BE336" />
          <stop offset="50%" stopColor="#5BC641" />
          <stop offset="100%" stopColor="#44BF48" />
        </linearGradient>

        <linearGradient id="kshetraGradCenter" x1="160" y1="220" x2="240" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#51C244" />
          <stop offset="100%" stopColor="#96E535" />
        </linearGradient>
      </defs>

      {/* 1. Left Vertical Shoot / Stem (Left Pillar of the K) */}
      <path
        d="M 100 70 
           C 100 60, 115 50, 125 58 
           C 145 75, 155 110, 155 160 
           L 155 245 
           C 130 250, 108 260, 95 272 
           L 95 120 
           C 95 90, 98 75, 100 70 Z"
        fill="url(#kshetraGradStem)"
      />

      {/* 2. Upper-Right Leaf with Tech Circuit Traces (Upper Arm of K) */}
      <path
        d="M 180 160 
           C 220 70, 310 50, 325 55 
           C 335 60, 335 150, 240 215 
           C 205 195, 190 180, 180 160 Z"
        fill="url(#kshetraGradLeaf)"
      />

      {/* Circuit Traces & IoT Nodes on Upper Leaf */}
      <g stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        {/* Node 1 & Line (Top right) */}
        <line x1="280" y1="125" x2="250" y2="125" />
        <line x1="250" y1="125" x2="225" y2="155" />
        <circle cx="288" cy="125" r="7" fill="#FFFFFF" />

        {/* Node 2 & Line (Highest node) */}
        <line x1="255" y1="95" x2="230" y2="120" />
        <line x1="230" y1="120" x2="200" y2="145" />
        <circle cx="262" cy="95" r="7" fill="#FFFFFF" />

        {/* Node 3 & Line (Lower node) */}
        <line x1="270" y1="155" x2="245" y2="155" />
        <line x1="245" y1="155" x2="238" y2="185" />
        <circle cx="277" cy="155" r="6" fill="#FFFFFF" />
      </g>

      {/* 3. Lower Field Furrows / Cultivated Terraces (Curved Base of K) */}
      {/* Outer Field Ridge */}
      <path
        d="M 95 255 
           C 95 320, 175 350, 240 345 
           C 285 340, 315 315, 320 280 
           C 290 300, 250 310, 210 305 
           C 150 295, 115 270, 95 255 Z"
        fill="url(#kshetraGradPrimary)"
      />

      {/* Mid Field Ridge with White Furrow Separation Lines */}
      <path
        d="M 115 275 
           C 145 320, 215 330, 275 295 
           C 250 280, 205 285, 160 270 
           C 135 260, 120 265, 115 275 Z"
        fill="#FFFFFF"
        opacity="0.95"
      />
      
      <path
        d="M 125 282 
           C 155 315, 210 322, 265 290 
           C 245 285, 200 282, 165 272 
           Z"
        fill="url(#kshetraGradPrimary)"
      />

      {/* Additional Furrow Contour */}
      <path
        d="M 150 298 
           C 185 320, 230 315, 260 290 
           C 240 298, 200 305, 165 292 Z"
        fill="#FFFFFF"
        opacity="0.8"
      />

      {/* Lower right agricultural mound leaf cap */}
      <path
        d="M 200 260 
           C 240 250, 290 260, 310 275 
           C 290 285, 240 275, 200 260 Z"
        fill="url(#kshetraGradPrimary)"
      />

      {/* 4. Center Sprouting Seedling & Sphere */}
      <g>
        {/* Central stem */}
        <path
          d="M 197 265 L 197 215"
          stroke="#FFFFFF"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M 197 265 L 197 215"
          stroke="url(#kshetraGradCenter)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Emerging Circular Bud / Globe */}
        <circle cx="197" cy="180" r="42" fill="url(#kshetraGradCenter)" />

        {/* White Seedling Cutout within the Bud */}
        <path
          d="M 197 210 
             C 197 185, 180 170, 160 170 
             C 170 195, 185 205, 197 210 Z"
          fill="#FFFFFF"
          opacity="0.95"
        />
        <path
          d="M 197 210 
             C 197 185, 214 170, 234 170 
             C 224 195, 209 205, 197 210 Z"
          fill="#FFFFFF"
          opacity="0.95"
        />
      </g>
    </svg>
  );

  if (variant === 'mark-only') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {renderEmblem()}
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center gap-2 group ${className}`}>
        {renderEmblem()}
        <span className={`font-black tracking-tight text-[#4CAF38] dark:text-[#6FD73B] ${dim.text}`}>
          KshetraAI
        </span>
      </div>
    );
  }

  // Default: Horizontal
  return (
    <div className={`flex items-center gap-2.5 group cursor-pointer text-left ${className}`}>
      {renderEmblem()}
      <div>
        <div className="flex items-center gap-1">
          <span className={`font-black tracking-tight text-stone-900 dark:text-white leading-none ${dim.text}`}>
            Kshetra<span className="text-[#4CAF38] dark:text-[#7ED937]">AI</span>
          </span>
        </div>
        <span className="text-[9px] font-bold text-stone-600 dark:text-stone-300 uppercase tracking-widest block mt-0.5">
          Precision Agtech
        </span>
      </div>
    </div>
  );
};
