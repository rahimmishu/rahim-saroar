import React, { useState, useRef, useEffect } from 'react';
import { PROJECTS } from '../constants';
import { ChevronRight, X, Copy, Check, Terminal, Play, Eye, ExternalLink } from 'lucide-react';

const Projects: React.FC = () => {
  // ১. কোড মডালের জন্য স্টেট
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [activeCode, setActiveCode] = useState(""); 
  const [activeFilename, setActiveFilename] = useState(""); 
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLDivElement>(null);

  // ২. ভিডিও প্লেয়ারের জন্য স্টেট
  const [showVideoModal, setShowVideoModal] = useState(false);
  
  // 🔴 আপনার ইউটিউব ভিডিও আইডি (AI Project)
  const videoId = "E4fGvJ2nGkY"; 

  // 🔵 আপনার ফেসবুক পেজের লিংক (আপডেট করা হয়েছে)
  const facebookPageLink = "https://www.facebook.com/rhythm2OfPeace";

  // ---------------------------------------------------------
  // 💻 কোড ১: হ্যাকার স্টাইল GPS ট্র্যাকার
  // ---------------------------------------------------------
  const gpsCode = `# ----- ADVANCED GPS TRACKING PROTOCOL v3.1.4 -----
# Author: CYBER_GHOST
# Clearance Level: TOP SECRET
# ---------------------------------------------------

import sys
import time
import random
import geocoder 
import folium   
from datetime import datetime
import socket

# Configuration
TARGET_IP = "192.168.1.45"  # Simulation target
ENCRYPTION_LEVEL = "AES-256"

class GeoTracer_Elite:
    def __init__(self, target_ip):
        self.target = target_ip
        self.hostname = socket.gethostname()
        print(f"[*] Initializing GeoTracer Elite on {self.hostname}...")
        print(f"[*] Target IP Acquired: {self.target}")
        print(f"[*] Encryption: {ENCRYPTION_LEVEL} Enabled.")
        time.sleep(0.8)

    def establish_secure_uplink(self):
        """Simulates connecting to a satellite uplink."""
        print("\\n[!] Attempting secure satellite uplink...")
        toolbar_width = 40
        for i in range(toolbar_width + 1):
            time.sleep(random.uniform(0.02, 0.1))
            bar = '█' * i + '-' * (toolbar_width - i)
            sys.stdout.write(f"\\r[+] Uplink: [{bar}] {int(i/toolbar_width*100)}%")
            sys.stdout.flush()
        print("\\n[✓] Uplink Established. Secure Tunnel Active.")

    def locate_target_coordinates(self):
        print(f"\\n[*] Triangulating position based on IP signature...")
        try:
            # Simulated Geolocation
            g = geocoder.ip('me') 
            
            if g.ok:
                timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                print(f"\\n[✓] >>> LOCATION CONFIRMED <<< at {timestamp}")
                print(f"==========================================")
                print(f" [+] Status:    LOCKED")
                print(f" [+] City:      {g.city.upper()}")
                print(f" [+] Country:   {g.country.upper()}")
                print(f" [+] Lat/Lng:   {g.latlng}")
                print(f" [+] ISP Node:  {g.org}")
                print(f"==========================================")
                
                self.generate_tactical_map(g.latlng)
            else:
                print("[-] Geolocation failed. Signal too weak.")
        except Exception as e:
            print(f"[!] Critical Module Error: {e}")

    def generate_tactical_map(self, coords):
        print("[*] Generating tactical map view...")
        my_map = folium.Map(location=coords, zoom_start=15)
        filename = f"target_{int(time.time())}.html"
        my_map.save(filename)
        print(f"[✓] Tactical map saved locally as '{filename}'")

if __name__ == "__main__":
    tracer = GeoTracer_Elite(TARGET_IP)
    tracer.establish_secure_uplink()
    tracer.locate_target_coordinates()
    sys.exit(0)`;


  // ---------------------------------------------------------
  // 💻 কোড ২: হ্যান্ড ট্র্যাকিং সিস্টেম
  // ---------------------------------------------------------
  const handCode = `# ----- NEURAL HAND TRACKING CORE v2.0 -----
# System: CV_MATRIX_LENS
# library: OpenCV, MediaPipe
# ------------------------------------------

import cv2
import mediapipe as mp
import time
import math
import numpy as np

class HandDetector:
    def __init__(self, mode=False, maxHands=2, complexity=1, detectionCon=0.5, trackCon=0.5):
        self.mode = mode
        self.maxHands = maxHands
        self.complexity = complexity
        self.detectionCon = detectionCon
        self.trackCon = trackCon

        # Initialize MediaPipe Hands Module
        self.mpHands = mp.solutions.hands
        self.hands = self.mpHands.Hands(self.mode, self.maxHands, 
                                      self.complexity, self.detectionCon, 
                                      self.trackCon)
        self.mpDraw = mp.solutions.drawing_utils
        self.tipIds = [4, 8, 12, 16, 20]
        
        print("[SYSTEM] Loading Neural Tensors...")
        time.sleep(0.5)
        print("[SYSTEM] Calibrating Optical Sensors...")

    def find_hands(self, img, draw=True):
        """Processes the frame to detect hands and landmarks."""
        imgRGB = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        self.results = self.hands.process(imgRGB)

        if self.results.multi_hand_landmarks:
            for handLms in self.results.multi_hand_landmarks:
                if draw:
                    # Draw skeletal connections in Matrix Green
                    self.mpDraw.draw_landmarks(img, handLms, 
                                             self.mpHands.HAND_CONNECTIONS)
        return img

    def find_position(self, img, handNo=0, draw=True):
        """Calculates specific landmark coordinates."""
        lmList = []
        if self.results.multi_hand_landmarks:
            myHand = self.results.multi_hand_landmarks[handNo]
            
            for id, lm in enumerate(myHand.landmark):
                h, w, c = img.shape
                cx, cy = int(lm.x * w), int(lm.y * h)
                lmList.append([id, cx, cy])
                
                if draw:
                    cv2.circle(img, (cx, cy), 5, (0, 255, 0), cv2.FILLED)
        return lmList

    def fingers_up(self, lmList):
        """Determines which fingers are extended."""
        fingers = []
        
        # Thumb Logic (X-axis based)
        if lmList[self.tipIds[0]][1] > lmList[self.tipIds[0] - 1][1]:
            fingers.append(1)
        else:
            fingers.append(0)

        # 4 Fingers Logic (Y-axis based)
        for id in range(1, 5):
            if lmList[self.tipIds[id]][2] < lmList[self.tipIds[id] - 2][2]:
                fingers.append(1)
            else:
                fingers.append(0)
        return fingers

def run_system_diagnostic():
    print("[DIAGNOSTIC] Camera Stream: ACTIVE")
    print("[DIAGNOSTIC] Frame Rate: 60 FPS")
    print("[DIAGNOSTIC] Tracking Confidence: 98.4%")

# =========================================
# MAIN EXECUTION LOOP
# =========================================
if __name__ == "__main__":
    detector = HandDetector()
    run_system_diagnostic()
    
    cap = cv2.VideoCapture(0)
    pTime = 0
    
    print("[*] STARTING VISUAL INTERFACE...")
    
    while True:
        success, img = cap.read()
        img = detector.find_hands(img)
        lmList = detector.find_position(img)
        
        if len(lmList) != 0:
            fingers = detector.fingers_up(lmList)
            print(f"Active Fingers: {fingers.count(1)}")
        
        # Frame Rate Calculation
        cTime = time.time()
        fps = 1 / (cTime - pTime)
        pTime = cTime
        
        cv2.putText(img, str(int(fps)), (10, 70), 
                    cv2.FONT_HERSHEY_PLAIN, 3, (0, 255, 0), 3)
        
        cv2.imshow("Neural Hand Track", img)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break`;


  // 🎮 বাটন লজিক
  const handleAction = (project: any) => {
    // 1. GPS Project -> Show GPS Code
    if (project.title.includes("GPS") || project.title.includes("Tracker")) {
      setActiveCode(gpsCode);
      setActiveFilename("gps_tracker_v4.py");
      setShowCodeModal(true);
    } 
    // 2. Hand Tracking Project -> Show Hand Code
    else if (project.title.includes("Hand") || project.title.includes("Tracking")) {
      setActiveCode(handCode);
      setActiveFilename("gesture_core_ai.py");
      setShowCodeModal(true);
    }
    // 3. AI Project -> Show Video
    else if (project.title.includes("AI") || project.title.includes("Assistant")) {
      setShowVideoModal(true);
    } 
    // 4. Rhythm of Peace -> Open Facebook Page
    else if (project.title.includes("Rhythm") || project.title.includes("Peace")) {
        window.open(facebookPageLink, "_blank");
    }
    // 5. Others
    else {
      alert("Demo link coming soon!"); 
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
      if (showCodeModal && codeRef.current) {
          codeRef.current.scrollTop = 0;
      }
  }, [showCodeModal]);

  return (
    <section id="projects" className="py-24 bg-slate-50 dark:bg-slate-800 transition-colors duration-300 relative">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Featured Projects</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
             A showcase of my technical journey through AI, IoT, and Content Creation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PROJECTS.map((project) => (
            <div 
              key={project.id} 
              className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 flex flex-col group"
            >
              <div className="relative h-48 overflow-hidden bg-slate-200 dark:bg-slate-800">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors line-clamp-1">
                  {project.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
                  {project.meta}
                </p>
                
                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button 
                    onClick={() => handleAction(project)}
                    className="w-full flex items-center justify-between text-primary font-bold text-sm hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                  >
                    {project.action}
                    <span className="bg-blue-50 dark:bg-slate-800 p-1.5 rounded-full group-hover:bg-primary group-hover:text-white transition-all">
                        {/* ডাইনামিক আইকন সিলেকশন */}
                        {project.title.includes("AI") ? <Play size={16} fill="currentColor"/> : 
                         project.title.includes("Hand") ? <Eye size={16} /> :
                         project.title.includes("GPS") ? <Terminal size={16} /> :
                         project.title.includes("Rhythm") ? <ExternalLink size={16} /> :
                         <ChevronRight size={16} />}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🟢 HACKER CODE MODAL */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#0a0a0a] rounded-lg shadow-2xl w-full max-w-3xl border border-green-500/30 overflow-hidden font-mono relative">
            
             {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#111111] border-b border-green-500/30 relative z-10">
              <div className="flex items-center gap-3">
                <Terminal size={18} className="text-green-500 animate-pulse" />
                <span className="text-sm font-bold text-green-400 tracking-wider">ROOT@CYBERDECK:~# cat {activeFilename}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={copyToClipboard} className="p-1.5 hover:bg-green-500/20 rounded text-green-500/70">
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
                <button onClick={() => setShowCodeModal(false)} className="p-1.5 hover:bg-red-900/30 text-green-500/70 rounded">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Code Body */}
            <div ref={codeRef} className="p-6 overflow-auto bg-[#0a0a0a] max-h-[70vh] custom-scrollbar relative z-10">
              <pre className="text-sm leading-relaxed text-green-400 whitespace-pre">
                <code>{activeCode}</code>
              </pre>
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-[#111111] border-t border-green-500/30 text-green-600/70 text-xs font-medium flex justify-between relative z-10">
              <span>STATUS: ACTIVE RUNTIME</span>
              <span>ENCRYPTION: ON</span>
            </div>
          </div>
        </div>
      )}

      {/* 🔴 VIDEO POPUP MODAL */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl w-full max-w-4xl border border-slate-700 relative">
            <button 
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-red-500 transition-all backdrop-blur-md"
            >
              <X size={24} />
            </button>
            <div className="relative aspect-video bg-black">
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/E4fGvJ2nGkY?autoplay=1"
                title="Project Demo"
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

export default Projects;