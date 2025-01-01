import { useContext, useEffect, useState } from "react";
import { Button, Text, View, StyleSheet, ScrollView } from "react-native";
import { Link } from "expo-router";
import Box from "@/components/exerciseView";
import { getActiveWorkoutId, getWorkoutIds } from "@/db";
import WorkoutView from "@/components/workoutView";
import { useSQLiteContext } from "expo-sqlite";

let db: any = null;
export default function Index() {
  const [workoutIds, setWorkoutIds] = useState<number[]>([]);
  db = useSQLiteContext();

  const fetchWorkoutIds = () => {
    let activeWorkoutId = getActiveWorkoutId();
    const ids = getWorkoutIds();
    setWorkoutIds(ids);
    if (activeWorkoutId > 0) {
      setWorkoutIds(ids.filter((id) => id !== activeWorkoutId));
    }
  };

  useEffect(() => {
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
      <Button title="Refresh" onPress={fetchWorkoutIds} />
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
