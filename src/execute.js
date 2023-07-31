
export function createPath(points){

// Create connected lines by iterating through the points
for (let i = 1; i < points.length; i++) {
    const point1 = points[i - 1];
    const point2 = points[i];

    console.log(point1)
    console.log(point2)
    const lineEntity = createLineEntity(point1.x, point1.y, point2.x, point2.y);
    console.log(lineEntity);
    document.querySelector('a-scene').appendChild(lineEntity);
}

// Update the lines' position based on surface detection
document.querySelector('a-scene').addEventListener('arjs-nftmarker-found', function (event) {
    const floorMarkerPosition = event.detail.position;

    const lines = document.querySelectorAll('.line');
    lines.forEach((line) => {
        line.object3D.position.set(floorMarkerPosition.x, -0.5, floorMarkerPosition.z);
    });
});

}


// Function to create a line entity and set its attributes
function createLineEntity(x1, z1, x2, z2) {
    const dx = x2 - x1;
    const dz = z2 - z1;
    const d = (dx * dx) + (dz * dz)
    const distance = Math.sqrt(d);

    const centerX = (x1 + x2) / 2;
    const centerZ = (z1 + z2) / 2;

    const thetaX = Math.atan2(dx, dz);

    const lineEntity = document.createElement('a-box');
    lineEntity.setAttribute('class', 'line');
    lineEntity.setAttribute('scale', `0.1 0.1 ${distance}`);
    lineEntity.setAttribute('color', 'green');
    lineEntity.setAttribute('position', `${centerX} 0 ${centerZ}`);
    lineEntity.setAttribute('rotation', `0 ${THREE.Math.radToDeg(thetaX)} 0`);

    return lineEntity;
}

