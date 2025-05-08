import { Stack } from "expo-router";
import { AuthProvider } from '@/context/AuthContext';
import { RouteGuard } from './components/RouteGuard';

<<<<<<< HEAD

=======
>>>>>>> Fahim2
export default function Layout() {
  return (
    <AuthProvider>
      <RouteGuard>
        <Stack screenOptions={{ headerShown: false }} />
      </RouteGuard>
    </AuthProvider>
  );
}