// Define the Set type
export type Set = {
  id: string; // or number if preferred
  weight: number;
  reps: number;
};

// Define the Exercise type
export type Exercise = {
  id: string;
  sets: Set[];
};

// Define the Workout type
export type Workout = {
  id: string;
  date: Date; // or Date if you're using date objects
  name?: string; // optional name
  exercises: Exercise[];
};

export type Plan = {
  id: string;
  days: DayPlan[];
};

export type DayPlan = {
  id: string;
  exercises: Exercise[];
}