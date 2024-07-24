const express = require("express");
const path = require("path")
const crypto = require("crypto-js");
const { spawn } = require("child_process");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "html", "home.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "html", "login.html"))
})

app.get("/api/fetch-uptime", (req, res) => {
    if (process.platform != 'linux') return res.send({ uptime: 'Unknown' })
    const child = spawn('uptime', ['-p']);
    child.stdout.on("data", (data) => {
        console.log(data.toString());
        res.send({ uptime: data.toString().replace("up ", "") })
    })

    child.stderr.on('data', (data) => {
        console.error(`Error: ${data}`);
    });

    child.on('close', (code) => {
        console.log(`Child process exited with code ${code}`);
    });
})

app.get("/api/fetch-service-status", (req, res) => {
    if (process.platform != 'linux') return res.send({ total: '0', running: '0' })

    var totalServices, runningServices;

    function loadTotal() {
        const systemctl = spawn('systemctl', ['list-unit-files', '--type=service']);
        const grep = spawn('grep', ['.service']);
        const wc = spawn('wc', ['-l']);

        systemctl.stdout.pipe(grep.stdin);
        grep.stdout.pipe(wc.stdin);

        wc.stdout.on('data', (data) => {
            console.log(`Number of services: ${data}`);
            totalServices = JSON.stringify(data);
            loadRunning();
        });

        wc.stderr.on('data', (data) => {
            console.error(`wc error: ${data}`);
        });

        wc.on('close', (code) => {
            if (code !== 0) {
                console.log(`wc process exited with code ${code}`);
            }
        });
    }

    function loadRunning() {
        const systemctl = spawn('systemctl', ['list-units', '--type=service', '--state=running']);

        const grep = spawn('grep', ['.service']);
        systemctl.stdout.pipe(grep.stdin);

        const wc = spawn('wc', ['-l']);
        grep.stdout.pipe(wc.stdin);

        wc.stdout.on('data', (data) => {
            runningServices = JSON.stringify(data);
            console.log(`Number of running services: ${data}`);
            res.send({ total: totalServices, running: runningServices });
        });

        wc.stderr.on('data', (data) => {
            console.error(`wc error: ${data}`);
        });

        wc.on('close', (code) => {
            if (code !== 0) {
                console.log(`wc process exited with code ${code}`);
            }
        });
    }

    loadTotal();
})

app.listen(6060, () => {
    console.log("openmonitor running on port 6060")
})