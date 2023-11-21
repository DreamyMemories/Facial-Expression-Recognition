import { View, Text, Pressable, Image } from "react-native";
import React, { useEffect } from "react";
import { styles } from "./styles";
import SafeAreaView from "react-native-safe-area-view";
import { bundleResourceIO } from "@tensorflow/tfjs-react-native";
import * as tf from "@tensorflow/tfjs";
import { useState } from "react";
import * as blazeface from "@tensorflow-models/blazeface";

const modelJSON = require("./model/model.json");
const modelWeights = require("./model/group1-shard1of1.bin");

export function HomeScreen({ navigation }: any) {
  const [model, setModel] = useState<tf.LayersModel | undefined>(undefined);
  const [faceDetectionModel, setFaceDetectionModel] = React.useState<
    blazeface.BlazeFaceModel | undefined
  >(undefined);
  // Try loading the model here
  const loadModel = async () => {
    const model = await tf
      .loadLayersModel(bundleResourceIO(modelJSON, modelWeights))
      .catch((e) => console.log(e));
    if (model) {
      setModel(model);
    }
  };
  const loadFaceDetectionModel = async () => {
    const model = await blazeface.load();
    setFaceDetectionModel(model);
  };

  function CheckModelLoaded() {
    if (model === undefined && faceDetectionModel === undefined) {
      return <Text style={styles.modelLoadedText}>Loading Models...</Text>;
    }
    return (
      <Text style={styles.modelLoadedText}>Press the start button to begin recognising your emotions</Text>
    );
  }

  useEffect(() => {
    (async () => {
      await tf.ready();
      await loadModel();
      await loadFaceDetectionModel();
    })();
  }, []);
  return (
    <View style={styles.homeContainer}>
      <Image
        source={{
          uri: "https://i.pinimg.com/originals/3b/49/07/3b490705701b457e9e9d9831b895dfba.gif",
        }}
        style={styles.homeImage}
      />
      <Text style={styles.homeMainText}>
        Facial Expression Recognition App
      </Text>
      <CheckModelLoaded />
      <Pressable
        onPress={() => navigation.navigate("Camera", {customModel: model, faceDetectionModel: faceDetectionModel})}
        style={styles.homeButtonContainer}
        disabled={model === undefined && faceDetectionModel === undefined}
      >
        <Text style={styles.homeButtonText}>Start</Text>
      </Pressable>
    </View>
  );
}
