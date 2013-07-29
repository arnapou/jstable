
var data = [
	{id: 211, name: 'john', age: 20},
	{id: 452, name: 'carol', age: 25},
	{id: 433, name: 'alain', age: 22},
	{id: 511, name: 'georges', age: 22},
	{id: 364, name: 'lea', age: 18},
	{id: 144, name: 'sue', age: 8}
];

function fnToString(fn) {
	var s = String(fn)
			.replace(/(\n)\t{3}/g, '$1')
			.replace(/^.*?\n/, '')
			.replace(/\n.*?$/, '')
			.replace(/\t/g, '    ');
	s = s.replace(/(['"])([^'"]+)(['"])/g, '<span class="string">$1$2$3</span>');
	s = s.replace(/(\/\/[^\n]+)/g, '<span class="comment">$1</span>');
	s = s.replace(/(\/\*.*?\*\/)/g, '<span class="comment">$1</span>');
	s = s.replace(/(new |\nreturn |(^|\n)var )/g, '<span class="keyword">$1</span>');
	s = s.replace(/(function)(\()/g, '<span class="keyword">$1</span>$2');
	s = s.replace(/(jsTable)([\(\.])/g, '<span class="jsTable">$1</span>$2');
	s = s.replace(/(\.)([a-z0-9A-Z]+)(\()/g, '$1<span class="method">$2</span>$3');
	return s;
}

function show(examples, title) {
	var i, n = examples.length;
	var html, result, js;
	if (title) {
		$('#examples').append('<h1>' + title + '</h1>');
	}
	for (i = 0; i < n; i++) {
		html = '<h4>' + examples[i].title + '</h4>';
		html += '<div class="row"><div class="span8">';
		html += '<pre>' + fnToString(examples[i].code) + '</pre>';
		html += '</div><div class="span4">';
		if (typeof(examples[i].html) === 'undefined') {
			html += '<table class="table">';
			html += '<tr>';
			html += '<th class="col_id">id</th>';
			html += '<th class="col_name">name</th>';
			html += '<th class="col_age">age</th>';
			html += '</tr>';
			result = examples[i].code();
			if (!jsTable.isArray(result)) {
				result = new jsTable([result]);
			}
			result.each(function(element) {
				html += '<tr>';
				html += '<td class="col_id">' + element.id + '</td>';
				html += '<td class="col_name">' + element.name + '</td>';
				html += '<td class="col_age">' + element.age + '</td>';
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