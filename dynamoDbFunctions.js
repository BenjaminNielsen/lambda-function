const aws = require('aws-sdk');
const dynamodb = new aws.DynamoDB({apiVersion: '2012-08-10'});


exports.writeWorkoutsToDb = (workouts) => {
    const params = {
        RequestItems: {
            "Music": [
                {
                    PutRequest: {
                        Item: {
                            "AlbumTitle": {
                                S: "Somewhat Famous"
                            },
                            "Artist": {
                                S: "No One You Know"
                            },
                            "SongTitle": {
                                S: "Call Me Today"
                            }
                        }
                    }
                },
                {
                    PutRequest: {
                        Item: {
                            "AlbumTitle": {
                                S: "Songs About Life"
                            },
                            "Artist": {
                                S: "Acme Band"
                            },
                            "SongTitle": {
                                S: "Happy Day"
                            }
                        }
                    }
                },
                {
                    PutRequest: {
                        Item: {
                            "AlbumTitle": {
                                S: "Blue Sky Blues"
                            },
                            "Artist": {
                                S: "No One You Know"
                            },
                            "SongTitle": {
                                S: "Scared of My Shadow"
                            }
                        }
                    }
                }
            ]
        }
    };

    if(params != null){
        const requiredBatchWrites = Math.ceil(workouts.length / 25);
        console.log(requiredBatchWrites);
        //batchWriteItem can only write up to 25 items at a time.
        for(let i =0; i < requiredBatchWrites; i++){
            dynamodb.batchWriteItem(params, function(err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else     console.log(data);           // successful response
            });
        }
    }
    console.log('writeWorkoutsToDb called');
}

exports.getLatestWorkoutDate = () => {
    console.log('getLatestWorkoutDate called');
}

