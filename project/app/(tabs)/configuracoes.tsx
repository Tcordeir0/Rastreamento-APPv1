import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { Bell, Map, Users, Palette, Eye, Sun, Moon } from 'lucide-react-native';
import { useTheme, ThemeType } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';

export default function ConfiguracoesScreen() {
  const { theme, setTheme, colors, customizeColors, resetCustomColors } = useTheme();
  const [notificacoes, setNotificacoes] = useState(true);
  const [localizacaoTempoReal, setLocalizacaoTempoReal] = useState(true);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [primaryColor, setPrimaryColor] = useState(colors.primary);
  const [secondaryColor, setSecondaryColor] = useState(colors.secondary);

  const router = useRouter();

  const handleThemeChange = (value: boolean) => {
    console.log('Switch alterado para:', value ? 'dark' : 'light');
    setTheme(value ? 'dark' : 'light');
  };

  const handleHighContrastChange = (value: boolean) => {
    if (value) {
      setTheme('highContrast');
    } else {
      setTheme(theme === 'dark' ? 'dark' : 'light');
    }
  };

  const applyCustomColors = () => {
    customizeColors({
      primary: primaryColor,
      secondary: secondaryColor,
    });
    setShowColorPicker(false);
  };

  const handleLogout = () => {
    // Lógica de logout aqui
    router.replace('/login');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferências</Text>
        
        <View style={styles.option}>
          <View style={styles.optionInfo}>
            <Bell size={24} color={colors.primary} />
            <Text style={[styles.optionText, { color: colors.text }]}>Notificações</Text>
          </View>
          <Switch
            value={notificacoes}
            onValueChange={setNotificacoes}
            trackColor={{ false: '#767577', true: colors.primary }}
            thumbColor={notificacoes ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.option}>
          <View style={styles.optionInfo}>
            <Map size={24} color={colors.primary} />
            <Text style={[styles.optionText, { color: colors.text }]}>Localização em tempo real</Text>
          </View>
          <Switch
            value={localizacaoTempoReal}
            onValueChange={setLocalizacaoTempoReal}
            trackColor={{ false: '#767577', true: colors.primary }}
            thumbColor={localizacaoTempoReal ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.option}>
          <View style={styles.optionInfo}>
            {(theme === 'dark' || theme === 'highContrast') ? 
              <Moon size={24} color={colors.primary} /> : 
              <Sun size={24} color={colors.primary} />
            }
            <Text style={[styles.optionText, { color: colors.text }]}>Modo escuro</Text>
          </View>
          <Switch
            value={theme === 'dark' || theme === 'highContrast'}
            onValueChange={handleThemeChange}
            trackColor={{ false: '#767577', true: colors.primary }}
            thumbColor={(theme === 'dark' || theme === 'highContrast') ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.option}>
          <View style={styles.optionInfo}>
            <Eye size={24} color={colors.primary} />
            <Text style={[styles.optionText, { color: colors.text }]}>Contraste alto (para dirigir)</Text>
          </View>
          <Switch
            value={theme === 'highContrast'}
            onValueChange={handleHighContrastChange}
            trackColor={{ false: '#767577', true: colors.primary }}
            thumbColor={theme === 'highContrast' ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Personalização</Text>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => setShowColorPicker(!showColorPicker)}
        >
          <Palette size={24} color={colors.primary} />
          <Text style={[styles.buttonText, { color: colors.text }]}>Personalizar Cores</Text>
        </TouchableOpacity>

        {showColorPicker && (
          <View style={styles.colorPickerContainer}>
            <View style={styles.colorInputContainer}>
              <Text style={[styles.colorLabel, { color: colors.text }]}>Cor Principal:</Text>
              <TextInput
                style={[styles.colorInput, { borderColor: colors.border, color: colors.text }]}
                value={primaryColor}
                onChangeText={setPrimaryColor}
                placeholder="#0066cc"
                placeholderTextColor="#999"
              />
              <View style={[styles.colorPreview, { backgroundColor: primaryColor }]} />
            </View>
            
            <View style={styles.colorInputContainer}>
              <Text style={[styles.colorLabel, { color: colors.text }]}>Cor Secundária:</Text>
              <TextInput
                style={[styles.colorInput, { borderColor: colors.border, color: colors.text }]}
                value={secondaryColor}
                onChangeText={setSecondaryColor}
                placeholder="#2ecc71"
                placeholderTextColor="#999"
              />
              <View style={[styles.colorPreview, { backgroundColor: secondaryColor }]} />
            </View>
            
            <View style={styles.colorButtonsContainer}>
              <TouchableOpacity 
                style={[styles.colorButton, { backgroundColor: colors.primary }]}
                onPress={applyCustomColors}
              >
                <Text style={styles.colorButtonText}>Aplicar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.colorButton, { backgroundColor: colors.error }]}
                onPress={resetCustomColors}
              >
                <Text style={styles.colorButtonText}>Resetar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Conta</Text>
        <TouchableOpacity style={styles.button}>
          <Users size={24} color={colors.primary} />
          <Text style={[styles.buttonText, { color: colors.text }]}>Gerenciar Permissões</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.version, { color: colors.text }]}>Versão 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  buttonText: {
    fontSize: 16,
    marginLeft: 12,
  },
  logoutButton: {
    justifyContent: 'center',
    marginTop: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#dc3545',
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    fontSize: 14,
  },
  colorPickerContainer: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  colorInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  colorLabel: {
    width: 120,
    fontSize: 14,
  },
  colorInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  colorPreview: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 8,
  },
  colorButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  colorButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    minWidth: 100,
    alignItems: 'center',
  },
  colorButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});