// This is the screen where teachers can add new students to the platform
// Teachers can enter a student's name and either type or generate a login code
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import BackgroundWrapper from '@/app/components/BackgroundWrapper';
import ReturnButton from '@/app/components/ui/ReturnButton';
import { useRouter } from 'expo-router';
import api from '@/services/api';

// Get screen size to make things look good on all devices
const { width, height } = Dimensions.get('window');

export default function AddStudentScreen() {
  const router = useRouter();
  
  // Store what the teacher types in the input fields
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Create a random 4-digit code for the student
  const generateRandomCode = () => {
    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
    setCode(randomCode);
  };

  // Handle the create account button press
  const handleSubmit = async () => {
    // Check if name is empty
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a student name');
      return;
    }

    // Check if code is empty
    if (!code.trim()) {
      Alert.alert('Error', 'Please enter a code or generate one');
      return;
    }

    setIsLoading(true);

    try {
      // Try to create a new student account
      await api.post('/auth/signup', {
        name,
        code,
        role: 'STUDENT'
      });

      // Show success message and go back to profile screen
      Alert.alert(
        'Success', 
        `Student account created successfully!\nName: ${name}\nCode: ${code}`,
        [
          { 
            text: 'OK', 
            onPress: () => router.replace('/teacher/ProfileScreen') 
          }
        ]
      );
    } catch (error: any) {
      console.error('Failed to create student account:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to create student account'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BackgroundWrapper nav={true} role="TEACHER">
      <ScrollView contentContainerStyle={styles.container}>
        {/* Back button to go to previous screen */}
        <ReturnButton />
        <Text style={styles.title}>Add New Student</Text>
        
        {/* Form for adding a new student */}
        <View style={styles.form}>
          {/* Student name input */}
          <Text style={styles.label}>Student Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter student name"
            placeholderTextColor="#999"
          />
          
          {/* Login code section with generate button */}
          <View style={styles.codeContainer}>
            <View style={styles.codeInputContainer}>
              <Text style={styles.label}>Login Code</Text>
              <TextInput
                style={styles.input}
                value={code}
                onChangeText={setCode}
                placeholder="Enter code or generate"
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>
            
            {/* Button to generate a random code */}
            <TouchableOpacity 
              style={styles.generateButton}
              onPress={generateRandomCode}
            >
              <Text style={styles.generateButtonText}>Generate</Text>
            </TouchableOpacity>
          </View>
          
          {/* Create account button - disabled if fields are empty */}
          <TouchableOpacity
            style={[styles.submitButton, (!name || !code) && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={!name || !code || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitButtonText}>Create Student Account</Text>
            )}
          </TouchableOpacity>
          
          {/* Help text explaining what this does */}
          <Text style={styles.helperText}>
            This will create a student account that can access the platform using the name
            and code provided. Make sure to share these credentials with the student.
          </Text>
        </View>
      </ScrollView>
    </BackgroundWrapper>
  );
}

// Styles for making the screen look nice on all devices
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
    color: '#333',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  codeInputContainer: {
    flex: 1,
    marginRight: 10,
  },
  generateButton: {
    backgroundColor: '#FFA600',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  generateButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#85E585',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  helperText: {
    fontSize: 14,
    color: '#666',
    marginTop: 20,
    textAlign: 'center',
  },
}); 