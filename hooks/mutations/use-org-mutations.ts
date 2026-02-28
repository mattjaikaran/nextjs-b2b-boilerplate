'use client';

import { orgKeys, organizationService } from '@/lib/api/services';
import { useUI } from '@/lib/store';
import type { CreateOrganizationRequest, InviteMemberRequest, Organization, OrganizationMember, UpdateOrganizationRequest } from '@/types';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';

export const useCreateOrganization = (
  options?: Omit<UseMutationOptions<Organization, Error, CreateOrganizationRequest>, 'mutationFn'>
) => {
  const queryClient = useQueryClient();
  const { addNotification } = useUI();

  return useMutation<Organization, Error, CreateOrganizationRequest>({
    mutationFn: (data) => organizationService.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: orgKeys.all });
      addNotification({ type: 'success', title: 'Organization created', message: `"${data.name}" has been created.` });
    },
    onError: (error) => {
      addNotification({ type: 'error', title: 'Failed to create organization', message: error.message });
    },
    ...options,
  });
};

export const useUpdateOrganization = (
  options?: Omit<UseMutationOptions<Organization, Error, { id: string; data: UpdateOrganizationRequest }>, 'mutationFn'>
) => {
  const queryClient = useQueryClient();
  const { addNotification } = useUI();

  return useMutation<Organization, Error, { id: string; data: UpdateOrganizationRequest }>({
    mutationFn: ({ id, data }) => organizationService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: orgKeys.all });
      queryClient.setQueryData(orgKeys.detail(data.id), data);
      addNotification({ type: 'success', title: 'Organization updated', message: `"${data.name}" has been updated.` });
    },
    onError: (error) => {
      addNotification({ type: 'error', title: 'Update failed', message: error.message });
    },
    ...options,
  });
};

export const useInviteMember = (
  orgId: string,
  options?: Omit<UseMutationOptions<OrganizationMember, Error, InviteMemberRequest>, 'mutationFn'>
) => {
  const queryClient = useQueryClient();
  const { addNotification } = useUI();

  return useMutation<OrganizationMember, Error, InviteMemberRequest>({
    mutationFn: (data) => organizationService.inviteMember(orgId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orgKeys.members(orgId) });
      addNotification({ type: 'success', title: 'Invitation sent', message: 'Team member has been invited.' });
    },
    onError: (error) => {
      addNotification({ type: 'error', title: 'Invitation failed', message: error.message });
    },
    ...options,
  });
};

export const useRemoveMember = (
  orgId: string,
  options?: Omit<UseMutationOptions<{ message: string }, Error, string>, 'mutationFn'>
) => {
  const queryClient = useQueryClient();
  const { addNotification } = useUI();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: (memberId) => organizationService.removeMember(orgId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orgKeys.members(orgId) });
      addNotification({ type: 'success', title: 'Member removed', message: 'Team member has been removed.' });
    },
    onError: (error) => {
      addNotification({ type: 'error', title: 'Removal failed', message: error.message });
    },
    ...options,
  });
};
