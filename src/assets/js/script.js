// Quote Ajax (JSONP)
// import { Encoder } from "./encoder";

function getQuote() { // create onclick function
	const quoteScript = document.createElement('script'); // create script element

	quoteScript.requestId = Math.floor(Math.random() * 999999).toString(); // set 'cache-buster' attribute
	quoteScript.type = 'text/javascript'; // set script type attribute
	quoteScript.id = 'quoteScript'; // set script id attribute
	quoteScript.src = `http://quotesondesign.com/wp-json/posts?requestId=${quoteScript.requestId}&filter[orderby]=rand&filter[posts_per_page]=1&_jsonp=setQuote`; // set script source attribute

	document.getElementsByTagName('head')[0].appendChild(quoteScript); // append script element to head of document

	// callback function (setQuote) envoked when finished //
};

window.onload = getQuote;

function setQuote(data) { // function to handle JSONP payload
	// store data in local variable
	// let currentQuoteObject = data[0];

	// !quoteCache
	// ? const quoteCache = {}
	// ? quoteCache.hasOwnProperty(data[0].ID)
	// : quoteCache[data[0].ID] = data[0].ID;

	const head = document.getElementsByTagName('head');
	const title = document.getElementsByTagName('title');
	const quote = document.getElementsByClassName('quote');
	const author = document.getElementsByClassName('author');
	const source = document.getElementsByClassName('source');

	delete window[setQuote]; // garbage collection

	head[0].removeChild(quoteScript); // remove script element

	title[0].innerHTML = `Random Quote Machine - #${data[0].ID}`;

	quote[0].innerHTML = `${data[0].content}`; // set quote content
	author[0].innerHTML = `- ${data[0].title}`; // set author content
	if (data[0].custom_meta) {
		source[0].innerHTML = `	${data[0].custom_meta.Source}`; // set source content
	}

	function formatTweet() {
		const rawTweet = `${data[0].content}`;
		let tweetAuthor = `- ${data[0].title}`;
		let finalTweet = `${rawTweet}`;

		if (Encoder.hasEncoded(finalTweet)) {
			finalTweet = Encoder.htmlDecode(finalTweet);
		}

		if (Encoder.hasEncoded(tweetAuthor)) {
			tweetAuthor = Encoder.htmlDecode(tweetAuthor);
		}

		const openParTagSingle = new RegExp(/<p[^>]*>/, ''); // first open p element
		const openParTagGlobal = new RegExp(/<p[^>]*>/, 'g'); // remaining open p elements
		const endOfLine1 = new RegExp(/([^\w\s])\s*<\/p>\n$/, ''); // end of line
		const endOfLine2 = new RegExp(/([^\W\s])\s*<\/p>\n$/, ''); // end of line
		const anyElemGlobal = new RegExp(/<\/?[^>]+(>|$)/, 'g'); // any remaining elements

		if (finalTweet.length > 145) {
			finalTweet = `"${finalTweet
				.replace(openParTagSingle, '')
				.replace(openParTagGlobal, '\n')
				.replace(endOfLine1, '').replace(anyElemGlobal, '')
				.slice(0, 140 - (tweetAuthor.length + 7))}..."\n\n${tweetAuthor}`;
		} else {
			finalTweet = `"${finalTweet
				.replace(openParTagSingle, '')
				.replace(openParTagGlobal, '\n')
				.replace(endOfLine1, '$1"\n\n')
				.replace(endOfLine2, '$1\."\n\n').replace(anyElemGlobal, '')}${tweetAuthor}`;
		}

		// TODO - try to pull text from element instead of array object
		function tweetQuote(finalTweet) {
			// window.open("http://twitter.com/intent/tweet?text=" + finalTweet);
			const tweetUrl = `http://twitter.com/home?status=${encodeURIComponent(finalTweet)}`;
			window.open(tweetUrl, '_blank');
		};

		tweetQuote();

	};

	formatTweet();

}
