import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Vibration,
  Animated,
  Image,
  Alert,
} from "react-native";
import { WebView } from "react-native-webview";
import Sound from "react-native-sound";
import RNFS from "react-native-fs";
import axios from "axios";
import { useRouter } from "expo-router";

import HapticFeedback from "react-native-haptic-feedback";
import LottieView from "lottie-react-native";
import { useLocalSearchParams } from "expo-router";
import BackgroundWrapper from "../components/BackgroundWrapper";
Sound.setCategory("Playback");

const correctSound = new Sound("correct.mp3", Sound.MAIN_BUNDLE);

export default function StudentLearnScreen() {
  const { chapterId, exerciseNr, id, title, stars, answer } =
    useLocalSearchParams();
  const router = useRouter();

  const [isSolving, setIsSolving] = useState(false);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [showSolveDialogue, setShowSolveDialogue] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [attemptMade, setAttemptMade] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const [detectedDots, setDetectedDots] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const expectedAnswer = parseInt(answer as string, 10);

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
  const CAMERA_SERVER_URL = "http://192.168.129.2:8080";
  const SNAPSHOT_URL = CAMERA_SERVER_URL + "/photo.jpg"; // IP Webcam snapshot endpoint
  const BACKEND_URL = "http://192.168.129.9:5000/api/upload/solve";
  useEffect(() => {
    console.log("Are we in solving mode? ", isSolving);
    if (!isSolving || showPreview || attemptMade || isFrozen) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${SNAPSHOT_URL}?cacheBust=${Date.now()}`);
        const blob = await res.blob();

        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const dataUrl = reader.result as string;
            const base64 = dataUrl.split(",")[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        setisLoading(true);
        setIsSolving(false);
        // Send to backend
        const response = await axios.post(BACKEND_URL, {
          image: base64,
          fileType: "image/jpeg",
          answer: answer,
        });

        console.log("Image sent to backend");
        setisLoading(false);
        setIsFrozen(true); // freeze the camera
        setDetectedDots(response.data.darkSpotCount);
        const solved = response.data.solved;
        setImageBase64(response.data.processedImage);
        setTimeout(() => {
          if (solved) {
            setShowSolveDialogue(true);
            triggerDialogueShake;
            vibrateFeedback("correct");
            correctSound.play();
            setTimeout(() => {
              setShowSolveDialogue(false);
              setIsFrozen(false);
              router.push({
                pathname: "/student/StudentExerciseList",
              });
            }, 1500);
          } else {
            vibrateFeedback("wrong");
            triggerShake();
            setShowPreview(true);
            setAttemptMade(true); // Mark that an attempt has been made
          }
        }, 150);
      } catch (err) {
        console.error("Frame capture or upload failed:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isSolving, showPreview, attemptMade, isFrozen]);

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
          {title}
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
          {!isFrozen ? (
            <WebView
              source={{ uri: CAMERA_SERVER_URL + "/video" }}
              style={{ flex: 1 }}
              javaScriptEnabled
            />
          ) : (
            <View
              style={{
                flex: 1,
                backgroundColor: "black",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 20 }}>Paused</Text>
            </View>
          )}

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
                {detectedDots === 0
                  ? "No blocks detected. Please try again."
                  : detectedDots < expectedAnswer
                  ? `We see ${detectedDots} blocks, but you need ${expectedAnswer}. Add ${
                      expectedAnswer - detectedDots
                    } more!`
                  : `We see ${detectedDots} blocks, but you need ${expectedAnswer}. Remove ${
                      detectedDots - expectedAnswer
                    }!`}
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
          <TouchableOpacity
            style={[
              styles.captureButton,
              {
                backgroundColor: attemptMade ? "rgb(233, 99, 99)" : "#99D881",
              },
            ]}
            onPress={() => {
              if (attemptMade && showPreview && !isLoading) {
                // Reset the camera and preview state for a new attempt
                setShowPreview(false);
                setIsFrozen(false);
                setAttemptMade(false); // Reset attempt
                setIsSolving(false);
              } else {
                // Proceed with the first attempt
                setIsSolving(!isSolving);
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
                fontSize: 24,
                fontFamily: "Poppins-Regular",
              }}
            >
              {attemptMade ? "Try Again" : "Solve automatically!"}
            </Text>
          </TouchableOpacity>
        </Animated.View>

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
    width: "55%",
    height: "80%",
    borderRadius: 5,
    overflow: "hidden",
  },
  wrongText: {
    fontFamily: "Poppins-SemiBold",
    zIndex: 10,
    color: "rgba(186, 4, 4, 100)",
    fontSize: 24,
  },
  captureButton: {
    position: "absolute",
    bottom: 20,
    left: "25%",
    opacity: 0.7,

    paddingRight: 40,
    height: 70,
    zIndex: 100,
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#99D881",
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
