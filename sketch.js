let img;
let particles = [];
let cols = 50;
let rows = 50;
let pieceWidth, pieceHeight;
let reassembling = false;

function preload() {
  img = loadImage('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7xAs3KM9aGaobloPgNyTuY14B6DclkN5rTA&s'); 
}

function setup() {
  createCanvas(600, 400);
  pieceWidth = img.width / cols;
  pieceHeight = img.height / rows;

  // criar partículas
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let c = img.get(x * pieceWidth, y * pieceHeight, pieceWidth, pieceHeight);
      particles.push(new Particle(x * pieceWidth, y * pieceHeight, c));
    }
  }
}

function draw() {
  background(220);

  // verificar se o rato está dentro da imagem
  let hovering = mouseX > 0 && mouseX < img.width && mouseY > 0 && mouseY < img.height;

  for (let p of particles) {
    if (hovering && !reassembling) {
      p.explode();
    }
    if (reassembling) {
      p.reassemble();
    }
    p.update();
    p.show();
  }
}

function keyPressed() {
  if (key === ' ' || key === 'Spacebar') { // tecla SPACE
    reassembling = true;
  }
}

class Particle {
  constructor(x, y, imgPart) {
    this.origX = x;
    this.origY = y;
    this.x = x;
    this.y = y;
    this.imgPart = imgPart;

    this.vx = 0;
    this.vy = 0;
    this.gravity = 0.5;

    this.state = "idle"; // "idle", "exploding", "reassembling"
  }

  explode() {
    if (this.state !== "exploding") {
      this.vx = random(-3, 3);
      this.vy = random(-3, 0);
      this.state = "exploding";
    }
  }

  reassemble() {
    this.state = "reassembling";
  }

  update() {
    if (this.state === "exploding") {
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
    } else if (this.state === "reassembling") {
      // mover suavemente de volta para a posição original
      this.x = lerp(this.x, this.origX, 0.1);
      this.y = lerp(this.y, this.origY, 0.1);

      // zerar velocidade durante reassemble
      this.vx *= 0.9;
      this.vy *= 0.9;

      // se já está quase na posição original, volta ao estado idle
      if (abs(this.x - this.origX) < 0.5 && abs(this.y - this.origY) < 0.5) {
        this.x = this.origX;
        this.y = this.origY;
        this.vx = 0;
        this.vy = 0;
        this.state = "idle";
      }
    }
  }

  show() {
    image(this.imgPart, this.x, this.y, pieceWidth, pieceHeight);
  }
}