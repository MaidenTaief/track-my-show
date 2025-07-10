import React from 'react';
import AdminLayout from './AdminLayout';
import { Star, Plus } from 'lucide-react';

const ReviewsManager = () => {
  return (
    <AdminLayout 
      title="Reviews"
      rightActions={
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded flex items-center gap-2">
          <Plus size={16} />
          Add Review
        </button>
      }
    >
      <div className="text-center py-20">
        <Star size={64} className="text-gray-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Reviews Manager</h2>
        <p className="text-gray-400">Manage user reviews and ratings</p>
        <div className="mt-8">
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg">
            Coming Soon
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ReviewsManager; 