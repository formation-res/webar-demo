import { WeightedGraph } from "./Classes/WeightedGraph.js"

/* 
        TEST CASES FOR THE WEIGHTEDGRAPH CLASS
*/

const graph = new WeightedGraph();
const g = new WeightedGraph();

for (let i = 0; i < 6; i++) {
  g.addVertex(i);
}
g.addEdge(0, 1, 7);
g.addEdge(0, 2, 9);
g.addEdge(0, 5, 14);
g.addEdge(1, 2, 10);
g.addEdge(1, 3, 15);
g.addEdge(2, 3, 11);
g.addEdge(2, 5, 2);
g.addEdge(3, 4, 6);
g.addEdge(4, 5, 9);

console.log(g.findShortestPath(0, 1)); // Output: [ 0, 1 ]
console.log(g.findShortestPath(0, 4)); // Output: [0, 2, 5, 4]


graph.addEdge('A', 'B', 4);
graph.addEdge('A', 'C', 2);
graph.addEdge('B', 'E', 3);
graph.addEdge('C', 'D', 2);
graph.addEdge('C', 'F', 4);
graph.addEdge('D', 'E', 3);
graph.addEdge('D', 'F', 1);
graph.addEdge('E', 'F', 1);

const shortestPath = graph.findShortestPath('A', 'E');
console.log('Shortest path:', shortestPath); // Output: Shortest path: [ 'A', 'C', 'D', 'E' ]