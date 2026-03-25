import React, { useState, useEffect } from 'react';
import { Facebook, Youtube, Instagram, Twitter, MessageCircle, PlaySquare, TrendingUp, Search, Wallet, X, PlusCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; 
import AppNavbar from '../components/layout/AppNavbar'; // আপনার মেইন ন্যাভবার
import toast from 'react-hot-toast';

interface SmmService { service: string; name: string; category: string; rate: string; min: string; max: string; }

const BoltoPanel: React.FC = () => {
  const { user } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  
  const [services, setServices] = useState<SmmService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [balance, setBalance] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  
  // Modals
  const [selectedService, setSelectedService] = useState<SmmService | null>(null);
  const [orderLink, setOrderLink] = useState('');
  const [orderQuantity, setOrderQuantity] = useState('');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');

  const PROFIT_MARGIN = 1.5;

  // 1. Fetch Services & Balance
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Services
        const resServices = await fetch('/api/bolto-panel');
        const dataServices = await resServices.json();
        if (dataServices.data) setServices(dataServices.data);

        // Fetch Balance from Upstash
        if (user) {
          const resBalance = await fetch(`/api/balance?uid=${user.uid}`);
          const dataBalance = await resBalance.json();
          if (dataBalance.balance !== undefined) setBalance(dataBalance.balance);
        }
      } catch (error) {
        toast.error('Failed to load data!');
      } finally {
        setLoading(false); // প্রি-লোডার বন্ধ হবে
      }
    };
    fetchData();
  }, [user]);

  // 2. Handle Deposit (Add Funds)
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

  // 3. Handle Order (Deduct Balance)
  const handleOrderSubmit = async () => {
    if (!user) return toast.error('Please login to place an order!');
    const price = (parseFloat(orderQuantity) / 1000) * (parseFloat(selectedService!.rate) * PROFIT_MARGIN);
    
    if (balance < price) return toast.error('Insufficient Balance! Please deposit.');

    const loadingToast = toast.loading('Processing Order...');
    try {
      // 1. Deduct Balance from Upstash
      const res = await fetch('/api/balance', {
        method: 'POST',
        body: JSON.stringify({ uid: user.uid, action: 'deduct', amount: price })
      });
      if (!res.ok) throw new Error('Balance deduction failed');
      
      const data = await res.json();
      setBalance(data.balance);
      
      // 2. (Here you will add SAFollow API order request later)
      
      setSelectedService(null);
      toast.success('Order Placed Successfully! 🎉', { id: loadingToast });
    } catch (err) {
      toast.error('Order Failed!', { id: loadingToast });
    }
  };

  const platforms = [
    { name: 'All', icon: <TrendingUp size={24} />, color: 'bg-blue-600' },
    { name: 'Facebook', icon: <Facebook size={24} />, color: 'bg-blue-500' },
    { name: 'Youtube', icon: <Youtube size={24} />, color: 'bg-red-600' },
    { name: 'Instagram', icon: <Instagram size={24} />, color: 'bg-pink-600' },
  ];

  const filteredServices = services.filter(s => 
    (selectedPlatform === 'All' || s.category?.toLowerCase().includes(selectedPlatform.toLowerCase())) &&
    (!searchQuery || s.name?.toLowerCase().includes(searchQuery.toLowerCase()) || s.service?.includes(searchQuery))
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#000000] transition-colors duration-300">
      
      {/* 1. ডাইনামিক AppNavbar ইন্টিগ্রেশন */}
      <AppNavbar isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} />

      {/* 2. অরিজিনাল Preloader (আপনার CSS থেকে নেওয়া) */}
      {loading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black backdrop-blur-md">
          <div className="loader"><svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="32" stroke="white" strokeWidth="6" fill="none" strokeDasharray="150 50 150 50" className="animate-spin-slow"></circle></svg></div>
          <div className="loader triangle"><svg viewBox="0 0 86 80"><polygon points="43 8 79 72 7 72" stroke="#f40af0" strokeWidth="6" fill="none"></polygon></svg></div>
        </div>
      )}

      {/* Main Content */}
      <div className="px-4 pt-32 pb-20 mx-auto max-w-7xl sm:px-6 lg:px-8" id="services">
        
        {/* User Dashboard Summary */}
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

        {/* Categories & Search */}
        <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {platforms.map(p => (
              <button key={p.name} onClick={() => setSelectedPlatform(p.name)} className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-all whitespace-nowrap ${selectedPlatform === p.name ? `${p.color} text-white shadow-lg` : 'bg-white dark:bg-[#111] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800'}`}>
                {p.icon} {p.name}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute text-gray-400 left-4 top-4" size={20} />
            <input type="text" placeholder="Search ID or Name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full py-4 pl-12 pr-4 bg-white border border-gray-200 shadow-sm dark:bg-[#111] dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none dark:text-white" />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-hidden bg-white border border-gray-200 shadow-xl dark:bg-[#111] dark:border-gray-800 rounded-3xl">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
              <thead className="bg-gray-50 dark:bg-[#0a0a0a]">
                <tr>
                  <th className="px-6 py-5 text-xs font-bold text-left text-gray-500 uppercase">ID & Service</th>
                  <th className="px-6 py-5 text-xs font-bold text-center text-gray-500 uppercase">Rate per 1k</th>
                  <th className="px-6 py-5 text-xs font-bold text-center text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                {filteredServices.slice(0, 50).map((service) => (
                  <tr key={service.service} className="transition-colors hover:bg-gray-50 dark:hover:bg-white/5 group">
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-blue-500">#{service.service}</div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-200 line-clamp-2">{service.name}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 font-bold text-purple-700 bg-purple-100 rounded-lg dark:bg-purple-500/10 dark:text-purple-400">
                        ৳ {(parseFloat(service.rate) * PROFIT_MARGIN).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => setSelectedService(service)} className="px-6 py-2 text-sm font-bold text-white transition-all bg-blue-600 shadow-lg rounded-xl hover:bg-blue-700 active:scale-95 shadow-blue-500/20">
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

      {/* --- Deposit Modal --- */}
      {showDepositModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#111] w-full max-w-sm rounded-3xl p-6 border border-white/10">
            <h3 className="mb-4 text-2xl font-bold dark:text-white">Add Funds</h3>
            <input type="number" placeholder="Enter Amount (৳)" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} className="w-full p-4 mb-4 text-lg font-bold bg-gray-100 rounded-xl dark:bg-[#222] dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
            <div className="flex gap-3">
              <button onClick={() => setShowDepositModal(false)} className="flex-1 py-3 font-bold text-gray-600 bg-gray-200 rounded-xl dark:bg-gray-800 dark:text-gray-300">Cancel</button>
              <button onClick={handleDeposit} className="flex-1 py-3 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700">Pay Now</button>
            </div>
          </div>
        </div>
      )}

      {/* --- Order Modal --- */}
      {selectedService && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#111] w-full max-w-md rounded-3xl overflow-hidden border border-white/10">
            <div className="flex items-center justify-between p-5 bg-gray-50 dark:bg-[#0a0a0a] border-b dark:border-white/5">
              <h3 className="text-lg font-bold dark:text-white">Place Order</h3>
              <button onClick={() => setSelectedService(null)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 dark:text-white"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="p-3 text-sm font-medium text-blue-800 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-300 rounded-xl">{selectedService.name}</div>
              <input type="url" placeholder="Target Link" value={orderLink} onChange={(e) => setOrderLink(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-[#222] dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border dark:border-white/5" />
              <input type="number" placeholder={`Quantity (Min: ${selectedService.min})`} value={orderQuantity} onChange={(e) => setOrderQuantity(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-[#222] dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border dark:border-white/5" />
              
              <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-500/10 rounded-xl">
                <span className="font-bold text-purple-900 dark:text-purple-300">Total Price:</span>
                <span className="text-2xl font-black text-purple-600">৳ {orderQuantity ? ((parseFloat(orderQuantity) / 1000) * (parseFloat(selectedService.rate) * PROFIT_MARGIN)).toFixed(2) : '0.00'}</span>
              </div>
              <button onClick={handleOrderSubmit} className="w-full py-4 font-bold text-white transition-transform shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl active:scale-95 shadow-blue-500/30">
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoltoPanel;