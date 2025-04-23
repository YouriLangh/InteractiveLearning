import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { Skia, PaintStyle } from "@shopify/react-native-skia";
import RNFS from "react-native-fs";
import axios, { AxiosError } from "axios";

import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useSkiaFrameProcessor,
} from "react-native-vision-camera";
import { useResizePlugin } from "vision-camera-resize-plugin";
import { Worklets, useRunOnJS } from "react-native-worklets-core";

const paint = Skia.Paint();
paint.setStyle(PaintStyle.Fill);
paint.setStrokeWidth(4);
paint.setColor(Skia.Color("red"));

export default function Explore() {
  const device = useCameraDevice("back");
  const camera = useRef<Camera>(null);
  const { hasPermission, requestPermission } = useCameraPermission();
  const { resize } = useResizePlugin();
  const [imageBase64, setImageBase64] = useState<string | null>(null);


  async function takeAndUploadSnapshot() {
    const snapshot = await camera.current?.takeSnapshot({ quality: 90 });
    console.log("Taking photo...");
    if (!snapshot?.path) return;

    const fileUri = snapshot.path;
    const fileType = "image/jpeg";
    // Convert the image to base64
    const base64Image = await RNFS.readFile(fileUri, "base64");
    // console.log(base64Image);

    try {
      const response = await axios.post("http://192.168.129.9:5000/api/upload/solve", {
        image: base64Image,
        fileType: fileType, 
      });
      setImageBase64(response.data.processedImage);
      console.log("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image", error);
    }
  }

  if (device == null || !hasPermission)
    return (
      <Text style={StyleSheet.absoluteFill} onPress={requestPermission}>
        Give Permission
      </Text>
    );

  return (
    <View style={StyleSheet.absoluteFillObject}>
      {imageBase64 && (
        <Image
          source={{ uri: `data:image/png;base64,${imageBase64}` }}
          style={styles.preview}
          resizeMode="contain"
        />
      )}

      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
        ref={camera}
        photoQualityBalance="speed"
        resizeMode="contain"
        outputOrientation="device"
        enableFpsGraph={true}
      />
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
        <Text style={{ color: "white" }}>Take image</Text>
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
});
