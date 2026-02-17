import React from 'react';

export interface RequestItem {
  id: string;
  title: string;
  subTitle: string;
  budget: string;
  deadline: string;
  status: 'OPEN' | 'PENDING' | 'CLOSED';
}

export interface ActivityItem {
  id: string;
  type: 'QUOTE' | 'MILESTONE' | 'MESSAGE';
  title: string;
  description: string;
  time: string;
}

export interface ProgressItem {
  id: string;
  title: string;
  provider: string;
  percentage: number;
}

export interface NavItem {
  icon: React.ReactNode;
  label: string;
  id: string;
}
