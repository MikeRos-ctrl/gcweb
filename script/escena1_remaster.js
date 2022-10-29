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

$(document).ready(function () {
  setupScene();
  cargar_objetos();
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  render();
});

function createRenderer(color) {
  let renderer = new THREE.WebGLRenderer({ precision: "mediump" });
  renderer.setClearColor(color);
  renderer.setPixelRatio((visibleSize.width / 2) / visibleSize.height);
  renderer.setSize(visibleSize.width / 2, visibleSize.height);
  renderers.push(renderer);
}

function createCamera() {
  let camera = new THREE.PerspectiveCamera(
    100,                                                                //angulo de vision
    visibleSize.width / visibleSize.height,   //aspect ratio
    0.1,                                                                //que tan cerca
    100                                                                 //que tan lejos
  );
  cameras.push(camera);
}

function setupScene() {

  createRenderer(new THREE.Color(0, 0, 0));     //renderer player 1
  createRenderer(new THREE.Color(0.2, 0, 0)); //renderer player 2

  createCamera();
  createCamera();

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
  var grid = new THREE.GridHelper(50, 10, 0xffffff, 0xffffff);

  ////////////////AJUSTE DE OBJETOS/////////////////////
  cube.position.y = 2;

  cameras[0].position.z = 20;    //lejos o cerca
  cameras[0].position.y = 20;      //altura
  cameras[0].rotation.x = 5.3;    //angulo camara 4.8

  cameras[1].position.z = 20;    //lejos o cerca
  cameras[1].position.y = 20;      //altura
  cameras[1].rotation.x = 5.3;    //angulo camara 4.8

  ////////////AÑADO OBJETOS A MI ESCENA///////////////////
  scene.add(ambientLight);
  scene.add(directionalLight);
  scene.add(cube);
  scene.add(grid);

  $("#scene-section1").append(renderers[0].domElement);//añado mis objetos 
  $("#scene-section2").append(renderers[1].domElement);//añado mis objetos 
}

function onKeyDown(event) {
  keys[String.fromCharCode(event.keyCode)] = true;
}

function onKeyUp(event) {
  keys[String.fromCharCode(event.keyCode)] = false;
  //run.crossFadeFrom(idle, 0.8, true);
  //run.reset();
  run.weight = 0;
  run2.weight = 0;
  //  run.reset();
  //idle.weight = 1;
}

function render() {
  requestAnimationFrame(render);
  deltaTime = clock.getDelta();

  var yaw = 0;				//leff or right
  var forward = 0; 		//forward backward

  if (keys["A"]) {
    yaw = 3;
    run.weight = 1;
  } else if (keys["D"]) {
    yaw = -3;
    run.weight = 1;
  }
  if (keys["W"]) {
    forward = -5;
    run.weight = 1;
  } else if (keys["S"]) {
    forward = 5;
    run.weight = 1;
  }

  if (keys["P"]) {
    algo = true;
  }

  if (algo == true) {
    //jump.reset();
    jump.weight = 1;
    jump.setLoop(THREE.LoopOnce, 1);
    jump.reset();
    algo = false;
    //jump.weight = 0;
  }

  personaje_globalxd = scene.getObjectByName("player1");
  personaje_globalxd.rotation.y += yaw * deltaTime;
  personaje_globalxd.translateZ(forward * deltaTime);
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  var yaw2 = 0;				//leff or right
  var forward2 = 0; 		//forward backward

  if (keys["J"]) {
    yaw2 = 3;
    run2.weight = 1;
  } else if (keys["L"]) {
    yaw2 = -3;
    run2.weight = 1;

  }
  if (keys["I"]) {
    forward2 = -5;
    run2.weight = 1;

  } else if (keys["K"]) {
    forward2 = 5;
    run2.weight = 1;
  }

  if (keys["M"]) {
    algo2 = true;
  }

  if (algo2 == true) {
    //jump.reset();
    jump2.weight = 1;
    jump2.setLoop(THREE.LoopOnce, 1);
    jump2.reset();
    algo2 = false;
    //jump.weight = 0;
  }

  personaje_globalxd2 = scene.getObjectByName("player2");
  personaje_globalxd2.rotation.y += yaw2 * deltaTime;
  personaje_globalxd2.translateZ(forward2 * deltaTime);




  if (mixers.length > 0) {
    for (var i = 0; i < mixers.length; i++) {
      mixers[i].update(deltaTime);
    }
  }

  if (mixers_2.length > 0) {
    for (var i = 0; i < mixers_2.length; i++) {
      mixers_2[i].update(deltaTime);
    }
  }
  renderers[0].render(scene, cameras[0]);
  renderers[1].render(scene, cameras[1]);
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



  //PLAYER 1
  player1 = new THREE.FBXLoader();
  player1.load('resources/jugador2/Ch45_nonPBR.fbx', function (personaje) {
    personaje.position.y = 2;      //altura
    personaje.position.x = -15;    //izq-der
    personaje.position.z = -15;    //profundidad lejor o cerca
    personaje.scale.set(0.05, 0.05, 0.05);
    personaje.name = "player1";

    const anim = new THREE.FBXLoader();
    anim.load('resources/jugador2/Idle.fbx', (anim) => {
      var diosayudame = new THREE.AnimationMixer(personaje);
      idle = diosayudame.clipAction(anim.animations[0]);
      idle.weight = 1;
      idle.play();
      mixers.push(diosayudame);
    });

    const anim2 = new THREE.FBXLoader();
    anim2.load('resources/jugador2/Running.fbx', (anim) => {
      var diosayudame2 = new THREE.AnimationMixer(personaje);
      run = diosayudame2.clipAction(anim.animations[0]);
      run.weight = 0;
      run.play();
      mixers.push(diosayudame2);
    });

    const anim3 = new THREE.FBXLoader();
    anim3.load('resources/jugador2/Jumping.fbx', (anim) => {
      var diosayudame2 = new THREE.AnimationMixer(personaje);
      jump = diosayudame2.clipAction(anim.animations[0]);
      jump.weight = 0;
      jump.play();
      mixers.push(diosayudame2);
    });

    scene.add(personaje);
  }, (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
  });
  //PLAYER 1

  //PLAYER 2
  player2 = new THREE.FBXLoader();
  player2.load('resources/jugador2/Ch45_nonPBR.fbx', function (personaje) {
    personaje.position.y = 2;      //altura
    personaje.position.x = 15;    //izq-der
    personaje.position.z = -15;    //profundidad lejor o cerca
    personaje.scale.set(0.05, 0.05, 0.05);
    personaje.name = "player2";

    const anim = new THREE.FBXLoader();
    anim.load('resources/jugador2/Idle.fbx', (anim) => {
      var diosayudame = new THREE.AnimationMixer(personaje);
      idle2 = diosayudame.clipAction(anim.animations[0]);
      idle2.weight = 1;
      idle2.play();
      mixers_2.push(diosayudame);
    });

    const anim2 = new THREE.FBXLoader();
    anim2.load('resources/jugador2/Running.fbx', (anim) => {
      var diosayudame2 = new THREE.AnimationMixer(personaje);
      run2 = diosayudame2.clipAction(anim.animations[0]);
      run2.weight = 0;
      run2.play();
      mixers_2.push(diosayudame2);
    });

    const anim3 = new THREE.FBXLoader();
    anim3.load('resources/jugador2/Jumping.fbx', (anim) => {
      var diosayudame2 = new THREE.AnimationMixer(personaje);
      jump2 = diosayudame2.clipAction(anim.animations[0]);
      jump2.weight = 0;
      jump2.play();
      mixers_2.push(diosayudame2);
    });

    scene.add(personaje);
  }, (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    flag = true;
  });
  //PLAYER 1







  var purple1 = new THREE.FBXLoader();
  purple1.load('resources/Escena1/Models/CubosMemoria/cuboMorado.fbx', function (object_purple_square) {
    object_purple_square.position.z = -15;    //lejos o cercs
    object_purple_square.position.y = -1.5;      //altura
    object_purple_square.position.x = -15;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    scene.add(object_purple_square)
  });

  var purple2 = new THREE.FBXLoader();
  purple2.load('resources/Escena1/Models/CubosMemoria/cuboMorado.fbx', function (object_purple_square) {
    object_purple_square.position.z = -15;    //lejos o cercs
    object_purple_square.position.y = -1.5;      //altura
    object_purple_square.position.x = 0;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    scene.add(object_purple_square)
  });

  var purple3 = new THREE.FBXLoader();
  purple3.load('resources/Escena1/Models/CubosMemoria/cuboMorado.fbx', function (object_purple_square) {
    object_purple_square.position.z = -15;    //lejos o cercs
    object_purple_square.position.y = -1.5;      //altura
    object_purple_square.position.x = 15;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    scene.add(object_purple_square)
  });

  var purple4 = new THREE.FBXLoader();
  purple4.load('resources/Escena1/Models/CubosMemoria/cuboMorado.fbx', function (object_purple_square) {
    object_purple_square.position.z = 0;    //lejos o cercs
    object_purple_square.position.y = -1.5;      //altura
    object_purple_square.position.x = -15;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    scene.add(object_purple_square)
  });

  var purple5 = new THREE.FBXLoader();
  purple5.load('resources/Escena1/Models/CubosMemoria/cuboMorado.fbx', function (object_purple_square) {
    object_purple_square.position.z = 0;    //lejos o cercs
    object_purple_square.position.y = -1.5;      //altura
    object_purple_square.position.x = 0;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    scene.add(object_purple_square)
  });

  var purple6 = new THREE.FBXLoader();
  purple6.load('resources/Escena1/Models/CubosMemoria/cuboMorado.fbx', function (object_purple_square) {
    object_purple_square.position.z = 0;    //lejos o cercs
    object_purple_square.position.y = -1.5;      //altura
    object_purple_square.position.x = 15;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    scene.add(object_purple_square)
  });


  var purple7 = new THREE.FBXLoader();
  purple7.load('resources/Escena1/Models/CubosMemoria/cuboMorado.fbx', function (object_purple_square) {
    object_purple_square.position.z = 15;    //lejos o cercs
    object_purple_square.position.y = -1.5;      //altura
    object_purple_square.position.x = -15;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    scene.add(object_purple_square)
  });

  var purple8 = new THREE.FBXLoader();
  purple8.load('resources/Escena1/Models/CubosMemoria/cuboMorado.fbx', function (object_purple_square) {
    object_purple_square.position.z = 15;    //lejos o cercs
    object_purple_square.position.y = -1.5;      //altura
    object_purple_square.position.x = 0;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    scene.add(object_purple_square)
  });

  var purple9 = new THREE.FBXLoader();
  purple9.load('resources/Escena1/Models/CubosMemoria/cuboMorado.fbx', function (object_purple_square) {
    object_purple_square.position.z = 15;    //lejos o cercs
    object_purple_square.position.y = -1.5;      //altura
    object_purple_square.position.x = 15;      //izq derecha
    object_purple_square.rotation.y = 3.2;
    object_purple_square.scale.set(0.03, 0.03, 0.03);
    scene.add(object_purple_square)
  });


}