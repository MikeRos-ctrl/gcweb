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
      }
      else {
        jugador2Ready = true;
        personaje.position.x = 15;    //izq-der
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
    //console.log(array);

    for (var i = 0; i < jugadores.length; i++) {
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

//    console.log(array);
    if (array != "null") {
      //moving the box
      collisionObjects[array].position.y = 1;      //altura
      collisionObjects[array].rotation.x = 3.1;
      returnToOriginalPlace(collisionObjects[array]);
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

    var newPlayer = dbRefPlayers.push();
    newPlayer.set({
      nombre,
      position,
      rotation,
      action,
      boxPosition,
    });
  });
});

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
  camera.rotation.x = 5.3;    //angulo camara 4.8

  //camera.position.z = 0;    //lejos o cercs
  //camera.position.y = 2;      //altura
  //camera.rotation.x = 0;    //angulo camara

  //cube.position.x = 5;
  //cube.add(camera);

  ////////////AÑADO OBJETOS A MI ESCENA///////////////////
  scene.add(ambientLight);
  scene.add(directionalLight);
  scene.add(cube);
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
    yaw = 6.5;
    run = true;
  } if (keys["D"]) {
    yaw = -6.5;
    run = true;
  }
  if (keys["W"]) {
    forward = -14;
    run = true;
  } if (keys["S"]) {
    forward = 14;
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

  if (jugador1Ready == true && jugador2Ready == true) { //now i can play
    //if (jugador1Ready == false && jugador2Ready == false) { //now i can play
    //console.log("you can play");
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
      personajePrincipal.rotation.y += yaw * deltaTime;
      personajePrincipal.translateZ(forward * deltaTime);

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

        for (var i = 0; i < collisionObjects.length; i++) {
          purpleBox1BB.setFromObject(collisionObjects[i]);

          if (purpleBox1BB.intersectsBox(personajePrincipalBB) && salta == true) {
            collisionObjects[i].position.y = 1;      //altura
            collisionObjects[i].rotation.x = 3.1;
            returnToOriginalPlace(collisionObjects[i]);
            objectPos = i;
            break;
          }
        }
      } catch (error) {
        console.log(error);
      }

      updateFirebase(currentPlayer, currentKey, objectPos);
    }
  }
  renderer.render(scene, camera);
}

function returnToOriginalPlace(value) {
  setTimeout(() => {
    value.position.y = -1.4;
    value.rotation.x = 0;
  }, 3800)

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

function cargar_objetos() {
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
    object_purple_square.position.x = -15;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
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
    collisionObjects.push(object_purple_square);
    scene.add(object_purple_square)
  });

  var blackBox1 = new THREE.FBXLoader();
  blackBox1.load('resources/Escena1/Models/CubosMemoria/cuboTrampa.fbx', function (object_purple_square) {
    object_purple_square.position.z = -15;    //lejos o cercs
    object_purple_square.position.y = -1.4;      //altura
    object_purple_square.position.x = 15;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    collisionObjects.push(object_purple_square);
    scene.add(object_purple_square)
  });

  var orangeBox1 = new THREE.FBXLoader();
  orangeBox1.load('resources/Escena1/Models/CubosMemoria/cuboNaranja.fbx', function (object_purple_square) {
    object_purple_square.position.z = 0;    //lejos o cercs
    object_purple_square.position.y = -1.4;      //altura
    object_purple_square.position.x = -15;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
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
    collisionObjects.push(object_purple_square);
    scene.add(object_purple_square)
  });

  var redBox2 = new THREE.FBXLoader();
  redBox2.load('resources/Escena1/Models/CubosMemoria/cuboRojo.fbx', function (object_purple_square) {
    object_purple_square.position.z = 0;    //lejos o cercs
    object_purple_square.position.y = -1.4;      //altura
    object_purple_square.position.x = 15;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    collisionObjects.push(object_purple_square);
    scene.add(object_purple_square)
  });

  var greenBox2 = new THREE.FBXLoader();
  greenBox2.load('resources/Escena1/Models/CubosMemoria/cuboVerde.fbx', function (object_purple_square) {
    object_purple_square.position.z = 15;    //lejos o cercs
    object_purple_square.position.y = -1.4;      //altura
    object_purple_square.position.x = -15;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    collisionObjects.push(object_purple_square);
    scene.add(object_purple_square)
  });

  var orangeBox2 = new THREE.FBXLoader();
  orangeBox2.load('resources/Escena1/Models/CubosMemoria/cuboNaranja.fbx', function (object_purple_square) {
    object_purple_square.position.z = 15;    //lejos o cercs
    object_purple_square.position.y = -1.4;      //altura
    object_purple_square.position.x = 0;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    collisionObjects.push(object_purple_square);
    scene.add(object_purple_square)
  });

  var purpleBox2 = new THREE.FBXLoader();
  purpleBox2.load('resources/Escena1/Models/CubosMemoria/cuboMorado.fbx', function (object_purple_square) {
    object_purple_square.position.z = 15;    //lejos o cercs
    object_purple_square.position.y = -1.4;      //altura
    object_purple_square.position.x = 15;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    collisionObjects.push(object_purple_square);
    scene.add(object_purple_square)
  });
}