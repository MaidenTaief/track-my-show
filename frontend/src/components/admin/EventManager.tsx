import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Search, ChevronDown, Plus, Calendar, MapPin } from 'lucide-react';

const EventManager = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const events = [
    {
      id: 1,
      title: "Adam Surat",
      venue: "Bangladesh Shilpakala Academy",
      date: "Thu, May 18, 7:00 PM",
      status: "Published",
      tickets: "2 Tickets",
      price: "1000 TK"
    },
    {
      id: 2,
      title: "Joy Bangla Concert",
      venue: "National Stadium",
      date: "Fri, May 19, 8:00 PM", 
      status: "Draft",
      tickets: "5 Tickets",
      price: "1500 TK"
    },
    {
      id: 3,
      title: "Tirthojatri",
      venue: "Studio Theatre Hall",
      date: "Sat, May 20, 7:30 PM",
      status: "Published", 
      tickets: "10 Tickets",
      price: "800 TK"
    }
  ];

  return (
    <AdminLayout 
      title="Events"
      rightActions={
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded flex items-center gap-2">
          <Plus size={16} />
          New Event
        </button>
      }
    >
      <div className="space-y-6">
        {/* Search and Filter */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <select className="bg-gray-700 border border-gray-600 text-white px-4 py-2 pr-8 rounded appearance-none">
                <option>All Events</option>
                <option>Published</option>
                <option>Draft</option>
                <option>Upcoming</option>
              </select>
              <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white px-4 py-2 pr-10 rounded w-64"
            />
            <Search size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 cursor-pointer">
              <div className="h-48 bg-gradient-to-br from-purple-600 to-blue-600"></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-white">{event.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    event.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {event.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin size={16} />
                    <span className="text-sm">{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar size={16} />
                    <span className="text-sm">{event.date}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-400">
                    <span className="block">{event.tickets}</span>
                    <span className="text-orange-400 font-semibold">{event.price}</span>
                  </div>
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
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default EventManager;
