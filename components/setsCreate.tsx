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
  deleteSet,
  updateSet,
  deleteExerciseUse,
} from "@/db";
import { Set } from "@/types/types";
import CustomCheckbox from "./CustomCheckbox";
import { MaterialIcons } from "@expo/vector-icons";
import { buttonStyle } from "@/assets/buttonstyle";
import { router } from "expo-router";

function niceText(text: string) {
  text = text.replace(/_/g, " ");
  text = text.replace(/\b\w/g, (char) => char.toUpperCase());
  return text;
}

export default function ExerciseAdd({
  exerciseUseId,
  onRemove,
}: {
  exerciseUseId: number;
  onRemove: () => void;
}) {
  const [exerciseName, setExerciseName] = useState(
    getExerciseName(exerciseUseId)
  );

  const [sets, setSets] = useState<Set[]>([]);

  function removeExerciseUse() {
    deleteExerciseUse(exerciseUseId);
    setSets([]);
    onRemove();
  }

  function SetCreateComponent({ set }: { set: Set }) {
    const [weight, setWeight] = useState<string>(set.weight.toString());
    const [reps, setReps] = useState<string>(set.reps.toString());
    const [isSelected, setSelection] = useState(set.selected);

    useEffect(() => {
      if (reps === "") {
        return;
      }
      if (weight === "") {
        return;
      }
      set.reps = parseFloat(reps);
      set.weight = parseFloat(weight);
      updateSet(set);
    }, [weight, reps]);

    useEffect(() => {
      set.selected = isSelected;
      updateSet(set);
    }, [isSelected]);

    function removeSet() {
      try {
        deleteSet(set.id);
        setSets((prevSets) => prevSets.filter((s) => s.id !== set.id));
      } catch (e) {
        console.error("Error deleting set:", e);
      }
    }

    return (
      <View style={styles.set}>
        <View style={{ width: "40%" }}>
          <TextInput
            id="weight"
            placeholder="Weight"
            style={styles.input}
            value={weight}
            placeholderTextColor="dimgray"
            keyboardType="numeric"
            onChangeText={(text) => setWeight(text)}
          />
        </View>

        <View style={{ width: "40%" }}>
          <TextInput
            placeholderTextColor="dimgray"
            id="rep"
            value={reps}
            keyboardType="numeric"
            placeholder="Reps"
            style={styles.input}
            onChangeText={(text) => setReps(text)}
          />
        </View>
        <CustomCheckbox
          isChecked={isSelected}
          onPress={() => setSelection(!isSelected)}
        />

        <TouchableOpacity onPress={removeSet}>
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

  function onNamePress() {
    router.push({
      pathname: "./exerciseHistory",
      params: { exerciseId: exerciseUseId },
    });
  }

  return (
    <View key={exerciseUseId} style={styles.container}>
      <View key={"binButton"} style={styles.sideBySide}>
        <TouchableOpacity onPress={onNamePress}>
          <Text style={styles.text}>{niceText(exerciseName)}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={removeExerciseUse}
        >
          <View>
            <MaterialIcons name="delete" size={27} color="black" />
          </View>
        </TouchableOpacity>
      </View>
      {sets.map((set) => {
        return <SetCreateComponent set={set} key={set.id} />;
      })}

      <View style={styles.buttonContainer}>
        <Button
          title="Add Set"
          color={buttonStyle.selectors.color}
          onPress={() => setAdd()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sideBySide: {
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    alignItems: "center",
    width: "100%",
  },
  container: {
    flexDirection: "column",
    // backgroundColor: "dimgray",
    backgroundColor: "grey",
    padding: 20,
    margin: 20,
    borderRadius: 15,
    marginBottom: 0,
    alignItems: "center",
    // flex: 1,
    width: "100%",
  },
  text: {
    color: "#fff",
    // textAlign: "center",
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
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
  },
});
