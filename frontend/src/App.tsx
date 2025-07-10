import React from 'react';

function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow">
      <div className="flex items-center gap-2">
        <span className="font-bold text-xl tracking-tight">🎭 Track My Show</span>
      </div>
      <div className="flex gap-4">
        <a href="#shows" className="hover:text-yellow-400 transition">Shows</a>
        <a href="#venues" className="hover:text-yellow-400 transition">Venues</a>
        <a href="#about" className="hover:text-yellow-400 transition">About</a>
      </div>
      <div>
        <button className="bg-yellow-400 text-gray-900 px-4 py-2 rounded font-semibold hover:bg-yellow-300 transition">Login</button>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="bg-gradient-to-br from-yellow-100 to-yellow-300 py-16 px-6 text-center">
      <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-gray-900">Discover & Book Amazing Shows</h1>
      <p className="text-lg md:text-2xl text-gray-700 mb-8">The easiest way to find, book, and review live events, theatre, and entertainment in your city.</p>
      <form className="max-w-xl mx-auto flex flex-col md:flex-row gap-4">
        <input type="text" placeholder="Search shows, venues, or artists..." className="flex-1 px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
        <button type="submit" className="bg-gray-900 text-yellow-400 px-6 py-3 rounded font-bold hover:bg-gray-800 transition">Search</button>
      </form>
    </section>
  );
}

function FeaturedShows() {
  // Placeholder data
  const shows = [
    { id: 1, title: 'Phantom of the Opera', venue: 'Grand Theatre', date: '2024-07-10', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' },
    { id: 2, title: 'Hamilton', venue: 'City Hall', date: '2024-07-12', image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80' },
    { id: 3, title: 'Les Misérables', venue: 'Opera House', date: '2024-07-15', image: 'https://images.unsplash.com/photo-1515168833906-d2a3b82b3029?auto=format&fit=crop&w=400&q=80' },
    { id: 4, title: 'Comedy Night', venue: 'Laugh Club', date: '2024-07-18', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80' },
  ];
  return (
    <section className="py-12 px-6 bg-white" id="shows">
      <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">Featured Shows</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {shows.map(show => (
          <div key={show.id} className="bg-gray-100 rounded-lg shadow hover:shadow-lg transition overflow-hidden">
            <img src={show.image} alt={show.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{show.title}</h3>
              <p className="text-gray-600 mb-1">{show.venue}</p>
              <p className="text-gray-500 text-sm mb-3">{show.date}</p>
              <button className="bg-yellow-400 text-gray-900 px-4 py-2 rounded font-semibold w-full hover:bg-yellow-300 transition">Book Now</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Venues() {
  // Placeholder data
  const venues = [
    { id: 1, name: 'Grand Theatre', city: 'Dhaka', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80' },
    { id: 2, name: 'City Hall', city: 'Chittagong', image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=400&q=80' },
    { id: 3, name: 'Opera House', city: 'Khulna', image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=crop&w=400&q=80' },
    { id: 4, name: 'Laugh Club', city: 'Sylhet', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80' },
  ];
  return (
    <section className="py-12 px-6 bg-gray-50" id="venues">
      <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">Popular Venues</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {venues.map(venue => (
          <div key={venue.id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
            <img src={venue.image} alt={venue.name} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{venue.name}</h3>
              <p className="text-gray-600">{venue.city}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="py-16 px-6 bg-white text-center" id="about">
      <h2 className="text-3xl font-bold mb-4 text-gray-900">About Track My Show</h2>
      <p className="text-lg text-gray-700 max-w-2xl mx-auto">
        Track My Show is your one-stop platform to discover, book, and review live events and theatre shows across Bangladesh. We connect audiences with unforgettable experiences, simplify ticketing, and empower organizers to reach new fans. Whether you love drama, comedy, music, or dance, Track My Show brings the stage to you.
      </p>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 px-6 text-center mt-12">
      <div className="mb-2">&copy; {new Date().getFullYear()} Track My Show. All rights reserved.</div>
      <div className="text-sm text-gray-400">Made with <span className="text-yellow-400">♥</span> for theatre lovers.</div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <Hero />
      <FeaturedShows />
      <Venues />
      <About />
      <Footer />
    </div>
  );
} 