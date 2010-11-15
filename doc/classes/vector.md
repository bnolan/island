# Vector class

Standard 3 vector of floats, x, y and z. I have tried to make the methods chainable, so most methods return a new vector, so that operations can be chained:

### Example:

    v = new Vector(1,2,3)
    v.inverse().add(new Vector(3,4,5)).toString()

### Notes:

For historical reasons, +x goes from to the right, +y comes out of the screen, and +z goes up the screen.

## Methods

### new(Float, Float, Float)

Constructs a new vector. If called with no arguments, creates a Vector of 0, 0, 0.

### toString() -> String

Returns a human readable string of the vector.

### copy() -> Vector

Returns a new vector the same as this.

### toWire() -> String

Returns a string representation for sending over a websocket.

### length() -> Float

Returns the length of this vector.

### add(Vector) -> Vector

Returns a new vector that is the sum of itself and the argument vector.

### subtract(Vector) -> Vector

Returns a new vector that is the subtraction of itself and the argument vector.

### inverse() -> Vector

Returns a new vector that is the inverse of this vector.

### distance(Vector) -> Float

Returns the length to the other vector