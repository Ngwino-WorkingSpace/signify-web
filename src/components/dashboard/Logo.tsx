import React from 'react';
import { Heart } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: number;
  textColor?: string;
  iconOnly?: boolean;
}

export const Logo = ({ className = "", size = 32, textColor = "text-[#18392b]", iconOnly = false }: LogoProps) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div 
        className="relative flex items-center justify-center rounded-xl bg-[#18392b] shadow-lg shadow-[#18392b]/20"
        style={{ width: size, height: size }}
      >
        {/* Heart centered in the box */}
        <Heart 
          size={size * 0.6} 
          className="text-white fill-white" 
        />
        {/* Decorative pulse ring */}
        <div className="absolute inset-0 border-2 border-white/20 rounded-xl animate-pulse"></div>
      </div>
      
      {!iconOnly && (
        <span className={`text-xl font-bold tracking-tight ${textColor}`}>
          Signify
        </span>
      )}
    </div>
  );
};
