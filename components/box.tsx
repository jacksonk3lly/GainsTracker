import { StyleSheet, View, Pressable, Text } from "react-native";
import Exercise from "@/models/exercise";

type Props = {
  title: string;
  data: Exercise[];
};

export default function Box({ title, data = [] }: Props) {
  return (
    <View style={style.container}>
      <Text>{title}</Text>
      {data.map((exercise, index) => (
        <Text key={index}>
          {exercise.name}:  {exercise.sets}x{exercise.reps}, {exercise.weight}
        </Text>
      ))}
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    borderRadius: 15,
    color: "#fff",
    padding: 10,
    width: "90%",
    backgroundColor: "#4a4646",
    height: 100,
    margin: 10,
  },
});
