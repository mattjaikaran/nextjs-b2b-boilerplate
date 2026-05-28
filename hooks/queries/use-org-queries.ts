'use client';

import { orgKeys, organizationService } from '@/lib/api/services';
import type { Organization, OrganizationMember } from '@/types';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

const useOrganizations = (
  options?: Omit<UseQueryOptions<Organization[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Organization[], Error>({
    queryKey: orgKeys.all,
    queryFn: () => organizationService.list(),
    ...options,
  });
};

const useOrganization = (
  id: string,
  options?: Omit<UseQueryOptions<Organization, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Organization, Error>({
    queryKey: orgKeys.detail(id),
    queryFn: () => organizationService.getById(id),
    enabled: !!id,
    ...options,
  });
};

const useOrgMembers = (
  orgId: string,
  options?: Omit<UseQueryOptions<OrganizationMember[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<OrganizationMember[], Error>({
    queryKey: orgKeys.members(orgId),
    queryFn: () => organizationService.getMembers(orgId),
    enabled: !!orgId,
    ...options,
  });
};
