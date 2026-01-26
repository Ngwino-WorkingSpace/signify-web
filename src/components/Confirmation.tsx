import { CheckCircle2, Heart } from 'lucide-react';

interface ConfirmationProps {
  onGoHome: () => void;
}

export function Confirmation({ onGoHome }: ConfirmationProps) {
  return (
    <div className="min-h-[600px] px-6 py-8 flex flex-col items-center justify-center text-center">

      <div className="mb-8">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-[#18392b]/10 flex items-center justify-center mb-4 animate-[scale-in_0.5s_ease-out]">
            <CheckCircle2 className="w-20 h-20 text-[#18392b]" strokeWidth={2} />
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-[#18392b] flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" fill="white" />
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-[#18392b] mb-4">
        Thank You!
      </h2>
      
      <p className="text-xl text-gray-700 mb-8 leading-relaxed max-w-sm">
        Your response helps protect your community.
      </p>

      <div className="bg-[#18392b]/5 rounded-2xl p-6 mb-10 w-full">
        <p className="text-base text-gray-700 leading-relaxed">
          Health authorities will use this information to detect early warning signs and respond quickly to keep everyone safe.
        </p>
      </div>

    
      <button
        onClick={onGoHome}
        className="w-full bg-[#18392b] text-white py-5 rounded-2xl text-xl font-semibold shadow-lg hover:bg-[#18392b]/90 transition-all active:scale-98"
      >
        Back to Home
      </button>
    </div>
  );
}
