require('dotenv').config()
const {Client} = require('@elastic/elasticsearch')
const clientElastic = new Client({node: 'http://localhost:9200'})
const Twitter = require('twitter');
const util = require('util');

global.fetch = require('node-fetch')
const cc = require('cryptocompare')
cc.setApiKey(process.env.CRYPTOCOMP_API_KEY)

const clientTwitter = new Twitter({
    consumer_key: process.env.CONSUMER_API,
    consumer_secret: process.env.CONSUMER_API_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

/*
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
    q: '#crypto OR #eth OR #btc -filter:retweets',
    lang: 'en',
    count: 20,
    result_type: 'popular'
}, function (error, tw, response) {
    const tweets = tw.statuses;
    const filteredTweets = [];
    tweets.map(tw => {
        const tweet = {
            created_at: tw.created_at,
            id: tw.id,
            text: tw.text,
            retweet_count: tw.retweet_count,
            favorite_count: tw.favorite_count,
            url: `https://twitter.com/statuses/${tw.id_str}`
        };
        if (!tw.retweeted_status)
            filteredTweets.push(tweet);
    });
    console.log(util.inspect(tweets, false, null, true))
    console.log(tweets.length)
    console.log(filteredTweets)
});*/

const timestamp = new Date('2017-01-01')

cc.histoMinute('BTC', 'USD', timestamp)
    .then(data => {
        console.log(data)
        // -> [ { time: 1487970960,
        //        close: 1171.97,
        //        high: 1172.72,
        //        low: 1171.97,
        //        open: 1172.37,
        //        volumefrom: 25.06,
        //        volumeto: 29324.12 },
        //        ... ]
    })
    .catch(console.error)