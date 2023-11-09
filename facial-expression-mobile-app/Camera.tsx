import {
  Button,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  LogBox,
} from "react-native";
import * as tf from "@tensorflow/tfjs";
import { bundleResourceIO, decodeJpeg } from "@tensorflow/tfjs-react-native";
import React, { useEffect } from "react";
import { Camera, CameraType } from "expo-camera";
import { cameraWithTensors } from "@tensorflow/tfjs-react-native";
import * as blazeface from "@tensorflow-models/blazeface";
import {
  classes,
  emojiClasses,
  previewHeight,
  previewLeft,
  previewTop,
  previewWidth,
} from "./constants";
import { indexOfMax } from "./helper";
import { styles } from "./styles";

const TensorCamera = cameraWithTensors(Camera);
let textureDims: { height: any; width: any };
Platform.OS === "ios"
  ? (textureDims = { height: 1920, width: 1080 })
  : (textureDims = { height: 1920, width: 1080 });

// Disable errors on client app
LogBox.ignoreAllLogs(true);

export default function App({route} : any ) {
  const [model, setModel] = React.useState<tf.LayersModel>(route.params.customModel);
  const [type, setType] = React.useState(CameraType.front);
  const [faceDetectionModel, setFaceDetectionModel] =
    React.useState<blazeface.BlazeFaceModel>(route.params.faceDetectionModel);
  const [modelFaces, setModelFaces] = React.useState<{
    faces: blazeface.NormalizedFace[];
  }>({ faces: [] });
  const [result, setResult] = React.useState("");

  let requestAnimationFrameId = 0;
  let frameCount = 0;
  let makePredictionsEveryNFrames = 10;
  const tensorDims = { height: 48, width: 48, depth: 3 };

  // Handle the camera stream and classify the image
  const handleCameraStream = (images: any) => {
    const loop = async () => {
      if (frameCount % makePredictionsEveryNFrames === 0) {
        const nextImageTensor = images.next().value;
        if (model && faceDetectionModel) {
          const faces = await faceDetectionModel.estimateFaces(
            nextImageTensor,
            true
          );
          const scale = {
            height: styles.camera.height / tensorDims.height,
            width: styles.camera.width / tensorDims.width,
          };

          if (faces.length > 0) {
            setModelFaces({ faces });
            const face = faces[0];
            const topLeft = face.topLeft as tf.Tensor1D;
            const bottomRight = face.bottomRight as tf.Tensor1D;

            const normTopLeft = topLeft.div(
              nextImageTensor.shape.slice(-3, -2)
            );
            const normBottomRight = bottomRight.div(
              nextImageTensor.shape.slice(-3, -2)
            );
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
            const rgb_weights = [0.2989, 0.587, 0.114];
            let image = tf.mul(crop, rgb_weights);
            image = tf.sum(image, -1);
            image = tf.expandDims(image, -1);

            const alignCorners = true;
            const imageResize = tf.image.resizeBilinear(
              image as any,
              [48, 48],
              alignCorners
            );
            const test = imageResize.div(255);
            const prediction = model.predict(test) as tf.Tensor;
            const { max, maxIndex } = indexOfMax(prediction.dataSync());
            // const result =
            //   "Classification is " +
            //   classes[maxIndex] +
            //   " with a probablity of " +
            //   max;
            const result = "You are feeling " + emojiClasses[maxIndex] + " " + classes[maxIndex] + " right now";
            setResult(result);
            tf.dispose(prediction);
            tf.dispose(imageResize);
            tf.dispose(image);
          } else {
            setResult("No faces detected 🥱");
          }
        }

        tf.dispose(nextImageTensor);
      }
      frameCount += 1;
      frameCount = frameCount % makePredictionsEveryNFrames;
      requestAnimationFrameId = requestAnimationFrame(loop);
    };
    loop();
  };

  useEffect(() => {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
        await tf.ready();
      })();
  }, []);

//   const renderBoundingBoxes = () => {
//     const { faces } = modelFaces;
//     const scale = {
//       height: styles.camera.height / tensorDims.height,
//       width: styles.camera.width / tensorDims.width,
//     };
//     const flipHorizontal = Platform.OS === "ios" ? false : true;
//     if (faces.length > 0) {
//       return faces.map((face, i) => {
//         const topLeft = face.topLeft as tf.Tensor1D;
//         const bottomRight = face.bottomRight as tf.Tensor1D;
//         const bbLeft = topLeft.dataSync()[0] * scale.width + 120;
//         const boxStyle = Object.assign({}, styles.bbox, {
//           left: flipHorizontal
//             ? previewWidth - bbLeft - previewLeft
//             : bbLeft + previewLeft,
//           top: topLeft.dataSync()[1] * scale.height + 20,
//           width:
//             (bottomRight.dataSync()[0] - topLeft.dataSync()[0]) * scale.width,
//           height:
//             (bottomRight.dataSync()[1] - topLeft.dataSync()[1]) * scale.height,
//         });
//         return <View style={boxStyle} key={`faces${i}}`}></View>;
//       });
//     }
//   };

  useEffect(() => {
    return () => {
      cancelAnimationFrame(requestAnimationFrameId);
    };
  }, [requestAnimationFrameId]);

  return (
    <View style={styles.cameraPageContainer}>
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
        {/* {renderBoundingBoxes()} */}
      </View>
      <View style={styles.resultContainer}>
        {result.length > 0 && <Text style={styles.resultText}>{result}</Text>}
      </View>
    </View>
  );
}
