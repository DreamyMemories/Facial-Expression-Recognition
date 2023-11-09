import { View, Text, Pressable, Image } from "react-native";
import React from "react";
import { styles } from "./styles";
import SafeAreaView from 'react-native-safe-area-view';

export function HomeScreen({ navigation }: any) {
    return (
        <View style={styles.homeContainer} >
            <Image source={{uri: "https://i.pinimg.com/originals/3b/49/07/3b490705701b457e9e9d9831b895dfba.gif"}} style={styles.homeImage} />
            <Text style={styles.homeMainText}>Welcome to the Facial Expression Recognition App.</Text>
            <Pressable  onPress={() => navigation.navigate('Video Screen')} style={styles.homeButtonContainer}>
                <Text style={styles.homeButtonText}>Start</Text>
            </Pressable>
        </View>
    )
}