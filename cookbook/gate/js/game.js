/* Game namespace */
var game = {
		
	// an object where to store game information
	data : {
			
		/*
		 * Last level name
		 * @see game.PlayScreen#mapSetting
		 */	
		lastLevelName:null,	
			
		/*
		 * Object for store artefacts location
		 * key: {string} level name
		 * value: {array<Object>} artefacts
		 */	
		artefactsLocations:{
			part1:[{name:"camera", x:100, y:50},
			  	   {name:"gear", x:100, y:100}],
			part2:[{name:"bell", x:100, y:200}],					
		}		
	},
		
	// Run on page load.
	"onload" : function () {
	// Initialize the video.
	if (!me.video.init("screen", 480, 320, true)) {
		alert("Your browser does not support HTML5 canvas.");
		return;
	}

	// add "#debug" to the URL to enable the debug Panel
	if (document.location.hash === "#debug") {
		window.onReady(function () {
			me.plugin.register.defer(debugPanel, "debug");
		});
	}

	// Initialize the audio.
	me.audio.init("mp3,ogg");

	// Set a callback to run when loading is complete.
	me.loader.onload = this.loaded.bind(this);

	// Load the resources.
	me.loader.preload(game.resources);
	
	me.debug.renderHitBox = true;

	// Initialize melonJS and display a loading screen.
	me.state.change(me.state.LOADING);					  
},

	// Run on game resources loaded.
	"loaded" : function () {					
		// add our player entity in the entity pool   		
   		me.entityPool.add("hero", game.HeroEntity);
   		me.entityPool.add("doorOut", game.DoorOutEntity);
		me.entityPool.add("doorIn", game.DoorInEntity);
		
		//artefacts
		me.entityPool.add("camera", game.Artefact);
		me.entityPool.add("bell", game.Artefact);
		me.entityPool.add("gear", game.Artefact);
   		     	   	   	   	   	   	   		     	   	   	   	   	  
   		me.state.set(me.state.MENU, new game.TitleScreen());
		me.state.set(me.state.PLAY, new game.PlayScreen());
		
		// Start the game.
		me.state.change(me.state.PLAY);
	}
};
