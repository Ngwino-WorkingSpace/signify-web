import React from 'react';
import { 
  Send, 
  Clock, 
  Smartphone, 
  CheckCircle, 
  AlertCircle,
  Settings,
  Plus
} from 'lucide-react';

const notifications = [
  { id: 1, title: 'Weekly Fever Alert', target: 'Volunteers - District A', status: 'sent', delivery: '98%', time: '2026-01-26 08:00' },
  { id: 2, title: 'Vector Check Reminder', target: 'Health Officers', status: 'scheduled', delivery: '-', time: '2026-01-28 09:00' },
  { id: 3, title: 'Emergency Outbreak Notice', target: 'All Regional Staff', status: 'sent', delivery: '100%', time: '2026-01-24 14:20' },
  { id: 4, title: 'Submission Deadline', target: 'District Managers', status: 'failed', delivery: '82%', time: '2026-01-23 17:00' },
];

export const Notifications = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications Control</h1>
          <p className="text-sm text-gray-500 mt-1">Manage SMS alerts, survey reminders, and broadcast messages.</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-[#18392b] text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-opacity">
          <Plus size={18} />
          <span>New Notification</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">SMS Gateway Status</h3>
            <span className="flex items-center text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
              ONLINE
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Credits Remaining</span>
              <span className="font-bold text-[#18392b]">42,500</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-[#18392b] h-full w-3/4"></div>
            </div>
            <button className="w-full mt-2 text-sm text-[#18392b] font-medium py-2 border border-[#18392b]/20 rounded-lg hover:bg-[#18392b]/5 transition-colors">
              Top Up Credits
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <h3 className="font-bold text-gray-900 mb-2">Automated Triggers</h3>
          <p className="text-xs text-gray-500 mb-4">Surveys auto-send reminders after 48h of inactivity.</p>
          <div className="flex items-center space-x-2">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-600">
                  {i}
                </div>
              ))}
            </div>
            <span className="text-xs font-medium text-gray-400">+14 Active Rules</span>
          </div>
        </div>

        <div className="bg-[#18392b] p-6 rounded-xl shadow-md text-white">
          <h3 className="font-bold mb-2">Emergency Broadcast</h3>
          <p className="text-xs text-white/70 mb-4">Instantly alert all registered field workers via SMS and App Push.</p>
          <button className="w-full bg-white text-[#18392b] text-sm font-bold py-2 rounded-lg hover:bg-white/90 transition-colors flex items-center justify-center space-x-2">
            <Send size={16} />
            <span>Launch Broadcast</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Recent Notifications</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {notifications.map((notif) => (
            <div key={notif.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${
                  notif.status === 'sent' ? 'bg-emerald-50 text-emerald-600' : 
                  notif.status === 'failed' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  <Smartphone size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{notif.title}</h4>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-xs text-gray-400">{notif.target}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs text-gray-400">{notif.time}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-8">
                <div className="text-right">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Delivery Rate</p>
                  <p className="text-sm font-bold text-gray-900">{notif.delivery}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    notif.status === 'sent' ? 'bg-emerald-500' : 
                    notif.status === 'failed' ? 'bg-rose-500' : 'bg-blue-500'
                  }`}></div>
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">{notif.status}</span>
                </div>
                <button className="p-1.5 text-gray-400 hover:text-[#18392b] transition-colors">
                  <Settings size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 bg-gray-50/30 text-center">
          <button className="text-sm font-medium text-[#18392b] hover:underline">View All History</button>
        </div>
      </div>
    </div>
  );
};
