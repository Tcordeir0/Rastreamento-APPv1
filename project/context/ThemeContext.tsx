import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Definição dos temas
export type ThemeColors = {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  notification: string;
  success: string;
  warning: string;
  error: string;
};

export type ThemeType = 'light' | 'dark' | 'highContrast';

// Temas predefinidos
const themes = {
  light: {
    primary: '#0066cc',
    secondary: '#2ecc71',
    background: '#f5f5f5',
    card: '#ffffff',
    text: '#333333',
    textSecondary: '#666666',
    border: '#e5e5e5',
    notification: '#ff3b30',
    success: '#2ecc71',
    warning: '#f1c40f',
    error: '#dc3545',
  },
  dark: {
    primary: '#0080ff',
    secondary: '#2ecc71',
    background: '#121212',
    card: '#1e1e1e',
    text: '#f5f5f5',
    textSecondary: '#a0a0a0',
    border: '#333333',
    notification: '#ff453a',
    success: '#32d74b',
    warning: '#ffd60a',
    error: '#ff453a',
  },
  highContrast: {
    primary: '#ffff00',
    secondary: '#00ff00',
    background: '#000000',
    card: '#121212',
    text: '#ffffff',
    textSecondary: '#cccccc',
    border: '#ffffff',
    notification: '#ff0000',
    success: '#00ff00',
    warning: '#ffff00',
    error: '#ff0000',
  },
};

// Tipo para cores personalizadas
type CustomColors = {
  primary?: string;
  secondary?: string;
  textSecondary?: string;
};

// Interface do contexto
interface ThemeContextProps {
  theme: ThemeType;
  colors: ThemeColors;
  setTheme: (theme: ThemeType) => void;
  customizeColors: (colors: CustomColors) => void;
  resetCustomColors: () => void;
}

// Criação do contexto
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// Provider do tema
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>('light');
  const [customColors, setCustomColors] = useState<CustomColors>({});
  const [colors, setColors] = useState<ThemeColors>(themes.light);

  // Carregar tema salvo ao iniciar
  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('@theme_type');
        const savedColors = await AsyncStorage.getItem('@custom_colors');
        
        if (savedTheme) {
          setThemeState(savedTheme as ThemeType);
        }
        
        if (savedColors) {
          setCustomColors(JSON.parse(savedColors));
        }
      } catch (error) {
        console.error('Erro ao carregar tema:', error);
      }
    };
    
    loadSavedTheme();
  }, []);

  // Atualizar cores quando o tema ou cores personalizadas mudam
  useEffect(() => {
    const baseColors = themes[theme];
    setColors({
      ...baseColors,
      ...customColors,
    });
    
    // Salvar tema atual
    AsyncStorage.setItem('@theme_type', theme);
  }, [theme, customColors]);

 // Função para mudar o tema
const setTheme = (newTheme: ThemeType) => {
    console.log('Alterando tema para:', newTheme);
    setThemeState(newTheme);
    // Forçar atualização imediata do AsyncStorage
    AsyncStorage.setItem('@theme_type', newTheme);
  };

  // Função para personalizar cores
  const customizeColors = (newColors: CustomColors) => {
    setCustomColors(prev => {
      const updated = { ...prev, ...newColors };
      AsyncStorage.setItem('@custom_colors', JSON.stringify(updated));
      return updated;
    });
  };

  // Função para resetar cores personalizadas
  const resetCustomColors = () => {
    setCustomColors({});
    AsyncStorage.removeItem('@custom_colors');
  };

  return (
    <ThemeContext.Provider value={{ theme, colors, setTheme, customizeColors, resetCustomColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook para usar o tema
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};