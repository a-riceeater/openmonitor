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
    const child = spawn('uptime', ['-p']);
    child.stdout.on("data", (data) => {
        console.log(data);
        res.send({ uptime: data })
    })

    child.stderr.on('data', (data) => {
        console.error(`Error: ${data}`);
    });
    
    // Handle the exit event
    child.on('close', (code) => {
        console.log(`Child process exited with code ${code}`);
    });
    
})

app.listen(6060, () => {
    console.log("openmonitor running on port 6060")
})