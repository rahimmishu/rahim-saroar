import React, { useState, useEffect } from 'react';
import { Facebook, Youtube, Instagram, Twitter, MessageCircle, PlaySquare, TrendingUp, Search, Wallet, X, PlusCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; 
import AppNavbar from '../components/layout/AppNavbar'; 
import toast from 'react-hot-toast';

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
  // Auth & Theme States
  const { user } = useAuth(); 
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  
  // Panel States
  const [services, setServices] = useState<SmmService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [balance, setBalance] = useState<number>(0);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Banner Slider State
  const [currentBanner, setCurrentBanner] = useState(0);

  // Modals State
  const [selectedService, setSelectedService] = useState<SmmService | null>(null);
  const [orderLink, setOrderLink] = useState('');
  const [orderQuantity, setOrderQuantity] = useState('');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');

  const PROFIT_MARGIN = 1.5;

  // 1. Auto-sliding Banners Logic
  const banners = [
    "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2000&auto=format&fit=crop"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000); 
    return () => clearInterval(timer);
  }, [banners.length]);

  // Theme Toggle Logic
  const handleThemeToggle = () => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  // 2. Fetch Services & Balance
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Services
        const resServices = await fetch('/api/bolto-panel');
        const dataServices = await resServices.json();
        if (dataServices.data) setServices(dataServices.data);

        // Fetch Balance
        if (user) {
          const resBalance = await fetch(`/api/balance?uid=${user.uid}`);
          const dataBalance = await resBalance.json();
          if (dataBalance.balance !== undefined) setBalance(dataBalance.balance);
        }
      } catch (error) {
        toast.error('Failed to load data!');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // 3. Handle Deposit (Add Funds)
  const handleDeposit = async () => {
    if (!user) return toast.error('Please login first!');
    if (!depositAmount || parseFloat(depositAmount) <= 0) return toast.error('Enter a valid amount');
    
    const loadingToast = toast.loading('Adding funds...');
    try {
      const response = await fetch('/api/balance', {
        method: 'POST',
        body: JSON.stringify({ uid: user.uid, action: 'add', amount: depositAmount })
      });
      const data = await response.json();
      setBalance(data.balance);
      setShowDepositModal(false);
      setDepositAmount('');
      toast.success(`৳${depositAmount} added successfully!`, { id: loadingToast });
    } catch (err) {
      toast.error('Failed to add funds', { id: loadingToast });
    }
  };

  // 4. Handle Order (Deduct Balance)
  const handleOrderSubmit = async () => {
    if (!user) return toast.error('Please login to place an order!');
    const price = (parseFloat(orderQuantity) / 1000) * (parseFloat(selectedService!.rate) * PROFIT_MARGIN);
    
    if (balance < price) return toast.error('Insufficient Balance! Please deposit.');

    const loadingToast = toast.loading('Processing Order...');
    try {
      // Deduct Balance
      const res = await fetch('/api/balance', {
        method: 'POST',
        body: JSON.stringify({ uid: user.uid, action: 'deduct', amount: price })
      });
      if (!res.ok) throw new Error('Balance deduction failed');
      
      const data = await res.json();
      setBalance(data.balance);
      
      // TODO: Add SMM Panel API Order Request here later
      
      setSelectedService(null);
      setOrderLink('');
      setOrderQuantity('');
      toast.success('Order Placed Successfully! 🎉', { id: loadingToast });
    } catch (err) {
      toast.error('Order Failed!', { id: loadingToast });
    }
  };

  const platforms = [
    { name: 'All', icon: <TrendingUp size={24} />, color: 'bg-gradient-to-r from-blue-500 to-purple-600' },
    { name: 'Facebook', icon: <Facebook size={24} />, color: 'bg-blue-600' },
    { name: 'Youtube', icon: <Youtube size={24} />, color: 'bg-red-600' },
    { name: 'Instagram', icon: <Instagram size={24} />, color: 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600' },
    { name: 'Tiktok', icon: <PlaySquare size={24} />, color: 'bg-black dark:bg-gray-800' },
    { name: 'Twitter', icon: <Twitter size={24} />, color: 'bg-sky-500' },
    { name: 'Telegram', icon: <MessageCircle size={24} />, color: 'bg-blue-400' },
  ];

  // Robust Search Logic
  const filteredServices = services.filter((s) => {
    const categoryMatch = selectedPlatform === 'All' || s.category?.toLowerCase().includes(selectedPlatform.toLowerCase());
    const searchMatch = !searchQuery || 
                        s.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        s.service?.toString().includes(searchQuery);
    return categoryMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1014] text-gray-900 dark:text-white font-sans transition-colors duration-300 pb-20">
      
      {/* --- Dynamic AppNavbar --- */}
      <AppNavbar isDarkMode={isDarkMode} toggleTheme={handleThemeToggle} />

      {/* --- Preloader --- */}
      {loading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="loader"><svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="32" stroke="white" strokeWidth="6" fill="none" strokeDasharray="150 50 150 50" className="animate-spin-slow"></circle></svg></div>
        </div>
      )}

      {/* --- Auto-sliding Hero Banner --- */}
      <div className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        {banners.map((img, index) => (
          <img 
            key={index}
            src={img} 
            alt={`Banner ${index}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentBanner ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-[#0f1014] via-gray-900/60 to-transparent"></div>
        
        <div className="relative z-10 max-w-4xl px-4 mx-auto text-center">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-blue-400 uppercase border rounded-full shadow-lg bg-white/10 backdrop-blur-md border-blue-400/30">
            🚀 Flash Sale Active
          </span>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white md:text-6xl drop-shadow-xl">
            Dominate <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Social Media</span>
          </h1>
          <p className="max-w-2xl mx-auto mb-8 text-lg text-gray-200 drop-shadow-md">
            The #1 Reseller Panel in BD. Get likes, followers, and views instantly.
          </p>
          
          <div className="flex justify-center gap-2 mt-8">
            {banners.map((_, idx) => (
              <div key={idx} className={`h-2 rounded-full transition-all ${idx === currentBanner ? 'w-8 bg-blue-500' : 'w-2 bg-white/50'}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-20 px-4 mx-auto -mt-8 max-w-7xl sm:px-6 lg:px-8">
        
        {/* --- User Dashboard Summary (Balance & Deposit) --- */}
        {user && (
          <div className="p-6 mb-8 border shadow-2xl bg-gradient-to-br from-blue-900 to-purple-900 rounded-3xl border-white/10">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div>
                <h2 className="text-2xl font-bold text-white">Welcome, {user.displayName}</h2>
                <p className="text-blue-200">Ready to boost your social presence?</p>
              </div>
              <div className="flex items-center gap-6 p-4 bg-black/40 rounded-2xl backdrop-blur-sm">
                <div>
                  <p className="text-sm font-semibold text-gray-400 uppercase">Current Balance</p>
                  <p className="text-3xl font-extrabold text-white">৳ {balance.toFixed(2)}</p>
                </div>
                <button 
                  onClick={() => setShowDepositModal(true)}
                  className="flex items-center gap-2 px-6 py-3 font-bold text-black transition-transform bg-white rounded-xl hover:scale-105 active:scale-95"
                >
                  <PlusCircle size={20} /> Add Funds
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- Visual Categories --- */}
        <div className="mb-10">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
            {platforms.map((platform) => (
              <button
                key={platform.name}
                onClick={() => setSelectedPlatform(platform.name)}
                className={`relative group overflow-hidden rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all duration-300 border ${
                  selectedPlatform === platform.name 
                    ? 'border-blue-500 bg-white dark:bg-[#1a1c23] shadow-lg scale-105' 
                    : 'border-transparent bg-white dark:bg-[#1a1c23] shadow hover:shadow-md hover:scale-105'
                }`}
              >
                <div className={`p-3 rounded-full ${platform.color} text-white shadow-md`}>
                  {platform.icon}
                </div>
                <span className="text-sm font-bold">{platform.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* --- Fixed Search Bar --- */}
        <div className="relative mb-8 shadow-sm">
          <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by ID or Service Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-[#1a1c23] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-2xl py-4 pl-14 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all text-lg"
          />
        </div>

        {/* --- Data Table --- */}
        <div className="bg-white dark:bg-[#1a1c23] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
              <thead className="bg-gray-50 dark:bg-[#121318]">
                <tr>
                  <th className="px-6 py-5 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400">ID</th>
                  <th className="px-6 py-5 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400">Service Name</th>
                  <th className="px-6 py-5 text-xs font-bold text-center text-gray-500 uppercase dark:text-gray-400">Rate per 1k</th>
                  <th className="px-6 py-5 text-xs font-bold text-center text-gray-500 uppercase dark:text-gray-400">Min/Max</th>
                  <th className="px-6 py-5 text-xs font-bold text-center text-gray-500 uppercase dark:text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                {filteredServices.slice(0, 100).map((service) => (
                  <tr key={service.service} className="hover:bg-blue-50 dark:hover:bg-[#252830] transition-colors group">
                    <td className="px-6 py-4 text-sm font-bold text-gray-500">#{service.service}</td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="line-clamp-2">{service.name}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 font-bold text-blue-700 bg-blue-100 border border-blue-200 rounded-lg dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20">
                        ৳ {(parseFloat(service.rate) * PROFIT_MARGIN).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-400">
                      {service.min} - {service.max}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => setSelectedService(service)}
                        className="px-6 py-2 text-sm font-bold text-white transition-transform bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 active:scale-95"
                      >
                        Order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && filteredServices.length === 0 && (
              <div className="py-12 text-lg text-center text-gray-500">No services found. Try another search!</div>
            )}
          </div>
        </div>
      </div>

      {/* --- Deposit Modal --- */}
      {showDepositModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in zoom-in-95 duration-200">
          <div className="bg-white dark:bg-[#1a1c23] w-full max-w-sm rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-2xl">
            <h3 className="mb-4 text-2xl font-bold dark:text-white">Add Funds</h3>
            <input 
              type="number" 
              placeholder="Enter Amount (৳)" 
              value={depositAmount} 
              onChange={(e) => setDepositAmount(e.target.value)} 
              className="w-full p-4 mb-4 text-lg font-bold bg-gray-50 border border-gray-300 rounded-xl dark:bg-[#121318] dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" 
            />
            <div className="flex gap-3">
              <button onClick={() => setShowDepositModal(false)} className="flex-1 py-3 font-bold text-gray-600 bg-gray-200 rounded-xl dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700">Cancel</button>
              <button onClick={handleDeposit} className="flex-1 py-3 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700">Pay Now</button>
            </div>
          </div>
        </div>
      )}

      {/* --- Order Popup Modal --- */}
      {selectedService && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1a1c23] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#121318]">
              <h3 className="text-lg font-bold">Place New Order</h3>
              <button onClick={() => setSelectedService(null)} className="p-1 transition rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <div className="p-3 text-sm font-medium text-blue-800 border border-blue-100 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-300 rounded-xl dark:border-blue-800/30">
                {selectedService.name}
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-bold">Target Link</label>
                <input 
                  type="url" 
                  placeholder="https://facebook.com/your-page" 
                  value={orderLink}
                  onChange={(e) => setOrderLink(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#121318] border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-bold">Quantity</label>
                <input 
                  type="number" 
                  placeholder={`Min: ${selectedService.min} - Max: ${selectedService.max}`} 
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#121318] border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>

              {/* Price Calculator */}
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-[#121318] rounded-xl border border-gray-200 dark:border-gray-700">
                <span className="font-bold text-gray-500">Total Price:</span>
                <span className="text-xl font-extrabold text-blue-600">
                  ৳ {orderQuantity ? ((parseFloat(orderQuantity) / 1000) * (parseFloat(selectedService.rate) * PROFIT_MARGIN)).toFixed(2) : '0.00'}
                </span>
              </div>

              <button 
                onClick={handleOrderSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-transform active:scale-95"
              >
                Submit Order
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BoltoPanel;