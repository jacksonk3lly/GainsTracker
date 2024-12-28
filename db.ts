import * as SQLite from "expo-sqlite";
import { Set } from "@/types/types";

const db = await SQLite.openDatabaseAsync("GainsTracker");

// `execAsync()` is useful for bulk queries when you want to execute altogether.
// Please note that `execAsync()` does not escape parameters and may lead to SQL injection.
await db.execAsync(`
      CREATE TABLE IF NOT EXISTS workouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        startTime DATETIME NOT NULL,
      );

      CREATE TABLE IF NOT EXISTS exercises (
        id TEXT PRIMARY KEY,
      );

      CREATE TABLE IF NOT EXISTS exercise_use (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workout_id INTEGER NOT NULL,
        exercise_id INTEGER NOT NULL,
        FOREIGN KEY(workout_id) REFERENCES workouts(id),
        FOREIGN KEY(exercise_id) REFERENCES exercises(id)
      );

      CREATE TABLE IF NOT EXISTS sets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        exercise_use_id INTEGER NOT NULL,
        reps INTEGER NOT NULL,
        weight REAL NOT NULL,
        FOREIGN KEY(exercise_use_id) REFERENCES exercise_use(id)
      );
`);

export function newWorkout(time: string) {
  return db.execAsync(`
    INSERT INTO workouts (time) VALUES (CURRENT_TIMESTAMP);
  `);
}

export function newExercise(id: string) {
  return db.execAsync(`
    INSERT INTO exercises (id) VALUES (${id});
  `);
}

export function newExerciseUse(workoutId: number, exerciseId: string) {
  return db.execAsync(`
    INSERT INTO exercise_use (workout_id, exercise_id) VALUES (${workoutId}, ${exerciseId});
  `);
}

export function newSet(exerciseUseId: number, reps: number, weight: number) {
  return db.execAsync(`
    INSERT INTO sets (exercise_use_id, reps, weight) VALUES (${exerciseUseId}, ${reps}, ${weight});
  `);
}

export async function insertTestData() {
  await newWorkout("2024-12-18");
  await newExercise("Bench Press");
  await newExercise("Shoulder Press");
  await newExercise("Tricep Dips");

  let workoutId = 1; // Assuming this is the ID of the newly created workout
  await newExerciseUse(workoutId, "Bench Press");
  await newExerciseUse(workoutId, "Shoulder Press");
  await newExerciseUse(workoutId, "Tricep Dips");

  let exerciseUseId = 1; // Assuming this is the ID of the newly created exercise use
  await newSet(exerciseUseId, 10, 65);
  await newSet(exerciseUseId, 8, 65);

  exerciseUseId = 2; // Assuming this is the ID of the newly created exercise use
  await newSet(exerciseUseId, 10, 30);
  await newSet(exerciseUseId, 8, 30);

  exerciseUseId = 3; // Assuming this is the ID of the newly created exercise use
  await newSet(exerciseUseId, 12, 10);
  await newSet(exerciseUseId, 10, 10);

  await newWorkout("2024-12-19");
  await newExercise("Deadlift");
  await newExercise("Pull Up");
  await newExercise("Bicep Curl");

  workoutId = 2; // Assuming this is the ID of the newly created workout
  await newExerciseUse(workoutId, "Deadlift");
  await newExerciseUse(workoutId, "Pull Up");
  await newExerciseUse(workoutId, "Bicep Curl");

  exerciseUseId = 4; // Assuming this is the ID of the newly created exercise use
  await newSet(exerciseUseId, 5, 100);
  await newSet(exerciseUseId, 5, 100);

  exerciseUseId = 5; // Assuming this is the ID of the newly created exercise use
  await newSet(exerciseUseId, 8, 0);
  await newSet(exerciseUseId, 6, 0);

  exerciseUseId = 6; // Assuming this is the ID of the newly created exercise use
  await newSet(exerciseUseId, 12, 20);
  await newSet(exerciseUseId, 10, 20);

  await newWorkout("2024-12-20");
  await newExercise("Squat");
  await newExercise("Leg Press");
  await newExercise("Calf Raise");

  workoutId = 3; // Assuming this is the ID of the newly created workout
  await newExerciseUse(workoutId, "Squat");
  await newExerciseUse(workoutId, "Leg Press");
  await newExerciseUse(workoutId, "Calf Raise");

  exerciseUseId = 7; // Assuming this is the ID of the newly created exercise use
  await newSet(exerciseUseId, 10, 80);
  await newSet(exerciseUseId, 8, 80);

  exerciseUseId = 8; // Assuming this is the ID of the newly created exercise use
  await newSet(exerciseUseId, 12, 120);
  await newSet(exerciseUseId, 10, 120);

  exerciseUseId = 9; // Assuming this is the ID of the newly created exercise use
  await newSet(exerciseUseId, 15, 40);
  await newSet(exerciseUseId, 12, 40);
}

export async function getExerciseUses(workoutId: number) {
  return db.execAsync(`
    SELECT * FROM exercise_use WHERE workout_id = ${workoutId};
  `);
}

export async function getWorkoutIds(): Promise<number[]> {
  // Assuming `db.getAllSync` returns rows with `id` as a number
  const rows: { id: number }[] = db.getAllSync(`
    SELECT id FROM workouts;
  `);

  // Extract the IDs directly
  return rows.map((row) => row.id);
}

export async function getExerciseUseIds(workoutId: number): Promise<number[]> {
  // Assuming `db.getAllSync` returns rows with `id` as a number
  const rows: { id: number }[] = db.getAllSync(`
    SELECT id FROM exercise_use WHERE workout_id = ${workoutId};
  `);

  // Extract the IDs directly
  return rows.map((row) => row.id);
}

export async function getSetIds(exerciseUseId: number): Promise<number[]> {
  // Assuming `db.getAllSync` returns rows with `id` as a number
  const rows: { id: number }[] = db.getAllSync(`
    SELECT id FROM sets WHERE exercise_use_id = ${exerciseUseId};
  `);

  // Extract the IDs directly
  return rows.map((row) => row.id);
}

export async function getExerciseName(
  exerciseUseId: number
): Promise<string | null> {
  const row = await db.getFirstAsync<{ name: string | null }>(`
    SELECT name 
    FROM exercises 
    WHERE id = (
      SELECT exercise_id 
      FROM exercise_use 
      WHERE id = ${exerciseUseId}
    );
  `);

  // If no row is returned, `row` will be `null`, otherwise return `row.name`
  return row ? row.name : null;
}

export async function getSet(setId: number) {
  const row = await db.getFirstAsync<{ reps: number; weight: number }>(`
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
