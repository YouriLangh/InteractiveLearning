import React from 'react';
import { Image, StyleSheet, View, Dimensions } from 'react-native';
import NavigationBar from './NavigationBar';

const { width, height } = Dimensions.get('window');

type Props = {
  children: React.ReactNode;
};

export default function BackgroundWrapper({ children }: Props) {
  return (
    <View style={styles.container}>

      {/* Top left */}
      <Image source={require('@/assets/images/background-cube-1.png')} style={[styles.cube, styles.cubeTopLeft]} />
      <Image source={require('@/assets/images/background-cube-1.png')} style={[styles.cube, { top: 80, left: 40, width: 50, height: 50, opacity: 0.3 }]} />

      {/* Top right */}
      <Image source={require('@/assets/images/background-cube-2.png')} style={[styles.cube, styles.cubeTopRight]} />
      <Image source={require('@/assets/images/background-cube-2.png')} style={[styles.cube, { top: 160, right: 50, width: 60, height: 60, opacity: 0.25 }]} />

      {/* Bottom right */}
      <Image source={require('@/assets/images/background-cube-group.png')} style={[styles.cube, styles.cubeBottom]} />
      <Image source={require('@/assets/images/background-cube-1.png')} style={[styles.cube, { bottom: 100, right: 40, width: 80, height: 80, opacity: 0.2 }]} />

      {/* Bottom left */}
      <Image source={require('@/assets/images/background-cube-2.png')} style={[styles.cube, { bottom: 40, left: 30, width: 70, height: 70, opacity: 0.2 }]} />

      {/* Navbar and Screen Content */}
      <NavigationBar />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0062CC',
    position: 'relative',
  },
  cube: {
    position: 'absolute',
    resizeMode: 'contain',
  },
  cubeTopLeft: {
    top: 0,
    left: 0,
    width: 150,
    height: 150,
    opacity: 0.6,
  },
  cubeTopRight: {
    top: 40,
    right: 20,
    width: 100,
    height: 100,
    opacity: 0.6,
  },
  cubeBottom: {
    bottom: 0,
    right: 0,
    width: 300,
    height: 300,
    opacity: 0.6,
  },
});
