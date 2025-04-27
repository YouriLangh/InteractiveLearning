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
import ReturnButton from "@/app/components/ui/ReturnButton";
import { useAuth } from "@/context/AuthContext";
import * as ScreenOrientation from "expo-screen-orientation";

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const uiRole = params.role?.toString()?.toUpperCase() || "STUDENT";
  const isTeacherUI = uiRole === "TEACHER";

  const [orientation, setOrientation] = useState("PORTRAIT");

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

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  const handleLogin = async () => {
    try {
      const user = await login(
        email,
        password,
        uiRole as "STUDENT" | "TEACHER"
      );

      if (user.role === "TEACHER") {
        router.replace("/teacher/ProfileScreen");
      } else {
        router.replace("/student/StudentExerciseList");
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      alert(error?.message || "Login failed. Please try again.");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <BackgroundWrapper nav={false}>
      <View style={[newStyles.container]}>
        <View style={newStyles.rowContainer}>
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

          <View style={newStyles.rightSection}>
            <View
              style={{ display: "flex", flexDirection: "row", width: "100%" }}
            >
              <Text style={[newStyles.title]}>Welcome to </Text>
              <Text style={[newStyles.title, { color: "#D16413" }]}>Block</Text>
              <Text style={[newStyles.title, { color: "#487D33" }]}>Ed</Text>
              <Text style={[newStyles.title]}>!</Text>
            </View>
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
            <View style={{ width: "100%" }}>
              <TextInput
                placeholder="Enter your email"
                style={newStyles.input}
                placeholderTextColor="#ccc"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TextInput
                placeholder="Enter your password"
                style={newStyles.input}
                placeholderTextColor="#ccc"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
            <TouchableOpacity
              style={[
                newStyles.goButton,
                {
                  backgroundColor: email && password ? "#85E585" : "#E0E0E0",
                },
              ]}
              onPress={handleLogin}
              disabled={!email || !password}
            >
              <Text style={newStyles.goButtonText}>GO</Text>
            </TouchableOpacity>
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
  switchText: {
    marginTop: 36,
    color: "#8C8C8C",
    textDecorationLine: "underline",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Poppins-Regular",
  },
});
