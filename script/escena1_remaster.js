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
let dahyun;
let chaeyoung;
var col;
let man;



$(document).ready(function () {
  alert("nepe")
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
      personaje.position.y = 2;      //altura estaba en 2 xd
      personaje.position.x = -17;    //izq-der
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
        //personaje.run.weight = 0;
        //personaje.run.play();
        mixers.push(animation);
      });

      const anim3 = new THREE.FBXLoader();
      anim3.load('resources/jugador2/Jumping.fbx', (anim) => {
        var animation = new THREE.AnimationMixer(personaje);
        personaje.jump = animation.clipAction(anim.animations[0]);
        //personaje.jump.weight = 0;
        //personaje.jump.play();
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
    let personajePrincipalxd = scene.getObjectByName(nombre);

    //  for (var i = 0; i < jugadores.length; i++) {
    //   if (jugadores[i].key == key) {
    personajePrincipalxd.rotation.y = player.rotation.y;
    personajePrincipalxd.position.z = player.position.z;
    personajePrincipalxd.position.x = player.position.x;
    // }
    //}

  });

  render();

  $(document).on('click', '#boton', function (e) {
    e.preventDefault();
    var position = { x: 0, y: 2, z: 0 };
    var rotation = { x: 0, y: 0, z: 0 };
    let nombre = document.querySelector("#txtName").value;

    userName = nombre;

    var newPlayer = dbRefPlayers.push();
    newPlayer.set({
      nombre,
      position,
      rotation,
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
  dahyun = cube;

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
}

function render() {
  requestAnimationFrame(render);
  deltaTime = clock.getDelta();

  var yaw = 0;				//leff or right
  var forward = 0; 		//forward backward
  var currentPlayer;
  var currentKey;
  var place;

  if (keys["A"]) {
    yaw = 5;
    run = true;
  } if (keys["D"]) {
    yaw = -5;
    run = true;
  }
  if (keys["W"]) {
    forward = -5;
    run = true;
  } if (keys["P"]) {
    forward = 5;
    run = true;
  }
  if (keys["M"]) {
    jump = true;
  }

  for (var i = 0; i < jugadores.length; i++) {
    if (jugadores[i].player.nombre == userName) {
      currentPlayer = jugadores[i].player;
      currentKey = jugadores[i].key;
      place = i;
      update = true;
    }
  }

  if (update) {

    //    man = scene.getObjectByName("rock");
    personajePrincipal = scene.getObjectByName(currentPlayer.nombre);
    personajePrincipal.rotation.y += yaw * deltaTime;
    personajePrincipal.translateZ(forward * deltaTime);

    currentPlayer.rotation.y = personajePrincipal.rotation.y;
    currentPlayer.position.x = personajePrincipal.position.x;
    currentPlayer.position.z = personajePrincipal.position.z;
    updateFirebase(currentPlayer, currentKey);

    if (run) {
      // personajePrincipal.run.weight = 1;
      //personajePrincipal.run.setLoop(THREE.LoopOnce, 1);

      personajePrincipal.run.play();
      // personajePrincipal.run.curAction.setLoop(THREE.LoopOnce, 1);


    }
    else {
      personajePrincipal.run.stop();
      //   personajePrincipal.run.reset();
      //personajePrincipal.idle.crossFadeTo(personajePrincipal.run, 0.2, true);

      //personajePrincipal.idle.crossFadeFrom(personajePrincipal.run, 0.2, true);

      //     personajePrincipal.reset();
      // personajePrincipal.run.weight = 0;
      //personajePrincipal.idle.crossFadeFrom(personajePrincipal.run, 0.2, true);
    }

    if (jump) {
      personajePrincipal.jump.play();
    }

    /*
    try {

      let personajePrincipalBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
      personajePrincipalBB.setFromObject(personajePrincipal);

      let cube2BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
      cube2BB.setFromObject(man);

      if (cube2BB.intersectsBox(cube1BB)) {
        console.log("xd")
      }
      else {
        console.log("dx");
      }
    } catch (error) {
      console.log(error);
    }
  */
  }

  if (mixers.length > 0) {
    for (var i = 0; i < mixers.length; i++) {
      mixers[i].update(deltaTime);
    }
  }

  renderer.render(scene, camera);
}

function updateFirebase(currentPlayer, currentKey) {
  const dbRefPlayers = firebase.database().ref().child(`jugadores/${currentKey}`);
  dbRefPlayers.update({
    nombre: currentPlayer.nombre,
    position: currentPlayer.position,
    rotation: currentPlayer.rotation
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
    object_purple_square.position.y = -1.5;      //altura
    object_purple_square.position.x = -15;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    scene.add(object_purple_square)
  });

  var redBox1 = new THREE.FBXLoader();
  redBox1.load('resources/Escena1/Models/CubosMemoria/cuboRojo.fbx', function (object_purple_square) {
    object_purple_square.position.z = -15;    //lejos o cercs
    object_purple_square.position.y = -1.5;      //altura
    object_purple_square.position.x = 0;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    scene.add(object_purple_square)
  });

  var blackBox1 = new THREE.FBXLoader();
  blackBox1.load('resources/Escena1/Models/CubosMemoria/cuboTrampa.fbx', function (object_purple_square) {
    object_purple_square.position.z = -15;    //lejos o cercs
    object_purple_square.position.y = -1.5;      //altura
    object_purple_square.position.x = 15;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    scene.add(object_purple_square)
  });

  var orangeBox1 = new THREE.FBXLoader();
  orangeBox1.load('resources/Escena1/Models/CubosMemoria/cuboNaranja.fbx', function (object_purple_square) {
    object_purple_square.position.z = 0;    //lejos o cercs
    object_purple_square.position.y = -1.5;      //altura
    object_purple_square.position.x = -15;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    scene.add(object_purple_square)
  });

  var greenBox1 = new THREE.FBXLoader();
  greenBox1.load('resources/Escena1/Models/CubosMemoria/cuboVerde.fbx', function (object_purple_square) {
    object_purple_square.position.z = 0;    //lejos o cercs
    object_purple_square.position.y = -1.5;      //altura
    object_purple_square.position.x = 0;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    scene.add(object_purple_square)
  });

  var redBox2 = new THREE.FBXLoader();
  redBox2.load('resources/Escena1/Models/CubosMemoria/cuboRojo.fbx', function (object_purple_square) {
    object_purple_square.position.z = 0;    //lejos o cercs
    object_purple_square.position.y = -1.5;      //altura
    object_purple_square.position.x = 15;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    scene.add(object_purple_square)
  });

  var greenBox2 = new THREE.FBXLoader();
  greenBox2.load('resources/Escena1/Models/CubosMemoria/cuboVerde.fbx', function (object_purple_square) {
    object_purple_square.position.z = 15;    //lejos o cercs
    object_purple_square.position.y = -1.5;      //altura
    object_purple_square.position.x = -15;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    scene.add(object_purple_square)
  });

  var orangeBox2 = new THREE.FBXLoader();
  orangeBox2.load('resources/Escena1/Models/CubosMemoria/cuboNaranja.fbx', function (object_purple_square) {
    object_purple_square.position.z = 15;    //lejos o cercs
    object_purple_square.position.y = -1.5;      //altura
    object_purple_square.position.x = 0;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    scene.add(object_purple_square)
  });

  var purpleBox2 = new THREE.FBXLoader();
  purpleBox2.load('resources/Escena1/Models/CubosMemoria/cuboMorado.fbx', function (object_purple_square) {
    object_purple_square.position.z = 15;    //lejos o cercs
    object_purple_square.position.y = -1.5;      //altura
    object_purple_square.position.x = 15;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    scene.add(object_purple_square)
  });






  /*  collisionObjects.push(purple1);
    collisionObjects.push(purple2);
    collisionObjects.push(purple3);
    collisionObjects.push(purple4);
    collisionObjects.push(purple5);
    collisionObjects.push(purple6);
    collisionObjects.push(purple7);
    collisionObjects.push(purple8);
    collisionObjects.push(purple9);
  */
}