import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';

class Escena1 {
  constructor() {
    this._Initialize();
  }

  _Initialize() {
    const NombreModeloEscenario = "BeachRockFree_fbx.fbx"

    this._threejs = new THREE.WebGLRenderer({
      antialias: true,
    });

    this._threejs.shadowMap.enabled = true;
    this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
    this._threejs.setPixelRatio(window.devicePixelRatio);
    this._threejs.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this._threejs.domElement);

    window.addEventListener('resize', () => {
      this._OnWindowResize();
    }, false);

    const fov = 60;
    const aspect = 1920 / 1080;
    const near = 0.1;
    const far = 3000.0;
    this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this._camera.rotation.x = -0.3;
    this._camera.position.x = -140;
    this._camera.position.z = 330;
    this._camera.position.y = 65;

    this._scene = new THREE.Scene();

    let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light.position.set(20, 100, 10);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.left = 100;
    light.shadow.camera.right = -100;
    light.shadow.camera.top = 100;
    light.shadow.camera.bottom = -100;
    this._scene.add(light);

    light = new THREE.AmbientLight(0x101010);
    this._scene.add(light);

    // const controls = new OrbitControls(
    //   this._camera, this._threejs.domElement);
    // controls.target.set(0, 20, 0);
    // controls.update();


    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      'resources/Escena1/posx.jpg',
      'resources/Escena1/negx.jpg',
      'resources/Escena1/posy.jpg',
      'resources/Escena1/negy.jpg',
      'resources/Escena1/posz.jpg',
      'resources/Escena1/negz.jpg',
    ]);
    this._scene.background = texture;

    this.CargarEscenario(NombreModeloEscenario);

    this._RAF();
  }

  _OnWindowResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._threejs.setSize(window.innerWidth, window.innerHeight);
  }

  _RAF() {
    requestAnimationFrame(() => {
      this._threejs.render(this._scene, this._camera);
      this._RAF();
    });
  }

  CargarEscenario(ModelScene) {
    const fbxLoader = new FBXLoader()
    fbxLoader.load('/resources/Escena1/Models/Escenario/' + ModelScene,
      (object) => {
        this._scene.add(object)
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
      },
      (error) => {
        console.log(error)
      });

  }

}

let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new Escena1();

});


