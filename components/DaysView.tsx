import { useCallback, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { Button, IconButton, Text, useTheme } from "react-native-paper";

interface DaysViewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const DaysView = ({ selectedDate, onDateChange }: DaysViewProps) => {
  const today = useMemo(() => new Date(), []);
  const isToday = useMemo(
    () => selectedDate.toDateString() === today.toDateString(),
    [selectedDate, today]
  );

  const changeDate = useCallback(
    (days: number) => {
      if (days === 0) {
        onDateChange(today);
        return;
      }
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + days);
      onDateChange(newDate);
    },
    [onDateChange, selectedDate, today]
  );

  return (
    <View style={styles.dateSelectorContainer}>
      <IconButton
        icon="chevron-left"
        onPress={() => changeDate(-1)}
        size={32}
        style={styles.iconButton}
      />
      <View style={styles.centerContent}>
        {isToday ? (
          <>
            <Text variant="titleMedium">Today</Text>
            <Text variant="titleMedium" style={{ opacity: 0.5, marginLeft: 6 }}>
              (
              {selectedDate.toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
              })}
              )
            </Text>
          </>
        ) : (
          <Text variant="titleMedium">
            {selectedDate.toLocaleDateString("en-US", {
              day: "2-digit",
              month: "long",
            })}
          </Text>
        )}
        {!isToday && (
          <IconButton
            onPress={() => changeDate(0)}
            icon="history"
            size={20}
            style={{ ...styles.iconButton, marginLeft: 6 }}
          />
        )}
      </View>

      <IconButton
        icon="chevron-right"
        onPress={() => changeDate(1)}
        size={32}
        style={styles.iconButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dateSelectorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingLeft: "10%",
    paddingRight: "10%",
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    textAlign: "center",
  },
  iconButton: {
    margin: 0,
  },
});
