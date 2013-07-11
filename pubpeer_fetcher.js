function get_title_element(hostname){
	var title = null;
	console.log("get_title_element hostname: "+hostname);
	
	if (hostname.indexOf("cell.com") != -1){
		console.log("get_title_element cell.com detected");
		title = document.getElementById('top_title');
		if(!title){
			title = document.getElementById('article_title');
		}
	}
	else if (hostname.indexOf("peerj.com") != -1){
		var h1 = document.getElementsByTagName('h1');
		for(var i=0; i<h1.length; i++){
				if(h1[i].className == "article-title"){
						title = h1[i];
				}
		}
	}
	else if (hostname.indexOf("plos") != -1){
		title = document.getElementsByTagName('h1')[0];
	}
	else if (hostname.indexOf("elifesciences") != -1){
		var h1 = document.getElementsByTagName('h1');
		for(var i=0; i<h1.length; i++){
				if(h1[i].className == "page-title"){
						console.log(h1[i]);
						title = h1[i];				
				}
		}
	}
	else if (hostname.indexOf("ncbi.nlm.nih.gov") != -1){
		var h1 = document.getElementsByTagName('h1');
		for(var i=0; i<h1.length; i++){
				if(h1[i].className == "content-title"){
						console.log(h1[i]);
						title = h1[i];				
				}
		}
	}
	else if (hostname.indexOf("arxiv.org") != -1) {
		var h1 = document.getElementsByTagName('h1');
		for(var i=0; i<h1.length; i++){
				if(h1[i].className == "title"){
						title = h1[i];				
				}
		}
	}

	return title;
}

var doi = null;
var pmid = null;
var arxvi = null;
var title = null;

var hostname = window.location.hostname;
console.log("hostname: "+hostname);

// we assume that DOI's are always in a <meta name="citation_doi"> tag
var meta = document.getElementsByTagName('meta');

for(var i=0; i<meta.length; i++){
		if(meta[i].name == "citation_doi"){
				doi = meta[i].content;
		}
}
console.log("doi: "+doi);

if (!doi) {
	var dd = document.getElementsByTagName('dd');
	try{
		pmid = dd[0].innerHTML;
	} catch(err) {
		
	}
}
console.log("pmid: "+pmid);

if(!doi && !pmid){
	var meta = document.getElementsByName('citation_arxiv_id')[0];
	console.log("meta element found: "+meta.content);
	arxiv = meta.content;
	console.log("arxiv: "+arxiv);
}

// get title element
if(doi || pmid || arxiv){
	title = get_title_element(hostname);
	console.log("Title element received from get_title_element: "+title);
	console.log("Value of title element received: "+title.innerHTML);
}

// if doi and title element found, search for PubPeer content and alter title element
if(title){
	var original = $(title).css("background");
	$(title).hover(
	function(){
		$(this).css("background", "#ffe9e9");
	},
	function(){
		$(this).css("background", original);
	});
			
	$(title).css("cursor", "pointer");
	$(title).css("text-decoration","underline");

	var address = null;
	if(doi){
		address = "http://api.pubpeer.com/v1/publications/"+doi+"?idType=doi&devkey=hack4ac";
	}
	else if(pmid){
		address = "http://api.pubpeer.com/v1/publications/"+pmid+"?idType=pubmed&devkey=hack4ac";
	}
	else if(arxiv){
		address = "http://api.pubpeer.com/v1/publications/"+arxiv+"?idType=arxivd&devkey=hack4ac";
	}
	console.log("Address for PubPeer query: "+address);
    $.ajax(address
          ).done(function(data) {
              var json = $.parseJSON(data);

			if(json.total_comments > 0){
				title.style.fontWeight = "bold";
				title.style.color = "#3B5998";
				var original = $(title).css("background-color");
				$(title).hover(
				function(){
					$(this).css("background-color", "#e5ffe3");
				},
				function(){
					$(this).css("background-color", original);
				});
			}
			else{
				var original = $(title).css("background");
				$(title).hover(
				function(){
					$(this).css("background", "#ffe9e9");
				},
				function(){
					$(this).css("background", original);
				});
			}
			
			$(title).css("cursor", "pointer");
			$(title).click(function(){
					window.open(json.url, '_blank');
			});
			$(title).css("text-decoration","underline");

           });
}
