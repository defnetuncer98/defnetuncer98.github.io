import * as THREE from './src/js/libs/three.module.js';
import { GLTFLoader } from './src/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from './src/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './src/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from './src/jsm/postprocessing/UnrealBloomPass.js';


var MODELS = [
    {
        name: "Table",
        path: "./src/models/table/scene.gltf",
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: 1,
    },
]

Ammo().then(function (AmmoLib) {
    Ammo = AmmoLib;
    starttime = new Date();
    init();
    animate();
});

function init() {
    initScene();
    initRenderer();
    loadModels();
}

/**
 * Initialize ThreeJS THREE.Scene
 */
function initScene() {
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 0, 100, 0 );
    camera.lookAt(0,0,0);
    clock = new THREE.Clock();
    scene = new THREE.Scene();
  
    scene.background = new THREE.Color( 0x000000 );
    
    var hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444, 1 );
    hemiLight.position.set( 0, 2.0, 0 );
    scene.add( hemiLight );
    
    var dirLight = new THREE.DirectionalLight( 0xffffff );
    dirLight.position.set( 0, 4.0, -5 );
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 2;
    dirLight.shadow.camera.bottom = - 2;
    dirLight.shadow.camera.left = - 2;
    dirLight.shadow.camera.right = 2;
    //dirLight.shadow.camera.near = 0.1;
    //dirLight.shadow.camera.far = 40;
    scene.add( dirLight );

    const light = new THREE.PointLight(0xFFFFFF, 10, 4, 2);
    light.castShadow = true;
    light.position.set(0, 3, 0);
    light.shadow.camera.top = 2;
    light.shadow.camera.bottom = - 2;
    light.shadow.camera.left = - 2;
    light.shadow.camera.right = 2;
    light.shadow.camera.zoom = 1;
    //light.shadow.camera.near = 0.1;
    //light.shadow.camera.far = 40;        
    scene.add(light);

    function updateCamera(){light.shadow.camera.updateProjectionMatrix();}
    window.addEventListener( 'resize', onWindowResize, false );
    //window.addEventListener( 'click', onDocumentMouseClick, false );
}

/**
 * A callback that will be called whenever the browser window is resized.
 */
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    composer.setSize( window.innerWidth, window.innerHeight );        
    controls.handleResize();
}


function initRenderer() {
    var canvas = document.createElement( 'canvas' );
    var context = canvas.getContext( 'webgl2', { alpha: false } );
    
    renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    var renderScene = new RenderPass( scene, camera );
    bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );    
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = 0;
    composer = new EffectComposer( renderer );
    composer.addPass( renderScene );
    composer.addPass( bloomPass );
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
    renderer.render( scene, camera );
    //composer.render();
}