require('dotenv').config()
const {Client} = require('@elastic/elasticsearch')
const clientElastic = new Client({node: 'http://localhost:9200'})
const Twitter = require('twitter');
const util = require('util');
const {format, subHours} = require('date-fns')
const CoinMarketCap = require('coinmarketcap-api')
const cmc = new CoinMarketCap(process.env.CMC_API_KEY)


global.fetch = require('node-fetch')
const cc = require('cryptocompare')
cc.setApiKey(process.env.CRYPTOCOMP_API_KEY)

const clientTwitter = new Twitter({
    consumer_key: process.env.CONSUMER_API,
    consumer_secret: process.env.CONSUMER_API_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});


cmc.getTickers({limit: 25}).then(res => {
    for (let data of res.data.slice(0, 2)) {// virer le slice, c'est juste pour test sur deux now
        console.log(data)

        clientTwitter.get('search/tweets', {
            q: `#${data.symbol.toLowerCase()} OR #${data.name.toLowerCase().replace(' ', '')} -filter:retweets`,
            // lang: 'en',
            until: format(
                subHours(new Date(), 1),
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
                    crypto: data.symbol.toLowerCase()
                };

                const timestamp = new Date(tweet.created_at)
                const limit = 1;

                cc.histoHour('BTC', 'USD', {timestamp: timestamp, limit: limit})
                    .then(data => {
                        tweet.volumeNow = data[0].volumefrom
                        tweet.volumeFutur = data[1].volumefrom

                        filteredTweets.push({"index": {"_index": "wooly_gang"}})
                        filteredTweets.push(tweet);

                        clientElastic.bulk({
                            index: 'tweets',
                            body: filteredTweets
                        })
                            .then(data => console.log(data))
                            .catch(err => console.log(err));


                    })
                    .catch(console.error)
            });
        });
    }


});