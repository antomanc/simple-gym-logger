import React, { useState, useMemo, useCallback } from "react";
import { View, StyleSheet, FlatList, Dimensions } from "react-native";
import { FAB, Text, Divider, TouchableRipple, Icon } from "react-native-paper";
import { DaysView } from "@/components/DaysView";
import { LogExercise } from "@/components/ExerciseLogDialog/NewExerciseLog";
import { ExerciseLog } from "@/interfaces/Workouts";
import { WeekDaySelector } from "@/components/WeekDaySelector";
import { useExerciseLogger } from "@/hooks/useExerciseLogger";
import EditLogDialog from "@/components/ExerciseLogDialog/EditExerciseLog";

export default function LogsScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [logExerciseVisible, setLogExerciseVisible] = useState(false);
  const [editingLog, setEditingLog] = useState<ExerciseLog | null>(null);

  const {
    logs,
    exercises,
    addExerciseLog,
    editExerciseLog,
    deleteExerciseLog,
    fetchLogsByDate,
  } = useExerciseLogger();

  const handleDateChange = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      fetchLogsByDate(date);
    },
    [fetchLogsByDate]
  );

  const handleCreateExerciseLog = async (log: {
    exerciseId: number;
    weight: number;
    reps: number;
  }) => {
    await addExerciseLog({ ...log, date: selectedDate });
    fetchLogsByDate(selectedDate, true);
    setLogExerciseVisible(false);
  };

  const handleEditConfirm = useCallback(
    async (weight: string, reps: string) => {
      if (editingLog) {
        await editExerciseLog(
          editingLog.id,
          parseFloat(weight),
          parseInt(reps, 10)
        );
        fetchLogsByDate(selectedDate, true);
        setEditingLog(null);
      }
    },
    [editingLog, editExerciseLog, fetchLogsByDate, selectedDate]
  );

  const handleDeletePress = useCallback(
    async (log: ExerciseLog) => {
      if (log) {
        await deleteExerciseLog(log.id);
        fetchLogsByDate(selectedDate, true);
        setEditingLog(null);
      }
    },
    [deleteExerciseLog, fetchLogsByDate, selectedDate]
  );

  const logsForSelectedDate = useMemo(
    () => logs[selectedDate.toISOString().split("T")[0]] || [],
    [logs, selectedDate]
  );

  const exerciseMap = useMemo(() => {
    return exercises.reduce((map, exercise) => {
      map[exercise.id] = exercise.name;
      return map;
    }, {} as { [key: number]: string });
  }, [exercises]);

  const datesWithLogs = useMemo(() => {
    return Object.keys(logs).filter((date) => logs[date].length > 0);
  }, [logs]);

  return (
    <View style={styles.mainLogView}>
      <WeekDaySelector
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        datesWithDot={datesWithLogs}
      />
      <DaysView selectedDate={selectedDate} onDateChange={handleDateChange} />

      {logsForSelectedDate.length > 0 ? (
        <FlatList
          data={logsForSelectedDate}
          keyExtractor={(item) => `${item.id}`}
          renderItem={({ item, index }) => (
            <View>
              <TouchableRipple onPress={() => setEditingLog(item)}>
                <View style={styles.exerciseLogEntry}>
                  <View style={styles.itemLeftContent}>
                    <Text variant="bodyMedium" style={styles.exerciseTitle}>
                      {exerciseMap[item.exerciseId] || "Unknown Exercise"}
                    </Text>
                    <View style={styles.exerciseMetricsContainer}>
                      <Text variant="bodyLarge">{item.weight}kg</Text>
                      <Text
                        variant="bodyLarge"
                        style={styles.exerciseLogSeparator}
                      >
                        {" x "}
                      </Text>
                      <Text variant="bodyLarge">{item.reps} reps</Text>
                    </View>
                  </View>
                  <Icon source="pencil" size={20} />
                </View>
              </TouchableRipple>
              {index === logsForSelectedDate.length - 1 && (
                <View style={styles.spacer} />
              )}
            </View>
          )}
        />
      ) : (
        <Text style={styles.noLogsText}>No logs</Text>
      )}

      <FAB
        style={styles.fabLeft}
        icon="magnify"
        label="Last entry"
        onPress={() => console.log("Search Pressed")}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setLogExerciseVisible(true)}
      />
      <LogExercise
        visible={logExerciseVisible}
        onConfirm={handleCreateExerciseLog}
        hideDialog={() => setLogExerciseVisible(false)}
      />
      <EditLogDialog
        visible={!!editingLog}
        onDismiss={() => setEditingLog(null)}
        editingLog={editingLog}
        handleDeletePress={handleDeletePress}
        handleEditConfirm={handleEditConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainLogView: { flex: 1 },
  exerciseLogEntry: {
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
  exerciseTitle: {
    fontWeight: "bold",
  },
  exerciseMetricsContainer: {
    flexDirection: "row",
    marginTop: 6,
  },
  exerciseLogSeparator: {
    opacity: 0.5,
  },
  spacer: {
    height: 80,
  },
  noLogsText: {
    marginTop: 20,
    textAlign: "center",
  },
  fabLeft: {
    position: "absolute",
    margin: 16,
    right: 70,
    bottom: 0,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
