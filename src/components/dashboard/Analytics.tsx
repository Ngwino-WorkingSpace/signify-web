import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { 
  Download, 
  Calendar, 
  Filter, 
  TrendingUp, 
  ChevronRight,
  Target
} from 'lucide-react';

const riskByLocation = [
  { name: 'District A', low: 400, medium: 240, high: 100 },
  { name: 'District B', low: 300, medium: 139, high: 221 },
  { name: 'District C', low: 200, medium: 980, high: 129 },
  { name: 'District D', low: 278, medium: 390, high: 50 },
  { name: 'District E', low: 189, medium: 480, high: 110 },
];

const riskComposition = [
  { name: 'High Risk', value: 15, color: '#f43f5e' },
  { name: 'Medium Risk', value: 35, color: '#fbbf24' },
  { name: 'Low Risk', value: 50, color: '#10b981' },
];

const trendData = [
  { day: 'Mon', responses: 450, risk: 24 },
  { day: 'Tue', responses: 520, risk: 32 },
  { day: 'Wed', responses: 610, risk: 58 },
  { day: 'Thu', responses: 580, risk: 42 },
  { day: 'Fri', responses: 700, risk: 15 },
  { day: 'Sat', responses: 320, risk: 12 },
  { day: 'Sun', responses: 250, risk: 8 },
];

export const Analytics = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Deep dive into health signals, trends, and regional performance.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
            <Calendar size={16} />
            <span>Jan 20, 2026 - Jan 27, 2026</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-[#18392b] text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-opacity">
            <Download size={16} />
            <span>Full Analysis (CSV)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900">Risk Distribution by District</h3>
            <div className="flex space-x-4">
              <div className="flex items-center text-xs text-gray-500">
                <span className="w-2 h-2 bg-rose-500 rounded-full mr-1.5"></span> High
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-1.5"></span> Medium
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-1.5"></span> Low
              </div>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskByLocation} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                <Tooltip 
                  cursor={{fill: '#f9fafb'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="high" fill="#f43f5e" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="medium" fill="#fbbf24" stackId="a" />
                <Bar dataKey="low" fill="#10b981" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6 text-center">Overall Risk Composition</h3>
          <div className="h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskComposition}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskComposition.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <span className="text-2xl font-bold text-gray-900">12.8k</span>
              <span className="text-[10px] text-gray-400 uppercase font-bold">Total Signals</span>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {riskComposition.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-bold text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900">Weekly Response Efficiency</h3>
            <button className="text-xs text-[#18392b] font-bold flex items-center hover:underline">
              DETAILS <ChevronRight size={14} />
            </button>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                <Tooltip />
                <Line type="monotone" dataKey="responses" stroke="#18392b" strokeWidth={3} dot={{ r: 4, fill: '#18392b' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#18392b] p-8 rounded-xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <Target className="w-12 h-12 text-white/20 mb-4" />
            <h3 className="text-xl font-bold mb-2">Predictive Signal: Outbreak Risk</h3>
            <p className="text-white/70 text-sm mb-6 leading-relaxed">
              Based on rainfall data and fever signal spikes in District B, our model suggests a 65% probability of increased malaria vectors in the next 10 days.
            </p>
            <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Recommended Action</span>
                <span className="text-xs bg-rose-500 text-white px-2 py-0.5 rounded font-bold">URGENT</span>
              </div>
              <p className="text-sm font-medium">Deploy preventive SMS campaign & vector control teams to District B zone 4.</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full -ml-16 -mb-16 blur-2xl"></div>
        </div>
      </div>
    </div>
  );
};
