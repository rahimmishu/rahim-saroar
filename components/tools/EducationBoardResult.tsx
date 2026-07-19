import React, { useState } from 'react';
import { Search, AlertCircle } from 'lucide-react';

interface ResultData {
  name?: string;
  fatherName?: string;
  motherName?: string;
  board?: string;
  group?: string;
  result?: string; 
  institute?: string;
  subjectGrades?: { code: string; subject: string; grade: string }[];
  error?: string;
}

export default function EducationBoardResult() {
  const [exam, setExam] = useState('');
  const [year, setYear] = useState('');
  const [board, setBoard] = useState('');
  const [roll, setRoll] = useState('');
  const [reg, setReg] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resultData, setResultData] = useState<ResultData | null>(null);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setResultData(null);

    try {
      // অরিজিনাল API URL
      const targetUrl = `https://api.bangladesh.gov.org/?exam=${exam}&year=${year}&board=${board}&roll=${roll}&reg=${reg}`;
      
      // corsproxy.io এর বদলে allorigins.win প্রক্সি ব্যবহার করা হলো
      const apiUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      if (data.error) {
        setErrorMsg(data.error);
      } else {
        setResultData(data);
      }
    } catch (error) {
      console.error("Error fetching result:", error);
      setErrorMsg('সার্ভারে কানেক্ট করা যাচ্ছে না। API টি ডাউন থাকতে পারে অথবা বোর্ড সার্ভার ব্যস্ত আছে।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full tools-root">
      <div 
        className="relative bg-neutral-950 p-8 md:p-10 rounded-[40px] w-full max-w-[750px] shadow-2xl"
        style={{ border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 32px 80px rgba(0,0,0,0.7)' }}
      >
        {/* Top Highlight Line */}
        <div className="absolute top-0 h-px left-8 right-8 card-top-line" />

        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-black tracking-widest text-white md:text-3xl tools-mono">BOARD RESULT</h2>
          <p className="text-[11px] font-bold text-white/40 tracking-[0.2em] mt-3 uppercase">
            Education Board Bangladesh
          </p>
        </div>

        {/* --- Form Section --- */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-[0.15em] text-white/50 tools-mono ml-1">EXAMINATION</label>
            <select required value={exam} onChange={(e) => setExam(e.target.value)} 
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 text-sm text-white/90 outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all cursor-pointer">
              <option value="" className="text-white bg-neutral-900">Select Exam</option>
              <option value="jsc" className="text-white bg-neutral-900">JSC/JDC</option>
              <option value="ssc" className="text-white bg-neutral-900">SSC/Dakhil/Equivalent</option>
              <option value="hsc" className="text-white bg-neutral-900">HSC/Alim/Equivalent</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-[0.15em] text-white/50 tools-mono ml-1">YEAR</label>
            <select required value={year} onChange={(e) => setYear(e.target.value)} 
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 text-sm text-white/90 outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all cursor-pointer">
              <option value="" className="text-white bg-neutral-900">Select Year</option>
              <option value="2026" className="text-white bg-neutral-900">2026</option>
              <option value="2025" className="text-white bg-neutral-900">2025</option>
              <option value="2024" className="text-white bg-neutral-900">2024</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-[0.15em] text-white/50 tools-mono ml-1">BOARD</label>
            <select required value={board} onChange={(e) => setBoard(e.target.value)} 
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 text-sm text-white/90 outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all cursor-pointer">
              <option value="" className="text-white bg-neutral-900">Select Board</option>
              <option value="dhaka" className="text-white bg-neutral-900">Dhaka</option>
              <option value="rajshahi" className="text-white bg-neutral-900">Rajshahi</option>
              <option value="comilla" className="text-white bg-neutral-900">Comilla</option>
              <option value="jessore" className="text-white bg-neutral-900">Jessore</option>
              <option value="chittagong" className="text-white bg-neutral-900">Chittagong</option>
              <option value="dinajpur" className="text-white bg-neutral-900">Dinajpur</option>
              <option value="madrasah" className="text-white bg-neutral-900">Madrasah</option>
              <option value="technical" className="text-white bg-neutral-900">Technical</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-[0.15em] text-white/50 tools-mono ml-1">ROLL</label>
              <input required type="number" placeholder="Roll No" value={roll} onChange={(e) => setRoll(e.target.value)} 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 text-sm text-white/90 outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all placeholder:text-white/20" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-[0.15em] text-white/50 tools-mono ml-1">REG (Opt)</label>
              <input type="number" placeholder="Reg No" value={reg} onChange={(e) => setReg(e.target.value)} 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 text-sm text-white/90 outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all placeholder:text-white/20" />
            </div>
          </div>

          <div className="flex justify-center col-span-1 mt-6 md:col-span-2">
            <button 
              type="submit" 
              disabled={loading} 
              className="relative group flex items-center justify-center gap-3 w-full md:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold tracking-widest uppercase overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 rounded-full border-white/20 border-t-white animate-spin"></span> SEARCHING...</span>
              ) : (
                <span className="flex items-center gap-2"><Search size={16} /> CHECK RESULT</span>
              )}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {errorMsg && (
          <div className="flex items-center gap-3 p-4 mt-6 text-sm text-red-400 border rounded-xl bg-red-500/10 border-red-500/20">
            <AlertCircle size={18} className="shrink-0" />
            <p>{errorMsg}</p>
          </div>
        )}

        {/* --- Result Display Section --- */}
        {resultData && (
          <div className="mt-8 overflow-hidden border border-white/10 rounded-3xl bg-white/5 backdrop-blur-md">
            <div className="p-4 text-center border-b bg-white/5 border-white/10 text-white/80 tools-mono text-xs tracking-[0.1em]">
              RESULT OF {exam.toUpperCase()} EXAMINATION - {year}
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                <div className="flex justify-between pb-3 border-b border-white/5"><span className="text-white/50">Name</span> <span className="font-bold text-white">{resultData.name || 'N/A'}</span></div>
                <div className="flex justify-between pb-3 border-b border-white/5"><span className="text-white/50">GPA</span> <span className="font-black text-emerald-400">{resultData.result || 'N/A'}</span></div>
                <div className="flex justify-between pb-3 border-b border-white/5"><span className="text-white/50">Father</span> <span className="font-medium text-white/90">{resultData.fatherName || 'N/A'}</span></div>
                <div className="flex justify-between pb-3 border-b border-white/5"><span className="text-white/50">Mother</span> <span className="font-medium text-white/90">{resultData.motherName || 'N/A'}</span></div>
                <div className="flex justify-between pb-3 border-b border-white/5"><span className="text-white/50">Board</span> <span className="font-medium uppercase text-white/90">{board}</span></div>
                <div className="flex justify-between pb-3 border-b border-white/5"><span className="text-white/50">Institute</span> <span className="font-medium text-white/90">{resultData.institute || 'N/A'}</span></div>
              </div>
            </div>

            {/* Subject Grades */}
            {resultData.subjectGrades && resultData.subjectGrades.length > 0 && (
              <div className="px-6 pb-6 overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] text-white/40 uppercase tracking-wider tools-mono border-b border-white/10">
                    <tr>
                      <th className="py-3 font-medium">Code</th>
                      <th className="py-3 font-medium">Subject</th>
                      <th className="py-3 font-medium text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultData.subjectGrades.map((sub, index) => (
                      <tr key={index} className="transition-colors border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 text-white/60">{sub.code}</td>
                        <td className="py-3 text-white/90">{sub.subject}</td>
                        <td className="py-3 font-bold text-center text-indigo-400">{sub.grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}