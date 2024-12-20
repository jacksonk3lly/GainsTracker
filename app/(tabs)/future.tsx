import { Text, View, StyleSheet, ScrollView } from "react-native";
import { Link } from "expo-router";
import Button from "@/components/button";
import Box from "@/components/exerciseView";
import data from "@/data/data.json";
import plans from "@/data/plans.json";
import { Exercise, Workout } from "@/types/types";
import WorkoutView from "@/components/workoutView";

export default function Future() {
  let workouts: Workout[];
  let plan = plans.plans[0];
  let days = plan.days;

  let daysAhead = 0;


  let futureWorkoutsSet = days.map((day) => {

    let date: Date = new Date(new Date().setDate(new Date().getDate() + daysAhead));
    let workout: Workout = {
      id: day.id,
      date: date,
      name: day.id,
      exercises: day.exercises as Exercise[],
    };
    daysAhead+=2
    return workout;
  });

  workouts = futureWorkoutsSet;

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
