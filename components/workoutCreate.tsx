import { View, StyleSheet, Button, Text, TextInput } from "react-native";
import { Exercise, Workout } from "@/types/types";
import { useState } from "react";
import ExerciseAdd from "@/components/setsCreate";

type Props = {
  workout: Workout;
};

export default function WorkoutCreate() {
  const [exercises, setExercises] = useState<
    { exercise: JSX.Element[]; sets: JSX.Element[] }[]
  >([]);

  const exerciseAdder = () => {
    setExercises([...exercises, { exercise: [], sets: [] }]);
  };

  const submitHandler = () => {};

  return (
    <View style={styles.container}>
      {/* <Text style={styles.text}>Name</Text>
      <TextInput
        id="name"
        placeholder="Enter Workout Name"
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.text}>Date</Text>
      <TextInput
        id="date"
        placeholder="Enter Date"
        value={date}
        onChangeText={setDate}
      /> */}
      {exercises.map((exercise, index) => (
        <ExerciseAdd key={index} />
      ))}
      <View style={styles.buttonContainer}>
        <Button
          title="Add Exercise"
          color={"#fff"}
          onPress={() => exerciseAdder()}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Submit" color={"#fff"} onPress={() => submitHandler()} />
      </View>
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
    margin: 10,
  },
  buttonContainer: {
    backgroundColor: "green",
    borderRadius: 15,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 2,
  },
  text: {
    color: "#fff",
    fontSize: 24,
  },
});
