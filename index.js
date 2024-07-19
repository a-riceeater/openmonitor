const express = require("express");
const path = require("path")
const crypto = require("crypto-js");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "html", "home.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "html", "login.html"))
})

app.listen(5050, () => {
    console.log("openmonitor running on port 5050")
})