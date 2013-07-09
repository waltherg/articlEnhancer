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

	return title;
}

var doi = null;
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

// get title element
if(doi){
    var address = "http://api.pubpeer.com/v1/publications/"+doi+"?idType=doi&devkey=hack4ac";
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
