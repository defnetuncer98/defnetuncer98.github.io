import * as THREE from './build/three.module.js';
import { GLTFLoader } from './src/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from './src/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './src/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from './src/jsm/postprocessing/UnrealBloomPass.js';
import { RectAreaLightUniformsLib } from './src/jsm/lights/RectAreaLightUniformsLib.js';
import { AnaglyphEffect } from './src/jsm/effects/AnaglyphEffect.js';
import { RGBELoader } from './src/jsm/loaders/RGBELoader.js';

var MODELS = [
    {
        name: "Table",
        path: "./src/models/table/scene.gltf",
        position: { x: 0, y: -2.6, z:  0},
        rotation: { x: 0, y: 0, z: 0 },
        scale: 3,
    },
    {
        name: "Workspace",
        path: "./src/models/workspace.glb",
        position: { x: 0.2, y: 0, z: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: 0.01,
    },
    {
        name: "Fighter",
        path: "./src/models/fighter.glb",
        position: { x: -1.2, y: 0.3, z: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: 0.1,
    },    
    {
        name: "Coffee",
        path: "./src/models/coffee/scene.gltf",
        position: { x: 1.55, y: 0.18, z: 0.6},
        rotation: { x: 0, y: 0, z: 0 },
        scale: 0.016,
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
               if(object.name=="screen"){
                   object.material.color = new THREE.Color(1,1,1);
               }
       }
       var intersects = raycaster.intersectObjects( playergroup.children );
       if ( intersects.length > 0 ) {
               var object = intersects[ 0 ].object;
               if(object.name=="play"){
                   isplaying=!isplaying;
                   if(isplaying) player.play();
                   else player.pause();
               }
               else if(object.name=="next"){
                   current+=1;
                   if(current==playlist.length) current=0;
                   scene.remove(playertext);
                   player.src='./src/sounds/'+playlist[current]+'.mp3';
                   player.load();
                   player.play();
                   loadAudioText();
                   playertext.visible=true;
               }
               else if(object.name=="prev"){
                   current-=1;
                   scene.remove(playertext);
                   if(current==-1) current=playlist.length-1;
                   player.src='./src/sounds/'+playlist[current]+'.mp3';
                   player.load();
                   player.play();
                   loadAudioText();
                   playertext.visible=true;
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
    loadTexts();
    loadAudioText();
}

function loadAudioText(){
    var loader = new THREE.FontLoader();
    loader.load( './src/fonts/Roboto_Regular.json', function ( font ) {
        var xMid, text;
        var message = playlist[current];
        var shapes = font.generateShapes( message, 0.03 );
        var geometry = new THREE.ShapeBufferGeometry( shapes );
        geometry.computeBoundingBox();
        xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
        geometry.translate( xMid, 0, 0 );
        playertext = new THREE.Mesh( geometry, matLite );
        playertext.position.copy(new THREE.Vector3(-1.6, 0.35, 1.0));
        scene.add( playertext );
        playertext.visible=false;
    });    
}

var matDark = new THREE.LineBasicMaterial( {
    color: 0xffffff,
    side: THREE.DoubleSide
} );

var matLite = new THREE.MeshBasicMaterial( {
    color: 0xffffff,
    transparent: true,
    opacity: 0.4,
    side: THREE.DoubleSide
} );
var playertext;
var playergroup = new THREE.Group();

function loadTexts(){
    var loader = new THREE.FontLoader();
    loader.load( './src/fonts/player.json', function ( font ) {
        var xMid, text;
        var message = "B";
        var shapes = font.generateShapes( message, 0.1 );
        var geometry = new THREE.ShapeBufferGeometry( shapes );
        geometry.computeBoundingBox();
        xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
        geometry.translate( xMid, 0, 0 );
        text = new THREE.Mesh( geometry, matLite );
        text.position.copy(new THREE.Vector3(-1.6, 0.2, 1.0));
        text.name="next";
        playergroup.add( text );

        var message = "C";
        var shapes = font.generateShapes( message, 0.1 );
        var geometry = new THREE.ShapeBufferGeometry( shapes );
        geometry.computeBoundingBox();
        xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
        geometry.translate( xMid, 0, 0 );
        text = new THREE.Mesh( geometry, matLite );
        text.position.copy(new THREE.Vector3(-1.7, 0.2, 1.0));
        text.name="play";
        playergroup.add( text );

        var message = "A";
        var shapes = font.generateShapes( message, 0.1 );
        var geometry = new THREE.ShapeBufferGeometry( shapes );
        geometry.computeBoundingBox();
        xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
        geometry.translate( xMid, 0, 0 );
        text = new THREE.Mesh( geometry, matLite );
        text.position.copy(new THREE.Vector3(-1.8, 0.2, 1.0));
        text.name="prev";
        playergroup.add( text );
        scene.add(playergroup);
        playergroup.visible=false;
    });
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
  
    RectAreaLightUniformsLib.init();
    rectLight = new THREE.RectAreaLight( 0xffffff, 0.1, 0.4, 0.18);
    rectLight.position.set( -1.55, 0.035, 1.26-0.3 );
    rectLight.rotation.x = -Math.PI/2;
    rectLight.rotation.z = -Math.PI/3 + 0.08;
    rectLight.lookAt(-1.4, 4, 1.4);

    var phonescreen = new THREE.Mesh( new THREE.PlaneBufferGeometry(),
                                 new THREE.MeshBasicMaterial( { color: new THREE.Color(1,1,1) } ) );
    phonescreen.name = "phonescreen";
    phonescreen.scale.x = rectLight.width;
    phonescreen.scale.y = rectLight.height;
    phonescreen.position.copy(rectLight.position);
    phonescreen.rotation.x = -Math.PI/2;
    phonescreen.rotation.z = -Math.PI/3 + 0.08;    
    scene.add(phonescreen);

    RectAreaLightUniformsLib.init();
    rectLight = new THREE.RectAreaLight( 0xffffff, 0.1, 2.3, 1.2);
    rectLight.position.set( 0, 1.37, 0.2 );
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

    window.addEventListener( 'resize', onWindowResize, false );
    window.addEventListener( 'click', onDocumentMouseClick, false );
    window.addEventListener( 'mousemove', onDocumentMouseMove, false );

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
    //var canvas = document.createElement( 'canvas' );
    //var context = canvas.getContext( 'webgl2', { alp;ha: false } );
    var container = document.getElementById('container');
    //renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context, antialias:true } );
    renderer = new THREE.WebGLRenderer( { antialias:true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    //renderer.gammaOutput = true;
    //renderer.gammaFactor = 2.2;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    //renderer.toneMapping = THREE.LinearToneMapping;
    renderer.toneMappingExposure = 0.8;    
    renderer.outputEncoding = THREE.sRGBEncoding;
    //renderer.shadowMap.enabled = true;
    //renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    var pmremGenerator = new THREE.PMREMGenerator( renderer );
    pmremGenerator.compileEquirectangularShader();

    new RGBELoader()
    .setDataType( THREE.UnsignedByteType )
    .setPath( './src/images/' )
    .load( 'glass_passage_2k.hdr', function ( texture ) {
        var envMap = pmremGenerator.fromEquirectangular( texture ).texture;
        scene.background = envMap;
        scene.environment = envMap;
        texture.dispose();
        pmremGenerator.dispose();
    } );


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
                    var material = new THREE.MeshStandardMaterial( {
                        map:object.material.map,
                    } );
                    object.material = material;
                }
                else if(model.name=="Fighter") {
                    var material = new THREE.MeshStandardMaterial( {
                        color: 0x000000,
                    } );
                    object.material = material;
                }
                else if(object.name=="Workspace") {
                    object.material.flatShading=false;
                }
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

    renderer.render( scene, camera );
}

var isplaying=true;
var player = document.getElementById('player');
var playlist = ['St Francis - Josh Lippi & The Overtimers',
                'Fresno Alley - Josh Lippi & The Overtimers']
var current = 0;

function onDocumentMouseMove( event ) {
    mouseX = ( event.clientX - windowHalfX ) * 10;
    mouseY = ( event.clientY - windowHalfY ) * 10;
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( scene.children );
    if ( intersects.length > 0 ) {
            var object = intersects[ 0 ].object;
            if(object.name=="phonescreen"){
                playergroup.visible=true;
                playertext.visible=true;
            }
            else{
                playergroup.visible=false;
                playertext.visible=false;
            }
    }
}