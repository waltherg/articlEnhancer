
var doi = null;
var title = null;

var hostname = window.location.hostname;
console.log("hostname: "+hostname);

if( hostname.indexOf("cell.com") != -1 ){
	var meta = document.getElementsByTagName('meta');

	for(var i=0; i<meta.length; i++){
			if(meta[i].name == "citation_doi"){
					doi = meta[i].content;
			}
	}

	title = document.getElementById('top_title');
	if(!title){
		title = document.getElementById('article_title');
	}
}
else if( hostname.indexOf("peerj.com") != -1 ){
		var meta = document.getElementsByTagName('meta');
		var h1 = document.getElementsByTagName('h1');

		for(var i=0; i<meta.length; i++){
				if(meta[i].name == "citation_doi"){
						doi = meta[i].content;
				}
		}

		for(var i=0; i<h1.length; i++){
				if(h1[i].className == "article-title"){
						title = h1[i];
				}
		}
}
else if( hostname.indexOf("plos") != -1 ){
		var meta = document.getElementsByTagName('meta');
		var h1 = document.getElementsByTagName('h1');

		title = document.getElementsByTagName('h1')[0];

		for(var i=0; i<meta.length; i++){
				if(meta[i].name == "citation_doi"){
						doi = meta[i].content;
				}
		}
}
else if( hostname.indexOf("elifesciences") != -1 ){
		var meta = document.getElementsByTagName('meta');
		var h1 = document.getElementsByTagName('h1');

		for(var i=0; i<meta.length; i++){
				if(meta[i].name == "citation_doi"){
						doi = meta[i].content;
				}
		}

		for(var i=0; i<h1.length; i++){
				if(h1[i].className == "page-title"){
						console.log(h1[i]);
						title = h1[i];				}
		}
}

console.log("doi: "+doi+"; title: "+title);

//title = h1[0].content;
//alert(h1[0].textContent);

//h1[0].style = "font-weight: bold";

if(doi){
    var address = "http://api.pubpeer.com/v1/publications/"+doi+"?idType=doi&devkey=hack4ac";
    $.ajax(address
          ).done(function(data) {
              var json = $.parseJSON(data);
	          
							if(json.total_comments > 0){
								title.style.fontWeight = "bold";
								title.style.color = "#3B5998";
							}
							
							$(title).css("cursor", "pointer");
							$(title).click(function(){
									window.open(json.url, '_blank');
							});
							$(title).css("text-decoration","underline");

           });
}
