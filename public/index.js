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