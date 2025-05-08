import React from 'react';
import { StyleSheet, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';

export default function ReturnButton() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          top: 20,
          left: 10,
        },
      ]}
      onPress={() => router.back()}
    >
      <Image
        source={require('@/assets/images/returnbtn.png')}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    zIndex: 99,
    borderRadius: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});
