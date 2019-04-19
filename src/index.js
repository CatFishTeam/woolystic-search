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
    .then(res => res.json())
    .then(data => console.log(data))



fetch('/getData', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        "aggs": {
            "group_by_crypto": {
                "terms": {
                    "field": "crypto.keyword"
                },
                "aggs": {
                    "sum_retweet": {
                        "sum": {
                            "field": "retweet_count"
                        }
                    },
                    "sum_fav": {
                        "sum": {
                            "field": "favorite_count"
                        }
                    }
                }
            }
        }
    })
})
    .then(res => res.json())
    .then(data => {
        console.log(data.aggregations.group_by_crypto.buckets)

        let buckets = data.aggregations.group_by_crypto.buckets

        let dataFav = []
        let dataRT = []

        let labels = [];

        buckets.forEach(function (bucket) {
            labels.push(bucket.key)
            dataFav.push(bucket.sum_fav.value)
            dataRT.push(bucket.sum_retweet.value)
        })

        console.log(labels)
        console.log(dataFav)
        console.log(dataRT)

        var ctxChartReactByCryptoPerHours = document.getElementById('chartReactByCryptoPerHours').getContext('2d');
        var chartReactByCryptoPerHours = new Chart(ctxChartReactByCryptoPerHours, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: "FAV",
                    backgroundColor: '#cc3399',
                    data: dataFav
                }, {
                    label: "RT",
                    backgroundColor: '#0099ff',
                    data: dataRT
                }]
            },
            options: {
                responsive: false,
                legend: {
                    display: false
                },
                scales: {
                    yAxes: [{
                        stacked: true
                    }],
                    xAxes: [{
                        stacked: true
                    }]
                },

            }
        })
    })