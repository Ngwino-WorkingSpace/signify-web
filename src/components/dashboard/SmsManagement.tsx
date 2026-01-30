import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Users, 
  MapPin, 
  Phone,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronDown
} from 'lucide-react';

interface Survey {
  survey_id: string;
  title: string;
  description: string;
  status: string;
  locations?: Array<{
    country: string;
    district: string;
    sector: string;
  }>;
}

interface SmsResult {
  success: number;
  failed: number;
}

const SmsManagement = () => {
  const [activeTab, setActiveTab] = useState<'survey' | 'general' | 'bulk'>('survey');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SmsResult | null>(null);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loadingSurveys, setLoadingSurveys] = useState(false);
  
  // Survey notification form
  const [surveyForm, setSurveyForm] = useState({
    selected_survey_id: '',
    survey_title: '',
    locations: [{ country: '', district: '', sector: '' }]
  });

  // General notification form
  const [generalForm, setGeneralForm] = useState({
    message: '',
    target_locations: [{ country: '', district: '', sector: '' }]
  });

  // Bulk SMS form
  const [bulkForm, setBulkForm] = useState({
    phone_numbers: '',
    message: ''
  });

  // Fetch existing surveys
  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    setLoadingSurveys(true);
    try {
      const response = await fetch('http://localhost:3005/surveys');
      const data = await response.json();
      setSurveys(data);
    } catch (error) {
      console.error('Failed to fetch surveys:', error);
    } finally {
      setLoadingSurveys(false);
    }
  };

  const handleSurveySelection = (surveyId: string) => {
    const selectedSurvey = surveys.find(s => s.survey_id === surveyId);
    if (selectedSurvey) {
      setSurveyForm(prev => ({
        ...prev,
        selected_survey_id: surveyId,
        survey_title: selectedSurvey.title,
        locations: selectedSurvey.locations && selectedSurvey.locations.length > 0 
          ? selectedSurvey.locations 
          : [{ country: '', district: '', sector: '' }]
      }));
    }
  };

  const addLocation = (formType: 'survey' | 'general') => {
    if (formType === 'survey') {
      setSurveyForm(prev => ({
        ...prev,
        locations: [...prev.locations, { country: '', district: '', sector: '' }]
      }));
    } else {
      setGeneralForm(prev => ({
        ...prev,
        target_locations: [...prev.target_locations, { country: '', district: '', sector: '' }]
      }));
    }
  };

  const removeLocation = (formType: 'survey' | 'general', index: number) => {
    if (formType === 'survey') {
      setSurveyForm(prev => ({
        ...prev,
        locations: prev.locations.filter((_, i) => i !== index)
      }));
    } else {
      setGeneralForm(prev => ({
        ...prev,
        target_locations: prev.target_locations.filter((_, i) => i !== index)
      }));
    }
  };

  const updateLocation = (formType: 'survey' | 'general', index: number, field: string, value: string) => {
    if (formType === 'survey') {
      setSurveyForm(prev => ({
        ...prev,
        locations: prev.locations.map((loc, i) => 
          i === index ? { ...loc, [field]: value } : loc
        )
      }));
    } else {
      setGeneralForm(prev => ({
        ...prev,
        target_locations: prev.target_locations.map((loc, i) => 
          i === index ? { ...loc, [field]: value } : loc
        )
      }));
    }
  };

  const sendSurveyNotification = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3005/sms/survey-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          survey_title: surveyForm.survey_title,
          survey_locations: surveyForm.locations
        })
      });
      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error('Failed to send survey notification:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendGeneralNotification = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3005/sms/general-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: generalForm.message,
          target_locations: generalForm.target_locations.filter(loc => loc.country && loc.district && loc.sector)
        })
      });
      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error('Failed to send general notification:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendBulkSms = async () => {
    setLoading(true);
    try {
      const phoneNumbers = bulkForm.phone_numbers.split(',').map(p => p.trim()).filter(p => p);
      const response = await fetch('http://localhost:3005/sms/send-bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_numbers: phoneNumbers,
          message: bulkForm.message
        })
      });
      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error('Failed to send bulk SMS:', error);
    } finally {
      setLoading(false);
    }
  };

  const testSms = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3005/sms/test');
      const data = await response.json();
    } catch (error) {
      console.error('Failed to send test SMS:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SMS Management</h1>
          <p className="text-sm text-gray-500 mt-1">Send SMS notifications to users and manage communications.</p>
        </div>
        <button 
          onClick={testSms}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <MessageSquare size={16} />}
          <span>Test SMS</span>
        </button>
      </div>

      {/* Results Display */}
      {results && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="text-green-600" size={20} />
            <div>
              <h3 className="font-semibold text-green-800">SMS Sent Successfully</h3>
              <p className="text-green-600 text-sm">
                {results.success} messages sent, {results.failed} failed
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="border-b border-gray-100">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('survey')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'survey'
                  ? 'border-[#18392b] text-[#18392b]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Survey Notification
            </button>
            <button
              onClick={() => setActiveTab('general')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'general'
                  ? 'border-[#18392b] text-[#18392b]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              General Notification
            </button>
            <button
              onClick={() => setActiveTab('bulk')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'bulk'
                  ? 'border-[#18392b] text-[#18392b]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Bulk SMS
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Survey Notification Tab */}
          {activeTab === 'survey' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Survey
                  </label>
                  <button
                    onClick={fetchSurveys}
                    disabled={loadingSurveys}
                    className="text-sm text-[#18392b] hover:text-[#18392b]/80"
                  >
                    Refresh
                  </button>
                </div>
                <div className="relative">
                  <select
                    value={surveyForm.selected_survey_id}
                    onChange={(e) => handleSurveySelection(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18392b] focus:border-transparent appearance-none bg-white"
                    disabled={loadingSurveys}
                  >
                    <option value="">Choose a survey...</option>
                    {surveys.map((survey) => (
                      <option key={survey.survey_id} value={survey.survey_id}>
                        {survey.title} ({survey.status})
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                </div>
                {loadingSurveys && (
                  <p className="text-sm text-gray-500 mt-1">Loading surveys...</p>
                )}
              </div>

              {surveyForm.selected_survey_id && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Selected:</strong> {surveyForm.survey_title}
                  </p>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Target Locations
                  </label>
                  <button
                    onClick={() => addLocation('survey')}
                    className="text-sm text-[#18392b] hover:text-[#18392b]/80"
                  >
                    + Add Location
                  </button>
                </div>
                <div className="space-y-3">
                  {surveyForm.locations.map((location, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={location.country}
                        onChange={(e) => updateLocation('survey', index, 'country', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18392b] focus:border-transparent"
                        placeholder="Country"
                      />
                      <input
                        type="text"
                        value={location.district}
                        onChange={(e) => updateLocation('survey', index, 'district', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18392b] focus:border-transparent"
                        placeholder="District"
                      />
                      <input
                        type="text"
                        value={location.sector}
                        onChange={(e) => updateLocation('survey', index, 'sector', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18392b] focus:border-transparent"
                        placeholder="Sector"
                      />
                      {surveyForm.locations.length > 1 && (
                        <button
                          onClick={() => removeLocation('survey', index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={sendSurveyNotification}
                disabled={loading || !surveyForm.selected_survey_id || surveyForm.locations.every(loc => !loc.country)}
                className="flex items-center space-x-2 px-6 py-2 bg-[#18392b] text-white rounded-lg font-medium hover:bg-opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                <span>Send Survey Notification</span>
              </button>
            </div>
          )}

          {/* General Notification Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={generalForm.message}
                  onChange={(e) => setGeneralForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18392b] focus:border-transparent"
                  rows={4}
                  placeholder="Enter your message here..."
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Target Locations (Optional - leave empty to send to all users)
                  </label>
                  <button
                    onClick={() => addLocation('general')}
                    className="text-sm text-[#18392b] hover:text-[#18392b]/80"
                  >
                    + Add Location
                  </button>
                </div>
                <div className="space-y-3">
                  {generalForm.target_locations.map((location, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={location.country}
                        onChange={(e) => updateLocation('general', index, 'country', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18392b] focus:border-transparent"
                        placeholder="Country"
                      />
                      <input
                        type="text"
                        value={location.district}
                        onChange={(e) => updateLocation('general', index, 'district', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18392b] focus:border-transparent"
                        placeholder="District"
                      />
                      <input
                        type="text"
                        value={location.sector}
                        onChange={(e) => updateLocation('general', index, 'sector', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18392b] focus:border-transparent"
                        placeholder="Sector"
                      />
                      <button
                        onClick={() => removeLocation('general', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={sendGeneralNotification}
                disabled={loading || !generalForm.message}
                className="flex items-center space-x-2 px-6 py-2 bg-[#18392b] text-white rounded-lg font-medium hover:bg-opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                <span>Send General Notification</span>
              </button>
            </div>
          )}

          {/* Bulk SMS Tab */}
          {activeTab === 'bulk' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Numbers (comma-separated)
                </label>
                <textarea
                  value={bulkForm.phone_numbers}
                  onChange={(e) => setBulkForm(prev => ({ ...prev, phone_numbers: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18392b] focus:border-transparent"
                  rows={3}
                  placeholder="+250788123456, +250788123457, +250788123458"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={bulkForm.message}
                  onChange={(e) => setBulkForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18392b] focus:border-transparent"
                  rows={4}
                  placeholder="Enter your message here..."
                />
              </div>

              <button
                onClick={sendBulkSms}
                disabled={loading || !bulkForm.phone_numbers || !bulkForm.message}
                className="flex items-center space-x-2 px-6 py-2 bg-[#18392b] text-white rounded-lg font-medium hover:bg-opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                <span>Send Bulk SMS</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmsManagement;
