import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { View, StyleSheet, FlatList, Dimensions } from "react-native";
import { FAB, Text, Divider, TouchableRipple, Icon } from "react-native-paper";
import { DaysView } from "@/components/DaysView";
import { LogExercise } from "@/components/ExerciseLogDialog/NewExerciseLog";
import { Exercise, ExerciseLog } from "@/interfaces/Workouts";
import { WeekDaySelector } from "@/components/WeekDaySelector";
import { useExerciseLogger } from "@/hooks/useExerciseLogger";
import EditLogDialog from "@/components/ExerciseLogDialog/EditExerciseLog";

export default function LogsScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [logExerciseVisible, setLogExerciseVisible] = useState(false);
  const [editingLog, setEditingLog] = useState<ExerciseLog | null>(null);
  const [editLogVisible, setEditLogVisible] = useState(false);

  const {
    logs,
    exercises,
    addExerciseLog,
    editExerciseLog,
    deleteExerciseLog,
    fetchLogsByDate: fetchLogs,
  } = useExerciseLogger();

  const handleDateChange = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      fetchLogs(date);
    },
    [fetchLogs]
  );

  const handleCreateExerciseLog = async (e: {
    exerciseId: number;
    weight: number;
    reps: number;
  }) => {
    await addExerciseLog({ ...e, date: selectedDate });
    fetchLogs(selectedDate, true);
    setLogExerciseVisible(false);
  };

  const handleEditPress = useCallback((item: ExerciseLog) => {
    setEditingLog(item);
    setEditLogVisible(true);
  }, []);

  const handleRemoveExerciseLog = useCallback(
    async (item: ExerciseLog) => {
      await deleteExerciseLog(item.id);
      fetchLogs(selectedDate, true);
    },
    [deleteExerciseLog]
  );

  const handleEditConfirm = useCallback(
    async (weight: string, reps: string) => {
      if (!editingLog) {
        return;
      }
      const updatedWeight = parseFloat(weight);
      const updatedReps = parseInt(reps, 10);
      await editExerciseLog(editingLog.id, updatedWeight, updatedReps);
      fetchLogs(selectedDate, true);
      setEditLogVisible(false);
      setEditingLog(null);
    },
    [editingLog, editExerciseLog]
  );

  const logsForSelectedDate = useMemo(() => {
    const date = selectedDate.toISOString().split("T")[0];
    if (!logs[date]) {
      return [];
    }
    return (
      logs[date].filter(
        (log) =>
          new Date(log.date).toDateString() === selectedDate.toDateString()
      ) ?? []
    );
  }, [logs, selectedDate]);

  const exerciseMap = useMemo(() => {
    const map: { [key: number]: Exercise } = {};
    exercises.forEach((exercise) => {
      map[exercise.id] = exercise;
    });
    return map;
  }, [exercises]);

  const nonEmptyLogDates = useMemo(() => {
    return Object.keys(logs).filter((date) => logs[date].length > 0);
  }, [logs]);

  return (
    <View style={styles.container}>
      <View style={styles.weekDaySelectorContainer}>
        <WeekDaySelector
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          datesWithDot={nonEmptyLogDates}
        />
      </View>
      <DaysView selectedDate={selectedDate} onDateChange={handleDateChange} />

      {logsForSelectedDate.length > 0 ? (
        <FlatList
          contentContainerStyle={styles.entryCard}
          data={logsForSelectedDate}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => `${item.date}-${index}`}
          renderItem={({ item, index }) => (
            <View>
              <TouchableRipple onPress={() => handleEditPress(item)}>
                <View style={styles.item}>
                  <View style={styles.itemLeftContent}>
                    <Text variant="bodyMedium" style={styles.exerciseName}>
                      {exerciseMap[item.exerciseId]?.name ?? "Unknown exercise"}
                    </Text>
                    <View style={styles.logDetails}>
                      <Text variant="bodyLarge">{item.weight}kg</Text>
                      <Text variant="bodyLarge" style={styles.logSeparator}>
                        {" x "}
                      </Text>
                      <Text variant="bodyLarge">{item.reps} reps</Text>
                    </View>
                  </View>
                  <Icon source="pencil" size={20} />
                </View>
              </TouchableRipple>

              {index !== logsForSelectedDate.length - 1 && <Divider />}
            </View>
          )}
        />
      ) : (
        <Text style={styles.noLogsText}>No logs</Text>
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setLogExerciseVisible(true)}
      />
      <FAB
        style={styles.fabLeft}
        icon="magnify"
        label="Last entry"
        onPress={() => console.log("Search Pressed")}
      />

      <LogExercise
        visible={logExerciseVisible}
        hideDialog={() => setLogExerciseVisible(false)}
        onConfirm={handleCreateExerciseLog}
      />

      <EditLogDialog
        visible={editLogVisible}
        onDismiss={() => setEditLogVisible(false)}
        handleDeletePress={handleRemoveExerciseLog}
        editingLog={editingLog}
        handleEditConfirm={(weight, reps) => {
          handleEditConfirm(weight, reps);
          setEditLogVisible(false);
        }}
      />
    </View>
  );
}

const deviceWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  weekDaySelectorContainer: {
    width: "100%",
    marginBottom: 6,
  },
  entryCard: {
    width: deviceWidth,
    paddingBottom: 80,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    width: "100%",
    marginTop: 8,
    marginBottom: 8,
  },
  itemLeftContent: {
    paddingLeft: 2,
  },
  exerciseName: {
    fontWeight: "bold",
  },
  logDetails: {
    flexDirection: "row",
    marginTop: 6,
  },
  logSeparator: {
    opacity: 0.5,
  },
  noLogsText: {
    marginTop: 20,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  fabLeft: {
    position: "absolute",
    margin: 16,
    right: 70,
    bottom: 0,
  },
});
