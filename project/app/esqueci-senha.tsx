import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Mail, ArrowLeft } from 'lucide-react-native';
import { api } from '@/services/api';

export default function ForgotPasswordScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async () => {
    setError('');
    setSuccess(false);
    
    if (!email) {
      setError('Digite seu email');
      return;
    }
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError('Email inválido');
      return;
    }
    
    try {
      setLoading(true);
      
      // Chamar API para enviar email de recuperação
      await api.forgotPassword(email);
      
      // Mostrar mensagem de sucesso
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Falha ao enviar email de recuperação');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ArrowLeft size={24} color={colors.text} />
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          Esqueceu sua senha?
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Digite seu email e enviaremos instruções para redefinir sua senha
        </Text>
        
        {error ? (
          <View style={[styles.messageContainer, { backgroundColor: colors.error + '20' }]}>
            <Text style={[styles.messageText, { color: colors.error }]}>{error}</Text>
          </View>
        ) : null}
        
        {success ? (
          <View style={[styles.messageContainer, { backgroundColor: colors.success + '20' }]}>
            <Text style={[styles.messageText, { color: colors.success }]}>
              Email de recuperação enviado com sucesso. Verifique sua caixa de entrada.
            </Text>
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
              editable={!loading && !success}
            />
          </View>
          
          <TouchableOpacity
            style={[
              styles.button, 
              { backgroundColor: success ? colors.success : colors.primary },
              (loading || success) && { opacity: 0.7 }
            ]}
            onPress={handleSubmit}
            disabled={loading || success}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {success ? 'Email Enviado' : 'Enviar Email'}
              </Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => router.push('/login')}
          >
            <Text style={[styles.loginLinkText, { color: colors.textSecondary }]}>
              Lembrou sua senha? <Text style={{ color: colors.primary }}>Entrar</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    margin: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
    height: 50,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  button: {
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 14,
  },
  messageContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  messageText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
