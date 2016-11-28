/*
 * Copyright (C) 2016 Jaroslav Peter Prib
 * 
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 * 
 * You should have received a copy of the GNU General Public License along with
 * this program. If not, see <http://www.gnu.org/licenses/>.
 * 
 */
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

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(function(require) {
	    //The value returned from the function is
	    //used as the module export visible to Node.
	    return XslTransform;
	});
