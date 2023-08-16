import { json_str } from "./data/icon_data.js";

//hide the buttons
document.getElementById("start-btn").style.display = 'none';
document.getElementById("headingBtn").style.display = 'none';
document.getElementById("testingBtn").style.display = 'none';


let temp, clickedItem, start, end;
var titles = JSON.parse(content_str);
var round = 1;


const list = titles
const output = document.querySelector(".output");
const search = document.querySelector(".filter-input");

window.addEventListener("DOMContentLoaded", loadList);
search.addEventListener("input", filter);


function loadList() {
    let temp = `<ul class="list-items">`;
    list.forEach((item) => {
        temp += `<li class="list-item"> <a onclick="handleItemClick(event)">${item['title']}  (${item['id']})</a> </li>`;
    });
    temp += `</ul>`;
    output.innerHTML = temp;
    output.addEventListener("click", handleItemClick);
}


function filter(e) {
    let temp = '';
    const result  = list.filter(item=> item['title'].toLowerCase().includes(e.target.value.toLowerCase()));
    if(result.length>0){
        temp = `<ul class="list-items">`;
        result.forEach((item) => {
            temp += `<li class="list-item"> <a onclick="handleItemClick(event)">${item['title']}  (${item['id']})</a> </li>`;
        });
        temp += `</ul>`;
    }else{
        temp =`<div class="no-item"> No Item Found </div>`;
    }
    output.innerHTML =temp;
    output.addEventListener("click", handleItemClick);
}


function handleItemClick(event) {
	temp = event.target.textContent;
    clickedItem = temp.trim().split(/\s{2}/);;
    console.log(`Clicked item: ${clickedItem}`);

	var container = document.querySelector('.container');
	for (let i = 0; i < list.length; i++) {
		if (list[i]['id'] === clickedItem[1].substring(1, clickedItem[1].length - 1)) {
			if (round === 1) {
				start = list[i];
				console.log(`START: ${start}`);
				if (window.confirm(`CONFIRM: You chose "${clickedItem[0]}" as your current position.`)) {
					round = 2;
					const headings = document.querySelectorAll('.container h1');
					if (headings.length >= 2) {
						headings[1].textContent = "choose your DESTINATION:";
					}
					list.splice(i, 1);
					loadList();
				} else {
					console.log('cancel');
				}
				break;
			} else {
				end = list[i];
				console.log(`END: ${end}`);
				if (window.confirm(`CONFIRM: Do you want to navigate to "${clickedItem[0]}"?`)) {
					container.remove();
				} else {
					console.log('cancel');
				}
				break;
			}
		}
	}
}

let final_path = []

const form = document.getElementById('dataForm');

form.addEventListener('submit', async (event) => {

	event.preventDefault();
	const message = [start['id'], end['id']];
	//   console.log(message);

	const url = "/shortest_path";             //computer

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ message }),
	});

	final_path = await response.json();
	console.log(final_path, "YEs")

	//switch the display
	document.getElementById("start-btn").style.display = 'block';
	document.getElementById("headingBtn").style.display = 'block';
	document.getElementById("testingBtn").style.display = 'block';

	document.getElementById("dataForm").style.display = 'none';

	const startBtn = document.querySelector(".start-btn");
	startBtn.addEventListener('click', startCompass); //nothing can happen until we add this.
	//   console.log(result);

});


//console.log(waypoint_collection);
// console.log(final_path);	//we want final path to be an array or POINTS, not an array of IDs....
var points_collection = JSON.parse(json_str);

let camera, scene, renderer;
let mesh;
var heading = -1;

const isIOS = navigator.userAgent.match(/(iPod|iPhone|iPad)/) && navigator.userAgent.match(/AppleWebKit/);
window.addEventListener("resize", onWindowResize, false);



class ARButton {
	static createButton(renderer, sessionInit = {}) {
		const button = document.createElement('button');
		function showStartAR( /*device*/) {

			if (sessionInit.domOverlay === undefined) {

				var overlay = document.createElement('div');
				overlay.style.display = 'none';
				document.body.appendChild(overlay);

				var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
				svg.setAttribute('width', 38);
				svg.setAttribute('height', 38);
				svg.style.position = 'absolute';
				svg.style.right = '20px';
				svg.style.top = '20px';
				svg.addEventListener('click', function () {

					currentSession.end();

				});
				overlay.appendChild(svg);

				var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
				path.setAttribute('d', 'M 12,12 L 28,28 M 28,12 12,28');
				path.setAttribute('stroke', '#fff');
				path.setAttribute('stroke-width', 2);
				svg.appendChild(path);

				if (sessionInit.optionalFeatures === undefined) {

					sessionInit.optionalFeatures = [];

				}
				sessionInit.optionalFeatures.push('dom-overlay');
				sessionInit.domOverlay = { root: overlay };
			}

			let currentSession = null;

			async function onSessionStarted(session) {

				session.addEventListener('end', onSessionEnded);

				renderer.xr.setReferenceSpaceType('local');

				await renderer.xr.setSession(session);

				button.textContent = 'STOP AR';
				sessionInit.domOverlay.root.style.display = '';

				currentSession = session;

			}

			function onSessionEnded( /*event*/) {

				currentSession.removeEventListener('end', onSessionEnded);

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

				if (currentSession === null) {
						if (final_path.length) {
							createPath(final_path, heading);
							navigator.xr.requestSession('immersive-ar', sessionInit).then(onSessionStarted);
						}
						else {
							alert("No path found!")
						}
					}

				 else {
					currentSession.end();
					location.reload();
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

		function stylizeElement(element) {

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
		if ('xr' in navigator) {

			button.id = 'ARButton';
			button.style.display = 'none';
			stylizeElement(button);

			navigator.xr.isSessionSupported('immersive-ar').then(function (supported) {

				supported ? showStartAR() : showARNotSupported();

			}).catch(showARNotSupported);

			return button;
		} else {

			const message = document.createElement('a');

			if (window.isSecureContext === false) {
				message.href = document.location.href.replace(/^http:/, 'https:');
				message.innerHTML = 'WEBXR NEEDS HTTPS'; // TODO Improve message

			} else {
				message.href = 'https://immersiveweb.dev/';
				message.innerHTML = 'WEBXR NOT AVAILABLE';

			}
			message.style.left = 'calc(50% - 90px)';
			message.style.width = '180px';
			message.style.textDecoration = 'none';

			stylizeElement(message);

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
	let vertices = [];

	for (let i = 0; i < points.length; i++) {
		const point1 = points[i];
		var x = point1.x;
		var y = point1.y;

		//translate
		var radians = (Math.PI / 180) * (angle);
		var cos = Math.cos(radians);
		var sin = Math.sin(radians);
		var newX = (cos * x) - (sin * y);
		var newY = (cos * y) + (sin * x);

		const floorHeight = -1.2;
		const pointA = new THREE.Vector3(newX, floorHeight, -newY);

		vertices.push(pointA);
	}
	console.log(vertices)

	const thickness = 0.1;

	for (let i = 1; i < vertices.length; i++) {
		const point1 = vertices[i - 1];
		const point2 = vertices[i];
		const lineTube = createLineTubeGeometry(point1, point2, thickness);

		scene.add(lineTube);
	}

}

function createLineTubeGeometry(p1, p2, thickness) {
	const direction = new THREE.Vector3().subVectors(p2, p1);
	const length = direction.length();
	const center = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);

	const geometry = new THREE.CylinderBufferGeometry(thickness, thickness, length, 8);
	const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green color

	const line = new THREE.Mesh(geometry, material);
	line.position.copy(center);
	line.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());

	return line;
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

function startCompass() {
	console.log(start);
	console.log(end);
	if (isIOS) {
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
	document.getElementById("start-btn").style.display = 'none';
}

function handleOrientation(e) {
	heading = e.webkitCompassHeading || Math.abs(e.alpha - 360);
	document.getElementById("headingBtn").textContent = heading;
}
