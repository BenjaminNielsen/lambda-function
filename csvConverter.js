const Papa = require('papaparse');

exports.csvToJson = (filename, content) => {
    console.log('Entered converter');

    const result = Papa.parse(content, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
    })
    const data = result.data
    if(data)
        return data
}


// {
//     data:   // array of parsed data
//         errors: // array of errors
//             meta:   // object with extra info
//                 }
