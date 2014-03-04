fs = require('fs');

var files = fs.readdirSync('src');

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

function articles() {
	var all = '';

	files.forEach(function(name) {
		if (name != 'template.html') {
			var url = name + '.html';
			if (url == 'index.html') {
				url = '/';
			}

			var data = fs.readFileSync('src/' + name, 'utf8');
			var caption = data.split(/\n/)[0];
			all += '<p><a href="' + url + '">' + caption + '</a></p>';
		}
	});

	return all;
}

function content(src) {
	src = src.replace(/\t/g, '    ');

	src = src.replace(/\[columns\:(\d+?)\:(\d+?)\]((?:.|\n)+?)\[column-separator\]((?:.|\n)+?)\[\/columns\]/g,
			function(m, c1, c2, v1, v2) {
				return '<div class="row row-separated"><div class="col-md-' + c1 + '">' + v1
						+ '</div><div class="col-md-' + c2 + '">' + v2 + '</div></div>';
			});

	src = src.replace(/\[code\]\n((.|\n)+?)\[\/code\]/g, function(m, v) {
		return '<pre class="prettyprint code"><code>' + escapeHtml(v) + '</code></pre>';
	});

	src = src.replace(/\[output\]\n((.|\n)+?)\[\/output\]/g, function(m, v) {
		return '<pre class="code"><code>' + escapeHtml(v) + '</code></pre>';
	});

	src = src.replace(/\[remark\]((.|\n)+?)\[\/remark\]/g, function(m, v) {
		return '<div class="remark">' + escapeHtml(v) + '</div>';
	});

	src = src.replace(/\[sub\]((.|\n)+?)\[\/sub\]/g, function(m, v) {
		return '<div class="sub text-center">' + escapeHtml(v) + '</div>';
	});

	src = src.replace(/\[caption\]((.|\n)+?)\[\/caption\]/g, function(m, v) {
		return '<div class="caption">' + escapeHtml(v) + '</div>';
	});

	src = src.replace(/\[bad\]((.|\n)+?)\[\/bad\]/g, function(m, v) {
		return '<div class="caption bad">' + escapeHtml(v) + '</div>';
	});

	src = src.replace(/\[good\]((.|\n)+?)\[\/good\]/g, function(m, v) {
		return '<div class="caption good">' + escapeHtml(v) + '</div>';
	});

	src = src.replace(/`([^`]+?)`/g, function(m, v) {
		return '<code class="prettyprint">' + escapeHtml(v) + '</code>';
	});

	src = src.replace(/\*(.+?)\*/g, function(m, v) {
		return '<b>' + escapeHtml(v) + '</b>';
	});

	src = src.replace(/\[br\]/g, function(m, v) {
		return '<br/>';
	});

	src = src.replace(/\[(.+?)\:\:(.+?)\]/g, function(m, v1, v2) {
		return '<a href="' + v2 + '" rel="nofollow">' + escapeHtml(v1) + '</a>';
	});

	return src;
}

function block(src, v, url) {
	if (v == 'content')
		return content(src.replace(/^.+?\n/, ''));
	if (v == 'title')
		return src.split(/\n/)[0].trim();
	if (v == 'articles')
		return articles();
	if (v == 'url')
		return url;
	return 'UNDEFINED!';
}

function transform(template, src, url) {
	return template.replace(/\{\{((?!\}\}).+?)\}\}/g, function(m, v) {
		try {
			return block(src, v, url);
		} catch (e) {
			return '{{' + e + '}}';
		}
	});
}

fs.readFile('template.html', 'utf8', function(err, templ) {
	console.log('Loaded template.');

	files.forEach(function(name) {
		if (name != 'template.html') {
			console.log('processing ' + name);

			var outname = name + '.html';
			fs.readFile('src/' + name, 'utf8', function(err, data) {
				if (err) {
					return console.log(err);
				}

				var url = outname != 'index.html' ? '/' + outname : '/';

				var html = transform(templ, data, url);
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
