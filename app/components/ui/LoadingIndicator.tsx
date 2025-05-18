import React from "react";
import { StyleSheet, Text, View } from "react-native";
import LottieView from "lottie-react-native";

/**
 *  A generic loading indicator component that can be used throughout the app.
 *  It displays a loading animation and an optional text message.
 * @param text - The text to display below the loading animation. If not provided, no text will be shown.
 */
export default function LoadingIndicator({ text }: { text?: string }) {
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor: "rgba(29, 29, 29, 0.75)",
          zIndex: 30,
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
    >
      <View style={styles.loadingOverlay}>
        {/* The loading animation using Lottie animation */}
        <LottieView
          style={{ width: 100, height: 150 }}
          source={require("@/assets/animations/Loading_Animation.json")}
          autoPlay
          loop
        />
        {/* Optional text message below the loading animation */}
        <Text
          style={{
            fontSize: 28,
            color: "rgb(255, 255, 255)",
            fontFamily: "Poppins-Medium",
            textAlign: "center",
            marginTop: -5,
            marginLeft: 20,
          }}
        >
          {text}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
    zIndex: 30,
    paddingVertical: 25,
    paddingHorizontal: 80,
    borderRadius: 25,
  },
});
