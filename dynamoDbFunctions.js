const aws = require('aws-sdk');
aws.config.update({
    region: "us-east-2",
});
const dynamodb = new aws.DynamoDB({apiVersion: '2012-08-10'});
const documentClient = new aws.DynamoDB.DocumentClient();

const {v4: uuidv4} = require('uuid');

const WORKOUT_TABLE_NAME = process.env.WORKOUT_TABLE_NAME
const EXERCISE_TABLE_NAME = process.env.EXERCISE_TABLE_NAME
const LAST_LOAD_TABLE_NAME = process.env.EXERCISE_TABLE_NAME


exports.writeWorkoutsToDb = async (workouts) => {
    console.log('Entered writeWorkoutsToDb');
    try {
        for (const workout of workouts) {
            const workoutGuid = uuidv4()
            const params = this.convertWorkoutToParams(workoutGuid, workout);
            await dynamodb.putItem(params).promise();
            for (const exercise of workout.exercises) {
                const exerciseParams = this.convertExerciseToParams(workoutGuid, exercise);
                await dynamodb.putItem(exerciseParams).promise();
            }
        }
    } catch (ex) {
        console.error(ex)
        return "Problem input db stuff"
    }
}

exports.getLatestWorkoutDate = async () => {
    console.log('Entered get Latest workout date');
    try {
        let params = {
            TableName: LAST_LOAD_TABLE_NAME
        };
        let resultDate = await documentClient.scan(params).promise()
        if(resultDate){
            resultDate = new Date(result)
        }
        return resultDate
    } catch (error) {
        console.error(error);
    }
    return null
}

// Scan table for all items using the Document Client
exports.scanForResultsDdbDc = async () => {
    try {
        let params = {
            TableName: WORKOUT_TABLE_NAME
        };
        let result = await documentClient.scan(params).promise()
        console.log(JSON.stringify(result))
        return result
    } catch (error) {
        console.error(error);
    }
}
//TODO: make all these functions properties of the class, if js will let me
this.convertWorkoutToParams = (guid, workout) => {
    const itemParams = {
        Item: {
            "id": {
                S: guid
            },
            "name": {
                S: workout.name
            },
            "workoutDate": {
                S: workout.workoutDate.toISOString()
            },
            "createdAt": {
                S: new Date().toISOString()
            },
            "updatedAt": {
                S: new Date().toISOString()
            }
        },
        ReturnConsumedCapacity: "TOTAL",
        TableName: WORKOUT_TABLE_NAME

    }
    if (workout.notes) {
        itemParams.Item["workoutNotes"] = workout.notes
    }

    return itemParams
};

this.convertExerciseToParams = (workoutGuid, exercise) => {
    const exerciseParams = {
        Item: {
            "id": {
                S: uuidv4()
            },
            "workoutID": {
                S: workoutGuid
            },
            "name": {
                S: exercise.name
            },
            "exerciseDate": {
                S: exercise.exerciseDate.toISOString()
            },
            "createdAt": {
                S: new Date().toISOString()
            },
            "updatedAt": {
                S: new Date().toISOString()
            }
        },
        ReturnConsumedCapacity: "TOTAL",
        TableName: EXERCISE_TABLE_NAME
    }
    if (exercise.isMuscleExercise)
        this.addMuscleParams(exercise, exerciseParams)
    else
        this.addCardioParams(exercise, exerciseParams)
    return exerciseParams;
}

this.addMuscleParams = (exercise, currentParams) => {
    console.log("Muscle exercise going to params: %o", exercise)
    if(exercise.weight)
        currentParams.Item["weight"] = {N: exercise.weight.toString()}
    if(exercise.weightUnit)
        currentParams.Item["weightUnit"] = {S: exercise.weightUnit}
    currentParams.Item["setOrder"] = {N: exercise.setOrder.toString()}
    currentParams.Item["reps"] = {N: exercise.reps.toString()}
    currentParams.Item["isMuscleExercise"] = {BOOL: true}
}

this.addCardioParams = (exercise, currentParams) => {
    if (exercise.distance)
        currentParams.Item["distance"] = {N: exercise.distance.toString()}
    if (exercise.distanceUnit)
        currentParams.Item["distanceUnit"] = {S: exercise.distanceUnit}
    if (exercise.seconds)
        currentParams.Item["seconds"] = {N: exercise.seconds.toString()}
    currentParams.Item["isMuscleExercise"] = {BOOL: false}
}
