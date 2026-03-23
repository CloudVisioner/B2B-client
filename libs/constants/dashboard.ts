import React from 'react';
import { LayoutDashboard, FileText, ShoppingCart, Bell, Building2 } from 'lucide-react';
import { NavItem, RequestItem, ActivityItem, ProgressItem } from '../types/dashboard';

export const NAV_ITEMS: NavItem[] = [
  { icon: React.createElement(LayoutDashboard, { size: 20 }), label: 'Dashboard', id: 'dashboard' },
  { icon: React.createElement(FileText, { size: 20 }), label: 'My Service Requests', id: 'requests' },
  { icon: React.createElement(ShoppingCart, { size: 20 }), label: 'Orders', id: 'orders' },
  { icon: React.createElement(Bell, { size: 20 }), label: 'Notifications', id: 'notifications' },
  { icon: React.createElement(Building2, { size: 20 }), label: 'Organizations', id: 'organizations' },
];

export const MOCK_REQUESTS: RequestItem[] = [
  {
    id: '#SR-9021',
    title: 'Enterprise Cloud Migration',
    subTitle: 'Infrastructure',
    budget: '$12,000',
    deadline: 'Mar 15, 2024',
    status: 'OPEN',
  },
  {
    id: '#SR-8842',
    title: 'Cybersecurity Compliance Audit',
    subTitle: 'Security',
    budget: '$4,500',
    deadline: 'Feb 28, 2024',
    status: 'PENDING',
  },
  {
    id: '#SR-7731',
    title: 'Custom ERP Extension Development',
    subTitle: 'Software',
    budget: '$8,200',
    deadline: 'Apr 02, 2024',
    status: 'OPEN',
  },
];

export const MOCK_PROGRESS: ProgressItem[] = [
  {
    id: '1',
    title: 'Network Topology Mapping',
    provider: 'TechSystems Inc.',
    percentage: 60,
  },
  {
    id: '2',
    title: 'Frontend UI Kit Design',
    provider: 'Studio Minimal',
    percentage: 85,
  },
];

export const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: 'a1',
    type: 'QUOTE',
    title: 'New Quote Received',
    description: 'Infrastructure Partners submitted a quote for Cloud Migration.',
    time: '2 minutes ago',
  },
  {
    id: 'a2',
    type: 'MILESTONE',
    title: 'Milestone Approval',
    description: 'Phase 1 of Network Mapping is ready for review.',
    time: '1 hour ago',
  },
  {
    id: 'a3',
    type: 'MESSAGE',
    title: 'Message',
    description: 'New message from Sarah Jenkins regarding budget.',
    time: '4 hours ago',
  },
];
