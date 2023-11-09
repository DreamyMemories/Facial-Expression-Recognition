import { View, Text, Button } from "react-native";
import React, { useEffect } from "react";
import { bundleResourceIO } from "@tensorflow/tfjs-react-native";
import * as tf from "@tensorflow/tfjs";
import { useState } from "react";
import * as blazeface from "@tensorflow-models/blazeface";
const modelJSON = require("./model.json");
const modelWeights = require("./group1-shard1of1.bin");

export function VideoScreen({ navigation }: any) {
  const [model, setModel] = useState<tf.LayersModel | undefined>(undefined);
  const [faceDetectionModel, setFaceDetectionModel] =  React.useState<blazeface.BlazeFaceModel | undefined>(undefined);
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

  function CheckModelLoaded () {
    if (model === undefined && faceDetectionModel === undefined) {
        return <Text>Loading Models...</Text>
    }
    return <Text>Press the start button to begin recognising your emotions</Text>
  }

  useEffect(() => {
    (async () => {
      await tf.ready();
      await loadModel();
      await loadFaceDetectionModel();
    })();
  }, []);

  return (
    <View>
      <View>
        <CheckModelLoaded />
        <Button
          title="Start"
          disabled={model === undefined && faceDetectionModel === undefined}
          onPress={() => navigation.navigate("Camera", {customModel: model, faceDetectionModel: faceDetectionModel})}
        />
      </View>
    </View>
  );
}
