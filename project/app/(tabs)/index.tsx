import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

const veiculosMock = [
  {
    id: '1',
    placa: 'ABC1234',
    marca: 'Volvo',
    modelo: 'FH 460',
    ano: 2022,
    cor: 'Branco',
    motorista: 'João Silva',
    capacidadeCarga: '45 toneladas',
    tipoCacamba: 'Graneleira',
  },
  {
    id: '2',
    placa: 'DEF5678',
    marca: 'Scania',
    modelo: 'R450',
    ano: 2021,
    cor: 'Vermelho',
    motorista: 'Pedro Santos',
    capacidadeCarga: '40 toneladas',
    tipoCacamba: 'Basculante',
  },
];

export default function VeiculosScreen() {
  const [veiculos] = useState(veiculosMock);
  const { colors } = useTheme();

  const renderVeiculo = ({ item }: { item: any }) => (
    <TouchableOpacity style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.placa, { color: colors.primary }]}>{item.placa}</Text>
      <Text style={[styles.info, { color: colors.text }]}>{item.marca} {item.modelo}</Text>
      <Text style={[styles.info, { color: colors.text }]}>Ano: {item.ano}</Text>
      <Text style={[styles.info, { color: colors.text }]}>Cor: {item.cor}</Text>
      <Text style={[styles.info, { color: colors.text }]}>Motorista: {item.motorista}</Text>
      <Text style={[styles.info, { color: colors.text }]}>Capacidade: {item.capacidadeCarga}</Text>
      <Text style={[styles.info, { color: colors.text }]}>Caçamba: {item.tipoCacamba}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={veiculos}
        renderItem={renderVeiculo}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]}>
        <Text style={styles.addButtonText}>+ Adicionar Veículo</Text>
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
  placa: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0066cc',
  },
  info: {
    fontSize: 16,
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