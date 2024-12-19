import { useExerciseLogger } from "@/hooks/useExerciseLogger";
import { Exercise } from "@/interfaces/Workouts";
import { useState, useEffect, useMemo, useCallback } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import {
  Portal,
  Dialog,
  TextInput,
  Button,
  List,
  TouchableRipple,
  useTheme,
  Text,
  IconButton,
} from "react-native-paper";

interface LogExerciseProps {
  visible: boolean;
  hideDialog: () => void;
  onConfirm: (exerciseLog: {
    exerciseId: number;
    weight: number;
    reps: number;
  }) => void;
}

export const LogExercise = ({
  visible,
  onConfirm,
  hideDialog,
}: LogExerciseProps) => {
  const theme = useTheme();
  const { exercises } = useExerciseLogger();

  const [exerciseName, setExerciseName] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setExerciseName("");
    setWeight("");
    setReps("");
    setSelectedExercise(null);
    setShowSuggestions(false);
  }, [visible]);

  const handleExerciseChange = useCallback(
    (text: string) => {
      setExerciseName(text);
      if (text.length > 0) {
        setShowSuggestions(true);
      }
      setSelectedExercise(null);
    },
    [exercises]
  );

  const handleExerciseSelect = useCallback(
    (item: Exercise) => {
      if (item) {
        const exercise = exercises.find((ex) => ex.id === item.id);
        if (exercise) {
          setExerciseName(exercise.name);
          setSelectedExercise(exercise);
        }
      }
      setShowSuggestions(false);
    },
    [exercises]
  );

  const handleWeightChange = (text: string) => setWeight(text);
  const handleRepsChange = (text: string) => setReps(text);

  const handleConfirm = useCallback(() => {
    if (selectedExercise) {
      onConfirm({
        exerciseId: selectedExercise.id,
        weight: parseFloat(weight.replace(",", ".")),
        reps: parseInt(reps),
      });
      setExerciseName("");
      setWeight("");
      setReps("");
      setSelectedExercise(null);
    }
  }, [selectedExercise, weight, reps, onConfirm]);

  const isAddDisabled = useMemo(() => {
    return (
      !selectedExercise ||
      !weight ||
      !reps ||
      isNaN(parseFloat(weight)) ||
      isNaN(parseInt(reps)) ||
      parseFloat(weight) <= 0 ||
      parseInt(reps) <= 0
    );
  }, [selectedExercise, weight, reps]);

  const handleHideDialog = useCallback(() => {
    hideDialog();
  }, [hideDialog]);

  const filteredExercises = useMemo(() => {
    if (exerciseName.length > 0) {
      return exercises
        .filter((exercise) =>
          exercise.name.toLowerCase().includes(exerciseName.toLowerCase())
        )
        .slice(0, 3);
    }
    return [];
  }, [exerciseName, exercises]);

  return (
    <Dialog visible={visible} onDismiss={handleHideDialog}>
      <Dialog.Title>Add exercise log</Dialog.Title>
      <Dialog.Content>
        <View style={styles.inputContainer}>
          <TextInput
            label="Exercise"
            value={exerciseName}
            onChangeText={handleExerciseChange}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setShowSuggestions(false)}
            right={
              <TextInput.Icon
                icon="close"
                onPress={() => {
                  setExerciseName("");
                  setSelectedExercise(null);
                }}
              />
            }
          />
          {showSuggestions && (
            <View
              style={{
                ...styles.suggestionsContainer,
                backgroundColor: theme.colors.secondary,
                borderRadius: theme.roundness,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
              }}
            >
              {filteredExercises.map((exercise) => (
                <TouchableRipple
                  key={exercise.id}
                  onPress={() => handleExerciseSelect(exercise)}
                >
                  <List.Item
                    title={
                      <Text
                        style={{
                          color: theme.colors.onSecondary,
                        }}
                      >
                        {exercise.name}
                      </Text>
                    }
                    left={(props) => (
                      <List.Icon
                        {...props}
                        icon="dumbbell"
                        color={theme.colors.onSecondary}
                        theme={{}}
                      />
                    )}
                  />
                </TouchableRipple>
              ))}
            </View>
          )}
          <TextInput
            label="Weight"
            value={weight}
            onChangeText={handleWeightChange}
            right={<TextInput.Affix text="kg" />}
          />
          <TextInput
            label="Reps"
            value={reps}
            onChangeText={handleRepsChange}
            right={<TextInput.Affix text="reps" />}
          />
        </View>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={handleHideDialog}>Cancel</Button>
        <Button onPress={handleConfirm} disabled={isAddDisabled}>
          Add
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    gap: 8,
  },
  suggestionsContainer: {
    zIndex: 2,
    position: "absolute",
    width: "100%",
    top: 56,
  },
});
