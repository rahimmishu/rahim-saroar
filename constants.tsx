import { Project, Achievement } from './types';

export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Projects', href: '#projects' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'About Me', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Stealth GPS Tracker",
    meta: "Python & Flask",
    action: "View Code",
    image: "/gps-tracker-new.jpg",
  },
  {
    id: 2,
    title: "AI Personal Assistant (MJ/Jarvis)",
    meta: "Gemini API & LiveKit",
    action: "Watch Demo",
    image: "/jarvis-ai.jpg",
  },
  {
    id: 3,
    title: "Face & Hand Tracking System",
    meta: "Computer Vision (OpenCV)",
    action: "Explore",
    image: "/hand-tracking.jpg",
  },
  {
    id: 4,
    title: "Rhythm of Peace",
    meta: "Content Creation",
    action: "Visit Page",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop"
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 1,
    icon: 'award',
    text: "Google Certified Educator (Level 1 & 2) & Gemini Certified."
  },
  {
    id: 2,
    icon: 'book',
    text: "Achieved GPA 5.00 in SSC from Mangalbari Sirajia High School."
  },
  {
    id: 3,
    icon: 'video',
    text: "Content Creator for 'Rhythm of Peace'."
  }
];