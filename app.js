import * as THREE from './build/three.module.js';
import { GLTFLoader } from './src/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from './src/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './src/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from './src/jsm/postprocessing/UnrealBloomPass.js';
import { RectAreaLightUniformsLib } from './src/jsm/lights/RectAreaLightUniformsLib.js';
import { AnaglyphEffect } from './src/jsm/effects/AnaglyphEffect.js';


var MODELS = [
    {
        name: "Table",
        path: "./src/models/table/scene.gltf",
        position: { x: 50, y: -2.48, z: 2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: 0.0033,
    },
    {
        name: "Workspace",
        path: "./src/models/workspace.glb",
        position: { x: 0.2, y: 0, z: 1.3 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: 0.01,
    },
]

var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();

function onDocumentMouseClick( event ) {
       event.preventDefault();
       mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
       mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
       raycaster.setFromCamera( mouse, camera );
       var intersects = raycaster.intersectObjects( scene.children );
       if ( intersects.length > 0 ) {
               var object = intersects[ 0 ].object;
               console.log(object);
               if(object.name=="screen"){
                   clicked=true;
                   object.material.color = new THREE.Color(1,1,1);
               }
       }
}

Ammo().then(function (AmmoLib) {
    Ammo = AmmoLib;
    init();
    animate();
});

function init() {
    initScene();
    initRenderer();
    loadModels();
}

var camera;
var renderer;
var scene;
var clock;
var composer;
var mouseX;
var mouseY;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var clicked = false;
//document.getElementById('container').style.cursor = 'none';
var rectLight;

var effect;
/**
 * Initialize ThreeJS THREE.Scene
 */
function initScene() {
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 0, 1, 4 );
    camera.lookAt(0,0.5,0);
    clock = new THREE.Clock();
    scene = new THREE.Scene();
  
    scene.background = new THREE.Color( 0x000000 );
 
    //scene.fog = new THREE.Fog( scene.background, 1, 5000 );

    RectAreaLightUniformsLib.init();
    rectLight = new THREE.RectAreaLight( 0xffffff, 0.1, 2.3, 1.2);
    rectLight.position.set( 0, 1.37, 0.5 );
    rectLight.lookAt(0, 1.37, 4);

    var screen = new THREE.Mesh( new THREE.PlaneBufferGeometry(),
                                 new THREE.MeshBasicMaterial( { color: new THREE.Color(0,0,0) } ) );
    screen.name = "screen";
    screen.scale.x = rectLight.width;
    screen.scale.y = rectLight.height;
    screen.position.copy(rectLight.position);
    scene.add(screen);

    RectAreaLightUniformsLib.init();
    var rectLight2 = new THREE.RectAreaLight( 0xffffff, 0.1, 2.3, 1.2);
    rectLight2.position.copy(rectLight.position);
    rectLight2.lookAt(0, 1.37, 0);
    rectLight.add(rectLight2);

    var pointLight1 = new THREE.PointLight(0x00ffff, 0.5);
    pointLight1.castShadow=true;
    pointLight1.position.set(-10,0,0);
    scene.add(pointLight1);

    var pointLight1 = new THREE.PointLight(0xff00ff, 0.5);
    pointLight1.position.set(10,0,0);
    pointLight1.castShadow=true;
    scene.add(pointLight1);

    window.addEventListener( 'resize', onWindowResize, false );
    window.addEventListener( 'click', onDocumentMouseClick, false );
    window.addEventListener( 'mousemove', onDocumentMouseMove, false );

    // var axesHelper = new THREE.AxesHelper( 5 );
    // scene.add( axesHelper );
    // var size = 10;
    // var divisions = 10;
    
    // var gridHelper = new THREE.GridHelper( size, divisions );
    // scene.add( gridHelper );
}

/**
 * A callback that will be called whenever the browser window is resized.
 */
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    composer.setSize( window.innerWidth, window.innerHeight );        
}


function initRenderer() {
    var canvas = document.createElement( 'canvas' );
    var context = canvas.getContext( 'webgl2', { alpha: false } );
    
    renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context, antialias:true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    var renderScene = new RenderPass( scene, camera );
    var bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );    
    bloomPass.radius = 0;
    bloomPass.threshold = 0.3;
    bloomPass.strength = 1;
    composer = new EffectComposer( renderer );
    composer.addPass( renderScene );
    composer.addPass( bloomPass );

    effect = new AnaglyphEffect( renderer );
    effect.setSize( window.innerWidth, window.innerHeight );
                
    //renderer.physicallyCorrectLights=true;
    container.appendChild( renderer.domElement );
}

/**
 * Function that starts loading process for the next model in the queue. The loading process is
 * asynchronous: it happens "in the background". Therefore we don't load all the models at once. We load one,
 * wait until it is done, then load the next one. When all models are loaded, we call loadUnits().
 */
function loadModels() {
    for (var i = 0; i < MODELS.length; ++i) {
        var m = MODELS[i];
        loadGLTFModel(m);
    }
}

function loadGLTFModel(model) {
    var loader = new GLTFLoader();
    loader.load(model.path, function (gltf) {
        gltf.scene.traverse(function (object) {
            if (object.isMesh) {
                object.castShadow = true;
                object.receiveShadow = true;
                if(model.name=="Table") {
                    var loader = new THREE.TextureLoader();
                    var scratches = loader.load('./src/textures/scratches.jpg');
                    var material = new THREE.MeshStandardMaterial( {
                        color:new THREE.Color(0.1,0.1,0.1),
                        roughness:0.4,
                        metalness:1.0,
                    } );
                    object.material = material;
                }
                //object.material.emissiveIntensity = 5;
            }
        });
        if (model.position) {
            gltf.scene.position.copy(new THREE.Vector3(model.position.x, model.position.y, model.position.z));
        }
        if (model.scale) {
            gltf.scene.scale.copy(new THREE.Vector3(model.scale, model.scale, model.scale));
        }
        if (model.rotation) {
            gltf.scene.rotation.copy(new THREE.Euler(model.rotation.x, model.rotation.y, model.rotation.z));
        }
        gltf.scene.name = model.name;
        scene.add(gltf.scene);
    });
}

/**
 * Render loop. Renders the next frame of all animations
 */
function animate() {
    // Get the time elapsed since the last frame
    var delta = clock.getDelta();
    requestAnimationFrame( animate );

    camera.position.x = ( mouseX ) * .0001;
    camera.position.y = 1 + ( - mouseY ) * .0001;

    if(clicked) composer.render();
    else composer.render( scene, camera );
}

function onDocumentMouseMove( event ) {

    mouseX = ( event.clientX - windowHalfX ) * 10;
    mouseY = ( event.clientY - windowHalfY ) * 10;

}