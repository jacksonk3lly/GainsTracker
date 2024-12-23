import { View, StyleSheet, Button, Text, TextInput } from 'react-native';
import { useState } from 'react';




export default function ExerciseAdd() {


  const [sets, addSets] = useState<JSX.Element[]>([]);

  function setAdd() {
    addSets([...sets,
    (<View style={styles.set}>

      <TextInput id="weight" placeholder='Enter weight' />
      <TextInput id="unit" placeholder='Unit' />
      <TextInput id="rep" placeholder='Enter Reps' />
    </View>)])

  }


  return (<View style={styles.container}>


    <Text style={styles.text}>Name</Text>
    <TextInput id="name" placeholder='Enter Exercise Name' style={styles.button}/>
    <Button title="Add Set" onPress={() => setAdd()}/>
    {sets}
  </View>);

}




const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#25292e",
    padding: 20,
    margin: 20,
    marginBottom: 20,
    flex: 1,
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
    backgroundColor: "#25292e",
    margin: 20,
    flex: 1,
    width: "100%",
  }
});