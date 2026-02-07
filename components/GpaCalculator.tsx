import React, { useState } from 'react';
import { Calculator, Plus, Trash2, RefreshCcw, GraduationCap, Save, FileSpreadsheet } from 'lucide-react';

interface Course {
  id: number;
  name: string;
  marks: string; // Grade এর বদলে এখন Marks নেওয়া হবে
  credit: string;
}

const GpaCalculator: React.FC = () => {
  // State for dynamic course list
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, name: '', marks: '', credit: '1' },
    { id: 2, name: '', marks: '', credit: '1' },
    { id: 3, name: '', marks: '', credit: '1' },
  ]);
  
  const [result, setResult] = useState<number | null>(null);
  const [totalCredits, setTotalCredits] = useState<number>(0);
  const [letterGrade, setLetterGrade] = useState<string>('');

  // Add new row
  const addCourse = () => {
    setCourses([...courses, { id: Date.now(), name: '', marks: '', credit: '1' }]);
  };

  // Remove row
  const removeCourse = (id: number) => {
    if (courses.length > 1) {
      setCourses(courses.filter(course => course.id !== id));
    }
  };

  // Handle Input Change
  const handleChange = (id: number, field: keyof Course, value: string) => {
    const updatedCourses = courses.map(course => 
      course.id === id ? { ...course, [field]: value } : course
    );
    setCourses(updatedCourses);
  };

  // 🔥 Helper: Convert Marks to Grade Point (BD Standard)
  const getGradePoint = (marks: number) => {
    if (marks >= 80) return 5.00;
    if (marks >= 70) return 4.00;
    if (marks >= 60) return 3.50;
    if (marks >= 50) return 3.00;
    if (marks >= 40) return 2.00;
    if (marks >= 33) return 1.00;
    return 0.00; // Fail
  };

  // 🔥 Helper: Get Grade Letter from GPA
  const getLetter = (gpa: number) => {
    if (gpa === 5.00) return 'A+';
    if (gpa >= 4.00) return 'A';
    if (gpa >= 3.50) return 'A-';
    if (gpa >= 3.00) return 'B';
    if (gpa >= 2.00) return 'C';
    if (gpa >= 1.00) return 'D';
    return 'F';
  };

  // Calculation Logic (Using Marks)
  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCreditsCalc = 0;
    let hasFail = false;

    courses.forEach(course => {
      const m = parseFloat(course.marks);
      const c = parseFloat(course.credit);

      if (!isNaN(m) && !isNaN(c)) {
        const gp = getGradePoint(m);
        
        if (gp === 0) hasFail = true; // যদি কোনো সাবজেক্টে ফেল থাকে

        totalPoints += gp * c;
        totalCreditsCalc += c;
      }
    });

    if (totalCreditsCalc === 0) {
      setResult(0);
      return;
    }

    // যদি ফেল থাকে, তাহলে GPA 0.00
    if (hasFail) {
      setResult(0.00);
      setLetterGrade('F');
      setTotalCredits(totalCreditsCalc);
      return;
    }

    const finalGPA = totalPoints / totalCreditsCalc;
    setResult(parseFloat(finalGPA.toFixed(2))); // 2 Decimal places
    setLetterGrade(getLetter(finalGPA));
    setTotalCredits(totalCreditsCalc);
  };

  // Reset Form
  const resetForm = () => {
    setCourses([{ id: 1, name: '', marks: '', credit: '1' }]);
    setResult(null);
    setTotalCredits(0);
    setLetterGrade('');
  };

  return (
    <section id="tools" className="py-20 bg-slate-50 dark:bg-[#0f172a] transition-colors duration-500 relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container relative z-10 max-w-4xl px-4 mx-auto">
        
        {/* Header */}
        <div className="mb-10 text-center">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-4 border border-blue-200 dark:border-blue-500/20">
              <Calculator size={16} /> <span className="text-xs font-bold tracking-wider uppercase">Marks to GPA</span>
           </div>
           <h2 className="mb-3 text-3xl font-extrabold md:text-5xl text-slate-900 dark:text-white">
              Marks <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Calculator</span>
           </h2>
           <p className="text-slate-600 dark:text-slate-400">
              Enter your marks (0-100) to get your accurate GPA result instantly.
           </p>
        </div>

        {/* 🧮 Calculator Interface */}
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
           
           {/* Top Bar */}
           <div className="flex items-center justify-between p-4 border-b bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
                 <FileSpreadsheet className="text-blue-500" size={20} /> Marks Entry
              </div>
              <button onClick={resetForm} className="text-xs flex items-center gap-1 text-slate-500 hover:text-red-500 transition-colors bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                 <RefreshCcw size={14} /> Reset
              </button>
           </div>

           <div className="p-6">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-2 mb-4 text-xs font-bold tracking-wider uppercase text-slate-400">
                 <div className="col-span-5">Subject Name</div>
                 <div className="col-span-3 text-center">Marks (100)</div>
                 <div className="col-span-2 text-center">Credit</div>
                 <div className="col-span-2 text-center">GP</div>
              </div>

              {/* Rows */}
              <div className="space-y-3">
                 {courses.map((course) => {
                    const marksNum = parseFloat(course.marks);
                    const gradePoint = !isNaN(marksNum) ? getGradePoint(marksNum).toFixed(2) : '-';
                    
                    return (
                      <div key={course.id} className="grid items-center grid-cols-12 gap-3 md:gap-4 animate-in slide-in-from-bottom-2">
                         
                         {/* Subject Name */}
                         <div className="col-span-5">
                            <input 
                              type="text" 
                              placeholder="Physics"
                              value={course.name}
                              onChange={(e) => handleChange(course.id, 'name', e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                            />
                         </div>

                         {/* Marks Input */}
                         <div className="col-span-3">
                            <input 
                              type="number" 
                              placeholder="80"
                              min="0" max="100"
                              value={course.marks}
                              onChange={(e) => handleChange(course.id, 'marks', e.target.value)}
                              className="w-full text-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-2.5 text-sm font-mono font-bold text-blue-600 dark:text-blue-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                         </div>

                         {/* Credit Input */}
                         <div className="col-span-2">
                            <input 
                              type="number" 
                              placeholder="1"
                              value={course.credit}
                              onChange={(e) => handleChange(course.id, 'credit', e.target.value)}
                              className="w-full text-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-2.5 text-sm font-mono text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                            />
                         </div>

                         {/* Live GP Display & Delete */}
                         <div className="flex items-center justify-between col-span-2 pl-2">
                            <span className={`text-xs font-bold font-mono ${gradePoint === '0.00' ? 'text-red-500' : 'text-green-500'}`}>
                               {gradePoint}
                            </span>
                            <button 
                              onClick={() => removeCourse(course.id)}
                              className="p-2 transition-colors rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10"
                            >
                               <Trash2 size={16} />
                            </button>
                         </div>
                      </div>
                    );
                 })}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col items-center justify-between gap-4 pt-6 mt-6 border-t md:flex-row border-slate-200 dark:border-slate-700">
                 
                 <button 
                   onClick={addCourse}
                   className="flex items-center gap-2 px-4 py-2 text-sm font-bold transition-colors rounded-lg text-slate-600 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400 bg-slate-100 dark:bg-slate-800"
                 >
                    <Plus size={18} /> Add Subject
                 </button>

                 <button 
                   onClick={calculateGPA}
                   className="flex items-center justify-center w-full gap-2 px-8 py-3 font-bold text-white transition-all transform shadow-lg md:w-auto bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 rounded-xl shadow-blue-500/20 active:scale-95"
                 >
                    <Calculator size={20} /> Calculate Result
                 </button>
              </div>

           </div>
        </div>

        {/* 🎉 Result Display */}
        {result !== null && (
           <div className="mt-8 duration-300 animate-in zoom-in">
              <div className="p-1 shadow-2xl bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl">
                 <div className="bg-[#0f172a] rounded-xl p-8 text-center relative overflow-hidden">
                    
                    {/* Glow Effect */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>
                    
                    <h3 className="mb-2 text-sm tracking-widest uppercase text-slate-400">Final Result</h3>
                    
                    <div className="flex items-center justify-center gap-6">
                        <div className="text-center">
                            <span className="block mb-1 text-xs text-slate-500">GPA</span>
                            <div className={`text-6xl md:text-7xl font-black font-mono ${result === 0 ? 'text-red-500' : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400'}`}>
                               {result.toFixed(2)}
                            </div>
                        </div>
                        
                        {/* Divider */}
                        <div className="w-px h-16 bg-slate-700"></div>

                        <div className="text-center">
                            <span className="block mb-1 text-xs text-slate-500">Grade</span>
                            <div className={`text-5xl md:text-6xl font-black ${letterGrade === 'F' ? 'text-red-500' : 'text-yellow-400'}`}>
                               {letterGrade}
                            </div>
                        </div>
                    </div>

                    <p className="mt-4 text-sm text-slate-500">
                       Total Credits: <span className="font-bold text-white">{totalCredits}</span>
                    </p>

                    <div className="mt-6">
                       <button className="flex items-center gap-2 px-4 py-2 mx-auto text-xs text-blue-400 transition-colors rounded-full hover:text-white bg-blue-500/10">
                          <Save size={14} /> Save to Dashboard
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        )}

      </div>
    </section>
  );
};

export default GpaCalculator;