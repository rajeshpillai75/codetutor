// JavaScript Code Execution Demo
// This file contains sample code to demonstrate the output feature

// Simple variable declarations and operations
const greeting = "Hello, World!";
console.log(greeting);

// Working with arrays
const numbers = [1, 2, 3, 4, 5];
console.log("Original array:", numbers);

// Array methods
const doubled = numbers.map(num => num * 2);
console.log("Doubled array:", doubled);

// Object manipulation
const user = {
  name: "John Doe",
  age: 30,
  occupation: "Developer",
  skills: ["JavaScript", "React", "Node.js"]
};
console.log("User object:", user);

// Conditional logic
if (user.age > 25) {
  console.log(`${user.name} is over 25 years old`);
} else {
  console.log(`${user.name} is 25 or younger`);
}

// Function definition and execution
function calculateArea(width, height) {
  return width * height;
}

const rectangleArea = calculateArea(5, 3);
console.log(`Rectangle area: ${rectangleArea} square units`);

// Error handling example
try {
  // This will cause an error
  const result = undefinedVariable + 10;
  console.log(result);
} catch (error) {
  console.log("Error caught:", error.message);
}

// Asynchronous code example (output will be shown after synchronous code)
setTimeout(() => {
  console.log("This message appears after a delay");
}, 1000);

console.log("End of demo script");