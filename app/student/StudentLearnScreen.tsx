import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Vibration,
  Animated,
  Image,
} from "react-native";
import Sound from "react-native-sound";
import RNFS from "react-native-fs";
import axios from "axios";
import { useRouter } from "expo-router";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import HapticFeedback from "react-native-haptic-feedback";
import LottieView from "lottie-react-native";
import { useLocalSearchParams } from "expo-router";
import BackgroundWrapper from "../components/BackgroundWrapper";
Sound.setCategory("Playback");

const correctSound = new Sound("correct.mp3", Sound.MAIN_BUNDLE);

export default function StudentLearnScreen() {
  const { chapterId, exerciseNr, id, name, stars, answer } =
    useLocalSearchParams();
  const router = useRouter();
  const device = useCameraDevice("back");
  const formats = device?.formats;
  // const bestFormat = formats?.find(
  //   (format) => format.photoWidth === 3264 && format.photoHeight === 2448
  // );
  const bestFormat = formats?.find(
    (format) => format.photoWidth === 1280 && format.photoHeight === 960
  );
  const camera = useRef<Camera>(null);
  const { hasPermission, requestPermission } = useCameraPermission();
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [showSolveDialogue, setShowSolveDialogue] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [attemptMade, setAttemptMade] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const [detectedDots, setDetectedDots] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 6,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const dialogueShakeAnim = useRef(new Animated.Value(0)).current;
  const triggerDialogueShake = () => {
    Animated.sequence([
      Animated.timing(dialogueShakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(dialogueShakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(dialogueShakeAnim, {
        toValue: 6,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(dialogueShakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const vibrateFeedback = (type: "correct" | "wrong") => {
    const pattern = type === "correct" ? [0, 300] : [0, 100, 100, 100];
    Vibration.vibrate(pattern);
    HapticFeedback.trigger(
      type === "correct" ? "notificationSuccess" : "notificationError",
      {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      }
    );
  };

  async function takeAndUploadSnapshot() {
    setisLoading(true);
    const photo = await camera.current?.takePhoto();
    if (!photo?.path) return setisLoading(false);

    const base64Image = await RNFS.readFile(photo.path, "base64");

    try {
      const response = await axios.post(
        "http://192.168.129.9:5000/api/upload/solve",
        {
          image: base64Image,
          fileType: "image/jpeg",
          answer: 12,
        }
      );
      setisLoading(false);
      setDetectedDots(response.data.darkSpotCount);
      const solved = response.data.solved;
      setImageBase64(response.data.processedImage);
      setTimeout(() => {
        if (solved) {
          setShowSolveDialogue(true);
          triggerDialogueShake;
          vibrateFeedback("correct");
          correctSound.play();
          setIsFrozen(true); // freeze the camera
          setTimeout(() => {
            setShowSolveDialogue(false);
            setIsFrozen(false);
            console.log("Navigating to next screen");
          }, 1500);
        } else {
          vibrateFeedback("wrong");
          triggerShake();
          setIsFrozen(true);
          setShowPreview(true);
          setAttemptMade(true); // Mark that an attempt has been made
        }
      }, 150);
    } catch (error) {
      console.error("Upload failed:", error);
    }
    setisLoading(false);
  }

  if (device == null || !hasPermission) {
    return (
      <Text style={StyleSheet.absoluteFill} onPress={requestPermission}>
        Give Permission
      </Text>
    );
  }

  return (
    <BackgroundWrapper nav={true}>
      <View style={{ flex: 1, alignItems: "center", paddingTop: 30 }}>
        <Text
          style={{
            fontSize: 26,
            fontFamily: "Poppins-Bold",
            marginBottom: 20,
            width: "85%",
            lineHeight: 32, // Add line height for better spacing
            letterSpacing: 1, // Add letter spacing for more readability
          }}
        >
          Chapter {chapterId}: Exercise {exerciseNr}
        </Text>
        <Text
          style={{
            fontSize: 24,
            fontFamily: "Poppins-Regular",
            marginBottom: 6,
          }}
        >
          {name}
        </Text>
        <Animated.View
          style={[
            styles.cameraContainer,
            {
              transform: [{ translateX: shakeAnim }],
              borderColor: showPreview ? "#C80909" : "gray",
              borderWidth: showPreview ? 5 : 0,
            },
          ]}
        >
          <Camera
            style={[StyleSheet.absoluteFill]}
            device={device}
            isActive={!isFrozen}
            photo={true}
            ref={camera}
            format={bestFormat ?? undefined}
            photoQualityBalance="speed"
            resizeMode="contain"
            outputOrientation="device"
            enableFpsGraph={false}
          />
          {imageBase64 && showPreview && (
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 20,
                },
              ]}
            >
              <Image
                source={{ uri: `data:image/png;base64,${imageBase64}` }}
                style={[StyleSheet.absoluteFill, { zIndex: 10 }]}
                resizeMode="contain"
              />
              <Text style={styles.wrongText}>
                We see {detectedDots}, but the exercise required {answer}
              </Text>
            </View>
          )}
          {/* Loading Indicator */}
          {isLoading && (
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
                <LottieView
                  style={{ width: 100, height: 150 }}
                  source={require("@/assets/animations/Loading_Animation.json")} // Use your animation file path here
                  autoPlay
                  loop
                />
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
                  Loading...
                </Text>
              </View>
            </View>
          )}
        </Animated.View>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[
              styles.captureButton,
              { backgroundColor: attemptMade ? "rgb(233, 99, 99)" : "#99D881" },
            ]}
            onPress={() => {
              if (attemptMade && showPreview && !isLoading) {
                // Reset the camera and preview state for a new attempt
                setShowPreview(false);
                setIsFrozen(false);
                setAttemptMade(false); // Reset attempt
              } else {
                // Proceed with the first attempt
                takeAndUploadSnapshot();
              }
            }}
          >
            <Image
              style={{
                width: attemptMade ? 24 : 32,
                height: attemptMade ? 24 : 32,
                marginHorizontal: 24,
              }}
              source={
                attemptMade
                  ? require("@/assets/images/close.png")
                  : require("@/assets/images/check.png")
              }
            />
            <Text
              style={{
                color: "white",
                fontSize: 28,
                fontFamily: "Poppins-Regular",
              }}
            >
              {attemptMade ? "Try Again" : "Try it!"}
            </Text>
          </TouchableOpacity>
        </View>

        {showSolveDialogue && (
          <Modal
            animationType="fade"
            transparent={true}
            visible={showSolveDialogue}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Animated.View
                style={[
                  styles.dialogue,
                  { transform: [{ translateX: dialogueShakeAnim }] },
                ]}
              >
                <Text
                  style={{
                    color: "#3F741D",
                    fontSize: 32,
                    fontFamily: "Poppins-Bold",
                  }}
                >
                  Exercise Solved!
                </Text>
                <Image
                  style={{ marginTop: 16, position: "relative", left: -10 }}
                  source={require("@/assets/images/MascotThumbsUp.png")}
                />
              </Animated.View>
            </View>
          </Modal>
        )}
      </View>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    width: "65%",
    height: "60%",
    borderRadius: 5,
    overflow: "hidden",
  },
  wrongText: {
    fontFamily: "Poppins-SemiBold",
    zIndex: 10,
    color: "rgba(186, 4, 4, 100)",
    fontSize: 24,
  },
  buttonsContainer: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "center",
    width: "40%",
  },
  captureButton: {
    paddingRight: 40,
    height: 80,
    zIndex: 10,
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#99D881",
    alignItems: "center",
  },
  dialogue: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: 10,
    justifyContent: "center",
    paddingHorizontal: 60,
    paddingVertical: 30,
    backgroundColor: "#C0F5C6",
    zIndex: 20,
  },
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
