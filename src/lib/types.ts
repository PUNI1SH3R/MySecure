export interface UserProfile {
  name: string;
  email: string;
  notifications: boolean;
  twoFactor: boolean;
  walletAddress: string;
}

export interface FAQ {
  question: string;
  answer: string;
  category?: string;
}

export interface SupportTicket {
  email: string;
  subject: string;
  message: string;
}