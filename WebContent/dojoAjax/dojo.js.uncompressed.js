/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/

if(typeof dojo == "undefined"){

// TODOC: HOW TO DOC THE BELOW?
// @global: djConfig
// summary:
//		Application code can set the global 'djConfig' prior to loading
//		the library to override certain global settings for how dojo works.
// description:  The variables that can be set are as follows:
//			- isDebug: false
//			- allowQueryConfig: false
//			- baseScriptUri: ""
//			- baseRelativePath: ""
//			- libraryScriptUri: ""
//			- iePreventClobber: false
//			- ieClobberMinimal: true
//			- locale: undefined
//			- extraLocale: undefined
//			- preventBackButtonFix: true
//			- searchIds: []
//			- parseWidgets: true
// TODOC: HOW TO DOC THESE VARIABLES?
// TODOC: IS THIS A COMPLETE LIST?
// note:
//		'djConfig' does not exist under 'dojo.*' so that it can be set before the
//		'dojo' variable exists.
// note:
//		Setting any of these variables *after* the library has loaded does nothing at all.
// TODOC: is this still true?  Release notes for 0.3 indicated they could be set after load.
//


//TODOC:  HOW TO DOC THIS?
// @global: dj_global
// summary:
//		an alias for the top-level global object in the host environment
//		(e.g., the window object in a browser).
// description:
//		Refer to 'dj_global' rather than referring to window to ensure your
//		code runs correctly in contexts other than web browsers (eg: Rhino on a server).
var dj_global = this;

//TODOC:  HOW TO DOC THIS?
// @global: dj_currentContext
// summary:
//		Private global context object. Where 'dj_global' always refers to the boot-time
//    global context, 'dj_currentContext' can be modified for temporary context shifting.
//    dojo.global() returns dj_currentContext.
// description:
//		Refer to dojo.global() rather than referring to dj_global to ensure your
//		code runs correctly in managed contexts.
var dj_currentContext = this;


// ****************************************************************
// global public utils
// TODOC: DO WE WANT TO NOTE THAT THESE ARE GLOBAL PUBLIC UTILS?
// ****************************************************************

function dj_undef(/*String*/ name, /*Object?*/ object){
	//summary: Returns true if 'name' is defined on 'object' (or globally if 'object' is null).
	//description: Note that 'defined' and 'exists' are not the same concept.
	return (typeof (object || dj_currentContext)[name] == "undefined");	// Boolean
}

// make sure djConfig is defined
if(dj_undef("djConfig", this)){
	var djConfig = {};
}

//TODOC:  HOW TO DOC THIS?
// dojo is the root variable of (almost all) our public symbols -- make sure it is defined.
if(dj_undef("dojo", this)){
	var dojo = {};
}

dojo.global = function(){
	// summary:
	//		return the current global context object
	//		(e.g., the window object in a browser).
	// description:
	//		Refer to 'dojo.global()' rather than referring to window to ensure your
	//		code runs correctly in contexts other than web browsers (eg: Rhino on a server).
	return dj_currentContext;
}

// Override locale setting, if specified
dojo.locale  = djConfig.locale;

//TODOC:  HOW TO DOC THIS?
dojo.version = {
	// summary: version number of this instance of dojo.
	major: 0, minor: 4, patch: 2, flag: "-20070622",
	revision: Number("$Rev: 7616 $".match(/[0-9]+/)[0]),
	toString: function(){
		with(dojo.version){
			return major + "." + minor + "." + patch + flag + " (" + revision + ")";	// String
		}
	}
}

dojo.evalProp = function(/*String*/ name, /*Object*/ object, /*Boolean?*/ create){
	// summary: Returns 'object[name]'.  If not defined and 'create' is true, will return a new Object.
	// description:
	//		Returns null if 'object[name]' is not defined and 'create' is not true.
	// 		Note: 'defined' and 'exists' are not the same concept.
	if((!object)||(!name)) return undefined; // undefined
	if(!dj_undef(name, object)) return object[name]; // mixed
	return (create ? (object[name]={}) : undefined);	// mixed
}

dojo.parseObjPath = function(/*String*/ path, /*Object?*/ context, /*Boolean?*/ create){
	// summary: Parse string path to an object, and return corresponding object reference and property name.
	// description:
	//		Returns an object with two properties, 'obj' and 'prop'.
	//		'obj[prop]' is the reference indicated by 'path'.
	// path: Path to an object, in the form "A.B.C".
	// context: Object to use as root of path.  Defaults to 'dojo.global()'.
	// create: If true, Objects will be created at any point along the 'path' that is undefined.
	var object = (context || dojo.global());
	var names = path.split('.');
	var prop = names.pop();
	for (var i=0,l=names.length;i<l && object;i++){
		object = dojo.evalProp(names[i], object, create);
	}
	return {obj: object, prop: prop};	// Object: {obj: Object, prop: String}
}

dojo.evalObjPath = function(/*String*/ path, /*Boolean?*/ create){
	// summary: Return the value of object at 'path' in the global scope, without using 'eval()'.
	// path: Path to an object, in the form "A.B.C".
	// create: If true, Objects will be created at any point along the 'path' that is undefined.
	if(typeof path != "string"){
		return dojo.global();
	}
	// fast path for no periods
	if(path.indexOf('.') == -1){
		return dojo.evalProp(path, dojo.global(), create);		// mixed
	}

	//MOW: old 'with' syntax was confusing and would throw an error if parseObjPath returned null.
	var ref = dojo.parseObjPath(path, dojo.global(), create);
	if(ref){
		return dojo.evalProp(ref.prop, ref.obj, create);	// mixed
	}
	return null;
}

dojo.errorToString = function(/*Error*/ exception){
	// summary: Return an exception's 'message', 'description' or text.

	// TODO: overriding Error.prototype.toString won't accomplish this?
 	// 		... since natively generated Error objects do not always reflect such things?
	if(!dj_undef("message", exception)){
		return exception.message;		// String
	}else if(!dj_undef("description", exception)){
		return exception.description;	// String
	}else{
		return exception;				// Error
	}
}

dojo.raise = function(/*String*/ message, /*Error?*/ exception){
	// summary: Common point for raising exceptions in Dojo to enable logging.
	//	Throws an error message with text of 'exception' if provided, or
	//	rethrows exception object.

	if(exception){
		message = message + ": "+dojo.errorToString(exception);
	}else{
		message = dojo.errorToString(message);
	}

	// print the message to the user if hostenv.println is defined
	try { if(djConfig.isDebug){ dojo.hostenv.println("FATAL exception raised: "+message); } } catch (e) {}

	throw exception || Error(message);
}

//Stub functions so things don't break.
//TODOC:  HOW TO DOC THESE?
dojo.debug = function(){};
dojo.debugShallow = function(obj){};
dojo.profile = { start: function(){}, end: function(){}, stop: function(){}, dump: function(){} };

function dj_eval(/*String*/ scriptFragment){
	// summary: Perform an evaluation in the global scope.  Use this rather than calling 'eval()' directly.
	// description: Placed in a separate function to minimize size of trapped evaluation context.
	// note:
	//	 - JSC eval() takes an optional second argument which can be 'unsafe'.
	//	 - Mozilla/SpiderMonkey eval() takes an optional second argument which is the
	//  	 scope object for new symbols.
	return dj_global.eval ? dj_global.eval(scriptFragment) : eval(scriptFragment); 	// mixed
}

dojo.unimplemented = function(/*String*/ funcname, /*String?*/ extra){
	// summary: Throw an exception because some function is not implemented.
	// extra: Text to append to the exception message.
	var message = "'" + funcname + "' not implemented";
	if (extra != null) { message += " " + extra; }
	dojo.raise(message);
}

dojo.deprecated = function(/*String*/ behaviour, /*String?*/ extra, /*String?*/ removal){
	// summary: Log a debug message to indicate that a behavior has been deprecated.
	// extra: Text to append to the message.
	// removal: Text to indicate when in the future the behavior will be removed.
	var message = "DEPRECATED: " + behaviour;
	if(extra){ message += " " + extra; }
	if(removal){ message += " -- will be removed in version: " + removal; }
	dojo.debug(message);
}

dojo.render = (function(){
	//TODOC: HOW TO DOC THIS?
	// summary: Details rendering support, OS and browser of the current environment.
	// TODOC: is this something many folks will interact with?  If so, we should doc the structure created...
	function vscaffold(prefs, names){
		var tmp = {
			capable: false,
			support: {
				builtin: false,
				plugin: false
			},
			prefixes: prefs
		};
		for(var i=0; i<names.length; i++){
			tmp[names[i]] = false;
		}
		return tmp;
	}

	return {
		name: "",
		ver: dojo.version,
		os: { win: false, linux: false, osx: false },
		html: vscaffold(["html"], ["ie", "opera", "khtml", "safari", "moz"]),
		svg: vscaffold(["svg"], ["corel", "adobe", "batik"]),
		vml: vscaffold(["vml"], ["ie"]),
		swf: vscaffold(["Swf", "Flash", "Mm"], ["mm"]),
		swt: vscaffold(["Swt"], ["ibm"])
	};
})();

// ****************************************************************
// dojo.hostenv methods that must be defined in hostenv_*.js
// ****************************************************************

/**
 * The interface definining the interaction with the EcmaScript host environment.
*/

/*
 * None of these methods should ever be called directly by library users.
 * Instead public methods such as loadModule should be called instead.
 */
dojo.hostenv = (function(){
	// TODOC:  HOW TO DOC THIS?
	// summary: Provides encapsulation of behavior that changes across different 'host environments'
	//			(different browsers, server via Rhino, etc).
	// description: None of these methods should ever be called directly by library users.
	//				Use public methods such as 'loadModule' instead.

	// default configuration options
	var config = {
		isDebug: false,
		allowQueryConfig: false,
		baseScriptUri: "",
		baseRelativePath: "",
		libraryScriptUri: "",
		iePreventClobber: false,
		ieClobberMinimal: true,
		preventBackButtonFix: true,
		delayMozLoadingFix: false,
		searchIds: [],
		parseWidgets: true
	};

	if (typeof djConfig == "undefined") { djConfig = config; }
	else {
		for (var option in config) {
			if (typeof djConfig[option] == "undefined") {
				djConfig[option] = config[option];
			}
		}
	}

	return {
		name_: '(unset)',
		version_: '(unset)',


		getName: function(){
			// sumary: Return the name of the host environment.
			return this.name_; 	// String
		},


		getVersion: function(){
			// summary: Return the version of the hostenv.
			return this.version_; // String
		},

		getText: function(/*String*/ uri){
			// summary:	Read the plain/text contents at the specified 'uri'.
			// description:
			//			If 'getText()' is not implemented, then it is necessary to override
			//			'loadUri()' with an implementation that doesn't rely on it.

			dojo.unimplemented('getText', "uri=" + uri);
		}
	};
})();


dojo.hostenv.getBaseScriptUri = function(){
	// summary: Return the base script uri that other scripts are found relative to.
	// TODOC: HUH?  This comment means nothing to me.  What other scripts? Is this the path to other dojo libraries?
	//		MAYBE:  Return the base uri to scripts in the dojo library.	 ???
	// return: Empty string or a path ending in '/'.
	if(djConfig.baseScriptUri.length){
		return djConfig.baseScriptUri;
	}

	// MOW: Why not:
	//			uri = djConfig.libraryScriptUri || djConfig.baseRelativePath
	//		??? Why 'new String(...)'
	var uri = new String(djConfig.libraryScriptUri||djConfig.baseRelativePath);
	if (!uri) { dojo.raise("Nothing returned by getLibraryScriptUri(): " + uri); }

	// MOW: uri seems to not be actually used.  Seems to be hard-coding to djConfig.baseRelativePath... ???
	var lastslash = uri.lastIndexOf('/');		// MOW ???
	djConfig.baseScriptUri = djConfig.baseRelativePath;
	return djConfig.baseScriptUri;	// String
}

/*
 * loader.js - A bootstrap module.  Runs before the hostenv_*.js file. Contains all of the package loading methods.
 */

//A semi-colon is at the start of the line because after doing a build, this function definition
//get compressed onto the same line as the last line in bootstrap1.js. That list line is just a
//curly bracket, and the browser complains about that syntax. The semicolon fixes it. Putting it
//here instead of at the end of bootstrap1.js, since it is more of an issue for this file, (using
//the closure), and bootstrap1.js could change in the future.
;(function(){
	//Additional properties for dojo.hostenv
	var _addHostEnv = {
		pkgFileName: "__package__",
	
		// for recursion protection
		loading_modules_: {},
		loaded_modules_: {},
		addedToLoadingCount: [],
		removedFromLoadingCount: [],
	
		inFlightCount: 0,
	
		// FIXME: it should be possible to pull module prefixes in from djConfig
		modulePrefixes_: {
			dojo: {name: "dojo", value: "src"}
		},

		setModulePrefix: function(/*String*/module, /*String*/prefix){
			// summary: establishes module/prefix pair
			this.modulePrefixes_[module] = {name: module, value: prefix};
		},

		moduleHasPrefix: function(/*String*/module){
			// summary: checks to see if module has been established
			var mp = this.modulePrefixes_;
			return Boolean(mp[module] && mp[module].value); // Boolean
		},

		getModulePrefix: function(/*String*/module){
			// summary: gets the prefix associated with module
			if(this.moduleHasPrefix(module)){
				return this.modulePrefixes_[module].value; // String
			}
			return module; // String
		},

		getTextStack: [],
		loadUriStack: [],
		loadedUris: [],
	
		//WARNING: This variable is referenced by packages outside of bootstrap: FloatingPane.js and undo/browser.js
		post_load_: false,
		
		//Egad! Lots of test files push on this directly instead of using dojo.addOnLoad.
		modulesLoadedListeners: [],
		unloadListeners: [],
		loadNotifying: false
	};
	
	//Add all of these properties to dojo.hostenv
	for(var param in _addHostEnv){
		dojo.hostenv[param] = _addHostEnv[param];
	}
})();

dojo.hostenv.loadPath = function(/*String*/relpath, /*String?*/module, /*Function?*/cb){
// summary:
//	Load a Javascript module given a relative path
//
// description:
//	Loads and interprets the script located at relpath, which is relative to the
//	script root directory.  If the script is found but its interpretation causes
//	a runtime exception, that exception is not caught by us, so the caller will
//	see it.  We return a true value if and only if the script is found.
//
//	For now, we do not have an implementation of a true search path.  We
//	consider only the single base script uri, as returned by getBaseScriptUri().
//
// relpath: A relative path to a script (no leading '/', and typically
// 	ending in '.js').
// module: A module whose existance to check for after loading a path.
//	Can be used to determine success or failure of the load.
// cb: a callback function to pass the result of evaluating the script

	var uri;
	if(relpath.charAt(0) == '/' || relpath.match(/^\w+:/)){
		// dojo.raise("relpath '" + relpath + "'; must be relative");
		uri = relpath;
	}else{
		uri = this.getBaseScriptUri() + relpath;
	}
	if(djConfig.cacheBust && dojo.render.html.capable){
		uri += "?" + String(djConfig.cacheBust).replace(/\W+/g,"");
	}
	try{
		return !module ? this.loadUri(uri, cb) : this.loadUriAndCheck(uri, module, cb); // Boolean
	}catch(e){
		dojo.debug(e);
		return false; // Boolean
	}
}

dojo.hostenv.loadUri = function(/*String (URL)*/uri, /*Function?*/cb){
// summary:
//	Loads JavaScript from a URI
//
// description:
//	Reads the contents of the URI, and evaluates the contents.  This is used to load modules as well
//	as resource bundles.  Returns true if it succeeded. Returns false if the URI reading failed.
//	Throws if the evaluation throws.
//
// uri: a uri which points at the script to be loaded
// cb: a callback function to process the result of evaluating the script as an expression, typically
//	used by the resource bundle loader to load JSON-style resources

	if(this.loadedUris[uri]){
		return true; // Boolean
	}
	var contents = this.getText(uri, null, true);
	if(!contents){ return false; } // Boolean
	this.loadedUris[uri] = true;
	if(cb){ contents = '('+contents+')'; }
	var value = dj_eval(contents);
	if(cb){ cb(value); }
	return true; // Boolean
}

// FIXME: probably need to add logging to this method
dojo.hostenv.loadUriAndCheck = function(/*String (URL)*/uri, /*String*/moduleName, /*Function?*/cb){
	// summary: calls loadUri then findModule and returns true if both succeed
	var ok = true;
	try{
		ok = this.loadUri(uri, cb);
	}catch(e){
		dojo.debug("failed loading ", uri, " with error: ", e);
	}
	return Boolean(ok && this.findModule(moduleName, false)); // Boolean
}

dojo.loaded = function(){ }
dojo.unloaded = function(){ }

dojo.hostenv.loaded = function(){
	this.loadNotifying = true;
	this.post_load_ = true;
	var mll = this.modulesLoadedListeners;
	for(var x=0; x<mll.length; x++){
		mll[x]();
	}

	//Clear listeners so new ones can be added
	//For other xdomain package loads after the initial load.
	this.modulesLoadedListeners = [];
	this.loadNotifying = false;

	dojo.loaded();
}

dojo.hostenv.unloaded = function(){
	var mll = this.unloadListeners;
	while(mll.length){
		(mll.pop())();
	}
	dojo.unloaded();
}

dojo.addOnLoad = function(/*Object?*/obj, /*String|Function*/functionName) {
// summary:
//	Registers a function to be triggered after the DOM has finished loading 
//	and widgets declared in markup have been instantiated.  Images and CSS files
//	may or may not have finished downloading when the specified function is called.
//	(Note that widgets' CSS and HTML code is guaranteed to be downloaded before said
//	widgets are instantiated.)
//
// usage:
//	dojo.addOnLoad(functionPointer)
//	dojo.addOnLoad(object, "functionName")

	var dh = dojo.hostenv;
	if(arguments.length == 1) {
		dh.modulesLoadedListeners.push(obj);
	} else if(arguments.length > 1) {
		dh.modulesLoadedListeners.push(function() {
			obj[functionName]();
		});
	}

	//Added for xdomain loading. dojo.addOnLoad is used to
	//indicate callbacks after doing some dojo.require() statements.
	//In the xdomain case, if all the requires are loaded (after initial
	//page load), then immediately call any listeners.
	if(dh.post_load_ && dh.inFlightCount == 0 && !dh.loadNotifying){
		dh.callLoaded();
	}
}

dojo.addOnUnload = function(/*Object?*/obj, /*String|Function?*/functionName){
// summary: registers a function to be triggered when the page unloads
//
// usage:
//	dojo.addOnLoad(functionPointer)
//	dojo.addOnLoad(object, "functionName")
	var dh = dojo.hostenv;
	if(arguments.length == 1){
		dh.unloadListeners.push(obj);
	} else if(arguments.length > 1) {
		dh.unloadListeners.push(function() {
			obj[functionName]();
		});
	}
}

dojo.hostenv.modulesLoaded = function(){
	if(this.post_load_){ return; }
	if(this.loadUriStack.length==0 && this.getTextStack.length==0){
		if(this.inFlightCount > 0){ 
			dojo.debug("files still in flight!");
			return;
		}
		dojo.hostenv.callLoaded();
	}
}

dojo.hostenv.callLoaded = function(){
	//The "object" check is for IE, and the other opera check fixes an issue
	//in Opera where it could not find the body element in some widget test cases.
	//For 0.9, maybe route all browsers through the setTimeout (need protection
	//still for non-browser environments though). This might also help the issue with
	//FF 2.0 and freezing issues where we try to do sync xhr while background css images
	//are being loaded (trac #2572)? Consider for 0.9.
	if(typeof setTimeout == "object" || (djConfig["useXDomain"] && dojo.render.html.opera)){
		setTimeout("dojo.hostenv.loaded();", 0);
	}else{
		dojo.hostenv.loaded();
	}
}

dojo.hostenv.getModuleSymbols = function(/*String*/modulename){
// summary:
//	Converts a module name in dotted JS notation to an array representing the path in the source tree
	var syms = modulename.split(".");
	for(var i = syms.length; i>0; i--){
		var parentModule = syms.slice(0, i).join(".");
		if((i==1) && !this.moduleHasPrefix(parentModule)){		
			// Support default module directory (sibling of dojo) for top-level modules 
			syms[0] = "../" + syms[0];
		}else{
			var parentModulePath = this.getModulePrefix(parentModule);
			if(parentModulePath != parentModule){
				syms.splice(0, i, parentModulePath);
				break;
			}
		}
	}
	return syms; // Array
}

dojo.hostenv._global_omit_module_check = false;
dojo.hostenv.loadModule = function(/*String*/moduleName, /*Boolean?*/exactOnly, /*Boolean?*/omitModuleCheck){
// summary:
//	loads a Javascript module from the appropriate URI
//
// description:
//	loadModule("A.B") first checks to see if symbol A.B is defined. 
//	If it is, it is simply returned (nothing to do).
//	
//	If it is not defined, it will look for "A/B.js" in the script root directory,
//	followed by "A.js".
//	
//	It throws if it cannot find a file to load, or if the symbol A.B is not
//	defined after loading.
//	
//	It returns the object A.B.
//	
//	This does nothing about importing symbols into the current package.
//	It is presumed that the caller will take care of that. For example, to import
//	all symbols:
//	
//	   with (dojo.hostenv.loadModule("A.B")) {
//	      ...
//	   }
//	
//	And to import just the leaf symbol:
//	
//	   var B = dojo.hostenv.loadModule("A.B");
//	   ...
//	
//	dj_load is an alias for dojo.hostenv.loadModule

	if(!moduleName){ return; }
	omitModuleCheck = this._global_omit_module_check || omitModuleCheck;
	var module = this.findModule(moduleName, false);
	if(module){
		return module;
	}

	// protect against infinite recursion from mutual dependencies
	if(dj_undef(moduleName, this.loading_modules_)){
		this.addedToLoadingCount.push(moduleName);
	}
	this.loading_modules_[moduleName] = 1;

	// convert periods to slashes
	var relpath = moduleName.replace(/\./g, '/') + '.js';

	var nsyms = moduleName.split(".");
	
	// this line allowed loading of a module manifest as if it were a namespace
	// it's an interesting idea, but shouldn't be combined with 'namespaces' proper
	// and leads to unwanted dependencies
	// the effect can be achieved in other (albeit less-flexible) ways now, so I am
	// removing this pending further design work
	// perhaps we can explicitly define this idea of a 'module manifest', and subclass
	// 'namespace manifest' from that
	//dojo.getNamespace(nsyms[0]);

	var syms = this.getModuleSymbols(moduleName);
	var startedRelative = ((syms[0].charAt(0) != '/') && !syms[0].match(/^\w+:/));
	var last = syms[syms.length - 1];
	var ok;
	// figure out if we're looking for a full package, if so, we want to do
	// things slightly diffrently
	if(last=="*"){
		moduleName = nsyms.slice(0, -1).join('.');
		while(syms.length){
			syms.pop();
			syms.push(this.pkgFileName);
			relpath = syms.join("/") + '.js';
			if(startedRelative && relpath.charAt(0)=="/"){
				relpath = relpath.slice(1);
			}
			ok = this.loadPath(relpath, !omitModuleCheck ? moduleName : null);
			if(ok){ break; }
			syms.pop();
		}
	}else{
		relpath = syms.join("/") + '.js';
		moduleName = nsyms.join('.');
		var modArg = !omitModuleCheck ? moduleName : null;
		ok = this.loadPath(relpath, modArg);
		if(!ok && !exactOnly){
			syms.pop();
			while(syms.length){
				relpath = syms.join('/') + '.js';
				ok = this.loadPath(relpath, modArg);
				if(ok){ break; }
				syms.pop();
				relpath = syms.join('/') + '/'+this.pkgFileName+'.js';
				if(startedRelative && relpath.charAt(0)=="/"){
					relpath = relpath.slice(1);
				}
				ok = this.loadPath(relpath, modArg);
				if(ok){ break; }
			}
		}

		if(!ok && !omitModuleCheck){
			dojo.raise("Could not load '" + moduleName + "'; last tried '" + relpath + "'");
		}
	}

	// check that the symbol was defined
	//Don't bother if we're doing xdomain (asynchronous) loading.
	if(!omitModuleCheck && !this["isXDomain"]){
		// pass in false so we can give better error
		module = this.findModule(moduleName, false);
		if(!module){
			dojo.raise("symbol '" + moduleName + "' is not defined after loading '" + relpath + "'"); 
		}
	}

	return module;
}

dojo.hostenv.startPackage = function(/*String*/packageName){
// summary:
//	Creates a JavaScript package
//
// description:
//	startPackage("A.B") follows the path, and at each level creates a new empty
//	object or uses what already exists. It returns the result.
//
// packageName: the package to be created as a String in dot notation

	//Make sure we have a string.
	var fullPkgName = String(packageName);
	var strippedPkgName = fullPkgName;

	var syms = packageName.split(/\./);
	if(syms[syms.length-1]=="*"){
		syms.pop();
		strippedPkgName = syms.join(".");
	}
	var evaledPkg = dojo.evalObjPath(strippedPkgName, true);
	this.loaded_modules_[fullPkgName] = evaledPkg;
	this.loaded_modules_[strippedPkgName] = evaledPkg;
	
	return evaledPkg; // Object
}

dojo.hostenv.findModule = function(/*String*/moduleName, /*Boolean?*/mustExist){
// summary:
//	Returns the Object representing the module, if it exists, otherwise null.
//
// moduleName A fully qualified module including package name, like 'A.B'.
// mustExist Optional, default false. throw instead of returning null
//	if the module does not currently exist.

	var lmn = String(moduleName);

	if(this.loaded_modules_[lmn]){
		return this.loaded_modules_[lmn]; // Object
	}

	if(mustExist){
		dojo.raise("no loaded module named '" + moduleName + "'");
	}
	return null; // null
}

//Start of old bootstrap2:

dojo.kwCompoundRequire = function(/*Object containing Arrays*/modMap){
// description:
//	This method taks a "map" of arrays which one can use to optionally load dojo
//	modules. The map is indexed by the possible dojo.hostenv.name_ values, with
//	two additional values: "default" and "common". The items in the "default"
//	array will be loaded if none of the other items have been choosen based on
//	the hostenv.name_ item. The items in the "common" array will _always_ be
//	loaded, regardless of which list is chosen.  Here's how it's normally
//	called:
//	
//	dojo.kwCompoundRequire({
//		browser: [
//			["foo.bar.baz", true, true], // an example that passes multiple args to loadModule()
//			"foo.sample.*",
//			"foo.test,
//		],
//		default: [ "foo.sample.*" ],
//		common: [ "really.important.module.*" ]
//	});

	var common = modMap["common"]||[];
	var result = modMap[dojo.hostenv.name_] ? common.concat(modMap[dojo.hostenv.name_]||[]) : common.concat(modMap["default"]||[]);

	for(var x=0; x<result.length; x++){
		var curr = result[x];
		if(curr.constructor == Array){
			dojo.hostenv.loadModule.apply(dojo.hostenv, curr);
		}else{
			dojo.hostenv.loadModule(curr);
		}
	}
}

dojo.require = function(/*String*/ resourceName){
	// summary
	//	Ensure that the given resource (ie, javascript
	//	source file) has been loaded.
	// description
	//	dojo.require() is similar to C's #include command or java's "import" command.
	//	You call dojo.require() to pull in the resources (ie, javascript source files)
	//	that define the functions you are using. 
	//
	//	Note that in the case of a build, many resources have already been included
	//	into dojo.js (ie, many of the javascript source files have been compressed and
	//	concatened into dojo.js), so many dojo.require() calls will simply return
	//	without downloading anything.
	dojo.hostenv.loadModule.apply(dojo.hostenv, arguments);
}

dojo.requireIf = function(/*Boolean*/ condition, /*String*/ resourceName){
	// summary
	//	If the condition is true then call dojo.require() for the specified resource
	var arg0 = arguments[0];
	if((arg0 === true)||(arg0=="common")||(arg0 && dojo.render[arg0].capable)){
		var args = [];
		for (var i = 1; i < arguments.length; i++) { args.push(arguments[i]); }
		dojo.require.apply(dojo, args);
	}
}

dojo.requireAfterIf = dojo.requireIf;

dojo.provide = function(/*String*/ resourceName){
	// summary
	//	Each javascript source file must have (exactly) one dojo.provide()
	//	call at the top of the file, corresponding to the file name.
	//	For example, dojo/src/foo.js must have dojo.provide("dojo.foo"); at the top of the file.
	//
	// description
	//	Each javascript source file is called a resource.  When a resource
	//	is loaded by the browser, dojo.provide() registers that it has
	//	been loaded.
	//	
	//	For backwards compatibility reasons, in addition to registering the resource,
	//	dojo.provide() also ensures that the javascript object for the module exists.  For
	//	example, dojo.provide("dojo.html.common"), in addition to registering that common.js
	//	is a resource for the dojo.html module, will ensure that the dojo.html javascript object
	//	exists, so that calls like dojo.html.foo = function(){ ... } don't fail.
	//
	//	In the case of a build (or in the future, a rollup), where multiple javascript source
	//	files are combined into one bigger file (similar to a .lib or .jar file), that file
	//	will contain multiple dojo.provide() calls, to note that it includes
	//	multiple resources.
	return dojo.hostenv.startPackage.apply(dojo.hostenv, arguments);
}

dojo.registerModulePath = function(/*String*/module, /*String*/prefix){
	// summary: maps a module name to a path
	// description: An unregistered module is given the default path of ../<module>,
	//	relative to Dojo root. For example, module acme is mapped to ../acme.
	//	If you want to use a different module name, use dojo.registerModulePath. 
	return dojo.hostenv.setModulePrefix(module, prefix);
}

if(djConfig["modulePaths"]){
	for(var param in djConfig["modulePaths"]){
		dojo.registerModulePath(param, djConfig["modulePaths"][param]);
	}
}

dojo.setModulePrefix = function(/*String*/module, /*String*/prefix){
	// summary: maps a module name to a path
	dojo.deprecated('dojo.setModulePrefix("' + module + '", "' + prefix + '")', "replaced by dojo.registerModulePath", "0.5");
	return dojo.registerModulePath(module, prefix);
}

dojo.exists = function(/*Object*/obj, /*String*/name){
	// summary: determine if an object supports a given method
	// description: useful for longer api chains where you have to test each object in the chain
	var p = name.split(".");
	for(var i = 0; i < p.length; i++){
		if(!obj[p[i]]){ return false; } // Boolean
		obj = obj[p[i]];
	}
	return true; // Boolean
}

// Localization routines

dojo.hostenv.normalizeLocale = function(/*String?*/locale){
//	summary:
//		Returns canonical form of locale, as used by Dojo.  All variants are case-insensitive and are separated by '-'
//		as specified in RFC 3066. If no locale is specified, the user agent's default is returned.

	var result = locale ? locale.toLowerCase() : dojo.locale;
	if(result == "root"){
		result = "ROOT";
	}
	return result;// String
};

dojo.hostenv.searchLocalePath = function(/*String*/locale, /*Boolean*/down, /*Function*/searchFunc){
//	summary:
//		A helper method to assist in searching for locale-based resources.  Will iterate through
//		the variants of a particular locale, either up or down, executing a callback function.
//		For example, "en-us" and true will try "en-us" followed by "en" and finally "ROOT".

	locale = dojo.hostenv.normalizeLocale(locale);

	var elements = locale.split('-');
	var searchlist = [];
	for(var i = elements.length; i > 0; i--){
		searchlist.push(elements.slice(0, i).join('-'));
	}
	searchlist.push(false);
	if(down){searchlist.reverse();}

	for(var j = searchlist.length - 1; j >= 0; j--){
		var loc = searchlist[j] || "ROOT";
		var stop = searchFunc(loc);
		if(stop){ break; }
	}
}

//These two functions are placed outside of preloadLocalizations
//So that the xd loading can use/override them.
dojo.hostenv.localesGenerated /***BUILD:localesGenerated***/; // value will be inserted here at build time, if necessary

dojo.hostenv.registerNlsPrefix = function(){
// summary:
//	Register module "nls" to point where Dojo can find pre-built localization files
	dojo.registerModulePath("nls","nls");	
}

dojo.hostenv.preloadLocalizations = function(){
// summary:
//	Load built, flattened resource bundles, if available for all locales used in the page.
//	Execute only once.  Note that this is a no-op unless there is a build.

	if(dojo.hostenv.localesGenerated){
		dojo.hostenv.registerNlsPrefix();

		function preload(locale){
			locale = dojo.hostenv.normalizeLocale(locale);
			dojo.hostenv.searchLocalePath(locale, true, function(loc){
				for(var i=0; i<dojo.hostenv.localesGenerated.length;i++){
					if(dojo.hostenv.localesGenerated[i] == loc){
						dojo["require"]("nls.dojo_"+loc);
						return true; // Boolean
					}
				}
				return false; // Boolean
			});
		}
		preload();
		var extra = djConfig.extraLocale||[];
		for(var i=0; i<extra.length; i++){
			preload(extra[i]);
		}
	}
	dojo.hostenv.preloadLocalizations = function(){};
}

dojo.requireLocalization = function(/*String*/moduleName, /*String*/bundleName, /*String?*/locale, /*String?*/availableFlatLocales){
// summary:
//	Declares translated resources and loads them if necessary, in the same style as dojo.require.
//	Contents of the resource bundle are typically strings, but may be any name/value pair,
//	represented in JSON format.  See also dojo.i18n.getLocalization.
//
// moduleName: name of the package containing the "nls" directory in which the bundle is found
// bundleName: bundle name, i.e. the filename without the '.js' suffix
// locale: the locale to load (optional)  By default, the browser's user locale as defined by dojo.locale
// availableFlatLocales: A comma-separated list of the available, flattened locales for this bundle.
// This argument should only be set by the build process.
//
// description:
//	Load translated resource bundles provided underneath the "nls" directory within a package.
//	Translated resources may be located in different packages throughout the source tree.  For example,
//	a particular widget may define one or more resource bundles, structured in a program as follows,
//	where moduleName is mycode.mywidget and bundleNames available include bundleone and bundletwo:
//	...
//	mycode/
//	 mywidget/
//	  nls/
//	   bundleone.js (the fallback translation, English in this example)
//	   bundletwo.js (also a fallback translation)
//	   de/
//	    bundleone.js
//	    bundletwo.js
//	   de-at/
//	    bundleone.js
//	   en/
//	    (empty; use the fallback translation)
//	   en-us/
//	    bundleone.js
//	   en-gb/
//	    bundleone.js
//	   es/
//	    bundleone.js
//	    bundletwo.js
//	  ...etc
//	...
//	Each directory is named for a locale as specified by RFC 3066, (http://www.ietf.org/rfc/rfc3066.txt),
//	normalized in lowercase.  Note that the two bundles in the example do not define all the same variants.
//	For a given locale, bundles will be loaded for that locale and all more general locales above it, including
//	a fallback at the root directory.  For example, a declaration for the "de-at" locale will first
//	load nls/de-at/bundleone.js, then nls/de/bundleone.js and finally nls/bundleone.js.  The data will
//	be flattened into a single Object so that lookups will follow this cascading pattern.  An optional build
//	step can preload the bundles to avoid data redundancy and the multiple network hits normally required to
//	load these resources.

	dojo.hostenv.preloadLocalizations();
	var targetLocale = dojo.hostenv.normalizeLocale(locale);
 	var bundlePackage = [moduleName, "nls", bundleName].join(".");
//NOTE: When loading these resources, the packaging does not match what is on disk.  This is an
// implementation detail, as this is just a private data structure to hold the loaded resources.
// e.g. tests/hello/nls/en-us/salutations.js is loaded as the object tests.hello.nls.salutations.en_us={...}
// The structure on disk is intended to be most convenient for developers and translators, but in memory
// it is more logical and efficient to store in a different order.  Locales cannot use dashes, since the
// resulting path will not evaluate as valid JS, so we translate them to underscores.
	
	//Find the best-match locale to load if we have available flat locales.
	var bestLocale = "";
	if(availableFlatLocales){
		var flatLocales = availableFlatLocales.split(",");
		for(var i = 0; i < flatLocales.length; i++){
			//Locale must match from start of string.
			if(targetLocale.indexOf(flatLocales[i]) == 0){
				if(flatLocales[i].length > bestLocale.length){
					bestLocale = flatLocales[i];
				}
			}
		}
		if(!bestLocale){
			bestLocale = "ROOT";
		}		
	}

	//See if the desired locale is already loaded.
	var tempLocale = availableFlatLocales ? bestLocale : targetLocale;
	var bundle = dojo.hostenv.findModule(bundlePackage);
	var localizedBundle = null;
	if(bundle){
		if(djConfig.localizationComplete && bundle._built){return;}
		var jsLoc = tempLocale.replace('-', '_');
		var translationPackage = bundlePackage+"."+jsLoc;
		localizedBundle = dojo.hostenv.findModule(translationPackage);
	}

	if(!localizedBundle){
		bundle = dojo.hostenv.startPackage(bundlePackage);
		var syms = dojo.hostenv.getModuleSymbols(moduleName);
		var modpath = syms.concat("nls").join("/");
		var parent;

		dojo.hostenv.searchLocalePath(tempLocale, availableFlatLocales, function(loc){
			var jsLoc = loc.replace('-', '_');
			var translationPackage = bundlePackage + "." + jsLoc;
			var loaded = false;
			if(!dojo.hostenv.findModule(translationPackage)){
				// Mark loaded whether it's found or not, so that further load attempts will not be made
				dojo.hostenv.startPackage(translationPackage);
				var module = [modpath];
				if(loc != "ROOT"){module.push(loc);}
				module.push(bundleName);
				var filespec = module.join("/") + '.js';
				loaded = dojo.hostenv.loadPath(filespec, null, function(hash){
					// Use singleton with prototype to point to parent bundle, then mix-in result from loadPath
					var clazz = function(){};
					clazz.prototype = parent;
					bundle[jsLoc] = new clazz();
					for(var j in hash){ bundle[jsLoc][j] = hash[j]; }
				});
			}else{
				loaded = true;
			}
			if(loaded && bundle[jsLoc]){
				parent = bundle[jsLoc];
			}else{
				bundle[jsLoc] = parent;
			}
			
			if(availableFlatLocales){
				//Stop the locale path searching if we know the availableFlatLocales, since
				//the first call to this function will load the only bundle that is needed.
				return true;
			}
		});
	}

	//Save the best locale bundle as the target locale bundle when we know the
	//the available bundles.
	if(availableFlatLocales && targetLocale != bestLocale){
		bundle[targetLocale.replace('-', '_')] = bundle[bestLocale.replace('-', '_')];
	}
};

(function(){
	// If other locales are used, dojo.requireLocalization should load them as well, by default.
	// Override dojo.requireLocalization to do load the default bundle, then iterate through the
	// extraLocale list and load those translations as well, unless a particular locale was requested.

	var extra = djConfig.extraLocale;
	if(extra){
		if(!extra instanceof Array){
			extra = [extra];
		}

		var req = dojo.requireLocalization;
		dojo.requireLocalization = function(m, b, locale, availableFlatLocales){
			req(m,b,locale, availableFlatLocales);
			if(locale){return;}
			for(var i=0; i<extra.length; i++){
				req(m,b,extra[i], availableFlatLocales);
			}
		};
	}
})();

};

if(typeof window != 'undefined'){

	// attempt to figure out the path to dojo if it isn't set in the config
	(function(){
		// before we get any further with the config options, try to pick them out
		// of the URL. Most of this code is from NW
		if(djConfig.allowQueryConfig){
			var baseUrl = document.location.toString(); // FIXME: use location.query instead?
			var params = baseUrl.split("?", 2);
			if(params.length > 1){
				var paramStr = params[1];
				var pairs = paramStr.split("&");
				for(var x in pairs){
					var sp = pairs[x].split("=");
					// FIXME: is this eval dangerous?
					if((sp[0].length > 9)&&(sp[0].substr(0, 9) == "djConfig.")){
						var opt = sp[0].substr(9);
						try{
							djConfig[opt]=eval(sp[1]);
						}catch(e){
							djConfig[opt]=sp[1];
						}
					}
				}
			}
		}

		if(
			((djConfig["baseScriptUri"] == "")||(djConfig["baseRelativePath"] == "")) && 
			(document && document.getElementsByTagName)
		){
			var scripts = document.getElementsByTagName("script");
			var rePkg = /(__package__|dojo|bootstrap1)\.js([\?\.]|$)/i;
			for(var i = 0; i < scripts.length; i++) {
				var src = scripts[i].getAttribute("src");
				if(!src) { continue; }
				var m = src.match(rePkg);
				if(m) {
					var root = src.substring(0, m.index);
					if(src.indexOf("bootstrap1") > -1) { root += "../"; }
					if(!this["djConfig"]) { djConfig = {}; }
					if(djConfig["baseScriptUri"] == "") { djConfig["baseScriptUri"] = root; }
					if(djConfig["baseRelativePath"] == "") { djConfig["baseRelativePath"] = root; }
					break;
				}
			}
		}

		// fill in the rendering support information in dojo.render.*
		var dr = dojo.render;
		var drh = dojo.render.html;
		var drs = dojo.render.svg;
		var dua = (drh.UA = navigator.userAgent);
		var dav = (drh.AV = navigator.appVersion);
		var t = true;
		var f = false;
		drh.capable = t;
		drh.support.builtin = t;

		dr.ver = parseFloat(drh.AV);
		dr.os.mac = dav.indexOf("Macintosh") >= 0;
		dr.os.win = dav.indexOf("Windows") >= 0;
		// could also be Solaris or something, but it's the same browser
		dr.os.linux = dav.indexOf("X11") >= 0;

		drh.opera = dua.indexOf("Opera") >= 0;
		drh.khtml = (dav.indexOf("Konqueror") >= 0)||(dav.indexOf("Safari") >= 0);
		drh.safari = dav.indexOf("Safari") >= 0;
		var geckoPos = dua.indexOf("Gecko");
		drh.mozilla = drh.moz = (geckoPos >= 0)&&(!drh.khtml);
		if (drh.mozilla) {
			// gecko version is YYYYMMDD
			drh.geckoVersion = dua.substring(geckoPos + 6, geckoPos + 14);
		}
		drh.ie = (document.all)&&(!drh.opera);
		drh.ie50 = drh.ie && dav.indexOf("MSIE 5.0")>=0;
		drh.ie55 = drh.ie && dav.indexOf("MSIE 5.5")>=0;
		drh.ie60 = drh.ie && dav.indexOf("MSIE 6.0")>=0;
		drh.ie70 = drh.ie && dav.indexOf("MSIE 7.0")>=0;

		var cm = document["compatMode"];
		drh.quirks = (cm == "BackCompat")||(cm == "QuirksMode")||drh.ie55||drh.ie50;

		// TODO: is the HTML LANG attribute relevant?
		dojo.locale = dojo.locale || (drh.ie ? navigator.userLanguage : navigator.language).toLowerCase();

		dr.vml.capable=drh.ie;
		drs.capable = f;
		drs.support.plugin = f;
		drs.support.builtin = f;
		var tdoc = window["document"];
		var tdi = tdoc["implementation"];

		//Check how dojo was loaded.  If it was a file/local URL, then engage the xhrForce on IE
		//Workaround to deal with IE 7 and local file loads that do not work through native xhr.
		if(drh.ie && (window.location.protocol=="file:")){
			djConfig.ieForceActiveXXhr = true;
		} 

		if((tdi)&&(tdi["hasFeature"])&&(tdi.hasFeature("org.w3c.dom.svg", "1.0"))){
			drs.capable = t;
			drs.support.builtin = t;
			drs.support.plugin = f;
		}
		// webkits after 420 support SVG natively. The test string is "AppleWebKit/420+"
		if(drh.safari){
			var tmp = dua.split("AppleWebKit/")[1];
			var ver = parseFloat(tmp.split(" ")[0]);
			if(ver >= 420){
				drs.capable = t;
				drs.support.builtin = t;
				drs.support.plugin = f;
			}
		}else{
		}
	})();

	dojo.hostenv.startPackage("dojo.hostenv");

	dojo.render.name = dojo.hostenv.name_ = 'browser';
	dojo.hostenv.searchIds = [];

	// These are in order of decreasing likelihood; this will change in time.
	dojo.hostenv._XMLHTTP_PROGIDS = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'];

	dojo.hostenv.getXmlhttpObject = function(){
		// summary: does the work of portably generating a new XMLHTTPRequest object.
		var http = null;
		var last_e = null;
		if(!dojo.render.html.ie || !djConfig.ieForceActiveXXhr){
			try{ http = new XMLHttpRequest(); }catch(e){}
		}
		if(!http){
			for(var i=0; i<3; ++i){
				var progid = dojo.hostenv._XMLHTTP_PROGIDS[i];
				try{
					http = new ActiveXObject(progid);
				}catch(e){
					last_e = e;
				}

				if(http){
					dojo.hostenv._XMLHTTP_PROGIDS = [progid];  // so faster next time
					break;
				}
			}

			/*if(http && !http.toString) {
				http.toString = function() { "[object XMLHttpRequest]"; }
			}*/
		}

		if(!http){
			return dojo.raise("XMLHTTP not available", last_e);
		}

		return http; // XMLHTTPRequest instance
	}

	dojo.hostenv._blockAsync = false;
	dojo.hostenv.getText = function(uri, async_cb, fail_ok){
		// summary: Read the contents of the specified uri and return those contents.
		// uri:
		//		A relative or absolute uri. If absolute, it still must be in
		//		the same "domain" as we are.
		// async_cb:
		//		If not specified, load synchronously. If specified, load
		//		asynchronously, and use async_cb as the progress handler which
		//		takes the xmlhttp object as its argument. If async_cb, this
		//		function returns null.
		// fail_ok:
		//		Default false. If fail_ok and !async_cb and loading fails,
		//		return null instead of throwing.

		// need to block async callbacks from snatching this thread as the result
		// of an async callback might call another sync XHR, this hangs khtml forever
		// hostenv._blockAsync must also be checked in BrowserIO's watchInFlight()
		// NOTE: must be declared before scope switches ie. this.getXmlhttpObject()
		if(!async_cb){ this._blockAsync = true; }

		var http = this.getXmlhttpObject();

		function isDocumentOk(http){
			var stat = http["status"];
			// allow a 304 use cache, needed in konq (is this compliant with the http spec?)
			return Boolean((!stat)||((200 <= stat)&&(300 > stat))||(stat==304));
		}

		if(async_cb){
			var _this = this, timer = null, gbl = dojo.global();
			var xhr = dojo.evalObjPath("dojo.io.XMLHTTPTransport");
			http.onreadystatechange = function(){
				if(timer){ gbl.clearTimeout(timer); timer = null; }
				if(_this._blockAsync || (xhr && xhr._blockAsync)){
					timer = gbl.setTimeout(function () { http.onreadystatechange.apply(this); }, 10);
				}else{
					if(4==http.readyState){
						if(isDocumentOk(http)){
							// dojo.debug("LOADED URI: "+uri);
							async_cb(http.responseText);
						}
					}
				}
			}
		}

		http.open('GET', uri, async_cb ? true : false);
		try{
			http.send(null);
			if(async_cb){
				return null;
			}
			if(!isDocumentOk(http)){
				var err = Error("Unable to load "+uri+" status:"+ http.status);
				err.status = http.status;
				err.responseText = http.responseText;
				throw err;
			}
		}catch(e){
			this._blockAsync = false;
			if((fail_ok)&&(!async_cb)){
				return null;
			}else{
				throw e;
			}
		}

		this._blockAsync = false;
		return http.responseText; // String
	}

	dojo.hostenv.defaultDebugContainerId = 'dojoDebug';
	dojo.hostenv._println_buffer = [];
	dojo.hostenv._println_safe = false;
	dojo.hostenv.println = function(/*String*/line){
		// summary:
		//		prints the provided line to whatever logging container is
		//		available. If the page isn't loaded yet, the line may be added
		//		to a buffer for printing later.
		if(!dojo.hostenv._println_safe){
			dojo.hostenv._println_buffer.push(line);
		}else{
			try {
				var console = document.getElementById(djConfig.debugContainerId ?
					djConfig.debugContainerId : dojo.hostenv.defaultDebugContainerId);
				if(!console) { console = dojo.body(); }

				var div = document.createElement("div");
				div.appendChild(document.createTextNode(line));
				console.appendChild(div);
			} catch (e) {
				try{
					// safari needs the output wrapped in an element for some reason
					document.write("<div>" + line + "</div>");
				}catch(e2){
					window.status = line;
				}
			}
		}
	}

	dojo.addOnLoad(function(){
		dojo.hostenv._println_safe = true;
		while(dojo.hostenv._println_buffer.length > 0){
			dojo.hostenv.println(dojo.hostenv._println_buffer.shift());
		}
	});

	function dj_addNodeEvtHdlr(/*DomNode*/node, /*String*/evtName, /*Function*/fp){
		// summary:
		//		non-destructively adds the specified function to the node's
		//		evtName handler.
		// node: the DomNode to add the handler to
		// evtName: should be in the form "click" for "onclick" handlers
		var oldHandler = node["on"+evtName] || function(){};
		node["on"+evtName] = function(){
			fp.apply(node, arguments);
			oldHandler.apply(node, arguments);
		}
		return true;
	}

	//	BEGIN DOMContentLoaded, from Dean Edwards (http://dean.edwards.name/weblog/2006/06/again/)
	function dj_load_init(e){
		// allow multiple calls, only first one will take effect
		// A bug in khtml calls events callbacks for document for event which isnt supported
		// for example a created contextmenu event calls DOMContentLoaded, workaround
		var type = (e && e.type) ? e.type.toLowerCase() : "load";
		if(arguments.callee.initialized || (type!="domcontentloaded" && type!="load")){ return; }
		arguments.callee.initialized = true;
		if(typeof(_timer) != 'undefined'){
			clearInterval(_timer);
			delete _timer;
		}

		var initFunc = function(){
			//perform initialization
			if(dojo.render.html.ie){
				dojo.hostenv.makeWidgets();
			}
		};

		if(dojo.hostenv.inFlightCount == 0){
			initFunc();
			dojo.hostenv.modulesLoaded();
		}else{
			//This else case should be xdomain loading.
			//Make sure this is the first thing in the load listener array.
			//Part of the dojo.addOnLoad guarantee is that when the listeners are notified,
			//It means the DOM (or page) has loaded and that widgets have been parsed.
			dojo.hostenv.modulesLoadedListeners.unshift(initFunc);
		}
	}

	//	START DOMContentLoaded
	// Mozilla and Opera 9 expose the event we could use
	if(document.addEventListener){
		// NOTE: 
		//		due to a threading issue in Firefox 2.0, we can't enable
		//		DOMContentLoaded on that platform. For more information, see:
		//		http://trac.dojotoolkit.org/ticket/1704
		if(dojo.render.html.opera || (dojo.render.html.moz && (djConfig["enableMozDomContentLoaded"] === true))){
			document.addEventListener("DOMContentLoaded", dj_load_init, null);
		}

		//	mainly for Opera 8.5, won't be fired if DOMContentLoaded fired already.
		//  also used for Mozilla because of trac #1640
		window.addEventListener("load", dj_load_init, null);
	}

	// 	for Internet Explorer. readyState will not be achieved on init call, but dojo doesn't need it
	//	however, we'll include it because we don't know if there are other functions added that might.
	//	Note that this has changed because the build process strips all comments--including conditional
	//		ones.
	if(dojo.render.html.ie && dojo.render.os.win){
		document.attachEvent("onreadystatechange", function(e){
			if(document.readyState == "complete"){
				dj_load_init();
			}
		});
	}

	if (/(WebKit|khtml)/i.test(navigator.userAgent)) { // sniff
		var _timer = setInterval(function() {
			if (/loaded|complete/.test(document.readyState)) {
				dj_load_init(); // call the onload handler
			}
		}, 10);
	}
	//	END DOMContentLoaded

	// IE WebControl hosted in an application can fire "beforeunload" and "unload"
	// events when control visibility changes, causing Dojo to unload too soon. The
	// following code fixes the problem
	// Reference: http://support.microsoft.com/default.aspx?scid=kb;en-us;199155
	if(dojo.render.html.ie){
		dj_addNodeEvtHdlr(window, "beforeunload", function(){
			dojo.hostenv._unloading = true;
			window.setTimeout(function() {
				dojo.hostenv._unloading = false;
			}, 0);
		});
	}

	dj_addNodeEvtHdlr(window, "unload", function(){
		dojo.hostenv.unloaded();
		if((!dojo.render.html.ie)||(dojo.render.html.ie && dojo.hostenv._unloading)){
			dojo.hostenv.unloaded();
		}
	});

	dojo.hostenv.makeWidgets = function(){
		// you can put searchIds in djConfig and dojo.hostenv at the moment
		// we should probably eventually move to one or the other
		var sids = [];
		if(djConfig.searchIds && djConfig.searchIds.length > 0) {
			sids = sids.concat(djConfig.searchIds);
		}
		if(dojo.hostenv.searchIds && dojo.hostenv.searchIds.length > 0) {
			sids = sids.concat(dojo.hostenv.searchIds);
		}

		if((djConfig.parseWidgets)||(sids.length > 0)){
			if(dojo.evalObjPath("dojo.widget.Parse")){
				// we must do this on a delay to avoid:
				//	http://www.shaftek.org/blog/archives/000212.html
				// (IE bug)
					var parser = new dojo.xml.Parse();
					if(sids.length > 0){
						for(var x=0; x<sids.length; x++){
							var tmpNode = document.getElementById(sids[x]);
							if(!tmpNode){ continue; }
							var frag = parser.parseElement(tmpNode, null, true);
							dojo.widget.getParser().createComponents(frag);
						}
					}else if(djConfig.parseWidgets){
						var frag  = parser.parseElement(dojo.body(), null, true);
						dojo.widget.getParser().createComponents(frag);
					}
			}
		}
	}

	dojo.addOnLoad(function(){
		if(!dojo.render.html.ie) {
			dojo.hostenv.makeWidgets();
		}
	});

	try{
		if(dojo.render.html.ie){
			document.namespaces.add("v","urn:schemas-microsoft-com:vml");
			document.createStyleSheet().addRule("v\\:*", "behavior:url(#default#VML)");
		}
	}catch(e){ }

	// stub, over-ridden by debugging code. This will at least keep us from
	// breaking when it's not included
	dojo.hostenv.writeIncludes = function(){}

	//TODOC:  HOW TO DOC THIS?
	// @global: dj_currentDocument
	// summary:
	//		Current document object. 'dj_currentDocument' can be modified for temporary context shifting.
	// description:
	//    dojo.doc() returns dojo.currentDocument.
	//		Refer to dojo.doc() rather than referring to 'window.document' to ensure your
	//		code runs correctly in managed contexts.
	if(!dj_undef("document", this)){
		dj_currentDocument = this.document;
	}

	dojo.doc = function(){
		// summary:
		//		return the document object associated with the dojo.global()
		return dj_currentDocument;
	}

	dojo.body = function(){
		// summary:
		//		return the body object associated with dojo.doc()
		// Note: document.body is not defined for a strict xhtml document
		return dojo.doc().body || dojo.doc().getElementsByTagName("body")[0];
	}

	dojo.byId = function(/*String*/id, /*DocumentElement*/doc){
		// summary:
		// 		similar to other library's "$" function, takes a string
		// 		representing a DOM id or a DomNode and returns the
		// 		corresponding DomNode. If a Node is passed, this function is a
		// 		no-op. Returns a single DOM node or null, working around
		// 		several browser-specific bugs to do so.
		// id: DOM id or DOM Node
		// doc:
		//		optional, defaults to the current value of dj_currentDocument.
		//		Can be used to retreive node references from other documents.
		if((id)&&((typeof id == "string")||(id instanceof String))){
			if(!doc){ doc = dj_currentDocument; }
			var ele = doc.getElementById(id);
			// workaround bug in IE and Opera 8.2 where getElementById returns wrong element
			if(ele && (ele.id != id) && doc.all){
				ele = null;
				// get all matching elements with this id
				eles = doc.all[id];
				if(eles){
					// if more than 1, choose first with the correct id
					if(eles.length){
						for(var i=0; i<eles.length; i++){
							if(eles[i].id == id){
								ele = eles[i];
								break;
							}
						}
					// return 1 and only element
					}else{
						ele = eles;
					}
				}
			}
			return ele; // DomNode
		}
		return id; // DomNode
	}

	dojo.setContext = function(/*Object*/globalObject, /*DocumentElement*/globalDocument){
		// summary:
		//		changes the behavior of many core Dojo functions that deal with
		//		namespace and DOM lookup, changing them to work in a new global
		//		context. The varibles dj_currentContext and dj_currentDocument
		//		are modified as a result of calling this function.
		dj_currentContext = globalObject;
		dj_currentDocument = globalDocument;
	};

	dojo._fireCallback = function(callback, context, cbArguments){
		if((context)&&((typeof callback == "string")||(callback instanceof String))){
			callback=context[callback];
		}
		return (context ? callback.apply(context, cbArguments || [ ]) : callback());
	}

	dojo.withGlobal = function(/*Object*/globalObject, /*Function*/callback, /*Object?*/thisObject, /*Array?*/cbArguments){
		// summary:
		//		Call callback with globalObject as dojo.global() and globalObject.document
		//		as dojo.doc(). If provided, globalObject will be executed in the context of
		//		object thisObject
		// description:
		//		When callback() returns or throws an error, the dojo.global() and dojo.doc() will
		//		be restored to its previous state.
		var rval;
		var oldGlob = dj_currentContext;
		var oldDoc = dj_currentDocument;
		try{
			dojo.setContext(globalObject, globalObject.document);
			rval = dojo._fireCallback(callback, thisObject, cbArguments);
		}finally{
			dojo.setContext(oldGlob, oldDoc);
		}
		return rval;
	}

	dojo.withDoc = function (/*Object*/documentObject, /*Function*/callback, /*Object?*/thisObject, /*Array?*/cbArguments) {
		// summary:
		//		Call callback with documentObject as dojo.doc(). If provided, callback will be executed
		//		in the context of object thisObject
		// description:
		//		When callback() returns or throws an error, the dojo.doc() will
		//		be restored to its previous state.
		var rval;
		var oldDoc = dj_currentDocument;
		try{
			dj_currentDocument = documentObject;
			rval = dojo._fireCallback(callback, thisObject, cbArguments);
		}finally{
			dj_currentDocument = oldDoc;
		}
		return rval;
	}

} //if (typeof window != 'undefined')

//Load debug code if necessary.
dojo.requireIf((djConfig["isDebug"] || djConfig["debugAtAllCosts"]), "dojo.debug");

//window.widget is for Dashboard detection
//The full conditionals are spelled out to avoid issues during builds.
//Builds may be looking for require/requireIf statements and processing them.
dojo.requireIf(djConfig["debugAtAllCosts"] && !window.widget && !djConfig["useXDomain"], "dojo.browser_debug");
dojo.requireIf(djConfig["debugAtAllCosts"] && !window.widget && djConfig["useXDomain"], "dojo.browser_debug_xd");

