import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import workoutTimer, { styles as workoutStyles } from "./workoutTimer";
import { useEffect, useState } from "react";


export default function RestButton() {
    const [unpressed, setUnpressed] = useState(true);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    let formattedTime = `\n${hours}h ${minutes}m ${seconds}s`;

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
            <View style={styleRest.rest}>
                <TouchableOpacity onPress={() => setUnpressed(false)}>
                    <Text> Start Rest</Text>
                </TouchableOpacity>
            </View>
        );
    } else {
        return (
        <View style={styleRest.rest}>
            <Text style={styleRest.timer}> {formattedTime} </Text>
            <TouchableOpacity onPress={() => setUnpressed(true)}>
                <Text style={styleRest.stop}> Stop </Text>
            </TouchableOpacity>

        </View>);
    }


}


const styleRest = StyleSheet.create({
    rest: {
        marginLeft: -83,
        marginRight: -5,
        color: 'black',
        backgroundColor: 'orange',
        borderColor: 'black',
        borderCurve: 'circular',
        borderRadius: 10,
        borderWidth: 5,
        marginTop: 30,
        padding: 6,
        paddingLeft: 2,
        marginBottom: 0,
    },

    stop: {
        backgroundColor: 'red',
        marginLeft: 14,
        fontWeight: '900',
        width: 40,
        borderColor: 'white',
        borderRadius: 10,
        paddingLeft: 1,

    }
,
    timer:{
        marginTop:-15,
        marginLeft:5
    }


});
