import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native';
import { PaintStyle, Skia } from '@shopify/react-native-skia';
import {
  OpenCV,
  ObjectType,
  Rect,
  DataTypes,
  ColorConversionCodes,
  HoughModes,
} from 'react-native-fast-opencv';
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
  useSkiaFrameProcessor,
} from 'react-native-vision-camera';
import { useResizePlugin } from 'vision-camera-resize-plugin';
import { Worklets } from 'react-native-worklets-core';


export default function Explore() {
  const [processImage, setProcessImage] = useState(false);
  const device = useCameraDevice('back');

  // const format = useCameraFormat(device, Templates.FrameProcessing);
  const { hasPermission, requestPermission } = useCameraPermission();
 
  const { resize } = useResizePlugin();
 
  const handleDelayEvaluation = Worklets.createRunOnJS((boolean : false) => {
    setTimeout(() => setProcessImage(boolean), 3000);
      });
  useEffect(() => {
  console.log(device?.sensorOrientation)
  }, [device?.sensorOrientation]);


const frameProcessor = useSkiaFrameProcessor((frame) => {
  'worklet';

  frame.render()
  if(!processImage) return;
  const height = frame.height / 4;
  const width = frame.width / 4;

  // Resize the frame for efficiency
  const resized = resize(frame, {
    scale: { width, height },
    pixelFormat: 'bgr',
    dataType: 'uint8',
  });

  const src = OpenCV.bufferToMat('uint8', height, width, 3, resized);

  const gray = OpenCV.createObject(ObjectType.Mat, 0, 0, DataTypes.CV_8U);
  OpenCV.invoke('cvtColor', src, gray, ColorConversionCodes.COLOR_BGR2GRAY);
  //   const lowerBound = OpenCV.createObject(ObjectType.Scalar, 30, 60, 60);
//   const upperBound = OpenCV.createObject(ObjectType.Scalar, 50, 255, 255);
//   OpenCV.invoke('cvtColor', src, dst, ColorConversionCodes.COLOR_BGR2HSV);
//   OpenCV.invoke('inRange', dst, lowerBound, upperBound, dst);

  // Detect circles using HoughCircles
  const circles = OpenCV.createObject(ObjectType.Mat, 0, 0, DataTypes.CV_32F);
  OpenCV.invoke(
    'HoughCircles',
    gray,
    circles,
    HoughModes.HOUGH_GRADIENT,
    1.5,  // dp (resolution scale)
    20,   // minDist (distance between circles)
    50,   // param1 (Canny edge threshold)
    30,   // param2 (circle accumulator threshold)
  );
  // Convert circles to JS array
  const detectedCircles = OpenCV.matToBuffer(circles, 'uint8');

  console.log(`Detected dark circles: ${detectedCircles?.cols}`);

  OpenCV.clearBuffers(); // Clean memory
  handleDelayEvaluation(false);
}, [handleDelayEvaluation]);



  if (device == null || !hasPermission) return <Text style={StyleSheet.absoluteFill} onPress={requestPermission}>Give Permission</Text>;

  useEffect(() => {
    console.log(processImage)
  }, [processImage]);

  return (
    <View style={StyleSheet.absoluteFill}>
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
      // format={format}
      resizeMode='contain'
      outputOrientation='device'
      // photoQualityBalance = "balanced"
      
      enableFpsGraph={true}
      frameProcessor={frameProcessor}
    />
    <TouchableOpacity style={{ position: 'absolute', bottom: 20, left: 20, backgroundColor: "blue", padding:20 }} onPress={() => setProcessImage(true)}>
    <Text> Evaluate Image</Text>
    </TouchableOpacity>
    </View>
  );
}