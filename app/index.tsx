// This is the first screen that loads when you open the app
// It checks if you're logged in and sends you to the right screen
import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { useRouter, Redirect } from "expo-router";
import BackgroundWrapper from "@/app/components/BackgroundWrapper";
import { useFonts } from "expo-font";
import { useAuth } from "@/context/AuthContext";

const { width } = Dimensions.get("window");

export default function Index() {
  const router = useRouter();
  const { user } = useAuth();
  
  // Load the custom fonts we use in the app
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  });

  // If you're already logged in, go to your dashboard
  // Teachers go to their profile, students go to their exercise list
  if (user) {
    return <Redirect href={user.role === 'TEACHER' ? '/teacher/ProfileScreen' : '/student/StudentExerciseList'} />;
  }

  // If you're not logged in, go to the login screen
  // Start with the student login option
  return <Redirect href="/auth/LoginScreen?role=student" />;
}

// Styles for making the screen look nice on all devices
const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "black",
    marginBottom: 30,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#66CE7D",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.4,
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
