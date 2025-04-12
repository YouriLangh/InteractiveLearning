import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

const publicRoutes = ['/auth/LoginScreen', '/auth/SignupScreen', '/explore', '/'];

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    const isPublicRoute = publicRoutes.includes(pathname);
    const isLandingPage = pathname === '/';

    if (!user && !isPublicRoute) {
      // Redirect to login if trying to access protected route while not authenticated
      router.replace('/auth/LoginScreen');
    } else if (user && isLandingPage) {
      // Redirect to appropriate dashboard if authenticated user tries to access landing page
      router.replace(user.role === 'TEACHER' ? '/teacher/ProfileScreen' : '/student/StudentExerciseList');
    } else if (user && isPublicRoute && pathname !== '/explore') {
      // Redirect to appropriate dashboard if trying to access other public routes while authenticated
      router.replace(user.role === 'TEACHER' ? '/teacher/ProfileScreen' : '/student/StudentExerciseList');
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
}

export default RouteGuard; 