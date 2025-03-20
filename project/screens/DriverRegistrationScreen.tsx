import React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { goApi } from '../services/api';

const DriverRegistrationScreen = () => {
  const handleRegister = async () => {
    const driverData = {
      id: 'driver1',
      name: 'João Silva',
      vehicle: 'Caminhão Scania',
      license: '123456789',
      latitude: -23.550520,
      longitude: -46.633308
    };
    
    try {
      const response = await goApi.registerDriver(driverData);
      console.log('Motorista cadastrado:', response);
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Motorista</Text>
      <Button title="Cadastrar Motorista" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default DriverRegistrationScreen;