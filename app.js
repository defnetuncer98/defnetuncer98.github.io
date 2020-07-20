import * as THREE from './build/three.module.js';
import { GLTFLoader } from './src/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from './src/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './src/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from './src/jsm/postprocessing/UnrealBloomPass.js';
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
        position: { x: -0.6, y: 0, z: 0.25 },
        rotation: { x: 0, y: 0.4, z: 0 },
        scale: 0.01,
    },
    {
        name: "Fighter",
        path: "./src/models/fighter.glb",
        position: { x: 1.85, y: 0.15, z: 0.7 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: 0.1,
    },    
    {
        name: "Corner",
        path: "./src/models/corner.glb",
        position: { x: 1.7, y: 0.4, z: 0.6 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: 0.08,
    },    
    {
        name: "Corner",
        path: "./src/models/corner.glb",
        position: { x: 1.7, y: 0.1, z: 0.6 },
        rotation: { x: 0, y: 0, z: Math.PI/2 },
        scale: 0.08,
    },    
    {
        name: "Corner",
        path: "./src/models/corner.glb",
        position: { x: 2.0, y: 0.1, z: 0.9 },
        rotation: { x: 0, y: Math.PI, z: Math.PI/2 },
        scale: 0.08,
    },    
    {
        name: "Corner",
        path: "./src/models/corner.glb",
        position: { x: 2.0, y: 0.4, z: 0.6 },
        rotation: { x: Math.PI, y: Math.PI, z: Math.PI/2 },
        scale: 0.08,
    },    
    {
        name: "Corner",
        path: "./src/models/corner.glb",
        position: { x: 1.7, y: 0.4, z: 0.9 },
        rotation: { x: Math.PI, y: 0, z: Math.PI/2 },
        scale: 0.08,
    },   
    {
        name: "Corner",
        path: "./src/models/corner.glb",
        position: { x: 2.0, y: 0.1, z: 0.6 },
        rotation: { x: Math.PI/2, y: Math.PI, z: Math.PI/2 },
        scale: 0.08,
    },    
    {
        name: "Corner",
        path: "./src/models/corner.glb",
        position: { x: 1.7, y: 0.1, z: 0.9 },
        rotation: { x: 0, y: Math.PI/2, z: Math.PI/2 },
        scale: 0.08,
    },  
    {
        name: "Corner",
        path: "./src/models/corner.glb",
        position: { x: 2.0, y: 0.4, z: 0.9 },
        rotation: { x: 0, y: Math.PI, z: 0 },
        scale: 0.08,
    },      

    {
        name: "Def",
        path: "./src/models/defne.glb",
        position: { x: -0.4, y: 0.8, z: 0.6 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: 10,
    },     
    {
        name: "Coffee",
        path: "./src/models/coffee/scene.gltf",
        position: { x: -2.2, y: 0.25, z: 0.6},
        rotation: { x: 0, y: Math.PI+0.6, z: 0 },
        scale: 0.016,
    },                   
]

var hologram;
var hologrammixer;

var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var meshes = [];

var BLOOM_SCENE = 1;
var bloomLayer = new THREE.Layers();
bloomLayer.set(BLOOM_SCENE);

var home, pen, mail, art;
var homepagegroup = new THREE.Group();
var penpages = [new THREE.Group(),new THREE.Group(),new THREE.Group(),new THREE.Group(),new THREE.Group(), new THREE.Group()];
var penpagegroup = new THREE.Group();
var currentpenpage = 0;
var currentartpage = 0;
var mailpagegroup = new THREE.Group();
var artpagegroup = new THREE.Group();


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
                   scene.remove(playertext);
                   if(current==playlist.length) current=0;
                   player.src='./src/sounds/'+playlist[current]+'.mp3';
                   player.load();player.play();loadAudioText();
                   playertext.visible=true;
               }
               else if(object.name=="prev"){
                   current-=1;
                   scene.remove(playertext);
                   if(current==-1) current=playlist.length-1;
                   player.src='./src/sounds/'+playlist[current]+'.mp3';
                   player.load();player.play();loadAudioText();
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
                    if(currentpenpage==6) {
                        currentpenpage = 5;
                        nextmesh.material.color=new THREE.Color(0.8, 0.8, 0.8);
                    }
                    else if(currentpenpage==2) {
                        currentpage=0;
                        pageselector.position.x=-2.03;
                        prevmesh.material.color=new THREE.Color(0.02,0.02, 0.02);                    
                        video.src = "./src/videos/tt2.mp4"; video.load(); video.play();
                    }
                    else if(currentpenpage==4) {
                        currentpage=0;
                        pageselector.position.x=-2.03;
                        prevmesh.material.color=new THREE.Color(0.02,0.02, 0.02);                    
                        video.src = "./src/videos/vizgooglefit.mp4"; video.load(); video.play();
                    }
                    else if(currentpenpage==1){
                        pageselector.position.x=-2.03;
                        currentpage=0;
                        video.src = "./src/videos/cat.mp4"; video.load(); video.play();
                    }
                    else if(currentpenpage==3){
                        pageselector.position.x=-2.03;
                        currentpage=0;
                        video.src = "./src/videos/rockornot.mp4"; video.load(); video.play();
                    }
                    else if(currentpenpage==5){
                        pageselector.position.x=-2.03;
                        currentpage=0;
                        video.src = "./src/videos/malle.mp4"; video.load(); video.play();
                    }
                    else if(currentpenpage==0){
                        pageselector.position.x=-2.03;
                        currentpage=0;
                        video.src = "./src/videos/Echost Teaser.mp4"; video.load(); video.play();
                    }
                    penpages[currentpenpage].visible=true;

                }
                else if(object.name=="prevpenpage"){
                    penpages[currentpenpage].visible=false;
                    currentpenpage-=1;
                    if(currentpenpage==-1) {
                        pageselector.position.x=-2.03;
                        currentpenpage=0;
                        prevmesh.material.color=new THREE.Color(0.8, 0.8, 0.8);
                    }
                    else if(currentpenpage==4) {
                        pageselector.position.x=-2.03;
                        currentpage=0;
                        nextmesh.material.color=new THREE.Color(0.02, 0.02, 0.02);
                        video.src = "./src/videos/vizgooglefit.mp4"; video.load(); video.play();
                    }
                    else if(currentpenpage==3){
                        pageselector.position.x=-2.03;
                        currentpage=0;
                        video.src = "./src/videos/rockornot.mp4"; video.load(); video.play();
                    }
                    else if(currentpenpage==2){
                        pageselector.position.x=-2.03;
                        currentpage=0;
                        video.src = "./src/videos/tt2.mp4"; video.load(); video.play();
                    }
                    else if(currentpenpage==1) {
                        pageselector.position.x=-2.03;
                        currentpage=0;
                        video.src = "./src/videos/cat.mp4"; video.load(); video.play();
                    }
                    else if(currentpenpage==5) {
                        pageselector.position.x=-2.03;
                        currentpage=0;
                        video.src = "./src/videos/malle.mp4"; video.load(); video.play();
                    }
                    else if(currentpenpage==0) {
                        pageselector.position.x=-2.03;
                        currentpage=0;
                        video.src = "./src/videos/Echost Teaser.mp4"; video.load(); video.play();
                    }
                    penpages[currentpenpage].visible=true;
                }
            }
            var intersects = raycaster.intersectObjects( penpages[currentpenpage].children );
            if ( intersects.length > 0 ) {
                var object = intersects[ 0 ].object;
                if(object.name=="linktosmelly"){
                    linktosmelly.click();
                }
                else if(object.name=="linktotomayto"){
                    linktotomayto.click();
                }
                else if(object.name=="linktoyoutube"){
                    linktoyoutube.click();
                }
                else if(object.name=="linktoyoutuberon"){
                    linktoyoutuberon.click();
                }
                else if(object.name=="linktogame"){
                    linktogame.click();
                }
                else if(object.name=="linktomedium"){
                    linktomedium.click();
                }
                else if(object.name=="linktovizgooglefittryme"){
                    linktovizgooglefittryme.click();
                }
                else if(object.name=="linktovizgooglefit"){
                    linktovizgooglefit.click();
                }
                else if(object.name=="linktorockornot"){
                    linktorockornot.click();
                }
                else if(object.name=="linktomalle"){
                    linktomalle.click();
                }
                else if(object.name=="linktoechost"){
                    linktoechost.click();
                }
            }            
       }
       else if (nowactive=="mail"){
        var intersects = raycaster.intersectObjects( mailpagegroup.children );
        if ( intersects.length > 0 ) {
            var object = intersects[ 0 ].object;
            if(object.name=="linktogithub"){
                linktogithub.click();
            }
            else if(object.name=="linktoresume"){
                linktoresume.click();
            }
            else if(object.name=="linktolinkedin"){
                linktolinkedin.click();
            }
            else if(object.name=="mailto"){
                mailto.click();
            }
        }
        else if(nowactive=="art"){
            var intersects = raycaster.intersectObjects( artpagegroup.children );
            if ( intersects.length > 0 ) {
                var object = intersects[ 0 ].object;
                if(object.name=="nextartpage"){
                    currentartpage+=1;
                    if(currentartpage==4) {
                        currentartpage = 3;
                        nextmeshart.material.color=new THREE.Color(0.8, 0.8, 0.8);
                    }
                    else if(currentartpage==0){
                        sketchfab1.style.display="block";
                    }
                    else if(currentartpage==1){
                        sketchfab1.style.display="none";
                        sketchfab2.style.display="block";
                    }    
                    else if(currentartpage==2){
                        sketchfab2.style.display="none";
                        sketchfab3.style.display="block";
                    }
                    else if(currentartpage==3){
                        sketchfab3.style.display="none";
                        sketchfab4.style.display="block";
                    }              
                }
                else if(object.name=="prevartpage"){
                    currentartpage-=1;
                    if(currentartpage==-1) {
                        currentartpage=0;
                        prevmeshart.material.color=new THREE.Color(0.8, 0.8, 0.8);
                    }
                    else if(currentartpage==0){
                        sketchfab2.style.display="none";
                        sketchfab1.style.display="block";
                    }
                    else if(currentartpage==1){
                        sketchfab3.style.display="none";
                        sketchfab2.style.display="block";
                    }    
                    else if(currentartpage==2){
                        sketchfab4.style.display="none";
                        sketchfab3.style.display="block";
                    }
                    else if(currentartpage==3){
                        sketchfab4.style.display="block";
                    }    
                }
            }
        }
    }
}

var linktoresume =  document.getElementById('linktoresume');
var linktogithub =  document.getElementById('linktogithub');
var mailto =  document.getElementById('mailto');
var linktolinkedin =  document.getElementById('linktolinkedin');
var linktosmelly =  document.getElementById('linktosmelly');
var linktorockornot =  document.getElementById('linktorockornot');
var linktotomayto =  document.getElementById('linktotomayto');
var linktoyoutube =  document.getElementById('linktoyoutube');
var linktoyoutuberon =  document.getElementById('linktoyoutuberon');
var linktogame =  document.getElementById('linktogame');
var linktomedium =  document.getElementById('linktomedium');
var linktomalle =  document.getElementById('linktomalle');
var linktovizgooglefit = document.getElementById('linktovizgooglefit');
var linktovizgooglefittryme = document.getElementById('linktovizgooglefittryme');
var linktoechost = document.getElementById('linktoechost');
var sketchfab1 = document.getElementById('sketchfab1');
var sketchfab2 = document.getElementById('sketchfab2');
var sketchfab3 = document.getElementById('sketchfab3');
var sketchfab4 = document.getElementById('sketchfab4');
var sketchfabmodels = document.getElementById('sketchfab-models');
var materials = {};

var matLite = new THREE.MeshBasicMaterial( {
    color: 0xffffff,
    transparent: true,
    opacity: 0.4,
    side: THREE.DoubleSide
} );

var playertext;
var playergroup = new THREE.Group();
var navgroup = new THREE.Group();
var whiterectangle;

init();
animate();

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
    video.src = "./src/videos/home.mp4";
    video.loop = true;
    //video.muted = true;
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
	
	var movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, color:new THREE.Color(0.6,0.6,0.6)} );
	var movieGeometry = new THREE.PlaneGeometry( 2.3, 1.2, 4, 4 );
	var movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
    movieScreen.position.set( -1.39, 1.37, -0.39 );
    movieScreen.rotation.set(0.0, 0.4, 0.0);
    materials[movieScreen.uuid] = movieMaterial;
    meshes.push(movieScreen);
    scene.add(movieScreen);
}

function loadAudioText(){
    var loader = new THREE.FontLoader();
    loader.load( './src/fonts/Roboto_Regular.json', function ( font ) {
        playertext = createText(font, playlist[current], 0.9, 0.5, 0.5, "", 0.03);
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

var pageselector;
var linkhover;

function loadTexts(){
    var loader = new THREE.FontLoader();
    var x = navigatormesh.position.x;
    var y = navigatormesh.position.y;
    var z = navigatormesh.position.z;
    loader.load( './src/fonts/arrow.json', function ( font ) {
        var text = createText(font, "G", x+0.8, y-0.7, z+0.6);
        text.rotateZ(2);
        text.material.opacity = 1.0;
        meshes.push(text);
        penpages[0].add(text);
        materials[text.uuid] = text.material;
        
        text = createText(font, "¡", 1.05, 0.35, 0.5, name="next",0.15);
        //text.layers.enable(BLOOM_SCENE);
        meshes.push(text);
        playergroup.add( text );
        materials[text.uuid] = text.material;

        text = createText(font, "{", 0.9, 0.35, 0.5, name="play",0.15);
        //text.layers.enable(BLOOM_SCENE);
        meshes.push(text);
        playergroup.add( text );
        materials[text.uuid] = text.material;

        text = createText(font, "~", 0.75, 0.35, 0.5, name="prev",0.15);
        //text.layers.enable(BLOOM_SCENE);
        playergroup.add( text );
        playergroup.visible=false;
        meshes.push(text);
        scene.add(playergroup);
        materials[text.uuid] = text.material;
    });
    loader.load( './src/fonts/Hippotamia.json', function ( font ) {
        var text = createText(font, "try me!", x+1.1, y-0.75, z+0.6,"linktovizgooglefittryme", 0.1);
        text.material.opacity = 1.0;
        meshes.push(text);
        penpages[4].add(text);
        materials[text.uuid] = text.material;

        var text = createText(font, "try me!", x+1.1, y-0.75, z+0.6,"linktogame", 0.1);
        text.material.opacity = 1.0;
        meshes.push(text);
        penpages[1].add(text);
        materials[text.uuid] = text.material;

        var text = createText(font, "wait for it!", x+1.1, y-0.75, z+0.6, 0.1);
        text.material.opacity = 1.0;
        meshes.push(text);
        penpages[0].add(text);
        materials[text.uuid] = text.material;
        
        var text = createText(font, "read me!", x+1.1, y-0.75, z+0.6,"linktomedium", 0.1);
        text.material.opacity = 1.0;
        meshes.push(text);
        penpages[3].add(text);
        materials[text.uuid] = text.material;
        
        var text = createText(font, "& a senior computer science student", -1.3, 1.0, -0.1, "", 0.1, new THREE.MeshBasicMaterial( {
            color: 0x000000,
            transparent: true,
            opacity: 1.0,
            side: THREE.DoubleSide
        } ));
        text.rotation.y = 0.4;
        homepagegroup.add(text);

        linkhover = createText(font, '{    }', 0,0,6, "linkhover", 0.1, new THREE.MeshNormalMaterial({}));
        linkhover.material.opacity = 1.0;
        scene.add(linkhover);

        text = createText(font, "</>", x+0.3, y-0.4, z+0.6, "tagicon");
        text.material.opacity = 1.0;
        meshes.push(text);
        penpagegroup.add(text);
        materials[text.uuid] = text.material;
        
        var text = createText(font, "1", x-2.0, y-0.9, z+0.4, "page1", 0.1);
        text.material.opacity = 1.0;
        text.rotation.y = 0.4;
        penpagegroup.add(text);

        var text = createText(font, "2", x-1.85, y-0.9, z+0.4, "page2", 0.1);
        text.material.opacity = 1.0;
        text.rotation.y = 0.4;
        penpagegroup.add(text);

        var text = createText(font, "3", x-1.70, y-0.9, z+0.4, "page3", 0.1);
        text.material.opacity = 1.0;
        text.rotation.y = 0.4;
        penpagegroup.add(text);

        pen = createText(font, "</>", x, y - 0.05, z+0.04, "pen");
        pen.material.opacity = 1.0;
        meshes.push(pen);
        materials[pen.uuid] = pen.material;
        navgroup.add(pen);
    });
    loader.load( './src/fonts/player.json', function ( font ) {
        var text;
        
        pageselector = createText(font, "I", -2.03, y-0.93, z+0.4, "", 0.15, new THREE.MeshNormalMaterial({}));
        pageselector.material.opacity = 1.0;
        pageselector.rotation.y = 0.4;
        penpagegroup.add(pageselector);

        whiterectangle = createText(font, "I", navigatormesh.position.x, navigatormesh.position.y+0.1, navigatormesh.position.z+0.4, name="", 0.25);
        whiterectangle.material.opacity = 1.0;
        meshes.push(whiterectangle);
        scene.add(whiterectangle);
        materials[whiterectangle.uuid] = whiterectangle.material;

    });
    loader.load( './src/fonts/crazy.json', function ( font ) {
        art = createText(font, "B", x, y-0.25, z+0.04, "art",0.15);
        art.material.opacity = 1.0;
        meshes.push(art);
        materials[art.uuid] = art.material;
        navgroup.add(art);
    });

    loader.load( './src/fonts/icons.json', function ( font ) {
        home = createText(font, "h", x, y + 0.15, z+0.20, "home");
        home.material.opacity = 1.0;
        meshes.push(home);
        materials[home.uuid] = home.material;
        navgroup.add(home);

        mail = createText(font, "m", x, y-0.45, z+0.04, "mail");
        mail.material.opacity = 1.0;
        meshes.push(mail);
        navgroup.add(mail);
        materials[mail.uuid] = mail.material;

        scene.add(navgroup);

        var text = createText(font, ">", x+1.95, y-1.07, z+0.3, "nextpenpage");
        text.material.opacity = 1.0;
        meshes.push(text);
        penpagegroup.add(text);
        materials[text.uuid] = text.material;

        text = createText(font, "<", x+1.75, y-1.07, z+0.3, "prevpenpage");
        text.material.opacity = 1.0;
        meshes.push(text);
        penpagegroup.add(text);
        materials[text.uuid] = text.material;

        var text = createText(font, ">", x+1.95, y-1.07, z+0.3, "nextartpage");
        text.material.opacity = 1.0;
        meshes.push(text);
        artpagegroup.add(text);
        materials[text.uuid] = text.material;

        text = createText(font, "<", x+1.75, y-1.07, z+0.3, "prevartpage");
        text.material.opacity = 1.0;
        meshes.push(text);
        artpagegroup.add(text);
        materials[text.uuid] = text.material;
        
        var text = createText(font, "m", x+0.7, y-0.87, z+0.6,"mailto", 0.13);
        text.material.opacity = 1.0;
        meshes.push(text);
        mailpagegroup.add(text);
        materials[text.uuid] = text.material;

    });

    loader.load( './src/fonts/icons3.json', function ( font ) {
        var text = createText(font, "C", -1.76, 0.85, 0.1, "linktoresume");
        text.material.opacity = 1.0;
        meshes.push(text);
        text.rotation.y=0.4;
        mailpagegroup.add(text);
        materials[text.uuid] = text.material;
    });

    loader.load( './src/fonts/icons2.json', function ( font ) {
        var text = createText(font, "Ä", x+1.4, y-0.75, z+0.6,"linktovizgooglefit", 0.15);
        text.material.opacity = 1.0;
        meshes.push(text);
        penpages[4].add(text);
        materials[text.uuid] = text.material;

        var text = createText(font, "Ä", x+1.4, y-0.75, z+0.6,"linktomalle", 0.15);
        text.material.opacity = 1.0;
        meshes.push(text);
        penpages[5].add(text);
        materials[text.uuid] = text.material;

        var text = createText(font, "Ä", x+1.4, y-0.75, z+0.6,"linktosmelly", 0.15);
        text.material.opacity = 1.0;
        meshes.push(text);
        penpages[1].add(text);
        materials[text.uuid] = text.material;
        
        var text = createText(font, "Ä", x+1.4, y-0.75, z+0.6,"linktorockornot", 0.15);
        text.material.opacity = 1.0;
        meshes.push(text);
        penpages[3].add(text);
        materials[text.uuid] = text.material;

        var text = createText(font, "Ä", x+1.4, y-0.75, z+0.6,"linktotomayto", 0.15);
        text.material.opacity = 1.0;
        meshes.push(text);
        penpages[2].add(text);
        materials[text.uuid] = text.material;
        
        var text = createText(font, "y", x+1.6, y-0.75, z+0.6,"linktoyoutube", 0.15);
        text.material.opacity = 1.0;
        meshes.push(text);
        penpages[2].add(text);
        materials[text.uuid] = text.material;

        var text = createText(font, "y", x+1.6, y-0.75, z+0.6,"linktoyoutuberon", 0.15);
        text.material.opacity = 1.0;
        meshes.push(text);
        penpages[3].add(text);
        materials[text.uuid] = text.material;

        var text = createText(font, "y", x+1.6, y-0.75, z+0.6,"linktoechost", 0.15);
        text.material.opacity = 1.0;
        meshes.push(text);
        penpages[0].add(text);
        materials[text.uuid] = text.material;

        var text = createText(font, "Ä", x+0.9, y-0.85, z+0.6,"linktogithub", 0.15);
        text.material.opacity = 1.0;
        meshes.push(text);
        mailpagegroup.add(text);
        materials[text.uuid] = text.material;

        var text = createText(font, "l", x+1.1, y-0.85, z+0.6,"linktolinkedin", 0.13);
        text.material.opacity = 1.0;
        meshes.push(text);
        mailpagegroup.add(text);
        materials[text.uuid] = text.material;

        
    });

    loader.load( './src/fonts/Playfair Display_Regular.json', function ( font ) {
        var x = 0.0;
        var y = 1.4;
        var z = 0.0;            
        var text = createText(font, "HELLO", x-1.3, y, z-0.1, "", 0.3, new THREE.MeshBasicMaterial( {
            color: 0x000000,
            transparent: true,
            opacity: 1.0,
            side: THREE.DoubleSide
        } ));
        text.rotation.y = 0.4;
        homepagegroup.add(text);

        var text = createText(font, "ECHOST", x+0.6, y+0.3, z-0.1, "", 0.15, new THREE.MeshBasicMaterial( {
            color: 0xffffff,
            transparent: true,
            opacity: 1.0,
            side: THREE.DoubleSide
        } ));
        penpages[0].add(text);

        var text = createText(font, "SMELLY CAT", x+1.1, y+0.2, z-0.1, "", 0.2, new THREE.MeshBasicMaterial( {
            color: 0xffffff,
            transparent: true,
            opacity: 1.0,
            side: THREE.DoubleSide
        } ));
        penpages[1].add(text);
  
        var text = createText(font, "TOMAYTOMAHTO", x+1.15, y+0.3, z-0.1, "", 0.15, new THREE.MeshBasicMaterial( {
            color: 0xffffff,
            transparent: true,
            opacity: 1.0,
            side: THREE.DoubleSide
        } ));
        penpages[2].add(text);
        
        var text = createText(font, "MALL-E", x+0.8, y+0.3, z-0.1, "", 0.15, new THREE.MeshBasicMaterial( {
            color: 0xffffff,
            transparent: true,
            opacity: 1.0,
            side: THREE.DoubleSide
        } ));
        penpages[5].add(text);

        var text = createText(font, "ROCK OR NOT?", x+1, y+0.3, z-0.1, "", 0.15, new THREE.MeshBasicMaterial( {
            color: 0xffffff,
            transparent: true,
            opacity: 1.0,
            side: THREE.DoubleSide
        } ));
        penpages[3].add(text);

        var text = createText(font, "vizGoogleFit", x+0.9, y+0.3, z-0.1, "", 0.15, new THREE.MeshBasicMaterial( {
            color: 0xffffff,
            transparent: true,
            opacity: 1.0,
            side: THREE.DoubleSide
        } ));
        penpages[4].add(text);

        var text = createText(font, "Reach me!", x+1.5, y+0.1, z-0.1, "", 0.15, new THREE.MeshNormalMaterial( {} ));
        mailpagegroup.add(text);
    });

    loader.load( './src/fonts/Titillium_Regular.json', function ( font ) {

        var text = createText(font, "Unity, Blender", x+0.7, y-0.4, z+0.56, "", 0.05);
        text.material.opacity = 1.0;
        meshes.push(text);
        penpages[0].add(text);
        materials[text.uuid] = text.material;

        var text = createText(font, "D3.js", x+0.5, y-0.4, z+0.56, "", 0.05);
        text.material.opacity = 1.0;
        meshes.push(text);
        penpages[4].add(text);
        materials[text.uuid] = text.material;

        var text = createText(font, "WebGL, three.js", x+0.7, y-0.4, z+0.56, "", 0.05);
        text.material.opacity = 1.0;
        meshes.push(text);
        penpages[1].add(text);
        materials[text.uuid] = text.material;

        var text = createText(font, "Java Spring Boot, MySql,\nThymeleaf", x+0.8, y-0.4, z+0.56, "", 0.05);
        text.material.opacity = 1.0;
        meshes.push(text);
        penpages[5].add(text);
        materials[text.uuid] = text.material;

        var text = createText(font, "machine learning, python, \nsci-kit learn, librosa", x+0.8, y-0.4, z+0.56, "", 0.05);
        text.material.opacity = 1.0;
        meshes.push(text);
        penpages[3].add(text);
        materials[text.uuid] = text.material;

        var text = createText(font, "machine learning, python, \nsci-kit learn, librosa", x+0.8, y-0.4, z+0.56, "", 0.05);
        text.material.opacity = 1.0;
        meshes.push(text);
        penpages[2].add(text);
        materials[text.uuid] = text.material;
        
        hello = createText(font, "I ' m  D e f n e  T u n ç e r", -1.2, 1.2, 0.0, "", 0.1, new THREE.MeshBasicMaterial( {
            color: 0x000000,
            transparent: true,
            opacity: 1.0,
            side: THREE.DoubleSide
        } ));
        hello.rotation.y = 0.4;
        homepagegroup.add(hello);

        
        var text = createText(font, "I ' m  D e f n e  T u n ç e r", -1.22, 1.19, -0.02, "", 0.1, new THREE.MeshNormalMaterial( {} ));
        text.rotation.y = 0.4;
        materials[text.uuid] = text.material;
        meshes.push(text);
        homepagegroup.add(text);

        hello = createText(font, "Developed an indie RPG game:\n UI, quest system, save & load, inventory,\ninteraction with NPC and objects,\n dialogue system, skills, animations, cutscene.", 0.9, 1.6, -0.1, "", 0.05, new THREE.MeshBasicMaterial( {
            color: 0xffffff,
            transparent: true,
            opacity: 1.0,
            side: THREE.DoubleSide
        } ));
        penpages[0].add(hello);

        hello = createText(font, "Online Shopping System", 0.8, 1.5, -0.1, "", 0.05, new THREE.MeshBasicMaterial( {
            color: 0xffffff,
            transparent: true,
            opacity: 1.0,
            side: THREE.DoubleSide
        } ));
        penpages[5].add(hello);
        
        hello = createText(font, "Visualize your Google Fit Data!", 0.8, 1.5, -0.1, "", 0.05, new THREE.MeshBasicMaterial( {
            color: 0xffffff,
            transparent: true,
            opacity: 1.0,
            side: THREE.DoubleSide
        } ));
        penpages[4].add(hello);

        hello = createText(font, "This sure does. | Music Genre Prediction System", 0.98, 1.5, -0.1, "", 0.05, new THREE.MeshBasicMaterial( {
            color: 0xffffff,
            transparent: true,
            opacity: 1.0,
            side: THREE.DoubleSide
        } ));
        penpages[3].add(hello);

        hello = createText(font, "Smelly Cat is a web gaming experience inspired\n by Bedroom In Arles by Vincent van Gogh.", 0.98, 1.4, -0.1, "", 0.05, new THREE.MeshBasicMaterial( {
            color: 0xffffff,
            transparent: true,
            opacity: 1.0,
            side: THREE.DoubleSide
        } ));
        penpages[1].add(hello);
        
        hello = createText(font, "Your Personal AI Pronunciation Coach\n Automatic mispronunciation detection system is trained\nand tested on the dataset for English language learners\nwith Turkish accent and reached an F1-score of 94%.", 1.1, 1.6, -0.1, "", 0.05, new THREE.MeshBasicMaterial( {
            color: 0xffffff,
            transparent: true,
            opacity: 1.0,
            side: THREE.DoubleSide
        } ));
        penpages[2].add(hello);
    });
    
    scene.add(penpagegroup);
    scene.add(homepagegroup);
    scene.add(mailpagegroup);
    scene.add(artpagegroup);
    penpagegroup.visible=false;
    artpagegroup.visible=false;
    mailpagegroup.visible=false;
    
    scene.add(penpages[0]);
    penpages[0].visible=false;
    scene.add(penpages[4]);
    penpages[4].visible=false;
    scene.add(penpages[5]);
    penpages[5].visible=false;
    scene.add(penpages[1]);
    penpages[1].visible=false;
    scene.add(penpages[2]);
    penpages[2].visible=false;
    scene.add(penpages[3]);
    penpages[3].visible=false;

}

var hello;
var activemesh, navigatormesh;
var nextmesh, prevmesh, nextmeshart, prevmeshart;

function loadMeshes(){
    phonescreen = new THREE.Mesh( new THREE.PlaneBufferGeometry(), new THREE.MeshStandardMaterial( { color: new THREE.Color(0,0,0), roughness:0.1, metalness:0.1 } ) );
    phonescreen.name = "phonescreen";
    phonescreen.scale.x = 0.4;
    phonescreen.scale.y = 0.18;
    phonescreen.position.set(0.94, 0.0325, 0.64);
    phonescreen.rotation.x = -Math.PI/2;
    phonescreen.rotation.z = 1;
    phonescreen.rotation.y = 0.0;
    phonescreen.layers.enable(BLOOM_SCENE);
    meshes.push(phonescreen);
    materials[phonescreen.uuid] = phonescreen.material;
    navgroup.add(phonescreen);

    screen = new THREE.Mesh( new THREE.PlaneBufferGeometry(), new THREE.MeshStandardMaterial( { color: new THREE.Color(1,1,1), roughness:0.0, metalness:0.05, emissive:0xffffff, emissiveIntensity:0.2} ) );
    screenmaterial = screen.material;
    //screen.layers.enable(BLOOM_SCENE);                                 
    screen.name = "screen";
    screen.scale.x = 2.3;
    screen.scale.y = 1.2;
    screen.position.set( -1.4, 1.37, -0.4 );
    screen.rotation.set(0.0,0.4,0.0);
    scene.add(screen);
    meshes.push(screen);
    materials[screen.uuid] = screen.material;

    var posx = 0.0;
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
    nextmesh.position.set(posx+2.0, posy-1, posz+0.2);
    nextmesh.name = "nextpenpage";
    penpagegroup.add(nextmesh);
    meshes.push(nextmesh);
    materials[nextmesh.uuid] = nextmesh.material;

    prevmesh = new THREE.Mesh( new THREE.CircleBufferGeometry(0.09, 32),
    new THREE.MeshStandardMaterial( {
            color: new THREE.Color(0.02,0.02,0.02), 
            roughness:1.0,
            metalness:0.0,
    } ) );
    prevmesh.position.set(posx+1.8, posy-1, posz+0.2);
    prevmesh.name = "prevpenpage";
    penpagegroup.add(prevmesh);
    meshes.push(prevmesh);
    materials[prevmesh.uuid] = prevmesh.material;

    nextmeshart = new THREE.Mesh( new THREE.CircleBufferGeometry(0.09, 32),
    new THREE.MeshStandardMaterial( {
            color: new THREE.Color(0.02,0.02,0.02), 
            roughness:1.0,
            metalness:0.0,
    } ) );
    nextmeshart.position.set(posx+2.0, posy-1, posz+0.2);
    nextmeshart.name = "nextartpage";
    artpagegroup.add(nextmeshart);
    meshes.push(nextmeshart);
    materials[nextmeshart.uuid] = nextmeshart.material;

    prevmeshart = new THREE.Mesh( new THREE.CircleBufferGeometry(0.09, 32),
    new THREE.MeshStandardMaterial( {
            color: new THREE.Color(0.02,0.02,0.02), 
            roughness:1.0,
            metalness:0.0,
    } ) );
    prevmeshart.position.set(posx+1.8, posy-1, posz+0.2);
    prevmeshart.name = "prevartpage";
    artpagegroup.add(prevmeshart);
    meshes.push(prevmeshart);
    materials[prevmeshart.uuid] = prevmeshart.material;

    var mesh = new THREE.Mesh( new THREE.CircleBufferGeometry(0.12, 32),
    new THREE.MeshStandardMaterial( {
            color: new THREE.Color(0.02,0.02,0.02), 
            roughness:1.0,
            metalness:0.0,
    } ) );
    mesh.position.set(posx-1.8, posy-0.6, posz+0.5);
    mesh.name = "linktoresume";
    mesh.rotation.y = 0.4;
    mailpagegroup.add(mesh);
    meshes.push(mesh);
    materials[mesh.uuid] = mesh.material;

    // tag and links
    // var mesh = new THREE.Mesh( new THREE.BoxBufferGeometry(),
    // new THREE.MeshStandardMaterial( {
    //         color: new THREE.Color(0.0, 0.0, 0.0), 
    //         roughness:1.0,
    //         metalness:0.0,
    //         transparent:true,
    //         opacity:0.9
    // } ) );
    // mesh.scale.set(1.2, 0.4, 0.1);
    // mesh.position.set(posx+1.4, posy-0.6, posz+0.5);
    // penpagegroup.add(mesh);
    // meshes.push(mesh);
    // materials[mesh.uuid] = mesh.material;

    // header
    // var mesh = new THREE.Mesh( new THREE.BoxBufferGeometry(),
    // new THREE.MeshStandardMaterial( {
    //         color: new THREE.Color(1.0, 1.0, 1.0), 
    //         roughness:1.0,
    //         metalness:0.0,
    //         transparent:true,
    //         opacity:0.9
    // } ) );
    // mesh.scale.set(2.0, 0.8, 0.1);
    // mesh.position.set(posx+1.2, posy-0.1, posz+0.2);
    // penpagegroup.add(mesh);
    // meshes.push(mesh);
    // materials[mesh.uuid] = mesh.material;

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
var screenmaterial;
/**
 * Initialize ThreeJS THREE.Scene
 */
function initScene() {
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
    mouseX=0;
    mouseY=0;
    camera.position.x = ( mouseX ) * .0001;
    camera.position.y = 1 + ( - mouseY ) * .0001;
    camera.position.set( 0, 0, 3.5 );
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
var canvas;

function initRenderer() {
    canvas = document.createElement( 'canvas' );
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
    bloomPass.strength = 2;
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
var rotatefighter = false;
var def;
function loadGLTFModel(model) {
    var loader = new GLTFLoader();
    loader.load(model.path, function (gltf) {
        gltf.scene.name = model.name;
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
                else if(model.name=="Def") {
                    var material = new THREE.MeshBasicMaterial( {map:object.material.map} );
                    object.material = material;                    
                }
                else if(model.name=="Fighter") {
                    var material = new THREE.MeshStandardMaterial( {
                        color: new THREE.Color(0,0,0),
                    } );
                    object.material = material;
                }
                else if(model.name=="Corner") {
                    var material = new THREE.MeshNormalMaterial({flatShading:true});
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
            scene.add(gltf.scene);
        }
        else if(model.name=="Fighter") {
            fighter = gltf.scene; 
        }
        else if(model.name=="Def"){
            def = gltf.scene;
            def.visible=false;
        }
        scene.add(gltf.scene);
    });
}

var hellocount = 1;
var helloup = true;
var loading = document.getElementById('loading');
var slide = document.getElementById('slide');
/**
 * Render loop. Renders the next frame of all animations
 */
function animate() {
    // Get the time elapsed since the last frame
    var delta = clock.getDelta();
    requestAnimationFrame( animate );
    console.log("Change below code with: ", meshes.length);
    if(meshes.length==292){
        canvas.display='block';
        slide.style.display='none';
        loading.style.display='none';
        if(hellocount==20 || hellocount==0) helloup = !helloup;
        if(helloup) {hellocount+=1; fighter.position.y+=0.001;}
        else {hellocount-=1; fighter.position.y-=0.001;}
        if(rotatefighter) fighter.rotation.y += 0.08;

        if ( video.readyState === video.HAVE_ENOUGH_DATA ) 
        {
            videoImageContext.drawImage( video, 0, 0 );
            if ( videoTexture ) 
                videoTexture.needsUpdate = true;
        }    
    
        camera.position.x = ( - mouseX ) * .0001;
        camera.position.y = 1.2 + ( mouseY ) * .0001;
        camera.lookAt(0,0.8,0);

        renderer.render(scene,camera);
    }
    else {
        document.getElementById('loading').innerText = Math.round(meshes.length*100 / 281) + '%';
    }



//    console.log(meshes.length);
//    if(meshes.length==189){
//     //    if(nowactive=="home"){
//     //         hologram.scene.visible=true;
//     //         hologrammixer.update(delta);
//     //    }
//     //    else{
//     //         hologram.scene.visible=false;
//     //    }
//        renderBloom();
//        finalComposer.render();
//    }
//    else {
//        renderer.render(scene,camera);
//    }
}

function renderBloom() {
    meshes.forEach(darkenNonBloomed);
    scene.background=new THREE.Color(0,0,0);
    bloomComposer.render();
    scene.background=envMap;
    meshes.forEach(restoreMaterial);
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
var currentpage = 1;

function onDocumentMouseMove( event ) {
    mouseX = ( event.clientX - windowHalfX ) * 10;
    mouseY = ( event.clientY - windowHalfY ) * 10;
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    if(mouseX>5200 && mouseX<5900 && mouseY>1500 && mouseY<1900) rotatefighter = true;
    else rotatefighter = false;

    var intersects = raycaster.intersectObjects( playergroup.children );
    if ( intersects.length > 0 ) {
        document.body.style.cursor = "pointer"
    }
    else{
        document.body.style.cursor = "auto"
        linkhover.position.set(0,0,6);
    }

    if(nowactive=="pen"){
        var intersects = raycaster.intersectObjects( penpages[currentpenpage].children );
        if ( intersects.length > 0 ) {
            var object = intersects[ 0 ].object;
            if(object.name=="linktosmelly" && currentpenpage==1){
                document.body.style.cursor = "pointer"
                linkhover.position.set(object.position.x, object.position.y+0.03, object.position.z);
            }
            else if(object.name=="linktotomayto" && currentpenpage==2){
                document.body.style.cursor = "pointer"
                linkhover.position.set(object.position.x, object.position.y+0.03, object.position.z);
            }
            else if(object.name=="linktorockornot" && currentpenpage==3){
                document.body.style.cursor = "pointer"
                linkhover.position.set(object.position.x, object.position.y+0.03, object.position.z);
            }
            else if(object.name=="linktoyoutube" && currentpenpage==2){
                document.body.style.cursor = "pointer"
                linkhover.position.set(object.position.x, object.position.y+0.03, object.position.z);
            }
            else if(object.name=="linktoechost" && currentpenpage==0){
                document.body.style.cursor = "pointer"
                linkhover.position.set(object.position.x, object.position.y+0.03, object.position.z);
            }
            else if(object.name=="linktoyoutuberon" && currentpenpage==3){
                document.body.style.cursor = "pointer"
                linkhover.position.set(object.position.x, object.position.y+0.03, object.position.z);
            }
            else if(object.name=="linktovizgooglefit" && currentpenpage==4){
                document.body.style.cursor = "pointer"
                linkhover.position.set(object.position.x, object.position.y+0.03, object.position.z);
            }
            else if(object.name=="linktomalle" && currentpenpage==5){
                document.body.style.cursor = "pointer"
                linkhover.position.set(object.position.x, object.position.y+0.03, object.position.z);
            }
            else if(object.name=="linktogame"){
                document.body.style.cursor = "pointer"
            }
            else if(object.name=="linktovizgooglefittryme"){
                document.body.style.cursor = "pointer"
            }
            else if(object.name=="linktomedium"){
                document.body.style.cursor = "pointer"
            }
        }
        var intersects = raycaster.intersectObjects( penpagegroup.children );
        if ( intersects.length > 0 ) {
            var object = intersects[ 0 ].object;
            if(object.name=="nextpenpage"){
                document.body.style.cursor = "pointer"
            }
            else if(object.name=="prevpenpage"){
                document.body.style.cursor = "pointer"
            }
            else if(object.name=="page1"){
                document.body.style.cursor = "pointer"
                pageselector.position.x=-2.03;
                if(currentpenpage==0 && currentpage!=1){
                    video.src = "./src/videos/Echost Teaser.mp4";video.load();video.play();
                }
                else if(currentpenpage==1 && currentpage!=1){
                    video.src = "./src/videos/cat.mp4";video.load();video.play();
                }
                else if(currentpenpage==2 && currentpage!=1){
                    video.src = "./src/videos/tt2.mp4";video.load();video.play();
                }
                else if(currentpenpage==3 && currentpage!=1){
                    video.src = "./src/videos/rockornot.mp4";video.load();video.play();
                }
                else if(currentpenpage==4 && currentpage!=1){
                    video.src = "./src/videos/vizgooglefit.mp4";video.load();video.play();
                }
                else if(currentpenpage==5 && currentpage!=1){
                    video.src = "./src/videos/malle.mp4";video.load();video.play();
                }
                currentpage=1;
            }
            else if(object.name=="page2"){
                document.body.style.cursor = "pointer"
                pageselector.position.x=-1.88;
                if(currentpenpage==1 && currentpage!=2){
                    video.src = "./src/videos/cat2.mp4";video.load();video.play();
                }
                else if(currentpenpage==2 && currentpage!=2){
                    video.src = "./src/videos/tt.mp4";video.load();video.play();
                }
                else if(currentpenpage==5 && currentpage!=2){
                    video.src = "./src/videos/malle2.mp4";video.load();video.play();
                }
                else if(currentpenpage==3 && currentpage!=2){
                    video.src = "./src/videos/rockornot2.mp4";video.load();video.play();
                }
                currentpage=2;
            }
            else if(object.name=="page3"){
                document.body.style.cursor = "pointer"
                pageselector.position.x=-1.73;
                if(currentpenpage==1 && currentpage!=3){
                    video.src = "./src/videos/cat3.mp4";video.load();video.play();
                }
                else if(currentpenpage==2 && currentpage!=3){
                    video.src = "./src/videos/tt3.mp4";video.load();video.play();
                }
                else if(currentpenpage==5 && currentpage!=3){
                    video.src = "./src/videos/malle3.mp4";video.load();video.play();
                }
                else if(currentpenpage==3 && currentpage!=3){
                    video.src = "./src/videos/rockornot3.mp4";video.load();video.play();
                }
                currentpage=3;
            }
        }
    }
    else if (nowactive=="mail"){
        var intersects = raycaster.intersectObjects( mailpagegroup.children );
        if ( intersects.length > 0 ) {
            var object = intersects[ 0 ].object;
            if(object.name=="linktogithub"){
                linkhover.position.set(object.position.x, object.position.y+0.03, object.position.z);
                document.body.style.cursor = "pointer"
            }
            else if(object.name=="linktoresume"){
                document.body.style.cursor = "pointer"
            }
            else if(object.name=="linktolinkedin"){
                linkhover.position.set(object.position.x, object.position.y+0.03, object.position.z);
                document.body.style.cursor = "pointer"
            }
            else if(object.name=="mailto"){
                linkhover.position.set(object.position.x, object.position.y+0.03, object.position.z);
                document.body.style.cursor = "pointer"
            }
        }
    }
    else if(nowactive=="art"){
        var intersects = raycaster.intersectObjects( artpagegroup.children );
        if ( intersects.length > 0 ) {
            var object = intersects[ 0 ].object;
            if(object.name=="nextartpage"){
                document.body.style.cursor = "pointer"
            }
            else if(object.name=="prevartpage"){
                document.body.style.cursor = "pointer"
            }
        }   
    }

    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( navgroup.children );
    if ( intersects.length > 0 ) {
            var object = intersects[ 0 ].object;
            if(object.name=="phonescreen"){
                document.body.style.cursor = "pointer"
                clicked=true;
                object.material.color=new THREE.Color(1,1,1),
                playergroup.visible=true;
                playertext.visible=true;
            }
            else{
                phonescreen.material.color=new THREE.Color(0,0,0);
                playergroup.visible=false;
                playertext.visible=false;
                if(object.name=="home" && nowactive!="home"){
                    def.visible=false;
                    sketchfabmodels.style.display="none";
                    document.body.style.cursor = "pointer"
                    nowactive = "home";
                    activemesh.position.y = navigatormesh.position.y + 0.2 ;
                    home.position.z = navigatormesh.position.z+0.20;
                    pen.position.z = navigatormesh.position.z+0.04;
                    mail.position.z = navigatormesh.position.z+0.04;
                    art.position.z = navigatormesh.position.z+0.04;
                    whiterectangle.position.y =  navigatormesh.position.y + 0.1;
                    penpages[currentpenpage].visible=false;
                    penpagegroup.visible=false;
                    mailpagegroup.visible=false;
                    artpagegroup.visible=false;
                    homepagegroup.visible=true;
                    screen.material = screenmaterial;
                    video.src = "./src/videos/home.mp4";
                    video.load(); // must call after setting/changing source
                    video.play();
                }
                else if(object.name=="pen" && nowactive!="pen"){
                    def.visible=false;
                    sketchfabmodels.style.display="none";
                    document.body.style.cursor = "pointer"
                    nowactive = "pen";
                    activemesh.position.y = navigatormesh.position.y + 0.2 - 0.2;
                    home.position.z = navigatormesh.position.z+0.04;
                    pen.position.z = navigatormesh.position.z+0.20;
                    mail.position.z = navigatormesh.position.z+0.04;                    
                    art.position.z = navigatormesh.position.z+0.04;
                    whiterectangle.position.y =  navigatormesh.position.y - 0.1;                    
                    homepagegroup.visible=false;
                    mailpagegroup.visible=false;
                    artpagegroup.visible=false;
                    penpagegroup.visible=true;
                    penpages[currentpenpage].visible=true;
                    if(currentpenpage==0) video.src = "./src/videos/Echost Teaser.mp4";
                    if(currentpenpage==1) video.src = "./src/videos/cat.mp4";
                    video.load(); // must call after setting/changing source
                    video.play();
                }
                else if(object.name=="mail" && nowactive!="mail"){
                    def.visible=true;
                    sketchfabmodels.style.display="none";
                    document.body.style.cursor = "pointer"
                    nowactive = "mail";
                    activemesh.position.y = navigatormesh.position.y + 0.2 - 0.6;
                    home.position.z = navigatormesh.position.z+0.04;
                    pen.position.z = navigatormesh.position.z+0.04;
                    mail.position.z = navigatormesh.position.z+0.20;
                    art.position.z = navigatormesh.position.z+0.04;
                    whiterectangle.position.y =  navigatormesh.position.y - 0.5;
                    homepagegroup.visible=false;
                    penpages[currentpenpage].visible=false;
                    penpagegroup.visible=false;
                    artpagegroup.visible=false;
                    mailpagegroup.visible=true;
                    video.src = "./src/videos/resume.mp4";
                    video.load(); // must call after setting/changing source
                    video.play();
                    //var loader = new THREE.TextureLoader();
                    //var texture = loader.load('./src/images/resume.png');
                    //screen.material = new THREE.MeshBasicMaterial({map:texture, color:new THREE.Color(0.7,0.7,0.7)})
                }
                else if(object.name=="art" && nowactive!="art"){
                    document.body.style.cursor = "pointer"
                    nowactive = "art";
                    sketchfabmodels.style.display="block";
                    if(currentartpage==0){
                        sketchfab1.style.display="block";
                    }
                    activemesh.position.y = navigatormesh.position.y + 0.2 - 0.4;
                    home.position.z = navigatormesh.position.z+0.04;
                    pen.position.z = navigatormesh.position.z+0.04;
                    mail.position.z = navigatormesh.position.z+0.04;
                    art.position.z = navigatormesh.position.z+0.20;
                    whiterectangle.position.y =  navigatormesh.position.y - 0.3;
                    homepagegroup.visible=false;
                    penpages[currentpenpage].visible=false;
                    penpagegroup.visible=false;
                    mailpagegroup.visible=false;                    
                    artpagegroup.visible=true;
                }
            }
    }

}