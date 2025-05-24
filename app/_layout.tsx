// This is the main layout file that wraps around all screens in the app
// It helps manage user authentication and shows a loading screen when the app starts
import { Slot, Redirect } from "expo-router";
import { AuthProvider } from '@/context/AuthContext';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

// Keep the loading screen visible while we get everything ready
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  // Hide the loading screen when the app is ready
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    // Wrap all screens with the authentication provider
    // This helps keep track of who is logged in
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}

// If something goes wrong, send the user back to the start screen
export function ErrorBoundary() {
  return <Redirect href="/" />;
}