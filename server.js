console.log('Starting jsXslTransform');
const url = require('url')
	, path = require('path')
	, fs=require('fs');
var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , app = express();
app.set('port', process.env.PORT || process.env.npm_package_config_port || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
function errorHandler(err, req, res, next) {
		console.error('errorHandler '+err+(err.stack?err.stack:""));
		 if (res.headersSent)
			    return next(err);
		res.status(500);
		res.render('error', { error: "Internal error" });
	}
app.use(errorHandler);
(function (p) {
	var f,include,type,n, s="console.log('initialise');var s,head0=document.getElementsByTagName('head')[0];";
	for(var i in p) {
		n=p[i];
		f=path.dirname(require.resolve(n.id+path.sep+"README.md"))+(n.offset?path.sep+n.offset:"");
		console.log("use "+n.id +' ==> '+f);
		app.use('/'+n.id, express.static(f));
		if(n.include)
			for(var j in n.include) {
				include=n.id+'/'+n.include[j];
				if((include.match(/[^\\\/]\.([^.\\\/]+)$/) || [null]).pop()=='js') {
					s+="var e=document.createElement('script');"
						+"e.type='text/javascript';"
						+"e.src = '"+include+"';"; 
				} else {
					s+="var e=document.createElement('link');";
						+"e.type='text/javascript';"
						+"e.rel='stylesheet';"
						+"e.href='"+include+"';"; 
				}
				s+="head0.appendChild(e);console.log('initialise include issued for: "+include+"');";
			}
	}
	s+="console.log('initialise end');";
	app.get('/initialise',function (req, res, next) {
		res.send(s); 
	});
}) ([{id:'requirejs'}
	,{id:'bootstrap',offset:'dist',include:['js/bootstrap.min.js','css/bootstrap.min.css']}
	]);
if ('development' === app.get('env')) {
	console.log('development mode');
	global.bypassSignon=true;
}
app.get('/', routes.index);
app.all('*', function (req, res, next) {
		console.log('check');
		if (global.bypassSignon || req.session && req.session.authorized)
			return next();
		res.status(401);
		res.render('error',{error:"Signon Required"}); 
	});
var fileExtensions = {
	listRecursiveSync: function(d){
			var n,l=fs.readdirSync(d);
			for (var i in l) {
				n=path.join(d,l[i]);
				if (fs.statSync(n).isDirectory()) l[i] = this.listRecursiveSync(n);
			}
			return l;
		}
	};
app.all('/transformSelectList', function (req, res, next) {
		var list=""
			,l=fileExtensions.listRecursiveSync(path.join(__dirname,"public","xsl"));
		l.forEach(function(c) {
		    	list += "<option value=\""+c+"\">"+c+"</option>";
		  	}, this);
		res.send("<select>"+list+"</select>"); 
	});
http.createServer(app).listen(app.get('port'), function(){
		console.log('jsXslTransform express server listening on port ' + app.get('port'));
	});
