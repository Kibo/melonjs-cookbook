game.MouseControlledEntity = me.ObjectEntity.extend( {

	/**
	 * on mouse down handler
	 * @param {Event} e - MelonJS Event Object
	 */
	onMouseDown: function( e ) {
		this._target = {};
		this._target.x = e.gameWorldX - Math.floor( this.width / 2 );
		this._target.y = e.gameWorldY - Math.floor( this.height / 2 );
		this._setDirection( this._target.x - this.pos.x, this._target.y - this.pos.y );
		this.renderable.setCurrentAnimation( this.direction );
	},

	/**
	 * set direction
	 * @private
	 * @param {number} dx
	 * @param {number} dy
	 */
	_setDirection: function( dx, dy ) {
		if( Math.abs( dx ) > Math.abs( dy ) ) {
			this.direction = ( dx > 0 ) ? "right" : "left";

		} else {
			this.direction = ( dy > 0 ) ? "down" : "up";
		}
	},

	/**
	 * calculate step for every update
	 * @private
	 */
	_calculateStep: function( ) {

		if( this._target ) {

			var dx = this._target.x - this.pos.x;
			var dy = this._target.y - this.pos.y;

			if( Math.abs( dx ) < this.maxVel.x && Math.abs( dy ) < this.maxVel.x ) {
				delete this._target;
				return;
			}

			var angle = Math.atan2( dy, dx );
			this.vel.x = Math.cos( angle ) * this.accel.x * me.timer.tick;
			this.vel.y = Math.sin( angle ) * this.accel.y * me.timer.tick;
		}
	},
} );

game.HeroEntity = game.MouseControlledEntity.extend( {

	init: function( x, y, settings ) {

		settings.image = "boy";
		settings.spritewidth = 24;
		settings.spriteheight = 36;

		// call the constructor
		this.parent( x, y, settings );

		// set the default horizontal & vertical speed (accel vector)
		this.setVelocity( 3, 3 );

		this.gravity = 0;
		this.setFriction( 0.5, 0.5 );

		this.collidable = true;

		this.renderable.addAnimation( "down", [ 0, 1, 2 ] );
		this.renderable.addAnimation( "left", [ 3, 4, 5 ] );
		this.renderable.addAnimation( "right", [ 6, 7, 8 ] );
		this.renderable.addAnimation( "up", [ 9, 10, 11 ] );

		// set the display to follow our position on both axis
		me.game.viewport.follow( this.pos, me.game.viewport.AXIS.BOTH );

		this.direction = "down";

		//has to bee release
		me.input.registerPointerEvent( 'mousedown', me.game.viewport, this.onMouseDown.bind( this ) );
	},

	update: function( ) {

		this._calculateStep( );

		// check & update player movement
		this.updateMovement( );

		// check for collision
        var res =  me.game.world.collide(this);    	
    	if (res && (res.obj.type == me.game.COLLECTABLE_OBJECT)) {        		    		  		    		  		    	  
    		delete this._target;    		
    		this.pos.x -= res.x;
    		this.pos.y -= res.y;     		    				    		    		    		   		    		      		    		    		    			    		    				    		
    	}

		// update animation if necessary
		if( this.vel.x != 0 || this.vel.y != 0 ) {
			// update object animation
			this.parent( );
			return true;
		}

		// else inform the engine we did not perform
		// any update (e.g. position, animation)
		return false;
	},

	/**
	 * on destroy handler
	 */
	onDestroyEvent: function( ) {
		me.input.releasePointerEvent( 'mousedown', me.game.viewport );
	},
} );


