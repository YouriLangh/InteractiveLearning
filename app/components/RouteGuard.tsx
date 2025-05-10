import React from 'react';
import { useRouter, usePathname } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

const publicRoutes = ['/auth/LoginScreen', '/auth/SignupScreen', '/explore', '/', '/index'];

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const isPublicRoute = publicRoutes.includes(pathname);
  const isLandingPage = pathname === '/' || pathname === '/index';

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#F9A836" />
      </View>
    );
  }

  // Allow access to landing page and public routes
  if (isLandingPage || isPublicRoute) {
    return <>{children}</>;
  }

  // Block access to protected routes if not authenticated
  if (!user) {
    return null;
  }

  return <>{children}</>;
}

export default RouteGuard; 