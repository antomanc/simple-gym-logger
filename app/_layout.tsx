import { Slot, Stack } from "expo-router";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { SafeAreaView, StatusBar, useColorScheme, View } from "react-native";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { CustomBottomNavigation } from "@/components/BottomNavigation";
import { DatabaseProvider } from "@/providers/DatabaseProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ExerciseLoggerProvider } from "@/providers/ExerciseLoggerProvider";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme();

  const paperTheme =
    colorScheme === "dark"
      ? { ...MD3DarkTheme, colors: theme.dark }
      : { ...MD3LightTheme, colors: theme.light };

  const statusBarStyle =
    colorScheme === "dark" ? "light-content" : "dark-content";

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar
        backgroundColor={paperTheme.colors.surface}
        barStyle={statusBarStyle}
      />
      <DatabaseProvider>
        <ExerciseLoggerProvider>
          <GestureHandlerRootView>
            <SafeAreaView style={{ flex: 1 }}>
              <View
                style={{
                  flex: 1,
                  paddingTop: 8,
                  backgroundColor: paperTheme.colors.background,
                }}
              >
                <CustomBottomNavigation />
              </View>
            </SafeAreaView>
          </GestureHandlerRootView>
        </ExerciseLoggerProvider>
      </DatabaseProvider>
    </PaperProvider>
  );
}
