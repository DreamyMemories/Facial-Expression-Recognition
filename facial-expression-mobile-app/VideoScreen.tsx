import { View, Text, Button } from "react-native";
import React, { useEffect } from "react";
import { bundleResourceIO } from "@tensorflow/tfjs-react-native";
import * as tf from "@tensorflow/tfjs";
import { useState } from "react";
const modelJSON = require("./model.json");
const modelWeights = require("./group1-shard1of1.bin");

export function VideoScreen({ navigation }: any) {
  const [model, setModel] = useState<tf.LayersModel | undefined>(undefined);
  // Try loading the model here
  const loadModel = async () => {
    await tf.ready();
    const model = await tf
      .loadLayersModel(bundleResourceIO(modelJSON, modelWeights))
      .catch((e) => console.log(e));
    if (model) {
      setModel(model);
    }
  };

  useEffect(() => {
    (async () => {
      await loadModel();
    })();
  }, []);

  return (
    <View>
      <Text>Click the start button to begin recognising your emotions</Text>
      <View>
        <Button
          title="Start"
          disabled={model === undefined}
          onPress={() => navigation.navigate("Camera", {customModel: model})}
        />
      </View>
    </View>
  );
}
