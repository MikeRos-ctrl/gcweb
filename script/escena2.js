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
let once = true;
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
let disable = false
let listener2;
let audioLoader2;
let backgroundSound2;
var particles;
let particleSystem;

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

  const listener = new THREE.AudioListener();
  const audioLoader = new THREE.AudioLoader();
  const backgroundSound = new THREE.Audio(listener);

  audioLoader.load('script/danger.mp3', function (xd) {
    backgroundSound.setBuffer(xd);
    backgroundSound.setLoop(true);
    backgroundSound.setVolume(0.3);
    //  backgroundSound.play();
  })
  ////////////AÑADO OBJETOS A MI ESCENA///////////////////
  listener2 = new THREE.AudioListener();
  audioLoader2 = new THREE.AudioLoader();
  backgroundSound2 = new THREE.Audio(listener2);
  audioLoader2.load('script/hit.wav', function (xd) {
    backgroundSound2.setBuffer(xd);
    backgroundSound2.setLoop(false);
    backgroundSound2.setVolume(0.3);
  })



  scene.add(listener);

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
    yaw = 6.5;
    run = true;
  } if (keys["D"]) {
    yaw = -6.5;
    run = true;
  }
  if (keys["W"]) {
    forward = -15;
    run = true;
  } if (keys["S"]) {
    forward = 15;
    run = true;
  }
  if (keys["M"]) {
    run = true;
    jump = true;
  }

  if (twice == true && (purpleValidator2 == false ||
    greenValidator2 == false || orangeValidator2 == false
    || redValidator2 == false)) {

    personajePrincipal = scene.getObjectByName("player1");
    personajePrincipal.rotation.y += yaw * deltaTime;
    personajePrincipal.translateZ(forward * deltaTime);

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

    // console.log(collisionObjects);

    let objectPos = "null";

    try {//COLISION

      let personajePrincipalBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
      personajePrincipalBB.setFromObject(personajePrincipal);

      let purpleBox1BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());

      let aux;
      for (var i = 0; i < collisionObjects.length; i++) {
        purpleBox1BB.setFromObject(collisionObjects[i]);

        if (purpleBox1BB.intersectsBox(personajePrincipalBB) && salta == true) {

          //MOVE THE CURRENT BOX
          collisionObjects[i].position.y = 1;
          collisionObjects[i].rotation.x = 3.1;
          aux = i;

          pArray.push(collisionObjects[i].name);

          if (pArray.includes("purpleBox1") && pArray.includes("purpleBox2") && purpleValidator1 == true) {

            backgroundSound2.play();
            purpleValidator1 = false;

            console.log("ya se pueden retirar los rosas");
            disable = true;

            purpleValidator2 = true;

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

          if (pArray.includes("redBox1") && pArray.includes("redBox2") && redValidator1 == true) {
            console.log("ya se pueden retirar los rojos");

            backgroundSound2.play();
            redValidator1 = false;

            redValidator2 = true;

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

          if (pArray.includes("greenBox1") && pArray.includes("greenBox2") && greenValidator1 == true) {
            console.log("ya se pueden retirar los verdes");
            greenValidator2 = true;

            backgroundSound2.play();

            greenValidator1 = false;
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

          if (pArray.includes("orangeBox1") && pArray.includes("orangeBox2") && orangeValidator1 == true) {
            console.log("ya se pueden retirar los naranjas");

            backgroundSound2.play();

            orangeValidator1 = false;

            orangeValidator2 = true;

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

              //returnToOriginalPlace(collisionObjects[aux]);
              //console.log("no paso nada")

              collisionObjects[aux].position.y = -1.4;
              collisionObjects[aux].rotation.x = 0;


              if (purpleValidator2 == true && (collisionObjects[aux].name == "purpleBox1" || collisionObjects[aux].name == "purpleBox2")) {  //para los morados
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

              if (redValidator2 == true && (collisionObjects[aux].name == "redBox1" || collisionObjects[aux].name == "redBox2")) {  //para los morados
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

              if (greenValidator2 == true && (collisionObjects[aux].name == "greenBox1" || collisionObjects[aux].name == "greenBox2")) {  //para los morados
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

              if (orangeValidator2 == true && (collisionObjects[aux].name == "orangeBox1" || collisionObjects[aux].name == "orangeBox2")) {  //para los morados
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
      }
    } catch (error) {
      console.log(error);
    }

  }

  if (purpleValidator2 == true &&
    greenValidator2 == true &&
    orangeValidator2 == true &&
    redValidator2 == true) {
    console.log("juego terminado");
    personajePrincipal.jump.stop();
    personajePrincipal.run.stop();

    if (once == true) {
      spawnParticulas(personajePrincipal);
      once = false;
    }




    //IVAN aqui ya pones un modal de victoria y para el inicio
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
  scenary.load('resources/Escena2/Modelos/Escenario/mundodenievenalgon.fbx', function (object_scenary) {
    //object.rotation.y = 3.2;
    object_scenary.position.z = 200;    //lejos o cercs
    object_scenary.position.y = -100;      //altura
    object_scenary.position.x = -10;      //izq derecha
    object_scenary.scale.set(0.9, 0.9, 0.9);
    scene.add(object_scenary)
  });
  //SCENERY

  //PLAYER 1
  player1 = new THREE.FBXLoader();
  player1.load('resources/jugador2/Ch45_nonPBR.fbx', function (personaje) {
    personaje.position.y = 0.5;      //altura
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
    }, 2500)
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
    object_purple_square.name = "blackBox1";
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
    object_purple_square.name = "greenBox2";
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
}

function spawnParticulas(target) {
  // create the particle variables
  //  console.log(target);
  particles = new THREE.Geometry();
  var pMaterial = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 1,
    map: THREE.ImageUtils.loadTexture(
      "particula.png"
    ),
    blending: THREE.AdditiveBlending,
    transparent: true
  });

  // now create the individual particles
  for (var p = 0; p < 50; p++) {
    let pX = getRandomArbitrary(target.position.x - 10, target.position.x + 10);
    let pY = getRandomArbitrary(target.position.y - 10, target.position.y + 10);
    let pZ = getRandomArbitrary(target.position.z - 10, target.position.z + 10);
    let aux = new THREE.Vector3(pX, pY, pZ);
    aux.velocity = new THREE.Vector3(0, -Math.random(), 0);
    particles.vertices.push(aux);
  }

  // create the particle system
  particleSystem = new THREE.Points(particles, pMaterial);
  particleSystem.sortParticles = true;
  // add it to the scene
  scene.add(particleSystem);
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
