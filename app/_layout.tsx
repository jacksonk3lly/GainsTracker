import React from "react";
import { SQLiteProvider } from "expo-sqlite";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <SQLiteProvider
      databaseName="SQLite.db"
      assetSource={{ assetId: require("../assets/SQLite.db") }}
    >
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
            },
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </SQLiteProvider>
  );
}
