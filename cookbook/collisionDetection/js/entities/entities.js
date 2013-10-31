game.HeroEntity = me.ObjectEntity.extend({
  
    init: function() {
    	    	    	    	    	    
        var settings = {};
        settings.width = 100;
        settings.height = 100;
        
        // call the parent constructor
        this.parent(0, 0, settings);

		this.setVelocity( 10, 10);                      
        this.gravity = 0;
        this.setFriction(1, 1);
                       
        this.collidable = true;                       
    },
    
    draw: function( context ){
    	me.video.clearSurface(context, "#ffffff");     	    		    			
		context.fillStyle="#FF0000";
		context.fillRect(this.pos.x, this.pos.y, this.width, this.height);		 
    },
    
    update: function() {
    	    	    
    	if (me.input.isKeyPressed('left')){
    		this.vel.x -= this.maxVel.x ;
		
		}else if (me.input.isKeyPressed('right')){
			this.vel.x += this.maxVel.x;
			
		}else if (me.input.isKeyPressed('up')){
			this.vel.y -= this.maxVel.y;	
		
		}else if (me.input.isKeyPressed('down')){
			this.vel.y += this.maxVel.y;
			
		}else{
			this.vel.x = 0;
			this.vel.y = 0;
		}
		    	    	    	    	    	     	   	    	    	    	    	                                                                                                                    
        this.pos.add(this.vel);
        
        var res = this.collide();    	
    	if (res) {
    		this.pos.x -= res.x;    		
    		this.pos.y -= res.y;    		    		    
    		console.log("Collide: " + res.x + " - " + res.y);
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
});

game.EnemyEntity = me.ObjectEntity.extend({
	 
	 init: function() {
    	    	    	    	    	    
        var settings = {};
        settings.width = 100;
        settings.height = 100;
        
        // call the parent constructor
        this.parent(0, 0, settings);
		                   
        this.gravity = 0;
        this.setFriction(1, 1);
                       
        this.collidable = true;  
        this.pos.x = 250;   
        this.pos.y = 250;                   
    },
    
    draw: function( context ){    	    		    			
		context.fillStyle="#000000";
		context.fillRect(this.pos.x, this.pos.y, this.width, this.height);		 
    },	
});
