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

function prettyloaded() {
	prettyPrint();
}

loadScript("prettify.js", prettyloaded);
loadScript("jquery-2.0.3.js");
loadScript("bootstrap3.min.js");
loadScript("social-utils.js");
loadScript("https://apis.google.com/js/plusone.js");
loadScript("http://platform.linkedin.com/in.js");
