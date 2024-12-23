import * as SQLite from "expo-sqlite";

const db = await SQLite.openDatabaseAsync("databaseName");

// `execAsync()` is useful for bulk queries when you want to execute altogether.
// Please note that `execAsync()` does not escape parameters and may lead to SQL injection.
await db.execAsync(`
      CREATE TABLE IF NOT EXISTS workouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        name TEXT,
        notes TEXT
      );
      CREATE TABLE IF NOT EXISTS exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workout_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        FOREIGN KEY(workout_id) REFERENCES workouts(id)
      );

      CREATE TABLE IF NOT EXISTS sets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        exercise_id INTEGER NOT NULL,
        reps INTEGER NOT NULL,
        weight REAL NOT NULL,
        FOREIGN KEY(exercise_id) REFERENCES exercises(id)
      );
`);

// `runAsync()` is useful when you want to execute some write operations.
const result = await db.runAsync(
  "INSERT INTO test (value, intValue) VALUES (?, ?)",
  "aaa",
  100
);
