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
	}, {
		title: 'Select',
		code: function() {
			var table = new jsTable(data);
			return table
					.select(function(row) {
				return {
					id: row.id,
					text: row.name + ' (' + row.age + ')'
				};
			});
		}
	}, {
		title: 'Grouping (list of names by age and sorted by age)',
		code: function() {
			var table = new jsTable(data);
			return table
					.group(
						{age: 1}, 
						{names: ''}, 
						function(row) {
							this.names += (this.names ? ', ' : '') + row.name;
						})
					.sort({age: 1});
		}
	}, {
		title: 'Grouping (average age by genre for age >= 20)',
		code: function() {
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
		}
	}];
