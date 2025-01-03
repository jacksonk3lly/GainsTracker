import {
  View,
  StyleSheet,
  Button,
  Text,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { Alert } from "react-native";
import { Exercise, Workout } from "@/types/types";
import { useCallback, useEffect, useState } from "react";
import ExerciseAdd from "@/components/setsCreate";
import {
  newExerciseUse,
  getExerciseUseIds,
  endActiveWorkout,
  getAllExerciseUses,
} from "@/db";
import { useFocusEffect, useRouter } from "expo-router";

export default function WorkoutCreate({ workoutId }: { workoutId: number }) {
  const router = useRouter();

  const [exercises, setExercises] = useState<number[]>(
    getExerciseUseIds(workoutId)
  );

  useEffect(() => {
    setExercises(getExerciseUseIds(workoutId));
  }, []);

  useFocusEffect(
    useCallback(() => {
      setExercises(getExerciseUseIds(workoutId));
    }, [workoutId])
  );

  const exerciseAdder = () => {
    console.log("adding to workout", workoutId);
    router.push({
      pathname: "/exerciseSelect",
      params: { workoutId },
    });
  };

  const submitHandler = () => {
    Alert.alert(
      "Finish Workout",
      "Are you sure you want to finish the workout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            endActiveWorkout();
            router.back();
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      {exercises.map((exerciseUseId) => (
        <ExerciseAdd exerciseUseId={exerciseUseId} key={exerciseUseId} />
      ))}
      <View style={styles.buttonContainer}>
        <Button title="Add Exercise" color={"#fff"} onPress={exerciseAdder} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Finish Workout" color={"#fff"} onPress={submitHandler} />
      </View>
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
    margin: 10,
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
  text: {
    color: "#fff",
    fontSize: 24,
  },
});
