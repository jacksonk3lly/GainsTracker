import { StyleSheet, View, Pressable, Text } from "react-native";
import { Exercise, Set } from "@/types/types";

type Props = {
  exercise: Exercise;
};

function SetText({ set }: { set: Set }) {
  return (
    <Text style={{ color: "#fff" }}>
      {set.weight} x {set.reps} x {set.weight} kg
    </Text>
  );
}

export default function Box({ exercise }: Props) {
  let sets: Set[] = exercise.sets;
  console.log("here");
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{exercise.name}</Text>
      <br />
      {sets.map((set) => {
        return <SetText set={set} />;
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
    height: 100,
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
