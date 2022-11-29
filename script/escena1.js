var scene;
var camera;
var renderer;
var controls;
var objects = [];
var clock;
var deltaTime;
var keys = {};
var cube;
var visibleSize = { width: window.innerWidth, height: window.innerHeight };
var mixers = [];
var mixers_2 = [];
var player1;
var player2;
var action, action2;
var flag = false;
var personaje_globalxd;
var personaje_globalxd2;
let animations = [];
let idle;
let run;
let jump;
let idle2;
let run2;
let jump2;
let algo = false;
let algo2 = false;
let renderers = [];
let cameras = [];
var jugadores = [];
var userName;
var update = false;
let personajePrincipal;
var purple9;
var collisionObjects = [];
var specialObjects = [];
var col;
let supreme;
let man;
var currentPlayer;
let nJugadores = 0;
let jugador1Ready = false;
let jugador2Ready = false;
let contador = 0;
let aux;
let salta = false;
let pArray = [];
let dArray = [];

/////////////////////////////////////
let purpleValidator1 = true;
let purpleValidator2 = false;
//
let redValidator1 = true;
let redValidator2 = false;
//
let greenValidator1 = true;
let greenValidator2 = false;
//
let orangeValidator1 = true;
let orangeValidator2 = false;
//
let auxPlayer = [];
let power1;
let power2;
let powers = false;
let disable = false;
let unaVez = false;
let flagPower1 = false;
let flagPower2 = false;
let listener2;
let audioLoader2;
let backgroundSound2;
///////////////////////////////////
const listener = new THREE.AudioListener();
const audioLoader = new THREE.AudioLoader();
var isPaused = false;
var isMusicOn = true;
var isMusicOff = true;
var isSFXOn = true;
var backgroundSound = new Audio('audio/Space.mp3');
backgroundSound.volume = 0.2;
var isPaused = false;

$(document).ready(function () {
  setupScene();
  cargar_objetos();
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  initializeFirebase();

  const dbRefPlayers = firebase.database().ref().child("jugadores");

  dbRefPlayers.on("child_added", (snap) => {

    var player = snap.val();
    var key = snap.key;

    var newplayer = new THREE.FBXLoader();
    newplayer.load('resources/jugador2/Ch45_nonPBR.fbx', function (personaje) {
      personaje.position.y = 0.5;      //altura estaba en 2 xd

      if (nJugadores == 0) {
        personaje.position.x = -17;    //izq-der
        jugador1Ready = true;
        let object = {
          nombre: player.nombre,
          score: 0
        }
        auxPlayer.push(object);
      }
      else {
        jugador2Ready = true;
        personaje.position.x = 15;    //izq-der
        let object = {
          nombre: player.nombre,
          score: 0
        }
        auxPlayer.push(object);
        document.getElementById("container").style.display = "none";
      }
      nJugadores++;

      personaje.position.z = -20;    //profundidad lejor o cerca
      personaje.scale.set(0.05, 0.05, 0.05);
      personaje.name = player.nombre;

      const anim1 = new THREE.FBXLoader();
      anim1.load('resources/jugador2/Idle.fbx', (anim) => {
        var animation = new THREE.AnimationMixer(personaje);
        personaje.idle = animation.clipAction(anim.animations[0]);
        // personaje.idle.weight = 1;
        personaje.idle.play();
        mixers.push(animation);
      });

      const anim2 = new THREE.FBXLoader();
      anim2.load('resources/jugador2/Running.fbx', (anim) => {
        var animation = new THREE.AnimationMixer(personaje);
        personaje.run = animation.clipAction(anim.animations[0]);
        mixers.push(animation);
      });

      const anim3 = new THREE.FBXLoader();
      anim3.load('resources/jugador2/Jumping.fbx', (anim) => {
        var animation = new THREE.AnimationMixer(personaje);
        personaje.jump = animation.clipAction(anim.animations[0]);
        mixers.push(animation);
      });

      scene.add(personaje);
    }, (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    });

    newplayer.player = player;
    newplayer.key = key;
    jugadores.push(newplayer);
  });

  dbRefPlayers.on("child_changed", (snap) => {

    var player = snap.val();
    var key = snap.key;
    var nombre = player.nombre;
    let action = player.action;
    let personajePrincipalxd = scene.getObjectByName(nombre);
    let array = player.boxPosition;

    for (var i = 0; i < jugadores.length; i++) {//ANIMATIONS
      if (jugadores[i].key == key) {
        personajePrincipalxd.rotation.y = player.rotation.y;
        personajePrincipalxd.position.z = player.position.z;
        personajePrincipalxd.position.x = player.position.x;

        //        console.log(action);
        if (action == "run") {
          personajePrincipalxd.idle.stop();
          personajePrincipalxd.run.play();
        }
        else if (action == "idle") {
          personajePrincipalxd.run.stop();
          personajePrincipalxd.idle.play();
        }
        else if (action == "jump") {
          personajePrincipalxd.run.stop();
          personajePrincipalxd.idle.stop();
          personajePrincipalxd.jump.play();
          setTimeout(() => {
            personajePrincipalxd.jump.stop();
          }, 1700)
        }
      }
    }

    if (array != "null") {//BOXES

      //MOVE THE CURRENT BOX
      collisionObjects[array].position.y = 1;
      collisionObjects[array].rotation.x = 3.1;

      //ADD THE BOX AND THE PLAYER TO MY ARRAY 
      let object = {
        jugador: nombre,
        box: collisionObjects[array].name
      }

      pArray.push(object);

      //GET ALL THE DATA OF MY USER
      let temp = [];
      for (var i = 0; i < pArray.length; i++) {
        if (nombre == pArray[i].jugador) {
          temp.push(pArray[i].box);
        }
      }

      if (temp.includes("purpleBox1") && temp.includes("purpleBox2") && purpleValidator1 == true) {
        //        console.log("ya se pueden retirar los rosas");
        purpleValidator1 = false;
        purpleValidator2 = true;

        for (let j = 0; j < auxPlayer.length; j++) {
          if (nombre == auxPlayer[j].nombre) {
            let aux = auxPlayer[j].score;
            aux++;
            auxPlayer[j].score = aux;
            console.log(auxPlayer[j].nombre);
            console.log(auxPlayer[j].score);
          }
        }

        for (let i = 0; i < collisionObjects.length; i++) {

          if (collisionObjects[i].name == "purpleBox1") {
            collisionObjects[i].position.y = 1;
            collisionObjects[i].rotation.x = 3.1;
          }

          if (collisionObjects[i].name == "purpleBox2") {
            collisionObjects[i].position.y = 1;
            collisionObjects[i].rotation.x = 3.1;
          }
        }
      }

      if (temp.includes("redBox1") && temp.includes("redBox2") && redValidator1 == true) {
        // console.log("ya se pueden retirar los rojos");

        for (let j = 0; j < auxPlayer.length; j++) {
          if (nombre == auxPlayer[j].nombre) {
            let aux = auxPlayer[j].score;
            aux++;
            auxPlayer[j].score = aux;
            console.log(auxPlayer[j].nombre);
            console.log(auxPlayer[j].score);
          }
        }

        redValidator2 = true;
        redValidator1 = false;

        for (let i = 0; i < collisionObjects.length; i++) {

          if (collisionObjects[i].name == "redBox1") {
            collisionObjects[i].position.y = 1;
            collisionObjects[i].rotation.x = 3.1;
          }

          if (collisionObjects[i].name == "redBox2") {
            collisionObjects[i].position.y = 1;
            collisionObjects[i].rotation.x = 3.1;
          }
        }
      }

      if (temp.includes("greenBox1") && temp.includes("greenBox2") && greenValidator1 == true) {
        // console.log("ya se pueden retirar los verdes");

        for (let j = 0; j < auxPlayer.length; j++) {
          if (nombre == auxPlayer[j].nombre) {
            let aux = auxPlayer[j].score;
            aux++;
            auxPlayer[j].score = aux;
            console.log(auxPlayer[j].nombre);
            console.log(auxPlayer[j].score);
          }
        }

        greenValidator1 = false;
        greenValidator2 = true;

        for (let i = 0; i < collisionObjects.length; i++) {

          if (collisionObjects[i].name == "greenBox1") {
            collisionObjects[i].position.y = 1;
            collisionObjects[i].rotation.x = 3.1;
          }

          if (collisionObjects[i].name == "greenBox2") {
            collisionObjects[i].position.y = 1;
            collisionObjects[i].rotation.x = 3.1;
          }
        }
      }

      if (temp.includes("orangeBox1") && temp.includes("orangeBox2") && orangeValidator1 == true) {
        // console.log("ya se pueden retirar los naranjas");

        for (let j = 0; j < auxPlayer.length; j++) {
          if (nombre == auxPlayer[j].nombre) {
            let aux = auxPlayer[j].score;
            aux++;
            auxPlayer[j].score = aux;
            console.log(auxPlayer[j].nombre);
            console.log(auxPlayer[j].score);
          }
        }

        orangeValidator2 = true;
        orangeValidator1 = false;

        for (let i = 0; i < collisionObjects.length; i++) {

          if (collisionObjects[i].name == "orangeBox1") {
            collisionObjects[i].position.y = 1;
            collisionObjects[i].rotation.x = 3.1;
          }

          if (collisionObjects[i].name == "orangeBox2") {
            collisionObjects[i].position.y = 1;
            collisionObjects[i].rotation.x = 3.1;
          }
        }
      }

      else {
        setTimeout(() => {

          collisionObjects[array].position.y = -1.4;
          collisionObjects[array].rotation.x = 0;

          if (purpleValidator2 == true && (collisionObjects[array].name == "purpleBox1" || collisionObjects[array].name == "purpleBox2")) {  //para los morados
            for (let i = 0; i < collisionObjects.length; i++) {

              if (collisionObjects[i].name == "purpleBox1") {
                collisionObjects[i].position.y = 1;
                collisionObjects[i].rotation.x = 3.1;
              }

              if (collisionObjects[i].name == "purpleBox2") {
                collisionObjects[i].position.y = 1;
                collisionObjects[i].rotation.x = 3.1;
              }
            }
          }

          if (redValidator2 == true && (collisionObjects[array].name == "redBox1" || collisionObjects[array].name == "redBox2")) {  //para los morados
            for (let i = 0; i < collisionObjects.length; i++) {

              if (collisionObjects[i].name == "redBox1") {
                collisionObjects[i].position.y = 1;
                collisionObjects[i].rotation.x = 3.1;
              }

              if (collisionObjects[i].name == "redBox2") {
                collisionObjects[i].position.y = 1;
                collisionObjects[i].rotation.x = 3.1;
              }
            }
          }

          if (greenValidator2 == true && (collisionObjects[array].name == "greenBox1" || collisionObjects[array].name == "greenBox2")) {  //para los morados
            for (let i = 0; i < collisionObjects.length; i++) {

              if (collisionObjects[i].name == "greenBox1") {
                collisionObjects[i].position.y = 1;
                collisionObjects[i].rotation.x = 3.1;
              }

              if (collisionObjects[i].name == "greenBox2") {
                collisionObjects[i].position.y = 1;
                collisionObjects[i].rotation.x = 3.1;
              }
            }
          }

          if (orangeValidator2 == true && (collisionObjects[array].name == "orangeBox1" || collisionObjects[array].name == "orangeBox2")) {  //para los morados
            for (let i = 0; i < collisionObjects.length; i++) {

              if (collisionObjects[i].name == "orangeBox1") {
                collisionObjects[i].position.y = 1;
                collisionObjects[i].rotation.x = 3.1;
              }

              if (collisionObjects[i].name == "orangeBox2") {
                collisionObjects[i].position.y = 1;
                collisionObjects[i].rotation.x = 3.1;
              }
            }
          }

        }, 3800)

        setTimeout(() => {
          pArray.pop();
        }, 3700)
      }
    }
  });

  render();

  $(document).on('click', '#boton', function (e) {      //iINSERT NEW PLAYER
    e.preventDefault();
    var position = { x: 0, y: 2, z: 0 };
    var rotation = { x: 0, y: 0, z: 0 };
    let nombre = document.querySelector("#txtName").value;
    let action = "idle";
    userName = nombre;
    let boxPosition = "";
    let score = 0;

    var newPlayer = dbRefPlayers.push();
    newPlayer.set({
      nombre,
      position,
      rotation,
      action,
      boxPosition,
      score,
    });

  });
});

function cleanArray() {
  setTimeout(() => {
    pArray.pop();
  }, 2700)
}

function returnToOriginalPlace(value) {
  setTimeout(() => {
    value.position.y = -1.4;
    value.rotation.x = 0;
  }, 3800)
}



function initializeFirebase() {
  const firebaseConfig = {
    apiKey: "AIzaSyCb1_WIxqQpqnWDfkGhULbbhUhr2UJRz2g",
    authDomain: "gcwremaster.firebaseapp.com",
    projectId: "gcwremaster",
    storageBucket: "gcwremaster.appspot.com",
    messagingSenderId: "44616214660",
    appId: "1:44616214660:web:8c3d58446a1d96cb437ad1"
  };
  firebase.initializeApp(firebaseConfig);
}

/*
function initializeFirebase() {
  const firebaseConfig = {
    apiKey: "AIzaSyCjfVDplX8NuQc2hr9Npz6tb3QgByXG4gI",
    authDomain: "gcww-76500.firebaseapp.com",
    projectId: "gcww-76500",
    storageBucket: "gcww-76500.appspot.com",
    messagingSenderId: "204226126815",
    appId: "1:204226126815:web:b1cd64f8df6b306eb95a6a"
  };
  firebase.initializeApp(firebaseConfig);
}
*/
function setupScene() {
  //INICIAMOS EL RENDERER
  renderer = new THREE.WebGLRenderer({ precision: "mediump" });
  renderer.setClearColor(new THREE.Color(0, 0, 0));
  renderer.setPixelRatio(visibleSize.width / visibleSize.height);
  renderer.setSize(visibleSize.width, visibleSize.height);

  //INICIALIZAMOS LA CAMARA
  camera = new THREE.PerspectiveCamera(
    100,                                                                //angulo de vision
    visibleSize.width / visibleSize.height,   //aspect ratio
    0.1,                                                                //que tan cerca
    100                                                                 //que tan lejos
  );

  //camera.position.z = 2;
  //camera.position.y = 2;

  //INICIALIZAMOS LA ESCENA
  scene = new THREE.Scene();

  //DELTA TIME
  clock = new THREE.Clock();

  //ILUMINACION
  var ambientLight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 1.0);
  var directionalLight = new THREE.DirectionalLight(new THREE.Color(1, 1, 0), 0.4);
  directionalLight.position.set(0, 0, 1);

  ////////MIS OBJETOS///////////////////////////////////////////////////////////
  //CUBO
  var material = new THREE.MeshLambertMaterial({ color: new THREE.Color(0.5, 0.0, 0.0) });
  var geometry = new THREE.BoxGeometry(1, 1, 1);
  cube = new THREE.Mesh(geometry, material)
  //GRID
  cube.name = "rock";

  var grid = new THREE.GridHelper(50, 10, 0xffffff, 0xffffff);

  ////////MIS OBJETOS///////////////////////////////////////////////////////////

  $("#scene-section").append(renderer.domElement);//añado mis objetos 

  ////////////////AJUSTE DE OBJETOS/////////////////////
  //third person camera
  //grid.position.y = -1;
  cube.position.y = 2;

  camera.position.z = 20;    //lejos o cerca
  camera.position.y = 20;      //altura
  camera.position.x = -7;
  camera.rotation.x = 5.3;    //angulo camara 4.8

  //camera.position.z = 0;    //lejos o cercs
  //camera.position.y = 2;      //altura
  //camera.rotation.x = 0;    //angulo camara

  //cube.position.x = 5;
  //cube.add(camera);
  /*
    const listener = new THREE.AudioListener();
    const audioLoader = new THREE.AudioLoader();
    const backgroundSound = new THREE.Audio(listener);
  
    audioLoader.load('script/danger.mp3', function (xd) {
      backgroundSound.setBuffer(xd);
      backgroundSound.setLoop(true);
      backgroundSound.setVolume(0.3);
      backgroundSound.play();
    })*/

  listener2 = new THREE.AudioListener();
  audioLoader2 = new THREE.AudioLoader();
  backgroundSound2 = new THREE.Audio(listener2);
  audioLoader2.load('script/hit.wav', function (xd) {
    backgroundSound2.setBuffer(xd);
    backgroundSound2.setLoop(false);
    backgroundSound2.setVolume(0.3);
  })

  ////////////AÑADO OBJETOS A MI ESCENA///////////////////
  scene.add(ambientLight);
  scene.add(listener);
  scene.add(directionalLight);
  //scene.add(cube);
  //scene.add(grid);
}

function onKeyDown(event) {
  keys[String.fromCharCode(event.keyCode)] = true;
}

function onKeyUp(event) {
  keys[String.fromCharCode(event.keyCode)] = false;
  run = false;
  jump = false;
}

function render() {
  requestAnimationFrame(render);
  deltaTime = clock.getDelta();

  var yaw = 0;				//leff or right
  var forward = 0; 		//forward backward
  var currentKey;
  var place;

  if (keys["A"]) {

    if (flagPower1 == true) {
      yaw = 2;
    } else {
      yaw = 6.5;
    }
    run = true;
  }

  if (keys["D"]) {
    if (flagPower1 == true) {
      yaw = -2;
    }
    else {
      yaw = -6.5;
    }
    run = true;
  }

  if (keys["W"]) {
    if (flagPower1 == true) {
      forward = -4;
    }
    else {
      forward = -15;
    }
    run = true;
  }

  if (keys["S"]) {
    if (flagPower1 == true) {
      forward = 4;
    } else {
      forward = 15;
    }
    run = true;
  }

  if (keys["M"]) {
    run = true;
    jump = true;
  }

  if (mixers.length > 0) {
    for (var i = 0; i < mixers.length; i++) {
      mixers[i].update(deltaTime);
    }
  }

  if (powers == true) {
    power1 = scene.getObjectByName("power1");
    power1.rotation.y += 0.05;

    power2 = scene.getObjectByName("power2");
    power2.rotation.y -= 0.05;
  }

  if (jugador1Ready == true && jugador2Ready == true && disable == false && !isPaused) { //now i can play
    var score1 = document.getElementById('score-p1');
    var score2 = document.getElementById('score-p2');
    score1.style.display = 'block';
    score1.textContent = auxPlayer[0].nombre + "  " + "Score:  " + auxPlayer[0].score;
    score2.style.display = 'block';
    score2.textContent = auxPlayer[1].nombre + "  " + "Score:  " + auxPlayer[1].score;
    for (var i = 0; i < jugadores.length; i++) {
      if (jugadores[i].player.nombre == userName) {
        currentPlayer = jugadores[i].player;
        currentKey = jugadores[i].key;
        place = i;
        update = true;
      }
    }

    if (update) {

      personajePrincipal = scene.getObjectByName(currentPlayer.nombre);

      if (flagPower2 == true) {
        personajePrincipal.rotation.y -= yaw * deltaTime;
        personajePrincipal.translateZ((-forward) * deltaTime);
      } else {
        personajePrincipal.rotation.y += yaw * deltaTime;
        personajePrincipal.translateZ(forward * deltaTime);
      }

      currentPlayer.rotation.y = personajePrincipal.rotation.y;
      currentPlayer.position.x = personajePrincipal.position.x;
      currentPlayer.position.z = personajePrincipal.position.z;
      currentPlayer.action = "idle";

      if (run) {
        personajePrincipal.run.play();
        currentPlayer.action = "run";
      }
      else {
        personajePrincipal.run.stop();
        currentPlayer.action = "idle";
      }

      if (jump) {
        personajePrincipal.jump.play();
        currentPlayer.action = "jump";
        salta = true;

        setTimeout(() => {
          personajePrincipal.jump.stop();
          salta = false;
        }, 1700)
      }

      let objectPos = "null";

      try {//COLISION

        let personajePrincipalBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        personajePrincipalBB.setFromObject(personajePrincipal);

        let purpleBox1BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());

        //COLISIONES CON CAJAS
        for (var i = 0; i < collisionObjects.length; i++) {
          purpleBox1BB.setFromObject(collisionObjects[i]);
          if (purpleBox1BB.intersectsBox(personajePrincipalBB) && salta == true) {
            //collisionObjects[i].position.y = 1;
            //collisionObjects[i].rotation.x = 3.1;
            //returnToOriginalPlace(collisionObjects[i]);
            objectPos = i;
            break;
          }
        }

        //COLISIONE CON OBJETOS ESPECIALES XD
        let especial1 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        let especial2 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        especial1.setFromObject(specialObjects[0]);
        especial2.setFromObject(specialObjects[1]);

        if (especial1.intersectsBox(personajePrincipalBB)) {
          //console.log("power 1"); //reducir velcidad
          flagPower1 = true;
          backgroundSound2.play();

          setTimeout(() => {
            flagPower1 = false;
          }, 8000)
        }

        if (especial2.intersectsBox(personajePrincipalBB)) {
          //console.log("power 2"); //cambiar controles
          flagPower2 = true;
          backgroundSound2.play();

          setTimeout(() => {
            flagPower2 = false;
          }, 8000)
        }

      } catch (error) {
        console.log(error);
      }
      updateFirebase(currentPlayer, currentKey, objectPos);
    }
  }

  if (purpleValidator2 == true &&
    greenValidator2 == true &&
    orangeValidator2 == true &&
    redValidator2 == true) {

    var score1 = document.getElementById('score-p1');
    var score2 = document.getElementById('score-p2');
    score1.style.display = 'block';
    score1.textContent = auxPlayer[0].nombre + "  " + "Score:  " + auxPlayer[0].score;
    score2.style.display = 'block';
    score2.textContent = auxPlayer[1].nombre + "  " + "Score:  " + auxPlayer[1].score;

    personajePrincipal.jump.stop();
    personajePrincipal.run.stop();
    personajePrincipal.idle.play();
    disable = true;

    if (unaVez == false) {
      // console.log("Game over");
      //console.log("Puntuacion Final");
      unaVez = true;

      var modalwin = document.getElementById('modal-ganarmulti');
      var abandonarmulti = document.getElementById('btn-abandonar2');
      var puntuacion1 = document.getElementById('score-final1');
      var puntuacion2 = document.getElementById('score-final2');
      var titulowin = document.getElementById('titulo-win');
      var winner;
      var loser;

      console.log(auxPlayer);

      if (auxPlayer[0].score > auxPlayer[1].score) {
        winner = auxPlayer[0];
        loser = auxPlayer[1];

      } else {
        winner = auxPlayer[1];
        loser = auxPlayer[0];
      }

      titulowin.textContent = "Ganador: " + winner.nombre;
      puntuacion1.textContent = "Puntuacion ganador: " + winner.score;
      puntuacion2.textContent = "Puntuacion perdedor: " + loser.score;
      modalwin.style.display = 'block';

      abandonarmulti.onclick = function () {
        window.location.replace("index.html");
      }

      for (var i = 0; i < jugadores.length; i++) {
        currentKey = jugadores[i].key;
        console.log(auxPlayer[i].nombre + ":  " + auxPlayer[i].score);
        updateFirebaseRemaster(currentKey, (auxPlayer[i].score));
      }
    }
    isPaused = true;

  }

  renderer.render(scene, camera);
}

function updateFirebase(currentPlayer, currentKey, objectPos) {
  const dbRefPlayers = firebase.database().ref().child(`jugadores/${currentKey}`);

  dbRefPlayers.update({
    nombre: currentPlayer.nombre,
    position: currentPlayer.position,
    rotation: currentPlayer.rotation,
    action: currentPlayer.action,
    boxPosition: objectPos,
  })
}

function updateFirebaseRemaster(currentKey, score) {
  const dbRefPlayers = firebase.database().ref().child(`jugadores/${currentKey}`);

  dbRefPlayers.update({
    score: score,
  })
}

function cargar_objetos() {

  setTimeout(() => {
    powers = true;
  }, 2700)

  //ENVIRONMENT
  const load_environment = new THREE.CubeTextureLoader();
  const texture = load_environment.load([
    'resources/Escena1/posx.jpg',
    'resources/Escena1/negx.jpg',
    'resources/Escena1/posy.jpg',
    'resources/Escena1/negy.jpg',
    'resources/Escena1/posz.jpg',
    'resources/Escena1/negz.jpg',
  ]);
  scene.background = texture;

  //SCENERY
  var scenary = new THREE.FBXLoader();
  scenary.load('resources/Escena1/Models/Escenario/BeachRockFree_fbx.fbx', function (object_scenary) {
    object_scenary.position.z = -90;    //lejos o cercs
    object_scenary.position.y = -5;      //altura
    object_scenary.position.x = 50;      //izq derecha
    // object.rotation.x = 6;
    object_scenary.scale.set(0.4, 0.4, 0.4);
    scene.add(object_scenary)
  });
  //SCENERY

  var purpleBox1 = new THREE.FBXLoader();
  purpleBox1.load('resources/Escena1/Models/CubosMemoria/cuboMorado.fbx', function (object_purple_square) {
    object_purple_square.position.z = -15;    //lejos o cercs
    object_purple_square.position.y = -1.4;      //altura
    object_purple_square.position.x = -30;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    object_purple_square.name = "purpleBox1";
    collisionObjects.push(object_purple_square);
    scene.add(object_purple_square)
  });

  var blackBox1 = new THREE.FBXLoader();
  blackBox1.load('resources/Escena1/Models/CubosMemoria/cuboTrampa.fbx', function (object_purple_square) {
    object_purple_square.position.z = -15;    //lejos o cercs
    object_purple_square.position.y = -1.4;      //altura
    object_purple_square.position.x = -15;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    object_purple_square.name = "blackBox1";
    collisionObjects.push(object_purple_square);
    scene.add(object_purple_square)
  });

  var redBox1 = new THREE.FBXLoader();
  redBox1.load('resources/Escena1/Models/CubosMemoria/cuboRojo.fbx', function (object_purple_square) {
    object_purple_square.position.z = -15;    //lejos o cercs
    object_purple_square.position.y = -1.4;      //altura
    object_purple_square.position.x = 0;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    object_purple_square.name = "redBox1";
    collisionObjects.push(object_purple_square);
    scene.add(object_purple_square)
  });

  var blackBox2 = new THREE.FBXLoader();
  blackBox2.load('resources/Escena1/Models/CubosMemoria/cuboTrampa.fbx', function (object_purple_square) {
    object_purple_square.position.z = -15;    //lejos o cercs
    object_purple_square.position.y = -1.4;      //altura
    object_purple_square.position.x = 15;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    object_purple_square.name = "blackBox2";
    collisionObjects.push(object_purple_square);
    scene.add(object_purple_square)
  });

  var orangeBox1 = new THREE.FBXLoader();
  orangeBox1.load('resources/Escena1/Models/CubosMemoria/cuboNaranja.fbx', function (object_purple_square) {
    object_purple_square.position.z = 0;    //lejos o cercs
    object_purple_square.position.y = -1.4;      //altura
    object_purple_square.position.x = -30;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    object_purple_square.name = "orangeBox1";
    collisionObjects.push(object_purple_square);
    scene.add(object_purple_square)
  });

  var orangeBox2 = new THREE.FBXLoader();
  orangeBox2.load('resources/Escena1/Models/CubosMemoria/cuboNaranja.fbx', function (object_purple_square) {
    object_purple_square.position.z = 0;    //lejos o cercs
    object_purple_square.position.y = -1.4;      //altura
    object_purple_square.position.x = -15;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    object_purple_square.name = "orangeBox2";
    collisionObjects.push(object_purple_square);
    scene.add(object_purple_square)
  });

  var greenBox1 = new THREE.FBXLoader();
  greenBox1.load('resources/Escena1/Models/CubosMemoria/cuboVerde.fbx', function (object_purple_square) {
    object_purple_square.position.z = 0;    //lejos o cercs
    object_purple_square.position.y = -1.4;      //altura
    object_purple_square.position.x = 0;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    object_purple_square.name = "greenBox1";
    collisionObjects.push(object_purple_square);
    scene.add(object_purple_square)
  });

  var blackBox3 = new THREE.FBXLoader();
  blackBox3.load('resources/Escena1/Models/CubosMemoria/cuboTrampa.fbx', function (object_purple_square) {
    object_purple_square.position.z = 0;    //lejos o cercs
    object_purple_square.position.y = -1.4;      //altura
    object_purple_square.position.x = 15;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    object_purple_square.name = "blackBox3";
    collisionObjects.push(object_purple_square);
    scene.add(object_purple_square)
  });

  var greenBox2 = new THREE.FBXLoader();
  greenBox2.load('resources/Escena1/Models/CubosMemoria/cuboVerde.fbx', function (object_purple_square) {
    object_purple_square.position.z = 15;    //lejos o cercs
    object_purple_square.position.y = -1.4;      //altura
    object_purple_square.position.x = -30;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    object_purple_square.name = "greenBox2";
    collisionObjects.push(object_purple_square);
    scene.add(object_purple_square)
  });

  var purpleBox2 = new THREE.FBXLoader();
  purpleBox2.load('resources/Escena1/Models/CubosMemoria/cuboMorado.fbx', function (object_purple_square) {
    object_purple_square.position.z = 15;    //lejos o cercs
    object_purple_square.position.y = -1.4;      //altura
    object_purple_square.position.x = -15;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    object_purple_square.name = "purpleBox2";
    collisionObjects.push(object_purple_square);
    scene.add(object_purple_square)
  });

  var blackBox3 = new THREE.FBXLoader();
  blackBox3.load('resources/Escena1/Models/CubosMemoria/cuboTrampa.fbx', function (object_purple_square) {
    object_purple_square.position.z = 15;    //lejos o cercs
    object_purple_square.position.y = -1.4;      //altura
    object_purple_square.position.x = 0;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    object_purple_square.name = "blackBox3";
    collisionObjects.push(object_purple_square);
    scene.add(object_purple_square)
  });

  var redBox2 = new THREE.FBXLoader();
  redBox2.load('resources/Escena1/Models/CubosMemoria/cuboRojo.fbx', function (object_purple_square) {
    object_purple_square.position.z = 15;    //lejos o cercs
    object_purple_square.position.y = -1.4;      //altura
    object_purple_square.position.x = 15;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    object_purple_square.name = "redBox2";
    collisionObjects.push(object_purple_square);
    scene.add(object_purple_square)
  });


  var power1 = new THREE.FBXLoader();
  power1.load('resources/Habilidades/lentitud.fbx', function (object_purple_square) {
    object_purple_square.position.z = 0;    //lejos o cercs
    object_purple_square.position.y = 0;      //altura
    object_purple_square.position.x = 0;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.01, 0.01, 0.01);
    object_purple_square.name = "power1";
    specialObjects.push(object_purple_square);
    scene.add(object_purple_square)
  });

  var power2 = new THREE.FBXLoader();
  power2.load('resources/Habilidades/velocidad.fbx', function (object_purple_square) {
    object_purple_square.position.z = 0;    //lejos o cercs
    object_purple_square.position.y = -1.4;      //altura
    object_purple_square.position.x = -30;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.01, 0.01, 0.01);
    object_purple_square.name = "power2";
    specialObjects.push(object_purple_square);
    scene.add(object_purple_square)
  });



}

$("#btn-pausa").click(function () {

  //Obtenemos las ventanas modales
  var ModalPausa = document.getElementById("modal-pausa");
  var ModalConfiguracion = document.getElementById("modal-configuracion-pausa");

  //Mostramos el menú
  ModalPausa.style.display = "block";
  isPaused = true;

  //Obtenemos los botones
  var btnConfig = document.getElementById("btn-configuracion-pausa");
  var btnSalir = document.getElementById("btn-abandonar");
  var btnSonidoMusica = document.getElementById("sonido-musica");
  var btnSFX = document.getElementById("sonido-juego");

  var btncontinue = document.getElementById("keepplaying");
  var span = document.getElementsByClassName("close")[1];
  var cerrarconfig = document.getElementById("cerrar-config");

  btnSalir.onclick = function () {
    window.location.replace("index.html");

  }

  btncontinue.onclick = function () {
    isPaused = false;
    ModalPausa.style.display = "none";
  }

  // When the user clicks on the button, open the modal
  btnConfig.onclick = function () {
    ModalConfiguracion.style.display = "block";

  }

  // Cerrar con la (x)
  // span.onclick = function() {
  //   ModalPausa.style.display = "none";
  // }

  cerrarconfig.onclick = function () {
    ModalConfiguracion.style.display = "none";

  }

  btnSonidoMusica.onclick = function () {
    if (!backgroundSound.paused) {
      btnSonidoMusica.textContent = "OFF";
      backgroundSound.pause();
    }
    else {
      btnSonidoMusica.textContent = "ON";
      backgroundSound.play();
    }
  }

  btnSFX.onclick = function () {
    if (btnSFX.textContent == "ON" && isSFXOn) {
      isSFXOn = false;
      btnSFX.textContent = "OFF";
      console.log("apagado");
    }
    else {
      isSFXOn = true;
      btnSFX.textContent = "ON";
      console.log("prendido");
    }
  }

  // Cerrar cuando haya un clic afuera de la ventana
  window.onclick = function (event) {
    if (event.target == ModalPausa) {
      isPaused = false;
      ModalPausa.style.display = "none";
    }

    if (event.target == ModalConfiguracion) {
      ModalConfiguracion.style.display = "none";
    }
  }
});