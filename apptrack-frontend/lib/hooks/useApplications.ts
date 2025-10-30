import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { Application, PaginatedResponse } from '../types';

export const useApplications = (filters?: {
  status?: string;
  kind?: string;
  tags?: string;
  page?: number;
}) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['applications', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.kind) params.append('kind', filters.kind);
      if (filters?.tags) params.append('tags', filters.tags);
      if (filters?.page) params.append('page', filters.page.toString());

      const response = await api.get<PaginatedResponse<Application>>(
        `/applications/?${params.toString()}`
      );
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Application>) =>
      api.post<Application>('/applications/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Application> }) =>
      api.patch<Application>(`/applications/${id}/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/applications/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });

  return {
    applications: data?.results || [],
    count: data?.count || 0,
    isLoading,
    error,
    createApplication: createMutation.mutate,
    updateApplication: updateMutation.mutate,
    deleteApplication: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useApplication = (id: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['application', id],
    queryFn: async () => {
      const response = await api.get<Application>(`/applications/${id}/`);
      return response.data;
    },
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Application>) =>
      api.patch<Application>(`/applications/${id}/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application', id] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });

  return {
    application: data,
    isLoading,
    error,
    updateApplication: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
};