import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Upload, Eye, EyeOff } from 'lucide-react';

const CreateUser = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'User',
    status: 'Active'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <AdminLayout 
      title="Create User"
      rightActions={
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-white">Cancel</button>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded">
            Create User
          </button>
        </div>
      }
    >
      <div className="max-w-2xl space-y-8">
        {/* Profile Picture */}
        <div>
          <label className="block text-white text-sm font-medium mb-3">Profile Picture</label>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center">
              <Upload size={24} className="text-gray-400" />
            </div>
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded">
              Upload Photo
            </button>
          </div>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white text-sm font-medium mb-3">First Name*</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white"
              placeholder="Enter first name"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-3">Last Name*</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white"
              placeholder="Enter last name"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <label className="block text-white text-sm font-medium mb-3">Email*</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white"
            placeholder="Enter email address"
          />
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-3">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white"
            placeholder="Enter phone number"
          />
        </div>

        {/* Password Fields */}
        <div>
          <label className="block text-white text-sm font-medium mb-3">Password*</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white pr-12"
              placeholder="Enter password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-3">Confirm Password*</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white pr-12"
              placeholder="Confirm password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Role and Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white text-sm font-medium mb-3">Role*</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white"
            >
              <option value="User">User</option>
              <option value="Organizer">Organizer</option>
              <option value="Admin">Admin</option>
              <option value="Super Admin">Super Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-3">Status*</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Permissions */}
        <div>
          <label className="block text-white text-sm font-medium mb-3">Permissions</label>
          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 rounded" />
              <span className="text-gray-300">Can create events</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 rounded" />
              <span className="text-gray-300">Can manage users</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 rounded" />
              <span className="text-gray-300">Can access analytics</span>
            </label>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateUser;
