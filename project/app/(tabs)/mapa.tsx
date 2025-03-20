import { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useTheme } from '@/context/ThemeContext';
import { Truck } from 'lucide-react-native';

const motoristas = [
  {
    id: '1',
    nome: 'João Silva',
    latitude: -16.6799,
    longitude: -49.2556,
    veiculo: 'Volvo FH 460',
    placa: 'ABC1234',
  },
  {
    id: '2',
    nome: 'Pedro Santos',
    latitude: -16.7033,
    longitude: -49.2689,
    veiculo: 'Scania R450',
    placa: 'DEF5678',
  },
  {
    id: '3',
    nome: 'Carlos Oliveira',
    latitude: -16.6932,
    longitude: -49.2622,
    veiculo: 'Mercedes Actros',
    placa: 'GHI9012',
  },
  {
    id: '4',
    nome: 'André Souza',
    latitude: -16.6866,
    longitude: -49.2753,
    veiculo: 'DAF XF',
    placa: 'JKL3456',
  },
];

export default function MapaScreen() {
  const { colors, theme } = useTheme();
  const [region, setRegion] = useState({
    latitude: -16.6799,
    longitude: -49.2556,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <MapView
        style={styles.map}
        customMapStyle={theme === 'dark' ? [
          {"elementType": "geometry", "stylers": [{"color": "#242f3e"}]},
          {"elementType": "labels.text.fill", "stylers": [{"color": "#746855"}]},
          {"elementType": "labels.text.stroke", "stylers": [{"color": "#242f3e"}]},
          {"featureType": "road", "elementType": "geometry", "stylers": [{"color": "#38414e"}]},
          {"featureType": "road", "elementType": "geometry.stroke", "stylers": [{"color": "#212a37"}]},
          {"featureType": "water", "elementType": "geometry", "stylers": [{"color": "#17263c"}]}
        ] : []}
        initialRegion={region}
        onRegionChangeComplete={setRegion}>
        {motoristas.map((motorista) => (
          <Marker
            key={motorista.id}
            coordinate={{
              latitude: motorista.latitude,
              longitude: motorista.longitude,
            }}
            title={motorista.nome}
            description={`${motorista.veiculo} - ${motorista.placa}`}
            tracksViewChanges={false}>
            <View style={[styles.markerContainer, { backgroundColor: theme === 'dark' ? '#303030' : '#fff' }]}>
              <Truck 
                size={24} 
                color={colors.primary} 
              />
            </View>
            <Callout tooltip={false} />
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  markerContainer: {
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ddd'
  },
});