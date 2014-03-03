function loadScript(url, callback) {
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;

	if (callback) {
		script.onreadystatechange = callback;
		script.onload = callback;
	}

	head.appendChild(script);
}

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

function jqloaded() {
	// will contain list of articles
	var ohmDbCode = 'OhmDB db = Ohm.db("my.db");\nTable<Item> items;\nitems = db.table(Item.class);\nItem foo = new Item("foo");\nlong id = items.insert(foo);';

	var ohmExample = '<pre class="prettyprint right-snippet"><code>' + escapeHtml(ohmDbCode) + '</pre></code>';

	$('#right').html(
			'<h3>Sponsors:</h3><a href="http://www.ohmdb.com"><img src="ohmdb-logo.png"/><br/>' + ohmExample + '<p>OhmDB - The Irresistible Database for Java</p></a>');
	
	prettyPrint();
}

function prettyloaded() {
	prettyPrint();
}

loadScript("prettify.js", prettyloaded);
loadScript("jquery-2.0.3.js", jqloaded);
loadScript("bootstrap3.min.js");
loadScript("social-utils.js");
loadScript("extra-content.js");
loadScript("https://apis.google.com/js/plusone.js");
loadScript("http://platform.linkedin.com/in.js");
