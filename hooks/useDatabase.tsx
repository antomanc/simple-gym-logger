import {
  Exercise,
  ExerciseLog,
  ExerciseLogWithoutId,
} from "@/interfaces/Workouts";
import { DatabaseContext } from "@/providers/DatabaseProvider";
import { useCallback, useContext } from "react";

export const useDatabase = () => {
  const context = useContext(DatabaseContext);

  if (!context) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }

  const getLogsByDate = async (date: Date): Promise<ExerciseLog[]> => {
    if (!context.db) {
      throw new Error("Database not initialized");
    }

    // console.log("getLogsByDate", date);

    const startOfDay = new Date(date.setHours(0, 0, 0, 0)).getTime();
    const endOfDay = new Date(date.setHours(23, 59, 59, 999)).getTime();

    const result = await context.db.getAllAsync(
      "SELECT * FROM workouts WHERE date >= ? AND date <= ?",
      [startOfDay, endOfDay]
    );

    return result as ExerciseLog[];
  };

  const addExerciseLog = async ({
    exerciseId,
    date,
    weight,
    reps,
  }: Omit<ExerciseLogWithoutId, "date"> & { date: Date }) => {
    if (!context.db) {
      throw new Error("Database not initialized");
    }

    console.log("addExerciseLog", exerciseId, date, weight, reps);

    await context.db.runAsync(
      "INSERT INTO workouts (date, exerciseId, weight, reps) VALUES (?, ?, ?, ?)",
      [date.getTime(), exerciseId, weight, reps]
    );
  };

  const editExerciseLog = async (id: number, weight: number, reps: number) => {
    if (!context.db) {
      throw new Error("Database not initialized");
    }

    console.log("editExerciseLog", id, weight, reps);

    await context.db.runAsync(
      "UPDATE workouts SET weight = ?, reps = ? WHERE id = ?",
      [weight, reps, id]
    );
  };

  const deleteExerciseLog = async (id: number) => {
    if (!context.db) {
      throw new Error("Database not initialized");
    }

    console.log("deleteExerciseLog", id);

    await context.db.runAsync("DELETE FROM workouts WHERE id = ?", [id]);
  };

  const addExercise = async (name: string) => {
    if (!context.db) {
      throw new Error("Database not initialized");
    }

    console.log("addExercise", name);

    await context.db.runAsync("INSERT INTO exercises (name) VALUES (?)", [
      name,
    ]);
  };

  const getExercises = async (): Promise<Exercise[]> => {
    if (!context.db) {
      throw new Error("Database not initialized");
    }

    console.log("getExercises");

    const result = await context.db.getAllAsync("SELECT * FROM exercises");

    return result as Exercise[];
  };

  const getExerciseById = async (id: number): Promise<Exercise> => {
    if (!context.db) {
      throw new Error("Database not initialized");
    }

    console.log("getExerciseById", id);

    const result = await context.db.getFirstAsync(
      "SELECT * FROM exercises WHERE id = ?",
      [id]
    );

    return result as Exercise;
  };

  const editExercise = async (id: number, name: string) => {
    if (!context.db) {
      throw new Error("Database not initialized");
    }

    console.log("editExercise", id, name);

    await context.db.runAsync("UPDATE exercises SET name = ? WHERE id = ?", [
      name,
      id,
    ]);
  };

  const deleteExercise = async (id: number) => {
    if (!context.db) {
      throw new Error("Database not initialized");
    }

    console.log("deleteExercise", id);

    await context.db.runAsync("DELETE FROM exercises WHERE id = ?", [id]);
  };

  return {
    getLogsByDate,
    addExerciseLog,
    editExerciseLog,
    deleteExerciseLog,
    addExercise,
    getExercises,
    getExerciseById,
    editExercise,
    deleteExercise,
    dbInitialized: context.dbInitialized,
  };
};
