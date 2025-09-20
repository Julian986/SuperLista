import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface SimpleConfettiProps {
  visible: boolean;
  onComplete: () => void;
}

export const SimpleConfetti: React.FC<SimpleConfettiProps> = ({
  visible,
  onComplete,
}) => {
  const mainAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      startConfetti();
    }
  }, [visible]);

  const startConfetti = () => {
    mainAnim.setValue(0);
    
    // Todas las animaciones empiezan simultáneamente
    Animated.timing(mainAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    // Completar después de 1.2 segundos
    setTimeout(() => {
      onComplete();
    }, 1200);
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      {/* Explosión central */}
      <Animated.View
        style={[
          styles.explosion,
          {
            transform: [
              {
                scale: mainAnim.interpolate({
                  inputRange: [0, 0.2, 1],
                  outputRange: [0, 3, 0],
                }),
              },
            ],
            opacity: mainAnim.interpolate({
              inputRange: [0, 0.1, 0.3, 1],
              outputRange: [0, 1, 0.8, 0],
            }),
          },
        ]}
      />

      {/* Confetti principal - papelitos verdes */}
      {[...Array(25)].map((_, index) => (
        <Animated.View
          key={`confetti-${index}`}
          style={[
            styles.confetti,
            {
              left: Math.random() * width,
              backgroundColor: '#4CAF50',
              transform: [
                {
                  translateY: mainAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-40, height + 100],
                  }),
                },
                {
                  translateX: mainAnim.interpolate({
                    inputRange: [0, 0.3, 0.7, 1],
                    outputRange: [0, (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 120, (Math.random() - 0.5) * 180],
                  }),
                },
                {
                  rotate: mainAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', `${720 + Math.random() * 360}deg`],
                  }),
                },
                {
                  scale: mainAnim.interpolate({
                    inputRange: [0, 0.1, 0.8, 1],
                    outputRange: [0, 1.2, 1, 0.7],
                  }),
                },
              ],
              opacity: mainAnim.interpolate({
                inputRange: [0, 0.1, 0.8, 1],
                outputRange: [0, 1, 1, 0],
              }),
            },
          ]}
        />
      ))}

      {/* Confetti secundario - papelitos más pequeños */}
      {[...Array(20)].map((_, index) => (
        <Animated.View
          key={`small-confetti-${index}`}
          style={[
            styles.smallConfetti,
            {
              left: Math.random() * width,
              backgroundColor: '#45a049',
              transform: [
                {
                  translateY: mainAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-30, height + 80],
                  }),
                },
                {
                  translateX: mainAnim.interpolate({
                    inputRange: [0, 0.4, 1],
                    outputRange: [0, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 150],
                  }),
                },
                {
                  rotate: mainAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', `${540 + Math.random() * 180}deg`],
                  }),
                },
              ],
              opacity: mainAnim.interpolate({
                inputRange: [0, 0.15, 0.85, 1],
                outputRange: [0, 1, 1, 0],
              }),
            },
          ]}
        />
      ))}

      {/* Partículas de brillo doradas */}
      {[...Array(18)].map((_, index) => (
        <Animated.View
          key={`sparkle-${index}`}
          style={[
            styles.sparkle,
            {
              left: Math.random() * width,
              top: Math.random() * height * 0.7,
              transform: [
                {
                  scale: mainAnim.interpolate({
                    inputRange: [0, 0.2, 0.5, 0.8, 1],
                    outputRange: [0, 1.5, 1, 1.2, 0],
                  }),
                },
                {
                  rotate: mainAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '720deg'],
                  }),
                },
              ],
              opacity: mainAnim.interpolate({
                inputRange: [0, 0.1, 0.7, 1],
                outputRange: [0, 1, 1, 0],
              }),
            },
          ]}
        />
      ))}

      {/* Partículas con cola (trail effect) */}
      {[...Array(12)].map((_, index) => (
        <Animated.View
          key={`trail-${index}`}
          style={[
            styles.trailParticle,
            {
              left: Math.random() * width,
              backgroundColor: '#00E0FF',
              transform: [
                {
                  translateY: mainAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, height + 60],
                  }),
                },
                {
                  translateX: mainAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 120],
                  }),
                },
                {
                  scale: mainAnim.interpolate({
                    inputRange: [0, 0.2, 0.8, 1],
                    outputRange: [0, 1, 1, 0.5],
                  }),
                },
              ],
              opacity: mainAnim.interpolate({
                inputRange: [0, 0.1, 0.6, 1],
                outputRange: [0, 1, 0.8, 0],
              }),
            },
          ]}
        />
      ))}

      {/* Ondas expansivas múltiples */}
      {[...Array(4)].map((_, index) => (
        <Animated.View
          key={`wave-${index}`}
          style={[
            styles.wave,
            {
              borderColor: index === 0 ? '#4CAF50' : index === 1 ? '#00E0FF' : index === 2 ? '#E000FF' : '#FFD700',
              transform: [
                {
                  scale: mainAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5 + index * 0.3, 2.5 + index * 0.5],
                  }),
                },
              ],
              opacity: mainAnim.interpolate({
                inputRange: [0, 0.2, 0.6, 1],
                outputRange: [0, 0.6 - index * 0.1, 0.3 - index * 0.05, 0],
              }),
            },
          ]}
        />
      ))}

      {/* Efecto de pulso central */}
      <Animated.View
        style={[
          styles.pulseCenter,
          {
            transform: [
              {
                scale: mainAnim.interpolate({
                  inputRange: [0, 0.3, 0.6, 1],
                  outputRange: [1, 1.5, 1.2, 0.8],
                }),
              },
            ],
            opacity: mainAnim.interpolate({
              inputRange: [0, 0.2, 0.5, 0.8, 1],
              outputRange: [0, 0.8, 0.6, 0.4, 0],
            }),
          },
        ]}
      />

      {/* Partículas de estrella adicionales */}
      {[...Array(15)].map((_, index) => (
        <Animated.View
          key={`star-${index}`}
          style={[
            styles.star,
            {
              left: Math.random() * width,
              top: Math.random() * height * 0.8,
              transform: [
                {
                  scale: mainAnim.interpolate({
                    inputRange: [0, 0.3, 0.7, 1],
                    outputRange: [0, 1.3, 1, 0],
                  }),
                },
                {
                  rotate: mainAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
              opacity: mainAnim.interpolate({
                inputRange: [0, 0.2, 0.6, 1],
                outputRange: [0, 1, 0.8, 0],
              }),
            },
          ]}
        />
      ))}

      {/* Partículas de corazón */}
      {[...Array(8)].map((_, index) => (
        <Animated.View
          key={`heart-${index}`}
          style={[
            styles.heart,
            {
              left: Math.random() * width,
              backgroundColor: '#FF69B4',
              transform: [
                {
                  translateY: mainAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-30, height + 50],
                  }),
                },
                {
                  translateX: mainAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 150],
                  }),
                },
                {
                  rotate: mainAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg'],
                  }),
                },
                {
                  scale: mainAnim.interpolate({
                    inputRange: [0, 0.2, 0.8, 1],
                    outputRange: [0, 1.2, 1, 0.6],
                  }),
                },
              ],
              opacity: mainAnim.interpolate({
                inputRange: [0, 0.1, 0.7, 1],
                outputRange: [0, 1, 0.9, 0],
              }),
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    pointerEvents: 'none',
  },
  explosion: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#4CAF50',
    top: '50%',
    left: '50%',
    marginTop: -70,
    marginLeft: -70,
    elevation: 12,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
  },
  confetti: {
    position: 'absolute',
    width: 12,
    height: 24,
    borderRadius: 6,
    elevation: 4,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  smallConfetti: {
    position: 'absolute',
    width: 8,
    height: 16,
    borderRadius: 4,
    elevation: 3,
    shadowColor: '#45a049',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  sparkle: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFD700',
    elevation: 6,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  trailParticle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    elevation: 3,
    shadowColor: '#00E0FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 3,
  },
  wave: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    top: '50%',
    left: '50%',
    marginTop: -70,
    marginLeft: -70,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  pulseCenter: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4CAF50',
    top: '50%',
    left: '50%',
    marginTop: -50,
    marginLeft: -50,
    elevation: 8,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
  },
  star: {
    position: 'absolute',
    width: 12,
    height: 12,
    backgroundColor: '#FFD700',
    elevation: 5,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    transform: [{ rotate: '45deg' }],
  },
  heart: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    elevation: 4,
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 3,
  },
});
