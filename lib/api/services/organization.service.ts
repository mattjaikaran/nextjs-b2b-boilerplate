import { api, handleApiResponse } from '@/lib/api';
import type {
  ApiResponse,
  Organization,
  OrganizationMember,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  InviteMemberRequest,
} from '@/types';
import { createQueryKeyFactory } from '../utils/query-keys';

export const orgKeys = {
  ...createQueryKeyFactory('organizations'),
  members: (orgId: string) => ['organizations', orgId, 'members'] as const,
  current: () => ['organizations', 'current'] as const,
};

class OrganizationServiceClass {
  private readonly basePath = '/organizations';

  async list(): Promise<Organization[]> {
    const response = await api.get<ApiResponse<Organization[]>>(this.basePath);
    return handleApiResponse(response);
  }

  async getById(id: string): Promise<Organization> {
    const response = await api.get<ApiResponse<Organization>>(`${this.basePath}/${id}`);
    return handleApiResponse(response);
  }

  async create(data: CreateOrganizationRequest): Promise<Organization> {
    const response = await api.post<ApiResponse<Organization>>(this.basePath, data);
    return handleApiResponse(response);
  }

  async update(id: string, data: UpdateOrganizationRequest): Promise<Organization> {
    const response = await api.patch<ApiResponse<Organization>>(`${this.basePath}/${id}`, data);
    return handleApiResponse(response);
  }

  async delete(id: string): Promise<{ message: string }> {
    const response = await api.delete<ApiResponse<{ message: string }>>(`${this.basePath}/${id}`);
    return handleApiResponse(response);
  }

  async getMembers(orgId: string): Promise<OrganizationMember[]> {
    const response = await api.get<ApiResponse<OrganizationMember[]>>(`${this.basePath}/${orgId}/members`);
    return handleApiResponse(response);
  }

  async inviteMember(orgId: string, data: InviteMemberRequest): Promise<OrganizationMember> {
    const response = await api.post<ApiResponse<OrganizationMember>>(`${this.basePath}/${orgId}/members`, data);
    return handleApiResponse(response);
  }

  async removeMember(orgId: string, memberId: string): Promise<{ message: string }> {
    const response = await api.delete<ApiResponse<{ message: string }>>(`${this.basePath}/${orgId}/members/${memberId}`);
    return handleApiResponse(response);
  }

  async updateMemberRole(orgId: string, memberId: string, role: string): Promise<OrganizationMember> {
    const response = await api.patch<ApiResponse<OrganizationMember>>(`${this.basePath}/${orgId}/members/${memberId}`, { role });
    return handleApiResponse(response);
  }
}

export const organizationService = new OrganizationServiceClass();
