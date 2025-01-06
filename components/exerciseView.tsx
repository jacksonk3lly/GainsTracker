import { StyleSheet, View, Text } from "react-native";
import { Set } from "@/types/types";
import { getExerciseName, getSet, getSetIds } from "@/db";
import React, { useState, useEffect } from "react";

type Props = {
  exerciseUseId: number;
};

function SetText({ setId }: { setId: number }) {
  const [set, setSet] = useState<Set | null>(null);

  useEffect(() => {
    async function fetchSet() {
      const fetchedSet = await getSet(setId);
      setSet(fetchedSet);
    }
    fetchSet();
  }, [setId]);

  if (!set) {
    return <Text style={{ color: "#fff" }}>Loading...</Text>;
  }

  if (!set.selected) {
    return null;
  }

  return (
    <Text style={{ color: "#fff", marginBottom: 5 }}>
      {set.weight} kg x {set.reps}
    </Text>
  );
}

export default function Box({ exerciseUseId }: Props) {
  const [setIds, setSetIds] = useState<number[]>([]);
  const [exerciseName, setExerciseName] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSetIds() {
      const ids = await getSetIds(exerciseUseId);
      setSetIds(ids);
    }
    fetchSetIds();
  }, [exerciseUseId]);

  useEffect(() => {
    async function fetchExerciseName() {
      const name = await getExerciseName(exerciseUseId);
      setExerciseName(name);
    }
    fetchExerciseName();
  }, [exerciseName]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {exerciseName}
        {"\n"}
      </Text>
      {setIds.map((setId) => {
        return <SetText key={setId} setId={setId} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    color: "#fff",
    padding: 10,
    width: "100%",
    backgroundColor: "#4a4646",
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.75,
    shadowRadius: 6,
  },
  title: {
    color: "#fff",
    fontSize: 24,
  },
});
