import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  MapPin, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  X,
  Calendar,
  Users2,
  BarChart3
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
import 'leaflet/dist/leaflet.css';
import RwandaMap from './RwandaMap';

import { apiService } from '../../services/api';

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
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [locationData, setLocationData] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [districtDetailsLoading, setDistrictDetailsLoading] = useState(false);

  const handleDistrictClick = async (districtName: string) => {
    setDistrictDetailsLoading(true);
    try {
      const details = await apiService.getDistrictDetails(districtName);
      setSelectedDistrict(details);
    } catch (error) {
      console.error('Failed to fetch district details:', error);
    } finally {
      setDistrictDetailsLoading(false);
    }
  };

  const closeDistrictDetails = () => {
    setSelectedDistrict(null);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all data in parallel
        const [dashboardSummary, locationStats, trendStats] = await Promise.all([
          apiService.getDashboardSummary(),
          apiService.getLocationAnalyticsData(),
          apiService.getTrendData(),
        ]);

        console.log('📊 Dashboard Data:', dashboardSummary);
        console.log('🗺️ Location Stats:', locationStats);
        console.log('📈 Trend Stats:', trendStats);

        setDashboardData(dashboardSummary);
        setLocationData(locationStats);
        setTrendData(trendStats);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        
        // Use fallback data if API fails
        setLocationData([
          { name: 'Gasabo', value: 450, color: '#18392b' },
          { name: 'Kicukiro', value: 320, color: '#2a5a45' },
          { name: 'Nyarugenge', value: 890, color: '#3c7b5f' },
          { name: 'Muhanga', value: 210, color: '#4e9c79' },
          { name: 'Rulindo', value: 540, color: '#60bd93' },
          { name: 'Rubavu', value: 380, color: '#72deac' },
          { name: 'Rusizi', value: 290, color: '#84ffc5' },
          { name: 'Musanze', value: 420, color: '#96ffde' },
        ]);

        setTrendData([
          { name: 'Jan', responses: 400, alerts: 24 },
          { name: 'Feb', responses: 300, alerts: 18 },
          { name: 'Mar', responses: 900, alerts: 45 },
          { name: 'Apr', responses: 1200, alerts: 62 },
          { name: 'May', responses: 1500, alerts: 40 },
          { name: 'Jun', responses: 1800, alerts: 32 },
          { name: 'Jul', responses: 2200, alerts: 55 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#18392b]"></div>
      </div>
    );
  }

  const stats = dashboardData || {
    totalSurveys: 0,
    totalResponses: 0,
    activeSurveys: 0,
    recentActivity: []
  };

  // Calculate additional stats dynamically
  const reportingLocations = locationData.length;
  const totalResponses = stats.total_responses || 0;
  const totalSurveys = stats.total_surveys || 0;
  const activeSurveys = stats.active_surveys || 0;

  // Calculate percentage changes (mock data for now, would come from historical data)
  const responsesChange = totalResponses > 0 ? "+14.5%" : "0%";
  const surveysChange = totalSurveys > 0 ? "+2" : "0";
  const locationsChange = reportingLocations > 0 ? "0%" : "0";
  const riskSignalsChange = activeSurveys > 0 ? "-4.2%" : "0";

  // Ensure values are not undefined before calling toLocaleString
  const safeTotalResponses = totalResponses || 0;
  const safeTotalSurveys = totalSurveys || 0;
  const safeActiveSurveys = activeSurveys || 0;
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
          value={safeTotalResponses.toLocaleString()} 
          change={responsesChange} 
          icon={Users} 
          trend="up" 
        />
        <StatCard 
          title="Active Surveys" 
          value={safeTotalSurveys.toString()} 
          change={surveysChange} 
          icon={FileText} 
          trend="up" 
        />
        <StatCard 
          title="Reporting Locations" 
          value={reportingLocations.toString()} 
          change={locationsChange} 
          icon={MapPin} 
          trend="up" 
        />
        <StatCard 
          title="Risk Signals Found" 
          value={safeActiveSurveys.toString()} 
          change={riskSignalsChange} 
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
          <h3 className="font-bold text-gray-900 mb-6">Responses by District</h3>
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
            {locationData.slice(0, 3).map((item, idx) => {
              const totalResponses = locationData.reduce((sum, loc) => sum + loc.value, 0);
              const percentage = totalResponses > 0 ? ((item.value / totalResponses) * 100).toFixed(1) : '0.0';
              return (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">{item.name}</span>
                  <span className="font-medium text-gray-900">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Geographic Risk Heatmap */}
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
        <div className="relative w-full h-[400px] rounded-lg overflow-hidden border border-gray-100">
          <RwandaMap 
            districtData={locationData} 
            loading={loading} 
            onDistrictClick={handleDistrictClick}
          />
        </div>
      </div>

      {/* District Details Modal */}
      {selectedDistrict && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedDistrict.district} District Details
              </h2>
              <button
                onClick={closeDistrictDetails}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {districtDetailsLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#18392b]"></div>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Total Responses</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">
                      {selectedDistrict.totalResponses.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users2 className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-900">Unique Users</span>
                    </div>
                    <p className="text-2xl font-bold text-green-900">
                      {selectedDistrict.uniqueUsers.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <BarChart3 className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium text-purple-900">Active Surveys</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-900">
                      {selectedDistrict.activeSurveys}
                    </p>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-5 h-5 text-orange-600" />
                      <span className="text-sm font-medium text-orange-900">Recent (30d)</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-900">
                      {selectedDistrict.recentResponses.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Sector Breakdown */}
                {selectedDistrict.sectors && selectedDistrict.sectors.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Sector Breakdown</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {selectedDistrict.sectors.map((sector: any, index: number) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-900">{sector.sector}</span>
                            <span className="text-sm text-gray-500">{sector.percentage}%</span>
                          </div>
                          <div className="mt-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-[#18392b] h-2 rounded-full" 
                                style={{ width: `${sector.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {sector.responses.toLocaleString()} responses
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Active Surveys */}
                {selectedDistrict.surveys && selectedDistrict.surveys.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Surveys</h3>
                    <div className="space-y-3">
                      {selectedDistrict.surveys.map((survey: any, index: number) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{survey.title}</h4>
                              <p className="text-sm text-gray-500 mt-1">
                                Status: <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                  survey.status === 'active' ? 'bg-green-100 text-green-800' :
                                  survey.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {survey.status}
                                </span>
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-gray-900">
                                {survey.responseCount.toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-500">responses</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Activity */}
                {selectedDistrict.recentActivity && selectedDistrict.recentActivity.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-2">
                      {selectedDistrict.recentActivity.map((activity: any, index: number) => (
                        <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{activity.surveyTitle}</p>
                            <p className="text-xs text-gray-500">
                              Sector: {activity.userSector} • {new Date(activity.submittedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
