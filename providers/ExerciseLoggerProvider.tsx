import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { Exercise, ExerciseLog } from "@/interfaces/Workouts";
import { useDatabase } from "@/hooks/useDatabase";

export interface ExerciseLoggerContextProps {
  exercises: Exercise[];
  logs: { [key: string]: ExerciseLog[] };
  addExerciseLog: (log: {
    exerciseId: number;
    weight: number;
    reps: number;
    date: Date;
  }) => Promise<void>;
  editExerciseLog: (id: number, weight: number, reps: number) => Promise<void>;
  deleteExerciseLog: (id: number) => Promise<void>;
  fetchLogsByDate: (date: Date, forceFetch?: boolean) => Promise<void>;
  fetchExercises: () => Promise<void>;
  editExercise: (exerciseId: number, name: string) => Promise<void>;
  addExercise: (name: string) => Promise<void>;
  deleteExercise: (exerciseId: number) => Promise<void>;
  getExerciseById: (id: number) => Promise<Exercise | undefined>;
}

export const ExerciseLoggerContext = createContext<
  ExerciseLoggerContextProps | undefined
>(undefined);

interface ExerciseLoggerProviderProps {
  children: React.ReactNode;
}

export const ExerciseLoggerProvider: React.FC<ExerciseLoggerProviderProps> = ({
  children,
}) => {
  const {
    addExerciseLog,
    editExerciseLog,
    deleteExerciseLog,
    getLogsByDate,
    getExercises,
    addExercise,
    editExercise,
    deleteExercise,
    getExerciseById,
    dbInitialized,
  } = useDatabase();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [logs, setLogs] = useState<{ [key: string]: ExerciseLog[] }>({});

  const fetchLogsByDate = useCallback(
    async (date: Date, forceFetch = false) => {
      const dateKey = date.toISOString().split("T")[0];
      if (!logs[dateKey] || forceFetch) {
        const fetchedLogs = await getLogsByDate(date);
        if (!fetchedLogs?.length && !forceFetch) return;
        setLogs((prevLogs) => ({
          ...prevLogs,
          [dateKey]: fetchedLogs,
        }));
      }
    },
    [getLogsByDate]
  );

  const fetchExercises = useCallback(async () => {
    const fetchedExercises = await getExercises();
    setExercises(fetchedExercises);
  }, [getExercises]);

  useEffect(() => {
    const fetchData = async () => {
      if (dbInitialized && (!exercises.length || !Object.keys(logs).length)) {
        await fetchExercises();
        await fetchLogsByDate(new Date(), true);
      }
    };
    fetchData();
  }, [dbInitialized, fetchLogsByDate, fetchExercises]);

  const handleAddExerciseLog = useCallback(
    async (log: {
      exerciseId: number;
      weight: number;
      reps: number;
      date: Date;
    }) => {
      await addExerciseLog(log);
    },
    [addExerciseLog, fetchLogsByDate]
  );

  const handleEditExerciseLog = useCallback(
    async (id: number, weight: number, reps: number) => {
      await editExerciseLog(id, weight, reps);
    },
    [editExerciseLog, fetchLogsByDate]
  );

  const handleDeleteExerciseLog = useCallback(
    async (id: number) => {
      await deleteExerciseLog(id);
    },
    [deleteExerciseLog, fetchLogsByDate]
  );

  const handleEditExercise = useCallback(
    async (exerciseId: number, name: string) => {
      await editExercise(exerciseId, name);
    },
    [editExercise]
  );

  const handleAddExercise = useCallback(
    async (name: string) => {
      await addExercise(name);
    },
    [addExercise]
  );

  const handleDeleteExercise = useCallback(
    async (exerciseId: number) => {
      await deleteExercise(exerciseId);
    },
    [deleteExercise]
  );

  return (
    <ExerciseLoggerContext.Provider
      value={{
        exercises,
        logs,
        addExerciseLog: handleAddExerciseLog,
        editExerciseLog: handleEditExerciseLog,
        deleteExerciseLog: handleDeleteExerciseLog,
        fetchLogsByDate,
        fetchExercises,
        editExercise: handleEditExercise,
        addExercise: handleAddExercise,
        deleteExercise: handleDeleteExercise,
        getExerciseById,
      }}
    >
      {children}
    </ExerciseLoggerContext.Provider>
  );
};
