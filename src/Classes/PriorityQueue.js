export class PriorityQueue {
    constructor() {
      this.values = [];
    }
  
    enqueue(value, priority) {
      const newNode = { value, priority };
      this.values.push(newNode);
      this.bubbleUp();
    }
  
    dequeue() {
      const min = this.values[0];
      const end = this.values.pop();
  
      if (this.values.length > 0) {
        this.values[0] = end;
        this.sinkDown();
      }
  
      return min;
    }
  
    decreaseKey(value, newPriority) {
        const index = this.values.findIndex((node) => node.value === value);
    
        if (index === -1) {
          throw new Error("Value not found in the priority queue.");
        }
    
        if (newPriority > this.values[index].priority) {
          throw new Error("New priority must be lower than the current priority.");
        }
    
        this.values[index].priority = newPriority;
        this.bubbleUp(index);
      }
  
    bubbleUp(index = this.values.length - 1) {
      const element = this.values[index];
  
      while (index > 0) {
        const parentIndex = Math.floor((index - 1) / 2);
        const parent = this.values[parentIndex];
  
        if (element.priority >= parent.priority) break;
  
        this.values[parentIndex] = element;
        this.values[index] = parent;
        index = parentIndex;
      }
    }
  
    sinkDown(index = 0) {
      const length = this.values.length;
      const element = this.values[index];
  
      while (true) {
        const leftChildIndex = 2 * index + 1;
        const rightChildIndex = 2 * index + 2;
        let swap = null;
        let leftChild, rightChild;
  
        if (leftChildIndex < length) {
          leftChild = this.values[leftChildIndex];
          if (leftChild.priority < element.priority) {
            swap = leftChildIndex;
          }
        }
  
        if (rightChildIndex < length) {
          rightChild = this.values[rightChildIndex];
          if (
            (swap === null && rightChild.priority < element.priority) ||
            (swap !== null && rightChild.priority < leftChild.priority)
          ) {
            swap = rightChildIndex;
          }
        }
  
        if (swap === null) break;
  
        this.values[index] = this.values[swap];
        this.values[swap] = element;
        index = swap;
      }
    }
  
    isEmpty() {
      return this.values.length === 0;
    }
  }
  