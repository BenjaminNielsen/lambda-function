const aws = require('aws-sdk');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });

const converter = require('./csvConverter.js');
const dynamodb = require('./dynamoDbFunctions.js');

exports.handler = async (event, context) => {
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    console.log('bucket: %o', bucket);
    console.log('key: %o', key)
    console.log(JSON.stringify(event));

    const params = {
        Bucket: bucket,
        Key: key,
    };
    try {
        const { ContentType } = await s3.getObject(params).promise();
        console.log(ContentType)
        if(ContentType === 'text/csv') {
            const mappedJson =  s3.getObject(params, (err, data) => {
                // if (err != null)
                //     throw err;

                const json = converter.csvToJson(params.key, data.Body.toString());
                dynamodb.writeWorkoutsToDb(json);
                dynamodb.getLatestWorkoutDate();

            });
        } else {
            console.log('confirmation that this is breaking stuff')
        }

        return ContentType;
    } catch (err) {
        console.log(err);
        const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
        console.log(message);
        throw new Error(message);
    }
};
