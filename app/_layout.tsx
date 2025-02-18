import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { MenuProvider } from "react-native-popup-menu";
import { Platform, Text, Button} from "react-native";
import WorkoutTimer from "@/components/workoutTimer";
import RestButton from "@/components/restButton";
import workoutTimer from "@/components/workoutTimer";


export default function RootLayout() {
  return (
    <MenuProvider>
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="activeWorkout"
        options={{
          presentation: "modal",
          headerStyle: {
            backgroundColor: "green",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontFamily: "SedgwickAveDisplay-Regular",
            fontSize: 30,
            
          }, headerLeft: () => <WorkoutTimer />
          , headerRight: () =>  <RestButton/>
        }}
        
/>
      <Stack.Screen
        name="exerciseSelect"
        options={{
          presentation: "modal",
          headerStyle: {
            backgroundColor: "green",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontFamily: "SedgwickAveDisplay-Regular",
            fontSize: 30,
          },
        }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
    </MenuProvider>
  );
}
