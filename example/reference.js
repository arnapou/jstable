var examples = [{
		title: 'Instanciation',
		code: function() {
			table = new jsTable(data, [columnName]);

			// is the same as

			table = new jsTable(data);
			table.setUniqueIndex(columnName);

			// Please note :
			// jsTable object is a pure javascript Array object in which 
			// we inject methods
			// So, you can use all Array methods/properties like any array
		},
		html: ''
	}, {
		title: 'Getter/Setter',
		code: function() {
			// get the column which is the primary key
			// used for fast access when you use search by primary key
			table.getUniqueIndex(columnName);

			// define the column which is the primary key
			// used for fast access when you use search by primary key
			table.setUniqueIndex(columnName);

			// tells whether a primary key is used
			// @return boolean
			table.hasUniqueIndex();
		},
		html: ''
	}, {
		title: 'Array overriden methods',
		code: function() {
			// push a row into the array
			table.push(row);

			// return a jsTable and not a javascript Array
			// @return jsTable
			table.slice(start, [length]);
		},
		html: ''
	}, {
		title: 'Conditions',
		code: function() {
			// OR based condition
			condition = jsTable.or();
			
			// AND based condition
			condition = jsTable.and();
			
			// adding a nested condition 
			// it allows complex querying, ie: cond1 and (cond2 or cond3)
			condition.add(other_condition);
			
			// adding an element to an OR or AND condition
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
		},
		html: ''
	}, {
		title: 'Querying',
		code: function() {
			// find rows based on the condition
			// @return jsTable
			table.find(condition);

			// find an object (or null if not found) based on the condition
			// @return object|null
			table.findOne(condition);
		},
		html: ''
	}, {
		title: 'Sorting / limit',
		code: function() {
			// sort rows (1: ascending, -1: descending)
			// @return jsTable
			table.sort({column1: 1, column2: -1});

			// limit the rows (alias of slice method)
			// @return jsTable
			table.limit(start, [length]);
		},
		html: ''
	}, {
		title: 'Iterate',
		code: function() {
			// iterate over the array with callback function
			// @return jsTable
			table.each(function(row) {
				// do some stuff with row
			});
		},
		html: ''
	}];
