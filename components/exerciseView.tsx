import { StyleSheet, View, Pressable, Text } from "react-native";
import { Exercise, Set } from "@/types/types";
import { getSet, getSetIds } from "@/db";
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

  return (
    <Text style={{ color: "#fff" }}>
      {set.weight} kg x {set.reps}
    </Text>
  );
}

export default function Box({ exerciseUseId }: Props) {
  const [setIds, setSetIds] = useState<number[]>([]);

  useEffect(() => {
    async function fetchSetIds() {
      const ids = await getSetIds(exerciseUseId);
      setSetIds(ids);
    }
    fetchSetIds();
  }, [exerciseUseId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {exerciseUseId}
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
