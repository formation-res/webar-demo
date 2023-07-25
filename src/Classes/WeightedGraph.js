// Priority Queue class
class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(item, priority) {
    this.queue.push({ item, priority });
    this.queue.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    if (this.isEmpty()) return null;
    return this.queue.shift().item;
  }

  isEmpty() {
    return this.queue.length === 0;
  }
}


// WeightedGraph class
export class WeightedGraph {
  constructor() {
    this.adjacencyList = new Map();
  }

  addVertex(vertex) {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }

  addEdge(vertex1, vertex2, weight) {
    if (vertex1 === vertex2){
      //console.log("Cannot make self-edges!");
      return;
    }
    if (this.isEdge(vertex1, vertex2)) {
      //console.log("cannot make duplicate edges!")
      return;
    }

    this.adjacencyList.get(vertex1).push({ node: vertex2, weight });
    this.adjacencyList.get(vertex2).push({ node: vertex1, weight });
  }

  // Helper function to get the minimum distance vertex from the distance set
  getMinimumVertex(vertices, distances) {
    let minVertex = null;
    for (const vertex of vertices) {
      if (!minVertex || distances[vertex] < distances[minVertex]) {
        minVertex = vertex;
      }
    }
    return minVertex;
  }

  isEdge(vertex1, vertex2) {
    if (!this.adjacencyList.has(vertex1) || !this.adjacencyList.has(vertex2)) {
      return false;
    }

    const edgesOfVertex1 = this.adjacencyList.get(vertex1);
    for (const neighbor of edgesOfVertex1) {
      if (neighbor.node === vertex2) {
        return true;
      }
    }

    return false;
  }

  // Dijkstra's algorithm to find the shortest path between two vertices
  findShortestPath(start, target) {
    const distances = {};
    const previous = {};
    const vertices = new Set();
  
    // Initialize distances with Infinity and previous with null
    for (const vertex of this.adjacencyList.keys()) {
      distances[vertex] = Infinity;
      previous[vertex] = null;
      vertices.add(vertex);
    }
  
    distances[start] = 0;
    const priorityQueue = new PriorityQueue();
    priorityQueue.enqueue(start, 0);
  
    while (!priorityQueue.isEmpty()) {
      const currentVertex = priorityQueue.dequeue();
  
      if (currentVertex === target) {
        const path = [];
        let vertex = target;
        while (vertex !== null) {
          path.unshift(vertex);
          vertex = previous[vertex];
        }

      // Calculate and display the total distance of the path
      const totalDistance = distances[target];
      //console.log('Total distance:', totalDistance);

      return path;
      }
  
      if (currentVertex && distances[currentVertex] !== Infinity) {
        for (const neighbor of this.adjacencyList.get(currentVertex)) {
          const { node, weight } = neighbor;
          const candidateDistance = distances[currentVertex] + weight;
  
          if (candidateDistance < distances[node]) {
            distances[node] = candidateDistance;
            previous[node] = currentVertex;
            priorityQueue.enqueue(node, candidateDistance);
          }
        }
      }
    }
  
    // If there is no path between the start and target vertices
    if (distances[target] === Infinity) {
      return null;
    }
  
    return null; // Should not reach this point, but adding for clarity
  }

  printVertices() {
    for (const vertex of this.adjacencyList.keys()) {
      console.log(vertex);
    }
  }

} //end WeightedGraph class

export function distanceBetweenPoints(x1, y1, x2, y2) {
  const distanceX = x2 - x1;
  const distanceY = y2 - y1;
  const distanceSquared = distanceX ** 2 + distanceY ** 2;
  const distance = Math.sqrt(distanceSquared);
  return distance;
}

export function findAngle(p1,p2) {
   /*       Find the angle between two points.       */
  const distance_x = p2[0] - p1[0];
  const distance_y = p2[1] - p1[1];

  const angle_radians = Math.atan2(distance_y, distance_x);
  let angle_degrees = (angle_radians * 180) / Math.PI;
  let fixed_angle_degrees = (angle_degrees + 360) % 360;
  return fixed_angle_degrees;
}