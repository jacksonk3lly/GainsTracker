import { Text, View, StyleSheet, ScrollView } from "react-native";
import { Link } from "expo-router";
import Button from "@/components/button";
import Box from "@/components/exerciseView";
import data from "@/data/data.json";
import { Exercise, Workout } from "@/types/types";
import WorkoutView from "@/components/workoutView";

export default function Index() {
  let workouts: Workout[] = data.workouts.map(workout => ({
    ...workout,
    date: new Date(workout.date),
  }));
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={{ alignItems: "center" }}
    >
      {workouts.map((workout) => {
        return <WorkoutView key={workout.id} workout={workout} />;
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
