var examples = [{
		title: 'Data list',
		code: function() {
			var table = new jsTable(data);
			return table;
		}
	}, {
		title: 'Search by id 211',
		code: function() {
			// we need to set the unique id field to allow fast search by id
			var table = new jsTable(data, 'id');
			return table.find(211);
		}
	}, {
		title: 'Search by name = alain',
		code: function() {
			var table = new jsTable(data);
			return table.find({name: 'alain'});
		}
	}, {
		title: 'Age > 20',
		code: function() {
			var table = new jsTable(data);
			return table
					.find(jsTable.or().greaterThan('age', 20));
		}
	}, {
		title: 'First age = 22',
		code: function() {
			var table = new jsTable(data);
			return table
					.findOne(jsTable.or().equalTo('age', 22));
		}
	}, {
		title: 'Age > 20, sort by age asc and name desc',
		code: function() {
			var table = new jsTable(data);
			return table
					.find(jsTable.or().greaterThan('age', 20))
					.sort({age: 1, name: -1});
		}
	}, {
		title: 'Age > 20, sort by age asc and name desc, limit (0,2)',
		code: function() {
			var table = new jsTable(data);
			return table
					.find(jsTable.or().greaterThan('age', 20))
					.sort({age: 1, name: -1})
					.limit(0, 2);
		}
	}];
