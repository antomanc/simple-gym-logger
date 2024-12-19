import { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { Button, IconButton, Text, useTheme } from "react-native-paper";

type DateChange =
  | {
      increment: number;
      newDate?: never;
    }
  | {
      increment?: never;
      newDate: Date;
    };

interface DaysViewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const DaysView = ({ selectedDate, onDateChange }: DaysViewProps) => {
  const today = useMemo(() => new Date(), []);
  const isDateToday = useMemo(() => {
    return (
      today.getDate() === selectedDate.getDate() &&
      today.getMonth() === selectedDate.getMonth() &&
      today.getFullYear() === selectedDate.getFullYear()
    );
  }, [selectedDate, today]);

  const handleDateChange = ({ increment, newDate }: DateChange) => {
    if (newDate) {
      onDateChange(newDate);
    } else {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + increment);
      onDateChange(newDate);
    }
  };

  return (
    <View style={styles.dateSelectorContainer}>
      <IconButton
        icon="chevron-left"
        onPress={() => handleDateChange({ increment: -1 })}
        size={32}
        style={{ margin: 0 }}
      />
      <View style={styles.centerContent}>
        {isDateToday ? (
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
        {!isDateToday && (
          <IconButton
            onPress={() => handleDateChange({ newDate: today })}
            icon="history"
            size={20}
            style={{ margin: 0, marginLeft: 6 }}
          />
        )}
      </View>

      <IconButton
        icon="chevron-right"
        onPress={() => handleDateChange({ increment: 1 })}
        size={32}
        style={{ margin: 0 }}
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
});
