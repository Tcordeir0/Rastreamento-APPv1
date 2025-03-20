import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { FileText, TrendingUp, Calendar, Clock } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

export default function RelatoriosScreen() {
  const [selectedPeriod] = useState('Mensal');
  const { colors, theme } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>Relatórios</Text>
        <View style={[styles.periodSelector, { backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f0f0f0' }]}>
          <TouchableOpacity 
            style={[styles.periodButton, selectedPeriod === 'Mensal' && styles.periodButtonActive, 
              { 
                borderColor: colors.border,
                backgroundColor: selectedPeriod === 'Mensal' ? colors.primary : 'transparent'
              }
            ]}>
            <Text style={[styles.periodButtonText, selectedPeriod === 'Mensal' && styles.periodButtonTextActive, 
              { 
                color: selectedPeriod === 'Mensal' ? '#ffffff' : colors.text 
              }
            ]}>
              Mensal
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.periodButton, selectedPeriod === 'Semanal' && styles.periodButtonActive, 
              { 
                borderColor: colors.border,
                backgroundColor: selectedPeriod === 'Semanal' ? colors.primary : 'transparent'
              }
            ]}>
            <Text style={[styles.periodButtonText, selectedPeriod === 'Semanal' && styles.periodButtonTextActive, 
              { 
                color: selectedPeriod === 'Semanal' ? '#ffffff' : colors.text 
              }
            ]}>
              Semanal
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Clock size={24} color={colors.primary} />
          <Text style={[styles.statValue, { color: colors.text }]}>2.450</Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>Horas em operação</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TrendingUp size={24} color={colors.secondary} />
          <Text style={[styles.statValue, { color: colors.text }]}>85%</Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>Taxa de utilização</Text>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Relatórios Disponíveis</Text>
        <TouchableOpacity style={[styles.reportCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <FileText size={24} color={colors.primary} />
          <View style={styles.reportInfo}>
            <Text style={[styles.reportTitle, { color: colors.text }]}>Uso de Veículos</Text>
            <Text style={[styles.reportDescription, { color: colors.text }]}>Detalhes de utilização por veículo</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.reportCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Calendar size={24} color={colors.primary} />
          <View style={styles.reportInfo}>
            <Text style={[styles.reportTitle, { color: colors.text }]}>Agenda de Manutenção</Text>
            <Text style={[styles.reportDescription, { color: colors.text }]}>Próximas manutenções programadas</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  periodButtonActive: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  periodButtonText: {
    fontWeight: '500',
  },
  periodButtonTextActive: {
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reportInfo: {
    marginLeft: 16,
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  reportDescription: {
    fontSize: 14,
    color: '#666',
  },
});