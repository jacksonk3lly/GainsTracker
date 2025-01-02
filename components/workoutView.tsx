import { View, StyleSheet, Text } from "react-native";
import Box from "@/components/exerciseView";
import { getExerciseUseIds, getWorkoutTime } from "@/db";
import React, { useState, useEffect } from "react";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

type Props = {
  workoutId: number;
};

export default function WorkoutView({ workoutId }: Props) {
  const [exerciseUseIds, setExerciseUseIds] = useState<number[]>([]);
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    async function fetchWorkoutTime() {
      const fetchedTime = await getWorkoutTime(workoutId);
      const date = new Date(fetchedTime);
      setTime(date.toDateString());
    }
    fetchWorkoutTime();
  }, [time]);

  const db = useEffect(() => {
    async function fetchExerciseUseIds() {
      const ids = await getExerciseUseIds(workoutId);
      setExerciseUseIds(ids);
    }
    fetchExerciseUseIds();
  }, [workoutId]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{time}</Text>

      {exerciseUseIds.map((exerciseUseId) => {
        return <Box key={exerciseUseId} exerciseUseId={exerciseUseId} />;
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
    // marginBottom: 5,
    marginTop: 10,
  },
  text: {
    color: "#fff",
    fontSize: 24,
  },
});
