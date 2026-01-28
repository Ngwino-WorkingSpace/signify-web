import React, { useState } from 'react';
import { 
  Users, 
  FileText, 
  MapPin, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const trendData = [
  { name: 'Jan', responses: 400, alerts: 24 },
  { name: 'Feb', responses: 300, alerts: 18 },
  { name: 'Mar', responses: 900, alerts: 45 },
  { name: 'Apr', responses: 1200, alerts: 62 },
  { name: 'May', responses: 1500, alerts: 40 },
  { name: 'Jun', responses: 1800, alerts: 32 },
  { name: 'Jul', responses: 2200, alerts: 55 },
];

const locationData = [
  { name: 'Northern Province', value: 450, color: '#18392b' },
  { name: 'Eastern Province', value: 320, color: '#2a5a45' },
  { name: 'Western Province', value: 890, color: '#3c7b5f' },
  { name: 'Southern Province', value: 210, color: '#4e9c79' },
  { name: 'Central Province', value: 540, color: '#60bd93' },
];

const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold mt-1 text-[#18392b]">{value}</h3>
      </div>
      <div className="p-2 bg-gray-50 rounded-lg">
        <Icon className="w-5 h-5 text-[#18392b]" />
      </div>
    </div>
    <div className="mt-4 flex items-center space-x-2">
      <span className={`flex items-center text-xs font-semibold ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
        {trend === 'up' ? <ArrowUpRight size={14} className="mr-0.5" /> : <ArrowDownRight size={14} className="mr-0.5" />}
        {change}
      </span>
      <span className="text-xs text-gray-400">vs last month</span>
    </div>
  </div>
);

export const DashboardHome = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time preventive health signals and survey performance.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
            <Filter size={16} />
            <span>Filter Period</span>
          </button>
          <button className="px-4 py-2 bg-[#18392b] text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-opacity">
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Responses" 
          value="12,842" 
          change="+14.5%" 
          icon={Users} 
          trend="up" 
        />
        <StatCard 
          title="Active Surveys" 
          value="24" 
          change="+2" 
          icon={FileText} 
          trend="up" 
        />
        <StatCard 
          title="Reporting Locations" 
          value="142" 
          change="0%" 
          icon={MapPin} 
          trend="up" 
        />
        <StatCard 
          title="Risk Signals Found" 
          value="18" 
          change="-4.2%" 
          icon={TrendingUp} 
          trend="down" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Health Trend Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900">Health Trends Over Time</h3>
            <div className="flex items-center space-x-2">
              <span className="flex items-center text-xs text-gray-500">
                <span className="w-3 h-3 bg-[#18392b] rounded-full mr-1.5"></span> Responses
              </span>
              <span className="flex items-center text-xs text-gray-500">
                <span className="w-3 h-3 bg-rose-500 rounded-full mr-1.5"></span> High Risk Signals
              </span>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorResponses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#18392b" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#18392b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="responses" 
                  stroke="#18392b" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorResponses)" 
                />
                <Line 
                  type="monotone" 
                  dataKey="alerts" 
                  stroke="#f43f5e" 
                  strokeWidth={2} 
                  dot={{ r: 4, fill: '#f43f5e' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Responses by Location */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">Responses by Province</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  width={100}
                  tick={{fontSize: 11, fill: '#4b5563'}} 
                />
                <Tooltip 
                  cursor={{fill: '#f9fafb'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {locationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {locationData.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <span className="text-gray-500">{item.name}</span>
                <span className="font-medium text-gray-900">{((item.value / 2410) * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap Area Simulation */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-gray-900">Geographic Risk Heatmap</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs">
              <span className="w-3 h-3 bg-emerald-500 rounded-sm"></span>
              <span>Stable</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="w-3 h-3 bg-yellow-400 rounded-sm"></span>
              <span>Monitor</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="w-3 h-3 bg-rose-500 rounded-sm"></span>
              <span>High Signal</span>
            </div>
          </div>
        </div>
        <div className="relative aspect-video w-full bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#18392b]/5 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-[#18392b] mx-auto opacity-20" />
              <p className="text-gray-400 mt-2 font-medium">Interactive Map Data Loading...</p>
            </div>
          </div>
          {/* Simulated Hotspots */}
          <div className="absolute top-1/4 left-1/3 w-20 h-20 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-rose-500/20 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-yellow-400/20 rounded-full blur-xl"></div>
        </div>
      </div>
    </div>
  );
};
