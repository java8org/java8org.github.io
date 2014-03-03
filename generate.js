fs = require('fs');

var charmap = {
	"&" : "&amp;",
	"<" : "&lt;",
	">" : "&gt;",
	'"' : '&quot;',
	"'" : '&#39;',
	"*" : '&#42;',
	"/" : '&#x2F;'
};

function escapeHtml(string) {
	return String(string).replace(/[&<>"'\/]/g, function(s) {
		return charmap[s];
	});
}

function content(src) {
	src = src.replace(/\t/g, '    ');

	src = src.replace(/\[code\]\n((.|\n)+?)\[\/code\]/g, function(m, v) {
		return '</p><pre class="prettyprint code"><code>' + escapeHtml(v) + '</code></pre><p>';
	});

	src = src.replace(/\[output\]\n((.|\n)+?)\[\/output\]/g, function(m, v) {
		return '</p><pre class="code"><code>' + escapeHtml(v) + '</code></pre><p>';
	});

	src = src.replace(/`([^`]+?)`/g, function(m, v) {
		return '<code class="prettyprint">' + escapeHtml(v) + '</code>';
	});
	
	src = src.replace(/\*(.+?)\*/g, function(m, v) {
		return '<b>' + escapeHtml(v) + '</b>';
	});
	
	return '<p>' + src + '</p>';
}

function block(src, v) {
	if (v == 'content')
		return content(src.replace(/^.+?\n/, ''));
	if (v == 'title')
		return src.split(/\n/)[0];
	return 'UNDEFINED!';
}

function transform(template, src) {
	return template.replace(/\{\{((?!\}\}).+?)\}\}/g, function(m, v) {
		try {
			return block(src, v);
		} catch (e) {
			return '{{' + e + '}}';
		}
	});
}

fs.readFile('template.html', 'utf8', function(err, templ) {
	console.log('Loaded template.');

	files = fs.readdirSync('src');

	files.forEach(function(name) {
		if (name != 'template.html') {
			console.log('processing ' + name);

			var outname = name + '.html';
			fs.readFile('src/' + name, 'utf8', function(err, data) {
				if (err) {
					return console.log(err);
				}

				var html = transform(templ, data);
				fs.writeFile(outname, html, function(err) {
					if (err) {
						console.log(err);
					} else {
						console.log("Saved: " + outname);
					}
				});
			});
		}
	});
});
