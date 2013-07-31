jsTable
=======

jsTable object is a pure javascript Array in which we inject methods in order to allow filtering/sorting/limiting.

Example
=======

Data list :

    var data = [
        {id: 211, name: 'john', age: 20},
        {id: 452, name: 'carol', age: 25},
        {id: 433, name: 'alain', age: 22},
        {id: 511, name: 'georges', age: 22},
        {id: 364, name: 'lea', age: 18},
        {id: 144, name: 'sue', age: 8}
    ];
    
    id     name        age
    ----   ---------   ----
    211    john        20
    452    carol       25
    433    alain       22
    511    georges     22
    364    lea         18
    144    sue         8

Age > 20, sort by age asc and name desc, limit (0,2)

    var table = new jsTable(data);
    return table
        .find(jsTable.or().greaterThan('age', 20))
        .sort({age: 1, name: -1})
        .limit(0, 2);
    
    id     name        age
    ----   ---------   ----
    511    georges     22
    433    alain       22

(name ~ *l* or name ~ *o*) and age > 20

    var table = new jsTable(data);
    return table
        .find(
            jsTable.and()
            .add(
                jsTable.or()
                    .regexp('name', /l/)
                    .regexp('name', /o/)
            )
            .greaterThan('age', 20)
        );
    
    id     name        age
    ----   ---------   ----
    452    carol       25
    433    alain       22
    511    georges     22

Reference
=========

Instanciation
-------------

    table = new jsTable(data, [columnName]);

is the same as

    table = new jsTable(data);
    table.setUniqueIndex(columnName);

Getter/Setter
-------------

Get the column which is the primary key.
Used for fast access when you use search by primary key

    table.getUniqueIndex(columnName);

Define the column which is the primary key.
Used for fast access when you use search by primary key

    table.setUniqueIndex(columnName);

Tells whether a primary key is used

    // @return boolean
    table.hasUniqueIndex();

Array overriden methods
-----------------------

Push a row into the array

    table.push(row);

Return a jsTable and not a javascript Array

    // @return jsTable
    table.slice(start, [length]);

Conditions
----------

OR based condition

    condition = jsTable.or();

AND based condition

    condition = jsTable.and();

Adding a nested condition.
It allows complex querying, ie: cond1 and (cond2 or cond3)

    condition.add(other_condition);

Adding an element to an OR or AND condition

    condition.equalTo(column, value, [caseSensitive]);
    condition.notEqualTo(column, value, [caseSensitive]);
    condition.greaterThan(column, value, [caseSensitive]);
    condition.greaterThanOrEqual(column, value, [caseSensitive]);
    condition.lowerThan(column, value, [caseSensitive]);
    condition.lowerThanOrEqual(column, value, [caseSensitive]);
    condition.inArray(column, array);
    condition.notInArray(column, array);
    condition.regexp(column, regexp);
    condition.notRegexp(column, regexp);
    condition.callback(function(row){ /* code should return true/false */ });
    condition.notCallback(function(row){ /* code should return true/false */ });

Querying
--------

Find rows based on the condition

    // @return jsTable
    table.find(condition);

Find an object (or null if not found) based on the condition

    // @return object|null
    table.findOne(condition);

Sorting / limit
---------------

Sort rows (1: ascending, -1: descending)

    // @return jsTable
    table.sort({column1: 1, column2: -1});

Limit the rows (alias of slice method)

    // @return jsTable
    table.limit(start, [length]);

Iterate
-------

Iterate over the array with callback function

    // @return jsTable
    table.each(function(row) {
        // do some stuff with row
    });
