import { useEffect, useState } from "react";
import { getActiveWorkoutId, getWorkoutStartInTime } from "@/db";
import { View, Text, StyleSheet, Platform } from "react-native";

let timer = 0;

export default function workoutTimer() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  let formattedTime =
    hours > 0 ? `${hours}h ${minutes}m ${seconds}s` : `${minutes}m ${seconds}s`;
  let workoutTime = getWorkoutStartInTime(getActiveWorkoutId());
  let startTime = new Date().getTime();

  useEffect(() => {
    const timerUpdate = () => {
      timer = new Date().getTime() - new Date(workoutTime).getTime();

      // Convert milliseconds to hours, minutes, and seconds, and account for the difference in times by 13hrs
      setHours(Math.floor(timer / (1000 * 60 * 60)) - 13);

      setMinutes(Math.floor((timer % (1000 * 60 * 60)) / (1000 * 60)));
      setSeconds(Math.floor((timer % (1000 * 60)) / 1000));
    };

    timerUpdate();
    const interval = setInterval(timerUpdate, 1000);
    return () => clearInterval(interval);
  }, [workoutTime, startTime]);

  return (
    <View style={styles.timer}>
      <Text style={styles.text}>{formattedTime}</Text>
    </View>
  );
}

export const styles = StyleSheet.create({
  timer: {
    color: "white",
  },
  text: {
    color: "white",
    padding: 0,
  },
});
