import { Button, Dimensions, Platform, StyleSheet, Text, View, Image } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import {bundleResourceIO, decodeJpeg} from "@tensorflow/tfjs-react-native";
import React, { useEffect } from 'react';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import * as blazeface from "@tensorflow-models/blazeface";
import { classes, previewHeight, previewLeft, previewTop, previewWidth } from './constants';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { indexOfMax } from './helper';
import { styles } from './styles';
import { HomeScreen } from './Home';
import { VideoScreen } from './VideoScreen';
import Camera from './Camera';

const Stack = createNativeStackNavigator();

export default function App() {
  // Handle the camera stream and classify the image
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="VideoScreen" component={VideoScreen} />
        <Stack.Screen name="Camera" component={Camera} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


