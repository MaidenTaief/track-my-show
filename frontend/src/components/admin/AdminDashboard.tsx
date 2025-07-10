import React from 'react';
import AdminLayout from './AdminLayout';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          {/* User Avatar */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-yellow-300 rounded-lg p-4">
              {/* Cartoon Avatar */}
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Face */}
                <circle cx="50" cy="45" r="25" fill="#F4C2A1" />
                {/* Hair */}
                <path d="M25 35 Q25 20 50 20 Q75 20 75 35 L75 45 Q75 25 50 25 Q25 25 25 45 Z" fill="#D2691E" />
                {/* Glasses */}
                <circle cx="42" cy="40" r="8" fill="none" stroke="#333" strokeWidth="2" />
                <circle cx="58" cy="40" r="8" fill="none" stroke="#333" strokeWidth="2" />
                <line x1="50" y1="40" x2="50" y2="40" stroke="#333" strokeWidth="2" />
                <circle cx="42" cy="40" r="6" fill="rgba(255,255,255,0.3)" />
                <circle cx="58" cy="40" r="6" fill="rgba(255,255,255,0.3)" />
                {/* Eyes */}
                <circle cx="42" cy="40" r="2" fill="#333" />
                <circle cx="58" cy="40" r="2" fill="#333" />
                {/* Nose */}
                <circle cx="50" cy="47" r="1.5" fill="#E6A584" />
                {/* Mouth */}
                <path d="M45 52 Q50 56 55 52" stroke="#333" strokeWidth="1.5" fill="none" />
                {/* Collar/Shirt */}
                <rect x="35" y="70" width="30" height="20" fill="white" />
                <polygon points="45,70 50,75 55,70" fill="#333" />
              </svg>
            </div>
          </div>

          {/* Welcome Message */}
          <h1 className="text-4xl font-bold text-white mb-4">
            Hello Bayazid !
          </h1>
          <p className="text-gray-400 text-lg">
            It's good to see you again.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto">
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-3xl font-bold text-orange-500 mb-2">15</div>
              <div className="text-gray-400 text-sm">Active Events</div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-3xl font-bold text-green-500 mb-2">234</div>
              <div className="text-gray-400 text-sm">Total Users</div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-3xl font-bold text-blue-500 mb-2">8</div>
              <div className="text-gray-400 text-sm">Articles</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
