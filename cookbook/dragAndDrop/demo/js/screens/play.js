game.PlayScreen = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {				
		me.levelDirector.loadLevel("town");		
					
		var bagHeight = 30;
		me.plugin.bag.create(0, me.game.viewport.height - bagHeight , me.game.viewport.width, bagHeight, "#eeeeee");		
	},


	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {		
	}
});
