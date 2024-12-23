import { Text, View, StyleSheet, ScrollView} from "react-native";
import data from "@/data/data.json";
import { Exercise, Workout } from "@/types/types";
import WorkoutCreate from "@/components/workoutCreate";
import ExerciseAdd from '@/components/setsCreate';




export default function Create() {

    const exerciseAdder = () => {
      return (<ExerciseAdd/>);
    }

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={{ alignItems: "center" }}
      > 
      
          <WorkoutCreate />;
      </ScrollView>
    );
  }

  const styles = StyleSheet.create({
    container: {
      display: "flex",
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
  