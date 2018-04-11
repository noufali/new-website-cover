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
let prev_clicked = false;
let controls, loader, effect;
let pointLight, pointLight2;
let light_sources = [];
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
	renderer.shadowMap.autoUpdate = true;
	container.appendChild(renderer.domElement);
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x222222 );
	camera = new THREE.PerspectiveCamera(60, wid/hei, 0.1, 2000);
	// dollyCam = new THREE.PerspectiveCamera();
	// dollyCam.add(camera);
	// scene.add(dollyCam);

	// controls = new THREE.OrbitControls( camera );
	// controls.target.set( 0, 0, 0 );
	// controls.update();

	// camera.position.set(-86.95797110098906,   -3.571536128474456,   139.4166129600535);
	// camera.rotation.set( -0.2160542551663327, -0.35443077885459445,  -0.0760251675039741);
	camera.focus = 10;
	// camera.matrix.fromArray(cam_array);
	// camera.matrix.decompose(camera.position, camera.quaternion, camera.scale);
	// camera.quaternion.set(-0.09026617734075532, -0.2400304459020302, -0.022422273552483593, 0.9662994587171708);
	camera.position.set(-100.31179766825836, -34.70840403385185,  78.839936443855);
	camera.rotation.set(-0.1961224731182619, -0.5183480659355434, -0.09811729163485307);
	camera.updateProjectionMatrix();
	//camera.lookAt(new THREE.Vector3(0,0,50));



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
					// shininess: 10,
					specular: 0x111111,
					side: THREE.BackSide
				} );
	let cube = new THREE.Mesh( geometry, boxMaterial );
	cube.receiveShadow = true;
	cube.position.set(0,0,0);
	scene.add( cube );

	let plane_geo = new THREE.PlaneGeometry(400, 1000, 2, 2);
	let plane_mat = new THREE.MeshPhongMaterial( {
					color: 0xa0adaf,
					// shininess: 10,
					specular: 0x111111,
					side: THREE.DoubleSide
				} );
	let plane = new THREE.Mesh(plane_geo, plane_mat);
	plane.receiveShadow = true;
	plane.rotation.x = Math.PI/2;
	plane.position.y = -200;
	// scene.add(plane);

	let wall1 = new THREE.Mesh(plane_geo, plane_mat);
	wall1.receiveShadow = true;
	wall1.rotation.y = Math.PI/2;
	wall1.rotation.z = Math.PI/2;
	wall1.position.set(-200, 0, 0);
	// scene.add(wall1);

	let wall2 = new THREE.Mesh(plane_geo, plane_mat);
	wall2.receiveShadow = true;
	wall2.rotation.y = Math.PI/2;
	wall2.rotation.z = Math.PI/2;
	wall2.position.set( 200, 0, 0);
	// scene.add(wall2);

	// model
	var manager = new THREE.LoadingManager();
	var textureLoader = new THREE.TextureLoader( manager );
	var texture = textureLoader.load( 'models/gorilla_metalness1_2k2.png' );
	var loader = new THREE.FBXLoader();
	loader.load( 'models/Gorilla_Dancing.fbx', function ( object ) {
		object.mixer = new THREE.AnimationMixer( object );
		mixers.push( object.mixer );
		action = object.mixer.clipAction( object.animations[ 0 ] );
		action.play();
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				// child.material = new THREE.MeshLambertMaterial({
				// 	color: 0xffffff,
				// 	map: texture,
				// 	skinning: true,
				// 	side: THREE.DoubleSide
				// });
				// child.material.map = texture;
				child.castShadow = true;
				child.receiveShadow = true;
			}
		} );
		scene.add( object );
		object.scale.set(1.3, 1.3, 1.3)
	  object.position.set(0,-200,-100);
	} );
	console.log(loader);

	// LIGHTS!
	let ambient = new THREE.AmbientLight( 0x3BAB60, 0.1);
	ambient.castShadow = true;
	// scene.add( ambient );

	pointLight = new THREE.PointLight(0xff0000, 2, 500, 1);
	pointLight.position.set(0, 0, 0);
	let lightGeo1 = new THREE.SphereGeometry( 0.5, 12, 12 );
	let lightMat1 = new THREE.MeshPhongMaterial( {
		side: THREE.DoubleSide,
		alphaTest: 0.5
	} );
	let lightMesh1 = new THREE.Mesh( lightGeo1, lightMat1 );
	lightMesh1.castShadow = true;
	lightMesh1.receiveShadow = true;
	// pointLight.add( lightMesh1 );
	pointLight.castShadow = true;
	light_sources.push(pointLight);
	scene.add(pointLight);


	pointLight2 = new THREE.PointLight(0x0000D0, 2, 500, 1);
	pointLight2.position.set(0, 0, 0);
	let lightGeo2 = new THREE.SphereGeometry( 0.5, 12, 12 );
	let lightMat2 = new THREE.MeshPhongMaterial( {
		side: THREE.DoubleSide,
		alphaTest: 0.5
	} );
	let lightMesh2 = new THREE.Mesh( lightGeo2, lightMat2 );
	lightMesh2.castShadow = true;
	lightMesh2.receiveShadow = true;
	// pointLight2.add( lightMesh2 );
	pointLight2.castShadow = true;
	scene.add(pointLight2);
	light_sources.push(pointLight2);
}

function dancing() {
	if (clicked == false) {
		clicked = true;
		button.textContent="FREEZE";
	} else {
		clicked = false;
		button.textContent="DANCE";
	}
}

// EVENTS
function onWindowResize(){
  let wid = window.innerWidth;
  let hei = window.innerHeight;

  renderer.setSize(wid, hei);
	camera.aspect = wid/hei;
  camera.updateProjectionMatrix();
}


function animate() {

	window.requestAnimationFrame(animate);
	let time = performance.now() * 0.001;

	if (clicked == false)
	{
		if( prev_clicked == true ) prev_clicked = false;
		//stay still
	} else {
		if( prev_clicked == false ){
			prev_clicked = true;
			clock.getDelta();
		}
		if ( mixers.length > 0 ) {
			for ( var i = 0; i < mixers.length; i ++ ) {
				mixers[ i ].update( clock.getDelta() );
			}
		}
	}


	pointLight.position.x = Math.sin( time * 0.6 ) * 100;
	pointLight.position.y = Math.sin( time * 0.7 ) * 100 + 50;
	pointLight.position.z = Math.sin( time * 0.8 ) * 200;
	time += 10000;
	pointLight.updateMatrix();
	pointLight.updateMatrixWorld();

	pointLight2.position.x = Math.cos( time * 0.6 ) * 100;
	pointLight2.position.y = Math.cos( time * 0.7 ) * 100 + 50;
	pointLight2.position.z = Math.cos( time * 0.8 ) * 200;
	pointLight2.updateMatrix();
	pointLight2.updateMatrixWorld();


	// controls.update();
	renderer.shadowMap.needsUpdate = true;
	renderer.render(scene, camera);
}
