import React, { useState } from "react";
import {
  User,
  Building2,
  MapPin,
  Search,
  Trash2,
  RefreshCw,
  CheckCircle2,
  X,
  GraduationCap,
} from "lucide-react";

type Tab = "individual" | "institution" | "district";

interface SubjectResult {
  code: string;
  name: string;
  grade: string;
}

// Sample data used only to demonstrate the result modal's layout.
const SAMPLE_SUBJECTS: SubjectResult[] = [
  { code: "101", name: "Bangla", grade: "A+" },
  { code: "107", name: "English", grade: "A+" },
  { code: "109", name: "Mathematics", grade: "A+" },
  { code: "127", name: "Physics", grade: "A+" },
  { code: "137", name: "Chemistry", grade: "A+" },
  { code: "138", name: "Biology", grade: "A" },
  { code: "153", name: "Higher Math", grade: "A+" },
  { code: "154", name: "ICT", grade: "A+" },
  { code: "150", name: "Religion & Moral Education", grade: "A+" },
];

const SAMPLE_STUDENT = {
  name: "Sample Student Name",
  fatherName: "Sample Father Name",
  motherName: "Sample Mother Name",
  roll: "123456",
  registration: "1234567890",
  board: "Dhaka",
  year: "2025",
  institute: "Sample High School, Dhaka",
  group: "Science",
  gpa: "5.00",
  result: "PASSED",
};

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "individual", label: "Individual", icon: User },
  { id: "institution", label: "Institution", icon: Building2 },
  { id: "district", label: "District", icon: MapPin },
];

const INSTRUCTIONS = [
  "Select your examination, board, and year correctly.",
  "Enter your roll number exactly as printed on your admit card.",
  "Registration number is required for verification.",
  "Enter the captcha text shown in the image below.",
  "Click \u201cCheck Individual Result\u201d to view your result.",
];

export default function ResultCheckerUI() {
  const [activeTab, setActiveTab] = useState<Tab>("individual");
  const [showModal, setShowModal] = useState(false);

  const [exam, setExam] = useState("SSC/Dakhil");
  const [board, setBoard] = useState("Dhaka");
  const [year, setYear] = useState("2025");
  const [roll, setRoll] = useState("");
  const [registration, setRegistration] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaSeed, setCaptchaSeed] = useState(1);

  const handleClear = () => {
    setRoll("");
    setRegistration("");
    setCaptchaInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demonstration only: opens the modal with sample data.
    setShowModal(true);
  };

  return (
    <div className="w-full min-h-screen px-4 py-10 font-sans bg-slate-50 md:py-14">
      {/* ─── Page Header ─── */}
      <div className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">
          Web Based Result <span className="text-blue-600">2026</span>
        </h1>
        <p className="mt-2 text-base font-bold text-slate-700 md:text-lg">
          Result Publication System for Education Board Bangladesh
        </p>
        <p className="mt-1 text-xs text-slate-500 md:text-sm">
          Check Individual, Institution &amp; District-Wise Results from a single, secure portal.
        </p>
      </div>

      {/* ─── Main Card ─── */}
      <div className="max-w-4xl mx-auto overflow-hidden bg-white border shadow-lg rounded-2xl border-slate-200 shadow-slate-200/50">
        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-1 items-center justify-center gap-2 border-b-[3px] px-4 py-4 text-sm font-semibold transition-colors ${
                  isActive
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* Left column: Form */}
          <form
            onSubmit={handleSubmit}
            className="col-span-3 p-6 space-y-4 md:p-8"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Examination
                </label>
                <select
                  value={exam}
                  onChange={(e) => setExam(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option>SSC/Dakhil</option>
                  <option>HSC/Alim</option>
                  <option>JSC/JDC</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Name of Board
                </label>
                <select
                  value={board}
                  onChange={(e) => setBoard(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option>Dhaka</option>
                  <option>Rajshahi</option>
                  <option>Chattogram</option>
                  <option>Barishal</option>
                  <option>Sylhet</option>
                  <option>Dinajpur</option>
                  <option>Jashore</option>
                  <option>Comilla</option>
                  <option>Mymensingh</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Exam Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option>2025</option>
                <option>2024</option>
                <option>2023</option>
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Roll Number
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={roll}
                  onChange={(e) => setRoll(e.target.value)}
                  placeholder="e.g. 123456"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Registration Number
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={registration}
                  onChange={(e) => setRegistration(e.target.value)}
                  placeholder="e.g. 1234567890"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Captcha */}
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Security Check
              </label>
              <div className="flex items-center gap-2">
                <div
                  key={captchaSeed}
                  className="flex h-11 w-32 shrink-0 select-none items-center justify-center rounded-lg border border-slate-300 bg-slate-100 font-mono text-lg italic tracking-[0.3em] text-slate-500"
                  style={{ backgroundImage: "repeating-linear-gradient(45deg, rgba(0,0,0,0.03) 0 2px, transparent 2px 8px)" }}
                >
                  8k2Qx
                </div>
                <button
                  type="button"
                  onClick={() => setCaptchaSeed((s) => s + 1)}
                  aria-label="Refresh captcha"
                  className="flex items-center justify-center transition border rounded-lg h-11 w-11 shrink-0 border-slate-300 text-slate-500 hover:bg-slate-50 hover:text-blue-600"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  placeholder="Enter captcha"
                  className="w-full px-3 text-sm transition bg-white border rounded-lg outline-none h-11 border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="submit"
                className="flex items-center justify-center flex-1 gap-2 px-5 py-3 text-sm font-bold text-white transition bg-blue-600 rounded-lg shadow-sm shadow-blue-600/30 hover:bg-blue-700 active:translate-y-px"
              >
                <Search className="w-4 h-4" />
                Check Individual Result
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold transition bg-white border rounded-lg border-slate-300 text-slate-600 hover:bg-slate-50 active:translate-y-px"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            </div>
          </form>

          {/* Right column: Info panel */}
          <div className="col-span-2 p-6 border-t border-slate-200 bg-slate-50/60 md:border-l md:border-t-0 md:p-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center w-8 h-8 text-blue-600 bg-blue-100 rounded-full">
                <User className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Individual Result</h3>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              Check a single student&apos;s examination result instantly using
              their roll and registration number. Results are compiled
              directly from official board data.
            </p>

            <ul className="mt-5 space-y-3">
              {INSTRUCTIONS.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ─── Result Modal ─── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setShowModal(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-start justify-between gap-4 bg-[#1853A5] px-5 py-4 text-white">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 shrink-0" />
                <h2 className="text-sm font-bold tracking-wide uppercase md:text-base">
                  Result of SSC/Dakhil/Equivalent Examination &ndash; {SAMPLE_STUDENT.year}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                aria-label="Close"
                className="p-1 transition rounded-full shrink-0 text-white/80 hover:bg-white/10 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 md:p-6">
              {/* Demo data notice */}
              <p className="px-3 py-2 mb-4 text-xs font-medium rounded-md bg-amber-50 text-amber-700">
                Sample data shown for layout demonstration only.
              </p>

              {/* Student info grid */}
              <div className="grid grid-cols-1 p-4 text-sm border rounded-lg gap-x-6 gap-y-2 border-slate-200 sm:grid-cols-2">
                <InfoRow label="Name" value={SAMPLE_STUDENT.name} />
                <InfoRow label="Result" value={SAMPLE_STUDENT.result} highlight />
                <InfoRow label="Father's Name" value={SAMPLE_STUDENT.fatherName} />
                <InfoRow label="GPA" value={SAMPLE_STUDENT.gpa} highlight />
                <InfoRow label="Mother's Name" value={SAMPLE_STUDENT.motherName} />
                <InfoRow label="Group" value={SAMPLE_STUDENT.group} />
                <InfoRow label="Roll No." value={SAMPLE_STUDENT.roll} />
                <InfoRow label="Registration No." value={SAMPLE_STUDENT.registration} />
                <InfoRow label="Board" value={SAMPLE_STUDENT.board} />
                <InfoRow label="Institute" value={SAMPLE_STUDENT.institute} />
              </div>

              {/* Subject-wise table */}
              <div className="mt-6">
                <h4 className="mb-2 text-xs font-bold tracking-wider uppercase text-slate-500">
                  Subject-wise Grade / Marks
                </h4>
                <div className="overflow-hidden border rounded-lg border-slate-200">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="bg-[#1853A5] text-white">
                        <th className="px-4 py-2.5 font-semibold">Subject Code</th>
                        <th className="px-4 py-2.5 font-semibold">Subject Name</th>
                        <th className="px-4 py-2.5 font-semibold">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SAMPLE_SUBJECTS.map((s, i) => (
                        <tr
                          key={s.code}
                          className={`border-t border-slate-200 ${i % 2 === 1 ? "bg-slate-50" : "bg-white"}`}
                        >
                          <td className="px-4 py-2.5 text-slate-600">{s.code}</td>
                          <td className="px-4 py-2.5 text-slate-800">{s.name}</td>
                          <td className="px-4 py-2.5 font-semibold text-blue-600">{s.grade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between gap-3 py-1">
      <span className="text-slate-500">{label}</span>
      <span className={`text-right font-semibold ${highlight ? "text-blue-600" : "text-slate-800"}`}>
        {value}
      </span>
    </div>
  );
}