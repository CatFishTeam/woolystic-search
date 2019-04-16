const csvtojsonV2 = require("csvtojson/v2");


const converter = csvtojsonV2({
    noheader: true,
    trim: true,
    delimiter: ';'
})

const csvFilePath = 'data.csv'
converter
    .fromFile(csvFilePath)
    .then((jsonObj) => {
        console.log(jsonObj);

    })