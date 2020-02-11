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
    // {
    //     name: "Flower",
    //     path: "./src/models/flower.glb",
    //     position: { x: 0.8, y: 1.8, z: 0.2},
    //     rotation: { x: Math.PI/2, y: 0, z: 0 },
    //     scale: 0.15,
    // },   
    {
        name: "Coffee",
        path: "./src/models/coffee/scene.gltf",
        position: { x: 1.55, y: 0.25, z: 0.2},
        rotation: { x: 0, y: 0, z: 0 },
        scale: 0.016,
    },           
    // {
    //     name: "Hologram",
    //     path: "./src/models/ornithoptera_cassandra/scene.gltf",
    //     position: { x: 0.0, y: 1.3, z: 0.2},
    //     rotation: { x: Math.PI/2, y: 0, z: 0 },
    //     scale: 0.1,
    // },          
]
var hologram;
var hologrammixer;

var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var meshes = [];

var BLOOM_SCENE = 1;
var bloomLayer = new THREE.Layers();
bloomLayer.set(BLOOM_SCENE);

var home, pen, mail;
var homepagegroup = new THREE.Group();
var penpages = [new THREE.Group(),new THREE.Group(),new THREE.Group(),new THREE.Group()];
var penpagegroup = new THREE.Group();
var currentpenpage = 0;
var mailpagegroup = new THREE.Group();

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
       if(nowactive=="pen"){
            var intersects = raycaster.intersectObjects( penpagegroup.children );
            if ( intersects.length > 0 ) {
                var object = intersects[ 0 ].object;
                if(object.name=="nextpenpage"){
                    penpages[currentpenpage].visible=false;
                    currentpenpage+=1;
                    if(currentpenpage==4) {
                        currentpenpage = 3;
                        nextmesh.material.color=new THREE.Color(0.8, 0.8, 0.8);
                    }
                    if(currentpenpage==1) {
                        prevmesh.material.color=new THREE.Color(0.02,0.02, 0.02);                    
                    }
                    penpages[currentpenpage].visible=true;
                    video.src = "./src/videos/cat.mp4";
                    video.load(); // must call after setting/changing source
                    video.play();
                }
                else if(object.name=="prevpenpage"){
                    penpages[currentpenpage].visible=false;
                    currentpenpage-=1;
                    if(currentpenpage==-1) {
                        currentpenpage=0;
                        prevmesh.material.color=new THREE.Color(0.8, 0.8, 0.8);
                    }
                    if(currentpenpage==2) {
                        nextmesh.material.color=new THREE.Color(0.02, 0.02, 0.02);
                    }              
                    penpages[currentpenpage].visible=true;
                    video.src = "./src/videos/cat.mp4";
                    video.load(); // must call after setting/changing source
                    video.play();
                }
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

var matDark = new THREE.MeshBasicMaterial( {
    color: 0x000000,
    transparent: true,
    opacity: 0.4,
    side: THREE.DoubleSide
} );

var playertext;
var playergroup = new THREE.Group();
var navgroup = new THREE.Group();
var whiterectangle;


Ammo().then(function (AmmoLib) {
    Ammo = AmmoLib;
    init();
    animate();
});

function init() {
    initScene();
    initRenderer();
    loadVideos();
    loadModels();
    loadAudioText();
    loadMeshes();
    loadTexts();
}

var video, videoImage, videoImageContext, videoTexture;

function loadVideos(){
	video = document.createElement( 'video' );
    video.src = "./src/videos/cat.mp4";
    video.loop = true;
	video.load(); // must call after setting/changing source
    video.play();
    videoImage = document.createElement( 'canvas' );
	videoImage.width = 1920;
	videoImage.height = 1080;

	videoImageContext = videoImage.getContext( '2d' );
	videoImageContext.fillStyle = '#000000';
	videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

	videoTexture = new THREE.Texture( videoImage );
	videoTexture.minFilter = THREE.LinearFilter;
	videoTexture.magFilter = THREE.LinearFilter;
	
	var movieMaterial = new THREE.MeshStandardMaterial( { map: videoTexture, overdraw: true, metalness:0.1, roughness:0.0, emissive:0xffffff, emissiveIntensity:0.05 } );
	var movieGeometry = new THREE.PlaneGeometry( 2.3, 1.2, 4, 4 );
	var movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
    movieScreen.position.set(0.0, 1.37, -0.4);
    meshes.push(movieScreen);
    penpagegroup.add(movieScreen);

}

function loadAudioText(){
    var loader = new THREE.FontLoader();
    loader.load( './src/fonts/Roboto_Regular.json', function ( font ) {
        playertext = createText(font, playlist[current], -1.5, 0.5, 0.5, "", 0.03);
        //playertext.layers.enable(BLOOM_SCENE);
        playertext.visible=false;
        scene.add( playertext );
        meshes.push(playertext);
        materials[playertext.uuid] = playertext.material;
    });    
}

function createText(font, message, x, y, z, name="", size=0.1, mat=matLite){
    var shapes = font.generateShapes( message, size );
    var geometry = new THREE.ShapeBufferGeometry( shapes );
    geometry.computeBoundingBox();
    var xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
    geometry.translate( xMid, 0, 0 );
    var text = new THREE.Mesh( geometry, mat );
    text.position.copy(new THREE.Vector3(x, y, z));
    text.name=name;
    return text;
}

function loadTexts(){
    var loader = new THREE.FontLoader();
    var x = navigatormesh.position.x;
    var y = navigatormesh.position.y;
    var z = navigatormesh.position.z;
    loader.load( './src/fonts/player.json', function ( font ) {
        var y = 0.35;
        var z = 0.5;
        var text;
        text = createText(font, "B", -1.4, y, z, name="next");
        //text.layers.enable(BLOOM_SCENE);
        meshes.push(text);
        playergroup.add( text );
        materials[text.uuid] = text.material;

        text = createText(font, "C", -1.5, y, z, name="play");
        //text.layers.enable(BLOOM_SCENE);
        meshes.push(text);
        playergroup.add( text );
        materials[text.uuid] = text.material;

        text = createText(font, "A", -1.6, y, z, name="prev");
        //text.layers.enable(BLOOM_SCENE);
        playergroup.add( text );
        playergroup.visible=false;
        meshes.push(text);
        scene.add(playergroup);
        materials[text.uuid] = text.material;

        whiterectangle = createText(font, "I", navigatormesh.position.x, navigatormesh.position.y+0.1, navigatormesh.position.z+0.4, name="", 0.25);
        whiterectangle.material.opacity = 1.0;
        meshes.push(whiterectangle);
        scene.add(whiterectangle);
        materials[whiterectangle.uuid] = whiterectangle.material;
    });

    loader.load( './src/fonts/icons.json', function ( font ) {
        home = createText(font, "h", x, y + 0.15, z+0.20, "home");
        home.material.opacity = 1.0;
        meshes.push(home);
        materials[home.uuid] = home.material;
        navgroup.add(home);

        pen = createText(font, "e", x, y - 0.05, z+0.04, "pen");
        pen.material.opacity = 1.0;
        meshes.push(pen);
        materials[pen.uuid] = pen.material;
        navgroup.add(pen);

        mail = createText(font, "m", x, y-0.25, z+0.04, "mail");
        mail.material.opacity = 1.0;
        meshes.push(mail);
        navgroup.add(mail);
        materials[mail.uuid] = mail.material;

        scene.add(navgroup);

        var text = createText(font, ">", x+2.0, y+0.4, z+0.3, "nextpenpage");
        text.material.opacity = 1.0;
        meshes.push(text);
        penpagegroup.add(text);
        materials[text.uuid] = text.material;

        text = createText(font, "<", x+1.8, y+0.4, z+0.3, "prevpenpage");
        text.material.opacity = 1.0;
        meshes.push(text);
        penpagegroup.add(text);
        materials[text.uuid] = text.material;


    });


    loader.load( './src/fonts/Playfair Display_Regular.json', function ( font ) {
        var x = 0.0;
        var y = 1.2;
        var z = 0.0;            
        var text = createText(font, "HELLO", x, y, z, "", 0.3, new THREE.MeshBasicMaterial( {
            color: 0x000000,
            transparent: true,
            opacity: 1.0,
            side: THREE.DoubleSide
        } ));
        homepagegroup.add(text);


    });

    loader.load( './src/fonts/Titillium_Regular.json', function ( font ) {
        var x = 0.0;
        var y = 1.2;
        var z = 0.0;    
        hello = createText(font, "I ' m  D e f n e  T u n ç e r", x, y-0.2, z, "", 0.1, new THREE.MeshBasicMaterial( {
            color: 0x000000,
            transparent: true,
            opacity: 1.0,
            side: THREE.DoubleSide
        } ));
        homepagegroup.add(hello);
    });
    
    scene.add(penpagegroup);
    scene.add(homepagegroup);
    penpagegroup.visible=false;
}

var hello;
var activemesh, navigatormesh;
var nextmesh, prevmesh;

function loadMeshes(){
    phonescreen = new THREE.Mesh( new THREE.PlaneBufferGeometry(), new THREE.MeshStandardMaterial( { color: new THREE.Color(0,0,0), roughness:0.1, metalness:0.1 } ) );
    phonescreen.name = "phonescreen";
    phonescreen.scale.x = 0.4;
    phonescreen.scale.y = 0.18;
    phonescreen.position.set(-1.55, 0.035, 0.36);
    phonescreen.rotation.x = -Math.PI/2;
    phonescreen.rotation.z = -Math.PI/3 + 0.08;
    phonescreen.layers.enable(BLOOM_SCENE);
    meshes.push(phonescreen);
    materials[phonescreen.uuid] = phonescreen.material;
    navgroup.add(phonescreen);

    screen = new THREE.Mesh( new THREE.PlaneBufferGeometry(), new THREE.MeshStandardMaterial( { color: new THREE.Color(1,1,1), roughness:0.0, metalness:0.05, emissive:0xffffff, emissiveIntensity:0.2} ) );
    //screen.layers.enable(BLOOM_SCENE);                                 
    screen.name = "screen";
    screen.scale.x = 2.3;
    screen.scale.y = 1.2;
    screen.position.set( 0, 1.37, -0.45 );
    scene.add(screen);
    meshes.push(screen);
    materials[screen.uuid] = screen.material;

    var posx = -1.4;
    var posy = 1.5;
    var posz = -0.5;
    var scx = 0.2;
    var scy = 0.6;
    var scz = 0.02;
    navigatormesh = new THREE.Mesh( new THREE.BoxBufferGeometry(),
        new THREE.MeshStandardMaterial( {
                color: new THREE.Color(0.02,0.02,0.02), 
                roughness:1.0,
                metalness:0.0,
                transparent:true,
                opacity:0.8
    } ) );

    navigatormesh.scale.set(scx, scy, scz);
    navigatormesh.position.set(posx, posy, posz);
    scene.add(navigatormesh);
    meshes.push(navigatormesh);
    materials[navigatormesh.uuid] = navigatormesh.material;

    activemesh = new THREE.Mesh( new THREE.BoxBufferGeometry(),
        new THREE.MeshNormalMaterial( { transparent:true, opacity:0.8   } ) );

    activemesh.scale.set(scx, scx, scz);
    activemesh.position.set(posx, posy + scy/2 - scx/2, posz+scz+0.15 );
    scene.add(activemesh);
    meshes.push(activemesh);
    materials[activemesh.uuid] = activemesh.material;


    nextmesh = new THREE.Mesh( new THREE.CircleBufferGeometry(0.09, 32),
    new THREE.MeshStandardMaterial( {
            color: new THREE.Color(0.02,0.02,0.02), 
            roughness:1.0,
            metalness:0.0,
    } ) );
    nextmesh.position.set(posx+2.0, posy+0.5, posz+0.2);
    penpagegroup.add(nextmesh);
    meshes.push(nextmesh);
    materials[nextmesh.uuid] = nextmesh.material;

    prevmesh = new THREE.Mesh( new THREE.CircleBufferGeometry(0.09, 32),
    new THREE.MeshStandardMaterial( {
            color: new THREE.Color(0.02,0.02,0.02), 
            roughness:1.0,
            metalness:0.0,
    } ) );
    prevmesh.position.set(posx+1.8, posy+0.5, posz+0.2);
    penpagegroup.add(prevmesh);
    meshes.push(prevmesh);
    materials[prevmesh.uuid] = prevmesh.material;
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
    mouseX=0;
    mouseY=0;
    camera.position.x = ( mouseX ) * .0001;
    camera.position.y = 1 + ( - mouseY ) * .0001;
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

var fighter;
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
                        metalness:0.2,
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
                        roughness:0.0,
                        metalness:0.2,
                        flatShading: true,
                    } );
                    object.material = material;
                }
                else if(model.name=="Hologram") {
                    //object.layers.enable('BLOOM_SCENE');
                }
                meshes.push(object);
                materials[object.uuid] = object.material;
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
            var action = mixer.clipAction(gltf.animations[0]);
            action.play();
            hologrammixer = mixer;
            hologram = gltf;
            hologram.scene.visible=false;
        }
        else if(model.name=="Fighter") fighter = gltf.scene;
        gltf.scene.name = model.name;
        scene.add(gltf.scene);
    });
}

var hellocount = 1;
var helloup = true;

/**
 * Render loop. Renders the next frame of all animations
 */
function animate() {
    // Get the time elapsed since the last frame
    var delta = clock.getDelta();
    requestAnimationFrame( animate );

    if(meshes.length>100){
        if(hellocount==20 || hellocount==0) helloup = !helloup;
        if(helloup) {hellocount+=1; fighter.position.y+=0.001;}
        else {hellocount-=1; fighter.position.y-=0.001;}
    }

    if(nowactive=="pen"){
        if ( video.readyState === video.HAVE_ENOUGH_DATA ) 
        {
            videoImageContext.drawImage( video, 0, 0 );
            if ( videoTexture ) 
                videoTexture.needsUpdate = true;
        }    
    }

    camera.position.x = ( mouseX ) * .0001;
    camera.position.y = 1 + ( - mouseY ) * .0001;
    camera.lookAt(0,0.5,0);

    //console.log(meshes.length);
//    if(meshes.length===155){
//        if(nowactive=="home"){
            //hologram.scene.visible=true;
            //hologrammixer.update(delta);
//        }
//        else{
            //hologram.scene.visible=false;
//        }
//        renderBloom();
//        finalComposer.render();
//    }
//    else {
        renderer.render(scene,camera);
//    }
}

function renderBloom() {
    meshes.forEach(darkenNonBloomed);
    scene.background=new THREE.Color(0,0,0);
    bloomComposer.render();
    meshes.forEach(restoreMaterial);
    scene.background=envMap;
    scene.environment=envMap;
}

var darkMaterial = new THREE.MeshBasicMaterial( { color: "black" } );

function darkenNonBloomed(obj) { // non-bloomed stuff must be black, including scene background
    if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
        obj.material = darkMaterial;
    }
}

function restoreMaterial(obj) {
    if (materials[obj.uuid]) {
        obj.material = materials[obj.uuid];
    }
}

var isplaying=true;
var player = document.getElementById('player');
var playlist = ['St Francis - Josh Lippi & The Overtimers',
                'Fresno Alley - Josh Lippi & The Overtimers']
var current = 0;
var nowactive = "home";

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
                clicked=true;
                object.material.color=new THREE.Color(1,1,1),
                playergroup.visible=true;
                playertext.visible=true;
            }
            else{
                phonescreen.material.color=new THREE.Color(0,0,0);
                playergroup.visible=false;
                playertext.visible=false;
                if(object.name=="home"){
                    nowactive = "home";
                    activemesh.position.y = navigatormesh.position.y + 0.2 ;
                    home.position.z = navigatormesh.position.z+0.20;
                    pen.position.z = navigatormesh.position.z+0.04;
                    mail.position.z = navigatormesh.position.z+0.04;
                    whiterectangle.position.y =  navigatormesh.position.y + 0.1;
                    homepagegroup.visible=true;
                    penpages[currentpenpage].visible=false;
                    penpagegroup.visible=false;
                    mailpagegroup.visible=false;
                }
                else if(object.name=="pen"){
                    nowactive = "pen";
                    activemesh.position.y = navigatormesh.position.y + 0.2 - 0.2;
                    home.position.z = navigatormesh.position.z+0.04;
                    pen.position.z = navigatormesh.position.z+0.20;
                    mail.position.z = navigatormesh.position.z+0.04;                    
                    whiterectangle.position.y =  navigatormesh.position.y - 0.1;                    
                    homepagegroup.visible=false;
                    penpages[currentpenpage].visible=true;
                    penpagegroup.visible=true;
                    mailpagegroup.visible=false;
                }
                else if(object.name=="mail"){
                    nowactive = "mail";
                    activemesh.position.y = navigatormesh.position.y + 0.2 - 0.4;
                    home.position.z = navigatormesh.position.z+0.04;
                    pen.position.z = navigatormesh.position.z+0.04;
                    mail.position.z = navigatormesh.position.z+0.20;
                    whiterectangle.position.y =  navigatormesh.position.y - 0.3;
                    homepagegroup.visible=false;
                    penpages[currentpenpage].visible=false;
                    penpagegroup.visible=false;
                    mailpagegroup.visible=true;

                }
            }
    }
}