import { View, StyleSheet, Text } from "react-native";
import Box from "@/components/box";
import { Exercise, Workout } from "@/types/types";

type Props = {
  workout: Workout;
};

export default function WorkoutView({ workout }: Props) {
  let exercises: Exercise[] = workout.exercises;
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{workout.name}</Text>
      <Text style={styles.text}>{workout.date}</Text>
      {exercises.map((exercise) => {
        return <Box key={exercise.id} exercise={exercise} />;
      })}
    </View>
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
