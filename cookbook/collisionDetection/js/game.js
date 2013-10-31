
/* Game namespace */
var game = {
		
	// an object where to store game information
	data : {
		// score
		score : 0
	},
		
	// Run on page load.
	"onload" : function () {
	// Initialize the video.
	if (!me.video.init("screen", 800, 600, true)) {
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

	// Initialize melonJS and display a loading screen.
	me.state.change(me.state.LOADING);
		
},

	// Run on game resources loaded.
	"loaded" : function () {
		// set the "Play/Ingame" Screen Object
	    me.state.set(me.state.PLAY, new game.PlayScreen());
	    	    	  	  	
	    // enable the keyboard
   		me.input.bindKey(me.input.KEY.LEFT,  "left");
   		me.input.bindKey(me.input.KEY.RIGHT, "right");
   		me.input.bindKey(me.input.KEY.DOWN,  "down");
   		me.input.bindKey(me.input.KEY.UP, "up");
	    
	    // start the game
	    me.state.change(me.state.PLAY);
	}
};
