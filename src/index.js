import Chart from 'chart.js';

var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
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

fetch('/getData', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        query: {
            match_all: {}
        }
    })
})
    .then( res => res.json())
    .then( data => console.log(data))


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