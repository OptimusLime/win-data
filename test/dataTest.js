//We must test the ability to generate genotypes, force parents, and create valid offspring according to the schema

var assert = require('assert');
var should = require('should');
var colors = require('colors');
var Q = require('q');

var util = require('util');

var windata = require('..');
var wMath = require('win-utils').math;
var uuid = require('win-utils').cuid;
var winback = require('win-backbone');

var backbone, generator, backEmit, backLog;
var evoTestEnd;
var count = 0;

var emptyModule = 
{
	winFunction : "test",
	eventCallbacks : function(){ return {}; },
	requiredEvents : function() {
		return [
        "data:winGET",
        "data:winPOST"
			];
	}
};

describe('Testing win-data for: ', function(){

    //we need to start up the WIN backend
    before(function(done){

    	//do this up front yo
    	backbone = new winback();


    	var exampleJSON = 
		{
			"win-data" : windata,
			"test" : emptyModule
		};
		var configurations = 
		{
			"global" : {
                "server" : "http://localhost",
                "port" : "3000"
			},
			"win-data" : {
				logLevel : backbone.testing
			}
		};

    	backbone.logLevel = backbone.testing;

    	backEmit = backbone.getEmitter(emptyModule);
    	backLog = backbone.getLogger({winFunction:"mocha"});
    	backLog.logLevel = backbone.testing;

    	//loading modules is synchronous
    	backbone.loadModules(exampleJSON, configurations);

    	var registeredEvents = backbone.registeredEvents();
    	var requiredEvents = backbone.moduleRequirements();
    		
    	backLog('Backbone Events registered: ', registeredEvents);
    	backLog('Required: ', requiredEvents);

    	backbone.initializeModules(function()
    	{
    		backLog("Finished Module Init");
 			done();
    	});

    });

    it('get all artifacts',function(done){

        var artType = "picArtifact";
        // var temporaryRequest = "http://localhost:3000/api/artifacts?artifactType=picArtifact&all=true&password=allplease";

        backEmit("data:winGET", "/artifacts", {artifactType: artType, all: true, password: "allplease"}, function(err, res){
            var artifacts = res.body;
            if(err)
                done(new Error(err));
            else{

                backLog("Arts returned: ", artifacts);
                backLog("Successfully querired!");
                done();
            }

        })

    });

});







