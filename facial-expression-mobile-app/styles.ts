import { StyleSheet } from 'react-native';
import { previewHeight, previewLeft, previewTop, previewWidth } from './constants';

export const styles = StyleSheet.create({
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