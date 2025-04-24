import React, { useState, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { Skia, PaintStyle } from "@shopify/react-native-skia";
import RNFS from "react-native-fs";
import axios, { AxiosError } from "axios";
import { useRouter } from 'expo-router';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";



export default function Explore() {
  const router = useRouter();
  const device = useCameraDevice("back");
  const camera = useRef<Camera>(null);
  const { hasPermission, requestPermission } = useCameraPermission();
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [showSolveDialogue, setShowSolveDialogue] = useState(false);

  async function takeAndUploadSnapshot() {
    const snapshot = await camera.current?.takeSnapshot({ quality: 90 });
    if (!snapshot?.path) return;

    const fileUri = snapshot.path;
    const fileType = "image/jpeg";

    // Convert the image to base64
    const base64Image = await RNFS.readFile(fileUri, "base64");

    try {
      const response = await axios.post("http://192.168.129.9:5000/api/upload/solve", {
        image: base64Image,
        fileType: fileType,
        answer: 12 
      });
      console.log("Solved?,", response.data.solved);
      setShowSolveDialogue(response.data.solved)
      setImageBase64(response.data.processedImage);
      console.log("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image", error);
    }
  }

  function handleDialogueClick() {
    setShowSolveDialogue(false);
    setImageBase64(null);
    console.log("Redirecting...")
    router.replace("/student/StudentExerciseList");
  }
  if (device == null || !hasPermission)
    return (
      <Text style={StyleSheet.absoluteFill} onPress={requestPermission}>
        Give Permission
      </Text>
    );

  return (
    <View style={StyleSheet.absoluteFill}>
      {imageBase64 && !showSolveDialogue &&
        <Image
          source={{ uri: `data:image/png;base64,${imageBase64}` }}
          style={StyleSheet.absoluteFill}
          resizeMode="contain"
        />}

{showSolveDialogue && <View style={styles.dialogue}>
      <Text style={{ color: "white", fontSize: 20 }}>
       Exercise Solved!
      </Text>
      <TouchableOpacity
        onPress={() => handleDialogueClick() }
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: 15,
        }}
      >
        <Text style={{ color: "white" }}>Close</Text>
      </TouchableOpacity>
    </View> 
}
      {!imageBase64 && <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
        ref={camera}
        photoQualityBalance="speed"
        resizeMode="contain"
        outputOrientation="device"
        enableFpsGraph={true}
      />}
      <TouchableOpacity
        style={{
          width: 100,
          height: 50,
          zIndex: 10, // Ensure button is on top of Camera
          position: "absolute",
          right: 0,
          bottom: 50,
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional background for visibility
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={takeAndUploadSnapshot}
      >
        <Text style={{ color: "white", }}>Take image</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  preview: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 500,
    height: 500,
    borderWidth: 1,
    borderColor: "white",
    zIndex: 20,
  },
  dialogue: {
    display: "flex",
    alignItems: "center",
    padding: 50,
    justifyContent: "space-between",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: [
      { translateX: '-50%' },
      { translateY: '-50%' },],
    width: 500,
    height: 300,
    backgroundColor: "rgb(36, 184, 85)",
    zIndex: 20,
  },
});
