import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useState, useEffect } from 'react';
import { Truck } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  withDelay
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const { theme, colors } = useTheme();
  const [hasShownAnimation, setHasShownAnimation] = useState(false);
  
  // Animações
  const logoScale = useSharedValue(0.5);
  const logoOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const descriptionOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);
  
  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
      transform: [{ scale: logoScale.value }],
    };
  });
  
  const titleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: titleOpacity.value,
    };
  });
  
  const descriptionAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: descriptionOpacity.value,
    };
  });
  
  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: buttonOpacity.value,
    };
  });
  
  useEffect(() => {
    if (!hasShownAnimation) {
      // Sequência de animação de entrada
      logoOpacity.value = withTiming(1, { duration: 800 });
      logoScale.value = withSequence(
        withTiming(1.2, { duration: 600 }),
        withTiming(1, { duration: 400 })
      );
      
      titleOpacity.value = withDelay(
        600,
        withTiming(1, { duration: 800 })
      );
      
      descriptionOpacity.value = withDelay(
        1200,
        withTiming(1, { duration: 800 })
      );
      
      buttonOpacity.value = withDelay(
        1800,
        withTiming(1, { duration: 600 })
      );
      
      setHasShownAnimation(true);
    }
  }, []);
  
  const handleStart = async () => {
    // Marcar que o usuário viu a tela de boas-vindas
    await AsyncStorage.setItem('@RastreioApp:onboardingStarted', 'true');
    router.replace('/onboarding/tutorial');
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <View style={[styles.logoCircle, { backgroundColor: colors.primary + '20' }]}>
          <Truck size={80} color={colors.primary} />
        </View>
      </Animated.View>
      
      <Animated.Text style={[styles.title, { color: colors.text }, titleAnimatedStyle]}>
        Bem-vindo ao Rastreamento App
      </Animated.Text>
      
      <Animated.Text style={[styles.description, { color: colors.text }, descriptionAnimatedStyle]}>
        O aplicativo completo para gerenciamento e rastreamento de sua frota
      </Animated.Text>
      
      <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleStart}
        >
          <Text style={styles.buttonText}>Começar</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logoCircle: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
