import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { useRouter } from 'expo-router';
import BackgroundWrapper from '@/app/components/BackgroundWrapper';
import ReturnButton from '@/app/components/ui/ReturnButton';

export default function StudentLearnScreen() {
  const [solved, setSolved] = useState(false);
  const router = useRouter();
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const { width } = useWindowDimensions();

  const evaluateExercise = () => {
    console.log('Evaluating...');
    setSolved(Math.random() < 0.5);
  };

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  const cardWidth = width > 700 ? 600 : '90%';
  const buttonWidth = width > 500 ? 200 : '45%';
  const cameraHeight = width > 500 ? 380 : 240;

  return (
    <BackgroundWrapper>
      <View style={styles.wrapper}>
        <ReturnButton />
        <View style={styles.header}>
          <Text style={styles.title}>ADDITION</Text>
          <Text style={styles.subtitle}>Exercise 5</Text>
        </View>

        <View style={styles.exerciseSection}>
          <Text style={styles.exerciseTitle}>Make 12 using at least one red block</Text>

          <View style={[styles.cameraPreview, { width: '90%', height: cameraHeight }]}>
            {device && hasPermission ? (
              <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                photo={true} 
              />
            ) : (
              <Text onPress={requestPermission} style={styles.cameraFallback}>
                Camera not available
              </Text>
            )}
          </View>

          <View style={[styles.buttons, { width: '90%' }]}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#F66767', width: buttonWidth }]}
              onPress={() => console.log('Try Again')}
            >
              <Text style={styles.buttonText}>❌ Try Again</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#67B1F6', width: buttonWidth }]}
              onPress={() => console.log('Hint')}
            >
              <Text style={styles.buttonText}>❔ Hint</Text>
            </TouchableOpacity>
          </View>
        </View>

        {solved && (
          <View style={styles.overlay}>
            <View style={[styles.overlayContent, { width: cardWidth }]}>
              <Text style={styles.overlayText}>Exercise Completed ✅</Text>
              <TouchableOpacity
                style={styles.overlayButton}
                onPress={() => router.push('/student/StudentExerciseList')}
              >
                <Text style={styles.overlayButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: 'black',
  },
  subtitle: {
    fontSize: 26,
    fontWeight: '800',
    color: 'black',
  },
  exerciseSection: {
    alignItems: 'center',
    width: '100%',
  },
  exerciseTitle: {
    fontSize: 20,
    color: 'black',
    marginBottom: 20,
    textAlign: 'center',
  },
  cameraPreview: {
    backgroundColor: '#333',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraFallback: {
    color: '#fff',
    fontSize: 16,
    padding: 20,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    marginTop: 20,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#98CDFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  overlayContent: {
    backgroundColor: '#BEFDBA',
    padding: 24,
    borderRadius: 10,
    alignItems: 'center',
  },
  overlayText: {
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 20,
    textAlign: 'center',
  },
  overlayButton: {
    backgroundColor: '#42B725',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  overlayButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
