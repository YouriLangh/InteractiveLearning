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
import axios from "axios";
import { useRouter } from "expo-router";
import LoadingIndicator from "../components/ui/LoadingIndicator";
import HapticFeedback from "react-native-haptic-feedback";
import { useLocalSearchParams } from "expo-router";
import BackgroundWrapper from "../components/BackgroundWrapper";
import { getSecureValue } from "@/services/secureStorage";
import Constants from "expo-constants";
Sound.setCategory("Playback");

const correctSound = new Sound("correct.mp3", Sound.MAIN_BUNDLE);

export default function StudentLearnScreen() {
  const { chapterId, exerciseNr, id, title, stars, answer } =
    useLocalSearchParams();
  const router = useRouter();
  const CAMERA_SERVER_URL = "http://192.168.1.2:56000"; // IP Webcam server URL
  const SNAPSHOT_URL = CAMERA_SERVER_URL + "/photo.jpg"; // IP Webcam snapshot endpoint
  
  const apiUrl = Constants.expoConfig?.extra?.apiUrl || "http://192.168.1.2:5000/api";
  const BACKEND_URL = `${apiUrl}/upload/solve`;

  const [isSolving, setIsSolving] = useState(false);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [showSolveDialogue, setShowSolveDialogue] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [attemptMade, setAttemptMade] = useState(false);
  const [currentAttemptId, setCurrentAttemptId] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState<number>(0);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [isLeaving, setIsLeaving] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const [detectedDots, setDetectedDots] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const expectedAnswer = parseInt(answer as string, 10);
  const [isCameraAvailable, setIsCameraAvailable] = useState<boolean | null>(
    null
  );
  async function checkCameraAvailable(camera_server_url: string) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout

    try {
      const res = await fetch(
        `${camera_server_url}/photo.jpg?cacheBust=${Date.now()}`,
        {
          method: "HEAD",
          signal: controller.signal,
        }
      );
      setIsCameraAvailable(res.ok);
    } catch (err) {
      console.warn("Camera server not reachable:", err);
      setIsCameraAvailable(false);
    } finally {
      clearTimeout(timeoutId);
    }
  }
  useEffect(() => {
    checkCameraAvailable(CAMERA_SERVER_URL);
  }, []);

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

  useEffect(() => {
    if (!isSolving || showPreview || attemptMade || isFrozen) return;
    const processFrame = async () => {
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
              handleNavigation();
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
    };
    processFrame();
  }, [isSolving, showPreview, attemptMade, isFrozen]);

  // Create or get existing attempt when component loads
  useEffect(() => {
    const createAttempt = async () => {
      try {
        const exerciseIdStr = id as string;
        if (!exerciseIdStr) {
          console.error("No exercise ID provided");
          return;
        }

        const token = await getSecureValue('authToken');
        console.log(`[Time Tracking] Creating new attempt for exercise: ${exerciseIdStr}`);

        const response = await axios.post(`${apiUrl}/attempts`, 
          {
            exerciseId: exerciseIdStr
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setCurrentAttemptId(response.data.id);
        const now = Date.now();
        setStartTime(now);
        console.log(`[Time Tracking] Started timer at: ${new Date(now).toISOString()}`);
        console.log(`[Time Tracking] Attempt created with ID: ${response.data.id}`);
      } catch (err) {
        console.error("[Time Tracking] Failed to create attempt:", err);
        if (axios.isAxiosError(err)) {
          console.error("Error details:", {
            status: err.response?.status,
            data: err.response?.data,
            url: err.config?.url
          });
        }
      }
    };

    createAttempt();
  }, [id]);

  // Handle cleanup when component unmounts or student leaves
  useEffect(() => {
    return () => {
      if (currentAttemptId && !isLeaving) {
        console.log('[Time Tracking] Component unmounting - saving final time');
        const finalTime = Math.floor((Date.now() - startTime) / 1000);
        saveAttemptResult('', false, true); // true indicates it's a cleanup save
      }
    };
  }, [currentAttemptId, startTime, isLeaving]);

  // Function to save the attempt result
  const saveAttemptResult = async (answer: string, isCorrect: boolean, isCleanup: boolean = false) => {
    if (!currentAttemptId) {
      console.error("No attempt ID found, cannot save result");
      return;
    }

    try {
      const token = await getSecureValue('authToken');
      const endTime = Date.now();
      const timeSpent = Math.floor((endTime - startTime) / 1000);
      
      if (isCleanup) {
        console.log(`[Time Tracking] Saving time on exit: ${timeSpent} seconds`);
      } else {
        console.log(`[Time Tracking] Stopped timer at: ${new Date(endTime).toISOString()}`);
        console.log(`[Time Tracking] Time spent on attempt: ${timeSpent} seconds`);
      }
      
      setTotalTimeSpent(prev => {
        const newTotal = prev + timeSpent;
        console.log(`[Time Tracking] Total time spent so far: ${newTotal} seconds`);
        return newTotal;
      });
      
      const requestData = {
        answer,
        isCorrect,
        timeTaken: timeSpent,
        isCleanup
      };
      
      console.log(`[Time Tracking] Saving attempt result with time: ${timeSpent} seconds`);
      const response = await axios.put(
        `${apiUrl}/attempts/${currentAttemptId}/answer`, 
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log("[Time Tracking] Attempt result saved successfully");
    } catch (err) {
      console.error("[Time Tracking] Failed to save attempt result:", err);
      if (axios.isAxiosError(err)) {
        console.error("Error details:", {
          status: err.response?.status,
          data: err.response?.data,
          url: err.config?.url
        });
      }
    }
  };

  // Modify the navigation to StudentExerciseList
  const handleNavigation = () => {
    setIsLeaving(true);
    if (currentAttemptId) {
      console.log('[Time Tracking] Saving time before navigation');
      saveAttemptResult('', false, true);
    }
    router.push({
      pathname: "/student/StudentExerciseList",
      params: {
        refresh: "true"
      }
    });
  };

  // Reset timer when starting a new attempt
  const startNewAttempt = () => {
    const now = Date.now();
    setStartTime(now);
    console.log(`[Time Tracking] Started new attempt timer at: ${new Date(now).toISOString()}`);
    setIsSolving(true);
  };

  return (
    <BackgroundWrapper nav={true} role={"STUDENT"}>
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
            isCameraAvailable ? (
              <WebView
                source={{ uri: CAMERA_SERVER_URL + "/video" }}
                style={{ flex: 1 }}
                javaScriptEnabled
              />
            ) : (
              <View
                style={[StyleSheet.absoluteFill, { backgroundColor: "black" }]}
              >
                <LoadingIndicator text={"Looking for stream..."} />
                <TouchableOpacity
                  onPress={() => checkCameraAvailable(CAMERA_SERVER_URL)}
                  style={{
                    position: "absolute",
                    bottom: 20,
                    // left: "40%",
                    zIndex: 30,
                    backgroundColor: "rgb(54, 152, 197)",
                    paddingVertical: 10,
                    paddingHorizontal: 25,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 24,
                      fontFamily: "Poppins-Regular",
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    Refresh
                  </Text>
                </TouchableOpacity>
              </View>
            )
          ) : (
            <View
              style={{
                flex: 1,
                backgroundColor: "black",
                justifyContent: "center",
                alignItems: "center",
              }}
            ></View>
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
          {isLoading && <LoadingIndicator text={"Loading..."} />}

          {/* Solve/ Try again Buttons */}
          {isCameraAvailable && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.captureButton,
                  {
                    backgroundColor: attemptMade
                      ? "rgb(233, 99, 99)"
                      : "#99D881",
                  },
                ]}
                onPress={() => {
                  if (attemptMade && showPreview && !isLoading) {
                    // Reset the camera and preview state for a new attempt
                    setShowPreview(false);
                    setIsFrozen(false);
                    setAttemptMade(false); // Reset attempt
                    setIsSolving(false);
                    startNewAttempt(); // Start timing for new attempt
                  } else {
                    // Start new attempt
                    startNewAttempt();
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
                  {attemptMade ? "Try Again" : "Try it!"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
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
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    zIndex: 20,
    height: 70,
    flexDirection: "row",
    justifyContent: "center",
  },
  captureButton: {
    opacity: 0.7,
    paddingRight: 40,
    height: "100%",
    zIndex: 20,
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
