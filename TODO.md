
-----
Note on nodes
-----
A node will always either return a value different from undefined.
The reason why this is is because the node exists on the data tree
and thus needs to signal this. When a value cannot be computed 
then a default value will be used - if a schema is provided then
it will take the default value for the given type:
object -> {}
array -> []
string, numbers -> null

However if one tries to get a static property from the data tree
and it does not exists it will return undefined.


----
Patch
----
Create a patch implementation using the path caching system in order
to speed up all subsequent patching.
In order to avoid a few iterations - access the path reference directly.

If a patch comes it, it will come generally at the root of its intended
place, in order words, there are a limited number (and pretty small actually)
number of patching locations in an application. The references of these
patches can be cached - or better yet generated at build time if possible.
So given:
{ op: 'add', path: '/foo/bar/123', value: { }}
References to:
'/foo',
'/foo/bar'
'/foo/bar/123'
are created. When first applying the patch these are created if not existend.

When trying to apply a patch again for '/foo/bar/123' the reference will be still
there and provide immediate access without any loops thus reducing the time considerably.
If, however, a patch is made on '/foo/bar/125', then the path is decomposed in:
'/foo/bar',
'/foo'
and each is check individually for references. When a reference is found the loop is
existed thus still giving the lowst possible time for arriving in our destation.
THis is oposed to the way patching is usually done - by starting at the root and
working it.

Further more, being provided a JSON Schema, references can be on initialisation
ensuring the lowest search time from the get go.

Array
----
Implement https://github.com/petkaantonov/deque to improve performance
for destructive operations on arrays.

Testing
----
Implement testing to ensure all functions are optmized by V8
https://github.com/petkaantonov/bluebird/wiki/Optimization-killers

Pointer parser porting from C implementation
----
https://github.com/miloyip/rapidjson/blob/master/include/rapidjson/pointer.h#L802


Other optimisations
----
Implement dedupe arrays for all db arrays
Store patches with a flag (true / false) if applied
and give rthem an ID so that they can be referenced in error
and give rthem an ID so that they can be referenced in error
objects.
objects.
efs: {},
When storing patches, store them in nested arrays
so that correct patching can be applied at a later time

@TODO: Add on the static tree the following:
- nesting: gives all the dynamic nodes (with their siblings)
- dirty: a value has changed

@TODO: In order to optimise the splitPath / decomposePath
operations, once a path is entered into the system it is
preserved in two forms: original && splitted
Where the string is needed for matching the first is used
and the latter according to what is needed (joining,
creating partial paths, etc)
Also joining paths by using a for loop is much more
efficient than using arr.join('/')
http://jsben.ch/#/OJ3vo

@TODO: Instead of using for loops use 
let l = arr.length
while(l--) {
 // arr[l]
}
Much more efficient:
https://jsperf.com/fastest-array-loops-in-javascript/32

@TODO: Implement search logic to go through refs
to find the node. During the bottom-up search if the
path does not exists create an object that up to
the found path will be added to the tree (depending
on the operation)

MUST DO!!!!!!
https://github.com/cujojs/most/issues/137
Inlining

------
Errors
------

1. Add timestamps in order to organize errors (from different types) chronologically
2. Add arguments and function used for failed nodes

