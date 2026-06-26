let cormorant;

let estado = 0;
let damage = 0;

let castleFrente;
let castleTechoFrente;
let castleIzquierda;
let castleTechoIzq;
let castleDerecha;
let castleTechoDere;
let castleAtras;

let castleScale = 0.65;

let grietas = [];
let grietasPantalla = [];
let temblorFase2 = 0;

let intensidadFondo = 0;
let radioInteraccion = 260;
let flashFondo = 0;

let compresionDerrumbe = 0;
let musica;
let musicaActiva = false;

function preload() {
  musica = loadSound("songcut.mp3");
  cormorant = loadFont("Cormorant-Light.ttf");
  castleFrente = loadImage("casstlefrente.png");
  castleTechoFrente = loadImage("casstletechofrente.png");
  castleIzquierda = loadImage("casstleizquierda.png");
  castleTechoIzq = loadImage("casstletechoizq.png");
  castleDerecha = loadImage("casstlederecha.png");
  castleTechoDere = loadImage("casstletechodere.png");
  castleAtras = loadImage("casstleatras.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  angleMode(DEGREES);
}

function draw() {
  if (!musicaActiva && mouseX !== 0 && mouseY !== 0) {
  userStartAudio();

  musica.loop();
  musica.setVolume(0.35);

  musicaActiva = true;
}
  dibujarFondo();

  if (estado === 0) {
    fase0();
  } else if (estado === 1) {
    fase1();
  } else if (estado === 2) {
    fase2();
  } else if (estado === 3) {
    fase3();
  }

  dibujarGrietasPantalla();

  if (flashFondo > 0) {
    flashFondo--;
  }
}

function mousePressed() {
  flashFondo = 8;

  if (estado === 0) {
    estado = 1;
    damage = 1;

    crearGrieta(mouseX, mouseY, true);

    for (let i = 0; i < 3; i++) {
      let rx = width / 2 + random(-260, 260);
      let ry = random(height / 2, height / 2 + 260);
      crearGrieta(rx, ry, false);
    }

  } else if (estado === 1) {
    damage++;

    crearGrieta(mouseX, mouseY, true);

    for (let i = 0; i < 3; i++) {
      let rx = width / 2 + random(-260, 260);
      let ry = random(height / 2, height / 2 + 260);
      crearGrieta(rx, ry, false);
    }

    if (damage >= 10) {
      estado = 2;
      temblorFase2 = 25;
    }

  } else if (estado === 2) {
    damage++;

    if (damage >= 15) {
  let cantidadGrietasPantalla = round(
    map(damage, 15, 25, 2, 10)
  );

  cantidadGrietasPantalla = constrain(
    cantidadGrietasPantalla,
    2,
    10
  );

  for (let i = 0; i < cantidadGrietasPantalla; i++) {
    crearGrietaPantalla();
  }
}

    if (damage === 15) {
      temblorFase2 = 30;
    }

    if (damage >= 25) {
      estado = 3;
    }
  }
}

function mouseWheel(event) {
  if (estado === 3) {
    compresionDerrumbe += event.delta * 0.0007;
    compresionDerrumbe = constrain(compresionDerrumbe, 0, 1);

    if (compresionDerrumbe >= 1) {
      mostrarReset = true;
    }
  }
}

function keyPressed() {
  musica.stop();
musicaActiva = false;
  if (estado === 3 && (key === "r" || key === "R")) {
    cursor(ARROW);
    estado = 0;
    damage = 0;
    grietas = [];
    grietasPantalla = [];
    temblorFase2 = 0;
    intensidadFondo = 0;
    flashFondo = 0;
    compresionDerrumbe = 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function dibujarFondo() {
  let flash = flashFondo / 8;

  let rojoArriba = color(48, 12, 18);
  let rojoAbajo = color(10, 0, 4);

  let rojoAzulArriba = color(38, 22, 34);
  let rojoAzulAbajo = color(8, 2, 8);

  let azulOscuroArriba = color(10, 18, 32);
  let azulOscuroAbajo = color(0, 3, 10);

  let azulFinalArriba = color(28, 44, 68);
  let azulFinalAbajo = color(4, 8, 18);

  let arriba;
  let abajo;

  if (estado === 0) {
    let oscurecimiento = intensidadFondo;
    oscurecimiento = constrain(oscurecimiento - flash, 0, 1);

    arriba = lerpColor(rojoArriba, color(0, 0, 0), oscurecimiento);
    abajo = lerpColor(rojoAbajo, color(0, 0, 0), oscurecimiento);

  } else if (estado === 1) {
    if (damage < 5) {
      arriba = rojoArriba;
      abajo = rojoAbajo;
    } else {
      let t = map(damage, 5, 10, 0, 1);
      t = constrain(t, 0, 1);

      arriba = lerpColor(rojoArriba, rojoAzulArriba, t);
      abajo = lerpColor(rojoAbajo, rojoAzulAbajo, t);
    }

  } else if (estado === 2) {
    if (damage < 16) {
      let t = map(damage, 10, 15, 0, 1);
      t = constrain(t, 0, 1);

      arriba = lerpColor(rojoAzulArriba, azulOscuroArriba, t);
      abajo = lerpColor(rojoAzulAbajo, azulOscuroAbajo, t);
    } else {
      let t = map(damage, 16, 25, 0, 1);
      t = constrain(t, 0, 1);

      arriba = lerpColor(azulOscuroArriba, azulFinalArriba, t);
      abajo = lerpColor(azulOscuroAbajo, azulFinalAbajo, t);
    }

  } else if (estado === 3) {
    let latencia = (sin(frameCount * 2.4) + 1) / 2;

    arriba = lerpColor(rojoArriba, azulFinalArriba, latencia);
    abajo = lerpColor(rojoAbajo, azulFinalAbajo, latencia);
  }

  let intensidadFlash = 0.18;

  if (damage >= 5) {
    intensidadFlash = 0.28;
  }

  if (damage >= 10) {
    intensidadFlash = 0.4;
  }

  if (damage >= 15) {
    intensidadFlash = 0.55;
  }

  if (damage >= 20) {
    intensidadFlash = 0.7;
  }

  if (flash > 0 && estado !== 3) {
    let flashArriba = color(150, 190, 225);
    let flashAbajo = color(35, 65, 95);

    arriba = lerpColor(arriba, flashArriba, flash * intensidadFlash);
    abajo = lerpColor(abajo, flashAbajo, flash * intensidadFlash);
  }

  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(arriba, abajo, inter);
    stroke(c);
    line(0, y, width, y);
  }
}

function fase0() {
  push();
  let d = dist(mouseX, mouseY, width / 2, height / 2);
  let vibracion = 0;

 if (d < radioInteraccion) {
  vibracion = map(d, radioInteraccion, 0, 0, 4);
  intensidadFondo = map(d, radioInteraccion, 0, 0, 1);
  cursor(HAND);
} else {
  intensidadFondo = 0;
  cursor(ARROW);
}

  dibujarCastilloModular(
    random(-vibracion, vibracion),
    random(-vibracion, vibracion)
  );

  textoInferior("¡CUIDADO!\nFRÁGIL...");
  pop();
}

function fase1() {
  dibujarCastilloModular(0, 0);
  dibujarGrietasGuardadas();

  if (damage <= 6) {
    textoInferior("Algo no está bien...");
  } else {
    textoInferior("...Ya no puedo más...");
  }
}

function fase2() {
  let shakeX = 0;
  let shakeY = 0;

  if (temblorFase2 > 0) {
    shakeX = random(-5, 5);
    shakeY = random(-5, 5);
    temblorFase2--;
  }

  dibujarCastilloFragmentado(shakeX, shakeY);
  dibujarGrietasGuardadas();

  if (damage <= 15) {
    textoInferior("...Ya no puedo más...");
  } else {
    textoInferior("...Demasiado tarde...");
  }
}

function fase3() {
  cursor('none');
  textoOculto();
  dibujarCastilloDerrumbado();

  fill(100);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(125);

let yy = height - 90;
let flechas = "↓\n↓\n↓\n↓\n↓";
  let y = height - 5;
let flecha ="↓\n";

text(flechas, width * 0.08, yy);
text(flechas, width * 0.92, yy);
  text(flecha, width / 2, y);
  
  if (compresionDerrumbe >= 0.98) {
  fill(230, 180);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(14);
  text("PRESS R", width / 2, height - 350);
}
  
}

function dibujarCastilloModular(offsetX, offsetY) {
  let w = 1920 * castleScale;
  let h = 1200 * castleScale;

  let x = width / 2 + offsetX;
  let y = height / 2 + offsetY;

  image(castleAtras, x, y, w, h);

  image(castleIzquierda, x, y, w, h);
  image(castleDerecha, x, y, w, h);

  image(castleFrente, x, y, w, h);

  image(castleTechoIzq, x, y, w, h);
  image(castleTechoDere, x, y, w, h);
  image(castleTechoFrente, x, y, w, h);
}

function dibujarCastilloFragmentado(offsetX, offsetY) {
  let w = 1920 * castleScale;
  let h = 1200 * castleScale;

  let x = width / 2 + offsetX;
  let y = height / 2 + offsetY;

  dibujarPieza(castleAtras, x, y + 4, w, h, -1);

  dibujarPieza(castleIzquierda, x - 12, y + 2, w, h, -2);
  dibujarPieza(castleDerecha, x + 12, y + 2, w, h, 2);

  dibujarPieza(castleFrente, x, y + 6, w, h, 0);

  if (damage < 15) {
    dibujarPieza(castleTechoIzq, x - 22, y + 18, w, h, -4);
    dibujarPieza(castleTechoDere, x + 22, y + 18, w, h, 4);
    dibujarPieza(castleTechoFrente, x, y + 28, w, h, 3);
  } else {
    dibujarPieza(castleTechoIzq, x - 55, y + 95, w, h, -12);
    dibujarPieza(castleTechoDere, x + 55, y + 95, w, h, 12);
    dibujarPieza(castleTechoFrente, x + 12, y + 48, w, h, 6);
  }
}

function dibujarPieza(img, x, y, w, h, rotacion) {
  push();
  translate(x, y);
  rotate(rotacion);
  image(img, 0, 0, w, h);
  pop();
}

function dibujarCastilloDerrumbado() {
  let w = 1920 * castleScale;
  let h = 1200 * castleScale;

  let x = width / 2;
  let c = compresionDerrumbe;

  let yInicio = height / 2;
  let suelo = height - 210;

  let atrasX = lerp(x - 3, x - 5, c);
  let atrasY = lerp(yInicio + 8, suelo - 20, c);
  let atrasRot = lerp(-5, -16, c);

  let izqX = lerp(x - 10, x - 35, c);
  let izqY = lerp(yInicio + 12, suelo + 25, c);
  let izqRot = lerp(-12, -28, c);

  let derX = lerp(x + 10, x + 35, c);
  let derY = lerp(yInicio + 12, suelo + 25, c);
  let derRot = lerp(12, 28, c);

  let frenteX = x;
  let frenteY = lerp(yInicio + 16, suelo + 55, c);
  let frenteRot = lerp(5, 10, c);

  let techoIzqX = lerp(x - 22, x - 40, c);
  let techoIzqY = lerp(yInicio + 78, suelo + 85, c);
  let techoIzqRot = lerp(-22, -40, c);

  let techoDerX = lerp(x + 22, x + 40, c);
  let techoDerY = lerp(yInicio + 78, suelo + 85, c);
  let techoDerRot = lerp(22, 40, c);

  let techoFrenteX = lerp(x + 6, x + 5, c);
  let techoFrenteY = lerp(yInicio + 52, suelo + 105, c);
  let techoFrenteRot = lerp(12, 20, c);

  dibujarPieza(castleAtras, atrasX, atrasY, w, h, atrasRot);

  dibujarPieza(castleIzquierda, izqX, izqY, w, h, izqRot);
  dibujarPieza(castleDerecha, derX, derY, w, h, derRot);

  dibujarPieza(castleFrente, frenteX, frenteY, w, h, frenteRot);

  dibujarPieza(castleTechoIzq, techoIzqX, techoIzqY, w, h, techoIzqRot);
  dibujarPieza(castleTechoDere, techoDerX, techoDerY, w, h, techoDerRot);
  dibujarPieza(castleTechoFrente, techoFrenteX, techoFrenteY, w, h, techoFrenteRot);
}

function crearGrieta(x, y, principal) {
  let cantidadSegmentos;
  let largo;
  let grosor;
  let variacionAngulo;

  if (principal) {
    cantidadSegmentos = int(random(5, 8));
    largo = random(16, 28);
    grosor = 2;
    variacionAngulo = 55;
  } else {
    cantidadSegmentos = int(random(3, 5));
    largo = random(8, 15);
    grosor = 1;
    variacionAngulo = 70;
  }

  let puntos = [];
  puntos.push({ x: x, y: y });

  let angulo = random(360);

  for (let i = 1; i < cantidadSegmentos; i++) {
    let anterior = puntos[i - 1];

    angulo += random(-variacionAngulo, variacionAngulo);

    let nx = anterior.x + cos(angulo) * largo;
    let ny = anterior.y + sin(angulo) * largo;

    puntos.push({ x: nx, y: ny });
  }

  let ramas = [];

  if (principal) {
    for (let i = 1; i < puntos.length - 1; i++) {
      if (random(1) < 0.55) {
        let base = puntos[i];
        let anguloRama = angulo + random(-120, 120);
        let largoRama = random(10, 24);

        ramas.push({
          x1: base.x,
          y1: base.y,
          x2: base.x + cos(anguloRama) * largoRama,
          y2: base.y + sin(anguloRama) * largoRama
        });
      }
    }
  } else {
    if (random(1) < 0.45) {
      let base = puntos[int(random(1, puntos.length))];
      let anguloRama = random(360);
      let largoRama = random(5, 12);

      ramas.push({
        x1: base.x,
        y1: base.y,
        x2: base.x + cos(anguloRama) * largoRama,
        y2: base.y + sin(anguloRama) * largoRama
      });
    }
  }

  grietas.push({
    puntos: puntos,
    ramas: ramas,
    grosor: grosor,
    principal: principal
  });
}

function dibujarGrietasGuardadas() {
  push();

  for (let g of grietas) {
    if (g.principal) {
      stroke(255, 255, 255, 230);
    } else {
      stroke(220, 245, 255, 170);
    }

    strokeWeight(g.grosor);
    noFill();

    beginShape();
    for (let p of g.puntos) {
      vertex(p.x, p.y);
    }
    endShape();

    strokeWeight(max(1, g.grosor - 0.5));

    for (let r of g.ramas) {
      line(r.x1, r.y1, r.x2, r.y2);
    }
  }

  pop();
}

function crearGrietaPantalla() {
  let x = random(width);
  let y = random(height);

  let cantidadSegmentos = int(random(4, 8));
  let largo = random(25, 55);
  let grosor = random(1, 2.2);
  let variacionAngulo = 65;

  let puntos = [];
  puntos.push({ x: x, y: y });

  let angulo = random(360);

  for (let i = 1; i < cantidadSegmentos; i++) {
    let anterior = puntos[i - 1];

    angulo += random(-variacionAngulo, variacionAngulo);

    let nx = anterior.x + cos(angulo) * largo;
    let ny = anterior.y + sin(angulo) * largo;

    puntos.push({ x: nx, y: ny });
  }

  let ramas = [];

  for (let i = 1; i < puntos.length - 1; i++) {
    if (random(1) < 0.45) {
      let base = puntos[i];
      let anguloRama = angulo + random(-130, 130);
      let largoRama = random(12, 32);

      ramas.push({
        x1: base.x,
        y1: base.y,
        x2: base.x + cos(anguloRama) * largoRama,
        y2: base.y + sin(anguloRama) * largoRama
      });
    }
  }

  grietasPantalla.push({
    puntos: puntos,
    ramas: ramas,
    grosor: grosor,
    alpha: random(80, 145)
  });
}

function dibujarGrietasPantalla() {
  push();

  for (let g of grietasPantalla) {
    stroke(220, 245, 255, g.alpha);
    strokeWeight(g.grosor);
    noFill();

    beginShape();
    for (let p of g.puntos) {
      vertex(p.x, p.y);
    }
    endShape();

    strokeWeight(max(1, g.grosor - 0.5));

    for (let r of g.ramas) {
      line(r.x1, r.y1, r.x2, r.y2);
    }
  }

  pop();
}

function textoOculto() {
  let alphaTexto = map(compresionDerrumbe, 0, 1, 0, 255);
  let subida = map(compresionDerrumbe, 0, 1, 25, -65);

  fill(230, alphaTexto);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(52);
  text("Cause I’m only a crack", width / 2, height / 2 - 40 + subida);

  textSize(30);
  text("in this castle of glass", width / 2, height / 2 + 5 + subida);
}

function textoInferior(txt) {
  fill(230);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(23);
  text(txt, width / 2, height - 50);

   textFont(cormorant);
  
}
