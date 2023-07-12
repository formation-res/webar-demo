import { ARButton } from "https://unpkg.com/three@0.126.0/examples/jsm/webxr/ARButton.js";

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

var points_collection = JSON.parse(json_str);
//console.log(points_collection.length);

let camera, scene, renderer;
let mesh;

function translatePoints(points, angle) {
  for ( i = 0; i < points_collection.length ; i++) {
      var x = points_collection[i].x
      var y = points_collection[i].y
      var radians = (Math.PI / 180) * angle
      //set up the translation.
      cos = Math.cos(radians)
      sin = Math.sin(radians)
      points_collection[i].x = (cos * x) + (sin * y )
      points_collection[i].x = (cos * y) + (sin * x )
    }
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

  for (var i = 0; i < points_collection.length; i++) {
    var real_color = "";
    if (colors[points_collection[i].color] != null) {
      real_color = colors[points_collection[i].color];
      //console.log(real_color);
    } else {
      real_color = "rgb(0, 0, 0)"; //black by default
    }

    const geometry = new THREE.IcosahedronGeometry(0.1, 1);
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(real_color),
      shininess: 6,
      flatShading: true,
      transparent: 1,
      opacity: 0.8,
    });

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
      points_collection[i].x * 1,
      0,
      points_collection[i].y * 1
    );
    scene.add(mesh);

    console.log(points_collection[i].x * 1);
  }
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

/*  Requesting permission to use device orientation */
var heading = 0;
var isOriented = 0;
const startBtn = document.querySelector(".start-btn");
const isIOS = navigator.userAgent.match(/(iPod|iPhone|iPad)/) && navigator.userAgent.match(/AppleWebKit/);
if (!isIOS) { //if not iOS, then we can just do this automatically.
  window.addEventListener("absolutedeviceorientation", handleOrientation, true);
  document.getElementById("testingBtn").textContent = "not iOS"
}

startBtn.addEventListener('click', startCompass);
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
	}
}

function handleOrientation(e){
 heading = e.webkitCompassHeading || Math.abs(e.alpha - 360);
 document.getElementById("headingBtn").textContent = heading;
if ( isOriented == 0) {
translatePoints(points_collection, heading);
init();
animate();
document.body.appendChild(ARButton.createButton(renderer));
isOriented = 1;
}
}

//run this AFTER configuring the orienation (must use a button because of iOS)



window.addEventListener("resize", onWindowResize, false);
