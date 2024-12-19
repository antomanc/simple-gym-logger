import {
  ExerciseLoggerContext,
  ExerciseLoggerContextProps,
} from "@/providers/ExerciseLoggerProvider";
import { useContext } from "react";

export const useExerciseLogger = (): ExerciseLoggerContextProps => {
  const context = useContext(ExerciseLoggerContext);
  if (!context) {
    throw new Error(
      "useExerciseLogger must be used within an ExerciseLoggerProvider"
    );
  }
  return context;
};
