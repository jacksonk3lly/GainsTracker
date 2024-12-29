import { Text, View, StyleSheet, ScrollView, Button } from "react-native";
import data from "@/data/data.json";
import { Exercise, Workout } from "@/types/types";
import WorkoutCreate from "@/components/workoutCreate";
import ExerciseAdd from "@/components/setsCreate";
import { useNavigation } from "@react-navigation/native";
import { Link, Stack } from "expo-router";

type RootStackParamList = {
  NewWorkoutOverlay: undefined;
};

export default function Create() {
  const exerciseAdder = () => {
    return <ExerciseAdd />;
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={{ alignItems: "center" }}
    >
      {/* <WorkoutCreate /> */}
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Link href="/activeWorkout" style={styles.button}>
            New Blank Workout
          </Link>
        </View>

        <View style={styles.buttonContainer}>
          <Link href="/notfound" style={styles.button}>
            New 5x5 Workout
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#25292e",
    flex: 1,
    width: "100%",
  },
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
    // marginBottom: 5,
    marginTop: 10,
  },

  text: {
    color: "#fff",
    fontSize: 24,
  },
  button: {
    fontSize: 20,
    padding: 10,
    // textDecorationLine: "underline",
    color: "#fff",
  },
  buttonContainer: {
    backgroundColor: "green",
    borderRadius: 15,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 2,
  },
});
