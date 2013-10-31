game.PlayScreen = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {				
		var hero = new game.HeroEntity();
		var enemy = new game.EnemyEntity();
		me.game.add (hero, 0);		
		me.game.add (enemy, 1);
	},


	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {		
	}
});
