import { StatusBar, StyleSheet } from 'react-native';
import { previewHeight, previewLeft, previewTop, previewWidth } from './constants';

const primaryColor = "#F2F6D0"
const secondaryColor = "#E4BE9E"

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      alignItems: 'center',
      justifyContent: 'center',
    },
    homeContainer: {
      backgroundColor: primaryColor,
      justifyContent: "center",
      padding: 20,
      paddingHorizontal: 50,
      height: "100%",
    },
    homeImage: {
      width: 400,
      height: 300,
      alignSelf: "center",
      marginBottom: 50,
    },
    homeMainText: {
      fontFamily:"Jetbrains",
      textAlign: "center",
      fontSize: 23,
      paddingBottom: 50,
      color: "#3d3d3d",
    },
    homeButtonContainer: {
      backgroundColor: secondaryColor,
      borderRadius: 10,
      padding: 30,
    },
    homeButtonText: {
      fontFamily:"Jetbrains",
      textAlign: "center",
      fontSize: 20,
      color: "#3d3d3d",
    },
    cameraPageContainer: {
      backgroundColor: primaryColor,
      height: "100%",
    },
    resultContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 50
    },
    resultText: {
      fontFamily: "Jetbrains",
      fontSize: 20,
      color: "#3d3d3d",
    },
    cameraContainer: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: primaryColor,
    },
    camera: {
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