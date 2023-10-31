import { StatusBar } from 'expo-status-bar';
import { Button, Dimensions, Platform, StyleSheet, Text, View, Image } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import {bundleResourceIO, decodeJpeg} from "@tensorflow/tfjs-react-native";
import React, { useEffect } from 'react';
import { Camera, CameraType } from 'expo-camera';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import * as blazeface from "@tensorflow-models/blazeface";
import * as FileSystem from 'expo-file-system';
import * as faceDetection from '@tensorflow-models/face-detection';
import * as jpeg from 'jpeg-js';
import { BoundingBox } from '@tensorflow-models/face-detection/dist/shared/calculators/interfaces/shape_interfaces';

const { width, height } = Dimensions.get("window");
const TensorCamera = cameraWithTensors(Camera);
const previewLeft = 0;
const previewTop = 60;
const previewWidth = 355;
const previewHeight = 500;
const classes = ["Angry", "Disgust", "Fear", "Happy", "Neutral", "Sad", "Surprise"];

export default function App() {
  const [model, setModel] = React.useState<void | tf.LayersModel>(undefined);
  const [type, setType] = React.useState(CameraType.front);
  const [isModelReady, setIsModelReady] = React.useState(false);
  const [faceDetectionModel, setFaceDetectionModel] = React.useState<blazeface.BlazeFaceModel>();
  // const [faceDetectionModel, setFaceDetectionModel] = React.useState<faceDetection.FaceDetector>();
  const [modelFaces, setModelFaces] = React.useState<{faces: blazeface.NormalizedFace[]}>({faces: []});
  const [result, setResult] = React.useState("");
  const [boundingBoxStyle, setBoundingBoxStyle] = React.useState({});

  const modelJSON = require("./model.json");
  const modelWeights = require("./group1-shard1of1.bin");
  let requestAnimationFrameId = 0;
  let frameCount = 0;
  let makePredictionsEveryNFrames = 10;
  const tensorDims = {height: 48, width: 48, depth: 3}

  const scale = {
    height: width / 48,
    width: (height * 0.7) / 48,
  };
  
  // Load the model and print the summary
  // const model = await tf.loadLayersModel("./model.json").then((model) => console.log(model.summary()));
  const loadModel = async () => {
    const model = await tf.loadLayersModel(bundleResourceIO(modelJSON, modelWeights)).catch(e => console.log(e));

    setModel(model);
    setIsModelReady(true);
  }

  const loadFaceDetectionModel = async () => {
    const model = await blazeface.load();
    console.log("Face detection model loaded")
    // const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
    // const detectorConfig: any = {
    //   runtime: 'tfjs',
    // };
    // const detector = await faceDetection.createDetector(model, detectorConfig);
    setFaceDetectionModel(model);
  };

  const indexOfMax = (arr : any) => {
    var max: Number = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return { max, maxIndex};
  }

  // Handle the camera stream and classify the image
  const handleCameraStream = (images: any) => {
    const loop = async () => {
      if (frameCount % makePredictionsEveryNFrames === 0) {
        const nextImageTensor = images.next().value;
        if (model && faceDetectionModel) {
          const faces = await faceDetectionModel.estimateFaces(nextImageTensor, true);
          const scale = {
            height: styles.camera.height / tensorDims.height,
            width: styles.camera.width / tensorDims.width
          };

          if (faces.length > 0) {
            setModelFaces({ faces });
            const face = faces[0];
            const topLeft = face.topLeft as tf.Tensor1D;
            const bottomRight = face.bottomRight as tf.Tensor1D;

            const normTopLeft = topLeft.div(nextImageTensor.shape.slice(-3, -2));
            const normBottomRight = bottomRight.div(nextImageTensor.shape.slice(-3, -2));
            const width = Math.floor(
              (bottomRight.dataSync()[0] - topLeft.dataSync()[0]) * scale.width
            );
            const height = Math.floor(
              (bottomRight.dataSync()[1] - topLeft.dataSync()[1]) * scale.height
            );
            const boxes = tf
            .concat([normTopLeft.dataSync(), normBottomRight.dataSync()])
            .reshape([-1, 4]);
            let crop = tf.image.cropAndResize(
              nextImageTensor.reshape([1, 48, 48, 3]),
              boxes as any,
              [0],
              [height, width]
            );
            // Convert to grayscale
            const rgb_weights = [0.2989, 0.5870, 0.1140]
            let image = tf.mul(crop, rgb_weights)
            image = tf.sum(image, -1)
            image = tf.expandDims(image, -1)

            const alignCorners = true;
            const imageResize = tf.image.resizeBilinear(
              image as any,
              [48, 48],
              alignCorners
            );
            const test = imageResize.div(255)
            const prediction = model.predict(test) as tf.Tensor;
            const { max, maxIndex } = indexOfMax(prediction.dataSync())
            const result = "Classification is " + classes[maxIndex] + " with a probablity of " + max
            setResult(result)
          }
           
          };
          
      
        //tf.dispose(imageTensor)
        tf.dispose(nextImageTensor);
      }
      frameCount += 1;
      frameCount = frameCount % makePredictionsEveryNFrames;
      requestAnimationFrameId = requestAnimationFrame(loop);
    }
    loop();
  };

  let textureDims: { height: any; width: any };
  Platform.OS === "ios"
    ? (textureDims = { height: 1920, width: 1080 })
    : (textureDims = { height: 1920, width: 1080 });

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    
    await tf.ready()
    await loadFaceDetectionModel()
    await loadModel()
    console.log("Model loaded")
  })();
  }, [setModel])

  const renderBoundingBoxes = () => {
    const { faces } = modelFaces;
    const scale = {
      height: styles.camera.height / tensorDims.height,
      width: styles.camera.width / tensorDims.width
    };
    const flipHorizontal = Platform.OS === "ios" ? false : true;
    if (faces.length > 0) {
      return faces.map((face, i) => {
        const topLeft = face.topLeft as tf.Tensor1D;
        const bottomRight = face.bottomRight as tf.Tensor1D;
        const bbLeft = topLeft.dataSync()[0] * scale.width;
        const boxStyle = Object.assign({}, styles.bbox,{
          left: flipHorizontal
            ? previewWidth - bbLeft - previewLeft
            : bbLeft + previewLeft,
          top: topLeft.dataSync()[1] * scale.height + 20,
          width:
            (bottomRight.dataSync()[0] - topLeft.dataSync()[0]) * scale.width,
          height:
            (bottomRight.dataSync()[1] - topLeft.dataSync()[1]) * scale.height
        });
        return <View style={boxStyle} key={`faces${i}}`}></View>;
      });
    }
  };

  const handleFaceDetected = async (faces: any) => {
    if (faces.faces.length > 0) {
      const box = faces.faces[0].bounds
    console.log(faces.faces[0].bounds)
    setBoundingBoxStyle({
      position: 'absolute',
      left: box.origin.x,
      top: box.origin.y * 1.3,
      width: box.size.width , 
      height: box.size.height + 100,
      borderWidth: 2,
      borderColor: 'red',
      zIndex: 1000
    });
    } else {
      setBoundingBoxStyle({})
    }
  }

  useEffect(() => {
    return () => {
      cancelAnimationFrame(requestAnimationFrameId);
    }
  }, [requestAnimationFrameId])
 
  return (
    <View>
      <View style={styles.cameraContainer}>
        <TensorCamera
          // Standard Camera props
          style={styles.camera}
          type={type}
          zoom={0}
          // Tensor related props
          cameraTextureHeight={textureDims.height}
          cameraTextureWidth={textureDims.width}
          resizeHeight={tensorDims.height}
          resizeWidth={tensorDims.width}
          resizeDepth={3}
          onReady={handleCameraStream}
          autorender={true}
          useCustomShadersToResize={false}
        />
        {renderBoundingBoxes()}
        
      </View>
      <View style={styles.result}>{result.length > 0 && <Text>{result}</Text>}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',
  },
  result: {
    position: "absolute",
    width: "100%",
    height: "40%",
    top: "120%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "60%",
    backgroundColor: "#fff"
  },
  camera: {
    position: "absolute",
    left: previewLeft,
    top: previewTop,
    width: previewWidth,
    height: previewHeight,
    zIndex: 1,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 0
  },
  bbox: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "red",
    borderRadius: 1,
    zIndex: 1000
  },
});
