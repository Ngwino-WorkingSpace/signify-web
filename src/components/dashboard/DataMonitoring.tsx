import React, { useState, useEffect } from 'react';
import { 
  Filter, 
  Download, 
  Calendar, 
  MapPin, 
  RefreshCcw,
  Search,
  CheckCircle,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  MessageSquare
} from 'lucide-react';

import { apiService } from '../../services/api';

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

const ResponseRow = ({ response, isExpanded, onToggle }: { 
  response: any; 
  isExpanded: boolean; 
  onToggle: () => void;
}) => {
  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100">
        <td className="px-6 py-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={onToggle}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <span className="text-sm font-medium text-[#18392b]">
              {response.response_id?.substring(0, 8)}...
            </span>
          </div>
        </td>
        <td className="px-6 py-4 text-sm text-gray-600">{response.survey_title || 'Community Survey'}</td>
        <td className="px-6 py-4 text-sm text-gray-600">
          <span className="flex items-center">
            <MapPin size={14} className="mr-1.5 text-gray-400" />
            {response.district}, {response.sector}
          </span>
        </td>
        <td className="px-6 py-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium">V</span>
            </div>
            <span>Volunteer</span>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center space-x-2">
            <RiskIndicator level={response.risk_level || 'low'} />
            <span className="text-xs text-gray-500">
              {response.answers?.length || 0} answers
            </span>
          </div>
        </td>
        <td className="px-6 py-4 text-sm text-gray-400 tabular-nums">
          {new Date(response.submitted_at).toLocaleString('en-US', { 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </td>
      </tr>
      
      {isExpanded && (
        <tr className="bg-gray-50/50">
          <td colSpan={6} className="px-6 py-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <MessageSquare size={16} />
                <span>Response Details ({response.answers?.length || 0} questions answered)</span>
              </div>
              
              {response.answers && response.answers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {response.answers.map((answer: any, index: number) => (
                    <div key={answer.answer_id || index} className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="text-xs font-medium text-gray-500 mb-1">
                        Q: {answer.question?.question_text || `Question ${index + 1}`}
                      </div>
                      <div className="text-sm text-gray-800 font-medium">
                        A: {answer.answer_text}
                      </div>
                      {answer.question?.question_type && (
                        <div className="text-xs text-gray-400 mt-1">
                          Type: {answer.question.question_type}
                          {answer.question?.is_required && ' • Required'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic">
                  No answers recorded for this response
                </div>
              )}
              
              <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-200">
                <span>Response ID: {response.response_id}</span>
                <span>Survey ID: {response.surveyId}</span>
                <span>Anonymous Token: {response.anonymous_token?.substring(0, 12)}...</span>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export const DataMonitoring = () => {
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (responseId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(responseId)) {
      newExpanded.delete(responseId);
    } else {
      newExpanded.add(responseId);
    }
    setExpandedRows(newExpanded);
  };

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const data = await apiService.getResponses();
        console.log('Raw responses data:', data);
        setResponses(data || []);
      } catch (error) {
        console.error('Failed to fetch responses:', error);
        // Set empty array as fallback
        setResponses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const data = await apiService.getResponses();
      setResponses(data || []);
    } catch (error) {
      console.error('Failed to refresh responses:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#18392b]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Real-time Monitoring</h1>
          <p className="text-sm text-gray-500 mt-1">
            Live feed of incoming health signals from the field. 
            {responses.length > 0 && ` Showing ${responses.length} response${responses.length !== 1 ? 's' : ''}.`}
          </p>
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
          <input 
            type="text" 
            placeholder="Search by response ID or location..." 
            className="bg-transparent border-none focus:outline-none ml-2 text-sm w-full" 
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <MapPin size={16} className="text-gray-400" />
            <select className="bg-transparent font-medium text-gray-600 focus:outline-none">
              <option>All Locations</option>
              <option>Gasabo</option>
              <option>Kicukiro</option>
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
            {responses.length > 0 ? (
              responses.map((response: any) => (
                <ResponseRow
                  key={response.response_id}
                  response={response}
                  isExpanded={expandedRows.has(response.response_id)}
                  onToggle={() => toggleRow(response.response_id)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center space-y-2">
                    <MessageSquare size={48} className="text-gray-300" />
                    <span className="text-lg font-medium">No responses found</span>
                    <span className="text-sm">Submit some surveys from the mobile app to see data here</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {responses.length > 0 && (
          <div className="p-4 border-t border-gray-50 bg-gray-50/30 flex items-center justify-center">
            <button className="text-sm font-medium text-[#18392b] hover:underline">
              View All {responses.length} Response{responses.length !== 1 ? 's' : ''}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
