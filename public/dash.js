fetch("/api/fetch-uptime", {
    method: "GET",
    headers: {
        'Content-Type': 'application/json'

    }
})
    .then((d) => d.json())
    .then((d) => {
        document.querySelector("#upt-cont").innerText = d.uptime;
    })

fetch("/api/fetch-service-status", {
    method: "GET",
    headers: {
        'Content-Type': 'application/json'

    }
})
    .then((d) => d.json())
    .then((d) => {
        document.querySelector("#service-stat-cont").innerText = `${d.running.replaceAll("\n", "")}/${d.total.replaceAll("\n", "")}`
    })