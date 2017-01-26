/*
 * Copyright (C) 2017 Jaroslav Peter Prib
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
requirejs.onError = function (e) {
    console.log("requirejs.onError "+e.requireType);
    if (e.requireType === 'timeout')
        console.log('modules: ' + e.requireModules);
    console.error('requirejs.onError '+ e + "\nStack: "+(e.stack||"null"));
    throw e;
};
require.config(
	{paths: 
		{'LoaderDocument': 'LoaderDocument'
		,'XslTransform': 'XslTransform'
		}
	});
require(['XslTransform','LoaderDocument'], function (Xslt,Loader) {
		var dataLoads = document.getElementsByClassName('DataLoader');
		for(var i=0,l=dataLoads.length;i<l;i++) 
			(new Loader(dataLoads[i])).loadHtmlInner(dataLoads[i].dataset.source);
	});



