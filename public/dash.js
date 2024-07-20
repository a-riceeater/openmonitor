fetch("http://10.0.0.181:6060/api/fetch-uptime", {
    method: "GET",
    headers: {
        'Content-Type': 'application/json'

    }
})
    .then((d) => d.json())
    .then((d) => {
        document.querySelector("#upt-cont").innerText = d;
    })