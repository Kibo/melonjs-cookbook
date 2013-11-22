game.PlayScreen = me.ScreenObject.extend( {
	/**
	 *  action to perform on state change
	 */
	onResetEvent: function( ) {
		me.levelDirector.loadLevel( "town" );
	
		me.plugin.bag.create("right", 5 );

		var gear = new game.Artefact( 100, 100, {
			image: "gear",
			spritewidth: 30,
			spriteheight: 30
		} );
	
		var bell = new game.Artefact( 150, 150, {
			image: "bell",
			spritewidth: 30,
			spriteheight: 30
		} );
		
		var camera = new game.Artefact( 200, 200, {
			image: "camera",
			spritewidth: 30,
			spriteheight: 30
		} );
		
		me.game.add( gear, 10 );
		me.game.add( bell, 20 );
		me.game.add( camera, 30 );	
	},

	/**
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function( ) {
	}
} );
