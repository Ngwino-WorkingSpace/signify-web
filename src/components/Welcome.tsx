import { Heart, Users, Shield } from 'lucide-react';

interface WelcomeProps {
  onGetStarted: () => void;
}

export function Welcome({ onGetStarted }: WelcomeProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] px-6 text-center">
      {/* Logo/Icon */}
      <div className="mb-8">
        <div className="w-24 h-24 rounded-full bg-[#18392b] flex items-center justify-center mb-4">
          <Heart className="w-12 h-12 text-white" fill="white" />
        </div>
        <h1 className="text-3xl font-bold text-[#18392b] mb-2">Signify</h1>
      </div>

      {/* Explanation */}
      <p className="text-xl text-gray-700 mb-12 leading-relaxed max-w-sm">
        Signify helps protect your community by sharing simple health signals.
      </p>

      {/* Feature Icons */}
      <div className="flex gap-8 mb-12">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#18392b]/10 flex items-center justify-center mb-2">
            <Users className="w-8 h-8 text-[#18392b]" />
          </div>
          <span className="text-sm text-gray-600">Community</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#18392b]/10 flex items-center justify-center mb-2">
            <Shield className="w-8 h-8 text-[#18392b]" />
          </div>
          <span className="text-sm text-gray-600">Safe</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#18392b]/10 flex items-center justify-center mb-2">
            <Heart className="w-8 h-8 text-[#18392b]" />
          </div>
          <span className="text-sm text-gray-600">Health</span>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={onGetStarted}
        className="w-full bg-[#18392b] text-white py-5 rounded-2xl text-xl font-semibold shadow-lg hover:bg-[#18392b]/90 transition-all active:scale-98"
      >
        Get Started
      </button>
    </div>
  );
}
