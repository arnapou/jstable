/*
 * This file is part of the Arnapou jsTable package.
 *
 * (c) Arnaud Buathier <arnaud@arnapou.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

(function($, undefined) {

	var defaultOptions = {
		data: [],
		pageNum: 1,
		pageSize: 25
	};
	
	function getOptions(){
		return this.data('jsTableOptions') || defaultOptions;
	}
	
	function getTable(){
		return this.data('jsTable');
	}

	var actions = {
		_init: {
			set: function(options) {
				var _options = $.extend(defaultOptions, options);
				if (!(jsTable.isArray(_options.data))) {
					throw 'data is not a valid array object.';
				}
				this.data('jsTableOptions', _options);
				this.data('jsTable', new jsTable(_options.data));
				this.jsTable('refresh');
				return this;
			}
		},
		refresh: {
			get: function() {
				var html, i;
				var table = getTable.call(this);
				html = '<table>';
				table.each(function(row) {
					html += '<tr>';
					for (var c in row) {
						html += '<td>';
						html += row[c];
						html += '</td>';
					}
					html += '</tr>';
				});
				html += '</table>';
				this.empty().html(html);
			}
		}
	};

	$.fn.jsTable = function() {
		var action = '', args = [], ret = [];
		if (arguments.length === 1 && typeof(arguments[0]) === 'object') {
			action = '_init';
			args = [arguments[0]];
		}
		else if (arguments.length >= 1 && typeof(arguments[0]) === 'string') {
			action = arguments[0];
			args = Array.prototype.slice.call(arguments, 1);
		}

		this.each(function() {
			if (action && typeof(actions[action]) === 'object') {
				if (args.length === 0) {
					if (typeof(actions[action]['get']) === 'function') {
						ret.push(actions[action]['get'].apply($(this)));
						return;
					}
				}
				else {
					if (typeof(actions[action]['set']) === 'function') {
						actions[action]['set'].apply($(this), args);
					}
				}
			}
			ret.push($(this));
		});
		return ret.length === 1 ? ret[0] : ret;
	};

}).call(this, jQuery);