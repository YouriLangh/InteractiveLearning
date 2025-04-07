import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import BackgroundWrapper from '@/app/components/BackgroundWrapper'; 


const { width } = Dimensions.get('window');


export default function Index() {
  const router = useRouter();

  return (
    <BackgroundWrapper>
      <SafeAreaView style={styles.innerContainer}>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/explore')}>
        <Text style={styles.buttonText}>Explore</Text>
      </TouchableOpacity>

        <Text style={styles.title}>Welcome!{'\n'}Login as:</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/auth/LoginScreen?role=student')}>
            <Image
              source={require('@/assets/images/student-icon.png')}
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Student</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/auth/LoginScreen?role=teacher')}>
            <Image
              source={require('@/assets/images/teacher-icon.png')}
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Teacher</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => router.push('/auth/SignupScreen')}>
          <Text style={styles.signupText}>Sign Up</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#66CE7D',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.4,
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupButton: {
    marginTop: 10,
    backgroundColor: '#DADADA',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  signupText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
