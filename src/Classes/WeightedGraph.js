export class WeightedGraph {
  constructor() {
    this.adjacencyList = {};
  }

  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }

  addEdge(vertex1, vertex2, weight) {
    if (!this.adjacencyList[vertex1] || !this.adjacencyList[vertex2]) {
      throw new Error("Vertices don't exist in the graph.");
    }

    this.adjacencyList[vertex1].push({ node: vertex2, weight });
    this.adjacencyList[vertex2].push({ node: vertex1, weight });
  }

  // Optional method to remove an edge
  removeEdge(vertex1, vertex2) {
    this.adjacencyList[vertex1] = this.adjacencyList[vertex1].filter(
      (edge) => edge.node !== vertex2
    );
    this.adjacencyList[vertex2] = this.adjacencyList[vertex2].filter(
      (edge) => edge.node !== vertex1
    );
  }

  // Optional method to remove a vertex and its associated edges
  removeVertex(vertex) {
    for (let connectedVertex of this.adjacencyList[vertex]) {
      this.removeEdge(vertex, connectedVertex.node);
    }
    delete this.adjacencyList[vertex];
  }

  printVertices() {
    const vertices = Object.keys(this.adjacencyList);
    if (vertices.length === 0) {
      console.log("The graph is empty. No vertices to print.");
    } else {
      console.log("Vertices in the graph:");
      for (let vertex of vertices) {
        console.log(vertex);
      }
    }
  }
  //where verticies are input as INTEGERS 
  shortestPath(start_vertex, end_vertex) {
    let visited_nodes = []
    let vertex_count = Object.keys(this.adjacencyList).length;
    let source = start_vertex
    
    for (var i = 0; i < vertex_count; i++) {

    }
  }
  
}
