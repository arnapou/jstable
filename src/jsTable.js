/*
 * This file is part of the Arnapou jsTable package.
 *
 * (c) Arnaud Buathier <arnaud@arnapou.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

(function() {

	/**
	 * jsTableMethods
	 */
	var jsTableMethods = {
		each: function(callback) {
			if (typeof(callback) !== 'function') {
				throw 'this is not a valid callback for each method.';
			}
			var i, n = this.length;
			for (i = 0; i < n; i++) {
				callback.call(this, this[i]);
			}
			return this;
		},
		select: function(callback, columnName) {
			if (typeof(callback) !== 'function') {
				throw 'this is not a valid callback for each method.';
			}
			var table = new jsTable([], columnName || this.uniqueIndex);
			var i, n = this.length;
			for (i = 0; i < n; i++) {
				table.push(callback.call(this, this[i]));
			}
			return table;
		},
		group: function(key, initial, reduce, finalize) {
			if (typeof(initial) !== 'object') {
				throw 'initial argument is not a valid object.';
			}
			if (typeof(reduce) !== 'function') {
				throw 'reduce argument is not a valid function.';
			}
			var simpleClone = function(obj) {
				var newObj = {};
				for (var k in obj) {
					newObj[k] = obj[k];
				}
				return newObj;
			};
			var table = this;
			var isKeyAFunction = (typeof(key) === 'function');
			table = table.select(function(row) {
				row['_key_'] = (isKeyAFunction ? key : function(row) {
					var s = '';
					for (var k in key) {
						s += String(row[k]) + '::';
					}
					return s;
				})(row);
				return row;
			}).sort({_key_: 1});

			var newTable = new jsTable([]);
			var newTableRow;
			var previousKey;
			table.each(function(row) {
				if (previousKey !== row['_key_']) {
					if (previousKey) {
						if (typeof(finalize) === 'function') {
							finalize.call(newTableRow);
						}
						newTable.push(newTableRow);
					}
					newTableRow = simpleClone(initial);
					previousKey = row['_key_'];
					if (isKeyAFunction) {
						newTableRow['_key_'] = row['_key_'];
					}
					else {
						for (var k in key) {
							newTableRow[k] = row[k];
						}
					}
				}
				reduce.call(newTableRow, row);
			});
			if (previousKey) {
				if (typeof(finalize) === 'function') {
					finalize.call(newTableRow);
				}
				newTable.push(newTableRow);
			}
			return newTable;
		},
		find: function(condition) {
			var i, n = this.length;
			var elements, property;
			elements = new jsTable([], this.uniqueIndex);
			if (!(condition instanceof jsConditionBuilder)) {
				if (typeof(condition) === 'object') {
					var object = condition;
					condition = jsTable.and();
					for (property in object) {
						condition.equalTo(property, object[property]);
					}
				}
				else if (this.hasUniqueIndex()) {
					var value = condition;
					condition = jsTable.and().equalTo(this.uniqueIndex, value);
				}
				else {
					throw 'condition is not a valid argument.';
				}
			}
			for (i = 0; i < n; i++) {
				if (condition.match(this[i])) {
					elements.push(this[i]);
				}
			}
			return elements;
		},
		findOne: function(condition) {
			var elements = this.find(condition);
			if (elements && elements.length) {
				return elements[0];
			}
			return null;
		},
		slice: function() {
			var array = this.__slice.apply(this, arguments);
			return new jsTable(array, this.uniqueIndex);
		},
		limit: function(start, end) {
			return this.slice(start, end);
		},
		sort: function(orders, caseSensitive) {
			caseSensitive = caseSensitive || false;
			return this.__sort(function(a, b) {
				for (var column in orders) {
					if (typeof(orders[column] === 'string')) {
						if (typeof(a[column]) === 'undefined' || typeof(b[column]) === 'undefined') {
							return 0;
						}
						var aa = a[column];
						var bb = b[column];
						if (!caseSensitive) {
							aa = typeof(aa) === 'string' ? String(aa).toLowerCase() : aa;
							bb = typeof(bb) === 'string' ? String(bb).toLowerCase() : bb;
						}
						if (aa < bb) {
							return -orders[column];
						}
						else if (aa > bb) {
							return orders[column];
						}
					}
				}
				return 0;
			});
		},
		getUniqueIndex: function() {
			return this.uniqueIndex;
		},
		hasUniqueIndex: function() {
			return this.uniqueIndex ? true : false;
		},
		push: function(element) {
			if (this.hasUniqueIndex()) {
				if (typeof(element[this.uniqueIndex]) !== 'undefined') {
					this.indexes[element[this.uniqueIndex]] = element;
				}
			}
			return this.__push(element);
		},
		rebuildUniqueIndex: function() {
			this.indexes = {};
			if (this.hasUniqueIndex()) {
				var i, n = this.length;
				for (i = 0; i < n; i++) {
					if (typeof(this[i][this.uniqueIndex]) !== 'undefined') {
						this.indexes[this[i][this.uniqueIndex]] = this[i];
					}
				}
			}
		},
		setUniqueIndex: function(columnName) {
			this.uniqueIndex = columnName;
			this.rebuildUniqueIndex();
		}
	};

	/*
	 * jsTable class
	 */
	var jsTable = function(data, uniqueIndex) {
		if (!jsTable.isArray(data)) {
			throw 'data is not a valid object of type Array.';
		}
		var method;
		var table = data.slice(0); // clone array
		table.indexes = {};
		for (var method in jsTableMethods) {
			(function(method) {
				if (table[method]) {
					table['__' + method] = table[method];
				}
				table[method] = function() {
					return jsTableMethods[method].apply(table, arguments);
				};
			})(method);
		}
		table.setUniqueIndex(uniqueIndex);
		return table;
	};

	jsTable.and = function() {
		return new jsConditionBuilder('and');
	};

	jsTable.or = function() {
		return new jsConditionBuilder('or');
	};

	jsTable.isArray = function(param) {
		return Object.prototype.toString.call(param) === '[object Array]';
	};

	/*
	 * jsConditionBuilder class
	 */
	var jsConditionBuilder = function(mode) {
		this.condition = (mode === 'or') ? new jsCondition(null, [], true, 'or') : new jsCondition(null, [], true, 'and');
		this.add = function(condition) {
			this.condition.add(condition);
			return this;
		};
		this.match = function(element) {
			return this.condition.match(element);
		};
		this.notMatch = function(element) {
			return !this.condition.match(element);
		};
		this.greaterThan = function(column, value, caseSensitive) {
			var condition = new jsCondition(column, value, caseSensitive, 'greaterThan')
			this.condition.add(condition);
			return this;
		};
		this.greaterThanOrEqual = function(column, value, caseSensitive) {
			var condition = new jsCondition(column, value, caseSensitive, 'greaterThanOrEqual');
			this.condition.add(condition);
			return this;
		};
		this.lowerThan = function(column, value, caseSensitive) {
			var condition = new jsCondition(column, value, caseSensitive, 'lowerThan');
			this.condition.add(condition);
			return this;
		};
		this.lowerThanOrEqual = function(column, value, caseSensitive) {
			var condition = new jsCondition(column, value, caseSensitive, 'lowerThanOrEqual');
			this.condition.add(condition);
			return this;
		};
		this.equalTo = function(column, value, caseSensitive) {
			var condition = new jsCondition(column, value, caseSensitive, 'equalTo');
			this.condition.add(condition);
			return this;
		};
		this.notEqualTo = function(column, value, caseSensitive) {
			var condition = new jsCondition(column, value, caseSensitive, 'equalTo');
			this.condition.add(new jsCondition(null, condition, true, 'not'));
			return this;
		};
		this.inArray = function(column, array) {
			if (!jsTable.isArray(array)) {
				throw 'the argument is not a valid object of type Array.';
			}
			var condition = new jsCondition(column, array, true, 'inArray');
			this.condition.add(condition);
			return this;
		};
		this.notInArray = function(column, array) {
			if (!jsTable.isArray(array)) {
				throw 'the argument is not a valid object of type Array.';
			}
			var condition = new jsCondition(column, array, true, 'inArray');
			this.condition.add(new jsCondition(null, condition, true, 'not'));
			return this;
		};
		this.regexp = function(column, regexp) {
			if (!(regexp instanceof RegExp)) {
				throw 'the argument is not a valid object of type RegExp.';
			}
			var condition = new jsCondition(column, regexp, true, 'regexp');
			this.condition.add(condition);
			return this;
		};
		this.notRegexp = function(column, regexp) {
			if (!(regexp instanceof RegExp)) {
				throw 'the argument is not a valid object of type RegExp.';
			}
			var condition = new jsCondition(column, regexp, true, 'regexp');
			this.condition.add(new jsCondition(null, condition, true, 'not'));
			return this;
		};
		this.callback = function(callback) {
			if (typeof(callback) !== 'function') {
				throw 'the argument is not a valid function.';
			}
			var condition = new jsCondition(null, callback, true, 'callback');
			this.condition.add(condition);
			return this;
		};
		this.notCallback = function(callback) {
			if (typeof(callback) !== 'function') {
				throw 'the argument is not a valid function.';
			}
			var condition = new jsCondition(null, callback, true, 'callback');
			this.condition.add(new jsCondition(null, condition, true, 'not'));
			return this;
		};
	};

	/**
	 * jsConditionMethods
	 */
	var jsConditionMatchMethods = {
		callback: function(element) {
			return this.value(element);
		},
		inArray: function(value) {
			var i, n = this.value.length;
			for (i = 0; i < n; i++) {
				if (this.value[i] == value) {
					return true;
				}
			}
			return false;
		},
		regexp: function(value) {
			return String(value).match(this.value);
		},
		equalTo: function(value) {
			return value == this.value;
		},
		greaterThan: function(value) {
			return value > this.value;
		},
		greaterThanOrEqual: function(value) {
			return value >= this.value;
		},
		lowerThan: function(value) {
			return value < this.value;
		},
		lowerThanOrEqual: function(value) {
			return value <= this.value;
		},
		not: function(element) {
			return !this.value.match(element);
		},
		or: function(element) {
			var n = this.value.length, i;
			for (i = 0; i < n; i++) {
				if (this.value[i].match(element)) {
					return true;
				}
			}
			return false;
		},
		and: function(element) {
			var n = this.value.length, i;
			for (i = 0; i < n; i++) {
				if (!this.value[i].match(element)) {
					return false;
				}
			}
			return true;
		}
	};

	/*
	 * jsCondition class
	 */
	var jsCondition = function(column, value, caseSensitive, operator) {
		var self = this;
		var typeofValue = typeof(value);
		this.value = value;
		if (typeof(column) === 'string') {
			if (caseSensitive) {
				this.match = function(element) {
					if (typeof(element[column]) === 'undefined') {
						return false;
					}
					return jsConditionMatchMethods[operator].call(this, element[column]);
				};
			}
			else {
				if (typeofValue === 'string') {
					self.value = String(value).toLowerCase();
				}
				this.match = function(element) {
					if (typeof(element[column]) === 'undefined') {
						return false;
					}
					if (typeof(element[column]) === 'string') {
						return jsConditionMatchMethods[operator].call(this, String(element[column]).toLowerCase());
					}
					else {
						return jsConditionMatchMethods[operator].call(this, element[column]);
					}
				};
			}
		}
		else {
			this.match = function(element) {
				return jsConditionMatchMethods[operator].call(this, element);
			};
			if (operator === 'or' || operator === 'and') {
				this.add = function(condition) {
					this.value.push(condition);
				};
			}
		}
	};

	/*
	 * Expose objects to global scope
	 */
	this.jsTable = jsTable;

}).call(this);
