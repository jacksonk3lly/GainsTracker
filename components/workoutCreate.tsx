import { View, StyleSheet, Button, Text, TextInput } from "react-native";
import { Alert } from "react-native";
import { Exercise, Workout } from "@/types/types";
import { useEffect, useState } from "react";
import ExerciseAdd from "@/components/setsCreate";
import {
  newExerciseUse,
  getExerciseUseIds,
  getExerciseUses,
  endActiveWorkout,
  getAllExerciseUses,
} from "@/db";
import { useRouter } from "expo-router";

export default function WorkoutCreate({ workoutId }: { workoutId: number }) {
  // foundExercises = getExerciseUses(workoutId);
  const router = useRouter();

  const [exercises, setExercises] = useState<number[]>(
    getExerciseUseIds(workoutId)
  );

  const exerciseAdder = (exerciseId?: string) => {
    const newExerciseUseId = newExerciseUse(workoutId, exerciseId);
    setExercises([...exercises, newExerciseUseId]);
  };

  // useEffect(() => {
  //   setExercises(getExerciseUseIds(workoutId));
  // }, [exercises]);

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
      {/* <Text style={styles.text}>Name</Text>
      <TextInput
        id="name"
        placeholder="Enter Workout Name"
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.text}>Date</Text>
      <TextInput
        id="date"
        placeholder="Enter Date"
        value={date}
        onChangeText={setDate}
      /> */}
      {exercises.map((exerciseUseId) => (
        <ExerciseAdd exerciseUseId={exerciseUseId} key={exerciseUseId} />
      ))}
      <View style={styles.buttonContainer}>
        <Button
          title="Add Exercise"
          color={"#fff"}
          onPress={() => exerciseAdder()}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Finish Workout"
          color={"#fff"}
          onPress={() => submitHandler()}
        />
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
