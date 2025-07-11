import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { Search, Plus, Mail, Phone, Building } from 'lucide-react';
import { organizerService, Organizer } from '../../services/organizerService';
import { useNavigate } from 'react-router-dom';

const OrganizerManager = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await organizerService.getOrganizers();
        setOrganizers(response.data);
      } catch (err) {
        setError('Failed to load organizers');
        setOrganizers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrganizers();
  }, []);

  return (
    <AdminLayout 
      title="Organizers"
      rightActions={
        <button
          onClick={() => navigate('/admin/organizers/new')}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={16} />
          New Organizer
        </button>
      }
    >
      <div className="space-y-6">
        {/* Search */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Manage Organizers</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search organizers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white px-4 py-2 pr-10 rounded w-64"
            />
            <Search size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Loading/Error */}
        {loading && <div className="text-white">Loading organizers...</div>}
        {error && <div className="text-red-500">{error}</div>}

        {/* Organizers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizers.map((organizer) => (
            <div key={organizer.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <Building size={24} className="text-white" />
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  organizer.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {organizer.status}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">{organizer.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{organizer.category}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail size={14} />
                  <span className="text-sm">{organizer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Phone size={14} />
                  <span className="text-sm">{organizer.phone}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">
                  {organizer.followersCount ?? 0} followers
                </span>
                <div className="flex gap-2">
                  <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm">
                    Edit
                  </button>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm">
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrganizerManager;
