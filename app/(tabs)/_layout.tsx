import { Stack, useFocusEffect, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { View, Text, StyleSheet, Alert, Button, Platform } from "react-native";
import React, { useCallback, useState } from "react";
import { activeWorkoutExists } from "@/db";
import {buttonStyle} from "@/assets/buttonstyle";


export default function TabLayout() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    "SedgwickAveDisplay-Regular": require("../../assets/fonts/SedgwickAveDisplay-Regular.ttf"),
  });

  // if (!fontsLoaded) {
  //   return null; // or a loading spinner
  // }

  function resumeWorkout() {
    if (activeWorkoutExists()) {
      router.navigate("/activeWorkout");
    } else {
      Alert.alert("No active workout to resume");
    }
  }

  const [resumeButtonShown, setResumeButtonShown] = useState(
    activeWorkoutExists()
  );

  useFocusEffect(
    useCallback(() => {
      setResumeButtonShown(activeWorkoutExists());
    }, [])
  );

  return (
    <>
      <Tabs
        screenOptions={{
          // tabBarActiveTintColor: "#ffd33d",
          headerStyle: {
            backgroundColor: "green",
          },
          headerShown: true,
          headerTintColor: "#fff",
          headerShadowVisible: false,
          tabBarStyle: {
            backgroundColor: "#25292e",
          },
          tabBarActiveTintColor: "green",
          headerTitleStyle: {
            fontFamily: fontsLoaded ? "SedgwickAveDisplay-Regular" : "System",
            fontSize: 30,
            ...Platform.select({
              android: {
                height: 120,
              },
            }),
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Previous Workouts",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "home-sharp" : "home-outline"}
                color={color}
                size={24}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="create"
          options={{
            title: "Create Workouts",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "home-sharp" : "home-outline"}
                color={color}
                size={24}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="about"
          options={{
            title: "about",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={
                  focused ? "information-circle" : "information-circle-outline"
                }
                color={color}
                size={24}
              />
            ),
          }}
        />
      </Tabs>
      {resumeButtonShown && (
        <View style={styles.floatingButton}>
          <Button
            title="Resume Workout"
            color={buttonStyle.selectors.color}
            onPress={resumeWorkout}
          ></Button>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 100, // Adjust based on tab height
    right: 20,
    left: 20,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "green",
    borderRadius: 50,
    // padding: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
