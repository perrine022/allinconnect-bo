// Enums
export enum UserType {
  CLIENT = 'CLIENT',
  PROFESSIONAL = 'PROFESSIONAL',
  MEGA_ADMIN = 'MEGA_ADMIN',
}

export enum SubscriptionType {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
}

export enum PlanCategory {
  INDIVIDUAL = 'INDIVIDUAL',
  FAMILY = 'FAMILY',
  PROFESSIONAL = 'PROFESSIONAL',
}

export enum PlanDuration {
  MONTHLY = 'MONTHLY',
  ANNUAL = 'ANNUAL',
}

export enum OfferType {
  OFFRE = 'OFFRE',
  EVENEMENT = 'EVENEMENT',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum OfferStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DRAFT = 'DRAFT',
}

// Interface User complète (entité User)
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  latitude?: number;
  longitude?: number;
  birthDate?: string;
  userType: UserType;
  subscriptionType: SubscriptionType;
  subscriptionDate?: string;
  renewalDate?: string;
  subscriptionAmount?: number;
  profession?: string | null;
  category?: string | null;
  establishmentName?: string | null;
  establishmentDescription?: string | null;
  phoneNumber?: string;
  website?: string | null;
  instagram?: string | null;
  openingHours?: string | null;
  referralCode?: string;
  walletBalance?: number;
  hasConnectedBefore?: boolean;
}

// Interface pour l'inscription (UserRegistrationRequest)
export interface UserRegistrationRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address?: string;
  city?: string;
  birthDate?: string;
  userType: UserType;
  subscriptionType?: SubscriptionType;
  subscriptionPlanId?: number;
  profession?: string;
  category?: string;
  referralCode?: string;
  cardNumber?: string;
}

// Interface pour la mise à jour du profil
export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  city?: string;
  phoneNumber?: string;
  profession?: string;
  category?: string;
  establishmentName?: string;
  establishmentDescription?: string;
  website?: string;
  instagram?: string;
  openingHours?: string;
  [key: string]: any;
}

// Interface SubscriptionPlan (entité SubscriptionPlan)
export interface SubscriptionPlan {
  id: number;
  title: string;
  description: string;
  price: number;
  category: PlanCategory;
  duration: PlanDuration;
  referralReward: number;
}

// Interface Payment (entité Payment)
export interface Payment {
  id: number;
  amount: number;
  paymentDate: string;
  status: PaymentStatus;
  stripePaymentIntentId?: string;
}

// Interface Offer (entité Offer)
export interface Offer {
  id?: number;
  title: string;
  description: string;
  price: number;
  startDate: string;
  endDate: string;
  imageUrl?: string;
  type: OfferType;
  status: OfferStatus;
  isFeatured: boolean;
}

