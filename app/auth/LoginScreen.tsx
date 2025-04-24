import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  useWindowDimensions,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BackgroundWrapper from '@/app/components/BackgroundWrapper';
import ReturnButton from '@/app/components/ui/ReturnButton';
import { useAuth } from '@/context/AuthContext';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const uiRole = params.role?.toString()?.toUpperCase() || 'STUDENT';
  const isTeacherUI = uiRole === 'TEACHER';

  const [orientation, setOrientation] = useState('PORTRAIT');

  useEffect(() => {
    const getOrientation = async () => {
      const orientationResult = await ScreenOrientation.getOrientationAsync();
      if (
        orientationResult === ScreenOrientation.Orientation.PORTRAIT_UP ||
        orientationResult === ScreenOrientation.Orientation.PORTRAIT_DOWN
      ) {
        setOrientation('PORTRAIT');
      } else {
        setOrientation('LANDSCAPE');
      }
    };

    getOrientation();


    const subscription = ScreenOrientation.addOrientationChangeListener((evt) => {
      const { orientation: newOrientation } = evt.orientationInfo;
      if (
        newOrientation === ScreenOrientation.Orientation.PORTRAIT_UP ||
        newOrientation === ScreenOrientation.Orientation.PORTRAIT_DOWN
      ) {
        setOrientation('PORTRAIT');
      } else {
        setOrientation('LANDSCAPE');
      }
    });

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);


  const { width } = useWindowDimensions();
  const containerWidth = 0.7 * width;
  const containerHeight = containerWidth / 1.3;
  const leftSectionWidth = containerWidth / 3;
  const mascotSize = leftSectionWidth * 0.8;

  const handleLogin = async () => {
    try {
      const user = await login(email, password, uiRole as 'STUDENT' | 'TEACHER');
      
      if (user.role === 'TEACHER') {
        router.replace('/teacher/ProfileScreen');
      } else {
        router.replace('/student/StudentExerciseList');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      alert(error?.message || 'Login failed. Please try again.');
      setEmail('');
      setPassword('');
    }
  };

  if (orientation === 'PORTRAIT') {
    return (
      <BackgroundWrapper>
        <SafeAreaView style={oldStyles.container}>
          <ReturnButton />
          <Text style={oldStyles.title}>
            {isTeacherUI ? 'Teacher Login' : 'Student Login'}
          </Text>

          <TextInput
            placeholder="Email"
            style={oldStyles.input}
            placeholderTextColor="#ccc"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            placeholder="Password"
            style={oldStyles.input}
            placeholderTextColor="#ccc"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={[oldStyles.button, isTeacherUI && oldStyles.teacherButton]}
            onPress={handleLogin}
          >
            <Text style={oldStyles.buttonText}>
              Login as {uiRole.toLowerCase()}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              router.push(
                isTeacherUI
                  ? '/auth/LoginScreen?role=student'
                  : '/auth/LoginScreen?role=teacher'
              )
            }
          >
            <Text style={oldStyles.switchText}>
              Switch to {isTeacherUI ? 'Student' : 'Teacher'} login
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </BackgroundWrapper>
    );
  } else {
    return (
      <BackgroundWrapper>
        <SafeAreaView style={newStyles.safeArea}>
          <View style={[newStyles.container, { width: containerWidth, height: containerHeight }]}>
            <View style={newStyles.rowContainer}>
              <ImageBackground
                source={require('@/assets/images/texture.png')}
                style={newStyles.leftSection}
                resizeMode="cover"
              >
                <Image
                  source={require('@/assets/images/mascott_tr.png')}
                  style={{ width: mascotSize, height: mascotSize, resizeMode: 'contain' }}
                />
              </ImageBackground>
              <View style={newStyles.rightSection}>
                <Text style={newStyles.title}>
                  {isTeacherUI ? 'Teacher Login' : 'Student Login'}
                </Text>
                <Image
                  source={require('@/assets/images/avatar.png')}
                  style={newStyles.avatar}
                />
                <TextInput
                  placeholder="Enter your email"
                  style={newStyles.input}
                  placeholderTextColor="#ccc"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                <TextInput
                  placeholder="Enter your password"
                  style={newStyles.input}
                  placeholderTextColor="#ccc"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity style={newStyles.goButton} onPress={handleLogin}>
                  <Text style={newStyles.goButtonText}>GO</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    router.push(
                      isTeacherUI
                        ? '/auth/LoginScreen?role=student'
                        : '/auth/LoginScreen?role=teacher'
                    )
                  }
                >
                  <Text style={newStyles.switchText}>
                    Switch to {isTeacherUI ? 'Student' : 'Teacher'} login
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </BackgroundWrapper>
    );
  }
}

const oldStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    zIndex: 2,
    backgroundColor: '#00000080',
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

const newStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff7ec',
  },
  container: {
    backgroundColor: 'transparent',
    padding: 20,
    borderRadius: 12,
    alignSelf: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
  leftSection: {
    flex: 1,
    justifyContent: 'flex-start',
    borderRadius: 12,
    alignItems: 'center',
  },
  rightSection: {
    flex: 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  avatar: {
    width: '25%',
    height: '25%',
    resizeMode: 'contain',
    marginBottom: 0,
  },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 8,
    color: '#333',
  },
  goButton: {
    width: '100%',
    backgroundColor: '#E0E0E0',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  goButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  switchText: {
    marginTop: 20,
    color: '#1976D2',
    textDecorationLine: 'underline',
    fontSize: 14,
    textAlign: 'center',
  },
});
