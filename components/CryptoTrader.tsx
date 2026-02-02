import React, { useState, useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { X, Moon, Sun, Wifi } from 'lucide-react';
import './CryptoTrader.css';

interface CryptoTraderProps {
  onClose: () => void;
}

// Portfolio Type Definition
interface PortfolioItem {
  amount: number;
  avgPrice: number;
}

const CryptoTrader: React.FC<CryptoTraderProps> = ({ onClose }) => {
  // --- STATE MANAGEMENT ---
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [interval, setInterval] = useState('1h');
  const [currentPrice, setCurrentPrice] = useState(0);
  const [usdtBalance, setUsdtBalance] = useState(50000);
  const [portfolio, setPortfolio] = useState<Record<string, PortfolioItem>>({});
  const [tradeAmount, setTradeAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  // --- REFS ---
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null); // any টাইপ দেওয়া হয়েছে যাতে ভার্সন জনিত এরর না দেয়
  const seriesRef = useRef<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // --- CHART INITIALIZATION ---
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Chart Setup
    const chartInstance = createChart(chartContainerRef.current, {
      layout: { 
        background: { type: ColorType.Solid, color: 'transparent' }, 
        textColor: isDark ? '#cbd5e0' : '#718096' 
      },
      grid: { 
        vertLines: { color: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(163, 177, 198, 0.2)' }, 
        horzLines: { color: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(163, 177, 198, 0.2)' } 
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      rightPriceScale: { borderColor: 'transparent' },
      timeScale: { borderColor: 'transparent', timeVisible: true },
      crosshair: { mode: 1 },
    });

    // Series Setup
    // v4 এ addCandlestickSeries কাজ করবে। v5 হলে এটি ক্র্যাশ করতে পারে, তাই npm install @4.2.2 জরুরি।
    let newSeries;
    try {
        if (typeof chartInstance.addCandlestickSeries === 'function') {
            newSeries = chartInstance.addCandlestickSeries({
                upColor: '#00b894', downColor: '#d63031',
                borderUpColor: '#00b894', borderDownColor: '#d63031',
                wickUpColor: '#00b894', wickDownColor: '#d63031',
            });
        }
    } catch (e) {
        console.error("Chart Error: Please run 'npm install lightweight-charts@4.2.2'");
    }

    chartRef.current = chartInstance;
    seriesRef.current = newSeries;

    const handleResize = () => {
        if(chartContainerRef.current && chartRef.current) {
            chartRef.current.applyOptions({ 
                width: chartContainerRef.current.clientWidth,
                height: chartContainerRef.current.clientHeight 
            });
        }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.remove();
    };
  }, [isDark]);

  // --- DATA FETCHING ---
  useEffect(() => {
    loadData();
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [symbol, interval]);

  const loadData = async () => {
    setLoading(true);
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=1000`, 
        { signal: abortControllerRef.current.signal }
      );
      if (!res.ok) throw new Error("API Error");
      
      const data = await res.json();
      const candles = data.map((d: any) => ({
        time: d[0] / 1000,
        open: parseFloat(d[1]),
        high: parseFloat(d[2]),
        low: parseFloat(d[3]),
        close: parseFloat(d[4]),
      }));

      if (seriesRef.current) {
        seriesRef.current.setData(candles);
        setCurrentPrice(candles[candles.length - 1].close);
      }

      setLoading(false);
      startWebSocket();

    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error("Error loading data:", error);
      }
    }
  };

  const startWebSocket = () => {
    if (wsRef.current) wsRef.current.close();
    
    wsRef.current = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`);
    
    wsRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const k = message.k;
      const candle = {
        time: k.t / 1000,
        open: parseFloat(k.o),
        high: parseFloat(k.h),
        low: parseFloat(k.l),
        close: parseFloat(k.c),
      };

      if (seriesRef.current) seriesRef.current.update(candle);
      setCurrentPrice(candle.close);
    };
  };

  // --- TRADING LOGIC ---
  const executeTrade = (type: 'buy' | 'sell') => {
    const amountUSDT = parseFloat(tradeAmount);
    if (!amountUSDT || amountUSDT <= 0) return alert("Please enter a valid amount");

    const newPortfolio = { ...portfolio };
    if (!newPortfolio[symbol]) {
        newPortfolio[symbol] = { amount: 0, avgPrice: 0 };
    }
    const position = newPortfolio[symbol];

    if (type === 'buy') {
        if (amountUSDT > usdtBalance) return alert("Insufficient Balance!");
        
        const coinAmount = amountUSDT / currentPrice;
        const totalCost = (position.amount * position.avgPrice) + amountUSDT;
        const newTotalCoins = position.amount + coinAmount;

        setUsdtBalance(prev => prev - amountUSDT);
        position.avgPrice = totalCost / newTotalCoins;
        position.amount = newTotalCoins;

    } else if (type === 'sell') {
        const coinValue = amountUSDT / currentPrice;
        if (coinValue > position.amount) return alert("Insufficient Coin Holdings!");

        setUsdtBalance(prev => prev + amountUSDT);
        position.amount -= coinValue;
        if (position.amount <= 0.000001) position.avgPrice = 0;
    }

    setPortfolio(newPortfolio);
    setTradeAmount('');
  };

  const currentPos = portfolio[symbol] || { amount: 0, avgPrice: 0 };
  let pnl = 0;
  let pnlPercent = 0;

  if (currentPos.amount > 0) {
      const marketValue = currentPos.amount * currentPrice;
      const costBasis = currentPos.amount * currentPos.avgPrice;
      pnl = marketValue - costBasis;
      pnlPercent = ((currentPrice - currentPos.avgPrice) / currentPos.avgPrice) * 100;
  }

  return (
    <div className={`crypto-wrapper ${isDark ? 'dark' : ''} animate-in zoom-in duration-300`}>
      <div className="crypto-card">
        <button className="crypto-close-btn" onClick={onClose}><X /></button>

        <div className="crypto-controls">
            <div className="crypto-input-group">
                <select className="crypto-select" value={symbol} onChange={(e) => setSymbol(e.target.value)}>
                    <option value="BTCUSDT">BTC/USDT</option>
                    <option value="ETHUSDT">ETH/USDT</option>
                    <option value="SOLUSDT">SOL/USDT</option>
                    <option value="DOGEUSDT">DOGE/USDT</option>
                </select>
                <select className="crypto-select" value={interval} onChange={(e) => setInterval(e.target.value)}>
                    <option value="1m">1m</option>
                    <option value="15m">15m</option>
                    <option value="1h">1H</option>
                    <option value="4h">4H</option>
                </select>
                <button className="crypto-theme-toggle" onClick={() => setIsDark(!isDark)}>
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            </div>

            <div className="crypto-header-info">
                <div className="crypto-status"><Wifi size={14} style={{display:'inline'}}/> Live Market</div>
                <div className="crypto-price-display">${currentPrice.toFixed(2)}</div>
            </div>
        </div>

        <div className="crypto-chart-wrapper" ref={chartContainerRef}>
            {loading && (
                <div className="crypto-loader-overlay">
                    <div className="crypto-spinner"></div>
                </div>
            )}
        </div>

        <div className="crypto-trading-panel">
            <div className="crypto-trade-box">
                <div className="crypto-balance-info">
                    <span>Available Balance:</span>
                    <span>${usdtBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="crypto-trade-controls">
                    <input 
                        type="number" 
                        className="crypto-trade-input" 
                        placeholder="Amount (USDT)" 
                        value={tradeAmount}
                        onChange={(e) => setTradeAmount(e.target.value)}
                    />
                    <button className="crypto-btn-trade btn-buy" onClick={() => executeTrade('buy')}>Buy</button>
                    <button className="crypto-btn-trade btn-sell" onClick={() => executeTrade('sell')}>Sell</button>
                </div>
            </div>

            <div className="crypto-position-stats">
                <div className="crypto-stat-row">
                    <span>Holdings ({symbol.replace('USDT', '')}):</span>
                    <span>{currentPos.amount.toFixed(5)}</span>
                </div>
                <div className="crypto-stat-row">
                    <span>Avg. Entry Price:</span>
                    <span>{currentPos.avgPrice > 0 ? `$${currentPos.avgPrice.toFixed(2)}` : '---'}</span>
                </div>
                <div className="crypto-stat-row">
                    <span>Unrealized PnL:</span>
                    <span className={pnl >= 0 ? 'pnl-positive' : 'pnl-negative'}>
                        {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)} ({pnlPercent.toFixed(2)}%)
                    </span>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default CryptoTrader;