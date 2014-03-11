var http = require("http");
var dust = require("dustjs-linkedin");
require("dustjs-helpers");
var fs = require("fs");
var querystring = require("querystring");
var port = 13000;

var parsePostData = function(request, response, callback){
	var queryData = "";

	if(request.method === "POST"){
		request.on("data", function(data){
			queryData = queryData + data;
			if(queryData.length > 1e6){
				queryData = "";
				response.writeHead(413, mimeMapper.text)
				response.connection.destroy();
			}
		});		
		request.on("end", function(){
			response.body = querystring.parse(queryData);			
			callback();
		})
	}else{
		response.writeHead(405, mimeMapper.text);
		response.end();
	}
};
var mimeMapper = {
	"text" : {
		"Content-Type" : "text/plain"
	},
	"html" : {
		"Content-Type" : "text/html"	
	},
	"js" : {
		"Content-Type" : "application/javascript"
	}
};
var urlMapper = {
	"/" : function(request, response){		
		fs.readFile("index.html", function(error, html){
			var responseCode = 200;
			var responseBody = html;
			if(error){
				responseCode = 500;
				responseBody = error;
			}

			response.writeHead(responseCode, mimeMapper.html);
			response.end(responseBody);			
		});		
	},
	"/compile" : function(request, response){
		var body = response.body;		
		var compiledMarkup;
		var responseCode = 200;
		
		if(body){
			try{
				compiledMarkup = dust.compile(body.markup, body.id);				
			}catch(e){
                console.error(e);
				responseCode = 500;
				compiledMarkup = e;
			}			
		}	
		console.log("compile result : " + compiledMarkup);
		response.writeHead(responseCode, mimeMapper.text);
		response.end(compiledMarkup);
	},
	"/render" :  function(request, response){
		var body = response.body;
		var errorText;
		if(body && body.id && body.compiledMarkup){
			dust.loadSource(body.compiledMarkup);
			dust.render(body.id, body.data, function(error, html){
				if(error){					
					response.writeHead(500, mimeMapper.text);						
					response.end(error.message);
				}else{
					response.writeHead(200, mimeMapper.html);
					response.end(html);
				}
			});
		}else{
			errorText = "파라메터가 올바르지 않습니다.";
			if(!body){
				errorText += " 파라메터 자체가 존재하지 않습니다.";
			}else{
				errorText = errorText + "id와 compiledMarkup은 반드시 존재해야 합니다.";
				errorText = errorText + " id : " + body.id + ", compiledMarkup : " + body.compiledMarkup
			}
			response.writeHead(400, mimeMapper.text);
			response.end(errorText);		
		}
		
	}
}

http.createServer(function(request, response){
	var url = request.url;
	var body;
	if(url.indexOf("?") > - 1){
		url = url.split("?")[0];
		body = querystring.parse(request.url.split("?")[1]);
			response.body = body;
	}
	var resolver = url;
	
	if(urlMapper.hasOwnProperty(resolver)){
		if(request.method === "POST"){
			parsePostData(request, response, function(){
				urlMapper[resolver](request, response);
			});
		}else{			
			urlMapper[resolver](request, response);
		}		
	}else{
		console.error(resolver + " is not found.");
		response.end(resolver + " is not found.");
	}
}).listen(port);

console.log("dust rendering server on. port : " + port);