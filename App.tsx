import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Home from "./src/Screens/Home";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" hidden={true} />
      <Home />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
