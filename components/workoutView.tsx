import { Text, View, StyleSheet, ScrollView } from "react-native";
import Box from "@/components/box";
import data from "@/data/data.json";
import { Exercise, Workout } from "@/types/types";

type Props = {
  workout: Workout;
};

export default function WorkoutView({ workout }: Props) {
  let exercises: Exercise[] = workout.exercises;
  return (
    <view style={styles.container}>
      <text style={styles.text}>{workout.name}</text>
      <text style={styles.text}>{workout.date}</text>
      {exercises.map((exercise) => {
        return <Box exercise={exercise} />;
      })}
    </view>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "dimgray",
    width: "90%",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 10,
    marginBottom: 10,
  },
  text: {
    color: "#fff",
    fontSize: 24,
  },
});
