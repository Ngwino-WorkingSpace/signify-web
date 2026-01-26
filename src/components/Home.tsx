import { ClipboardList, Bell, Heart } from 'lucide-react';

interface HomeProps {
  onStartSurvey: () => void;
  onViewNotifications: () => void;
}

export function Home({ onStartSurvey, onViewNotifications }: HomeProps) {
  return (
    <div className="min-h-[600px] px-6 py-8">

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#18392b] flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" fill="white" />
          </div>
          <h1 className="text-2xl font-bold text-[#18392b]">Signify</h1>
        </div>
        <button 
          onClick={onViewNotifications}
          className="relative w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <Bell className="w-6 h-6 text-[#18392b]" />
          <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>
      </div>


      <div className="mb-8">
        <p className="text-2xl text-gray-800 mb-2">Hello!</p>
        <p className="text-lg text-gray-600">Thank you for helping protect our community.</p>
      </div>

      <div className="bg-[#18392b] rounded-3xl p-6 mb-6 shadow-lg">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <ClipboardList className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              New Health Survey
            </h2>
            <p className="text-white/90 text-base leading-relaxed">
              You have a new health survey waiting. Takes less than 2 minutes.
            </p>
          </div>
        </div>
        
        <button
          onClick={onStartSurvey}
          className="w-full bg-white text-[#18392b] py-4 rounded-xl font-semibold text-lg shadow-md hover:bg-gray-50 transition-all active:scale-98"
        >
          Answer Survey
        </button>
      </div>

    
      <div className="bg-gray-50 rounded-3xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Your Impact
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#18392b]"></div>
            <p className="text-gray-700">Early detection of health trends</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#18392b]"></div>
            <p className="text-gray-700">Helps health authorities respond faster</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#18392b]"></div>
            <p className="text-gray-700">Protects your community</p>
          </div>
        </div>
      </div>
    </div>
  );
}
