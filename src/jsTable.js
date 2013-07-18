/*
 * This file is part of the Arnapou jsTable package.
 *
 * (c) Arnaud Buathier <arnaud@arnapou.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

(function() {

	var isArray = function(v) {
		return Object.prototype.toString.call(v) === '[object Array]';
	};

	var jsTable = function(data, uniqueIndex) {
		this.data = [];
		this.uniqueIndex = null;
		this.indexes = {};
		data && this.setData(data);
		uniqueIndex && this.setUniqueIndex(uniqueIndex);
	};

	jsTable.prototype.getData = function() {
		return this.data;
	};

	jsTable.prototype.setData = function(data) {
		if (!isArray(data)) {
			throw 'data is not a valid object of type Array.';
		}
		this.data = data;
		this.rebuildUniqueIndex();
	};

	jsTable.prototype.addRow = function(row) {
		this.data.push(row);
		if (typeof(row[this.uniqueIndex]) !== 'undefined') {
			this.indexes[row[this.uniqueIndex]] = row;
		}
	};

	jsTable.prototype.hasUniqueIndex = function() {
		return this.uniqueIndex ? true : false;
	};

	jsTable.prototype.rebuildUniqueIndex = function() {
		this.indexes = {};
		if (this.hasUniqueIndex()) {
			var n = this.data.length, i;
			for (i = 0; i < n; i++) {
				if (typeof(this.data[i][this.uniqueIndex]) !== 'undefined') {
					this.indexes[this.data[i][this.uniqueIndex]] = this.data[i];
				}
			}
		}
	};

	jsTable.prototype.getUniqueIndex = function() {
		return this.uniqueIndex;
	};

	jsTable.prototype.setUniqueIndex = function(columnName) {
		this.uniqueIndex = columnName;
		this.rebuildUniqueIndex();
	};

	this.jsTable = jsTable;

}).call(this);

