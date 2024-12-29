import { View, StyleSheet, Button, Text, TextInput } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { useState } from "react";

export default function ExerciseAdd() {
  const [sets, addSets] = useState<JSX.Element[]>([]);

  function setAdd() {
    addSets([
      ...sets,
      <View style={styles.set} key={sets.length}>
        <TextInput
          id="weight"
          placeholder="Enter weight"
          style={styles.input}
          placeholderTextColor="dimgray"
        />
        <TextInput
          placeholderTextColor="dimgray"
          id="unit"
          placeholder="Unit"
          style={styles.input}
        />
        <TextInput
          placeholderTextColor="dimgray"
          id="rep"
          placeholder="Enter Reps"
          style={styles.input}
        />
      </View>,
    ]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Name</Text>
      <TextInput
        style={styles.input}
        id="name"
        placeholder="Enter Exercise Name"
      />
      {sets}
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
    flex: 1,
    width: "100%",
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
