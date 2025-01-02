import * as SQLite from "expo-sqlite";
import { useSQLiteContext, openDatabaseSync } from "expo-sqlite";
import { Set } from "@/types/types";
// import { db } from "@/app/(tabs)/index";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const db: any = openDatabaseSync("SQLite.db");
initDB();

export function initDB() {
  db.execSync(`
CREATE TABLE
    IF NOT EXISTS Workouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        start_time DATETIME NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS Exercises (id TEXT PRIMARY KEY);

CREATE TABLE
    IF NOT EXISTS ExerciseUses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workout_id INTEGER NOT NULL,
        exercise_id TEXT NOT NULL,
        FOREIGN KEY (workout_id) REFERENCES Workouts (id),
        FOREIGN KEY (exercise_id) REFERENCES Exercises (id)
    );

CREATE TABLE
    IF NOT EXISTS Sets (
        selected BOOLEAN NOT NULL DEFAULT TRUE,
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        exercise_use_id INTEGER NOT NULL,
        reps INTEGER NOT NULL,
        weight REAL NOT NULL,
        FOREIGN KEY (exercise_use_id) REFERENCES ExerciseUses (id)
    );

CREATE TABLE
    IF NOT EXISTS ActiveWorkout (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        active_workout_id INTEGER NOT NULL,
        FOREIGN KEY (active_workout_id) REFERENCES Workouts (id)
    );
`);
}

export function addExercises() {
  try {
    db.execSync(`
    INSERT INTO Exercises (id) VALUES ("bench_press");
    INSERT INTO Exercises (id) VALUES ("squat");
    INSERT INTO Exercises (id) VALUES ("deadlift");
    INSERT INTO Exercises (id) VALUES ("overhead_press");
    INSERT INTO Exercises (id) ALUES ("barbell_row");
  `);
  } catch (e) {
    console.log("exercises probably allready there");
  }
}

export function newWorkout() {
  db.execSync(`
    INSERT INTO Workouts (start_time) VALUES (CURRENT_TIMESTAMP);
  `);
}

export function printWorkouts() {
  try {
    const rows = db.getAllSync("SELECT * FROM Workouts;");
    console.log(rows);
  } catch (e) {
    console.error("Error printing workouts:", e);
  }
}

export function setActiveWorkoutId(id: number) {
  db.execSync(`
    INSERT INTO ActiveWorkout (active_workout_id) VALUES (${id});
  `);
}

export function activeWorkoutExists(): boolean {
  try {
    const row = db.getFirstSync(`SELECT 1 FROM ActiveWorkout LIMIT 1;`);
    return !!row;
  } catch (e) {
    console.error("Error checking active workout:", e);
    return false;
  }
}

export function getActiveWorkoutId(): number {
  try {
    const row = db.getFirstSync(
      `SELECT active_workout_id FROM ActiveWorkout LIMIT 1;`
    );
    if (!row) {
      return -1;
    }
    return row.active_workout_id;
  } catch (e) {
    console.error("Error getting active workout ID:", e);
    return -1;
  }
}

export function endActiveWorkout() {
  try {
    db.execSync(`
      DELETE FROM ActiveWorkout;
    `);
  } catch (e) {
    console.error("Error ending active workout:", e);
  }
}

export function newActiveWorkout() {
  try {
    newWorkout();
    let id = getMostRecentWorkoutId();
    db.execSync(`
      INSERT INTO ActiveWorkout (active_workout_id) VALUES (${id});
    `);
  } catch (e) {
    console.error("Error creating new active workout:", e);
  }
}

export function getMostRecentWorkoutId(): number {
  try {
    const row = db.getFirstSync(
      `SELECT id FROM Workouts ORDER BY start_time DESC LIMIT 1;`
    );
    return row.id;
  } catch (e) {
    console.error("Error getting most recent workout ID:", e);
    return -1;
  }
}

export function newExercise(workoutId: number, id: string) {
  if (workoutId === -1) {
    throw new Error("No workout ID provided");
  }
  return db.execAsync(`
    INSERT INTO Exercises (id) VALUES (${id});
  `);
}

export function getNumberOfExerciseUses(exerciseId: string): number {
  try {
    const rows = db.getAllSync(`
      SELECT id FROM ExerciseUses WHERE exercise_id = "${exerciseId}";
    `);

    return rows.length;
  } catch (e) {
    console.error("Error getting number of exercise uses:", e);
    return -1;
  }
}

export function getExerciseIds() {
  try {
    const rows: { id: string }[] = db.getAllSync(`
      SELECT id FROM Exercises;
    `);

    return rows.map((row) => row.id);
  } catch (e) {
    console.error("Error getting exercise IDs:", e);
    return [];
  }
}

export function updateExerciseUseExerciseId(
  exerciseUseId: number,
  exerciseId: string
) {
  db.execSync(`
    UPDATE ExerciseUses
    SET exercise_id = "${exerciseId}"
    WHERE id = ${exerciseUseId};
  `);
}

export function newExerciseUse(workoutId: number, exerciseId?: string): number {
  if (exerciseId) {
    try {
      db.execSync(`
      INSERT INTO ExerciseUses (workout_id, exercise_id) VALUES (${workoutId}, "${exerciseId}");
    `);
    } catch (e) {
      console.log(
        "Error inserting exercise use with workoutId ",
        workoutId,
        "and exerciseId",
        exerciseId,
        e
      );
    }
  } else {
    db.execSync(`
    INSERT INTO ExerciseUses (workout_id, exercise_id) VALUES (${workoutId}, "");
  `);
  }

  const row = db.getFirstSync(`
    SELECT id FROM ExerciseUses WHERE workout_id = ${workoutId} ORDER BY id DESC LIMIT 1;
  `);
  return row.id;
}

export function newSet(
  exerciseUseId: number,
  reps: number,
  weight: number,
  selected: boolean
) {
  db.execSync(`
    INSERT INTO Sets (selected, exercise_use_id, reps, weight) VALUES (${selected}, ${exerciseUseId}, ${reps}, ${weight});
  `);

  const row = db.getFirstSync(`
    SELECT selected, id, weight, reps FROM Sets WHERE exercise_use_id = ${exerciseUseId} ORDER BY id DESC LIMIT 1;
  `);

  let set: Set = {
    id: row.id,
    reps: row.reps,
    weight: row.weight,
    selected: row.selected,
  };

  return set;
}

export function clearAllDatabases() {
  db.execSync(`
    DELETE FROM Workouts;
    DELETE FROM ExerciseUses;
    DELETE FROM Sets;
    DELETE FROM ActiveWorkout;
  `);
}

export function updateSet(set: Set) {
  try {
    db.execSync(`
      UPDATE Sets
      SET reps = ${set.reps}, weight = ${set.weight}, selected = ${set.selected}
      WHERE id = ${set.id};
    `);
  } catch (e) {
    console.log(set);
    console.error("Error updating set:", e);
  }
}

export async function getExerciseUses(workoutId: number) {
  let rows: { id: number; exercise_id: string }[] = db.execAsync(`
    SELECT * FROM ExerciseUses WHERE workout_id = ${workoutId};
  `);

  return rows;
}

export async function getAllExerciseUses() {
  const rows: { id: number }[] = db.execSync(`
    SELECT id FROM ExerciseUses;
  `);

  return rows.map((row) => row.id);
}

export function getWorkoutIds(): number[] {
  try {
    const rows: { id: number }[] = db.getAllSync(`
      SELECT id FROM Workouts ORDER BY start_time DESC;
    `);

    return rows.map((row) => row.id);
  } catch (e) {
    console.error("Error getting workout IDs:", e);
    return [];
  }
}

export function getExerciseUseIds(workoutId: number): number[] {
  try {
    const rows: { id: number }[] = db.getAllSync(`
    SELECT id FROM ExerciseUses WHERE workout_id = ${workoutId};
  `);

    return rows.map((row) => row.id);
  } catch (e) {
    console.error("Error getting exercise use IDs:", e);
    return [];
  }
}

export function getSetIds(exerciseUseId: number): number[] {
  try {
    const rows: { id: number }[] = db.getAllSync(`
    SELECT id FROM Sets WHERE exercise_use_id = ${exerciseUseId};
  `);

    return rows.map((row) => row.id);
  } catch (e) {
    console.error("Error getting set IDs:", e);
    return [];
  }
}

export function getExerciseName(exerciseUseId: number): string {
  try {
    const row = db.getFirstSync(`
    SELECT exercise_id 
    FROM ExerciseUses 
    WHERE id = ${exerciseUseId};
  `);

    return row ? row.exercise_id : "";
  } catch (e) {
    console.error("Error getting exercise name:", e);
    return "";
  }
}

export function deleteSet(setId: number) {
  try {
    db.execSync(`
    DELETE FROM Sets WHERE id = ${setId};
  `);
  } catch (e) {
    console.error("Error deleting set:", e);
  }
}

export async function getSet(setId: number): Promise<Set> {
  try {
    const row = await db.getFirstAsync(`
    SELECT reps, weight, selected
    FROM Sets
    WHERE id = ${setId};
  `);

    if (!row) {
      throw new Error("Set not found");
    }

    let set: Set = {
      id: setId,
      weight: row.weight,
      selected: row.selected,
      reps: row.reps,
    };

    return set;
  } catch (e) {
    console.error("Error getting set:", e);
    throw e;
  }
}

export async function getWorkoutTime(workoutId: number): Promise<string> {
  try {
    const row = await db.getFirstAsync(`
      SELECT start_time
      FROM Workouts
      WHERE id = ${workoutId};
    `);

    return row?.start_time ?? "";
  } catch (e) {
    console.error("Error getting workout time:", e);
    return "";
  }
}
