import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Exercise, Workout } from "@/types/types";
import WorkoutCreate from "@/components/workoutCreate";
import ExerciseAdd from "@/components/setsCreate";
import { Link, Stack, useRouter } from "expo-router";
import {
  activeWorkoutExists,
  newActiveWorkout,
  createWorkoutBasedOnProgram,
  newWorkout,
  printWorkouts,
} from "@/db";
import { useSQLiteContext } from "expo-sqlite";
import {buttonStyle} from "@/assets/buttonstyle";


type RootStackParamList = {
  NewWorkoutOverlay: undefined;
};

export default function Create() {
  const router = useRouter();

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

  function new5x5() {
    const exists = activeWorkoutExists();
    if (exists) {
      Alert.alert(
        "There is already an active workout. Please finish it before starting a new one."
      );
      return;
    }
    createWorkoutBasedOnProgram("5x5");
    router.navigate("/activeWorkout");
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
            color={buttonStyle.selectors.color}
            onPress={resumeWorkout}
          ></Button>
        </View>

        <View style={styles.buttonContainer}>
          {/* <Link href="/activeWorkout" style={styles.button}>
            New Blank Workout
          </Link> */}
          <Button title="New Blank Workout" onPress={newBlank} color={buttonStyle.selectors.color} />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="New 5x5 Workout"
            color={buttonStyle.selectors.color}
            onPress={new5x5}
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
