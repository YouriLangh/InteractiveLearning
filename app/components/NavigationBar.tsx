import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function NavigationBar() {
  const router = useRouter();

  return (
    <View style={styles.navbarWrapper}>
      {/* Background Images */}
      <Image
        source={require('@/assets/images/cube.png')}
        style={styles.bgTopRight}
      />
      <Image
        source={require('@/assets/images/cubegroup.png')}
        style={styles.bgFloatingCubes}
      />

      {/* Navbar Content */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/')}>
          <Image
            source={require('@/assets/images/home.png')}
            style={styles.icon}
          />
        </TouchableOpacity>

        <Text style={styles.centerText}>BlockEd</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbarWrapper: {
    position: 'relative',
    backgroundColor: '#034188',
    width: '100%',
    paddingTop: 20,
    paddingBottom: 10,
  },
  navbar: {
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  homeButton: {
    zIndex: 10, 
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  centerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: 5,
  },
  bgTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: width * 0.3,
    height: 80,
    resizeMode: 'contain',
    opacity: 0.4,
    zIndex: 0,
  },
  bgFloatingCubes: {
    position: 'absolute',
    top: 0,
    right: width * 0.2,
    width: 120,
    height: 60,
    resizeMode: 'contain',
    opacity: 0.2,
    zIndex: 0,
  },
});
