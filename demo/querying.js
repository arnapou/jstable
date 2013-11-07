var examples = [{
		title: 'Data list',
		code: function() {
			var table = new jsTable(data);
			return table;
		}
	}, {
		title: 'name ~ *l* or age > 20',
		code: function() {
			var table = new jsTable(data);
			return table
					.find(jsTable.or().regexp('name', /l/).greaterThan('age', 20));
		}
	}, {
		title: 'name ~ *l* and age > 20',
		code: function() {
			var table = new jsTable(data);
			return table
					.find(jsTable.and().regexp('name', /l/).greaterThan('age', 20));
		}
	}, {
		title: '(name ~ *l* or name ~ *o*) and age > 20',
		code: function() {
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
		}
	}];