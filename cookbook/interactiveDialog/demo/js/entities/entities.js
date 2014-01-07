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
    * set a random target position   
    */
    _setRandomTargetPosition:function(){
    	
    	  if(!this._targetIsSet){
        	this._targetIsSet = true;
        	        
        	var min = 500;
        	var max = 3000;
        	var waitFor = Math.random() * (max - min) + min;
        	        	
        	// wait from min to max before next step
        	window.setTimeout(function(){        		
        		this._target = {};        	   	  	    	   	  
    			this._target.x = Number(0).random(this.minX, this.maxX); 	
    			this._target.y = Number(0).random(this.minY, this.maxY);
    			this._setDirection(this._target.x - this.pos.x, this._target.y - this.pos.y);      
    			this.renderable.setCurrentAnimation( this.direction );        											
				delete this._targetIsSet;		        		
        	}.bind(this), waitFor);        	        		
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
    	// wait for 2 sec - let the hero go away
    	var waitFor = 2000;
    	window.setTimeout(function(){
    		delete this.isTalking;	
    	}.bind(this), waitFor);    	    	
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
                
		this.minX = x;
        this.minY = y;
        this.maxX = x + settings.width - settings.spritewidth;
        this.maxY = y + settings.height - settings.spriteheight;
                                                                                                                                               				
		// create dialog
		this.dialog = new game.Dialog( DIALOGUES[ this.name ], this.onDialogReset.bind(this), this.onDialogShow.bind(this));					  							    	        	        
	},
	
    update: function() {
    	    	    	    	    	                        
        if(!this._target){
       		this._setRandomTargetPosition();
        }
                       
		if(!this.isTalking){   
        	this._calculateStep();
        }
    	           
        this.updateMovement();
                                  	                  
        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update object animation
            this.parent();
            return true;
        }
        
        return false;
    }                          	  
});
