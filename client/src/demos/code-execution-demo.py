# Python Code Execution Demo
# This file contains sample code to demonstrate the output feature

# Simple variable declarations and operations
greeting = "Hello, World!"
print(greeting)

# Working with lists
numbers = [1, 2, 3, 4, 5]
print("Original list:", numbers)

# List comprehension
doubled = [num * 2 for num in numbers]
print("Doubled list:", doubled)

# Dictionary manipulation
user = {
  "name": "John Doe",
  "age": 30,
  "occupation": "Developer",
  "skills": ["Python", "Django", "Flask"]
}
print("User dictionary:", user)

# Conditional logic
if user["age"] > 25:
  print(f"{user['name']} is over 25 years old")
else:
  print(f"{user['name']} is 25 or younger")

# Function definition and execution
def calculate_area(width, height):
  return width * height

rectangle_area = calculate_area(5, 3)
print(f"Rectangle area: {rectangle_area} square units")

# Error handling example
try:
  # This will cause an error
  result = undefined_variable + 10
  print(result)
except Exception as error:
  print("Error caught:", str(error))

# List operations
fruits = ["apple", "banana", "cherry"]
fruits.append("orange")
print("Fruits list after append:", fruits)

# Working with tuples
coordinates = (10, 20)
x, y = coordinates
print(f"X: {x}, Y: {y}")

print("End of demo script")