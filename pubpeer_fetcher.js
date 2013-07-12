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

		// one some PubMed / PMC pages the title <h1> tag is not classified
		// at least for now, the title is then found in the second <h1> tag
		title = h1[1];
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
	$(title).css("background", "#355f78");
	title.style.paddingLeft = '6px';
	title.style.paddingTop = '4px';
	title.style.paddingRight = '6px';
	title.style.paddingBottom = '4px';
	title.style.border = "thick dashed #000";
	title.style.color = "#fff";
	$(title).css("cursor", "pointer");

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
			console.log("json.total_comments: "+json.total_comments);
			if(json.total_comments > 0){
				title.style.border = "thick solid #ff9e29";
			}
			else{
				title.style.border = "thick solid #b5b5b5";
			}
			
			$(title).click(function(){
					window.open(json.url, '_blank');
			});

           });
}
