import { Slot, Redirect } from "expo-router";
import { AuthProvider } from '@/context/AuthContext';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}

// This ensures the root route redirects to /index
export function ErrorBoundary() {
  return <Redirect href="/index" />;
}