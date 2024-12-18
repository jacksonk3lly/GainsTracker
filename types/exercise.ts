class Exercise {
    name: string;
    sets: number;
    reps: number;
    weight: number;

    constructor(name: string, sets: number, reps: number, weight: number) {
        this.sets = sets;
        this.reps = reps;
        this.weight = weight;
        this.name = name;
    }
}

export default Exercise;