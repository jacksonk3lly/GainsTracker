// Define the Set type
export type Set = {
  id: string; // or number if preferred
  weight: number;
  reps: number;
};

// Define the Exercise type
export type Exercise = {
  id: string;
  name: string;
  sets: Set[];
};

// Define the Workout type
export type Workout = {
  id: string;
  date: string; // or Date if you're using date objects
  name?: string; // optional name
  exercises: Exercise[];
};
