import React, { useState, useEffect } from 'react';
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
  Line,
  Treemap
} from 'recharts';
import { 
  Download, 
  Calendar, 
  Filter, 
  TrendingUp, 
  ChevronRight,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  Users,
  MessageSquare
} from 'lucide-react';

import { apiService } from '../../services/api';

const COLORS = {
  high: '#f43f5e',
  medium: '#fbbf24', 
  low: '#10b981',
  primary: '#18392b',
  secondary: '#6b7280'
};

interface SurveyAnalytics {
  survey_id: string;
  title: string;
  total_responses: number;
  questions: {
    question_id: string;
    question_text: string;
    question_type: string;
    total_answers: number;
    answer_distribution: {
      answer: string;
      count: number;
      percentage: number;
    }[];
  }[];
}

interface LocationAnalytics {
  country: string;
  district: string;
  sector: string;
  response_count: number;
  percentage: number;
}

interface QuestionAnalytics {
  question_id: string;
  question_text: string;
  question_type: string;
  survey: {
    survey_id: string;
    title: string;
  };
  total_answers: number;
  answer_distribution: {
    answer: string;
    count: number;
    percentage: number;
  }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const Analytics = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [surveyAnalytics, setSurveyAnalytics] = useState<SurveyAnalytics[]>([]);
  const [locationAnalytics, setLocationAnalytics] = useState<LocationAnalytics[]>([]);
  const [questionAnalytics, setQuestionAnalytics] = useState<QuestionAnalytics[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'surveys' | 'questions' | 'locations'>('overview');

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        // Fetch dashboard summary
        const dashboard = await apiService.getDashboardSummary();
        setDashboardData(dashboard);

        // Fetch analytics for each survey
        if (dashboard.surveys && dashboard.surveys.length > 0) {
          const surveyPromises = dashboard.surveys.map((survey: any) =>
            apiService.getSurveyAnalytics(survey.survey_id)
          );
          const surveyData = await Promise.all(surveyPromises);
          setSurveyAnalytics(surveyData);

          // Fetch location analytics for the first survey
          if (dashboard.surveys[0]) {
            const locationData = await apiService.getLocationAnalytics(dashboard.surveys[0].survey_id);
            setLocationAnalytics(locationData.by_location || []);
            setSelectedSurvey(dashboard.surveys[0].survey_id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  const handleSurveyChange = async (surveyId: string) => {
    setSelectedSurvey(surveyId);
    try {
      const locationData = await apiService.getLocationAnalytics(surveyId);
      setLocationAnalytics(locationData.by_location || []);
    } catch (error) {
      console.error('Failed to fetch location analytics:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#18392b]"></div>
      </div>
    );
  }

  // Transform data for charts
  const responseByLocation = locationAnalytics.map(item => ({
    name: `${item.district}, ${item.sector}`,
    responses: item.response_count,
    percentage: item.percentage
  }));

  const surveyPerformance = surveyAnalytics.map(survey => ({
    name: survey.title.length > 20 ? survey.title.substring(0, 20) + '...' : survey.title,
    responses: survey.total_responses,
    questions: survey.questions.length,
    completion: survey.questions.length > 0 ? 
      (survey.questions.reduce((sum, q) => sum + q.total_answers, 0) / (survey.questions.length * survey.total_responses)) * 100 : 0
  }));

  const totalResponses = dashboardData?.total_responses || 0;
  const totalSurveys = dashboardData?.total_surveys || 0;
  const activeSurveys = dashboardData?.active_surveys || 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">
            Deep dive into health signals, response patterns, and regional performance.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
            <Calendar size={16} />
            <span>Last 30 Days</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-[#18392b] text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-opacity">
            <Download size={16} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Surveys</p>
              <p className="text-2xl font-bold text-gray-900">{totalSurveys}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <BarChart3 size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Surveys</p>
              <p className="text-2xl font-bold text-gray-900">{activeSurveys}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp size={24} className="text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Responses</p>
              <p className="text-2xl font-bold text-gray-900">{totalResponses.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Users size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Completion</p>
              <p className="text-2xl font-bold text-gray-900">
                {surveyPerformance.length > 0 ? 
                  Math.round(surveyPerformance.reduce((sum, s) => sum + s.completion, 0) / surveyPerformance.length) : 0}%
              </p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Target size={24} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-1">
        <div className="flex space-x-1">
          {['overview', 'surveys', 'questions', 'locations'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab 
                  ? 'bg-[#18392b] text-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-6">Survey Performance</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={surveyPerformance} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 11, fill: '#6b7280'}}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="responses" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-6">Response Distribution</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Completed', value: totalResponses * 0.85, color: COLORS.low },
                      { name: 'Partial', value: totalResponses * 0.15, color: COLORS.medium }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {[
                      { name: 'Completed', value: totalResponses * 0.85, color: COLORS.low },
                      { name: 'Partial', value: totalResponses * 0.15, color: COLORS.medium }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-gray-600">Completed</span>
                </div>
                <span className="font-bold text-gray-900">85%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-gray-600">Partial</span>
                </div>
                <span className="font-bold text-gray-900">15%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'surveys' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Survey</label>
            <select 
              value={selectedSurvey} 
              onChange={(e) => handleSurveyChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18392b]"
            >
              <option value="">Choose a survey...</option>
              {dashboardData?.surveys?.map((survey: any) => (
                <option key={survey.survey_id} value={survey.survey_id}>
                  {survey.title} ({survey.response_count} responses)
                </option>
              ))}
            </select>
          </div>

          {surveyAnalytics
            .filter(survey => !selectedSurvey || survey.survey_id === selectedSurvey)
            .map((survey) => (
              <div key={survey.survey_id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-gray-900">{survey.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{survey.total_responses} responses</span>
                    <span>{survey.questions.length} questions</span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {survey.questions.map((question, qIndex) => (
                    <div key={question.question_id} className="border-t border-gray-100 pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">
                            Q{qIndex + 1}: {question.question_text}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {question.question_type} • {question.total_answers} answers
                          </p>
                        </div>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {question.question_type}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {question.answer_distribution.map((answer, aIndex) => (
                          <div key={aIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: COLORS.low }}
                              ></div>
                              <span className="text-sm font-medium text-gray-900">
                                {answer.answer}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-gray-900">{answer.count}</div>
                              <div className="text-xs text-gray-500">{answer.percentage.toFixed(1)}%</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {activeTab === 'locations' && (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">Response Distribution by Location</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={responseByLocation} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 11, fill: '#6b7280'}}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="responses" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {locationAnalytics.slice(0, 6).map((location, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {location.district}, {location.sector}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {location.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{location.response_count}</div>
                <div className="text-xs text-gray-500">responses</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'questions' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-6">Question Analytics</h3>
            <div className="space-y-4">
              {surveyAnalytics.flatMap(survey => 
                survey.questions.map(question => ({
                  ...question,
                  survey_title: survey.title
                }))
              ).map((question, index) => (
                <div key={`${question.question_id}-${index}`} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {question.question_text}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {question.survey_title} • {question.question_type}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{question.total_answers}</div>
                      <div className="text-xs text-gray-500">answers</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {question.answer_distribution.map((answer, aIndex) => (
                      <div 
                        key={aIndex} 
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        <span className="font-medium">{answer.answer}</span>
                        <span className="text-gray-500 ml-1">({answer.count})</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
