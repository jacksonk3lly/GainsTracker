import {
  View,
  StyleSheet,
  Button,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import {
  getExerciseName,
  getSet,
  getSetIds,
  newSet,
  updateExerciseUseExerciseId,
  updateSet,
} from "@/db";
import { Set } from "@/types/types";
import CustomCheckbox from "./CustomCheckbox";
import { MaterialIcons } from "@expo/vector-icons";

export default function ExerciseAdd({
  exerciseUseId,
}: {
  exerciseUseId: number;
}) {
  const [exerciseName, setExerciseName] = useState(
    getExerciseName(exerciseUseId)
  );

  const [sets, setSets] = useState<Set[]>([]);

  function SetCreateComponent({ set }: { set: Set }) {
    const [weight, setWeight] = useState(set.weight);
    const [reps, setReps] = useState(set.reps);
    const [isSelected, setSelection] = useState(set.selected);

    useEffect(() => {
      set.reps = reps;
      set.weight = weight;
      updateSet(set);
    }, [weight, reps]);

    useEffect(() => {
      set.selected = isSelected;
      updateSet(set);
    }, [isSelected]);

    function deleteSet() {
      setSets((prevSets) => prevSets.filter((s) => s.id !== set.id));
    }

    return (
      <View style={styles.set}>
        <View style={{ width: "40%" }}>
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

        <View style={{ width: "40%" }}>
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
        <CustomCheckbox
          isChecked={isSelected}
          onPress={() => setSelection(!isSelected)}
        />

        <TouchableOpacity onPress={deleteSet}>
          <View>
            <MaterialIcons name="delete" size={24} color="black" />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  function setAdd(set?: Set) {
    if (set) {
      setSets((prevSets) => [...prevSets, set]);
    } else {
      const lastSet = sets[sets.length - 1];
      let newSetObj: Set = newSet(exerciseUseId, 0, 0, false);
      if (lastSet) {
        newSetObj = newSet(exerciseUseId, lastSet.reps, lastSet.weight, false);
      }
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
  checkbox: {
    alignSelf: "center",
  },
});
