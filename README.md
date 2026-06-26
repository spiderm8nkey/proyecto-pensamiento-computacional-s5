## Link de web pública (github pages)

https://spiderm8nkey.github.io/proyecto-pensamiento-computacional-s5/

### Crack of Glass

### Referencia de origen / bibliografía
![Plantilla](readme/plantilla/prtada.jpg)

Linkin Park. (2012). Castle of Glass (canción). En Living Things. Warner Bros. Records.

La canción 'Castle Of Glass' de Linkin Park es una poderosa metáfora sobre la vulnerabilidad y la búsqueda de redención y sanación. La letra invita a una reflexión profunda sobre la condición humana, utilizando la imagen de un castillo de vidrio para representar la fragilidad del ser. La petición de ser llevado al río o ser lavado simboliza un deseo de purificación y de empezar de nuevo, libre de las toxinas emocionales o físicas que puedan afectar al individuo.


### Imagen de referencia de proyecto

![Plantilla](readme/plantilla/tada.png)

### Integrantes

Franco Moya [spiderm8nkey](https://github.com/spiderm8nkey)

### Enlace de p5.js 

<https://editor.p5js.org/spiderm8nkey/sketches/jtG_plI3y>

### Relato inicial

Un castillo de cristal con un aviso de "¡cuidado! fragil" que es sensible al tacto.

### Storyboard

![Plantilla](readme/plantilla/moon.jpg)

### Estados

Estado base: El castillo se sensible al mouse, tambien se altera el fondo al acercar el mouse al castillo.
Estado 1: Al hacer click sobre el caastillo se empieza a agrietar y el fondo reacciona a cada click.
Estado 2: El castiillo se deteriora a medida que se acumulan clicks y el fondo reacciona con colores mas intensos.
Estado 3 y final: El castillo colapsa porla acumulacion de clicks y se integra el scroll que termina de comprimirlo y aparece una frase junto con el "press R" que vuelve al estado 1. 

#### Estado 0

function fase0() {
  push();
  let d = dist(mouseX, mouseY, width / 2, height / 2);//mide la distancia del mouse del centro
  let vibracion = 0;

 if (d < radioInteraccion) {
  vibracion = map(d, radioInteraccion, 0, 0, 4);///mientras mas cerca esta el mouse mas vibracion, solo si el mouse esta dentro de area
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
////calcula la distancia del puntero en relacion al castillo, asi el puntero cambia al estar sobre el castillo, el fondo se oscurece, tiembla el castillo y cambia el puntero
  textoInferior("¡CUIDADO!\nFRÁGIL...");
  pop();///texto de la faase 0
}



#### Estado 1 y 2

function mousePressed() {
  flashFondo = 8;   ///apaga y preende el flash, el flash dura 8 frames

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

    crearGrieta(mouseX, mouseY, true); ///crea girietas donde esta elmmouse

    for (let i = 0; i < 3; i++) {
      let rx = width / 2 + random(-260, 260);
      let ry = random(height / 2, height / 2 + 260);
      crearGrieta(rx, ry, false); ///crea grietas aleatoreas dentro o cerca del castillo
      
    }

    if (damage >= 10) {
      estado = 2;
      temblorFase2 = 25; ////marca cambio de fase y proboca el tmblordq da marca el inicio de la fase 2
    }

  } else if (estado === 2) {
    damage++;////para que vaya acumuklando los click

    if (damage >= 15) {
  let cantidadGrietasPantalla = round(
    map(damage, 15, 25, 2, 10) ///marca transicion dentro de la fase 2, aporta mas destruccion.
  ); //// map aumenta la cantidad de gritas

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
/////basicamente aqui esta la narrativa

#### Estado 3

function mouseWheel(event) {
  if (estado === 3) {
    compresionDerrumbe += event.delta * 0.0007;
    compresionDerrumbe = constrain(compresionDerrumbe, 0, 1); ///entre 0,1 tipo 0 y 100%, para darle un margen a la compresion y no se rompa el p5

    if (compresionDerrumbe >= 1) {
      mostrarReset = true;
    }
  }
}///fase 3, comprime el castilllo. el evento delta* es para que comprima lento

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

  function textoOculto() {
  let alphaTexto = map(compresionDerrumbe, 0, 1, 0, 255);////Mientras el castillo se derrumba, el texto va apareciendo gradualmente
  let subida = map(compresionDerrumbe, 0, 1, 25, -65);///hace que el texto aparezca mientras va subiendo verticalmente

  fill(230, alphaTexto);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(52);
  text("Cause I’m only a crack", width / 2, height / 2 - 40 + subida);

  textSize(30);
  text("in this castle of glass", width / 2, height / 2 + 5 + subida);
}/////parametros del texxto como tal(color, teextura tamaño)
