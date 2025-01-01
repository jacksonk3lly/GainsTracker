import { View, StyleSheet, Button, Text, TextInput } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { useState, useEffect } from "react";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import {
  getExerciseName,
  getSet,
  getSetIds,
  newSet,
  updateExerciseUseExerciseId,
  updateSet,
} from "@/db";
import { Set } from "@/types/types";

function SetCreateComponent({ set }: { set: Set }) {
  const [weight, setWeight] = useState(set.weight);
  const [reps, setReps] = useState(set.reps);

  useEffect(() => {
    set.reps = reps;
    set.weight = weight;
    updateSet(set);
  }, [weight, reps]);

  return (
    <View style={styles.set}>
      <View style={{ width: "50%" }}>
        <TextInput
          id="weight"
          placeholder="Enter weight"
          style={styles.input}
          value={weight ? weight.toString() : ""}
          placeholderTextColor="dimgray"
          keyboardType="numeric"
          onChangeText={(text) => setWeight(Number(text))}
        />
      </View>

      <View style={{ width: "50%" }}>
        <TextInput
          placeholderTextColor="dimgray"
          id="rep"
          value={reps ? reps.toString() : ""}
          keyboardType="numeric"
          placeholder="Enter Reps"
          style={styles.input}
          onChangeText={(text) => setReps(Number(text))}
        />
      </View>
    </View>
  );
}

export default function ExerciseAdd({
  exerciseUseId,
}: {
  exerciseUseId: number;
}) {
  const [sets, setSets] = useState<Set[]>([]);
  const [exerciseName, setExerciseName] = useState(
    getExerciseName(exerciseUseId)
  );

  function setAdd(set?: Set) {
    if (set) {
      setSets((prevSets) => [...prevSets, set]);
    } else {
      let newSetObj: Set = newSet(exerciseUseId, 0, 0);
      setSets((prevSets) => [...prevSets, newSetObj]);
    }
  }

  useEffect(() => {
    let setIds = getSetIds(exerciseUseId);
    setIds.forEach((setId) => {
      getSet(setId).then((set) => {
        setAdd(set);
      });
    });
  }, [exerciseUseId]);

  useEffect(() => {
    updateExerciseUseExerciseId(exerciseUseId, exerciseName);
  }, [exerciseName]);

  return (
    <View key={exerciseUseId} style={styles.container}>
      <Text style={styles.text}>Name</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="dimgray"
        value={exerciseName}
        id="name"
        placeholder="Enter Exercise Name"
        onChangeText={setExerciseName}
      />
      {sets.map((set) => {
        return <SetCreateComponent set={set} key={set.id} />;
      })}
      <View style={styles.buttonContainer}>
        <Button title="Add Set" color={"#fff"} onPress={() => setAdd()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "grey",
    padding: 20,
    margin: 20,
    borderRadius: 15,
    marginBottom: 20,
    // flex: 1,
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
    marginBottom: 10,
  },
  set: {
    display: "flex",
    flexDirection: "row",
    // backgroundColor: "red",
    margin: 20,
    flex: 2,
    // width: "100%",
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
  input: {
    // backgroundColor: "#fff",
    // padding: 10,
    margin: 5,
    backgroundColor: "#4a4646",
    color: "white",
    // borderRadius: 15,
    // width: "30%",
  },
});
