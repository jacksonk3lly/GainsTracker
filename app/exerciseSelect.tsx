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
import WorkoutCreate from "@/components/workoutCreate";
import {
  getActiveWorkoutId,
  getMostRecentWorkoutId,
  getNumberOfExerciseUses,
  getExerciseIds,
  newExercise,
  newExerciseUse,
} from "@/db";

function niceText(text: string) {
  text = text.replace(/_/g, " ");
  text = text.replace(/\b\w/g, (char) => char.toUpperCase());
  return text;
}

export default function exerciseSelect() {
  const { workoutId: workoutIdParam } = useLocalSearchParams<{
    workoutId?: string;
  }>();
  const workoutId = workoutIdParam ? parseInt(workoutIdParam, 10) : -1;

  const router = useRouter();

  if (!workoutId) {
    throw new Error("No workout ID provided");
  }

  // router.back();

  function ExerciseCard({ exerciseId }: { exerciseId: string }) {
    function onExerciseSelect(exerciseId: string) {
      if (workoutId !== undefined) {
        newExerciseUse(workoutId, exerciseId);
      }
      router.back();
    }
    return (
      <TouchableOpacity
        onPress={() => onExerciseSelect(exerciseId)}
        style={styles.container}
      >
        <Text style={styles.text}>{niceText(exerciseId)}</Text>
        <Text style={styles.smallText}>
          Performed {getNumberOfExerciseUses(exerciseId)} times.
        </Text>
      </TouchableOpacity>
    );
  }

  const [exerciseIds, setExerciseIds] = useState(getExerciseIds());
  const [newExerciseName, setNewExerciseName] = useState("");

  function handleAddExercise() {
    if (newExerciseName.trim()) {
      newExercise(newExerciseName);
      setExerciseIds(getExerciseIds());
      setNewExerciseName("");
    }
  }

  console.log(exerciseIds);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={{ alignItems: "center" }}
    >
      {exerciseIds.map((id) => {
        return <ExerciseCard key={id} exerciseId={id} />;
      })}
      <TextInput
        style={styles.input}
        placeholder="New Exercise Name"
        value={newExerciseName}
        onChangeText={setNewExerciseName}
      />
      <Button title="Create New Exercise" onPress={handleAddExercise} />
      <View style={{ height: 300, backgroundColor: "red" }}></View>
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
    marginTop: 20,
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
