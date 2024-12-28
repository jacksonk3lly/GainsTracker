import * as SQLite from "expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { Set } from "@/types/types";
import { db } from "@/app/(tabs)/index";

// const db = useSQLiteContext();

export function newWorkout(time: string) {
  return db.execAsync(`
    INSERT INTO workouts (time) VALUES (CURRENT_TIMESTAMP);
  `);
}

export function newExercise(id: string) {
  return db.execAsync(`
    INSERT INTO Exercises (id) VALUES (${id});
  `);
}

export function newExerciseUse(workoutId: number, exerciseId: string) {
  return db.execAsync(`
    INSERT INTO ExerciseUses (workout_id, exercise_id) VALUES (${workoutId}, ${exerciseId});
  `);
}

export function newSet(exerciseUseId: number, reps: number, weight: number) {
  return db.execAsync(`
    INSERT INTO sets (exercise_use_id, reps, weight) VALUES (${exerciseUseId}, ${reps}, ${weight});
  `);
}

export async function getExerciseUses(workoutId: number) {
  return db.execAsync(`
    SELECT * FROM ExerciseUses WHERE workout_id = ${workoutId};
  `);
}

export async function getWorkoutIds(): Promise<number[]> {
  try {
    const rows: { id: number }[] = db.getAllSync(`
      SELECT id FROM Workouts;
    `);

    return rows.map((row) => row.id);
  } catch (e) {
    return [];
  }
}

export async function getExerciseUseIds(workoutId: number): Promise<number[]> {
  try {
    const rows: { id: number }[] = db.getAllSync(`
    SELECT id FROM ExerciseUses WHERE workout_id = ${workoutId};
  `);

    return rows.map((row) => row.id);
  } catch (e) {
    console.log(e);
  }

  return [];
}

export async function getSetIds(exerciseUseId: number): Promise<number[]> {
  const rows: { id: number }[] = db.getAllSync(`
    SELECT id FROM sets WHERE exercise_use_id = ${exerciseUseId};
  `);

  return rows.map((row) => row.id);
}

export async function getExerciseName(
  exerciseUseId: number
): Promise<string | null> {
  try {
    const row = await db.getFirstAsync(`
    SELECT exercise_id 
    FROM ExerciseUses 
    WHERE id = ${exerciseUseId};
  `);

    // console.log("here", row);
    return row ? row.exercise_id : null;
  } catch (e) {
    console.log(e);
  }

  return null;
}

export async function getSet(setId: number): Promise<Set> {
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
    console.log(e);
    return "";
  }
}
