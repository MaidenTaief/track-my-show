import React from 'react';
import { Search, MapPin, Heart } from 'lucide-react';

const Homepage = () => {
  const featuredShows = [
    {
      id: 1,
      title: 'Phantom of the Opera',
      venue: 'Grand Theatre',
      date: 'Jul 10, 2024',
      price: '500 BDT',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 2,
      title: 'Hamilton',
      venue: 'City Hall',
      date: 'Jul 12, 2024',
      price: '750 BDT',
      image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80'
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gray-900 text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight">🎭 Track My Show</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#shows" className="hover:text-yellow-400 transition-colors">Shows</a>
            <a href="#venues" className="hover:text-yellow-400 transition-colors">Venues</a>
            <a href="#about" className="hover:text-yellow-400 transition-colors">About</a>
          </nav>
          <div>
            <a href="/admin/login" className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors">
              Admin Login
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-yellow-100 to-yellow-300 py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-gray-900 leading-tight">
            Discover & Book Amazing Shows
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-4xl mx-auto">
            The easiest way to find, book, and review live events, theatre, and entertainment in your city.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 bg-white rounded-xl p-2 shadow-lg">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search shows, venues, or artists..."
                  className="w-full px-6 py-4 rounded-lg border-0 focus:outline-none text-lg"
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
              </div>
              <button className="bg-gray-900 text-yellow-400 px-8 py-4 rounded-lg font-bold hover:bg-gray-800 transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Shows */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-gray-900 text-center">Featured Shows</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredShows.map(show => (
              <div key={show.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div className="relative">
                  <img src={show.image} alt={show.title} className="w-full h-48 object-cover" />
                  <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                    <Heart size={20} className="text-gray-600" />
                  </button>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{show.title}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={16} className="text-gray-500" />
                    <span className="text-gray-600">{show.venue}</span>
                  </div>
                  <p className="text-gray-500 text-sm mb-4">{show.date}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-yellow-600">{show.price}</span>
                    <button className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
