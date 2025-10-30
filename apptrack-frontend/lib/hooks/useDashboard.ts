import { useQuery } from '@tanstack/react-query';
import api from '../api';
import { DashboardSummary } from '../types';

export const useDashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await api.get<DashboardSummary>('/dashboard/summary/');
      return response.data;
    },
    refetchInterval: 60000, // Refetch every minute
  });

  return {
    summary: data,
    isLoading,
    error,
  };
};