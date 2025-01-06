import { View, StyleSheet, Text } from "react-native";
import Box from "@/components/exerciseView";
import { activeWorkoutExists, deleteWorkout, getExerciseUseIds, getWorkoutTime, setActiveWorkoutId } from "@/db";
import React, { useState, useEffect } from "react";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
} from "react-native-popup-menu";
import { router } from "expo-router";

type Props = {
  workoutId: number;
  refreshWorkouts: () => void;
};

export default function WorkoutView({ workoutId, refreshWorkouts }: Props) {
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

  function onDeleteWorkoutPress() {
    deleteWorkout(workoutId);
    refreshWorkouts();
  }
  function onEditWorkoutPress() {
    if(activeWorkoutExists()){
      alert("You can't edit a workout while you have an active workout");
      return;
    }
    setActiveWorkoutId(workoutId);
      router.navigate("/activeWorkout");
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>{time}</Text>
        <Menu>
          <MenuTrigger style={styles.menuTrigger}>
            <Text style={styles.text}>⋮</Text>
          </MenuTrigger>
          <MenuOptions>
            <MenuOption onSelect={onDeleteWorkoutPress} text="Delete Workout" />
            <MenuOption onSelect={onEditWorkoutPress} text="Edit Workout" />
          </MenuOptions>
        </Menu>
      </View>
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
    width: "95%",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 10,
    // marginBottom: 5,
    marginTop: 10,
    // marginRight: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  text: {
    color: "#fff",
    fontSize: 24,
  },
  menuTrigger: {
    padding: 10,
  },
  menuProvider: {
    // flex: 1,
    // alignItems: "flex-end",
    position: "absolute",
    height: 50,
    width: 50,
  },
});
