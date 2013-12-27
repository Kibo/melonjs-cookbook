game.PlayScreen = me.ScreenObject.extend( {
	/**
	 *  action to perform on state change
	 */
	onResetEvent: function( ) {
		me.levelDirector.loadLevel( "tilemap_1_layer" );	    
	},

	/**
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function( ) {
	}
} );
