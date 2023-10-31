import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import {bundleResourceIO} from "@tensorflow/tfjs-react-native";
import React, { useEffect } from 'react';

export default function App() {
  const [model, setModel] = React.useState<void | tf.LayersModel>(undefined);
  const modelJSON = require("./model.json");
  const modelWeights = require("./group1-shard1of1.bin");
  // Load the model and print the summary
  // const model = await tf.loadLayersModel("./model.json").then((model) => console.log(model.summary()));
  const loadModel = async () => {
    const model = await tf.loadLayersModel(bundleResourceIO(modelJSON, modelWeights))
    .then(model => {
      console.log(model.summary());
      return model}).catch(e => console.log(e));

    setModel(model);
  }

  useEffect(() => {
    tf.ready().then(() => {
      console.log("TF ready");
      loadModel();
    })
  }, [setModel])

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app! test</Text>
      <StatusBar style="auto" />
      <Button onPress={loadModel} title="Load Model"/>
      {model && <Text>Model Loaded</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
