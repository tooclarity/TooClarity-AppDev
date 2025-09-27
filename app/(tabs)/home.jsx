import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  return (
    <ImageBackground
      source={{ uri: 'https://example.com/home-background.jpg' }}
      style={styles.background}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.5)', 'transparent']}
        style={styles.overlay}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Welcome Home!</Text>
          <Text style={styles.subtitle}>Start your journey today</Text>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});