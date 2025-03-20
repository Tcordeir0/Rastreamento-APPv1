import { Stack } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function OnboardingLayout() {
  const { theme } = useTheme();
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { 
          backgroundColor: theme === 'dark' ? '#121212' : '#F5F5F5'
        },
        animation: 'slide_from_right',
      }}
    />
  );
}
