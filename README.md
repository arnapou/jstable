jsTable
=======

jsTable object is a pure javascript Array in which we inject methods in order to allow filtering/sorting/limiting.

Live demo : http://jstable.arnapou.net/

Example
=======

Data list :

    var data = [
        {id: 211, name: 'john'   , age: 20, genre: 'M'},
        {id: 452, name: 'carol'  , age: 25, genre: 'F'},
        {id: 433, name: 'alain'  , age: 22, genre: 'M'},
        {id: 511, name: 'georges', age: 22, genre: 'M'},
        {id: 364, name: 'lea'    , age: 18, genre: 'F'},
        {id: 144, name: 'sue'    , age: 8 , genre: 'F'}
    ];
    
    id     name        age    genre
    ----   ---------   ----   ------
    211    john        20     M
    452    carol       25     F
    433    alain       22     M
    511    georges     22     M
    364    lea         18     F
    144    sue         8      F

Age > 20, sort by age asc and name desc, limit (0,2)

    var table = new jsTable(data);
    return table
        .find(jsTable.or().greaterThan('age', 20))
        .sort({age: 1, name: -1})
        .limit(0, 2);
    
    id     name        age    genre
    ----   ---------   ----   ------
    511    georges     22     M
    433    alain       22     M

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
    
    id     name        age    genre
    ----   ---------   ----   ------
    452    carol       25     F
    433    alain       22     M
    511    georges     22     M

Grouping (average age by genre for age >= 20)

    var table = new jsTable(data);
    return table
            .find(jsTable.and().greaterThanOrEqual('age', 20))
            .group(
                function(row){
                    return row.genre === 'F' ? 'female' : 'male';
                }, 
                {sum: 0, count: 0}, 
                function(row) {
                    this.sum += row.age;
                    this.count++;
                }, 
                function(){
                    this.average = this.sum / this.count;
                });
    
    sum    count    _key_    average
    ----   ------   ------   --------
    25     1        female   25
    64     3        male     21.333333333333332

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

Selecting
---------

Iterate over the array to create a new jsTable with new columns/rows.
The columnName argument is the uniqueIndex of the new jsTable

    // @return jsTable
    table.select(function(row) {
        // return a new formatted row
    }, [columnName]);

Grouping
--------

It return a new jsTable reduced by group functions.

    // @return jsTable
    table.select(key, initial, reduce, [finalize]);

Argument _key_ (used for grouping)

    key = {field1: 1, field2: 1};
    key = function(row) {
    	/* code should return a string which represent the grouping key */
    };

Argument _initial_ (used for initializing grouped rows)

    initial = { someField1: someValue1, someField2: someValue2 };

Argument _reduce_ (function which calculte each grouped row)

    reduce = function(row) {
        /* this is the current grouped row */
        this.someField += row.someOtherField;
    };

Argument _finalize_ (function which finalize each grouped row)

    finalize = function() {
        /* this is the current grouped row */
        this.someTotal = this.someField1 + this.someField2;
    };

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
