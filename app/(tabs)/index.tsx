import { useCallback, useContext, useEffect, useState } from "react";
import { Button, Text, View, StyleSheet, ScrollView } from "react-native";
import { Link, useFocusEffect } from "expo-router";
import Box from "@/components/exerciseView";
import { addExercises, getActiveWorkoutId, getWorkoutIds, initDB } from "@/db";
import WorkoutView from "@/components/workoutView";
import { openDatabaseSync, useSQLiteContext } from "expo-sqlite";

let db: any = null;
export default function Index() {
  const [workoutIds, setWorkoutIds] = useState<number[]>([]);
  // db = useSQLiteContext();

  const fetchWorkoutIds = () => {
    let activeWorkoutId = getActiveWorkoutId();
    const ids = getWorkoutIds();
    setWorkoutIds(ids);
    if (activeWorkoutId > 0) {
      setWorkoutIds(ids.filter((id) => id !== activeWorkoutId));
    }
  };

  useEffect(() => {
    initDB();
    fetchWorkoutIds();
    try {
      addExercises();
    } catch (e) {
      console.log(e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchWorkoutIds();
      try {
        addExercises();
      } catch (e) {
        console.log(e);
      }
    }, [])
  );

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
