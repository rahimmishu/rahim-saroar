import React, { useState, useEffect, useRef } from 'react';
import { Terminal, X, Minimize2, Square } from 'lucide-react';

const TerminalApp = ({ onClose }: { onClose: () => void }) => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<{ cmd: string; res: string }[]>([
    { cmd: "init", res: "Welcome to Rahim's Terminal v2.0. Type 'help' to see commands." }
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    let response = "";

    // কমান্ড লজিক
    switch (cmd) {
      case "help":
        response = "Available commands: \n- about: Who am I? \n- skills: My tech stack \n- contact: Get contact info \n- clear: Clear screen \n- exit: Close terminal";
        break;
      case "about":
        response = "I am Rahim Saroar, a Full Stack Developer passionate about AI, React, and solving complex problems.";
        break;
      case "skills":
        response = "Front-end: React, Next.js, Tailwind \nBack-end: Node.js, Firebase, Python \nTools: Git, VS Code";
        break;
      case "contact":
        response = "Email: rahimsaroar@gmail.com \nFacebook: /rahimsaroar";
        break;
      case "clear":
        setOutput([]);
        setInput("");
        return;
      case "exit":
        onClose();
        return;
      default:
        response = `Command not found: '${cmd}'. Type 'help' for list.`;
    }

    setOutput([...output, { cmd, res: response }]);
    setInput("");
  };

  // অটো স্ক্রল নিচে নামবে
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [output]);

  return (
    <div className="w-full h-full bg-[#0c0c0c] font-mono text-green-500 p-2 flex flex-col rounded-lg shadow-2xl border border-gray-800">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800 rounded-t-lg">
        <div className="flex items-center gap-2 text-gray-400">
           <Terminal size={16} /> <span className="text-xs font-bold">guest@rahim-portfolio:~</span>
        </div>
        <div className="flex gap-2">
           <button onClick={onClose} className="p-1 rounded hover:bg-gray-700"><Minimize2 size={14} className="text-gray-400" /></button>
           <button onClick={onClose} className="p-1 rounded hover:bg-gray-700"><Square size={14} className="text-gray-400" /></button>
           <button onClick={onClose} className="p-1 text-red-500 rounded hover:bg-red-900/50"><X size={14} /></button>
        </div>
      </div>

      {/* Output Area */}
      <div className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-green-900">
        {output.map((line, i) => (
          <div key={i} className="mb-2">
            {line.cmd !== "init" && (
               <div className="flex gap-2 text-white">
                  <span className="text-blue-400">➜</span>
                  <span className="text-yellow-400">~</span>
                  <span>{line.cmd}</span>
               </div>
            )}
            <pre className="mt-1 text-sm font-medium whitespace-pre-wrap text-green-400/90">{line.res}</pre>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleCommand} className="flex items-center gap-2 p-4 border-t border-gray-800 bg-black/20">
        <span className="text-blue-400">➜</span>
        <span className="text-yellow-400">~</span>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 text-white placeholder-gray-600 bg-transparent border-none outline-none focus:ring-0"
          placeholder="Type 'help'..."
          autoFocus
        />
      </form>

    </div>
  );
};

export default TerminalApp;