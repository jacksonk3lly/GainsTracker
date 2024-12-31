import { useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { Link } from "expo-router";
import Button from "@/components/button";
import Box from "@/components/exerciseView";
import { getActiveWorkoutId, getWorkoutIds } from "@/db";
import WorkoutView from "@/components/workoutView";
import { useSQLiteContext } from "expo-sqlite";

let db: any = null;
export default function Index() {
  const [workoutIds, setWorkoutIds] = useState<number[]>([]);
  db = useSQLiteContext();

  useEffect(() => {
    async function fetchWorkoutIds() {
      let activeWorkoutId = getActiveWorkoutId();
      const ids = await getWorkoutIds();
      setWorkoutIds(ids);
      setWorkoutIds(ids.filter((id) => id !== activeWorkoutId));
    }
    fetchWorkoutIds();
  }, []);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={{ alignItems: "center" }}
    >
      {workoutIds.map((workoutId) => {
        return <WorkoutView key={workoutId} workoutId={workoutId} />;
      })}
    </ScrollView>
  );
}
export { db };

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#25292e",
    flex: 1,
    width: "100%",
  },
  text: {
    color: "#fff",
    fontSize: 24,
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#fff",
  },
});
