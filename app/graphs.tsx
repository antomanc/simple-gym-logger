import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

export default function GraphsScreen() {
  return (
    <View style={styles.container}>
      <Text>Graphs screen</Text>
      {/* IDEAS:
        FIRST GRAPH A GENERAL GRAPH OF ALL TIME
        SECOND GRAPH A GRAPH OF THE LAST MONTH
        THEN A WAY TO GET A GRAPH FOR EACH EXERCISE WITH DATA
        */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
