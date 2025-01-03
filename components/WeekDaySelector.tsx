import { useCallback, useEffect, useMemo, useState } from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";
import { useExerciseLogger } from "@/hooks/useExerciseLogger";
import { useDatabase } from "@/hooks/useDatabase";

interface WeekDaySelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  datesWithDot?: string[];
}

const daysOfWeek = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
// TODO settings to change first day of the week

export const WeekDaySelector: React.FC<WeekDaySelectorProps> = ({
  selectedDate,
  onDateChange,
  datesWithDot,
}) => {
  const { fetchLogsByDate } = useExerciseLogger();
  const theme = useTheme();
  const { dbInitialized } = useDatabase();
  const [baseDate] = useState(selectedDate);
  const [weeksCache, setWeeksCache] = useState<Date[][]>([]);
  const [weekInViewportIndex, setWeekInViewportIndex] = useState(0);

  const getWeekDays = useCallback((startOfWeek: Date): Date[] => {
    return daysOfWeek.map((_, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      return date;
    });
  }, []);

  const getStartOfWeekByDate = useCallback((date: Date): Date => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1);
    return startOfWeek;
  }, []);

  const datesArrayForWeekInViewport = useMemo((): Date[] => {
    return weeksCache[weekInViewportIndex] || [];
  }, [weeksCache, weekInViewportIndex]);

  useEffect(() => {
    const startOfWeek = getStartOfWeekByDate(baseDate);
    const newWeek = getWeekDays(startOfWeek);
    setWeeksCache([newWeek]);
  }, [baseDate]);

  useEffect(() => {
    if (!dbInitialized) return;
    datesArrayForWeekInViewport.forEach((date) => {
      fetchLogsByDate(date);
    });
  }, [datesArrayForWeekInViewport, dbInitialized]);

  const handleWeekChange = useCallback(
    (direction: number) => {
      const newIndex = weekInViewportIndex + direction;
      if (weeksCache[newIndex]) {
        setWeekInViewportIndex(newIndex);
        return;
      }
      const referenceDate =
        direction < 0 ? weeksCache[0][0] : weeksCache[weeksCache.length - 1][6];
      const referenceCopy = new Date(referenceDate); // copy to avoid mutation
      referenceCopy.setDate(referenceCopy.getDate() + 3 * direction); // 3 is a safe value
      const newStartOfWeek = getStartOfWeekByDate(referenceCopy);
      const newWeek = getWeekDays(newStartOfWeek);

      const weekExists = weeksCache.some(
        (week) => week[0].getTime() === newWeek[0].getTime()
      );

      if (weekExists) return;

      if (direction < 0) {
        setWeeksCache([newWeek, ...weeksCache]);
      } else {
        setWeeksCache([...weeksCache, newWeek]);
        setWeekInViewportIndex(weeksCache.length);
      }
    },
    [weeksCache, weekInViewportIndex]
  );

  useEffect(() => {
    if (!weeksCache.length) return;
    const isSelectedDateInViewport = datesArrayForWeekInViewport.some(
      (date) => date.toDateString() === selectedDate.toDateString()
    );
    if (isSelectedDateInViewport) return;
    const index = weeksCache.findIndex((week) =>
      week.some((date) => date.toDateString() === selectedDate.toDateString())
    );
    if (index !== -1) {
      setWeekInViewportIndex(index);
    } else {
      const startOfWeek = getStartOfWeekByDate(selectedDate);
      const newWeek = getWeekDays(startOfWeek);
      if (selectedDate < weeksCache[0][0]) {
        setWeeksCache([newWeek, ...weeksCache]);
        setWeekInViewportIndex(0);
      } else {
        setWeeksCache([...weeksCache, newWeek]);
        setWeekInViewportIndex(weeksCache.length);
      }
    }
  }, [selectedDate]);

  return (
    <View style={styles.weekDayContainer}>
      <IconButton
        style={styles.iconButton}
        icon="chevron-left"
        onPress={() => handleWeekChange(-1)}
      />
      {datesArrayForWeekInViewport.map((item, index) => {
        const isSelected = selectedDate.toDateString() === item.toDateString();
        const isBaseDate = item.toDateString() === baseDate.toDateString();
        return (
          <View key={index} style={styles.weekDayWrapper}>
            <TouchableOpacity
              style={[
                styles.weekDay,
                isSelected && { backgroundColor: theme.colors.primary },
                isBaseDate &&
                  !isSelected && {
                    borderColor: theme.colors.onBackground,
                  },
              ]}
              onPress={() => onDateChange(item)}
            >
              <Text
                style={[
                  styles.weekDayText,
                  {
                    color: isSelected
                      ? theme.colors.surface
                      : theme.colors.onSurface,
                  },
                ]}
              >
                {item.toDateString().split(" ")[0][0]}
              </Text>
              {datesWithDot &&
                datesWithDot.includes(item.toISOString().split("T")[0]) && (
                  <View style={styles.dot}>
                    <Text
                      style={{
                        color: isSelected
                          ? theme.colors.onPrimary
                          : theme.colors.primary,
                        fontSize: 25,
                      }}
                    >
                      •
                    </Text>
                  </View>
                )}
            </TouchableOpacity>
          </View>
        );
      })}
      <IconButton
        style={styles.iconButton}
        icon="chevron-right"
        onPress={() => handleWeekChange(1)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  weekDayContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  weekDayWrapper: {
    flex: 1,
  },
  iconButton: {
    marginHorizontal: 0,
  },
  weekDay: {
    height: 40,
    justifyContent: "center",
    marginHorizontal: 2,
    borderRadius: 100,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  weekDayText: {
    fontSize: 16,
  },
  dot: {
    position: "absolute",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    top: 15,
    right: 0,
    bottom: 0,
    left: 0,
  },
});
