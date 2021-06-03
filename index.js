const redis = require("redis");
const express = require("express")
const path = require("path");


const app = express();

app.use(express.json())

const password = "iWUtiD2ubv8RU2fuej2vmVtFu5Abneve";
const endpoint = "//redis-14101.c92.us-east-1-3.ec2.cloud.redislabs.com:14101";
const client = redis.createClient(endpoint, {password: password});

client.on("ready", () => console.log("ready"));
client.on("error", (err) => console.log(err));
client.on("end", () => console.log("disconnected"));

client.on("subscribe", (channel, count) =>
    console.log("subscribe:", " channel = ", channel, " count = ", count));
client.on("message", (channel, message) =>
    console.log("sub channel: ", channel, ": ", message));

app.post('/add/:date', (req, res) => {
    client.set(req.params.date, JSON.stringify(req.body));
    res.send({ok: 'ok'});
});

app.get('/get/:date', (req, res) => {
    const date = req.params.date;
    client.get(date, (error, reply) => {
        if (!reply) {
            res.status(404).send({
                status: "День не найден"
            })
        } else {
            res.send(JSON.parse(reply.toString()))
        }
    })
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
})

app.listen(3000, () => console.log('http://localhost:3000/'))