import { Text, View, StyleSheet, ScrollView } from "react-native";
import { Link } from "expo-router";
import Button from "@/components/button";
import Box from "@/components/box";
import Exercise from "@/models/exercise";

export default function Index() {
  const plan: Array<Exercise> = [new Exercise("first ", 5, 5, 60)];

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container} contentContainerStyle={{alignItems:"center"}}>
      <Box data={plan} title="A" />
      <Box data={plan} title="B" />
      <Box data={plan} title="B" />
      <Box data={plan} title="B" />
      <Box data={plan} title="B" />
      <Box data={plan} title="B" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "#25292e",
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
  },
});
