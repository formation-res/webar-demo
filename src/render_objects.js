import { json_str } from "./data/icon_data.js";
import { waypoint_collection, final_path, test_points} from "./shortest_path.js";


/* 
Going to make this two separate versions: one to display the waypoints and path, and one to display just the icons. 
-Version1: perhaps can tap the icons to do something useful or just visualize certain things.
-Version2: navigation with waypoints that are invisible and show path of green to destination icon. start + dest are visible 

-Version3 : creates the path that we want to show, plus the starting POI and ending POI. 
*/

const version = 4;

console.log(waypoint_collection);
console.log(final_path);	//we want final path to be an array or POINTS, not an array of IDs....
var points_collection = JSON.parse(json_str);


let camera, scene, renderer;
let mesh;
var heading = -1;
const startBtn = document.querySelector(".start-btn");
const isIOS = navigator.userAgent.match(/(iPod|iPhone|iPad)/) && navigator.userAgent.match(/AppleWebKit/);
window.addEventListener("resize", onWindowResize, false);
startBtn.addEventListener('click', startCompass); //nothing can happen until we add this.

class ARButton {
	static createButton( renderer, sessionInit = {} ) {
		const button = document.createElement( 'button' );
		function showStartAR( /*device*/ ) {

			if ( sessionInit.domOverlay === undefined ) {

				var overlay = document.createElement( 'div' );
				overlay.style.display = 'none';
				document.body.appendChild( overlay );

				var svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
				svg.setAttribute( 'width', 38 );
				svg.setAttribute( 'height', 38 );
				svg.style.position = 'absolute';
				svg.style.right = '20px';
				svg.style.top = '20px';
				svg.addEventListener( 'click', function () {

					currentSession.end();

				} );
				overlay.appendChild( svg );

				var path = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );
				path.setAttribute( 'd', 'M 12,12 L 28,28 M 28,12 12,28' );
				path.setAttribute( 'stroke', '#fff' );
				path.setAttribute( 'stroke-width', 2 );
				svg.appendChild( path );

				if ( sessionInit.optionalFeatures === undefined ) {

					sessionInit.optionalFeatures = [];

				}
				sessionInit.optionalFeatures.push( 'dom-overlay' );
				sessionInit.domOverlay = { root: overlay };
			}

			let currentSession = null;

			async function onSessionStarted( session ) {

				session.addEventListener( 'end', onSessionEnded );

				renderer.xr.setReferenceSpaceType( 'local' );

				await renderer.xr.setSession( session );

				button.textContent = 'STOP AR';
				sessionInit.domOverlay.root.style.display = '';

				currentSession = session;

			}

			function onSessionEnded( /*event*/ ) {

				currentSession.removeEventListener( 'end', onSessionEnded );

				button.textContent = 'START AR';
				sessionInit.domOverlay.root.style.display = 'none';

				currentSession = null;
			}

			button.style.display = '';
			button.style.cursor = 'pointer';
			button.style.left = 'calc(50% - 50px)';
			button.style.width = '100px';
			button.textContent = 'START AR';

			button.onmouseenter = function () {
				button.style.opacity = '1.0';
			};

			button.onmouseleave = function () {
				button.style.opacity = '0.5';
			};

			button.onclick = function () {

				if ( currentSession === null ) {

          //before starting the session, create all the points.
        if (version === 1) 
		  	{ 
				createPoints(heading);
				navigator.xr.requestSession( 'immersive-ar', sessionInit ).then( onSessionStarted );

			}
		else if (version === 2)
			{
				createWayPoints(heading);
				navigator.xr.requestSession( 'immersive-ar', sessionInit ).then( onSessionStarted );

			}
			else if ( version === 3) {
				if (final_path.length) {
					createPath(final_path, heading);
					createWayPoints(heading);
					navigator.xr.requestSession( 'immersive-ar', sessionInit ).then( onSessionStarted );
				}
				else {
					alert("No path found!")
				}
			}
			else if (version === 4){
				translateTestPoints(test_points,heading)
				navigator.xr.requestSession( 'immersive-ar', sessionInit ).then( onSessionStarted );
			}
				

				} else {
					currentSession.end();
				}
			
				//get list of waypoints.

			};
		}

		function disableButton() {

			button.style.display = '';
			button.style.cursor = 'auto';
			button.style.left = 'calc(50% - 75px)';
			button.style.width = '150px';

			button.onmouseenter = null;
			button.onmouseleave = null;
			button.onclick = null;
		}

		function showARNotSupported() {

			disableButton();
			button.textContent = 'AR NOT SUPPORTED';
		}

		function stylizeElement( element ) {

			element.style.position = 'absolute';
			element.style.bottom = '20px';
			element.style.padding = '12px 6px';
			element.style.border = '1px solid #fff';
			element.style.borderRadius = '4px';
			element.style.background = 'rgba(0,0,0,0.1)';
			element.style.color = '#fff';
			element.style.font = 'normal 13px sans-serif';
			element.style.textAlign = 'center';
			element.style.opacity = '0.5';
			element.style.outline = 'none';
			element.style.zIndex = '999';
		}
		if ( 'xr' in navigator ) {

			button.id = 'ARButton';
			button.style.display = 'none';
			stylizeElement( button );

			navigator.xr.isSessionSupported( 'immersive-ar' ).then( function ( supported ) {

				supported ? showStartAR() : showARNotSupported();

			} ).catch( showARNotSupported );

			return button;
		} else {

			const message = document.createElement( 'a' );

			if ( window.isSecureContext === false ) {
				message.href = document.location.href.replace( /^http:/, 'https:' );
				message.innerHTML = 'WEBXR NEEDS HTTPS'; // TODO Improve message

			} else {
				message.href = 'https://immersiveweb.dev/';
				message.innerHTML = 'WEBXR NOT AVAILABLE';

			}
			message.style.left = 'calc(50% - 90px)';
			message.style.width = '180px';
			message.style.textDecoration = 'none';

			stylizeElement( message );

			return message;
		}
	}
}

const colors = {
  LightBlueAlt: "rgb(67, 162, 218)",
  Red: "rgb(255, 39, 39)",
  DarkMagenta: "rgb(166, 50, 89)",
  DarkGreen: "rgb(0, 174, 28)",
  Grey: "#rgb(94, 94, 94)",
  Orange: "rgb(255, 169, 39)",
  LightGreen: "rgb(162, 248, 22)",
  DarkBlue: "rgb(18, 51, 59)",
  LightGreenAlt: "rgb(206, 222, 66)",
  GreenAlt: "rgb(80, 187, 104)",
  Turquoise: "rgb(0, 215, 176)",
  LightGrey: "rgb(241, 241, 241)",
  DarkRed: "rgb(183, 28, 47)",
  Blue: "rgb(6, 123, 189)",
  DarkOrange: "rgb(208, 111, 40)",
  LightBlue: "rgb(172, 218, 252)",
  AquaMarine: "rgb(22, 193, 248)",
  Yellow: "rgb(255, 255, 0)",
  Black: "rgb(0, 0, 0)",
};

function createPath(points, angle) {

	const lineMaterial = new THREE.ShaderMaterial({
		uniforms: {
		  color: { value: new THREE.Color(0x00ff00) }, // Line color
		  linewidth: { value: 0.9 } // Adjust this value for the desired line thickness
		},
		vertexShader: `
		  uniform float linewidth;
		  void main() {
			vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
			gl_Position = projectionMatrix * mvPosition;
			gl_PointSize = linewidth;
		  }
		`,
		fragmentShader: `
		  uniform vec3 color;
		  void main() {
			gl_FragColor = vec4(color, 1.0);
		  }
		`
	  });

	  const lineGeometry = new THREE.BufferGeometry();
	  const vertices = [];
  
	// Create connected lines by iterating through the points
	for (let i = 0; i < points.length; i++) {
	  const point1 = points[i];

	  //translate based on the heading angle
	  var x = point1.x;
	  var y = point1.y;

	  //alert(`old x: ${x} and old z: ${y}`);
	   var radians = (Math.PI / 180) * (angle);
		var cos = Math.cos(radians);
		  var sin = Math.sin(radians);
		  var newX = (cos * x) - (sin * y);
		  var newY = (cos * y) + (sin * x); 
		  const floorHeight = -1.2;
		  const pointA = {x : newX, z : -newY, y : floorHeight};
		  //console.log(pointA)		//new adjusted point

		  //alert(`new x: ${newX} and new z: ${-newY}   SHOULD BE TRANSLATED BY HEADING`);
  
			vertices.push(pointA.x, pointA.y, pointA.z);
		  }

		  lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
	  const line = new THREE.Line(lineGeometry, lineMaterial);
	  scene.add(line);
	}


//for version 1
function createPoints(angle) {
  for (var i = 0; i < points_collection.length; i++) {

    //get the color
    var real_color = "";
    if (colors[points_collection[i].color] != null) { real_color = colors[points_collection[i].color]; } 
    else  { real_color = "rgb(0, 0, 0)"; }

    const geometry = new THREE.IcosahedronGeometry(0.1, 1);
    const material = new THREE.MeshPhongMaterial
    ({
      color: new THREE.Color(real_color),
      shininess: 6,
      flatShading: true,
      transparent: 1,
      opacity: 0.8,
    });

    //adjusted for the angle
    var x = points_collection[i].x;
    var y = points_collection[i].y;
    var radians = (Math.PI / 180) * angle;
    var cos = Math.cos(radians);
    var sin = Math.sin(radians);
    var newX = (cos * x) - (sin * y);
    var newY = (cos * y) + (sin * x); //must be negative because -z = +y north

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set( newX, 0, -newY);
    scene.add(mesh)
    
    }
}

//same as createPoints, but for waypoints (which for some reason is in a different format).
function createWayPoints(angle){
	for (const element in waypoint_collection) {

		//get the color
		var real_color = "";
		if (colors[waypoint_collection[element].color] != null) { real_color = colors[waypoint_collection[element].color]; } 
		else  { real_color = "rgb(0, 0, 0)"; }

		if (element === "PpvGjpxbS56-Gmymffxt8g")	//enterence waypoint
		{
			real_color = "rgb(255, 39, 39)";
		}
	
		console.log(real_color);
		const geometry = new THREE.IcosahedronGeometry(0.1, 1);
		const material = new THREE.MeshPhongMaterial
		({
		  color: new THREE.Color(real_color),
		  shininess: 6,
		  flatShading: true,
		  transparent: 1,
		  opacity: 0.8,
		});
	
		//adjusted for the angle
		// var dis = waypoint_collection[element].distance;
		// var ang = waypoint_collection[element].angle;

		var x = waypoint_collection[element].x;
		var y = waypoint_collection[element].y;

		 var radians = (Math.PI / 180) * (angle);
	     var cos = Math.cos(radians);
   		 var sin = Math.sin(radians);
   		 var newX = (cos * x) - (sin * y);
   		 var newY = (cos * y) + (sin * x); 

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set( newX, 0, -newY);
    scene.add(mesh)
		}
}

function translateTestPoints(points,angle){


	var real_color = "rgb(0, 0, 0)";
    const geometry = new THREE.IcosahedronGeometry(0.1, 1);
    const material = new THREE.MeshPhongMaterial
    ({
      color: new THREE.Color(real_color),
      shininess: 6,
      flatShading: true,
      transparent: 1,
      opacity: 0.8,
    });

	for (var i = 0; i < points.length; i++){
		    //adjusted for the angle
			var x = points[i].x;
			var y = points[i].y;
			var radians = (Math.PI / 180) * angle;
			var cos = Math.cos(radians);
			var sin = Math.sin(radians);
			var newX = (cos * x) - (sin * y);
			var newY = (cos * y) + (sin * x); //must be negative because -z = +y north
		
			mesh = new THREE.Mesh(geometry, material);
			mesh.position.set( newX, 0, -newY);
			scene.add(mesh)
			
	}
}

//used during testing
function filterPoints(){
	//filters points_collection so that only POIs along the path are displayed.
	let newArr = [];
	let waypoint_clone= [];
	newArr = points_collection.filter( (element) => waypoint_path.indexOf(element.id) >= 0 )
	
	//to correct the order
	for (var i = 0; i< waypoint_path.length; i++) {
		for (var j = 0; j < newArr.length; j++) {
			if (newArr[j].id === waypoint_path[i]) {
				waypoint_clone[i] = newArr[j];
			}
		}
	}
	return waypoint_clone;
}

function init() {
  const container = document.createElement("div");
  document.body.appendChild(container);

  //initializes the scene in three.js
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 40);
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.xr.enabled = true; 
  container.appendChild(renderer.domElement);

  //mostly defaults
  var light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  light.position.set(0.5, 1, 0.25);
  scene.add(light);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
  renderer.setAnimationLoop(render);
}
function render() {
  renderer.render(scene, camera);
}

function startCompass(){
	if (isIOS){
		DeviceOrientationEvent.requestPermission()
		.then((response) => {
            if (response === "granted") {
              window.addEventListener("deviceorientation", handleOrientation, true);
              document.getElementById("testingBtn").textContent = "iOS"
            } else {
              alert("has to be allowed!");
            }
          })
          .catch(() => alert("not supported"));
	} else {
    window.addEventListener("absolutedeviceorientation", handleOrientation, true);
    document.getElementById("testingBtn").textContent = "not iOS"
  }
  init()
  animate()
  document.body.appendChild(ARButton.createButton(renderer));
}

function handleOrientation(e){
 heading = e.webkitCompassHeading || Math.abs(e.alpha - 360);
 document.getElementById("headingBtn").textContent = heading;
}
