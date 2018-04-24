import * as THREE from 'three';
var OrbitControls = require('three-orbit-controls')(THREE);

import fragment from './fragment.glsl';
import vertex from './vertex.glsl';


var camera, controls, scene, renderer, mesh, geometry, dots, plane, material;
let destination = {x: 0, y: 0};
let textures = [];

function init() {
  scene = new THREE.Scene();
  scene.destination = {x:0,y:0};

  renderer = new THREE.WebGLRenderer();

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerWidth);

  var container = document.getElementById('container');
  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.001, 100
  );
  camera.position.set(0, 0, 1);

  controls = new OrbitControls(camera, renderer.domElement);

  material = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: {
      time: {type: 'f', value: 0}
    },
    vertexShader: vertex,
    fragmentShader: fragment,
  });

  function CustomSinCurve( scale ) {

    THREE.Curve.call( this );
  
    this.scale = ( scale === undefined ) ? 1 : scale;
  
  }
  
  CustomSinCurve.prototype = Object.create( THREE.Curve.prototype );
  CustomSinCurve.prototype.constructor = CustomSinCurve;
  
  CustomSinCurve.prototype.getPoint = function( t ) {

    t = (Math.PI * 2) * t;
    var s = Math.sin(t);
    var c = Math.cos(t);
    var r = 2 + 6 * c;
    var ty = 1 + (-r * c) * 0.205 - 0.25;
    var tx = (-r * s) * 0.205;
    var tz = s * 0.65;

    return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);

  };
  
  let path = new CustomSinCurve( 10 );
  geometry = new THREE.TubeGeometry( path, 100, 2, 100, true );

  plane = new THREE.Mesh(geometry, material);

  scene.add(plane);

  resize();
}

window.addEventListener('resize', resize); 

function resize() {
  var w = window.innerWidth;
  var h = window.innerHeight;
  renderer.setSize( w, h );
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

function render() {
  renderer.render(scene, camera);
}

let time = 0;
function animate() {
  time = time+0.05;
  material.uniforms.time.value = time;

  plane.rotation.y = time / 50;
  
  requestAnimationFrame(animate);
  render();
}


init();
animate();
