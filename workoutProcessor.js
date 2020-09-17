exports.process = (json) => {
    return json.reduce(this.processRow, [])
}

this.processRow = (workoutArray, currentRow) => {
    const exerciseDate = new Date(currentRow.Date)
    const createdWorkout = workoutArray.find((workout) => workout.workoutDate.getTime() === exerciseDate.getTime())

    if (createdWorkout) {
        createdWorkout.addExercise(currentRow)
    } else {
        const newWorkout = new Workout(exerciseDate, currentRow['Workout Name'], currentRow['Workout Notes']);
        newWorkout.addExercise(currentRow);
        workoutArray.push(newWorkout);
    }

    return workoutArray
}


class Workout {

    exercises = []

    constructor(date, name, workoutNotes) {
        this.workoutDate = date;
        this.name = name;
        this.workoutNotes = workoutNotes;
    }

    addExercise(exerciseRow) {
        this.exercises.push(this.toExercise(exerciseRow))
    }

    toExercise(exerciseRow) {
        if(exerciseRow['Reps']){
            return new MuscleExercise(
                exerciseRow['Exercise Name'],
                exerciseRow['notes'],
                this.workoutDate,
                exerciseRow['Weight'],
                exerciseRow['Set Order'],
                exerciseRow['Weight Unit'],
                exerciseRow['Reps']
            )
        } else {
            return new CardioExercise(
                exerciseRow['Exercise Name'],
                exerciseRow['notes'],
                this.workoutDate,
                exerciseRow['Distance'],
                exerciseRow['Distance Unit'],
                exerciseRow.seconds
            )
        }
    }
}

class Exercise {
    constructor(name, notes,exerciseDate) {
        this.name = name
        this.notes = notes
        this.exerciseDate = exerciseDate
    }
}

class MuscleExercise extends Exercise {
    weight
    setOrder
    weightUnit
    reps
    isMuscleExercise = true

    constructor(name, notes, workoutDate, weight, setOrder, weightUnit, reps) {
        super(name, notes, workoutDate);
        this.weight = weight;
        this.setOrder = setOrder;
        this.weightUnit = weightUnit;
        this.reps = reps;
    }
}

class CardioExercise extends Exercise {
    distance
    distanceUnit
    seconds
    isMuscleExercise = false

    constructor(name, notes, workoutDate, distance, distanceUnit, seconds) {
        super(name, notes, workoutDate);
        this.distance = distance;
        this.distanceUnit = distanceUnit;
        this.seconds = seconds;
    }
}
