export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  description?: string;
  createdAt: string;
  totalLinks: number;
  totalClicks: number;
}

export interface Project {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  description?: string;
  createdAt: string;
  totalLinks: number;
  totalClicks: number;
}

export interface LinkItem {
  id: string;
  title: string;
  slug: string;
  originalUrl: string;
  customDomain: string;
  clientId: string;
  clientName: string;
  projectId?: string;
  projectName?: string;
  description?: string;
  status: 'active' | 'inactive' | 'expired';
  expiresAt: string | null;
  totalClicks: number;
  uniqueVisitors: number;
  createdAt: string;
  updatedAt: string;
  isWhatsAppLink?: boolean;
  whatsappData?: {
    countryCode: string;
    ddd: string;
    phone: string;
    message: string;
  };
}

export interface ClickEvent {
  id: string;
  linkId: string;
  slug: string;
  clientId: string;
  projectId?: string;
  timestamp: string;
  deviceType: 'Mobile' | 'Desktop' | 'Tablet' | 'Desconhecido';
  browser: 'Chrome' | 'Safari' | 'Firefox' | 'Edge' | 'Opera' | 'Outro';
  operatingSystem: 'iOS' | 'Android' | 'Windows' | 'macOS' | 'Linux' | 'Outro';
  referrer: string;
  referrerDomain: string;
  country: string;
  region: string;
  city: string;
  anonymousVisitorId: string;
  isBot: boolean;
  userAgent?: string;
}

export interface AnalyticsSummary {
  totalLinks: number;
  totalClicks: number;
  uniqueVisitors: number;
  clicksToday: number;
  clicks7d: number;
  clicks30d: number;
  activeLinks: number;
  inactiveLinks: number;
  timeSeries: {
    date: string;
    label: string;
    clicks: number;
    uniques: number;
  }[];
  devices: { name: string; value: number; percentage: number }[];
  operatingSystems: { name: string; value: number; percentage: number }[];
  browsers: { name: string; value: number; percentage: number }[];
  referrers: { name: string; value: number; percentage: number }[];
  locations: { country: string; city: string; count: number }[];
  topLinks: {
    id: string;
    title: string;
    slug: string;
    originalUrl: string;
    clicks: number;
    clientName: string;
    growth: number;
  }[];
  recentActivity: {
    id: string;
    linkTitle: string;
    slug: string;
    deviceType: string;
    browser: string;
    referrer: string;
    location: string;
    timestamp: string;
  }[];
}

export interface DomainConfig {
  officialDomain: string; // "kaizen.visual"
  isVerified: boolean;
  dnsStatus: 'pending' | 'active' | 'warning';
  configuredHost: string;
  recommendedCname: string;
  recommendedARecord: string;
}
