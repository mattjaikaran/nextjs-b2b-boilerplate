import type { BaseEntity } from './base';
import type { User } from './user';

export interface Organization extends BaseEntity {
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  plan: 'free' | 'starter' | 'pro' | 'enterprise';
  ownerId: string;
  memberCount: number;
}

export interface OrganizationMember extends BaseEntity {
  userId: string;
  organizationId: string;
  role: OrgRole;
  user: User;
}

export type OrgRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface CreateOrganizationRequest {
  name: string;
  slug?: string;
  description?: string;
}

export interface UpdateOrganizationRequest {
  name?: string;
  description?: string;
  logo?: string;
}

export interface InviteMemberRequest {
  email: string;
  role: OrgRole;
}

export interface TeamMember extends BaseEntity {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: OrgRole;
  status: 'active' | 'invited' | 'disabled';
  lastActive?: string;
}
