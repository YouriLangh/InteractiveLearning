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

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 350 || height < 400;
const scaleFactor = Math.min(width / 375, 1.2);

<<<<<<< HEAD

export default function SignupScreen() {
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'TEACHER'>('STUDENT');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
=======
export default function SignupScreen() {
  const router = useRouter();
  const { signup } = useAuth();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'TEACHER'>('STUDENT');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
>>>>>>> Fahim2

  const handleSignup = async () => {
    setError('');
    setIsLoading(true);
<<<<<<< HEAD
    
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email format');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
=======

    if (!name || !code) {
      setError('Name and Code are required');
>>>>>>> Fahim2
      setIsLoading(false);
      return;
    }

    try {
<<<<<<< HEAD
      await signup({ name, email, password, role });
=======
      await signup({ name, code, role });
>>>>>>> Fahim2
      alert('Account created successfully! Please login.');
      router.replace('/auth/LoginScreen');
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BackgroundWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <SafeAreaView style={styles.container}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <ReturnButton />
            <Text style={styles.title}>Create Account</Text>
<<<<<<< HEAD
  
            {error && <Text style={styles.errorText}>{error}</Text>}
  
            <View style={styles.formContainer}>
              <TextInput
                placeholder="Full Name"
=======

            {error && <Text style={styles.errorText}>{error}</Text>}

            <View style={styles.formContainer}>
              <TextInput
                placeholder="Name"
>>>>>>> Fahim2
                style={styles.input}
                placeholderTextColor="#666"
                value={name}
                onChangeText={setName}
              />
<<<<<<< HEAD
  
              <TextInput
                placeholder="Email"
                style={styles.input}
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
  
              <TextInput
                placeholder="Password"
                style={styles.input}
                placeholderTextColor="#666"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
  
              <TextInput
                placeholder="Confirm Password"
                style={styles.input}
                placeholderTextColor="#666"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
  
=======

              <TextInput
                placeholder="Code"
                style={styles.input}
                placeholderTextColor="#666"
                value={code}
                onChangeText={setCode}
              />

>>>>>>> Fahim2
              <View style={styles.roleContainer}>
                <TouchableOpacity
                  style={[styles.roleButton, role === 'STUDENT' && styles.selectedRole]}
                  onPress={() => setRole('STUDENT')}
                >
                  <Text style={styles.roleText}>Student</Text>
                </TouchableOpacity>
<<<<<<< HEAD
  
=======

>>>>>>> Fahim2
                <TouchableOpacity
                  style={[styles.roleButton, role === 'TEACHER' && styles.selectedRole]}
                  onPress={() => setRole('TEACHER')}
                >
                  <Text style={styles.roleText}>Teacher</Text>
                </TouchableOpacity>
              </View>
<<<<<<< HEAD
  
=======

>>>>>>> Fahim2
              <TouchableOpacity
                style={styles.button}
                onPress={handleSignup}
              >
                <Text style={styles.buttonText}>Create Account</Text>
              </TouchableOpacity>
<<<<<<< HEAD
  
=======

>>>>>>> Fahim2
              <TouchableOpacity
                style={styles.loginLink}
                onPress={() => router.push('/auth/LoginScreen')}
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
<<<<<<< HEAD
  }

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
    roleContainer: {
      flexDirection: 'row',
      gap: width < 400 ? 8 : 10,
      marginVertical: height < 400 ? 8 : 10,
    },
    roleButton: {
      flex: 1,
      padding: height < 400 ? 10 : 12,
      borderRadius: 8,
      alignItems: 'center',
      backgroundColor: '#F9A83610',
      borderWidth: 1,
      borderColor: '#F9A83630',
      minHeight: 40,
    },
    selectedRole: {
      backgroundColor: '#F9A83620',
      borderColor: '#F9A836',
    },
    roleText: {
      color: '#F9A836',
      fontWeight: '500',
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
  
=======
}

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
  roleContainer: {
    flexDirection: 'row',
    gap: width < 400 ? 8 : 10,
    marginVertical: height < 400 ? 8 : 10,
  },
  roleButton: {
    flex: 1,
    padding: height < 400 ? 10 : 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F9A83610',
    borderWidth: 1,
    borderColor: '#F9A83630',
    minHeight: 40,
  },
  selectedRole: {
    backgroundColor: '#F9A83620',
    borderColor: '#F9A836',
  },
  roleText: {
    color: '#F9A836',
    fontWeight: '500',
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
>>>>>>> Fahim2
