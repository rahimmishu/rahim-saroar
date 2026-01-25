import React from 'react';

export interface NavLink {
  label: string;
  href: string;
}

export interface Project {
  id: number;
  title: string;
  meta: string;
  action: string;
  image: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: React.ComponentType;
}

export interface Achievement {
  id: number;
  icon: string;
  text: string;
}