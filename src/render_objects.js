import { json_str } from "./icon_data.js";
import { waypoint_path } from "./shortest_path.js";

var points_collection = JSON.parse(json_str);

//now only the path shows up. 
filterPoints(waypoint_path);
console.log("points_collection: ", points_collection)

let camera, scene, renderer;
let mesh;

var heading = -1;
const startBtn = document.querySelector(".start-btn");
const isIOS = navigator.userAgent.match(/(iPod|iPhone|iPad)/) && navigator.userAgent.match(/AppleWebKit/);
window.addEventListener("resize", onWindowResize, false);
startBtn.addEventListener('click', startCompass);

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

			//

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
          createPoints(heading);

					navigator.xr.requestSession( 'immersive-ar', sessionInit ).then( onSessionStarted );

				} else {

					currentSession.end();

				}

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
  Black: "rgb(0, 0, 0)",
};

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

function filterPoints(points_list){
	//filters points_collection so that only POIs along the path are displayed.
	points_collection = points_collection.filter( (element) => points_list.indexOf(element) >= 0 )
}

function init() {
  const container = document.createElement("div");
  document.body.appendChild(container);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    40
  );

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.xr.enabled = true; 
  container.appendChild(renderer.domElement);

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
