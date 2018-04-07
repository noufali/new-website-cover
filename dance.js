/* Dance VR Party
*
*	Music Science Hackathon - Feb 02, 2018
*		Nouf Aljowaysir
* 		Aarón Montoya-Moraga
* 			Nicolás Peña-Escarpentier
*/

// global threejs variables
let container, renderer, camera, scene;
let button, action;
let clicked = false;
let controls, loader, effect;
let pointLight, pointLight2;
let circles = [];
let mixers = [];
let clock = new THREE.Clock();

window.addEventListener('load', onLoad);
animate();

function onLoad(){
	container = document.querySelector('#sketch');
	let wid = window.innerWidth;
	let hei = window.innerHeight;

	// THREE INITIALIZATION
	renderer = new THREE.WebGLRenderer({ });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(wid, hei);
	renderer.shadowMap.enabled = true;
	container.appendChild(renderer.domElement);
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x222222 );
	camera = new THREE.PerspectiveCamera(60, wid/hei, 0.1, 2000);
	// dollyCam = new THREE.PerspectiveCamera();
	// dollyCam.add(camera);
	// scene.add(dollyCam);

	camera.position.set(0, 0, 230);
	//camera.lookAt(new THREE.Vector3(0,0,50));
	//camera.target.set(0,0,0);

	controls = new THREE.OrbitControls( camera );
	controls.target.set( 0, 0, 0 );
	controls.minDistance = 0;
	controls.maxDistance = 400;
	controls.minPolarAngle = 0; // radians
  	controls.maxPolarAngle = Math.PI; // radians
	controls.zoomSpeed = 2.0;
	controls.update();

	createEnvironment();
	button = document.getElementById("dance");

	window.addEventListener('resize', onWindowResize, true );
}

// ENVIRONMENT
function createEnvironment(){
	// Room
	let geometry = new THREE.BoxGeometry( 400, 400, 800 );
	let boxMaterial = new THREE.MeshPhongMaterial( {
	color: 0xa0adaf,
	shininess: 10,
	specular: 0x111111,
	side: THREE.DoubleSide
	} );
	let cube = new THREE.Mesh( geometry, boxMaterial );
	cube.receiveShadow = true;
	cube.position.set(0,0,0);
	scene.add( cube );

	// Objects in scene
	let coneGeo = new THREE.ConeGeometry( 100, 300, 300 );
	let conMaterial = new THREE.MeshPhongMaterial( {color: 0xffffff} );
	let cone = new THREE.Mesh( coneGeo, conMaterial );
	cone.position.set(0,0,-380);
	//scene.add( cone );

	let circle = new THREE.SphereGeometry( 50, 50, 50 );
	let circMaterial = new THREE.MeshPhongMaterial( {color: 0xffffff} );

	for (let r=1;r<10;r++) {
		let circleMesh = new THREE.Mesh( circle, circMaterial );
		circles.push(circleMesh);
		circleMesh.position.set(THREE.Math.randInt(-400,400), -450, THREE.Math.randInt(-400,100));
		circleMesh.castShadow = true;
		circleMesh.receiveShadow = false;
		scene.add( circleMesh );
	}
	//circleMesh.position.set(-400,-450,-300);

	//GORILLA

	// model
	var manager = new THREE.LoadingManager();
	var textureLoader = new THREE.TextureLoader( manager );
	var texture = textureLoader.load( 'models/Nouf1_texture.jpg' );
	var loader = new THREE.FBXLoader();
	loader.load( 'models/Samba Dancing.fbx', function ( object ) {
		object.mixer = new THREE.AnimationMixer( object );
		mixers.push( object.mixer );
		action = object.mixer.clipAction( object.animations[ 0 ] );
		action.play();
		object.traverse( function ( child ) {
		if ( child.isMesh ) {
			//child.material.map = texture;
			child.castShadow = true;
			child.receiveShadow = true;
		}
	});
	scene.add( object );
	//object.scale.set(6, 6, 6)
	object.position.set(0,-190,-100);
	} );

	// LIGHTS!
	let ambient = new THREE.AmbientLight( 0x3BAB60,0.5);
	ambient.castShadow = true;
	scene.add( ambient );
	// let d_light = new THREE.DirectionalLight(0xffffff, 1);
	// d_light.position =
	// scene.add(d_light);

	pointLight = new THREE.PointLight(0xff0000, 2, 1000, 1);
	pointLight.position.set(0, 0, 0);
	let lightGeo1 = new THREE.SphereGeometry( 0.5, 50, 50 );
	let lightMat1 = new THREE.MeshPhongMaterial( {
		side: THREE.DoubleSide,
		alphaTest: 0.5
	} );
	let lightMesh1 = new THREE.Mesh( lightGeo1, lightMat1 );
	lightMesh1.castShadow = true;
	lightMesh1.receiveShadow = true;
	//pointLight.add( lightMesh1 );
	pointLight.castShadow = true;

	scene.add(pointLight);

	pointLight2 = new THREE.PointLight(0x0000D0, 2, 1000, 1);
	pointLight2.position.set(0, 0, 0);
	let lightGeo2 = new THREE.SphereGeometry( 0.5, 50, 50 );
	let lightMat2 = new THREE.MeshPhongMaterial( {
		side: THREE.DoubleSide,
		alphaTest: 0.5
	} );
	let lightMesh2 = new THREE.Mesh( lightGeo2, lightMat2 );
	lightMesh2.castShadow = true;
	lightMesh2.receiveShadow = true;
	//pointLight2.add( lightMesh2 );
	pointLight2.castShadow = true;

	scene.add(pointLight2);

}

function dancing() {
	if (clicked == false) {
		clicked = true;
		button.textContent="STOP";
	} else {
		clicked = false;
		button.textContent="DANCE";
	}
}

// EVENTS
function onWindowResize(){
  let wid = window.innerWidth;
  let hei = window.innerHeight;

	//effect.setSize(wid, hei);
  //renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(wid, hei);
	camera.aspect = wid/hei;
  camera.updateProjectionMatrix();
}


// ANIMATION
// function update(){
// 	window.requestAnimationFrame(animate);
// }

function animate() {

	window.requestAnimationFrame(animate);
	let time = performance.now() * 0.001;

	if (clicked == false)
	{
		//stay still
	} else {
		if ( mixers.length > 0 ) {
			for ( var i = 0; i < mixers.length; i ++ ) {
				mixers[ i ].update( clock.getDelta() );
			}
		}
	}
	// if ( mixers.length > 0 ) {
	// 	for ( var i = 0; i < mixers.length; i ++ ) {
	// 		mixers[ i ].update( clock.getDelta() );
	// 	}
	// }

	pointLight.position.x = Math.sin( time * 0.6 ) * 400;
	pointLight.position.y = Math.sin( time * 0.7 ) * 400 + 5;
	pointLight.position.z = Math.sin( time * 0.8 ) * 400;
	pointLight.rotation.x = time;
	pointLight.rotation.z = time;
	time += 10000;

	// pointLight2.position.x = Math.sin( time * 0.6 ) * 200;
	// pointLight2.position.y = Math.sin( time * 0.7 ) * 200 + 5;
	// pointLight2.position.z = Math.sin( time * 0.8 ) * 200;
	// pointLight2.rotation.x = time;
	// pointLight2.rotation.z = time;

	//controls.update();
	renderer.render(scene, camera);
}
