import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { X, Plus } from 'lucide-react';

const HomepageManager = () => {
  const [heroHeadline, setHeroHeadline] = useState("Never miss your favorite shows!");
  const [heroSubHeading, setHeroSubHeading] = useState("Find the best shows across Dhaka city and book your seats now!");
  
  const [images1, setImages1] = useState([
    { id: 1, name: 'nebula111sa.......jpg' },
    { id: 2, name: 'nebula111sa.......jpg' },
    { id: 3, name: 'nebula111sa.......jpg' },
    { id: 4, name: 'nebula111sa.......jpg' },
  ]);

  const [trendingShows] = useState([
    'Adam Surat', 'Joy Bangla Concert', 'Adam Surat', 'Adam Surat'
  ]);

  const removeImage = (setImages: any, id: number) => {
    setImages((prev: any) => prev.filter((img: any) => img.id !== id));
  };

  return (
    <AdminLayout 
      title="Homepage"
      rightActions={
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">Status: Staged for published</span>
          <button className="text-gray-400 hover:text-white">Cancel</button>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded">
            Save
          </button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Hero Headline */}
        <div>
          <label className="block text-white text-sm font-medium mb-3">Hero headline*</label>
          <input
            type="text"
            value={heroHeadline}
            onChange={(e) => setHeroHeadline(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white"
          />
        </div>

        {/* Hero Sub-heading */}
        <div>
          <label className="block text-white text-sm font-medium mb-3">Hero sub-heading*</label>
          <input
            type="text"
            value={heroSubHeading}
            onChange={(e) => setHeroSubHeading(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white"
          />
        </div>

        {/* Hero reel 1st column */}
        <div>
          <label className="block text-white text-sm font-medium mb-3">Hero reel 1st column</label>
          <div className="grid grid-cols-5 gap-4">
            {images1.map((image) => (
              <div key={image.id} className="relative">
                <div className="aspect-square bg-purple-600 rounded flex items-center justify-center relative">
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-purple-700 rounded"></div>
                  <button 
                    onClick={() => removeImage(setImages1, image.id)}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-75"
                  >
                    <X size={12} className="text-white" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2 truncate">{image.name}</p>
              </div>
            ))}
            <div className="aspect-square border-2 border-dashed border-gray-600 rounded flex items-center justify-center cursor-pointer hover:border-gray-500">
              <div className="text-center">
                <Plus size={24} className="text-gray-500 mx-auto mb-2" />
                <p className="text-xs text-gray-500">Add images+</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">20/25 images left</p>
        </div>

        {/* Trending Shows */}
        <div>
          <label className="block text-white text-sm font-medium mb-3">Trending Shows</label>
          <div className="flex flex-wrap gap-2">
            {trendingShows.map((show, index) => (
              <span key={index} className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {show}
                <X size={14} className="cursor-pointer hover:text-gray-300" />
              </span>
            ))}
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded-full text-sm">
              Add Show+
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default HomepageManager; 