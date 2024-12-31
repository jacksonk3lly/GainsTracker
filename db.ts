import * as SQLite from "expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { Set } from "@/types/types";
import { db } from "@/app/(tabs)/index";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

// const db = useSQLiteContext();

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

export function newExercise(id: string) {
  return db.execAsync(`
    INSERT INTO Exercises (id) VALUES (${id});
  `);
}

export function newExerciseUse(workoutId: number, exerciseId?: string): number {
  if (exerciseId) {
    db.execSync(`
      INSERT INTO ExerciseUses (workout_id, exercise_id) VALUES (${workoutId}, ${exerciseId});
    `);
  } else {
    db.execSync(`
    INSERT INTO ExerciseUses (workout_id, exercise_id) VALUES (${workoutId}, "blank");
  `);
  }

  const row = db.getFirstSync(`
    SELECT id FROM ExerciseUses WHERE workout_id = ${workoutId} ORDER BY id DESC LIMIT 1;
  `);
  return row.id;
}

export function newSet(exerciseUseId: number, reps: number, weight: number) {
  return db.execAsync(`
    INSERT INTO sets (exercise_use_id, reps, weight) VALUES (${exerciseUseId}, ${reps}, ${weight});
  `);
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
      SELECT id FROM Workouts;
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
    SELECT id FROM sets WHERE exercise_use_id = ${exerciseUseId};
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

export async function getSet(setId: number): Promise<Set> {
  try {
    const row = await db.getFirstAsync(`
    SELECT reps, weight
    FROM sets
    WHERE id = ${setId};
  `);

    if (!row) {
      throw new Error("Set not found");
    }

    let set: Set = {
      id: setId,
      weight: row.weight,
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
