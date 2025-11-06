import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  ScrollView,
  StatusBar,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router'; // ✅ navigation hook

const { width, height } = Dimensions.get('window');

const slides = [
  {
    title: 'All Your Learning Options in One Place',
    subtitle:
      'Search, compare, and read reviews for thousands of courses, tuitions, and certifications from top institutions.',
    image: require('../../assets/images/onboarding-image-1.jpg'),
  },
  {
    title: 'The Perfect Path for Your Child',
    subtitle:
      'Easily find, compare, and enroll your child in trusted classes and tuitions. Secure their future with the best education.',
    image: require('../../assets/images/onboarding-image-2.jpg'),
  },
  {
    title: 'Find the Skills to Shape Your Future',
    subtitle:
      'From coding bootcamps to public speaking workshops, discover the perfect course to help you achieve your career goals.',
    image: require('../../assets/images/onboarding-image-3.jpg'),
  },
];

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);
  const router = useRouter();

  const handleNext = () => {
    if (index < slides.length - 1) {
      scrollRef.current?.scrollTo({ x: width * (index + 1), animated: true });
    } else {
      router.push('/(auth)/login'); // ✅ navigate to login
    }
  };

  const handleSkip = () => {
    router.push('/(auth)/login'); // ✅ navigate to login directly
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#A8B5FF" />

      {/* Gradient Background */}
      <LinearGradient
        colors={['#A8B5FF', '#F5F5FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <View style={styles.scrollContainer}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          onMomentumScrollEnd={(e) => {
            setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
          }}
          scrollEventThrottle={16}
        >
          {slides.map((slide, i) => (
            <View key={i} style={styles.slide}>
              <ImageBackground
                source={slide.image}
                style={styles.imageBackground}
                imageStyle={{ resizeMode: 'cover' }}
              />
            </View>
          ))}
        </ScrollView>

        {/* Bottom Content Card */}
        <View style={styles.contentCard}>
          <Text style={styles.title}>{slides[index].title}</Text>
          <Text style={styles.subtitle}>{slides[index].subtitle}</Text>

          {/* Pagination Dots */}
          <View style={styles.dotsContainer}>
            {slides.map((_, dotIndex) => (
              <View
                key={dotIndex}
                style={[
                  styles.dot,
                  index === dotIndex && styles.activeDot,
                  { transform: [{ scale: index === dotIndex ? 1.2 : 1 }] },
                ]}
              />
            ))}
          </View>

          {/* Actions */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity onPress={handleSkip}>
              <Text style={styles.skipText}>SKIP</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
              <Text style={styles.arrowText}>→</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ──────────────────────────────
   ✅ STYLES
──────────────────────────────── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5FF',
  },
  scrollContainer: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    height: height * 0.65,
  },
  slide: {
    width,
    height: height * 0.65,
  },
  imageBackground: {
    flex: 1,
    width: '100%',
  },
  contentCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 12,
  },
  title: {
    fontFamily: 'Montserrat',
    fontWeight: '600',
    fontSize: 32,
    lineHeight: 32,
    color: '#1C1C1E',
    textAlign: 'center',
    letterSpacing: 0,
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '500',
    color: '#A4A4A4',
    textAlign: 'center',
    maxWidth: 330,
    alignSelf: 'center',
    marginBottom: 32,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E5E7',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#007AFF',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 8,
  },
  skipText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: '500',
    color: '#060B13',
    letterSpacing: 0,
  },
  nextButton: {
    width: 56,
    height: 56,
    backgroundColor: '#007AFF',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
  },
  arrowText: {
    fontSize: 24,
    color: '#FFFFFF',
    marginTop: Platform.OS === 'android' ? -2 : 0,
  },
});