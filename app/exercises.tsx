import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput as TextInputNative,
  FlatList,
} from "react-native";
import {
  Button,
  List,
  Dialog,
  Portal,
  TextInput,
  FAB,
} from "react-native-paper";
import { Exercise } from "@/interfaces/Workouts";
import { useExerciseLogger } from "@/hooks/useExerciseLogger";

export default function ExercisesScreen() {
  const {
    exercises,
    addExercise,
    editExercise,
    deleteExercise,
    fetchExercises,
  } = useExerciseLogger();

  const [visible, setVisible] = useState(false);
  const [exerciseName, setExerciseName] = useState("");
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<TextInputNative | null>(null);

  const showDialog = () => {
    setVisible(true);
    setExerciseName("");
    setEditingExercise(null);
  };

  const hideDialog = () => {
    setVisible(false);
  };

  const handleSave = async () => {
    if (editingExercise) {
      await editExercise(editingExercise.id, exerciseName);
    } else {
      await addExercise(exerciseName);
    }
    await fetchExercises();
    hideDialog();
  };

  const handleEdit = (exercise: Exercise) => {
    setExerciseName(exercise.name);
    setEditingExercise(exercise);
    setVisible(true);
  };

  const handleDelete = async (id: Exercise["id"]) => {
    await deleteExercise(id);
    await fetchExercises();
  };

  return (
    <View style={styles.container}>
      <TextInput
        ref={searchInputRef}
        mode="outlined"
        placeholder="Search exercises"
        value={searchQuery}
        onChangeText={(query) => setSearchQuery(query)}
        right={
          <TextInput.Icon
            icon="close"
            onPress={() => {
              setSearchQuery("");
              searchInputRef &&
                searchInputRef.current &&
                searchInputRef.current.blur();
            }}
          />
        }
        style={styles.searchInput}
      />
      <List.Section>
        <List.Subheader>Exercises</List.Subheader>
        <FlatList
          data={exercises.filter((exercise) =>
            exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          keyExtractor={(exercise) => exercise.id.toString()}
          renderItem={({ item: exercise }) => (
            <List.Item
              onPress={() => {
                handleEdit(exercise);
              }}
              title={exercise.name}
              left={(props) => <List.Icon {...props} icon="dumbbell" />}
            />
          )}
          ListEmptyComponent={<List.Item title="No exercises found" />}
        />
      </List.Section>
      <FAB style={styles.fab} icon="plus" onPress={showDialog} />
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Title>
          {editingExercise ? "Edit Exercise" : "New Exercise"}
        </Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Exercise Name"
            value={exerciseName}
            onChangeText={setExerciseName}
          />
        </Dialog.Content>
        <Dialog.Actions style={styles.actions}>
          {editingExercise && (
            <Button
              textColor="red"
              onPress={() => {
                handleDelete(editingExercise.id);
                hideDialog();
              }}
            >
              Delete
            </Button>
          )}
          <View style={{ flex: 1 }} />
          <Button onPress={hideDialog}>Cancel</Button>
          <Button onPress={handleSave}>
            {editingExercise ? "Save" : "Add"}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    overflow: "hidden",
    paddingBottom: 56,
  },
  searchInput: {
    marginHorizontal: 16,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
