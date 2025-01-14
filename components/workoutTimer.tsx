import { useEffect, useState } from "react";
import { getActiveWorkoutId,getWorkoutStartInTime } from "@/db";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    ScrollView,
    Platform,
  } from "react-native";



export default function workoutTimer(){
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

    let formattedTime = `\n${hours}h ${minutes}m ${seconds}s`;
  
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
    <View style={styles.timer}>
    <Text style={styles.text}>Timer:</Text>
    <Text style={styles.text}> {formattedTime}</Text>
    </View>
    );
}

const styles = StyleSheet.create({
    timer: {
      borderStyle: "solid",
      borderColor: "white",
      padding: '2%',
      width: '30.5%',
      marginRight: 10,
      borderWidth: 5,
      marginLeft:-15,
      color: "white",
      marginTop:'10%'
    },

    text:{
        marginBottom:-8,
        marginTop:-9,
        padding:0
        
    }
});  