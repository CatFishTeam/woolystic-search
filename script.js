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
    title: { type: 'text' },
    seo_title: { type: 'text' },
    url: { type: 'text' },
    author: { type: 'text' },
    date: { type: 'text' },
    category: { type: 'text' },
    locales: { type: 'text' },
    content: { type: 'text' }
}

client.indices.putMapping({ body: { properties: schema } })


const converter = csvtojsonV2({
    noheader: true,
    trim: true,
    delimiter: ';'
})

const csvFilePath = './data.csv'
converter
    .fromFile(csvFilePath)
    .then((jsonObj) => {
        const body = jsonObj.map(row => {
            return {
                "name": row.field1,
                "description": row.field2,
                "url": row.field3,
                "author": row.field4,
                "date": row.field5,
                "category": row.field6,
                "lang": row.field7,
                "content": row.field8,
            };
        })

        body.forEach((b) => {
            client.index({
                index: 'wooly_gang',
                type: "document",
                body: b
            });
        })
    })
    .catch((error) => {
        console.log(error)
    });


