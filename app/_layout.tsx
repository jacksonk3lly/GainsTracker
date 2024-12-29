import React from "react";
import { SQLiteProvider } from "expo-sqlite";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <SQLiteProvider
      databaseName="test.db"
      assetSource={{ assetId: require("../assets/SQLite.db") }}
    >
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="activeWorkout"
          options={{
            presentation: "modal",

            headerStyle: {
              // backgroundColor: "#25292e",
              backgroundColor: "green",
            },

            headerTintColor: "#fff",
            headerTitleStyle: {
              fontFamily: "SedgwickAveDisplay-Regular", // Use the custom font
              fontSize: 30, // Add your desired font size here
              // height: 100,
            },
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </SQLiteProvider>
  );
}
