
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
