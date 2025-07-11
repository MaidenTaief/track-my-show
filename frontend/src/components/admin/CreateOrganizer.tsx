import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { organizerService, CreateOrganizerRequest } from '../../services/organizerService';
import { useNavigate } from 'react-router-dom';

const categories = [
  'music', 'theater', 'comedy', 'dance', 'art', 'sports', 'conference', 'workshop', 'festival', 'other'
];

const CreateOrganizer: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateOrganizerRequest & { website?: string; city?: string; country?: string; logo?: File | null }>({
    name: '',
    email: '',
    category: '',
    description: '',
    phone: '',
    website: '',
    city: '',
    country: '',
    logo: null
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, logo: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!formData.name || !formData.email || !formData.category) {
      setError('Name, email, and category are required.');
      return;
    }
    setSaving(true);
    try {
      // Prepare payload (logo upload not implemented here)
      const payload: CreateOrganizerRequest = {
        name: formData.name,
        email: formData.email,
        category: formData.category,
        description: formData.description,
        phone: formData.phone,
        // Optionally add website, city, country if backend supports
      };
      await organizerService.createOrganizer(payload);
      setSuccess('Organizer created successfully!');
      setTimeout(() => navigate('/admin/organizers'), 1000);
    } catch (err: any) {
      setError('Failed to create organizer.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Create Organizer">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8 bg-gray-800 p-8 rounded-lg shadow">
        {error && <div className="bg-red-500 text-white px-4 py-2 rounded">{error}</div>}
        {success && <div className="bg-green-500 text-white px-4 py-2 rounded">{success}</div>}
        <div>
          <label className="block text-white text-sm font-medium mb-2">Name*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded text-white"
            placeholder="Enter organizer name"
            required
          />
        </div>
        <div>
          <label className="block text-white text-sm font-medium mb-2">Email*</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded text-white"
            placeholder="Enter email address"
            required
          />
        </div>
        <div>
          <label className="block text-white text-sm font-medium mb-2">Category*</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded text-white"
            required
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-white text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded text-white resize-none"
            placeholder="Enter description"
          />
        </div>
        <div>
          <label className="block text-white text-sm font-medium mb-2">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded text-white"
            placeholder="Enter phone number"
          />
        </div>
        <div>
          <label className="block text-white text-sm font-medium mb-2">Website</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded text-white"
            placeholder="Enter website URL"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded text-white"
              placeholder="Enter city"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded text-white"
              placeholder="Enter country"
            />
          </div>
        </div>
        <div>
          <label className="block text-white text-sm font-medium mb-2">Logo</label>
          <input
            type="file"
            name="logo"
            accept="image/*"
            onChange={handleLogoChange}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded text-white"
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="text-gray-400 hover:text-white px-6 py-2 rounded"
            onClick={() => navigate('/admin/organizers')}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded"
            disabled={saving}
          >
            {saving ? 'Creating...' : 'Create Organizer'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default CreateOrganizer; 