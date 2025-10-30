import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../auth';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, clearAuth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      router.push('/dashboard');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: {
      email: string;
      username: string;
      password: string;
      password_confirm: string;
      first_name: string;
      last_name: string;
    }) => authService.register(data),
    onSuccess: () => {
      router.push('/auth/login');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      router.push('/auth/login');
    },
  });

  const { data: currentUser } = useQuery({
    queryKey: ['user'],
    queryFn: () => authService.getCurrentUser(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    user: currentUser || user,
    isAuthenticated,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
};