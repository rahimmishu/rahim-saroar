import React, { useState, useEffect } from 'react';

// TypeScript Interface: সার্ভিসের ডেটা স্ট্রাকচার ডিফাইন করা হলো
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
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // আপনার প্রফিট মার্জিন (যেমন: 1.5 মানে আপনি কেনা দামের চেয়ে ৫০% বেশি দামে বিক্রি করবেন)
  // আপনি চাইলে এটি পরিবর্তন করতে পারেন
  const PROFIT_MARGIN = 1.5;

  useEffect(() => {
    // API থেকে ডেটা ফেচ করার ফাংশন
    const fetchServices = async () => {
      try {
        // আমাদের তৈরি করা Vercel API রাউটে রিকোয়েস্ট পাঠানো হচ্ছে
        const response = await fetch('/api/bolto-panel');
        if (!response.ok) {
          throw new Error('সার্ভার থেকে রেসপন্স পেতে সমস্যা হচ্ছে।');
        }
        const result = await response.json();
        
        // API রেসপন্স অনুযায়ী ডেটা সেভ করা
        if (result && result.data) {
          setServices(result.data);
        } else {
          setServices([]);
        }
      } catch (err: any) {
        console.error("Fetch Error:", err);
        setError('সার্ভিসগুলো লোড করতে ব্যর্থ হয়েছে। দয়া করে আপনার ইন্টারনেট কানেকশন চেক করুন।');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // ডাইনামিক ক্যাটাগরি লিস্ট তৈরি করা (যাতে ইউজাররা সহজে ফিল্টার করতে পারে)
  const categories = ['All', ...Array.from(new Set(services.map((s) => s.category)))];

  // সিলেক্ট করা ক্যাটাগরি অনুযায়ী সার্ভিস ফিল্টার করা
  const filteredServices = selectedCategory === 'All' 
    ? services 
    : services.filter((s) => s.category === selectedCategory);

  return (
    <div className="min-h-screen px-4 py-12 transition-colors duration-300 bg-gray-50 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            <span className="text-blue-600">Bolto</span> Panel
          </h1>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
            Premium Social Media Marketing Services
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="w-16 h-16 border-t-4 border-b-4 border-blue-600 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 mb-8 text-red-700 bg-red-100 border-l-4 border-red-500 rounded shadow-md" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Main Content (When Data is Loaded) */}
        {!loading && !error && services.length > 0 && (
          <div className="flex flex-col gap-8 md:flex-row">
            
            {/* Sidebar: Category Filter */}
            <div className="w-full md:w-1/4">
              <div className="sticky p-6 bg-white shadow-lg dark:bg-gray-800 rounded-xl top-24">
                <h3 className="pb-2 mb-4 text-lg font-bold text-gray-900 border-b dark:text-white">Categories</h3>
                <div className="pr-2 space-y-2 overflow-y-auto max-h-96 custom-scrollbar">
                  {categories.map((category, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium ${
                        selectedCategory === category
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Column: Services Table */}
            <div className="w-full md:w-3/4">
              <div className="overflow-hidden bg-white shadow-lg dark:bg-gray-800 rounded-xl">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">ID</th>
                        <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Service Name</th>
                        <th className="px-6 py-4 text-xs font-bold tracking-wider text-center text-gray-500 uppercase dark:text-gray-400">Rate per 1000</th>
                        <th className="px-6 py-4 text-xs font-bold tracking-wider text-center text-gray-500 uppercase dark:text-gray-400">Min / Max</th>
                        <th className="px-6 py-4 text-xs font-bold tracking-wider text-center text-gray-500 uppercase dark:text-gray-400">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                      {filteredServices.map((service) => (
                        <tr key={service.service} className="transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                            #{service.service}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                            {service.name}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-center text-blue-600 whitespace-nowrap dark:text-blue-400">
                            {/* অটোমেটিক প্রফিট যোগ করে দেখানো হচ্ছে */}
                            ৳ {(parseFloat(service.rate) * PROFIT_MARGIN).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-sm text-center text-gray-500 whitespace-nowrap dark:text-gray-400">
                            {service.min} / {service.max}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-center whitespace-nowrap">
                            <button className="px-4 py-2 text-white transition-colors duration-200 bg-blue-600 rounded-lg shadow hover:bg-blue-700">
                              Order Now
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default BoltoPanel;