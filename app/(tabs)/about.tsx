import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { db } from "./index";

export default function AboutScreen() {
  const [sql, setSql] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const runSql = () => {
    try {
      const rows = db.getAllSync(sql);
      setResult(JSON.stringify(rows, null, 2));
    } catch (e) {
      if (e instanceof Error) {
        setResult(`Error: ${e.message}`);
      } else {
        setResult("An unknown error occurred");
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.text}>Developer SQL Console</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter SQL statement"
        placeholderTextColor="dimgray"
        value={sql}
        onChangeText={setSql}
      />
      <Button title="Run SQL" onPress={runSql} />
      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
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
    width: "100%",
  },
  resultContainer: {
    marginTop: 20,
    backgroundColor: "#4a4646",
    padding: 10,
    borderRadius: 5,
    width: "100%",
  },
  resultText: {
    color: "#fff",
  },
});
