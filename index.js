const aws = require('aws-sdk');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });

const csvToJsonConverter = require('./csvConverter.js');
const dynamodb = require('./dynamoDbFunctions.js');
const processor = require('./workoutProcessor');

exports.handler = async (event) => {
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    console.log('bucket: %o', bucket);
    console.log('key: %o', key)

    const params = {
        Bucket: bucket,
        Key: key,
    };

    let s3Response;
    try {
        s3Response = await s3.getObject(params).promise();
    } catch (err) {
        console.error(err);
        return "Error retrieving csv from s3";
    }

    let returnedWorkout;
    try {
        returnedWorkout = await dynamodb.getLatestWorkoutDate(); //TODO implement system that prevents us from processing too much already used data
    } catch (ex) {
        console.error(ex)
        return "Error retrieving latest workout"
    }

    console.log(returnedWorkout)
    const workouts = processor.process( csvToJsonConverter.csvToJson(params.Key, s3Response.Body.toString()))
    console.log(workouts)
    await dynamodb.writeWorkoutsToDb(workouts);

    return "end of index.js"
};
