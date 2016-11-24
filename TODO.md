
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

