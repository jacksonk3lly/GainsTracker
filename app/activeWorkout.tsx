import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
  Platform,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import WorkoutCreate from "@/components/workoutCreate";
import { getActiveWorkoutId, getMostRecentWorkoutId, getWorkoutTime,getWorkoutStartInTime } from "@/db";


export default function activeWorkout() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);


  const router = useRouter();

  const submitHandler = () => {
    // Handle the submission logic here
    console.log("Workout Name:", name);
    console.log("Workout Date:", date);
    setName("");
    setDate("");
  };

  let formattedTime = `${hours}h ${minutes}m ${seconds}s`;

  useEffect(() => {
  let workoutTime = getWorkoutStartInTime(getActiveWorkoutId());
  
  const timerUpdate = () => {
  let timer =  new Date().getTime() - new Date(workoutTime).getTime();
  
 // Convert milliseconds to hours, minutes, and seconds, and account, theres a difference in times by 13hrs
 setHours( Math.floor(timer / (1000 * 60 * 60)) - 13  );
   setMinutes(Math.floor((timer % (1000 * 60 * 60)) / (1000 * 60)));
   setSeconds(Math.floor((timer % (1000 * 60)) / 1000));

  };
  
  timerUpdate();
  const interval = setInterval(timerUpdate, 1000);
  return () => clearInterval(interval);
  }, []);

  return (
    <View       style={styles.scroll}>
            <Text style={styles.timer}>Timer: {formattedTime}</Text>

    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={{ alignItems: "center" }}
    >

      <WorkoutCreate workoutId={getActiveWorkoutId()} />
      <View style={{ height: 300, backgroundColor: "red" }}></View>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  timer: {
    marginRight : '50%',
    marginTop: 10,
    borderStyle: "solid",
    borderColor: "white",
    padding: '2%',
    width: '50%',
    borderWidth: 5,
    color: "white",
  },


  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  text: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    color: "#000",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    width: "80%",
  },

  scroll: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#25292e",
    // backgroundColor: "pink",
    flex: 1,
    width: "100%",
  },
});
