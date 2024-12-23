import { View, StyleSheet, Button, Text, TextInput } from 'react-native';
import { Exercise, Workout } from "@/types/types";
import data from "@/data/data.json";
import { useState } from 'react';
import ExerciseAdd from '@/components/setsCreate';

type Props = {
    workout: Workout;
};


export default function WorkoutCreate() {
    
  
    const [name, setName] = useState("")
    const [date, setDate] = useState("")
    const [exercises, setExercises] = useState<{exercise: JSX.Element[] , sets: JSX.Element[] }[]>([]);

    const exerciseAdder = () => {
        setExercises([...exercises, {exercise:[], sets: [] }]);
    };


    
    const submitHandler = () => {

        var jsonEntry = {id : ("workout_0"+data.workouts.length+1),
          date: date,
          name: name,
        
          //Temporray
          "exercises": [
            {
              "id": "exercise_01",
              "name": "Bench Press",
              "sets": [
                { "id": "set_01", "weight": 65, "reps": 10 },
                { "id": "set_02", "weight": 65, "reps": 8 }
              ]
            },
            {
              "id": "exercise_03",
              "name": "Shoulder Press",
              "sets": [
                { "id": "set_01", "weight": 30, "reps": 10 },
                { "id": "set_02", "weight": 30, "reps": 8 }
              ]
            },
            {
              "id": "exercise_04",
              "name": "Tricep Dips",
              "sets": [
                { "id": "set_01", "weight": 10, "reps": 12 },
                { "id": "set_02", "weight": 10, "reps": 10 }
              ]
            }
          ]
        }

        setDate("");
        setName("");

        data.workouts.push(jsonEntry);
        console.log(data.workouts.length);
    
    }


    return (
        <View style={styles.container}>

            <Text style={styles.text}>Name</Text>
            <TextInput id="name" placeholder='Enter Workout Name'  value={name} onChangeText={setName} />
            <Text style={styles.text}>Date</Text>
            <TextInput id="date" placeholder='Enter Date'  value={date} onChangeText={setDate} />
            <Button title="Add Exercise" onPress={() => exerciseAdder()} />
            {exercises.map(exercise => (
                <View style={styles.container}>
                    <ExerciseAdd/>
                </View>
            ))}
            <Button title="Submit" onPress={() => submitHandler()} />
              
        </View>
    );


}





const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "dimgray",
        width: "90%",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: 10,
        marginBottom: 10,
    },
    text: {
        color: "#fff",
        fontSize: 24,
    },
});
