import React from 'react';
import AdminLayout from './AdminLayout';
import { Radio, Plus } from 'lucide-react';

const LiveEventManager = () => {
  return (
    <AdminLayout 
      title="Live Events"
      rightActions={
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded flex items-center gap-2">
          <Plus size={16} />
          Create Live Event
        </button>
      }
    >
      <div className="text-center py-20">
        <Radio size={64} className="text-gray-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Live Events Manager</h2>
        <p className="text-gray-400">Manage live streaming events</p>
        <div className="mt-8">
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg">
            Coming Soon
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default LiveEventManager; 