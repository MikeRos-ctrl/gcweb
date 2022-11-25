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
let pArray = [];
let dArray = [];
var player1;
let twice = false;

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

$(document).ready(function () {
  setupScene();
  cargar_objetos();
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  render();

  $(document).on('click', '#boton', function (e) {      //iINSERT NEW PLAYER
    e.preventDefault();
    let nombre = document.querySelector("#txtName").value;
    userName = nombre;
    document.getElementById("container").style.display = "none";
    jugador1Ready = true;
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
  grid.position.y = -1;
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
    yaw = 3;
    run = true;
  } if (keys["D"]) {
    yaw = -3;
    run = true;
  }
  if (keys["W"]) {
    forward = -7.5;
    run = true;
  } if (keys["S"]) {
    forward = 7.5;
    run = true;
  }
  if (keys["M"]) {
    run = true;
    jump = true;
  }

  if (twice == true) {
    // console.log("ya se puede jugar");
    personajePrincipal = scene.getObjectByName("player1");
    personajePrincipal.rotation.y += yaw * deltaTime;
    personajePrincipal.translateZ(forward * deltaTime);
    //personajePrincipal.position.y -= 0.01; 

    if (run) {
      personajePrincipal.run.play();
    }
    else {
      personajePrincipal.run.stop();
    }

    if (jump) {
      personajePrincipal.jump.play();
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

      //      0 2 3 4 7  9

      for (var i = 0; i < collisionObjects.length; i++) {

        purpleBox1BB.setFromObject(collisionObjects[i]);

        if ((purpleBox1BB.intersectsBox(personajePrincipalBB) || salta == true)) {
          personajePrincipal.position.y = 0.5;
          console.log("no se cae");
          break;
        }
        else {
          personajePrincipal.position.y -= 0.2;
        }

      }
    } catch (error) {
      console.log(error);
    }

  }

  if (mixers.length > 0) {
    for (var i = 0; i < mixers.length; i++) {
      mixers[i].update(deltaTime);
    }
  }

  renderer.render(scene, camera);
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
  scenary.load('resources/Escena3/Modelos/Escenario/mundodepastonalgon.fbx', function (object_scenary) {
    //object.rotation.y = 3.2;
    object_scenary.position.z = 20;    //lejos o cercs
    object_scenary.position.y = -50;      //altura
    object_scenary.position.x = -10;      //izq derecha
    object_scenary.rotation.y = 3;
    object_scenary.scale.set(0.3, 0.3, 0.3);
    scene.add(object_scenary)
  });
  //SCENERY

  //PLAYER 1
  player1 = new THREE.FBXLoader();
  player1.load('resources/jugador2/Ch45_nonPBR.fbx', function (personaje) {
    personaje.position.y = 0.5;      //altura
    personaje.position.x = -15;    //izq-der
    personaje.position.z = -15;    //profundidad lejor o cerca


    personaje.scale.set(0.05, 0.05, 0.05);
    personaje.name = "player1";

    const anim1 = new THREE.FBXLoader();
    anim1.load('resources/jugador2/Idle.fbx', (anim) => {
      var animation = new THREE.AnimationMixer(personaje);
      personaje.idle = animation.clipAction(anim.animations[0]);
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

    setTimeout(() => {
      twice = true;
    }, 2700)
  });
  //PLAYER 1

  var purpleBox1 = new THREE.FBXLoader();
  purpleBox1.load('resources/Escena1/Models/CubosMemoria/cuboMorado.fbx', function (object_purple_square) {
    object_purple_square.position.z = -15;    //lejos o cercs
    object_purple_square.position.y = -1.4;      //altura
    object_purple_square.position.x = -15;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    object_purple_square.name = "purpleBox1";
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
    // collisionObjects.push(object_purple_square);
    scene.add(object_purple_square)
  });

  var blackBox1 = new THREE.FBXLoader();
  blackBox1.load('resources/Escena1/Models/CubosMemoria/cuboTrampa.fbx', function (object_purple_square) {
    object_purple_square.position.z = -15;    //lejos o cercs
    object_purple_square.position.y = -1.4;      //altura
    object_purple_square.position.x = 15;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    object_purple_square.name = "blackBox1";
    // collisionObjects.push(object_purple_square);
    scene.add(object_purple_square)
  });

  var orangeBox1 = new THREE.FBXLoader();
  orangeBox1.load('resources/Escena1/Models/CubosMemoria/cuboNaranja.fbx', function (object_purple_square) {
    object_purple_square.position.z = 0;    //lejos o cercs
    object_purple_square.position.y = -1.4;      //altura
    object_purple_square.position.x = -15;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    object_purple_square.name = "orangeBox1";
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

  var redBox2 = new THREE.FBXLoader();
  redBox2.load('resources/Escena1/Models/CubosMemoria/cuboRojo.fbx', function (object_purple_square) {
    object_purple_square.position.z = 0;    //lejos o cercs
    object_purple_square.position.y = -1.4;      //altura
    object_purple_square.position.x = 15;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    object_purple_square.name = "redBox2";
    //collisionObjects.push(object_purple_square);
    scene.add(object_purple_square)
  });

  var greenBox2 = new THREE.FBXLoader();
  greenBox2.load('resources/Escena1/Models/CubosMemoria/cuboVerde.fbx', function (object_purple_square) {
    object_purple_square.position.z = 15;    //lejos o cercs
    object_purple_square.position.y = -1.4;      //altura
    object_purple_square.position.x = -15;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    object_purple_square.name = "greenBox2";
    // collisionObjects.push(object_purple_square);
    scene.add(object_purple_square)
  });

  var orangeBox2 = new THREE.FBXLoader();
  orangeBox2.load('resources/Escena1/Models/CubosMemoria/cuboNaranja.fbx', function (object_purple_square) {
    object_purple_square.position.z = 15;    //lejos o cercs
    object_purple_square.position.y = -1.4;      //altura
    object_purple_square.position.x = 0;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    object_purple_square.name = "orangeBox2";
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
    object_purple_square.name = "purpleBox2";
    collisionObjects.push(object_purple_square);
    scene.add(object_purple_square)
  });

  /*  
    var objectxd = new THREE.FBXLoader();
    objectxd.load('resources/dummy/frijoles.fbx', function (object_purple_square) {
      object_purple_square.position.z = 15;    //lejos o cercs
      object_purple_square.position.y = -1.4;      //altura
      object_purple_square.position.x = 15;      //izq derecha
      object_purple_square.rotation.y = 3.2;
      object_purple_square.scale.set(0.03, 0.03, 0.03);
      object_purple_square.name = "purpleBdfghjx2";
      collisionObjects.push(object_purple_square);
      scene.add(object_purple_square)
    });
  */

}