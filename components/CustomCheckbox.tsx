import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type CustomCheckboxProps = {
  isChecked: boolean;
  onPress: () => void;
};

export default function CustomCheckbox({
  isChecked,
  onPress,
}: CustomCheckboxProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.checkboxContainer}>
      <View style={[styles.checkbox, isChecked && styles.checkedCheckbox]}>
        <MaterialIcons
          name="check"
          size={24}
          color="white"
          style={{ opacity: isChecked ? 1 : 0 }}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  checkboxContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  checkbox: {
    borderRadius: 12, // Half of the width/height to make it a circle
    width: 24,
    height: 24,
    backgroundColor: "#4a4646",
  },
  checkedCheckbox: {
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
  },
});
