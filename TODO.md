
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
Storage
----
Extend the db to use localStorage and internal storage for non-data objects:

{
  op: add,
  path: /storage/pic.jpg,
  value: new Blob()
}

var a = db.get('/storage/pic.jpg')
a.size = 0


----
Optimized nodes
----
For nodes that have nested dependencies e.g. '/foo/data' define this as a 
prop bases execution in order to ensure than a minimum amount of data is
necessary for computation.

node:
- path: /foo/computed
- args: '/foo/data',
- prop: 'id'
- fn -> fn

get('/foo/computed/23') will only use /foo/data/23 for the computation

A better way is to provide an arg to provide the fn with additional info:

node:
- path: '/foo/bam',
- args: ['/foo/bar'],
- opts: true
- fn -> (opts, fooBar) => {
  opts.pathExtra => Array() of path extra
  opts.changed => What has changed on which argument that made the fn
  to be called
}

/foo/bam/23 ->

Have a paramter that tells the model why it was called:

/foo/bar => 23

node:
- args: ['/foo/qux', '/foo/bar']

{ op: 'replace', path: '/foo/bar', value: 123 }

fn (opts, fooBar) => {

  opts.changed = [
    // The number of the argument that changed
    [], [ {
      length: {
        old: 2,
        new: 3
      },
      value: {
        old: 23,
        new: 123
      }
    } ]
  ]
}

In order to standardize the entire api, make all arguments to be named instead of using the
array form:

module.exports = {
  args: {
    foo: '/foo',
    bar: '/bam/bar
  },
  fn: o => {
    o.foo // /foo
    o.bar // /bam/bar
    o.changed = { foo: { value: { old: 123, new: 321 } } }
  }
}

//---
Which is basically the same as:
args: ['/foo', '/bam/bar'],
fn: (foo, bar) => {}
//---

// Array of extra props
fn: (args, changed, prev, opts) => {
  args.foo
  args.bar
  changed.foo
  changed.bar

  if (changed.bar.length !== false) return prev

  if (opts[0]) {
    prev[opts[0]] = 123
    return prev
  }
}

By doing this then the function can be tested if it tries to modify the values through augmenting the
args object with a mutation observer.
If values are modifed the developer can be informed of this. If the application goes in production mode the cloning can be removed
to get a serious boost in performance.

// ---
// Instead of above API
// ---
Model:

module.exports = {
  path: '/foo/<id>',
  args: {
    bam: '/baz/bam'
  },
  filter: changed => {
    if (changed.bam.length) {
      return false
    } else {
      return true
    }
  },
  fn: args => {
    // args.id
    // args.bam

    function compute(val) {
      // Do stuff with data
      return val + 1
    }

    let result
    if (args.id) {
      result = compute(args.bam[args.id])
    } else {
      result = Object.keys(args.bam).reduce((acc, x) => {
        acc[x] = compute(args.bam[x])
        return acc
      }, {})
    }

    return result
  }
}

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
3. Add complete description to errors to why they happen


-----
Utils
-----
1. Location history. Enable the develoeper to get the entire history of a certain node.
   getHistory('/foo') -> [{ time: 123, value: 'a' }, { time: 124, value: 'b' }]
   To make this more comprehensive add the patch that made the change.
   To correlate this with what is shown to the user add debug data - which value was 
   eventually used in the UI? (this is usefull to track down
   issues with decisional trees that get trigger in a rapid succession of the value)

-----
API
-----


