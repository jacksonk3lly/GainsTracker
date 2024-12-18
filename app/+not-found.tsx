import {View, StyleSheet, Text} from 'react-native';
import {Link,Stack} from 'expo-router';

export default function NotFound() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Not Found</Text>
      <Link href='/' style={styles.button}>Home</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: '#fff',
    fontSize: 24,
  },
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});