import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
<<<<<<< HEAD
  ImageBackground,
  useWindowDimensions,
=======
>>>>>>> Fahim2
  Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import BackgroundWrapper from "@/app/components/BackgroundWrapper";
<<<<<<< HEAD
import ReturnButton from "@/app/components/ui/ReturnButton";
=======
>>>>>>> Fahim2
import { useAuth } from "@/context/AuthContext";
import * as ScreenOrientation from "expo-screen-orientation";

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { login } = useAuth();
<<<<<<< HEAD
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
=======

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
>>>>>>> Fahim2
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
<<<<<<< HEAD
      const user = await login(
        email,
        password,
        uiRole as "STUDENT" | "TEACHER"
      );
=======
      const user = await login(name, code, uiRole as "STUDENT" | "TEACHER");
>>>>>>> Fahim2

      if (user.role === "TEACHER") {
        router.replace("/teacher/ProfileScreen");
      } else {
        router.replace("/student/StudentExerciseList");
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      alert(error?.message || "Login failed. Please try again.");
<<<<<<< HEAD
      setEmail("");
      setPassword("");
=======
      setName("");
      setCode("");
>>>>>>> Fahim2
    }
  };

  return (
    <BackgroundWrapper nav={false}>
<<<<<<< HEAD
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
=======
      <View style={[styles.container]}>
        <View style={styles.rowContainer}>
          <View style={styles.leftSection}>
            <Image
              source={require("@/assets/images/mascott_tr.png")}
              style={styles.mascot}
            />
            <Image
              source={require("@/assets/images/small.png")}
              style={styles.smallCube}
            />
            <Image
              source={require("@/assets/images/medium.png")}
              style={styles.mediumCube}
            />
            <Image
              source={require("@/assets/images/large.png")}
              style={styles.largeCube}
            />
          </View>

          <View style={styles.rightSection}>
            <View style={{ flexDirection: "row", width: "100%" }}>
              <Text style={styles.title}>Welcome to </Text>
              <Text style={[styles.title, { color: "#D16413" }]}>Block</Text>
              <Text style={[styles.title, { color: "#487D33" }]}>Ed</Text>
              <Text style={styles.title}>!</Text>
            </View>

            {!isTeacherUI && (
              <>
                <Text style={{ fontFamily: "Poppins-Regular", fontSize: 18 }}>
                  Choose an avatar
                </Text>
                <Image
                  source={require("@/assets/images/avatar.png")}
                  style={styles.avatar}
                />
              </>
            )}

            <View style={{ width: "100%" }}>
              <TextInput
                placeholder="Enter your name"
                style={styles.input}
                placeholderTextColor="#ccc"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                placeholder="Enter your code"
                style={styles.input}
                placeholderTextColor="#ccc"
                value={code}
                onChangeText={setCode}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.goButton,
                {
                  backgroundColor: name && code ? "#85E585" : "#E0E0E0",
                },
              ]}
              onPress={handleLogin}
              disabled={!name || !code}
            >
              <Text style={styles.goButtonText}>GO</Text>
            </TouchableOpacity>

>>>>>>> Fahim2
            <TouchableOpacity
              onPress={() =>
                router.push(
                  isTeacherUI
                    ? "/auth/LoginScreen?role=student"
                    : "/auth/LoginScreen?role=teacher"
                )
              }
            >
<<<<<<< HEAD
              <Text style={newStyles.switchText}>
=======
              <Text style={styles.switchText}>
>>>>>>> Fahim2
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

<<<<<<< HEAD
const newStyles = StyleSheet.create({
=======
const styles = StyleSheet.create({
>>>>>>> Fahim2
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
<<<<<<< HEAD
    // borderColor: "red",
    // borderWidth: 1,
=======
>>>>>>> Fahim2
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
<<<<<<< HEAD
    position: "relative",
=======
>>>>>>> Fahim2
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
<<<<<<< HEAD
    elevation: 0,
=======
>>>>>>> Fahim2
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
<<<<<<< HEAD
    width: "50%", // a bit smaller width to make it oval
    borderRadius: 999, // full oval
=======
    width: "50%",
    borderRadius: 999,
>>>>>>> Fahim2
    marginTop: 20,
    paddingVertical: 8,
    shadowColor: "#000",
    boxShadow: "0 8px 8px rgba(0, 0, 0, 0.2)",
  },
  goButtonText: {
    color: "white",
    fontFamily: "Poppins-Bold",
<<<<<<< HEAD
    position: "relative",
    top: 2,
=======
>>>>>>> Fahim2
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
