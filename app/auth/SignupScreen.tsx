// This is the signup screen where teachers can create their account
// It has a simple form with name and code inputs
import React, { useState } from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Text, 
  View, 
  SafeAreaView, 
  Dimensions, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from 'react-native';
import { useRouter } from 'expo-router';
import BackgroundWrapper from '@/app/components/BackgroundWrapper';
import ReturnButton from '@/app/components/ui/ReturnButton';
import { useAuth } from '@/context/AuthContext';

// Get screen size to make things look good on all devices
const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 350 || height < 400;
const scaleFactor = Math.min(width / 375, 1.2);

export default function SignupScreen() {
  const router = useRouter();
  const { signup } = useAuth();
  
  // Store what the user types in the input fields
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle the signup button press
  const handleSignup = async () => {
    setError('');
    setIsLoading(true);
    
    // Check if both fields are filled
    if (!name || !code) {
      setError('Name and Code are required');
      setIsLoading(false);
      return;
    }

    try {
      // Try to create a new teacher account
      await signup({ name, code, role: 'TEACHER' });
      alert('Teacher account created successfully! Please login.');
      // Go to login screen after successful signup
      router.replace('/auth/LoginScreen?role=teacher');
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BackgroundWrapper nav={false} role="TEACHER">
      {/* Make sure keyboard doesn't cover the form */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <SafeAreaView style={styles.container}>
          {/* Allow scrolling if screen is too small */}
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Back button to go to previous screen */}
            <ReturnButton />
            <Text style={styles.title}>Create Teacher Account</Text>

            {/* Show error message if something goes wrong */}
            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* Signup form */}
            <View style={styles.formContainer}>
              {/* Name input field */}
              <TextInput
                placeholder="Name"
                style={styles.input}
                placeholderTextColor="#666"
                value={name}
                onChangeText={setName}
              />

              {/* Code input field */}
              <TextInput
                placeholder="Code"
                style={styles.input}
                placeholderTextColor="#666"
                value={code}
                onChangeText={setCode}
              />

              {/* Signup button */}
              <TouchableOpacity
                style={styles.button}
                onPress={handleSignup}
              >
                <Text style={styles.buttonText}>Create Teacher Account</Text>
              </TouchableOpacity>

              {/* Link to go to login screen */}
              <TouchableOpacity
                style={styles.loginLink}
                onPress={() => router.push('/auth/LoginScreen?role=teacher')}
              >
                <Text style={styles.loginText}>
                  Already have an account? <Text style={styles.loginLinkText}>Login</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </BackgroundWrapper>
  );
}

// Styles for making the screen look nice on all devices
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff7ec',
    paddingHorizontal: width > 500 ? '15%' : Math.max(width * 0.05, 10),
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
    paddingTop: 10,
  },
  formContainer: {
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
    paddingTop: isSmallScreen ? 10 : 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: isSmallScreen ? scaleFactor * 22 : scaleFactor * 26,
    color: '#F9A836',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: height < 400 ? 10 : 20,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: height < 400 ? 10 : 12,
    paddingHorizontal: 15,
    marginBottom: height < 400 ? 8 : 12,
    color: '#333',
    fontSize: isSmallScreen ? scaleFactor * 14 : scaleFactor * 16,
    borderWidth: 1,
    borderColor: '#F9A83620',
    minHeight: height < 400 ? 40 : 50,
  },
  button: {
    backgroundColor: '#F9A836',
    padding: height < 400 ? 12 : 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: height < 400 ? 15 : 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minHeight: height < 400 ? 45 : 50,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: isSmallScreen ? scaleFactor * 14 : scaleFactor * 16,
  },
  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: height < 400 ? 10 : 15,
    fontSize: isSmallScreen ? 12 : 14,
  },
  loginLink: {
    marginTop: height < 400 ? 15 : 20,
    alignItems: 'center',
  },
  loginText: {
    color: '#666',
    fontSize: isSmallScreen ? 12 : 14,
  },
  loginLinkText: {
    color: '#F9A836',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
  