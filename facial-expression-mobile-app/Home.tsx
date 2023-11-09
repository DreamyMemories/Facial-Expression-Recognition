import { View, Text, Button } from "react-native";
import React from "react";

export function HomeScreen({ navigation }: any) {
    return (
        <View>
            <Button title="Welcome to the Facial Expression App" onPress={() => navigation.navigate('VideoScreen')} />
        </View>
    )
}