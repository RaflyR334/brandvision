
export interface ExpertiseClassification {
  expertiseAreas: string[];
  summary: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'affiliator';
  subscription: 'free' | 'pro';
  avatar?: string;
  createdAt: string;
  phoneNumber?: string;
  twitterHandle?: string;
  linkedinUrl?: string;
  portfolioWebsite?: string;
}

export interface HistoryItem {
  id: string;
  userId: string;
  inputText: string;
  result: ExpertiseClassification;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  status: 'success' | 'pending' | 'failed';
  plan: 'pro';
  createdAt: string;
}

export interface AffiliateData {
  referralCode: string;
  referrals: number;
  totalCommission: number;
  pendingCommission: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  createdAt: string;
}
