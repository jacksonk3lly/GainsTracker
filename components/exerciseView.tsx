import { StyleSheet, View, Pressable, Text } from "react-native";
import { Exercise, Set } from "@/types/types";

type Props = {
  exercise: Exercise;
};

function SetText({ set }: { set: Set }) {
  return (
    <Text style={{ color: "#fff" }}>
      {set.weight} kg x {set.reps}
    </Text>
  );
}

export default function Box({ exercise }: Props) {
  let sets: Set[] = exercise.sets;
  console.log("here");
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {exercise.id}
        {"\n"}
      </Text>
      {sets.map((set) => {
        return <SetText key={set.id} set={set} />;
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
