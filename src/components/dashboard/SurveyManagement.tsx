import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Archive, 
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';

const surveys = [
  {
    id: 'SURV-001',
    title: 'Community Fever Monitoring',
    status: 'active',
    responses: 1240,
    created: '2026-01-10',
    type: 'Weekly Surveillance'
  },
  {
    id: 'SURV-002',
    title: 'Post-Rainfall Vector Check',
    status: 'active',
    responses: 850,
    created: '2026-01-15',
    type: 'Seasonal Check'
  },
  {
    id: 'SURV-003',
    title: 'Rural Vaccination Coverage',
    status: 'draft',
    responses: 0,
    created: '2026-01-22',
    type: 'Program Audit'
  },
  {
    id: 'SURV-004',
    title: 'Elderly Chronic Care Signals',
    status: 'archived',
    responses: 2100,
    created: '2025-11-05',
    type: 'Targeted Research'
  }
];

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
              <th className="px-6 py-4 font-semibold">Type</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-center">Responses</th>
              <th className="px-6 py-4 font-semibold">Created</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {surveys.map((survey) => (
              <tr key={survey.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900 group-hover:text-[#18392b]">{survey.title}</span>
                    <span className="text-xs text-gray-400 mt-0.5">{survey.id}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {survey.type}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={survey.status} />
                </td>
                <td className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                  {survey.responses.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {survey.created}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button className="p-1.5 text-gray-400 hover:text-[#18392b] hover:bg-[#18392b]/5 rounded-md transition-colors">
                      <Eye size={16} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
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
    </div>
  );
};
