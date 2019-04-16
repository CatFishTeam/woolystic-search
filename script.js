const csvtojsonV2 = require("csvtojson/v2");
const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://localhost:9200' })


client.indices.exists({index: 'wooly_gang'}, (err, res, status) => {
    if (res) {
        console.log('index already exists');
    } else {
        client.indices.create({
            index: 'wooly_gang'
        }, function (err, resp, status) {
            if (err) {
                console.log(err);
            } else {
                console.log("create", resp);
            }
        }).then(data => console.log(data))
            .catch(err => console.log(err));
    }
});


const converter = csvtojsonV2({
    noheader: true,
    trim: true,
    delimiter: ';',
    quote: 'off'
})

const csvFilePath = './data.csv'
converter
    .fromFile(csvFilePath)
    .then((jsonObj) => {

        const body = [];

        jsonObj.forEach(function (row) {
            body.push({
                "index":
                    {
                        "_index": "wooly_gang",
                    }
            })
            body.push({
                "name": row.field1,
                "description": row.field2,
                "url": row.field3,
                "author": row.field4,
                "date": row.field5,
                "category": row.field6,
                "lang": row.field7,
                "content": row.field8,
            })
        })

        client.bulk({
            body: body
        })
            .then(data => console.log(data))
            .catch(err => console.log(err));

    })
    .catch((error) => {
        console.log(error)
    });


