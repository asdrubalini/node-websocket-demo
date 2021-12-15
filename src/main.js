const express = require("express");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set("view engine", "ejs");
app.use(express.static("static"));

const PORT = 3000;

// Key is the sensor's unique identifier
// Value is the received data
let sensor_data = {};

// Main page where we retrieve data from all connected sensors
app.get("/", (_req, res) => {
    res.render("pages/index", { data: sensor_data });
});

app.get("/data", (_req, res) => {
    res.json(sensor_data);
});

// Sensor page which emulate the software running in a sensor
app.get("/emulate_sensor", (_req, res) => {
    res.render("pages/emulate_sensor");
});

io.on("connection", (socket) => {
    console.log(`a user connected ${socket}`);

    socket.on("sensor_temperature", (data) => {
        console.log(`data from ${data.name}: ${data.data}`);
        socket.broadcast.emit("new_data", data);
    });

    socket.on("request_data_from_sensors", (data) => {
        console.log("Requesting data...");
        socket.broadcast.emit("retrieve_sensor_data");
    });

    socket.on("disconnect", () => {
        console.log("sensor disconnected");
    });
});

server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});
