import { Stack } from "expo-router";
import { AuthProvider } from '@/context/AuthContext';
import { RouteGuard } from './components/RouteGuard';

export default function Layout() {
  return (
    <AuthProvider>
      <RouteGuard>
        <Stack screenOptions={{ headerShown: false }} />
      </RouteGuard>
    </AuthProvider>
  );
}