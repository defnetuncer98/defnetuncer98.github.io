import * as THREE from './build/three.module.js';
import { GLTFLoader } from './src/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from './src/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './src/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from './src/jsm/postprocessing/UnrealBloomPass.js';
import { AnaglyphEffect } from './src/jsm/effects/AnaglyphEffect.js';
import { RGBELoader } from './src/jsm/loaders/RGBELoader.js';
import { ShaderPass } from './src/jsm/postprocessing/ShaderPass.js';

var MODELS = [
    {
        name: "Table",
        path: "./src/models/table/scene.gltf",
        position: { x: 0, y: -2.4, z:  0},
        rotation: { x: 0, y: 0, z: 0 },
        scale: 3,
    },
    {
        name: "Workspace",
        path: "./src/models/workspace.glb",
        position: { x: 0.2, y: 0, z: 0.4 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: 0.01,
    },
    {
        name: "Fighter",
        path: "./src/models/fighter.glb",
        position: { x: -1.2, y: 0.3, z: 0.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: 0.1,
    },    
    {
        name: "Coffee",
        path: "./src/models/coffee/scene.gltf",
        position: { x: 1.55, y: 0.25, z: 0.2},
        rotation: { x: 0, y: 0, z: 0 },
        scale: 0.016,
    },      
    // {
    //     name: "Hologram",
    //     path: "./src/models/hologram/scene.gltf",
    //     position: { x: 0.0, y: 1.3, z: 0.2},
    //     rotation: { x: 0, y: 0, z: 0 },
    //     scale: 0.002,
    // },          
]

var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var meshes = [];

var BLOOM_SCENE = 1;
var bloomLayer = new THREE.Layers();
bloomLayer.set(BLOOM_SCENE);

function onDocumentMouseClick( event ) {
       event.preventDefault();
       mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
       mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
       raycaster.setFromCamera( mouse, camera );
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


var materials = {};
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
var navgroup = new THREE.Group();
var rectangle;


Ammo().then(function (AmmoLib) {
    Ammo = AmmoLib;
    init();
    animate();
});

function init() {
    initScene();
    initRenderer();
    loadModels();
    loadAudioText();
    loadMeshes();
    loadTexts();
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
        //playertext.layers.enable(BLOOM_SCENE);
        playertext.position.copy(new THREE.Vector3(-1.5, 0.5, 0.5));
        playertext.visible=false;
        scene.add( playertext );
        meshes.push(playertext);
    });    
}

var home, pen, mail;

function loadTexts(){
    var xMid, text, message, shapes, geometry;
    var loader = new THREE.FontLoader();
    loader.load( './src/fonts/player.json', function ( font ) {
        var y = 0.35;
        var z = 0.5;
        message = "B";
        shapes = font.generateShapes( message, 0.1 );
        geometry = new THREE.ShapeBufferGeometry( shapes );
        geometry.computeBoundingBox();
        xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
        geometry.translate( xMid, 0, 0 );
        text = new THREE.Mesh( geometry, matLite );
        text.position.copy(new THREE.Vector3(-1.4, y, z));
        text.name="next";
        //text.layers.enable(BLOOM_SCENE);
        meshes.push(text);
        playergroup.add( text );

        message = "C";
        shapes = font.generateShapes( message, 0.1 );
        geometry = new THREE.ShapeBufferGeometry( shapes );
        geometry.computeBoundingBox();
        xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
        geometry.translate( xMid, 0, 0 );
        text = new THREE.Mesh( geometry, matLite );
        text.position.copy(new THREE.Vector3(-1.5, y, z));
        text.name="play";
        //text.layers.enable(BLOOM_SCENE);
        meshes.push(text);
        playergroup.add( text );

        message = "A";
        shapes = font.generateShapes( message, 0.1 );
        geometry = new THREE.ShapeBufferGeometry( shapes );
        geometry.computeBoundingBox();
        xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
        geometry.translate( xMid, 0, 0 );
        text = new THREE.Mesh( geometry, matLite );
        text.position.copy(new THREE.Vector3(-1.6, y, z));
        text.name="prev";
        //text.layers.enable(BLOOM_SCENE);
        playergroup.add( text );
        playergroup.visible=false;
        meshes.push(text);
        scene.add(playergroup);


        message = "I";
        shapes = font.generateShapes( message, 0.25 );
        geometry = new THREE.ShapeBufferGeometry( shapes );
        geometry.computeBoundingBox();
        xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
        geometry.translate( xMid, 0, 0 );
        rectangle = new THREE.Mesh( geometry, matLite );
        rectangle.material.opacity = 1.0;
        rectangle.position.copy(new THREE.Vector3(navigator.position.x, navigator.position.y + 0.1, navigator.position.z+0.4));
        meshes.push(rectangle);
        scene.add(rectangle);
    });

    loader.load( './src/fonts/icons.json', function ( font ) {
        message = "h"
        shapes = font.generateShapes( message, 0.1 );
        geometry = new THREE.ShapeBufferGeometry( shapes );
        geometry.computeBoundingBox();
        xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
        geometry.translate( xMid, 0, 0 );
        home = new THREE.Mesh( geometry, matLite );
        home.name="home";
        home.material.opacity = 1.0;
        home.position.copy(new THREE.Vector3(navigator.position.x, navigator.position.y + 0.15, navigator.position.z+0.20));
        meshes.push(home);
        navgroup.add(home);

        message = "e"
        shapes = font.generateShapes( message, 0.1 );
        geometry = new THREE.ShapeBufferGeometry( shapes );
        geometry.computeBoundingBox();
        xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
        geometry.translate( xMid, 0, 0 );
        pen = new THREE.Mesh( geometry, matLite );
        pen.name="pen";
        pen.material.opacity = 1.0;
        pen.position.copy(new THREE.Vector3(navigator.position.x, navigator.position.y - 0.05, navigator.position.z+0.04));
        meshes.push(pen);
        navgroup.add(pen);

        message = "m"
        shapes = font.generateShapes( message, 0.1 );
        geometry = new THREE.ShapeBufferGeometry( shapes );
        geometry.computeBoundingBox();
        xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
        geometry.translate( xMid, 0, 0 );
        mail = new THREE.Mesh( geometry, matLite );
        mail.name="mail";
        mail.material.opacity = 1.0;
        mail.position.copy(new THREE.Vector3(navigator.position.x, navigator.position.y - 0.25, navigator.position.z+0.04));
        meshes.push(mail);
        navgroup.add(mail);

        scene.add(navgroup);
        
        // everything is loaded
        meshes.forEach(function (obj){
            materials[obj.uuid] = obj.material;
        });  
    });
}
var navigator, active;

function loadMeshes(){
    phonescreen = new THREE.Mesh( new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial( { color: new THREE.Color(0,0,0) } ) );
    phonescreen.name = "phonescreen";
    phonescreen.scale.x = 0.4;
    phonescreen.scale.y = 0.18;
    phonescreen.position.set(-1.55, 0.035, 0.36);
    phonescreen.rotation.x = -Math.PI/2;
    phonescreen.rotation.z = -Math.PI/3 + 0.08;
    phonescreen.layers.enable(BLOOM_SCENE);
    meshes.push(phonescreen);
    navgroup.add(phonescreen);

    screen = new THREE.Mesh( new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial( { color: new THREE.Color(1,1,1) } ) );
    //screen.layers.enable(BLOOM_SCENE);                                 
    screen.name = "screen";
    screen.scale.x = 2.3;
    screen.scale.y = 1.2;
    screen.position.set( 0, 1.37, -0.45 );
    scene.add(screen);
    meshes.push(screen);

    var posx = -1.4;
    var posy = 1.5;
    var posz = -0.5;
    var scx = 0.2;
    var scy = 0.6;
    var scz = 0.02;
    navigator = new THREE.Mesh( new THREE.BoxBufferGeometry(),
        new THREE.MeshStandardMaterial( {
                color: new THREE.Color(0.02,0.02,0.02), 
                roughness:1.0,
                metalness:0.0,
    } ) );

    navigator.scale.set(scx, scy, scz);
    navigator.position.set(posx, posy, posz);
    scene.add(navigator);
    meshes.push(navigator);

    active = new THREE.Mesh( new THREE.BoxBufferGeometry(),
        new THREE.MeshNormalMaterial( {    } ) );

    active.scale.set(scx, scx, scz);
    active.position.set(posx, posy + scy/2 - scx/2, posz+scz+0.15 );
    scene.add(active);
    meshes.push(active);
}

var camera;
var renderer;
var scene;
var clock;
var bloomComposer;
var finalComposer;
var mouseX;
var mouseY;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var clicked = false;
//document.getElementById('container').style.cursor = 'none';

var effect;
var screen;
var phonescreen;

/**
 * Initialize ThreeJS THREE.Scene
 */
function initScene() {
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 0, 1, 4 );
    camera.lookAt(0,0.5,0);
    clock = new THREE.Clock();
    scene = new THREE.Scene();

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
    bloomComposer.setSize(
        window.innerWidth * window.devicePixelRatio,
        window.innerHeight * window.devicePixelRatio
      );
    finalComposer.setSize(
        window.innerWidth * window.devicePixelRatio,
        window.innerHeight * window.devicePixelRatio
      );           
}

var envMap;
function initRenderer() {
    var canvas = document.createElement( 'canvas' );
    var context = canvas.getContext( 'webgl2', { alpha: false } );
    var container = document.getElementById('container');
    renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context, antialias:true } );
    //renderer = new THREE.WebGLRenderer( { antialias:true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    //renderer.gammaOutput = true;
    //renderer.gammaFactor = 2.2;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
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
        envMap = pmremGenerator.fromEquirectangular( texture ).texture;
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
    bloomComposer = new EffectComposer( renderer );
    bloomComposer.renderToScreen = false;
    bloomComposer.setSize(
        window.innerWidth * window.devicePixelRatio,
        window.innerHeight * window.devicePixelRatio
      );
    bloomComposer.addPass( renderScene );
    bloomComposer.addPass( bloomPass );
    var finalPass = new ShaderPass(
        new THREE.ShaderMaterial({
          uniforms: {
            baseTexture: { value: null },
            bloomTexture: { value: bloomComposer.renderTarget2.texture }
          },
          vertexShader: document.getElementById("vertexshader").textContent,
          fragmentShader: document.getElementById("fragmentshader").textContent,
          defines: {}
        }),
        "baseTexture"
    );
    finalPass.needsSwap = true;
    finalComposer = new EffectComposer(renderer);
    finalComposer.setSize(
    window.innerWidth * window.devicePixelRatio,
    window.innerHeight * window.devicePixelRatio
    );
    finalComposer.addPass(renderScene);
    finalComposer.addPass(finalPass);


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

var hologrammixer;

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
                        roughness:0.0,
                        metalness:0.0,
                    } );
                    object.material = material;
                }
                else if(model.name=="Fighter") {
                    var material = new THREE.MeshStandardMaterial( {
                        color: new THREE.Color(0,0,0),
                    } );
                    object.material = material;
                }
                else if(model.name=="Workspace") {
                    var material = new THREE.MeshStandardMaterial( {
                        map:object.material.map,
                        envMap:envMap,
                        roughness:0.0,
                        metalness:0.0,
                        flatShading: true,
                    } );
                    object.material = material;
                }
                else if(object.name=="Hologram") {
                    object.layers.enable('BLOOM_SCENE');
                }
                meshes.push(object);
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
        if(model.name=="Hologram") {
            var mixer = new THREE.AnimationMixer( gltf.scene );
            console.log(gltf);
            var action = mixer.clipAction(gltf.animations[0]);
            action.play();
            hologrammixer = mixer;
            hologram=gltf;
            hologram.scene.visible=false;
        }
        gltf.scene.name = model.name;
        scene.add(gltf.scene);
    });
}

var hologram;
var count = 300;
/**
 * Render loop. Renders the next frame of all animations
 */
function animate() {
    // Get the time elapsed since the last frame
    var delta = clock.getDelta();
    requestAnimationFrame( animate );

    camera.position.x = ( mouseX ) * .0001;
    camera.position.y = 1 + ( - mouseY ) * .0001;
    camera.lookAt(0,0.5,0);
    // if(count) {
    //     hologrammixer.update(delta);
    //     count-=1;
    //     if(count==0){
    //         screen.material.color = new THREE.Color(1,1,1);
    //         clicked=true;
    //     }
    // }

    if(clicked){
        renderBloom();
        finalComposer.render();
    }
    else {
        renderer.render(scene,camera);
    }
}

function renderBloom() {
    meshes.forEach(darkenNonBloomed);
    bloomComposer.render();
    meshes.forEach(restoreMaterial);
}

var darkMaterial = new THREE.MeshBasicMaterial( { color: "black" } );

function darkenNonBloomed(obj) { // non-bloomed stuff must be black, including scene background
    if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
        obj.material = darkMaterial;
        scene.background=new THREE.Color(0,0,0);
    }
}

function restoreMaterial(obj) {
    if (materials[obj.uuid]) {
        obj.material = materials[obj.uuid];
        scene.background=envMap;
        scene.environment=envMap;
    }
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
    var intersects = raycaster.intersectObjects( navgroup.children );
    if ( intersects.length > 0 ) {
            var object = intersects[ 0 ].object;
            if(object.name=="phonescreen"){
                if(!clicked){
                    meshes.forEach(function (obj){
                        materials[obj.uuid] = obj.material;
                    });  
                    clicked=true;
                }
                object.material.color=new THREE.Color(1,1,1),
                playergroup.visible=true;
                playertext.visible=true;
            }
            else{
                phonescreen.material.color=new THREE.Color(0,0,0);
                playergroup.visible=false;
                playertext.visible=false;
                if(object.name=="home"){
                    active.position.y = navigator.position.y + 0.2 ;
                    home.position.z = navigator.position.z+0.20;
                    pen.position.z = navigator.position.z+0.04;
                    mail.position.z = navigator.position.z+0.04;
                    rectangle.position.y =  navigator.position.y + 0.1;

                }
                else if(object.name=="pen"){
                    active.position.y = navigator.position.y + 0.2 - 0.2;
                    home.position.z = navigator.position.z+0.04;
                    pen.position.z = navigator.position.z+0.20;
                    mail.position.z = navigator.position.z+0.04;                    
                    rectangle.position.y =  navigator.position.y - 0.1;                    
                }
                else if(object.name=="mail"){
                    active.position.y = navigator.position.y + 0.2 - 0.4;
                    home.position.z = navigator.position.z+0.04;
                    pen.position.z = navigator.position.z+0.04;
                    mail.position.z = navigator.position.z+0.20;
                    rectangle.position.y =  navigator.position.y - 0.3;
                }
            }
    }
}