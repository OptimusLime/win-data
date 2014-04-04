var request = require('superagent');

module.exports = windata;


function windata(backbone, globalConfig, localConfig)
{
	var self= this;

	//need to make requests, much like win-publish
	//pull in backbone info, we gotta set our logger/emitter up
	var self = this;

	self.winFunction = "data";

	//this is how we talk to win-backbone
	self.backEmit = backbone.getEmitter(self);

	//grab our logger
	self.log = backbone.getLogger(self);

	//only vital stuff goes out for normal logs
	self.log.logLevel = localConfig.logLevel || self.log.normal;

	//we have logger and emitter, set up some of our functions

	if(!globalConfig.server || !globalConfig.port)
		throw new Error("Global configuration requires server location and port")

	self.hostname = globalConfig.server;
	self.port = globalConfig.port;

	//what events do we need?
	//none for now, though in the future, we might have a way to communicate with foreign win-backbones as if it was just sending
	//a message within our own backbone -- thereby obfuscating what is done remotely and what is done locally 
	self.requiredEvents = function()
	{
		return [
		];
	}

	//what events do we respond to?
	self.eventCallbacks = function()
	{ 
		return {
			"data:winPOST" : self.postWIN,
			"data:winGET" : self.getWIN
		};
	}

	 var baseWIN = function()
	{
		return self.hostname + ":" + self.port + "/api";
	}

	self.getWIN = function(apiPath, queryObjects, resFunction)
	{
		var base = baseWIN();

		if(typeof queryObjects == "function")
		{
		  resFunction = queryObjects;
		  queryObjects = {};
		}
		else //make sure to always have at least an empty object
		  queryObjects = queryObjects || {};

		var qNotEmpty = false;
		var queryAdditions = "?";
		for(var key in queryObjects){
		  if(queryAdditions.length > 1)
		    queryAdditions += "&";

		  qNotEmpty = true;
		  queryAdditions += key + "=" + queryObjects[key];
		} 
		var fullPath = base + apiPath + (qNotEmpty ? queryAdditions : "");

		self.log("Requesting get from: ",fullPath )
		request
		  .get(fullPath)
		  // .send(data)
		  .set('Accept', 'application/json')
		  .end(resFunction);
	}

	self.postWIN = function(apiPath, data, resFunction)
	{
		var base = baseWIN();

		var fullPath= base + apiPath;
		self.log("Requesting post to: ",fullPath )

		request
		  .post(fullPath)
		  .send(data)
		  .set('Accept', 'application/json')
		  .end(resFunction);
	}


	return self;
}


