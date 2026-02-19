import { makeVar } from '@apollo/client';

export interface UserOrganization {
  _id?: string;
  orgType?: string;
  orgStatus?: string;
  orgCountry?: string;
  orgCity?: string;
  orgWebsiteUrl?: string;
  orgTotalProjects?: number;
  orgResponseTimeAvg?: string;
  orgVerified?: boolean;
  orgSkills?: string[];
  orgOwnerUserId?: string;
  orgName?: string;
  orgDescription?: string;
  orgAverageRating?: number;
  orgTotalLikes?: number;
  orgTotalViews?: number;
  orgLogoImages?: string[];
  orgTaxId?: string;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  _id?: string;
  userRole?: string;
  userStatus?: string;
  userAuthType?: string;
  userEmail?: string;
  userPhone?: string;
  userNick?: string;
  userImage?: string;
  userOrganizationId?: string;
  userCountry?: string;
  userCity?: string;
  userDescription?: string;
  userLanguages?: string[];
  userTotalServiceRequests?: number;
  userTotalQuotes?: number;
  userTotalFollowers?: number;
  userTotalFollowing?: number;
  userTotalLikes?: number;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  accessToken?: string;
  userOrganization?: UserOrganization;
  [key: string]: any;
}

export const userVar = makeVar<User>({});
export const themeModeVar = makeVar<'light' | 'dark'>('light');
