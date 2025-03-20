import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, Image } from 'react-native';
import { useState, useRef } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/context/ThemeContext';
import { Truck, Map, Users, FileText, Settings } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Definição dos slides do tutorial
const tutorialSlides = [
  {
    id: '1',
    title: 'Veículos',
    description: 'Acompanhe e gerencie toda a sua frota em um só lugar.',
    icon: (color) => <Truck size={80} color={color} />,
  },
  {
    id: '2',
    title: 'Mapa',
    description: 'Visualize a localização dos seus veículos em tempo real.',
    icon: (color) => <Map size={80} color={color} />,
  },
  {
    id: '3',
    title: 'Motoristas',
    description: 'Gerencie e monitore seus motoristas de forma eficiente.',
    icon: (color) => <Users size={80} color={color} />,
  },
  {
    id: '4',
    title: 'Relatórios',
    description: 'Acesse relatórios detalhados sobre uso da frota e desempenho.',
    icon: (color) => <FileText size={80} color={color} />,
  },
  {
    id: '5',
    title: 'Configurações',
    description: 'Personalize o aplicativo com temas, notificações e preferências.',
    icon: (color) => <Settings size={80} color={color} />,
  },
];

export default function TutorialScreen() {
  const { colors, theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  
  const renderItem = ({ item }) => {
    return (
      <View style={[styles.slide, { backgroundColor: colors.background, width }]}>
        <View style={styles.iconContainer}>
          {item.icon(colors.primary)}
        </View>
        <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.description, { color: colors.text }]}>{item.description}</Text>
      </View>
    );
  };
  
  const handleNext = () => {
    if (currentIndex < tutorialSlides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  const handleBack = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  const handleFinish = async () => {
    // Marcar que o onboarding foi concluído
    await AsyncStorage.setItem('@RastreioApp:onboardingCompleted', 'true');
    router.replace('/onboarding/profile-selection');
  };
  
  const handleSkip = async () => {
    // Marcar que o onboarding foi concluído
    await AsyncStorage.setItem('@RastreioApp:onboardingCompleted', 'true');
    router.replace('/onboarding/profile-selection');
  };
  
  // Indicador de ponto para páginas
  const renderDotIndicators = () => {
    return tutorialSlides.map((_, index) => {
      return (
        <View 
          key={index} 
          style={[
            styles.dot, 
            { 
              backgroundColor: 
                index === currentIndex 
                  ? colors.primary 
                  : colors.border 
            }
          ]} 
        />
      );
    });
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={[styles.skipText, { color: colors.primary }]}>Pular</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        ref={flatListRef}
        data={tutorialSlides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / width
          );
          setCurrentIndex(index);
        }}
      />
      
      <View style={styles.indicatorContainer}>
        <View style={styles.dotContainer}>
          {renderDotIndicators()}
        </View>
        
        <View style={styles.buttonContainer}>
          {currentIndex > 0 && (
            <TouchableOpacity
              style={[styles.button, styles.backButton, { borderColor: colors.border }]}
              onPress={handleBack}
            >
              <Text style={[styles.buttonText, { color: colors.text }]}>Voltar</Text>
            </TouchableOpacity>
          )}
          
          {currentIndex < tutorialSlides.length - 1 ? (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={handleNext}
            >
              <Text style={[styles.buttonText, { color: '#fff' }]}>Próximo</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={handleFinish}
            >
              <Text style={[styles.buttonText, { color: '#fff' }]}>Concluir</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 24,
  },
  indicatorContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginHorizontal: 10,
    minWidth: 120,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
