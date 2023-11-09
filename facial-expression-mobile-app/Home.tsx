import { View, Text, Pressable, Image } from "react-native";
import React from "react";
import { styles } from "./styles";
import SafeAreaView from 'react-native-safe-area-view';

export function HomeScreen({ navigation }: any) {
    return (
        <View style={styles.homeContainer} >
            <Image source={require('./assets/emotion.jpg')} style={styles.homeImage} />
            <Text style={styles.homeMainText}>Welcome to the Facial Expression Recognition App, press Start to continue</Text>
            <Pressable  onPress={() => navigation.navigate('Video Screen')} style={styles.homeButtonContainer}>
                <Text style={styles.homeButtonText}>Start</Text>
            </Pressable>
        </View>
    )
}