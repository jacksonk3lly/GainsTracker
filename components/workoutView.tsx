import { View, StyleSheet, Text } from "react-native";
import Box from "@/components/exerciseView";
import { getExerciseUseIds } from "@/db";
import React, { useState, useEffect } from "react";

type Props = {
  workoutId: number;
};

export default function WorkoutView({ workoutId }: Props) {
  const [exerciseUseIds, setExerciseUseIds] = useState<number[]>([]);

  useEffect(() => {
    async function fetchExerciseUseIds() {
      const ids = await getExerciseUseIds(workoutId);
      setExerciseUseIds(ids);
    }
    fetchExerciseUseIds();
  }, [workoutId]);

  return (
    <View style={styles.container}>
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
    month: "long", // Full name of the month (e.g., 'December')
    day: "numeric", // Day of the month (e.g., '20')
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}
