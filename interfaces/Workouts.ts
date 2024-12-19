export interface ExerciseLog {
  exerciseId: number;
  date: number;
  weight: number;
  reps: number;
  id: number;
}

export type ExerciseLogWithoutId = Omit<ExerciseLog, "id">;

export interface Exercise {
  id: number;
  name: string;
}
