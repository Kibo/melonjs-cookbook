game.BaseEntity = me.ObjectEntity.extend({
		
	/**
     * Set direction 
 	 * @private
 	 * @param {number} dx
 	 * @param {number} dy
     */
    _setDirection:function( dx, dy ){    	    	          	    	  
    	if( Math.abs( dx ) > Math.abs( dy ) ){    		
    		this.direction = ( dx > 0) ? "right" : "left";
    		     		    	   
    	}else{
    		this.direction = ( dy > 0) ? "down" : "up";    		   		
    	}     	    	   	   
    },  
    
    /**
     * Calculate step for every update 	
 	 * @private
     */
    _calculateStep: function(){
    	
    	if( this._target ){
    		    		    			    			    		    		 
    		var dx = this._target.x - this.pos.x;	
    		var dy = this._target.y - this.pos.y;
    		    		    	
    		if(Math.abs(dx) < this.maxVel.x 
        	&& Math.abs(dy) < this.maxVel.x){        		
        		delete this._target;
        		return;        		        		     
        	}
        	        	    	
    		var angle = Math.atan2(dy, dx);
        	this.vel.x = Math.cos(angle) * this.accel.x * me.timer.tick;
        	this.vel.y = Math.sin(angle) * this.accel.y * me.timer.tick;        	        	        	        	               	           	   
    	}else{
    		this.vel.x = 0;
    		this.vel.y = 0;
    	}   	
    }, 
    
     /**
	 * default on collision handler	
	 */ 
    onCollision : function (res, obj){    		   
    	delete this._target;    	  
    	this._setDirection( -res.x, -res.y );
    	this.renderable.setCurrentAnimation( this.direction );     	  	  		
    },  
    
    onDialogReset:function(){
    	delete this.isTalking;    	
    },   
    
    onDialogShow:function( event ){    	
    	if(event.sentence.isChoice){
    		return;	
    	}
    		    	
    	// create sound icon    	    
    	var icon = document.createElement( "i" );
    	icon.setAttribute( "class", "glyphicon glyphicon-volume-up");
    	icon.addEventListener( me.device.touch ? "touchstart" : "mousedown", function( e ) {
    		e.preventDefault();
    		e.stopPropagation();
			console.log("play sound: " + event.sentence.dialogueText);				
		}.bind( this ), false );
    	
    	var paragraph = event.DOM.querySelector("p");    	    	        	
    	paragraph.appendChild( icon );    	    	   	    	  
    },    
});

game.HeroEntity = game.BaseEntity.extend({
  
    init: function(x, y, settings) {
            
            settings.image = "boy";
            settings.spritewidth = 24;
            settings.spriteheight = 36;
                                          
        // call the constructor
        this.parent(x, y, settings);
 
        // set the default horizontal & vertical speed (accel vector)
        this.setVelocity( 3, 3);
              
        this.gravity = 0;
        this.setFriction(0.5, 0.5);
                       
        this.collidable = true;
                            
        this.renderable.addAnimation("down", [0,1,2]);
        this.renderable.addAnimation("left", [3,4,5]);
        this.renderable.addAnimation("right", [6,7,8]);
        this.renderable.addAnimation("up", [9,10,11]);
                
        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);     
        
        this.direction = "down"; 
        
                //has to bee release
        me.input.registerPointerEvent('mousedown', me.game.viewport, this.onMouseDown.bind(this));                                                                                                                
    },
   
    update: function() {                                        
            this._calculateStep();
                                                                                                                                                                                                              
        // check & update player movement
        this.updateMovement();
                                   
        // check for collision
        var res =  me.game.world.collide(this);            
            if (res && (res.obj.type == me.game.ENEMY_OBJECT)) {                                                                                                                  
                    delete this._target;                    
                    this.pos.x -= res.x;
                    this.pos.y -= res.y; 
                    
                    this.doTalk( res.obj );                                                                                                                                                                                                                                                                                              
            }
                                                                                                                
        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {                                                                     
            // update object animation
            this.parent();
            return true;
        }
                                                                                
        // else inform the engine we did not perform
        // any update (e.g. position, animation)
        return false;
    }, 
    
    /**
     * Start conversation
     * @param {Object} entity
     */
    doTalk:function( entity ){
            entity.isTalking = true;
            this.talkWith = entity;            
            entity.dialog.show();
    },
          
    /**
         * Mouse down handler
         * @param {Event} e - MelonJS Event Object 
         */  
    onMouseDown: function(e){
            this._target = {};                                                              
            this._target.x = e.gameWorldX - Math.floor( this.width / 2 );            
            this._target.y = e.gameWorldY - Math.floor( this.height / 2 );                  
            this._setDirection(this._target.x - this.pos.x, this._target.y - this.pos.y);    
            this.renderable.setCurrentAnimation( this.direction );
            
            // Hero just talking
            if( this.talkWith ){
                    this.talkWith.dialog.reset();  
                    delete this.talkWith;                  
            }                                                          
    }, 
    
    onDestroyEvent : function() {                
                me.input.releasePointerEvent('mousedown', me.game.viewport);        
    },      
});

game.GirlEntity = game.BaseEntity.extend({
        
        init: function(x, y, settings) {
            
            settings.image = "girl";
            settings.spritewidth = 24;
            settings.spriteheight = 36;
                                          
        // call the constructor
        this.parent(x, y, settings);
                
        // set the default horizontal & vertical speed (accel vector)
        this.setVelocity( 2, 2);
              
        this.gravity = 0;
        this.setFriction(0.5, 0.5);
                       
        this.collidable = true;        
        this.type = me.game.ENEMY_OBJECT;
        
        this.renderable.addAnimation("down", [0,1,2]);
        this.renderable.addAnimation("left", [3,4,5]);
        this.renderable.addAnimation("right", [6,7,8]);
        this.renderable.addAnimation("up", [9,10,11]);
                            
        this.dialog = new game.Dialog( DIALOGUES[ this.name ], this.onDialogReset.bind(this), this.onDialogShow.bind(this));                                                                                                                                                                                                                                                                                                                                   
        },
        
    update: function() {                    
                                             
        this.updateMovement();
                                              
        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update object animation
            this.parent();
            return true;
        }
        
        return false;
    },
                       
    /**
    * set a target position
    * @private
         * @param {number} x - pos x
         * @param {number} y - pos y
    */
    _setTargetPosition:function(x, y){
            this._target = {};                                                              
            this._target.x = x;            
            this._target.y = y;    
            this._setDirection(this._target.x - this.pos.x, this._target.y - this.pos.y);      
            this.renderable.setCurrentAnimation( this.direction );    
    },        
    
    /**
         * on destroy handler
         */
    onDestroyEvent : function() {                                 
    }, 
});

/**
 * DoorOutEtity
 * Move hero to the next level.
 * The object must have the property "to" set in TiledMap. 
 * The property "to" defines the name of the level where hero come. 
 */
game.DoorOutEntity = me.LevelEntity.extend({
	 init : function( x, y, settings ) {
        settings.duration = 250;
        settings.fade = '#000000';
        this.parent( x, y, settings );
    }	
});

/**
 * DoorInEtity
 * Specifies where the hero appears after entering a DoorOutEntity.
 * The object must have the property "from" set in TiledMap. 
 * The property "from" defines the name of the level from which the hero arrives. 
 */
game.DoorInEntity = me.ObjectEntity.extend({
	init : function( x, y, settings ) {        
        this.from = settings.from;        
        this.parent( x, y, settings );
    }
});

/**
 * Artefact for collect in bag
 */
game.Artefact = me.CollectableEntity.extend( {
	init: function( x, y, settings ) {
		
		settings.image = "artefacts";
		settings.spritewidth = 30;
    	settings.spriteheight = 30;
    	    		
		this.parent( x, y, settings );
					
		this.renderable.addAnimation ("camera", [0]);
		this.renderable.addAnimation ("bell", [1]);
		this.renderable.addAnimation ("gear", [2]);    
	},

	onCollision: function( ) {		
		this.collidable = false;
		game.bag.add( this );
	}
} );
