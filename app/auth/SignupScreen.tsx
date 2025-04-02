import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BackgroundWrapper from '@/app/components/BackgroundWrapper';
import ReturnButton from '@/app/components/ui/ReturnButton';

export default function Signup() {
  const navigation = useNavigation<any>();

  return (
    <BackgroundWrapper>
      <SafeAreaView style={styles.container}>
      <ReturnButton />
        <Text style={styles.title}>Sign Up</Text>

        <TextInput placeholder="Full Name" style={styles.input} placeholderTextColor="#ccc" />
        <TextInput placeholder="Email" style={styles.input} placeholderTextColor="#ccc" />
        <TextInput placeholder="Password" style={styles.input} placeholderTextColor="#ccc" secureTextEntry />
        <TextInput placeholder="Confirm Password" style={styles.input} placeholderTextColor="#ccc" secureTextEntry />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Create Account</Text>
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
    backgroundColor: '#1976D2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
