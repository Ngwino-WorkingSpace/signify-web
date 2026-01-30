import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MoreVertical, 
  Users, 
  MapPin, 
  Phone,
  Mail,
  Calendar,
  Filter,
  Download,
  Eye,
  Edit2,
  Trash2
} from 'lucide-react';

interface User {
  user_id: string;
  phone_number: string;
  name?: string;
  country: string;
  district: string;
  sector: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMoreMenu, setShowMoreMenu] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // For now, we'll need to add this endpoint to the backend
      // const response = await fetch(`${API_BASE_URL}/users`, {
      //   headers: getAuthHeaders(),
      // });
      // const data = await response.json();
      // setUsers(data);
      
      // Mock data for now
      setUsers([
        {
          user_id: '1',
          phone_number: '+250788123456',
          name: 'John Doe',
          country: 'Rwanda',
          district: 'Gasabo',
          sector: 'Jabana',
          is_active: true,
          created_at: '2026-01-29T08:05:49.023Z'
        },
        {
          user_id: '2',
          phone_number: '+250788123457',
          name: 'Jane Smith',
          country: 'Rwanda',
          district: 'Nyagatare',
          sector: 'Taba',
          is_active: true,
          created_at: '2026-01-29T07:54:31.743Z'
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone_number.includes(searchTerm) ||
    user.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowViewModal(true);
    setShowMoreMenu(null);
  };

  const getStatusBadge = (isActive: boolean) => {
    const styles = isActive 
      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
      : 'bg-rose-50 text-rose-700 border-rose-100';
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${styles}`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
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
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage mobile app users and their locations.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center bg-white px-3 py-1.5 border border-gray-200 rounded-lg w-72">
            <Search size={16} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none focus:outline-none ml-2 text-sm w-full"
            />
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users size={16} />
            <span>{filteredUsers.length} users</span>
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">User Details</th>
              <th className="px-6 py-4 font-semibold">Location</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Joined</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <tr key={user.user_id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-gray-900 group-hover:text-[#18392b]">
                        {user.name || 'Anonymous User'}
                      </span>
                      {getStatusBadge(user.is_active)}
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Phone size={12} />
                        <span>{user.phone_number}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <MapPin size={14} />
                    <span>{user.country}, {user.district}, {user.sector}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600">
                    Mobile App User
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button 
                      onClick={() => handleViewUser(user)}
                      className="p-1.5 text-gray-400 hover:text-[#18392b] hover:bg-[#18392b]/5 rounded-md transition-colors"
                      title="View User"
                    >
                      <Eye size={16} />
                    </button>
                    <div className="relative">
                      <button 
                        onClick={() => setShowMoreMenu(showMoreMenu === user.user_id ? null : user.user_id)}
                        className="p-1.5 text-gray-400 hover:text-[#18392b] hover:bg-[#18392b]/5 rounded-md transition-colors"
                        title="More options"
                      >
                        <MoreVertical size={16} />
                      </button>
                      
                      {showMoreMenu === user.user_id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg border border-gray-200 shadow-lg z-10">
                          <button 
                            onClick={() => handleViewUser(user)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                          >
                            <Eye size={14} />
                            <span>View Details</span>
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                            <Edit2 size={14} />
                            <span>Edit User</span>
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
                            <Trash2 size={14} />
                            <span>Deactivate</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500">Get started by having users register on the mobile app.</p>
          </div>
        )}
      </div>

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">User Details</h2>
                <button 
                  onClick={() => setShowViewModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Trash2 size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#18392b]/10 rounded-full flex items-center justify-center">
                    <Users size={24} className="text-[#18392b]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {selectedUser.name || 'Anonymous User'}
                    </h3>
                    <p className="text-sm text-gray-500">{selectedUser.phone_number}</p>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Status</span>
                    {getStatusBadge(selectedUser.is_active)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Location</span>
                    <span className="text-sm text-gray-900">
                      {selectedUser.country}, {selectedUser.district}, {selectedUser.sector}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Joined</span>
                    <span className="text-sm text-gray-900">
                      {new Date(selectedUser.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
