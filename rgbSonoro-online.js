let started = false;
let socket;

let r = 0;
let g = 0;
let b = 0;

let oscR, oscG, oscB;

function setup() {
  createCanvas(windowWidth, windowHeight);

  oscR = new p5.Oscillator('sine');
  oscG = new p5.Oscillator('sine');
  oscB = new p5.Oscillator('sine');

  oscR.amp(0); oscR.freq(400);
  oscG.amp(0); oscG.freq(496);
  oscB.amp(0); oscB.freq(592);

  // Conexión al servidor expuesto por ngrok
  socket = new WebSocket("wss://stream-delusion-shaky.ngrok-free.dev");

  // Callback cuando llegan datos
  socket.onmessage = (event) => {
    let datosSerial = event.data; // llega como string
    if (!datosSerial) return;
    recibirDatosArduino(datosSerial);
  };
}

function draw() {
  background(r, g, b); 
}

function recibirDatosArduino(datosSerial) {
  let sensores = datosSerial.split(',');
  let sensorR = Number(sensores[0]);
  let sensorG = Number(sensores[1]);
  let sensorB = Number(sensores[2]);

  console.log("datos Arduino:", sensorR, sensorG, sensorB);

  r = sensorR;
  g = sensorG;
  b = sensorB;

  oscR.amp(map(sensorR, 0, 255, 0, 0.2));
  oscG.amp(map(sensorG, 0, 255, 0, 0.3));
  oscB.amp(map(sensorB, 0, 255, 0, 0.1));
}

function mousePressed() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
    oscR.start();
    oscG.start();
    oscB.start();
    console.log("Audio activado en navegador");
  }
}