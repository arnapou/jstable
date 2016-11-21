
var data = [
	{id: 211, name: 'john', age: 20, genre: 'M'},
	{id: 452, name: 'carol', age: 25, genre: 'F'},
	{id: 433, name: 'alain', age: 22, genre: 'M'},
	{id: 511, name: 'georges', age: 22, genre: 'M'},
	{id: 364, name: 'lea', age: 18, genre: 'F'},
	{id: 144, name: 'sue', age: 8, genre: 'F'}
];

function fnToString(fn) {
	var s = String(fn)
			.replace(/(\n)\t{3}/g, '$1')
			.replace(/^.*?\n/, '')
			.replace(/\n.*?$/, '')
			.replace(/\t/g, '    ');
	s = s.replace(/(['"])([^'"]*)(['"])/g, '<span class="string">$1$2$3</span>');
	s = s.replace(/(\/\/[^\n]+)/g, '<span class="comment">$1</span>');
	s = s.replace(/(\/\*.*?\*\/)/g, '<span class="comment">$1</span>');
	s = s.replace(/(new |\n\s*return |(^|\n)var )/g, '<span class="keyword">$1</span>');
	s = s.replace(/(function)(\()/g, '<span class="keyword">$1</span>$2');
	s = s.replace(/(jsTable)([\(\.])/g, '<span class="jsTable">$1</span>$2');
	s = s.replace(/(\.)([a-z0-9A-Z]+)(\()/g, '$1<span class="method">$2</span>$3');
	return s;
}

function show(examples, title) {
	var i, n = examples.length;
	var html, result, js;
	if (title) {
		//$('#examples').append('<h1>' + title + '</h1>');
	}
	for (i = 0; i < n; i++) {
		html = '<h4>' + examples[i].title + '</h4>';
		html += '<div class="row"><div class="col-lg-8">';
		html += '<pre>' + fnToString(examples[i].code) + '</pre>';
		html += '</div><div class="col-lg-4">';
		if (typeof(examples[i].html) === 'undefined') {
			result = examples[i].code();
			if (!jsTable.isArray(result)) {
				result = new jsTable([result]);
			}
			html += '<table class="table">';
			html += '<tr>';
			for (var k in result[0]) {
				html += '<th class="col_' + k + '">' + k + '</th>';
			}
			html += '</tr>';
			result.each(function(element) {
				html += '<tr>';
				for (var k in element) {
					html += '<td class="col_' + k + '">' + element[k] + '</td>';
				}
				html += '</tr>';
			});
			html += '</table>';
		}
		else {
			html += examples[i].html;
		}
		html += '</div></div>';
		$('#examples').append(html);
	}
}

$(function() {
	show(examples, currentPage);
});