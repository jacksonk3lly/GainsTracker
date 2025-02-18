import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import workoutTimer, { styles as workoutStyles } from "./workoutTimer";
import { useEffect, useState } from "react";

export default function RestButton() {
  const [unpressed, setUnpressed] = useState(true);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  let formattedTime = `${seconds}s`;
  if (minutes > 0) formattedTime = `${minutes}m ${seconds}s`;
  if (hours > 0) formattedTime = `${hours}h ${minutes}m ${seconds}s`;

  useEffect(() => {
    if (!unpressed) {
      const startTime = Date.now();

      const updateTimer = () => {
        const elapsed = Date.now() - startTime;
        setHours(Math.floor(elapsed / (1000 * 60 * 60)));
        setMinutes(Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60)));
        setSeconds(Math.floor((elapsed % (1000 * 60)) / 1000));
      };

      let timerInterval = setInterval(updateTimer, 1000);
      updateTimer();

      return () => clearInterval(timerInterval);
    }
  }, [unpressed]);

  if (unpressed === true) {
    return (
      <TouchableOpacity
        style={styleRest.rest}
        onPressIn={() => (
          setUnpressed(false), console.log("IN HERE", unpressed)
        )}
      >
        <Text style={styleRest.text}>Start Rest</Text>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity
        style={styleRest.rest}
        onPressIn={() => setUnpressed(true)}
      >
        <Text style={styleRest.timer}>{formattedTime}</Text>
      </TouchableOpacity>
    );
  }
}

const styleRest = StyleSheet.create({
  rest: {
    margin: 0,
  },

  text: {
    fontSize: 12,
    color: "white",
  },

  stop: {
    backgroundColor: "red",
    justifyContent: "center",
    borderColor: "white",
    borderRadius: 10,
  },
  timer: {
    justifyContent: "center",
    color: "white",
  },
});
