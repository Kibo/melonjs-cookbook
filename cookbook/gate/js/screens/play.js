game.PlayScreen = me.ScreenObject.extend({
				
	init:function(){		
		
		this.artefactsLocations = {
			part1:[{name:"camera", x:100, y:50},
			  	   {name:"gear", x:100, y:100}],
			part2:[{name:"bell", x:100, y:200}],					
		};
		
		me.plugin.bag.create("right", 5 );	
		
		// change the default sort property	
		me.game.world.sortOn = "y";											
	},
		
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {				
		me.levelDirector.loadLevel("part1");	
													
		me.game.onLevelLoaded = this.onLevelLoadedHandler.bind(this);	
		game.data._levelName = me.levelDirector.getCurrentLevelId();
		
		this.placeArtefacts();					
	},
	
	/**
	 * on level loader handler
	 */
	onLevelLoadedHandler: function(e){
		this.mapSetting();	
		this.placeArtefacts();			
		game.bag.reset();                		        
	},
	
	/**
	 * Sets the position of the hero, depending on from what level the hero arrives.
	 */
	mapSetting:function(){
		var heroList = me.game.world.getEntityByProp("name", "hero");
		var doorInList = me.game.world.getEntityByProp("name", "doorIn");
																			
		for(var i = 0; i < doorInList.length; i++){
			if( game.data._levelName == doorInList[i].from ){
				heroList[0].pos.x = doorInList[i].pos.x;
        		heroList[0].pos.y = doorInList[i].pos.y;	
        		break;
			}			
		}	
		
		game.data._levelName = me.levelDirector.getCurrentLevelId();				
	},

	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {		
	},
	
	placeArtefacts:function(){
		var artefacts = this.artefactsLocations[me.levelDirector.getCurrentLevelId()];
					
		for( var idx = 0; idx < artefacts.length; idx++ ){
			var artefact = me.entityPool.newInstanceOf( artefacts[idx].name, artefacts[idx].x, artefacts[idx].y, {} );
			artefact.renderable.setCurrentAnimation( artefacts[idx].name );	
			me.game.add( artefact , 10);
		}							
	},
});
