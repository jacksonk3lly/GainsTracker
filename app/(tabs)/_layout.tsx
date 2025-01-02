import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabLayout() {
  const [fontsLoaded] = useFonts({
    "SedgwickAveDisplay-Regular": require("../../assets/fonts/SedgwickAveDisplay-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null; // or a loading spinner
  }

  return (
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
          fontSize: 30, // Add your desired font size here
          // color: "green",
          // height: 100,
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
          title: "DEV",
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
  );
}
