game.PlayScreen = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {				
		me.levelDirector.loadLevel("town");
		
		// change the default sort property	
		me.game.world.sortOn = "y";		
	},

	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {		
	}
});
