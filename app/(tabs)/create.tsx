import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import data from "@/data/data.json";
import { Exercise, Workout } from "@/types/types";
import WorkoutCreate from "@/components/workoutCreate";
import ExerciseAdd from "@/components/setsCreate";
import { Link, Stack, useRouter } from "expo-router";
import {
  activeWorkoutExists,
  newActiveWorkout,
  newWorkout,
  printWorkouts,
} from "@/db";
import { useSQLiteContext } from "expo-sqlite";

type RootStackParamList = {
  NewWorkoutOverlay: undefined;
};

export default function Create() {
  const router = useRouter();
  const exerciseAdder = (exerciseUseId: number) => {
    return <ExerciseAdd exerciseUseId={exerciseUseId} />;
  };

  function newBlank() {
    try {
      printWorkouts();
      const exists = activeWorkoutExists();
      if (exists) {
        Alert.alert(
          "There is already an active workout. Please finish it before starting a new one."
        );
        return;
      }
      newActiveWorkout();
      router.navigate("/activeWorkout");
    } catch (e) {
      console.error("Error checking active workout:", e);
    }
  }

  function resumeWorkout() {
    if (activeWorkoutExists()) {
      router.navigate("/activeWorkout");
    } else {
      Alert.alert("No active workout to resume");
    }
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={{ alignItems: "center" }}
    >
      {/* <WorkoutCreate /> */}

      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Button
            title="Resume Workout"
            color={"#fff"}
            onPress={resumeWorkout}
          ></Button>
        </View>

        <View style={styles.buttonContainer}>
          {/* <Link href="/activeWorkout" style={styles.button}>
            New Blank Workout
          </Link> */}
          <Button title="New Blank Workout" onPress={newBlank} color={"#fff"} />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="New 5x5 Workout"
            color={"#fff"}
            onPress={() => Alert.alert("not implemented")}
          ></Button>
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
