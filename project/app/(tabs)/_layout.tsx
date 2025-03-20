import { Tabs } from 'expo-router';
import { Truck, Map, FileText, Settings, Users } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

export default function TabLayout() {
  const { colors, theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: theme === 'dark' ? '#999' : '#666',
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Veículos',
          tabBarIcon: ({ size, color }) => <Truck size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="mapa"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ size, color }) => <Map size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="relatorios"
        options={{
          title: 'Relatórios',
          tabBarIcon: ({ size, color }) => <FileText size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="motoristas"
        options={{
          title: 'Motoristas',
          tabBarIcon: ({ size, color }) => <Users size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="configuracoes"
        options={{
          title: 'Configurações',
          tabBarIcon: ({ size, color }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}