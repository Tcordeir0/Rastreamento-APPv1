import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Animated, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Truck, User, Mail, Lock, Phone, ArrowLeft } from 'lucide-react-native';
import { registerDriver } from '../services/driver-api';
import { useTheme } from '@/context/ThemeContext';

interface Unit {
  id: string;
  name: string;
}

export default function DriverSignupScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const { colors } = useTheme();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [license, setLicense] = useState('');

  const [keyboardHeight] = useState(new Animated.Value(0));

  const keyboardWillShow = (event: any) => {
    Animated.timing(keyboardHeight, {
      duration: 250,
      toValue: event.endCoordinates.height,
      useNativeDriver: false,
    }).start();
  };

  const keyboardWillHide = () => {
    Animated.timing(keyboardHeight, {
      duration: 250,
      toValue: 0,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardWillShow', keyboardWillShow);
    const hideSubscription = Keyboard.addListener('keyboardWillHide', keyboardWillHide);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleSignUp = async () => {
    setError('');
    setErrorMessage('');
    setShowErrorPopup(false);

    // Validação básica
    if (!name || !email || !password || !confirmPassword || !phone || !license) {
      setErrorMessage('Preencha todos os campos');
      setShowErrorPopup(true);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem');
      setShowErrorPopup(true);
      return;
    }

    if (password.length < 6) {
      setErrorMessage('A senha deve ter pelo menos 6 caracteres');
      setShowErrorPopup(true);
      return;
    }

    try {
      setLoading(true);

      // Chamar API para registrar o motorista
      const response = await registerDriver({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
        phone: phone.trim(),
        license: license.trim(),
        unit: 'default' // Valor temporário
      });

      // Login automático após cadastro bem-sucedido
      await login(response.token, 'driver');

      // Redirecionar para o app principal
      router.replace('/(tabs)');
    } catch (err: any) {
      console.error('Erro no registro:', err);
      setErrorMessage(err.message || 'Ocorreu um erro durante o cadastro');
      setShowErrorPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/onboarding/profile-selection');
    }
  };

  const styles = (colors: any) => StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      justifyContent: 'center',
    },
    contentContainer: {
      padding: 20,
      gap: 16,
    },
    backButton: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? 50 : 40,
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
    iconContainer: {
      alignItems: 'center',
      marginTop: 50,
      marginBottom: 20,
    },
    iconBackground: {
      padding: 20,
      borderRadius: 50,
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
      color: colors.text,
    },
    errorContainer: {
      padding: 16,
      borderRadius: 8,
      marginBottom: 16,
      backgroundColor: colors.errorBackground,
      borderWidth: 1,
      borderColor: colors.errorBorder,
    },
    errorText: {
      fontSize: 14,
      textAlign: 'center',
      color: colors.errorText,
      lineHeight: 20,
    },
    form: {
      marginBottom: 20,
    },
    formSection: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 12,
      color: colors.text,
    },
    inputGroup: {
      gap: 12,
      marginBottom: 16,
    },
    requiredIndicator: {
      color: colors.error,
    },
    inputLabel: {
      fontSize: 14,
      marginBottom: 4,
      color: colors.text,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      gap: 8,
      borderColor: colors.border,
    },
    input: {
      flex: 1,
      marginLeft: 10,
      fontSize: 16,
      color: colors.text,
    },
    button: {
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    buttonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    modalBackground: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
      backgroundColor: colors.background,
      borderRadius: 10,
      padding: 20,
      width: '80%',
    },
    modalText: {
      fontSize: 16,
      color: colors.text,
      marginBottom: 10,
    },
    modalButton: {
      backgroundColor: colors.primary,
      padding: 10,
      borderRadius: 10,
      alignItems: 'center',
    },
    modalButtonText: {
      fontSize: 16,
      color: colors.background,
    },
    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles(colors).container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles(colors).contentContainer}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
        >
          <View style={styles(colors).iconContainer}>
            <View style={[styles(colors).iconBackground, { backgroundColor: colors.primary }]}>
              <Truck size={32} color={colors.background} />
            </View>
          </View>
          <TouchableOpacity 
            style={styles(colors).backButton}
            onPress={handleGoBack}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles(colors).title, { color: colors.text }]}>Cadastro de Motorista</Text>
          <Text style={[styles(colors).subtitle, { color: colors.text }]}>
            Crie sua conta para gerenciar suas viagens
          </Text>
          {error ? (
            <View style={styles(colors).errorContainer}>
              <Text style={styles(colors).errorText}>{error}</Text>
            </View>
          ) : null}
          <View style={styles(colors).form}>
            <View style={styles(colors).formSection}>
              <Text style={styles(colors).sectionTitle}>Informações Pessoais</Text>
              <View style={styles(colors).inputGroup}>
                <View style={styles(colors).inputContainer}>
                  <User size={20} color={colors.textSecondary} />
                  <TextInput
                    style={[styles(colors).input, { color: colors.text }]}
                    placeholder="Nome completo"
                    placeholderTextColor={colors.textSecondary}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
                <View style={styles(colors).inputContainer}>
                  <Mail size={20} color={colors.textSecondary} />
                  <TextInput
                    style={[styles(colors).input, { color: colors.text }]}
                    placeholder="Email"
                    placeholderTextColor={colors.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>
            </View>
            <View style={styles(colors).formSection}>
              <Text style={styles(colors).sectionTitle}>Senha e Segurança</Text>
              <View style={styles(colors).inputGroup}>
                <View style={styles(colors).inputContainer}>
                  <Lock size={20} color={colors.textSecondary} />
                  <TextInput
                    style={[styles(colors).input, { color: colors.text }]}
                    placeholder="Senha"
                    placeholderTextColor={colors.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>
                <View style={styles(colors).inputContainer}>
                  <Lock size={20} color={colors.textSecondary} />
                  <TextInput
                    style={[styles(colors).input, { color: colors.text }]}
                    placeholder="Confirmar senha"
                    placeholderTextColor={colors.textSecondary}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                  />
                </View>
              </View>
            </View>
            <View style={styles(colors).formSection}>
              <Text style={styles(colors).sectionTitle}>Informações de Contato</Text>
              <View style={styles(colors).inputGroup}>
                <View style={styles(colors).inputContainer}>
                  <Phone size={20} color={colors.textSecondary} />
                  <TextInput
                    style={[styles(colors).input, { color: colors.text }]}
                    placeholder="Telefone"
                    placeholderTextColor={colors.textSecondary}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>
                <View style={styles(colors).inputContainer}>
                  <Truck size={20} color={colors.textSecondary} />
                  <TextInput
                    style={[styles(colors).input, { color: colors.text }]}
                    placeholder="Número da CNH"
                    placeholderTextColor={colors.textSecondary}
                    value={license}
                    onChangeText={setLicense}
                  />
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={[styles(colors).button, { backgroundColor: colors.primary }]}
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={colors.background} />
              ) : (
                <Text style={[styles(colors).buttonText, { color: colors.background }]}>Cadastrar</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
      {showErrorPopup && (
        <Modal transparent visible={showErrorPopup} onRequestClose={() => setShowErrorPopup(false)}>
          <View style={styles(colors).modalBackground}>
            <View style={styles(colors).modalContainer}>
              <Text style={styles(colors).modalText}>{errorMessage}</Text>
              <TouchableOpacity style={styles(colors).modalButton} onPress={() => setShowErrorPopup(false)}>
                <Text style={styles(colors).modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
      {loading && (
        <View style={styles(colors).loadingOverlay}>
          <ActivityIndicator size="large" color={colors.text} />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}