game.PlayScreen = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {				
		me.levelDirector.loadLevel("town");		
					
		var bagHeight = 30;
		me.plugin.bag.create(0, me.game.viewport.height - bagHeight , me.game.viewport.width, bagHeight, "#eeeeee");
		
		var gear = new me.SpriteObject (0, 0, me.loader.getImage("gear"));
		game.bag.add( gear );	
				
		var bell = new me.SpriteObject (30, 0, me.loader.getImage("bell"));
		game.bag.add( bell );	
		
		var camera = new me.SpriteObject (60, 0, me.loader.getImage("camera"));
		game.bag.add( camera );					
	},

	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {		
	}
});
