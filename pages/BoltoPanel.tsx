import React, { useState, useEffect } from 'react';
import { Facebook, Youtube, Instagram, Twitter, MessageCircle, PlaySquare, TrendingUp, Search } from 'lucide-react';

interface SmmService {
  service: string;
  name: string;
  category: string;
  rate: string;
  min: string;
  max: string;
  type: string;
}

const BoltoPanel: React.FC = () => {
  const [services, setServices] = useState<SmmService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const PROFIT_MARGIN = 1.5;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/bolto-panel');
        if (!response.ok) throw new Error('সার্ভার থেকে রেসপন্স পেতে সমস্যা হচ্ছে।');
        const result = await response.json();
        if (result && result.data) setServices(result.data);
      } catch (err: any) {
        setError('সার্ভিসগুলো লোড করতে ব্যর্থ হয়েছে। ইন্টারনেট কানেকশন চেক করুন।');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Platform Detection Logic (SAFollow style visual categories)
  const platforms = [
    { name: 'All', icon: <TrendingUp size={24} />, color: 'bg-gradient-to-r from-blue-500 to-purple-600' },
    { name: 'Facebook', icon: <Facebook size={24} />, color: 'bg-blue-600' },
    { name: 'Youtube', icon: <Youtube size={24} />, color: 'bg-red-600' },
    { name: 'Instagram', icon: <Instagram size={24} />, color: 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600' },
    { name: 'Tiktok', icon: <PlaySquare size={24} />, color: 'bg-black dark:bg-gray-800' },
    { name: 'Twitter', icon: <Twitter size={24} />, color: 'bg-sky-500' },
    { name: 'Telegram', icon: <MessageCircle size={24} />, color: 'bg-blue-400' },
  ];

  // Filter Logic based on selected platform and search query
  const filteredServices = services.filter((s) => {
    const matchesPlatform = selectedPlatform === 'All' || s.category.toLowerCase().includes(selectedPlatform.toLowerCase());
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0f1014] text-white font-sans selection:bg-blue-500 selection:text-white pb-20">
      
      {/* 1. Netflix Style Hero Banner */}
      <div className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2000&auto=format&fit=crop" 
            alt="Social Media Banner" 
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1014] via-[#0f1014]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f1014] via-[#0f1014]/50 to-transparent"></div>
        </div>

        {/* Banner Content */}
        <div className="relative z-10 max-w-4xl px-4 mx-auto mt-20 text-center">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-blue-400 uppercase border rounded-full bg-blue-500/10 border-blue-500/30">
            🔥 Special Offer
          </span>
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight md:text-7xl">
            Boost Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Digital</span> Presence.
          </h1>
          <p className="max-w-2xl mx-auto mb-8 text-lg text-gray-300 md:text-xl">
            Get premium, high-quality social media marketing services instantly. Trusted by thousands of creators and brands.
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-8 py-3.5 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
              <TrendingUp size={20} /> Start Boosting
            </button>
            <button className="px-8 py-3.5 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/10">
              View Services
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-20 px-4 mx-auto -mt-10 max-w-7xl sm:px-6 lg:px-8">
        
        {/* 2. SAFollow Style Visual Category Cards */}
        <div className="mb-12">
          <h2 className="flex items-center gap-2 mb-6 text-xl font-bold">
            Explore Platforms
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
            {platforms.map((platform) => (
              <button
                key={platform.name}
                onClick={() => setSelectedPlatform(platform.name)}
                className={`relative group overflow-hidden rounded-xl p-4 flex flex-col items-center justify-center gap-3 transition-all duration-300 ${
                  selectedPlatform === platform.name 
                    ? 'ring-2 ring-white scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                    : 'bg-[#1a1c23] hover:bg-[#252830] hover:scale-105'
                }`}
              >
                <div className={`p-3 rounded-full ${platform.color} text-white shadow-lg`}>
                  {platform.icon}
                </div>
                <span className="text-sm font-semibold">{platform.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Search Bar */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for a specific service (e.g., Facebook Page Like)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1a1c23] border border-gray-800 text-white rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          </div>
        )}

        {/* 4. Netflix Style Data Table */}
        {!loading && !error && (
          <div className="bg-[#1a1c23] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-[#121318]">
                  <tr>
                    <th className="px-6 py-5 text-xs font-bold tracking-wider text-left text-gray-400 uppercase">ID</th>
                    <th className="px-6 py-5 text-xs font-bold tracking-wider text-left text-gray-400 uppercase">Service Description</th>
                    <th className="px-6 py-5 text-xs font-bold tracking-wider text-center text-gray-400 uppercase">Rate per 1000</th>
                    <th className="px-6 py-5 text-xs font-bold tracking-wider text-center text-gray-400 uppercase">Min / Max</th>
                    <th className="px-6 py-5 text-xs font-bold tracking-wider text-center text-gray-400 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {filteredServices.slice(0, 50).map((service) => ( // Showing first 50 for performance, you can add pagination later
                    <tr key={service.service} className="hover:bg-[#252830] transition-colors duration-200 group">
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        #{service.service}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-200">
                        <div className="leading-relaxed line-clamp-2">{service.name}</div>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <span className="px-3 py-1 font-bold text-blue-400 border rounded-lg bg-blue-500/10 border-blue-500/20">
                          ৳ {(parseFloat(service.rate) * PROFIT_MARGIN).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-center text-gray-400 whitespace-nowrap">
                        {service.min} - {service.max}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <button className="px-6 py-2 text-sm font-bold text-black transition-all transform bg-white rounded-lg hover:bg-gray-200 active:scale-95">
                          Order
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredServices.length === 0 && (
                <div className="py-12 text-center text-gray-400">
                  No services found for this category or search.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoltoPanel;