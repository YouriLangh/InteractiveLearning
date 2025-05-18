import React from "react";
import { Image, StyleSheet, View, Dimensions } from "react-native";
import NavigationBar from "./NavigationBar";

type Props = {
  nav: boolean;
  role: "STUDENT" | "TEACHER";
  children: React.ReactNode;
};
/**
 * BackgroundWrapper component that provides a background and optional navigation bar.
 * @param {nav} - If true, the navigation bar will be displayed
 * @param {role} - The role of the user, either "STUDENT" or "TEACHER"
 * @param {children} - The children to be rendered inside the wrapper
 * @returns A wrapper component with a background image and optional navigation bar
 */
export default function BackgroundWrapper({ nav, role, children }: Props) {
  return (
    //  Placing the background images in the correct position
    <View style={styles.container}>
      {/* Bottom right */}
      <Image
        source={require("@/assets/images/BackgroundCube.png")}
        style={[styles.cube, styles.cubeBottomRight]}
      />

      {/* Top Center */}
      <Image
        source={require("@/assets/images/ThirdCube.png")}
        style={[styles.cube, styles.cubeCenter]}
      />

      {/* Left */}
      <Image
        source={require("@/assets/images/CenterCube.png")}
        style={[styles.cube, styles.cubeLeft]}
      />
      {/* Navigation bar */}
      {/* This is to prevent the navigation bar from being shown on the login screen */}
      {nav && <NavigationBar role={role} />}
      {/* The children will be rendered in the center of the screen */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff7ec",
    position: "relative",
  },
  cube: {
    position: "absolute",
  },
  cubeLeft: {
    bottom: "20%",
    left: "30%",
  },
  cubeBottomRight: {
    bottom: 0,
    right: 0,
  },
  cubeCenter: {
    top: "15%",
    right: "20%",
  },
});
