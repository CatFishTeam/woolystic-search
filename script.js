require('dotenv').config()
const {Client} = require('@elastic/elasticsearch')
const clientElastic = new Client({node: 'http://localhost:9200'})
const Twitter = require('twitter');
const util = require('util');
const {format, subDays} = require('date-fns')
const CoinMarketCap = require('coinmarketcap-api')
const cmc = new CoinMarketCap(process.env.CMC_API_KEY)
var path = require('path');


const express = require('express')
const app = express()
app.use(express.static('public'))
app.use(express.json())
const port = 3000

app.locals.variable_you_need = 42;

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'))
});


app.post('/getData', (req, res) => {

    clientElastic.search({
        index: 'wooly_gang',
        body: req.body
    }, (err, result) => {
        if (err) console.log(err)
        //console.log(util.inspect(result, true, null, true))
        res.send(result.body)
    })
})

clientElastic.indices.create({
    index: 'wooly_gang'
}, function (err, resp, status) {
    clientElastic.indices.putMapping({
        index: "wooly_gang",
        include_type_name: true,
        type: "tweet",
        body: {
            tweet: {
                properties: {
                    created_at: {"type": "date"},
                    id: {"type": "keyword"},
                    crypto: {
                        "type": "keyword",
                        "fields": {
                            "keyword": {
                                "type": "keyword"
                            }
                        }
                    },
                    favorite_count: {"type": "long"},
                    retweet_count: {"type": "long"},
                    text: {"type": "text"},
                    url: {"type": "keyword"},
                    volume: {
                        "type": "array"
                    }
                }
            }
        }

    }, function (err, resp, respcode) {
        console.log(util.inspect(err, true, null, true));
        console.log(util.inspect(resp, true, null, true));
        console.log(util.inspect(respcode, true, null, true));
    });
})


global.fetch = require('node-fetch')
const cc = require('cryptocompare')
cc.setApiKey(process.env.CRYPTOCOMP_API_KEY)

const clientTwitter = new Twitter({
    consumer_key: process.env.CONSUMER_API,
    consumer_secret: process.env.CONSUMER_API_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

cmc.getTickers({limit: 3}).then(res => {
    for (let data of res.data) {
        // console.log(data)

        clientTwitter.get('search/tweets', {
            q: `#${data.symbol.toLowerCase()} OR #${data.name.toLowerCase().replace(' ', '')} -filter:retweets`,
            // lang: 'en',
            until: format(
                subDays(new Date(), 2),
                'YYYY-MM-DD'
            ),
            count: 100,
            result_type: 'popular'
        }, function (error, tw, response) {
            const tweets = tw.statuses;
            const filteredTweets = [];
            tweets.map(tw => {
                // console.log(util.inspect(tw, true, null, true))

                const tweetHashtags = tw.entities.hashtags.map(hashtag => hashtag.text.toLowerCase())

                let tweet = {
                    created_at: tw.created_at,
                    id: tw.id,
                    text: tw.text,
                    retweet_count: tw.retweet_count,
                    favorite_count: tw.favorite_count,
                    url: `https://twitter.com/statuses/${tw.id_str}`,
                    crypto: data.symbol.toLowerCase(),
                    volume: []
                };

                const timestamp = new Date(tweet.created_at)
                const limit = 48;

                cc.histoHour(data.symbol, 'USD', {timestamp: timestamp, limit: limit})
                    .then(data => {
                        for (let i = 0; i < limit; i++) {
                            tweet.volume.push({[data[i].time]: data[i].volumefrom})
                        }

                        filteredTweets.push({"index": {"_index": "wooly_gang"}})
                        filteredTweets.push(tweet);

                        clientElastic.bulk({
                            index: 'wooly_gang',
                            body: filteredTweets
                        })
                            .then(data => console.log())
                            .catch(err => console.log(err));


                    })
                    .catch(console.error)
            });
        });
    }

});
