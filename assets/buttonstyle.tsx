import {Platform,StyleSheet} from "react-native";



export const buttonStyle = StyleSheet.create ({

    selectors:{
    ...Platform.select({
    ios: {
    color: "#fff",
    },
    android: {
        color: "green",
    },
    default: {
        color: "green",
    },
    }),
    
    }

});