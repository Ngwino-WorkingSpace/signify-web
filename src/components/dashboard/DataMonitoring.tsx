import React, { useState } from 'react';
import { 
  Filter, 
  Download, 
  Calendar, 
  MapPin, 
  RefreshCcw,
  Search,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

const mockResponses = [
  { id: 'RESP-921', survey: 'Community Fever Monitoring', location: 'District A', user: 'Vol-42', date: '2026-01-27 10:45', risk: 'low' },
  { id: 'RESP-920', survey: 'Community Fever Monitoring', location: 'District B', user: 'Vol-15', date: '2026-01-27 10:42', risk: 'high' },
  { id: 'RESP-919', survey: 'Post-Rainfall Vector Check', location: 'District C', user: 'Vol-08', date: '2026-01-27 10:30', risk: 'medium' },
  { id: 'RESP-918', survey: 'Community Fever Monitoring', location: 'District A', user: 'Vol-22', date: '2026-01-27 10:28', risk: 'low' },
  { id: 'RESP-917', survey: 'Community Fever Monitoring', location: 'District A', user: 'Vol-42', date: '2026-01-27 10:25', risk: 'low' },
  { id: 'RESP-916', survey: 'Elderly Chronic Care', location: 'District D', user: 'Vol-19', date: '2026-01-27 10:15', risk: 'medium' },
];

const RiskIndicator = ({ level }: { level: string }) => {
  const configs: Record<string, { icon: any, color: string, bg: string }> = {
    low: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    medium: { icon: Info, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    high: { icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
  };

  const { icon: Icon, color, bg } = configs[level] || configs.low;

  return (
    <div className={`flex items-center space-x-1.5 ${bg} ${color} px-2 py-1 rounded-full w-fit`}>
      <Icon size={14} />
      <span className="text-xs font-bold uppercase tracking-wide">{level}</span>
    </div>
  );
};

export const DataMonitoring = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Real-time Monitoring</h1>
          <p className="text-sm text-gray-500 mt-1">Live feed of incoming health signals from the field.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleRefresh}
            className={`flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${isRefreshing ? 'opacity-50' : ''}`}
          >
            <RefreshCcw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Feed'}</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 flex-1 min-w-[200px]">
          <Search size={16} className="text-gray-400" />
          <input type="text" placeholder="Search by ID or Volunteer..." className="bg-transparent border-none focus:outline-none ml-2 text-sm w-full" />
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <MapPin size={16} className="text-gray-400" />
            <select className="bg-transparent font-medium text-gray-600 focus:outline-none">
              <option>All Locations</option>
              <option>District A</option>
              <option>District B</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2 text-sm border-l border-gray-200 pl-4">
            <Calendar size={16} className="text-gray-400" />
            <select className="bg-transparent font-medium text-gray-600 focus:outline-none">
              <option>Today</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 text-sm border-l border-gray-200 pl-4">
            <Filter size={16} className="text-gray-400" />
            <select className="bg-transparent font-medium text-gray-600 focus:outline-none">
              <option>All Risk Levels</option>
              <option>High Risk Only</option>
              <option>Medium Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Live Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Response ID</th>
              <th className="px-6 py-4 font-semibold">Survey Title</th>
              <th className="px-6 py-4 font-semibold">Location</th>
              <th className="px-6 py-4 font-semibold">Submitted By</th>
              <th className="px-6 py-4 font-semibold">Risk Signal</th>
              <th className="px-6 py-4 font-semibold">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mockResponses.map((resp) => (
              <tr key={resp.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-[#18392b]">{resp.id}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{resp.survey}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <MapPin size={14} className="mr-1.5 text-gray-400" />
                    {resp.location}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{resp.user}</td>
                <td className="px-6 py-4">
                  <RiskIndicator level={resp.risk} />
                </td>
                <td className="px-6 py-4 text-sm text-gray-400 tabular-nums">
                  {resp.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 border-t border-gray-50 bg-gray-50/30 flex items-center justify-center">
          <button className="text-sm font-medium text-[#18392b] hover:underline">
            View All 12,842 Responses
          </button>
        </div>
      </div>
    </div>
  );
};
