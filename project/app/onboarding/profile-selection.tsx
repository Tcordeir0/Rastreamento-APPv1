import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Truck, Briefcase } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import { KeyboardAvoidingView, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export default function ProfileSelectionScreen() {
  const { colors, theme } = useTheme();
  
  // Animações
  const titleOpacity = useSharedValue(0);
  const cardsOpacity = useSharedValue(0);
  
  const titleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: titleOpacity.value,
      transform: [{ translateY: (1 - titleOpacity.value) * 20 }],
    };
  });
  
  const cardsAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: cardsOpacity.value,
      transform: [{ translateY: (1 - cardsOpacity.value) * 30 }],
    };
  });
  
  // Iniciar animações quando o componente montar
  useEffect(() => {
    titleOpacity.value = withTiming(1, { duration: 800 });
    
    // Usando setTimeout para o efeito de delay
    const animationTimeout = setTimeout(() => {
      cardsOpacity.value = withTiming(1, { duration: 800 });
    }, 400);
    
    return () => clearTimeout(animationTimeout);
  }, []);
  
  const handleSelectProfile = async (profile: 'admin' | 'driver') => {
    // Salvar o perfil selecionado
    await AsyncStorage.setItem('@RastreioApp:userProfile', profile);
    
    // Navegar para a tela de cadastro específica conforme o perfil
    if (profile === 'admin') {
      router.replace('/onboarding/admin-signup');
    } else {
      router.replace('/onboarding/driver-signup');
    }
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <View style={[styles(colors).container, { backgroundColor: colors.background }]}>
        <Animated.View style={titleAnimatedStyle}>
          <Text style={[styles(colors).title, { color: colors.text }]}>Quem é você?</Text>
          <Text style={[styles(colors).subtitle, { color: colors.text }]}>
            Selecione o seu perfil para continuar
          </Text>
        </Animated.View>
        
        <Animated.View style={[styles(colors).cardsContainer, cardsAnimatedStyle]}>
          <TouchableOpacity 
            style={[styles(colors).profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => handleSelectProfile('admin')}
          >
            <View style={[styles(colors).iconContainer, { backgroundColor: colors.primary + '20' }]}>
              <Briefcase size={48} color={colors.primary} />
            </View>
            <Text style={[styles(colors).profileTitle, { color: colors.text }]}>
              Administrador
            </Text>
            <Text style={[styles(colors).profileDescription, { color: colors.text }]}>
              Gerencie sua frota, motoristas e tenha acesso a todos os relatórios
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles(colors).profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => handleSelectProfile('driver')}
          >
            <View style={[styles(colors).iconContainer, { backgroundColor: colors.primary + '20' }]}>
              <Truck size={48} color={colors.primary} />
            </View>
            <Text style={[styles(colors).profileTitle, { color: colors.text }]}>
              Motorista
            </Text>
            <Text style={[styles(colors).profileDescription, { color: colors.text }]}>
              Veja suas rotas, receba notificações de viagens e compartilhe sua localização
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles(colors).loginButton}
            onPress={() => router.replace('/login')}
          >
            <Text style={styles(colors).loginButtonText}>Já tenho uma conta</Text>
          </TouchableOpacity>
        </Animated.View>
        
        <TouchableOpacity 
          style={styles(colors).backButton}
          onPress={() => router.back()}
        >
          <Text style={[styles(colors).backButtonText, { color: colors.primary }]}>
            Voltar
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

interface Styles {
  container: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  cardsContainer: ViewStyle;
  profileCard: ViewStyle;
  iconContainer: ViewStyle;
  profileTitle: TextStyle;
  profileDescription: TextStyle;
  backButton: ViewStyle;
  backButtonText: TextStyle;
  loginButton: ViewStyle;
  loginButtonText: TextStyle;
}

const styles = (colors: any): Styles => StyleSheet.create<Styles>({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: colors.textSecondary,
  },
  cardsContainer: {
    gap: 20,
    marginTop: 20,
  },
  profileCard: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: colors.background,
  },
  iconContainer: {
    padding: 15,
    borderRadius: 50,
    backgroundColor: colors.primary + '20',
    alignSelf: 'center' as const,
    marginBottom: 15,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: colors.text,
  },
  profileDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 1,
    padding: 10,
    borderRadius: 20,
    backgroundColor: colors.background,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.text,
  },
  loginButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginTop: 20,
  },
  loginButtonText: {
    fontSize: 16,
    color: colors.background,
    textAlign: 'center',
  },
});
