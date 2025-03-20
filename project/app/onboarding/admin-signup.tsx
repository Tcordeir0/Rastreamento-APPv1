import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Pressable, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Truck, Building2, Mail, Lock, User, Phone, ArrowLeft, CheckCircle2, MapPin } from 'lucide-react-native';
import { api } from '@/services/api';
import { Picker } from '@react-native-picker/picker';
import register from '@/services/register';

export default function AdminSignupScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const { colors } = useTheme();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [invalidEmail, setInvalidEmail] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [unidade, setUnidade] = useState<'matriz' | 'filial' | ''>('');
  const [filial, setFilial] = useState('');
  const [phone, setPhone] = useState('');

  const validateAdminEmail = (email: string) => {
    return email.includes('@borgnotransportes.com.br');
  };

  const handleSignUp = async () => {
    setError('');
    setInvalidEmail(false);

    // Validação básica
    if (!name || !email || !password || !confirmPassword || !unidade || !phone) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    // Verificar se o email contém @borgnotransportes.com.br
    if (!validateAdminEmail(email)) {
      setInvalidEmail(true);
      return;
    }

    // Se for filial, verificar se selecionou qual filial
    if (unidade === 'filial' && !filial) {
      setError('Por favor, selecione a filial');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      setLoading(true);

      // Chamar API para registrar o admin
      const response = await register(name, email, password, phone, 'admin');
      if (response.token) {
        console.log('Registro bem-sucedido!');
        Alert.alert('Sucesso', 'Registro bem-sucedido!');
        router.replace('/(tabs)');
      } else {
        setError('Ocorreu um erro durante o cadastro');
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro durante o cadastro');
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

  const redirectToDriverSignup = () => {
    setInvalidEmail(false);
    router.replace('/onboarding/driver-signup');
  };

  const closeInvalidEmailDialog = () => {
    setInvalidEmail(false);
  };

  const styles = (colors: any) => StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      padding: 20,
    },
    backButton: {
      position: 'absolute',
      top: 40,
      left: 20,
      zIndex: 1,
      padding: 10,
      borderRadius: 20,
      backgroundColor: colors.background,
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
    },
    subtitle: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 30,
    },
    errorContainer: {
      padding: 15,
      borderRadius: 10,
      marginBottom: 20,
    },
    errorText: {
      fontSize: 14,
      textAlign: 'center',
    },
    form: {
      marginBottom: 20,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 15,
      paddingVertical: 10,
      marginBottom: 15,
    },
    input: {
      flex: 1,
      marginLeft: 10,
      fontSize: 16,
    },
    picker: {
      flex: 1,
      marginLeft: 10,
      color: colors.text,
      backgroundColor: colors.background,
    },
    pickerItem: {
      color: colors.text,
      backgroundColor: colors.background,
    },
    button: {
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    buttonText: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    loginButton: {
      marginTop: 20,
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      backgroundColor: colors.primary,
    },
    loginButtonText: {
      fontSize: 16,
      color: colors.background,
    },
    modalBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
      width: '80%',
      padding: 20,
      borderRadius: 10,
      backgroundColor: colors.background,
    },
    modalText: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 20,
      color: colors.text,
    },
    modalButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    modalButton: {
      padding: 10,
      borderRadius: 5,
      width: '40%',
      alignItems: 'center',
    },
    modalButtonText: {
      fontSize: 16,
      color: colors.background,
    },
    messageStyle: {
      backgroundColor: '#ffffff',
      padding: 16,
      borderRadius: 8,
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      color: '#333333',
      textAlign: 'center',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  return (
    <ScrollView 
      style={[styles(colors).container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles(colors).contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity
        style={styles(colors).backButton}
        onPress={handleGoBack}
      >
        <ArrowLeft size={24} color={colors.text} />
      </TouchableOpacity>
      
      <View style={styles(colors).iconContainer}>
        <View style={[styles(colors).iconBackground, { backgroundColor: colors.primary + '20' }]}>
          <Building2 size={40} color={colors.primary} />
        </View>
      </View>
      
      <Text style={[styles(colors).title, { color: colors.text }]}>Cadastro de Administrador</Text>
      <Text style={[styles(colors).subtitle, { color: colors.textSecondary }]}>Crie sua conta para gerenciar sua frota</Text>
      
      {error ? (
        <View style={[styles(colors).errorContainer, { backgroundColor: colors.error + '20' }]}>
          <Text style={[styles(colors).errorText, { color: colors.error }]}>{error}</Text>
        </View>
      ) : null}
      
      {invalidEmail ? (
        <View style={[styles(colors).modalBackground, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles(colors).modalContainer, { backgroundColor: colors.background }]}>
            <Text style={styles(colors).messageStyle}>Ops, parece que você está no lugar errado, deseja ir para registro de motoristas?</Text>
            <View style={styles(colors).modalButtonsContainer}>
              <TouchableOpacity
                style={[styles(colors).modalButton, { backgroundColor: colors.primary }]}
                onPress={redirectToDriverSignup}
              >
                <Text style={styles(colors).modalButtonText}>Sim</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles(colors).modalButton, { backgroundColor: colors.border }]}
                onPress={closeInvalidEmailDialog}
              >
                <Text style={styles(colors).modalButtonText}>Não</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : null}
      
      <View style={styles(colors).form}>
        <View style={[styles(colors).inputContainer, { borderColor: colors.border }]}>
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
        
        <View style={[styles(colors).inputContainer, { borderColor: colors.border }]}>
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
        
        <View style={[styles(colors).inputContainer, { borderColor: colors.border }]}>
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
        
        <View style={[styles(colors).inputContainer, { borderColor: colors.border }]}>
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
        
        <View style={[styles(colors).inputContainer, { borderColor: colors.border }]}>
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
        
        <View style={[styles(colors).inputContainer, { borderColor: colors.border }]}>
          <MapPin size={20} color={colors.textSecondary} />
          <Picker
            selectedValue={unidade}
            onValueChange={(itemValue) => setUnidade(itemValue)}
            style={[styles(colors).picker, { color: colors.text }]}
            itemStyle={styles(colors).pickerItem}
          >
            <Picker.Item label="Selecione a unidade" value="" />
            <Picker.Item label="Matriz" value="matriz" />
            <Picker.Item label="Filial" value="filial" />
          </Picker>
        </View>
        
        {unidade === 'filial' && (
          <View style={[styles(colors).inputContainer, { borderColor: colors.border }]}>
            <MapPin size={20} color={colors.textSecondary} />
            <Picker
              selectedValue={filial}
              onValueChange={(itemValue) => setFilial(itemValue)}
              style={[styles(colors).picker, { color: colors.text }]}
              itemStyle={styles(colors).pickerItem}
            >
              <Picker.Item label="Selecione a filial" value="" />
              {FILIAIS.map((filial) => (
                <Picker.Item key={filial.cidade} label={`${filial.cidade} - ${filial.estado}`} value={filial.cidade} />
              ))}
            </Picker>
          </View>
        )}
        
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
  );
}

const FILIAIS = [
  { cidade: 'Caucaia', estado: 'CE' },
  { cidade: 'Uberaba', estado: 'MG' },
  { cidade: 'Porto Nacional', estado: 'TO' },
  { cidade: 'Dourados', estado: 'MS' },
  { cidade: 'Itajaí', estado: 'SC' },
  { cidade: 'Laranjeiras', estado: 'SE' },
  { cidade: 'Primavera do Leste', estado: 'MT' },
  { cidade: 'Imperatriz', estado: 'MA' }
];