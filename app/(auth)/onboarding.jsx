import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; // Replace lucide-react
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  const router = useRouter();

  const slides = [
    {
      title: "All Your Learning Options in One Place",
      description: "Search, compare, and read reviews for thousands of courses, tutors, and certifications from top institutions.",
      image: require('@/assets/images/onboarding-image-1.jpg'), // Replace with local asset or use { uri: 'URL' }
      buttonText: "Next",
      bgColor: ['#60a5fa', '#3b82f6'], // Blue gradient approximation
    },
    {
      title: "Find the Skills to Shape Your Future",
      description: "From coding bootcamps to public speaking workshops, discover the perfect course to help you achieve your career goals.",
      image: require('@/assets/images/onboarding-image-2.jpg'), // Replace with local asset
      buttonText: "Next",
      bgColor: ['#a78bfa', '#8b5cf6'], // Purple gradient approximation
    },
    {
      title: "The Perfect Path for Your Child",
      description: "Easily find, compare, and enroll your child in trusted classes and tuitions. Secure their future with the best education.",
      image: require('@/assets/images/onboarding-image-3.jpg'), // Replace with local asset
      buttonText: "Get Started",
      bgColor: ['#34d399', '#10b981'], // Emerald gradient approximation
    },
  ];

  const handleNext = async () => {
    if (activeSlide < slides.length - 1) {
      scrollViewRef.current.scrollTo({ x: width * (activeSlide + 1), animated: true });
    } else {
      await AsyncStorage.setItem('@onboarding_complete', 'true');
      router.replace('/(auth)/login');
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem('@onboarding_complete', 'true');
    router.replace('/(auth)/login');
  };

  const handleDotPress = (index) => {
    scrollViewRef.current.scrollTo({ x: width * index, animated: true });
    setActiveSlide(index);
  };

  useEffect(() => {
    const unsubscribe = scrollX.addListener(({ value }) => {
      const index = Math.round(value / width);
      if (index !== activeSlide) {
        setActiveSlide(index);
      }
    });
    return () => scrollX.removeListener(unsubscribe);
  }, [activeSlide, scrollX]);

  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {slides.map((_, index) => {
          const opacity = activeSlide === index ? 1 : 0.3;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleDotPress(index)}
              style={styles.dotContainer}
            >
              <View
                style={[
                  styles.dot,
                  { opacity, backgroundColor: activeSlide === index ? '#1D4ED8' : '#d1d5db' },
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
          scrollEventThrottle={16}
        >
          {slides.map((slide, index) => (
            <View key={index} style={styles.slide}>
              <View
                style={[
                  styles.background,
                  { backgroundColor: slide.bgColor[0] }, // Using first color as a fallback (true gradient requires linear-gradient)
                ]}
              />
              <View style={styles.content}>
                <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                  <Text style={styles.skipText}>Skip</Text>
                  <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={styles.imageContainer}>
                  <Image
                    source={slide.image} // Use require for local or { uri: slide.image } for network
                    style={styles.image}
                    resizeMode="cover"
                  />
                  <View style={styles.imageOverlay} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{slide.title}</Text>
                  <Text style={styles.description}>{slide.description}</Text>
                  {renderPagination()}
                  <TouchableOpacity style={styles.button} onPress={handleNext}>
                    <Text style={styles.buttonText}>{slide.buttonText}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width,
    height,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 5,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 8,
  },
  image: {
    width: 320,
    height: 384,
    borderRadius: 48,
    overflow: 'hidden',
    borderWidth: 8,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 48,
  },
  textContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dotContainer: {
    marginHorizontal: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  button: {
    backgroundColor: '#1D4ED8',
    borderRadius: 12,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;