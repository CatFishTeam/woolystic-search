const csvtojsonV2 = require("csvtojson/v2");
const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://localhost:9200' })

const converter = csvtojsonV2({
    delimiter: ';',
    trim: true,
    ignoreEmpty: false,
    quote: "off"
})

const csvFilePath = './data.csv'

converter
    .fromFile(csvFilePath)
    .then((jsonObj) => {
        const body = jsonObj.map(row => {
            return {
                "title": row.field1,
                "seo_title": row.field2,
                "url": row.field3,
                "author": row.field4,
                "date": row.field5,
                "category": row.field6,
                "locales": row.field7,
                "content": row.field8
            };
        })

        console.log(jsonObj.length)

        client.bulk({
            index: 'wooly_gang',
            body: jsonObj
        }).then((success) => {
            console.log(success)
        }).catch((error) => {
            console.log(error)
        });
    })
    .catch((error) => {
        console.log(error)
    });