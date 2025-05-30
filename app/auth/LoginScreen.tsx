// This is the login screen where students and teachers can sign in
// It has a nice design with a mascot and floating cubes
import React, { useState, useEffect } from "react";
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
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import BackgroundWrapper from "@/app/components/BackgroundWrapper";
import { useAuth } from "@/context/AuthContext";
import * as ScreenOrientation from "expo-screen-orientation";

// This is what we get back from the server when login is successful
interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    role: string;
  };
}

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { login } = useAuth();
  
  // Store what the user types in the input fields
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const uiRole = params.role?.toString()?.toUpperCase() || "STUDENT";
  const isTeacherUI = uiRole === "TEACHER";

  // Keep track of if the phone is in portrait or landscape mode
  const [orientation, setOrientation] = useState("PORTRAIT");

  // Check and update screen orientation when it changes
  useEffect(() => {
    const getOrientation = async () => {
      const orientationResult = await ScreenOrientation.getOrientationAsync();
      if (
        orientationResult === ScreenOrientation.Orientation.PORTRAIT_UP ||
        orientationResult === ScreenOrientation.Orientation.PORTRAIT_DOWN
      ) {
        setOrientation("PORTRAIT");
      } else {
        setOrientation("LANDSCAPE");
      }
    };

    getOrientation();

    // Listen for when the user rotates their phone
    const subscription = ScreenOrientation.addOrientationChangeListener(
      (evt) => {
        const { orientation: newOrientation } = evt.orientationInfo;
        if (
          newOrientation === ScreenOrientation.Orientation.PORTRAIT_UP ||
          newOrientation === ScreenOrientation.Orientation.PORTRAIT_DOWN
        ) {
          setOrientation("PORTRAIT");
        } else {
          setOrientation("LANDSCAPE");
        }
      }
    );

    // Clean up when we leave this screen
    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  // Handle the login button press
  const handleLogin = async () => {
    try {
      // Try to log in with the name and code
      const response = await login(name, code, uiRole as "STUDENT" | "TEACHER");

      // Make sure we got good data back
      if (!response || !response.user || !response.user.role) {
        throw new Error("Invalid user data received");
      }

      // Send users to different screens based on their role
      const userRole = response.user.role.toUpperCase();
      if (userRole === "TEACHER") {
        router.replace("/teacher/ProfileScreen");
      } else if (userRole === "STUDENT") {
        router.replace("/student/StudentExerciseList");
      } else {
        throw new Error("Invalid user role");
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      alert(error?.message || "Login failed. Please try again.");
      // Clear the input fields if login fails
      setName("");
      setCode("");
    }
  };

  return (
    <BackgroundWrapper nav={false} role={uiRole as "STUDENT" | "TEACHER"}>
      <View style={[newStyles.container]}>
        <View style={newStyles.rowContainer}>
          {/* Left side with mascot and floating cubes */}
          <View style={newStyles.leftSection}>
            <Image
              source={require("@/assets/images/mascott_tr.png")}
              style={newStyles.mascot}
            />
            <Image
              source={require("@/assets/images/small.png")}
              style={newStyles.smallCube}
            />
            <Image
              source={require("@/assets/images/medium.png")}
              style={newStyles.mediumCube}
            />
            <Image
              source={require("@/assets/images/large.png")}
              style={newStyles.largeCube}
            />
          </View>

          {/* Right side with login form */}
          <View style={newStyles.rightSection}>
            {/* App title */}
            <View
              style={{ display: "flex", flexDirection: "row", width: "100%" }}
            >
              <Text style={[newStyles.title]}>Welcome to </Text>
              <Text style={[newStyles.title, { color: "#D16413" }]}>Block</Text>
              <Text style={[newStyles.title, { color: "#487D33" }]}>Ed</Text>
              <Text style={[newStyles.title]}>!</Text>
            </View>

            {/* Show avatar selection only for students */}
            {!isTeacherUI && (
              <>
                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    fontSize: 18,
                    width: "100%",
                  }}
                >
                  Choose an avatar
                </Text>

                <Image
                  source={require("@/assets/images/avatar.png")}
                  style={newStyles.avatar}
                />
              </>
            )}

            {/* Login form inputs */}
            <View style={{ width: "100%" }}>
              <TextInput
                placeholder="Enter your name"
                style={newStyles.input}
                placeholderTextColor="#ccc"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                placeholder="Enter your code"
                style={newStyles.input}
                placeholderTextColor="#ccc"
                value={code}
                onChangeText={setCode}
                secureTextEntry={isTeacherUI} // Hide code for teachers
              />
            </View>

            {/* Login button - green when fields are filled */}
            <TouchableOpacity
              style={[
                newStyles.goButton,
                {
                  backgroundColor: name && code ? "#85E585" : "#E0E0E0",
                },
              ]}
              onPress={handleLogin}
              disabled={!name || !code}
            >
              <Text style={newStyles.goButtonText}>GO</Text>
            </TouchableOpacity>
            
            {/* Show signup link only for teachers */}
            {isTeacherUI && (
              <TouchableOpacity
                onPress={() => router.push("/auth/SignupScreen")}
                style={newStyles.signupLink}
              >
                <Text style={newStyles.signupText}>
                  Don't have an account? Sign up as a Teacher
                </Text>
              </TouchableOpacity>
            )}
            
            {/* Switch between student and teacher login */}
            <TouchableOpacity
              onPress={() =>
                router.push(
                  isTeacherUI
                    ? "/auth/LoginScreen?role=student"
                    : "/auth/LoginScreen?role=teacher"
                )
              }
            >
              <Text style={newStyles.switchText}>
                Not a {isTeacherUI ? "Teacher" : "Student"}?{"\n"}Log in as a{" "}
                {isTeacherUI ? "Student" : "Teacher"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </BackgroundWrapper>
  );
}

// Styles for making the screen look nice
const newStyles = StyleSheet.create({
  mascot: {
    width: 180,
    height: 180,
    position: "relative",
    top: 30,
    left: 0,
  },
  smallCube: {
    position: "absolute",
    right: "20%",
    top: "35%",
  },
  mediumCube: {
    position: "absolute",
    left: "10%",
    top: "50%",
  },
  largeCube: {
    position: "absolute",
    right: 0,
    bottom: 0,
  },
  container: {
    // borderColor: "red",
    // borderWidth: 1,
    width: "65%",
    height: "80%",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
  },
  rowContainer: {
    flexDirection: "row",
    width: "100%",
    height: "100%",
  },
  leftSection: {
    width: "35%",
    height: "100%",
    justifyContent: "flex-start",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    alignItems: "center",
    position: "relative",
    backgroundColor: "#EAFFEB",
  },
  rightSection: {
    flex: 2,
    backgroundColor: "#fff",
    borderTopRightRadius: 10,
    alignItems: "center",
    borderBottomRightRadius: 10,
    paddingHorizontal: "5%",
    paddingVertical: "5%",
    elevation: 0,
  },
  title: {
    fontSize: 30,
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "Poppins-Bold",
  },
  avatar: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    borderRadius: 100,
    marginBottom: 16,
    shadowColor: "#000",
    boxShadow: "0 8px 8px rgba(0, 0, 0, 0.2)",
  },
  input: {
    width: "90%",
    borderColor: "#000",
    borderWidth: 1.2,
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginVertical: 8,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#333",
  },
  goButton: {
    width: "50%", // a bit smaller width to make it oval
    borderRadius: 999, // full oval
    marginTop: 20,
    paddingVertical: 8,
    shadowColor: "#000",
    boxShadow: "0 8px 8px rgba(0, 0, 0, 0.2)",
  },
  goButtonText: {
    color: "white",
    fontFamily: "Poppins-Bold",
    position: "relative",
    top: 2,
    fontSize: 24,
    textAlign: "center",
  },
  signupLink: {
    marginTop: 15,
  },
  signupText: {
    color: "#487D33",
    textDecorationLine: "underline",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Poppins-Regular",
  },
  switchText: {
    marginTop: 15,
    color: "#8C8C8C",
    textDecorationLine: "underline",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Poppins-Regular",
  },
});
