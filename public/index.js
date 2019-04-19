fetch('/test')
    .then( res => res.json())
    .then( data => console.log(dat))

fetch('http://localhost:9200/wooly_gang/_search?q=*&size=1000', {credentials: 'same-origin'})
    .then(res => {
        console.log(res);
        res.json()
    })
    .then(data => {
        console.log(data)
    })