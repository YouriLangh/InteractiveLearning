import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Dynamically scale mascot and icon sizes
const mascotSize = width < 400 ? 32 : width < 600 ? 40 : 48;
const iconSize = width < 400 ? 24 : 28;

export default function NavigationBar() {
  const router = useRouter();

  return (
    <View style={styles.navbarWrapper}>
      {/* Background Cubes */}
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
        {/* Home Button on Left */}
        <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/')}>
          <Image
            source={require('@/assets/images/home.png')}
            style={[styles.icon, { width: iconSize, height: iconSize }]}
          />
        </TouchableOpacity>

        {/* Center Mascot + Text (side-by-side) */}
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/mascott_tr.png')}
            style={[styles.mascot, { width: mascotSize, height: mascotSize }]}
          />
          <Text style={styles.centerText}>
            <Text style={styles.textOrange}>Block</Text>
            <Text style={styles.textGreen}>Ed</Text>
          </Text>
        </View>

        {/* Spacer to keep alignment balanced */}
        <View style={{ width: iconSize }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbarWrapper: {
    position: 'relative',
    backgroundColor: '#fff7ec',
    width: '100%',
    paddingTop: 9,
    paddingBottom: 5,
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
    resizeMode: 'contain',
    tintColor: '#3f7920',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mascot: {
    resizeMode: 'contain',
  },
  centerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textOrange: {
    color: '#e47920',
  },
  textGreen: {
    color: '#3f7920',
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
