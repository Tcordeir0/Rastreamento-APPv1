import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

const motoristas = [
  {
    id: '1',
    nome: 'João Silva',
    foto: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200',
    telefone: '(62) 98888-1111',
    veiculo: 'Volvo FH 460',
    placa: 'ABC1234',
    status: 'Em viagem',
  },
  {
    id: '2',
    nome: 'Pedro Santos',
    foto: 'https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?w=200',
    telefone: '(62) 98888-2222',
    veiculo: 'Scania R450',
    placa: 'DEF5678',
    status: 'Disponível',
  },
  {
    id: '3',
    nome: 'Carlos Oliveira',
    foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    telefone: '(62) 98888-3333',
    veiculo: 'Mercedes Actros',
    placa: 'GHI9012',
    status: 'Em pausa',
  },
  {
    id: '4',
    nome: 'André Souza',
    foto: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200',
    telefone: '(62) 98888-4444',
    veiculo: 'DAF XF',
    placa: 'JKL3456',
    status: 'Em viagem',
  },
];

export default function MotoristasScreen() {
  const [motoristasLista] = useState(motoristas);
  const { colors, theme } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em viagem':
        return '#2ecc71';
      case 'Disponível':
        return '#3498db';
      case 'Em pausa':
        return '#f1c40f';
      default:
        return '#95a5a6';
    }
  };

  const renderMotorista = ({ item }: { item: any }) => (
    <TouchableOpacity style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.header}>
        <Image source={{ uri: item.foto }} style={styles.foto} />
        <View style={styles.headerInfo}>
          <Text style={[styles.nome, { color: colors.text }]}>{item.nome}</Text>
          <Text style={[styles.telefone, { color: colors.text }]}>{item.telefone}</Text>
          <View style={[styles.statusContainer, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.status}>{item.status}</Text>
          </View>
        </View>
      </View>
      <View style={styles.veiculoInfo}>
        <Text style={[styles.info, { color: colors.text }]}>Veículo: {item.veiculo}</Text>
        <Text style={[styles.info, { color: colors.text }]}>Placa: {item.placa}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={motoristasLista}
        renderItem={renderMotorista}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]}>
        <Text style={styles.addButtonText}>+ Adicionar Motorista</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  foto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  telefone: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  status: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  veiculoInfo: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    marginTop: 8,
  },
  info: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});