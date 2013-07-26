function get_host(hostname){
    for(i in ae_hosts["names"])
        if(hostname.indexOf(ae_hosts["names"][i]) != -1)
            return ae_hosts["names"][i];
}

function get_title_element(hostname){
    var title = null;
    var host = get_host(hostname);

    var command = "";
    for(i in ae_hosts[host])
        command += ae_hosts[host][i] + "\n";

    title = eval(command);

	return title;
}

var doi = null;
var pmid = null;
var arxiv = null;
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
if(doi || pmid || arxiv)
    title = get_title_element(hostname);

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
