import { View, StyleSheet, Text } from "react-native";
import Box from "@/components/exerciseView";
import { Exercise, Workout } from "@/types/types";

type Props = {
  workout: Workout;
};

export default function WorkoutView({ workout }: Props) {
  let exercises: Exercise[] = workout.exercises;


  return (
    <View style={styles.container}>
      <Text style={styles.text}>{workout.name}</Text>
      <Text style={styles.text}>{formatDate(workout.date)}</Text>
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




function formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
    weekday: "long", // Full name of the weekday (e.g., 'Monday')
    month: "long",   // Full name of the month (e.g., 'December')
    day: "numeric"// Day of the month (e.g., '20')
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
}

