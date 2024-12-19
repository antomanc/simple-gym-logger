import GraphsScreen from "@/app/graphs";
import LogsScreen from "@/app/logs";
import SettingsScreen from "@/app/settings";
import * as React from "react";
import { BottomNavigation, Text } from "react-native-paper";
import ExercisesScreen from "@/app/exercises";

const LogRoute = () => <LogsScreen />;

const GraphsRoute = () => <GraphsScreen />;

const ExercisesRoute = () => <ExercisesScreen />;

const SettingsRoute = () => <SettingsScreen />;

export const CustomBottomNavigation = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "logs",
      title: "Logs",
      focusedIcon: "file-edit",
    },

    { key: "graphs", title: "Graphs", focusedIcon: "chart-bar" },
    { key: "exercises", title: "Exercises", focusedIcon: "dumbbell" },
    { key: "settings", title: "Settings", focusedIcon: "cog" },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    logs: LogRoute,
    graphs: GraphsRoute,
    exercises: ExercisesRoute,
    settings: SettingsRoute,
  });

  return (
    <BottomNavigation
      style={{ zIndex: 1000 }}
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};
