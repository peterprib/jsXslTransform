function XslTransform () {
	if (window.ActiveXObject)   // code for IE
		this.transformEngine=this.transformEngineWindows;
  	else if (document.implementation && document.implementation.createDocument) {
  		this.xsltProcessor=new XSLTProcessor();
  		this.transformEngine=this.transformEngineMoz;
  	} else 
  		throw Error("Browser not supported")
	this.outstandingTasks=1;
	this.xslDom=null;
	this.xmlDom=null;
	this.output=null;
}
XslTransform.prototype.getXmlDom = function (url,aProperty,callBack,callBackObject,callBackArgs) {
		this.outstandingTasks++;
		var thisObject=this
			,xmlHttp=window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
		xmlHttp.onerror=function() {
				alert ("xmlhttp onerror "+url);
			};
		xmlHttp.onload=function() {
				if(xmlHttp.responseXML==null)
					throw Error("getXml loade failed for "+aProperty + " url: "+url);
				thisObject[aProperty]=xmlHttp.responseXML;
				console.log("loaded "+aProperty);
				callBack.apply(callBackObject,callBackArgs);
			};
		xmlHttp.open("GET",url);
		xmlHttp.send();
	};
XslTransform.prototype.initialise = function (xsl,xml,callback,callBackObject,callBackArg) {
		if(callback) {
			this.callback=callback;
			this.callBackObject=callBackObject;
			this.callBackArg=callBackArg;
		}
		this.setXsl(xsl);
		if(xml) {
			this.setXml(xml);
			this.outstandingTasks--;
		}
	};
XslTransform.prototype.setXml = function (url) {
		this.getXmlDom(url,'xmlDom',this.transform,this);
	};
XslTransform.prototype.setXsl = function (url) {
		this.getXmlDom(url,'xslDom',this.setStylesheet,this);
	};
XslTransform.prototype.setStylesheet = function () {
		if (!window.ActiveXObject   // code for IE
		&& document.implementation && document.implementation.createDocument)  {
	  		this.xsltProcessor.importStylesheet(this.xslDom);
	 	}
		this.transform();
	};
XslTransform.prototype.transform = function () {
		if(--this.outstandingTasks>0) return;
		this.transformEngine();
		if(this.callback) this.callback.apply(this.callBackObject,this.callBackArgs);
	};
XslTransform.prototype.transformEngineWindows = function () {
		this.output=this.xmlDom.transformNode(this.xslDom);
	};
XslTransform.prototype.transformEngineMoz = function () {
		this.output=this.xsltProcessor.transformToDocument(this.xmlDom);
	};
XslTransform.prototype.getText = function () {
		return this.output.firstChild.nextSibling.innerText;;
	};
