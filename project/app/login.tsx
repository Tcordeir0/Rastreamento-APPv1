import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, Truck, ArrowLeft } from 'lucide-react-native';
import { api } from '@/services/api';
import { colors } from '@/constants/colors';

export default function LoginScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { login, resetOnboarding } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showEmailTypeWarning, setShowEmailTypeWarning] = useState(false);
  
  const validateAdminEmail = (email: string) => {
    return email.includes('@borgnotransportes.com.br');
  };
  
  const handleLogin = async () => {
    setError('');
    setShowEmailTypeWarning(false);

    if (!email || !password) {
      setError('Preencha todos os campos');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError('Email inválido');
      return;
    }

    try {
      setLoading(true);

      // Chamar API para autenticar o usuário
      const response = await api.login(email, password);

      // Verificar se o usuário é admin mas não está usando email corporativo
      if (response.userType === 'admin' && !validateAdminEmail(email)) {
        setShowEmailTypeWarning(true);
        setLoading(false);
        return;
      }

      // Login com token e tipo de usuário retornado pela API
      await login(response.token, response.userType);

      // Redirecionar para o app principal
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha na autenticação. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleResetOnboarding = async () => {
    try {
      // Usar a função de resetOnboarding do AuthContext
      await resetOnboarding();

      // Redirecionar para o início do fluxo de onboarding
      router.replace('/onboarding/index');
    } catch (error) {
      console.error('Erro ao reiniciar onboarding:', error);
    }
  };
  
  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/onboarding/profile-selection');
    }
  };

  const goToDriverSignup = () => {
    setShowEmailTypeWarning(false);
    router.push('/onboarding/driver-signup');
  };
  
  const closeWarning = () => {
    setShowEmailTypeWarning(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={20}
      >
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors.background }]}
          onPress={handleGoBack}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        
        {showEmailTypeWarning && (
          <View style={[styles.modalBackground, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
            <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
              <Text style={[styles.modalText, { color: colors.text }]}>
                Ops, parece que você está no lugar errado, deseja ir para registro de motoristas?
              </Text>
              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: colors.primary }]}
                  onPress={goToDriverSignup}
                >
                  <Text style={styles.modalButtonText}>Sim</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: colors.border }]}
                  onPress={closeWarning}
                >
                  <Text style={styles.modalButtonText}>Não</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={[styles.logoContainer, { backgroundColor: colors.primary + '20' }]}>
              <Truck size={40} color={colors.primary} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Rastreamento App</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Entre na sua conta</Text>
          </View>
          
          {error ? (
            <View style={[styles.errorContainer, { backgroundColor: colors.error + '20' }]}>
              <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
            </View>
          ) : null}
          
          <View style={styles.form}>
            <View style={[styles.inputContainer, { borderColor: colors.border }]}>
              <Mail size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Email"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={[styles.inputContainer, { borderColor: colors.border }]}>
              <Lock size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Senha"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.forgotPasswordLink}
              onPress={() => router.push('/esqueci-senha')}
            >
              <Text style={[styles.linkText, { color: colors.primary }]}>
                Esqueceu sua senha?
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Não tem uma conta?
            </Text>
            
            <View style={styles.signupOptions}>
              <TouchableOpacity
                style={[styles.optionButton, { borderColor: colors.primary }]}
                onPress={() => router.push('/onboarding/admin-signup')}
              >
                <Text style={[styles.optionButtonText, { color: colors.primary }]}>
                  Cadastrar como Administrador
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.optionButton, { borderColor: colors.primary }]}
                onPress={() => router.push('/onboarding/driver-signup')}
              >
                <Text style={[styles.optionButtonText, { color: colors.primary }]}>
                  Cadastrar como Motorista
                </Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={[styles.resetLink, { borderTopColor: colors.border }]}
              onPress={handleResetOnboarding}
            >
              <Text style={[styles.resetLinkText, { color: colors.textSecondary }]}>
                Reiniciar tutorial de introdução
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    gap: 16,
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    paddingLeft: 12,
    fontSize: 16,
  },
  button: {
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPasswordLink: {
    alignItems: 'center',
    marginTop: 16,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    marginTop: 20,
  },
  footerText: {
    textAlign: 'center',
    marginBottom: 16,
  },
  signupOptions: {
    gap: 10,
  },
  optionButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  optionButtonText: {
    fontWeight: '500',
  },
  resetLink: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  resetLinkText: {
    fontSize: 14,
  },
  errorContainer: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 14,
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 9999,
    padding: 10,
    borderRadius: 20,
    backgroundColor: colors.background,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
