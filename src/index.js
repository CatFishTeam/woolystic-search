import Chart from 'chart.js';

fetch('/getData', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        query: {
            match_all: {}
        },
        size: 100
    })
})
    .then(res => res.json())
    .then(tweets => {
        let firstTweetByCrypto = [];
        tweets.filter(({_source}) => {
            const crypto = _source.crypto;
            if (!firstTweetByCrypto[crypto]) firstTweetByCrypto[crypto] = _source;
        });

        firstTweetByCrypto = Object.values(firstTweetByCrypto);

        firstTweetByCrypto.map((tweet, index) => console.log(index, tweet))

        firstTweetByCrypto.forEach(function (tweet, index) {
            if (index > 9) return;
            console.log(tweet.crypto);
            document.getElementById("charts").innerHTML += `<canvas id="chart_${index}"></canvas>`
            const ctx = document.getElementById(`chart_${index}`).getContext('2d');

            const data = [];
            const labels = [];
            const volume = tweet.volume;

            volume.filter((v, index) => {
                labels.push(index);
                data.push(Object.values(v)[0]);
            });

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels,
                    datasets: [{
                        label: `Volume per hour - #${tweet.crypto}`,
                        data,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        });
    });

function getCountByCrypto(crypto){
    let a = [];

    fetch('/getCount', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: {
                bool: {
                    must: [
                        { match: { crypto: crypto }}
                    ]
                }
            }
        })
        })
        .then( res => res.json())
        .then( data => {
            a['crypto'] = crypto
            a['count'] = data.count
        })
    return a
}

const top25 = [
    ['btc', 'bitcoin'],
    ['eth', 'ethereum'],
    ['xrp', 'xrp'],
    ['bch', 'bitcoin cash'],
    ['ltc', 'litecoin'],
    ['eos', 'eos'],
    ['bnb', 'binance coin'],
    ['usdt', 'tether'],
    ['xlm','stellar'],
    ['ada','cardano'],
    ['trx','tron'],
    ['xmr','monero'],
    ['dash','dash'],
    ['bsv','bitcoin sv'],
    ['xtz','tezos'],
    ['miota','iota'],
    ['neo','neo'],
    ['etc','ethereum classic'],
    ['ont','ontologie'],
    ['mkr','maker'],
    ['xem','nem'],
    ['bat','basic attention token'],
    ['zec', 'zcash'],
    ['cro', 'crypto.com chain'],
    ['vet', 'vechain']
]

let statsTop25 = [];
top25.forEach((crypto) => {
    let res = getCountByCrypto(crypto[0])
    statsTop25.push(res)
})

console.log(statsTop25);
