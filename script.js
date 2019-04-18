require('dotenv').config()
const {Client} = require('@elastic/elasticsearch')
const clientElastic = new Client({node: 'http://localhost:9200'})
const Twitter = require('twitter');
const CoinMarketCap = require('coinmarketcap-api')
const util = require('util');

const clientTwitter = new Twitter({
    consumer_key: process.env.CONSUMER_API,
    consumer_secret: process.env.CONSUMER_API_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const clientCMC = new CoinMarketCap(process.env.CMC_API_KEY)

clientElastic.indices.exists({index: 'wooly_gang'}, (err, res, status) => {
    if (res) {
        console.log('index already exists');
    } else {
        clientElastic.indices.create({
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


clientTwitter.get('search/tweets', {
    q: '#eth',
    lang: 'en'
}, function (error, tweets, response) {
    console.log(util.inspect(tweets, false, null, true))
});

clientCMC.getIdMap({
    symbol: ['BTC', 'ETH']
})
    .then(data => console.log(util.inspect(data, false, null, true)))
    .catch(console.error)

clientCMC.getGlobal()
    .then(data => console.log(util.inspect(data, false, null, true)))
    .catch(console.error)