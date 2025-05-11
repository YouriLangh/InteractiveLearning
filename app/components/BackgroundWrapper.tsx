import React from "react";
import { Image, StyleSheet, View, Dimensions } from "react-native";
import NavigationBar from "./NavigationBar";

type Props = {
  nav: boolean;
  role: "STUDENT" | "TEACHER";
  children: React.ReactNode;
};

export default function BackgroundWrapper({ nav, role, children }: Props) {
  return (
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

      {nav && <NavigationBar role={role} />}
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
