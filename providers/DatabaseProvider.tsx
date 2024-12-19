import React, { createContext, useEffect, useState, ReactNode } from "react";
import * as SQLite from "expo-sqlite";

export interface DatabaseContextType {
  db: SQLite.SQLiteDatabase | null;
  error: string | null;
  dbInitialized: boolean;
}

export const DatabaseContext = createContext<DatabaseContextType | undefined>(
  undefined
);

export const DatabaseProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        console.log("Initializing database...");
        const database = await SQLite.openDatabaseAsync("workouts.db");
        setDb(database);

        await database.execAsync(
          `CREATE TABLE IF NOT EXISTS workouts (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              date INTEGER NOT NULL,
              exerciseId INTEGER NOT NULL,
              weight INTEGER NOT NULL,
              reps INTEGER NOT NULL
            );`
        );

        await database.execAsync(
          `CREATE TABLE IF NOT EXISTS exercises (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL
            );`
        );

        console.log("Database initialized");
        setDbInitialized(true);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
        console.error("Database initialization failed", err);
      }
    };

    initializeDatabase();
  }, []);

  return (
    <DatabaseContext.Provider value={{ db, error, dbInitialized }}>
      {children}
    </DatabaseContext.Provider>
  );
};
