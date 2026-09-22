// server.js
const express = require("express");
const WebSocket = require("ws");
const path = require("path");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

const app = express();
const PORT_HTTP = 8080;   // Puerto HTTP
const PORT_WS   = 8081;   // Puerto WebSocket

// --- Servidor HTTP --- Sirve index.html, sketch.js, estilos.css desde carpeta public
app.use(express.static(path.join(__dirname, "..")));
app.listen(PORT_HTTP, () => {
  console.log(`Servidor web en http://localhost:${PORT_HTTP}`);
});

// --- Servidor WebSocket ---
const wss = new WebSocket.Server({ port: PORT_WS });
console.log(`Servidor WebSocket en ws://localhost:${PORT_WS}`);

wss.on("connection", () => {
  console.log("Cliente p5 conectado");
});

// --- Bloque Arduino (Serial → WS) ---
const port = new SerialPort({ path: "COM5", baudRate: 9600 }); // ajusta COM según PC
const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

parser.on("data", (line) => {
  const datos = line.trim(); // ej: "123,200,50"
  console.log("Lectura Arduino:", datos);

  // Reenviar a todos los clientes conectados
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(datos);
    }
  });
});