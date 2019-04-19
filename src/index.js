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
