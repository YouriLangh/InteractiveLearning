import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BackgroundWrapper from '@/app/components/BackgroundWrapper';
import ReturnButton from '@/app/components/ui/ReturnButton';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const uiRole = params.role?.toString()?.toUpperCase() || 'STUDENT';
  const isTeacherUI = uiRole === 'TEACHER';

  const handleLogin = async () => {
    try {
      const user = await login(email, password, uiRole as 'STUDENT' | 'TEACHER');
      
      if (user.role === 'TEACHER') {
        router.replace('/teacher/ProfileScreen');
      } else {
        router.replace('/student/StudentCategoryScreen');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      alert(error?.message || 'Login failed. Please try again.');
      setEmail('');
      setPassword('');
    }
  };

  return (
    <BackgroundWrapper>
      <SafeAreaView style={styles.container}>
        <ReturnButton />
        <Text style={styles.title}>
          {isTeacherUI ? 'Teacher Login' : 'Student Login'}
        </Text>

        <TextInput
          placeholder="Email"
          style={styles.input}
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          placeholder="Password"
          style={styles.input}
          placeholderTextColor="#ccc"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.button, isTeacherUI && styles.teacherButton]}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Login as {uiRole.toLowerCase()}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push(isTeacherUI ? 
            '/auth/LoginScreen?role=student' : 
            '/auth/LoginScreen?role=teacher')}
        >
          <Text style={styles.switchText}>
            Switch to {isTeacherUI ? 'Student' : 'Teacher'} login
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    zIndex: 2,
  },
  title: {
    fontSize: 26,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#ffffff20',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    color: 'white',
  },
  button: {
    backgroundColor: '#D32F2F',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  teacherButton: {
    backgroundColor: '#1976D2', 
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  switchText: {
    color: '#90CAF9',
    textAlign: 'center',
    marginTop: 15,
    textDecorationLine: 'underline',
  },
});