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
        exercise_id INTEGER NOT NULL,
        FOREIGN KEY (workout_id) REFERENCES Workouts (id),
        FOREIGN KEY (exercise_id) REFERENCES Exercises (id)
    );

CREATE TABLE
    IF NOT EXISTS Sets (
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

INSERT INTO
    Workouts (start_time)
VALUES
    ('2024-12-18');

INSERT INTO
    Workouts (start_time)
VALUES
    ('2024-12-19');

INSERT INTO
    Workouts (start_time)
VALUES
    ('2024-12-20');

INSERT INTO
    Exercises (id)
VALUES
    ('Bench Press');

INSERT INTO
    Exercises (id)
VALUES
    ('Shoulder Press');

INSERT INTO
    Exercises (id)
VALUES
    ('Tricep Dips');

INSERT INTO
    Exercises (id)
VALUES
    ('Deadlift');

INSERT INTO
    Exercises (id)
VALUES
    ('Pull Up');

INSERT INTO
    Exercises (id)
VALUES
    ('Bicep Curl');

INSERT INTO
    Exercises (id)
VALUES
    ('Squat');

INSERT INTO
    Exercises (id)
VALUES
    ('Leg Press');

INSERT INTO
    Exercises (id)
VALUES
    ('Calf Raise');

INSERT INTO
    ExerciseUses (workout_id, exercise_id)
VALUES
    (1, 'Bench Press');

INSERT INTO
    ExerciseUses (workout_id, exercise_id)
VALUES
    (1, 'Shoulder Press');

INSERT INTO
    ExerciseUses (workout_id, exercise_id)
VALUES
    (1, 'Tricep Dips');

INSERT INTO
    ExerciseUses (workout_id, exercise_id)
VALUES
    (2, 'Deadlift');

INSERT INTO
    ExerciseUses (workout_id, exercise_id)
VALUES
    (2, 'Pull Up');

INSERT INTO
    ExerciseUses (workout_id, exercise_id)
VALUES
    (2, 'Bicep Curl');

INSERT INTO
    ExerciseUses (workout_id, exercise_id)
VALUES
    (3, 'Squat');

INSERT INTO
    ExerciseUses (workout_id, exercise_id)
VALUES
    (3, 'Leg Press');

INSERT INTO
    ExerciseUses (workout_id, exercise_id)
VALUES
    (3, 'Calf Raise');

INSERT INTO
    Sets (exercise_use_id, reps, weight)
VALUES
    (1, 10, 65);

INSERT INTO
    Sets (exercise_use_id, reps, weight)
VALUES
    (1, 8, 65);

INSERT INTO
    Sets (exercise_use_id, reps, weight)
VALUES
    (2, 10, 30);

INSERT INTO
    Sets (exercise_use_id, reps, weight)
VALUES
    (2, 8, 30);

INSERT INTO
    Sets (exercise_use_id, reps, weight)
VALUES
    (3, 12, 10);

INSERT INTO
    Sets (exercise_use_id, reps, weight)
VALUES
    (3, 10, 10);

INSERT INTO
    Sets (exercise_use_id, reps, weight)
VALUES
    (4, 5, 100);

INSERT INTO
    Sets (exercise_use_id, reps, weight)
VALUES
    (4, 5, 100);

INSERT INTO
    Sets (exercise_use_id, reps, weight)
VALUES
    (5, 8, 0);

INSERT INTO
    Sets (exercise_use_id, reps, weight)
VALUES
    (5, 6, 0);

INSERT INTO
    Sets (exercise_use_id, reps, weight)
VALUES
    (6, 12, 20);

INSERT INTO
    Sets (exercise_use_id, reps, weight)
VALUES
    (6, 10, 20);

INSERT INTO
    Sets (exercise_use_id, reps, weight)
VALUES
    (7, 10, 80);

INSERT INTO
    Sets (exercise_use_id, reps, weight)
VALUES
    (7, 8, 80);

INSERT INTO
    Sets (exercise_use_id, reps, weight)
VALUES
    (8, 12, 120);

INSERT INTO
    Sets (exercise_use_id, reps, weight)
VALUES
    (8, 10, 120);

INSERT INTO
    Sets (exercise_use_id, reps, weight)
VALUES
    (9, 15, 40);

INSERT INTO
    Sets (exercise_use_id, reps, weight)
VALUES
    (9, 12, 40);

Insert Into
    ActiveWorkout (active_workout_id, id)
Values
    (3, 1);