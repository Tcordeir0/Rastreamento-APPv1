import { useEffect } from 'react';
import { Stack, Slot, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

// Tela de carregamento
function LoadingScreen() {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

function RootLayoutContent() {
  useFrameworkReady();
  const { theme } = useTheme();
  const { isLoggedIn, hasCompletedOnboarding, isLoading } = useAuth();
  const router = useRouter();
  
  // Usar useEffect para navegação após a montagem completa
  useEffect(() => {
    const configureInitialRoute = async () => {
      if (!isLoading) {
        try {
          if (!hasCompletedOnboarding) {
            // Redirecionar para onboarding
            router.replace('/onboarding/profile-selection');
          } else if (!isLoggedIn) {
            // Redirecionar para tela de login
            router.replace('/login');
          }
          // Se estiver logado, permanece na rota atual (/(tabs))
        } catch (error) {
          console.error('Erro de navegação:', error);
        }
      }
    };
    
    configureInitialRoute();
  }, [isLoading, hasCompletedOnboarding, isLoggedIn, router]);
  
  // Exibir tela de carregamento enquanto verifica o estado de autenticação
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <>
      <Slot />
      <StatusBar style={theme === 'dark' || theme === 'highContrast' ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RootLayoutContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});