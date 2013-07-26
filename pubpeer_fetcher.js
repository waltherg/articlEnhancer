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

function Identifier () {
    this.id = null;
    this.type = null;

    var doi = null;
    var pmid = null;
    var arxiv = null;

    // we assume that DOI's are always in a <meta name="citation_doi"> tag
    var meta = document.getElementsByTagName('meta');
    
    for(var i=0; i<meta.length; i++){
		if(meta[i].name == "citation_doi"){
			doi = meta[i].content;
		}
    }
    
    if(doi){
        this.id = doi;
        this.type = "doi";
        return this;
    }

    if (!doi) {
	    var dd = document.getElementsByTagName('dd');
	    try{
		    pmid = dd[0].innerHTML;
	    } catch(err) {

	    }

        if(pmid){
            this.id = pmid;
            this.type = "pmid";
            return this;
        }
    }

    if(!doi && !pmid){
	    var meta = document.getElementsByName('citation_arxiv_id')[0];
	    arxiv = meta.content;
	    
        if(arxiv){
            this.id = arxiv;
            this.type = "arxiv";
            return this;
        }
    }

    return null;
}

var title = null;

var hostname = window.location.hostname;

var identifier = new Identifier();

if(identifier)
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

	var address = "http://api.pubpeer.com/v1/publications/"+identifier.id+"?idType="+identifier.type+"&devkey=hack4ac";    
	console.log("articlEnhancer: Address for PubPeer query: "+address);

    $.ajax(address
          ).done(function(data) {
			  var json = $.parseJSON(data);
			console.log("articlEnhancer: json.total_comments: "+json.total_comments);
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
