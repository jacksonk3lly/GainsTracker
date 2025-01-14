import * as SQLite from "expo-sqlite";
import { useSQLiteContext, openDatabaseSync } from "expo-sqlite";
import { Set } from "@/types/types";
// import { db } from "@/app/(tabs)/index";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export const db: SQLite.SQLiteDatabase = openDatabaseSync("SQLite.db");
initDB();

export function initDB() {
  db.execSync(`
CREATE TABLE
    IF NOT EXISTS Workouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        start_time DATETIME NOT NULL,
        plan_id TEXT DEFAULT NULL,
        FOREIGN KEY (plan_id) REFERENCES WorkoutPlan (id)
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

CREATE TABLE
    IF NOT EXISTS WorkoutPlan (
        order_number INTEGER ,
        name TEXT NOT NULL,
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        program_id TEXT NOT NULL,
        FOREIGN KEY (program_id) REFERENCES PROGRAM (id)
    );

CREATE TABLE
    IF NOT EXISTS PROGRAM (id TEXT PRIMARY KEY);


CREATE TABLE
    IF NOT EXISTS ExercisePlan (
        order_number INTEGER ,
        exercise_id TEXT NOT NULL,
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        increment REAL DEFAULT 2.5,
        workout_plan_id INTEGER NOT NULL,
        FOREIGN KEY (workout_plan_id) REFERENCES WorkoutPlan (id)
        FOREIGN KEY (exercise_id) REFERENCES Exercises (id)
    );
`);
}

export function dropTables() {
  db.execSync(`
    DROP TABLE Workouts;
    DROP TABLE Exercises;
    DROP TABLE ExerciseUses;
    DROP TABLE Sets;
    DROP TABLE ActiveWorkout;
    DROP TABLE WorkoutPlan;
    DROP TABLE PROGRAM;
    DROP TABLE ExercisePlan;
  `);
}

export function setUp5x5() {
  try {
    db.execSync(`
    INSERT INTO PROGRAM (id) VALUES ("5x5");
    INSERT INTO WorkoutPlan (order_number,program_id,name) VALUES (0,"5x5","Workout A");
    INSERT INTO WorkoutPlan (order_number,program_id,name) VALUES (1,"5x5","Workout B");

  `);

    const workoutAId = (
      db.getFirstSync(`
      SELECT id FROM WorkoutPlan WHERE program_id = "5x5" AND name = "Workout A"
    `) as { id: number }
    ).id;

    db.execSync(`
      INSERT INTO ExercisePlan (order_number,workout_plan_id, exercise_id) VALUES (0,${workoutAId},"squat");
      INSERT INTO ExercisePlan (order_number,workout_plan_id, exercise_id) VALUES (1,${workoutAId},"bench_press");
      INSERT INTO ExercisePlan (order_number,workout_plan_id, exercise_id) VALUES (2,${workoutAId},"barbell_row");
    `);

    const workoutBId = (
      db.getFirstSync(`
      SELECT id FROM WorkoutPlan WHERE program_id = "5x5" AND name = "Workout B"
    `) as { id: number }
    ).id;

    db.execSync(`
      INSERT INTO ExercisePlan (order_number,workout_plan_id, exercise_id) VALUES (0,${workoutBId},"squat");
      INSERT INTO ExercisePlan (order_number,workout_plan_id, exercise_id) VALUES (1,${workoutBId},"overhead_press");
      INSERT INTO ExercisePlan (order_number,workout_plan_id, exercise_id,increment) VALUES (2,${workoutBId},"deadlift",5);
    `);
  } catch (e) {
    console.log("programs probably already there");
  }
}

export function addExercises() {
  try {
    db.execSync(`
    INSERT INTO Exercises (id) VALUES ("bench_press");
    INSERT INTO Exercises (id) VALUES ("Dips");
    INSERT INTO Exercises (id) VALUES ("weighted_pullups");
    INSERT INTO Exercises (id) VALUES ("squat");
    INSERT INTO Exercises (id) VALUES ("deadlift");
    INSERT INTO Exercises (id) VALUES ("overhead_press");
    INSERT INTO Exercises (id) VALUES ("barbell_row");
  `);
  } catch (e) {
    console.log("exercises probably allready there");
  }
}

export function createWorkoutBasedOnProgram(programId: string) {
  try {
    // Get the WorkoutPlans for the program
    const workoutPlans = db.getAllSync(`
      SELECT id FROM WorkoutPlan WHERE program_id = "${programId}" ORDER BY order_number;
    `) as { id: number }[];

    console.log("workoutPlans", workoutPlans);

    if (workoutPlans.length === 0) {
      throw new Error(`No WorkoutPlans found for program_id ${programId}`);
    }

    // Get the most recent workout referencing the program
    const mostRecentWorkout = db.getFirstSync(`
      SELECT Workouts.plan_id, WorkoutPlan.order_number FROM Workouts
      JOIN WorkoutPlan ON Workouts.plan_id = WorkoutPlan.id
      WHERE WorkoutPlan.program_id = "${programId}"
      ORDER BY Workouts.start_time DESC LIMIT 1
    `) as { order_number: number; plan_id: number } | null;

    // Determine the next WorkoutPlan id
    let nextPlanId;
    if (!mostRecentWorkout) {
      nextPlanId = workoutPlans[0].id; // Start with the first plan if no previous workout exists
    } else {
      const last_orderNumber = mostRecentWorkout.order_number;
      const new_order_number = (last_orderNumber + 1) % workoutPlans.length;
      nextPlanId =
        workoutPlans[(last_orderNumber + 1) % workoutPlans.length].id; // Cycle to the next plan
    }

    // Create the new workout
    db.execSync(`
      INSERT INTO Workouts (start_time, plan_id) VALUES (CURRENT_TIMESTAMP, ${nextPlanId})
    `);

    let newWorkoutId = getMostRecentWorkoutId();
    db.execSync(`
      INSERT INTO ActiveWorkout (active_workout_id) VALUES (${newWorkoutId});
    `);

    getExercisePlanIds(nextPlanId).forEach((exercisePlanId) => {
      let weight = 0;
      try {
        const row = db.getFirstSync(`
        SELECT id 
        FROM ExerciseUses 
        WHERE exercise_id = "${getExerciseIdFromPlan(exercisePlanId)}"
        ORDER BY id DESC LIMIT 1
      `) as { id: number } | null;

        if (!row) {
          throw new Error("No Old ExerciseUses found for this ExercisePlan");
        }

        const lastUseOfPlanExerciseUseId = row.id;

        console.log("lastUseOfPlanExerciseUseId", lastUseOfPlanExerciseUseId);

        const lowestWeight = db.getFirstSync(`
        SELECT MIN(weight) as min_weight 
        FROM Sets 
        WHERE exercise_use_id = ${lastUseOfPlanExerciseUseId} AND
        SELECTED = TRUE;
      `) as { min_weight: number } | null;

        const increment = getIncrementFromPlan(exercisePlanId);
        console.log("increment", increment);
        weight = lowestWeight ? lowestWeight.min_weight + increment : 0;
      } catch (e) {
        console.log("FirstTime UsingExercise", e);
      }

      const exerciseUse_id = newExerciseUse(
        newWorkoutId,
        getExerciseIdFromPlan(exercisePlanId)
      );
      for (let i = 0; i < 5; i++) {
        newSet(exerciseUse_id, 5, weight, false);
      }
    });
  } catch (error) {
    console.error("Error creating workout:", error);
    return null;
  }
}

export function deleteExerciseUsesWithNoWorkout() {
  db.execSync(`
    DELETE FROM ExerciseUses WHERE workout_id IS NULL OR workout_id NOT IN (SELECT id FROM Workouts);
  `);
}

export function getIncrementFromPlan(exercisePlanId: number): number {
  const row = db.getFirstSync(
    `SELECT increment FROM ExercisePlan WHERE id = ${exercisePlanId}`
  ) as { increment: number } | null;

  if (!row) {
    throw new Error(`No ExercisePlan found with id ${exercisePlanId}`);
  }

  return row.increment;
}

function getExerciseIdFromPlan(exercisePlanId: number): string {
  const row = db.getFirstSync(
    `SELECT exercise_id FROM ExercisePlan WHERE id = ${exercisePlanId}`
  ) as { exercise_id: string } | null;

  if (!row) {
    throw new Error(`No ExercisePlan found with id ${exercisePlanId}`);
  }

  return row.exercise_id;
}

export function getExercisePlanIds(workoutPlanId: number): number[] {
  try {
    const rows: { id: number }[] = db.getAllSync(`
    SELECT id FROM ExercisePlan WHERE workout_plan_id = ${workoutPlanId};
  `);

    return rows.map((row) => row.id);
  } catch (e) {
    console.error("Error getting exercise plan IDs:", e);
    return [];
  }
}

export function newWorkout() {
  db.execSync(`
    INSERT INTO Workouts (start_time) VALUES (CURRENT_TIMESTAMP);
  `);
}

export function deleteUncheckedSets(workoutId: number) {
  getExerciseUseIds(workoutId).forEach((exerciseUseId) => {
    db.execSync(`DELETE FROM Sets WHERE selected = FALSE AND exercise_use_id = ${exerciseUseId};`);
  });
}

export function deleteExerciseUsesWithNoSets(workoutId:number){
  getExerciseUseIds(workoutId).forEach((exerciseUseId) => {
    if(getSetIds(exerciseUseId).length === 0){
      deleteExerciseUse(exerciseUseId);
    }
  });
}

export function deleteWorkout(workoutId: number) {
  try {
    db.execSync(`
    DELETE FROM Workouts WHERE id = ${workoutId};
  `);
  } catch (e) {
    console.error("Error deleting workout:", e);
  }
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

export function getWorkoutStartInTime(id:number): number {
  try {
    const row = db.getFirstSync(
      `SELECT start_time FROM Workouts WHERE id = ${id};`
    ) as { start_time: number } | null;
    if (!row) {
      return -1;
    }
    return row.start_time;
  } catch (e) {
    console.error("Error getting start time:", e);
    return -1;
  }
}


export function getActiveWorkoutId(): number {
  try {
    const row = db.getFirstSync(
      `SELECT active_workout_id FROM ActiveWorkout LIMIT 1;`
    ) as { active_workout_id: number } | null;
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
    console.log("newActiveWorkout id", id);
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
    ) as { id: number } | null;
    if (!row) {
      return -1;
    }
    return row.id;
  } catch (e) {
    console.error("Error getting most recent workout ID:", e);
    return -1;
  }
}

export function newExercise(id: string) {
  console.log("newExercise id", id);
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

export function deleteExerciseUse(exerciseUseId: number) {
  try {
    db.execSync(`
    DELETE FROM ExerciseUses WHERE id = ${exerciseUseId};
  `);
  } catch (e) {
    console.error("Error deleting exercise use:", e);
  }
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
  `) as { id: number } | null;
  if (!row) {
    throw new Error("No ExerciseUses found");
  }
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
  `) as { selected: boolean; id: number; weight: number; reps: number } | null;
  if (!row) {
    throw new Error("No Sets found");
  }

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
    Delete FROM Exercises;
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

// export async function getExerciseUses(workoutId: number) {
//   let rows: { id: number; exercise_id: string }[] = db.execAsync(`
//     SELECT * FROM ExerciseUses WHERE workout_id = ${workoutId};
//   `);

//   return rows;
// }

export function getAllExerciseUses() {
  const rows: { id: number }[] = db.getAllSync(`
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

export function getExerciseUseIdsOfExercise(exerciseId: string): number[] {
  try {
    const rows: { id: number }[] = db.getAllSync(`
    SELECT id FROM ExerciseUses WHERE exercise_id = "${exerciseId}";
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
  `) as { exercise_id: string } | null;

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
    const row = (await db.getFirstAsync(`
    SELECT reps, weight, selected
    FROM Sets
    WHERE id = ${setId};
  `)) as { reps: number; weight: number; selected: boolean } | null;

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
    const row = (await db.getFirstAsync(`
      SELECT start_time
      FROM Workouts
      WHERE id = ${workoutId};
    `)) as { start_time: string } | null;

    return row?.start_time ?? "";
  } catch (e) {
    console.error("Error getting workout time:", e);
    return "";
  }
}
