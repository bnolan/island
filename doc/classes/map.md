# Map class

A map consists of a number of stacks that are located at x,y coordinates. The Stacks have regular x and y dimensions (the `gridDimensions` parameter) but may vary in the z dimension.

Map units are positive integers. A map unit may be converted into world space by multiplying it by the gridDimensions vector.

## Methods

### new()

Creates a new map

### getExtents() -> Vector

Returns the x and y extents of the map in map units.

### getDimensions() -> Vector

Returns the x and y dimensions of the map in world units.

### get(Int,Int) -> Stack

Returns the stack at map units x and y. Always returns a stack. Stack may be empty.

### getHeightByPoint(Vector) -> Int

Returns the height of the map at world coordinates Vector.x and Vector.y. Equivalent to casting a ray down the z axis and seeing where it intersects.

### empty()

Deletes all stacks from the map

### refresh(Array)

Empty the map, then loads an array of stacks (serialized as hashes) into the map. 

### save()

Serializes all the stacks (via toJSON) and saves them to the server by ajax post.

### toJSON()

Serializes the stacks to hash.