import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Archive, 
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  MapPin,
  Users,
  BarChart3,
  MessageSquare
} from 'lucide-react';

import { apiService, Survey, CreateSurveyData } from '../../services/api';

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    draft: 'bg-gray-50 text-gray-600 border-gray-200',
    archived: 'bg-rose-50 text-rose-700 border-rose-100'
  };

  const icons: Record<string, any> = {
    active: <CheckCircle2 size={12} className="mr-1" />,
    draft: <Clock size={12} className="mr-1" />,
    archived: <Archive size={12} className="mr-1" />
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {icons[status]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export const SurveyManagement = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState<string | null>(null);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingSurvey, setCreatingSurvey] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState(false);
  const [newSurvey, setNewSurvey] = useState({
    title: '',
    description: '',
    country: '',
    district: '',
    sector: '',
    status: 'draft',
    questions: [
      {
        question_text: '',
        question_type: 'single-choice',
        is_required: true,
        order_index: 1,
        options: [
          { option_text: '' },
          { option_text: '' }
        ]
      }
    ]
  });

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const data = await apiService.getSurveys();
        setSurveys(data);
      } catch (error) {
        console.error('Failed to fetch surveys:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      // Only close if clicking outside of any dropdown menu
      if (showMoreMenu && !target.closest('.dropdown-menu') && !target.closest('button')) {
        console.log('Click outside detected, closing menu');
        setShowMoreMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMoreMenu]);

  useEffect(() => {
    console.log('Modal states changed:', { 
      showViewModal, 
      showEditModal, 
      showCreateModal,
      selectedSurvey,
      showMoreMenu
    });
  }, [showViewModal, showEditModal, showCreateModal, selectedSurvey, showMoreMenu]);

  const handleDeleteSurvey = async (surveyId: string) => {
    try {
      // Debug: Check authentication status
      const token = localStorage.getItem('auth_token');
      console.log('Auth token exists:', !!token);
      console.log('Auth token value:', token ? token.substring(0, 20) + '...' : 'none');
      
      // Check if user is authenticated
      if (!apiService.isAuthenticated()) {
        alert('You must be logged in to delete surveys. Redirecting to login...');
        window.location.href = '/login';
        return;
      }

      // Use the correct survey_id field from API response
      const actualId = surveyId || selectedSurvey?.survey_id;
      if (!actualId) {
        console.error('No survey ID provided for deletion');
        return;
      }
      
      await apiService.deleteSurvey(actualId);
      setSurveys(surveys.filter(s => s.survey_id !== actualId));
      setShowMoreMenu(null);
    } catch (error: any) {
      console.error('Failed to delete survey:', error);
      if (error.message.includes('Session expired')) {
        // Error is already handled by API service with redirect
        return;
      }
      if (error.message.includes('permission')) {
        // Authorization error - show specific message
        alert(error.message);
        return;
      }
      alert(`Failed to delete survey: ${error.message}`);
    }
  };

  const handleViewSurvey = (survey: any) => {
    console.log('View survey clicked:', survey);
    setSelectedSurvey(survey);
    setShowViewModal(true);
    setShowMoreMenu(null);
  };

  const handleEditSurvey = (survey: any) => {
    console.log('Edit survey clicked:', survey);
    setSelectedSurvey(survey);
    setShowEditModal(true);
    setShowMoreMenu(null);
  };

  const handleUpdateSurvey = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditingSurvey(true);
    
    try {
      // Create the updated survey data structure
      const updatedData: UpdateSurveyData = {
        title: selectedSurvey.title,
        description: selectedSurvey.description,
        status: selectedSurvey.status,
        start_date: selectedSurvey.start_date,
        end_date: selectedSurvey.end_date,
        locations: (selectedSurvey.locations || []).map((location: any) => ({
          country: location.country,
          district: location.district,
          sector: location.sector
        }))
      };

      const updatedSurvey = await apiService.updateSurvey(selectedSurvey.survey_id, updatedData);
      setSurveys(surveys.map(s => s.survey_id === selectedSurvey.survey_id ? updatedSurvey : s));
      setShowEditModal(false);
      setSelectedSurvey(null);
    } catch (error) {
      console.error('Failed to update survey:', error);
    } finally {
      setEditingSurvey(false);
    }
  };

  const handleDuplicateSurvey = async (survey: any) => {
    console.log('Duplicate survey clicked:', survey);
    try {
      const duplicatedData = {
        ...survey,
        title: `${survey.title} (Copy)`,
        status: 'draft',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      
      const newSurvey = await apiService.createSurvey(duplicatedData);
      setSurveys([newSurvey, ...surveys]);
      setShowMoreMenu(null);
    } catch (error) {
      console.error('Failed to duplicate survey:', error);
    }
  };

  const handleSendSmsNotification = async (survey: any) => {
    console.log('Send SMS notification clicked:', survey);
    try {
      const response = await fetch('http://localhost:3005/sms/survey-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          survey_title: survey.title,
          survey_locations: survey.locations || []
        })
      });
      const data = await response.json();
      
      if (response.ok) {
        alert(`SMS notification sent successfully! ${data.results.success} sent, ${data.results.failed} failed`);
      } else {
        alert('Failed to send SMS notification');
      }
      
      setShowMoreMenu(null);
    } catch (error) {
      console.error('Failed to send SMS notification:', error);
      alert('Failed to send SMS notification');
    }
  };

  const handleCreateSurvey = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingSurvey(true);
    
    try {
      // Filter out empty questions and options
      const validQuestions = newSurvey.questions
        .filter(q => q.question_text.trim())
        .map(q => ({
          ...q,
          options: q.options.filter(opt => opt.option_text.trim())
        }))
        .filter(q => q.options.length > 0);

      if (validQuestions.length === 0) {
        alert('Please add at least one question with options');
        setCreatingSurvey(false);
        return;
      }

      // Create the survey data structure expected by the backend
      const surveyData = {
        title: newSurvey.title,
        description: newSurvey.description,
        status: newSurvey.status,
        start_date: new Date().toISOString().split('T')[0], // Today
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        questions: validQuestions,
        locations: [
          {
            country: newSurvey.country,
            district: newSurvey.district,
            sector: newSurvey.sector
          }
        ]
      };

      const createdSurvey = await apiService.createSurvey(surveyData);
      setSurveys([createdSurvey, ...surveys]);
      setShowCreateModal(false);
      

      setNewSurvey({
        title: '',
        description: '',
        country: '',
        district: '',
        sector: '',
        status: 'draft',
        questions: [
          {
            question_text: '',
            question_type: 'single-choice',
            is_required: true,
            order_index: 1,
            options: [
              { option_text: '' },
              { option_text: '' }
            ]
          }
        ]
      });
    } catch (error) {
      console.error('Failed to create survey:', error);
    } finally {
      setCreatingSurvey(false);
    }
  };

  // Helper functions for question management
  const addQuestion = () => {
    const newQuestion = {
      question_text: '',
      question_type: 'single-choice',
      is_required: true,
      order_index: newSurvey.questions.length + 1,
      options: [
        { option_text: '' },
        { option_text: '' }
      ]
    };
    setNewSurvey({
      ...newSurvey,
      questions: [...newSurvey.questions, newQuestion]
    });
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = newSurvey.questions.filter((_, i) => i !== index);
    setNewSurvey({
      ...newSurvey,
      questions: updatedQuestions
    });
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updatedQuestions = [...newSurvey.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    setNewSurvey({
      ...newSurvey,
      questions: updatedQuestions
    });
  };

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...newSurvey.questions];
    updatedQuestions[questionIndex].options.push({ option_text: '' });
    setNewSurvey({
      ...newSurvey,
      questions: updatedQuestions
    });
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...newSurvey.questions];
    updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);
    setNewSurvey({
      ...newSurvey,
      questions: updatedQuestions
    });
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...newSurvey.questions];
    updatedQuestions[questionIndex].options[optionIndex] = { option_text: value };
    setNewSurvey({
      ...newSurvey,
      questions: updatedQuestions
    });
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Survey Management</h1>
          <p className="text-sm text-gray-500 mt-1">Create and manage community health surveys and logic rules.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-[#18392b] text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-opacity"
        >
          <Plus size={18} />
          <span>Create New Survey</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center bg-white px-3 py-1.5 border border-gray-200 rounded-lg w-72">
            <Search size={16} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Filter by title or ID..." 
              className="bg-transparent border-none focus:outline-none ml-2 text-sm w-full"
            />
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-white hover:shadow-sm rounded-md transition-all">All</button>
            <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-white hover:shadow-sm rounded-md transition-all">Active</button>
            <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-white hover:shadow-sm rounded-md transition-all">Drafts</button>
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Survey Details</th>
              <th className="px-6 py-4 font-semibold">Locations</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-center">Responses</th>
              <th className="px-6 py-4 font-semibold">Created</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {surveys.map((survey) => {
              const surveyId = survey.survey_id;
              return (
                <tr key={surveyId} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900 group-hover:text-[#18392b]">{survey.title}</span>
                      <span className="text-xs text-gray-400 mt-0.5">{surveyId}</span>
                    </div>
                  </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {survey.locations && survey.locations.length > 0 ? (
                    <div className="flex items-center space-x-1">
                      <MapPin size={12} />
                      <span>{survey.locations.length} location{survey.locations.length > 1 ? 's' : ''}</span>
                    </div>
                  ) : (
                    'All Locations'
                  )}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={survey.status || 'draft'} />
                </td>
                <td className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                  {(survey._count?.responses || 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {survey.created_at ? new Date(survey.created_at).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button 
                      onClick={() => handleViewSurvey(survey)}
                      className="p-1.5 text-gray-400 hover:text-[#18392b] hover:bg-[#18392b]/5 rounded-md transition-colors"
                      title="View Survey"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      onClick={() => handleEditSurvey(survey)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Edit Survey"
                    >
                      <Edit2 size={16} />
                    </button>
                    <div className="relative">
                      <button 
                        onClick={() => {
                          console.log('More menu clicked for survey:', surveyId);
                          setShowMoreMenu(showMoreMenu === surveyId ? null : surveyId);
                        }}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors z-50"
                        title="More Options"
                      >
                        <MoreVertical size={16} />
                      </button>
                      
                      {showMoreMenu === surveyId && (
                        <div className="dropdown-menu absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                          <div className="py-1">
                            <button
                              onClick={() => handleDuplicateSurvey(survey)}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                            >
                              <Archive size={14} />
                              <span>Duplicate</span>
                            </button>
                            <button
                              onClick={() => handleSendSmsNotification(survey)}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                            >
                              <MessageSquare size={14} />
                              <span>Send SMS</span>
                            </button>
                            <button
                              onClick={() => handleDeleteSurvey(surveyId)}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                            >
                              <Archive size={14} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Logic Preview Card */}
      <div className="bg-[#18392b]/5 p-6 rounded-xl border border-[#18392b]/10">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-white rounded-lg border border-[#18392b]/20">
            <AlertCircle className="text-[#18392b] w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-[#18392b]">Survey Logic Rule Active</h4>
            <p className="text-sm text-gray-600 mt-1">
              "Community Fever Monitoring" currently has skip logic: If "Fever Present" is "No", skip to "Section 4: Household Demographics".
            </p>
          </div>
        </div>
      </div>

      {/* Create Survey Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full h-[500px] overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Create New Survey</h2>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="overflow-y-auto h-[350px] pr-2">
                <form onSubmit={handleCreateSurvey} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Survey Title
                </label>
                <input
                  type="text"
                  required
                  value={newSurvey.title}
                  onChange={(e) => setNewSurvey({...newSurvey, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18392b] focus:border-transparent"
                  placeholder="Enter survey title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  value={newSurvey.description}
                  onChange={(e) => setNewSurvey({...newSurvey, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18392b] focus:border-transparent"
                  placeholder="Enter survey description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    required
                    value={newSurvey.country}
                    onChange={(e) => setNewSurvey({...newSurvey, country: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18392b] focus:border-transparent"
                    placeholder="Enter country"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    required
                    value={newSurvey.district}
                    onChange={(e) => setNewSurvey({...newSurvey, district: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18392b] focus:border-transparent"
                    placeholder="Enter district"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sector
                  </label>
                  <input
                    type="text"
                    required
                    value={newSurvey.sector}
                    onChange={(e) => setNewSurvey({...newSurvey, sector: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18392b] focus:border-transparent"
                    placeholder="Enter sector"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={newSurvey.status}
                  onChange={(e) => setNewSurvey({...newSurvey, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18392b] focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  {newSurvey.status === 'draft' && 'Survey will not be visible to users until set to Active'}
                  {newSurvey.status === 'active' && 'Survey will be immediately visible to users in the selected location'}
                  {newSurvey.status === 'completed' && 'Survey is closed for new responses'}
                  {newSurvey.status === 'archived' && 'Survey is archived and not visible'}
                </p>
              </div>

              {/* Questions Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Questions</h3>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="px-3 py-1 bg-[#18392b] text-white text-sm rounded-md hover:bg-opacity-90 transition-opacity"
                  >
                    Add Question
                  </button>
                </div>

                {newSurvey.questions.map((question, questionIndex) => (
                  <div key={questionIndex} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Question {questionIndex + 1}</h4>
                      {newSurvey.questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(questionIndex)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Question Text
                      </label>
                      <input
                        type="text"
                        value={question.question_text}
                        onChange={(e) => updateQuestion(questionIndex, 'question_text', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18392b] focus:border-transparent"
                        placeholder="Enter your question"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Question Type
                        </label>
                        <select
                          value={question.question_type}
                          onChange={(e) => updateQuestion(questionIndex, 'question_type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18392b] focus:border-transparent"
                        >
                          <option value="single-choice">Single Choice</option>
                          <option value="text">Text</option>
                          <option value="number">Number</option>
                        </select>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`required-${questionIndex}`}
                          checked={question.is_required}
                          onChange={(e) => updateQuestion(questionIndex, 'is_required', e.target.checked)}
                          className="mr-2"
                        />
                        <label htmlFor={`required-${questionIndex}`} className="text-sm text-gray-700">
                          Required
                        </label>
                      </div>
                    </div>

                    {(question.question_type === 'single-choice') && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-sm font-medium text-gray-700">
                            Options
                          </label>
                          <button
                            type="button"
                            onClick={() => addOption(questionIndex)}
                            className="text-sm text-[#18392b] hover:text-[#18392b]/80"
                          >
                            Add Option
                          </button>
                        </div>

                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={option.option_text}
                              onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18392b] focus:border-transparent"
                              placeholder={`Option ${optionIndex + 1}`}
                            />
                            {question.options.length > 2 && (
                              <button
                                type="button"
                                onClick={() => removeOption(questionIndex, optionIndex)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingSurvey}
                  className="flex-1 px-4 py-2 bg-[#18392b] text-white rounded-lg hover:bg-opacity-90 transition-opacity disabled:opacity-50"
                >
                  {creatingSurvey ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating...
                    </div>
                  ) : (
                    'Create Survey'
                  )}
                </button>
              </div>
            </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Survey Modal */}
      {showViewModal && selectedSurvey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Survey Details</h2>
              <button 
                onClick={() => setShowViewModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedSurvey.title}</h3>
                <p className="text-gray-600">{selectedSurvey.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                  <StatusBadge status={selectedSurvey.status || 'draft'} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Created</label>
                  <p className="text-sm text-gray-900">
                    {selectedSurvey.created ? new Date(selectedSurvey.created).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              {selectedSurvey.questions && selectedSurvey.questions.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Questions</h4>
                  <div className="space-y-3">
                    {selectedSurvey.questions.map((question: any, index: number) => (
                      <div key={question.question_id || index} className="bg-gray-50 p-3 rounded-lg">
                        <p className="font-medium text-gray-900">{question.question_text}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Type: {question.question_type} | Required: {question.is_required ? 'Yes' : 'No'}
                        </p>
                        {question.options && question.options.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">Options:</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {question.options.map((option: any) => (
                                <span key={option.option_id} className="text-xs bg-white px-2 py-1 rounded border">
                                  {option.option_text}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedSurvey.locations && selectedSurvey.locations.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Locations</h4>
                  <div className="space-y-2">
                    {selectedSurvey.locations.map((location: any) => (
                      <div key={location.survey_location_id || location.location_id} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-900">
                          {location.country} → {location.district} → {location.sector}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Survey Modal */}
      {showEditModal && selectedSurvey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Edit Survey</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleUpdateSurvey} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Survey Title
                </label>
                <input
                  type="text"
                  required
                  value={selectedSurvey.title}
                  onChange={(e) => setSelectedSurvey({...selectedSurvey, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18392b] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  value={selectedSurvey.description}
                  onChange={(e) => setSelectedSurvey({...selectedSurvey, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18392b] focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={selectedSurvey.status || 'draft'}
                  onChange={(e) => setSelectedSurvey({...selectedSurvey, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18392b] focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editingSurvey}
                  className="flex-1 px-4 py-2 bg-[#18392b] text-white rounded-lg hover:bg-opacity-90 transition-opacity disabled:opacity-50"
                >
                  {editingSurvey ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Updating...
                    </div>
                  ) : (
                    'Update Survey'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
