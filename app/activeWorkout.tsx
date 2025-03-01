import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
  Platform,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import WorkoutCreate from "@/components/workoutCreate";
import {
  getActiveWorkoutId,
  getMostRecentWorkoutId,
  getWorkoutTime,
  getWorkoutStartInTime,
} from "@/db";

export default function activeWorkout() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");

  const router = useRouter();

  const submitHandler = () => {
    // Handle the submission logic here
    console.log("Workout Name:", name);
    console.log("Workout Date:", date);
    setName("");
    setDate("");
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <WorkoutCreate workoutId={getActiveWorkoutId()} />

      <View style={{ height: 400, backgroundColor: "red" }}></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  text: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 20,
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
    // backgroundColor: "pink",
    flex: 1,
    width: "100%",
  },
});
