fetch('/test')
    .then(res => res.json())
    .then(data => { console.log(data) })