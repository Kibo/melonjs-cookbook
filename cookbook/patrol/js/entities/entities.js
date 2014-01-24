game.PatrolEntity = me.ObjectEntity.extend({

	_patrol_path: [ ],
	_patrol_isReverse: false,
	_patrol_isInfinite: true,

	/**
	 * Add a point to the end of the path
	 * @param {me.Vector2d} point
	 */
	patrol_addPoint: function( point ) {
		this._patrol_path.push( point );
	},
		
	/**
	 * Start walking
	 */
	patrol_walk: function( ) {
		this._isWalking = true;
		
		if( !this._target && this._patrol_path[ 0 ] ) {
			this._target = this._patrol_path[ 0 ];			
		}
		
		this._setDirection(this._target.x - this.pos.x, this._target.y - this.pos.y);      
        this.renderable.setCurrentAnimation( this.direction ); 
	},

	/**
	 * Stop walking
	 */
	patrol_stop: function( ) {
		this._isWalking = false;
	},
	
	/**
	 * Set reverse.
	 * When is reverse, the movement is there and back
	 * @param {boolean}
	 */
	patrol_setReverse: function( isReverse ) {
		this._patrol_isReverse = isReverse;
	},
	
	/**
	 * Set infinite.
	 * When is infinite, the movement is in an endless loop
	 * @param {boolean}
	 */
	patrol_setInfinite: function( isInfinite ) {
		this._patrol_isInfinite = isInfinite;
	},

	/**
	 * Calculate step for every update
	 * @private
	 */
	_calculateStep: function( ) {

		if( this._target ) {

			var dx = this._target.x - this.pos.x;
			var dy = this._target.y - this.pos.y;

			if( Math.abs( dx ) < this.maxVel.x && Math.abs( dy ) < this.maxVel.x ) {

				var idx = this._patrol_path.indexOf( this._target );

				//next point index
				idx++;
			
				if( idx == ( this._patrol_path.length ) ) {
					delete this._target;
										
					/* callback */
					if(typeof this.afterPatrolFinished === 'function'){
						this.afterPatrolFinished();
					}
					
					if( this._patrol_isReverse ){
						this._patrol_path.reverse( );						
					}
					
					if( this._patrol_isInfinite){
						this.patrol_walk( );
					}
										
				} else {
					this._target = this._patrol_path[ idx ];
					this._setDirection(this._target.x - this.pos.x, this._target.y - this.pos.y);      
        			this.renderable.setCurrentAnimation( this.direction ); 
				}

				return;
			}

			var angle = Math.atan2( dy, dx );
			this.vel.x = Math.cos( angle ) * this.accel.x * me.timer.tick;
			this.vel.y = Math.sin( angle ) * this.accel.y * me.timer.tick;

		} else {
			this.vel.x = 0;
			this.vel.y = 0;
		}
	},
	
	/**
	 * Set direction
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
	
	update: function( ) {
		if( !this._isWalking ){
			return false;	
		}

		this._calculateStep( );

		this.updateMovement( );

		// update animation if necessary
		if( this.vel.x != 0 || this.vel.y != 0 ) {
			// update object animation
			this.parent( );
			return true;
		}

		return false;
	},
} );

game.GirlEntity = game.PatrolEntity.extend( {

	init: function( x, y, settings ) {

		settings.image = "girl";
		settings.spritewidth = 24;
		settings.spriteheight = 36;

		// call the constructor
		this.parent( x, y, settings );

		// set the default horizontal & vertical speed (accel vector)
		this.setVelocity( 2, 2 );

		this.gravity = 0;
		this.setFriction( 0.5, 0.5 );

		this.collidable = true;
		this.type = me.game.ENEMY_OBJECT;

		this.renderable.addAnimation( "down", [ 0, 1, 2 ] );
		this.renderable.addAnimation( "left", [ 3, 4, 5 ] );
		this.renderable.addAnimation( "right", [ 6, 7, 8 ] );
		this.renderable.addAnimation( "up", [ 9, 10, 11 ] );
	
		// set the display to follow our position on both axis
		me.game.viewport.follow( this.pos, me.game.viewport.AXIS.BOTH );
		
		// Points which has to go through
		this.patrol_addPoint( new me.Vector2d(100, 100));
		this.patrol_addPoint( new me.Vector2d(200, 100));
		this.patrol_addPoint( new me.Vector2d(200, 200));
		this.patrol_addPoint( new me.Vector2d(100, 200));		
		
		// callback
		this.afterPatrolFinished = function(){
			console.log("patrol finished");
		};
		
		this.patrol_walk();
	},
} );
