ae_hosts = {
    "names": [
        "ncbi.nlm.nih.gov", 
        "plos",
        "cell.com",
        "peerj.com",
        "elifesciences",
        "arxiv.org"
    ],

    "plos": ["title = document.getElementsByTagName('h1')[0];"],
    "ncbi.nlm.nih.gov": [
        "var h1 = document.getElementsByTagName('h1');",
        "for(var i=0; i<h1.length; i++){",
        "if(h1[i].className == \"content-title\"){",
        "console.log(h1[i]);",
        "title = h1[i];",
        "}",
        "}",
        "if ( title == null )",
        "title = h1[1];"
    ],
    "cell.com": [
		"title = document.getElementById('top_title');",
		"if(!title){",
		"title = document.getElementById('article_title');",
		"}"
    ],
    "peerj.com": [
        "var h1 = document.getElementsByTagName('h1');",
		"for(var i=0; i<h1.length; i++){",
		"if(h1[i].className == \"article-title\"){",
		"title = h1[i];",
	    "}",
		"}"
    ],
    "elifesciences": [
        "var h1 = document.getElementsByTagName('h1');",
		"for(var i=0; i<h1.length; i++){",
		"if(h1[i].className == \"page-title\"){",
		"console.log(h1[i]);",
		"title = h1[i];",
		"}",
		"}"
    ],
    "arxiv.org": [
        "var h1 = document.getElementsByTagName('h1');",
		"for(var i=0; i<h1.length; i++){",
		"if(h1[i].className == \"title\"){",
		"title = h1[i];",
	    "}",
		"}"
    ]
};
