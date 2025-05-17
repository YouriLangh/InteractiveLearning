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
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  });

  // If user is already logged in, redirect to their dashboard
  if (user) {
    return <Redirect href={user.role === 'TEACHER' ? '/teacher/ProfileScreen' : '/student/StudentExerciseList'} />;
  }

  return (
    <BackgroundWrapper nav={false} role="STUDENT">
      <SafeAreaView style={styles.innerContainer}>
        <Text style={styles.title}>Welcome!{"\n"}Login as:</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/auth/LoginScreen?role=student")}
          >
            <Image
              source={require("@/assets/images/student-icon.png")}
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Student</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/auth/LoginScreen?role=teacher")}
          >
            <Image
              source={require("@/assets/images/teacher-icon.png")}
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Teacher</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </BackgroundWrapper>
  );
}

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
