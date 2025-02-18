
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import ExerciseView from "@/components/exerciseView";
import WorkoutCreate from "@/components/workoutCreate";
import {
  getActiveWorkoutId,
  getMostRecentWorkoutId,
  getNumberOfExerciseUses,
  getExerciseIds,
  newExercise,
  newExerciseUse,
  getExerciseUseIds,
  getExerciseUseIdsOfExercise,
} from "@/db";

function niceText(text: string) {
  text = text.replace(/_/g, " ");
  text = text.replace(/\b\w/g, (char) => char.toUpperCase());
  return text;
}

export default function exerciseHistory() {
  const { exerciseId: exerciseId } = useLocalSearchParams<{
    exerciseId?: string;
  }>();

  const router = useRouter();

  if (!exerciseId) {
    throw new Error("No exercise ID provided");
  }

  // router.back();


  const [exerciseUseIds, setExerciseUseIds] = useState(getExerciseUseIdsOfExercise(exerciseId));
  console.log(exerciseUseIds);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={{ alignItems: "center" }}
    >
      {exerciseUseIds.map((id) => {
        return <ExerciseView exerciseUseId={id} />;
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "dimgray",
    alignItems: "center",
    borderRadius: 15,
    width: "90%",
    marginTop: 20,
    justifyContent: "center",
    padding: 20,
  },
  text: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 20,
  },
  smallText: {
    color: "#fff",
    fontSize: 16,
  },
  input: {
    backgroundColor: "#fff",
    color: "#000",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    width: "80%",
  },

  scroll: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#25292e",
    flex: 1,
    width: "100%",
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
