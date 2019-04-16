const csvtojsonV2 = require("csvtojson/v2");
const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://localhost:9200' })


client.indices.create({
    index: 'wooly_gang'
}, function (err, resp, status) {
    if (err) {
        console.log(err);
    } else {
        console.log("create", resp);
    }
});

const schema = {
    name: { type: 'text' },
    description: { type: 'text' },
    url: { type: 'text' },
    author: { type: 'text' },
    date: { type: 'text' },
    category: { type: 'text' },
    content: { type: 'text' }
}

client.indices.putMapping({ 'wooly_gang', 'document', body: { properties: schema } })


const converter = csvtojsonV2({
    noheader: true,
    trim: true,
    delimiter: ';'
})

const csvFilePath = './data.csv'
converter
    .fromFile(csvFilePath)
    .then((jsonObj) => {

        client.index({
            index: 'wooly_gang',
            type: "document",
            body: {
                "name": jsonObj.field1,
                "description": jsonObj.field2,
                "url": jsonObj.field3,
                "author": jsonObj.field4,
                "date": jsonObj.field5,
                "category": jsonObj.field6,
                "lang": jsonObj.field7,
                "content": jsonObj.field8,

            }
        }, function (err, resp, status) {
            console.log(resp);
        });

    })


