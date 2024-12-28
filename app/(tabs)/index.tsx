import { Text, View, StyleSheet, ScrollView } from "react-native";
import { Link } from "expo-router";
import Button from "@/components/button";
import Box from "@/components/exerciseView";
import { getWorkoutIds } from "@/db";
import { Exercise, Workout } from "@/types/types";
import WorkoutView from "@/components/workoutView";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export default async function Index() {
  let workoutIds: number[] = await getWorkoutIds();
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={{ alignItems: "center" }}
    >
      {workoutIds.map((workoutId) => {
        return <WorkoutView key={workoutId} workoutId={workoutId} />;
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#25292e",
    flex: 1,
    width: "100%",
  },
  text: {
    color: "#fff",
    fontSize: 24,
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#fff",
  },
});
