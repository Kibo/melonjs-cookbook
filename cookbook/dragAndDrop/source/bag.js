window.game = window.game || {};
/**
 * A bag
 * The plugin lets store items in a backpack,
 * return an item from backpack into the game and
 * use an item from the bag using Drag and Drop.
 *
 * @author Tomas Jurman (tomasjurman@gmail.com)
 * @license Dual licensed under the MIT or GPL licenses.
 */

( function( $ ) {

	/**
	 * @class
	 * @public
	 * @extends me.plugin.Base
	 */
	var Bag = me.plugin.Base.extend( {

		// minimum melonJS version expected
		version: "0.9.9",

		/** @private */
		init: function( ) {
			this.parent( );

			/**
			 * a reference to the bag (if defined).
			 * @public
			 */
			game.bag = null;
		},

		/**
		 * create a bag container
		 * @public
		 * @param {?string} location - top | right | down | left
		 * @param {?number} padding - item padding in px
		 */
		create: function( location, padding ) {
			if( game.bag == null ) {
				game.bag = new BagObject( location, padding );
			}
		},

		/**
		 * remove the bag container from a game
		 * @public
		 */
		destroy: function( ) {
			if( game.bag != null ) {
				game.bag.destroy( );
				game.bag = null;
			}
		},
	} );

	/**
	 * Bag Object<br>
	 * Object instance is accessible through {@link game.bag} if previously initialized using me.plugin.bag.create();
	 * @class
	 * @extends Object
	 * @example
	 * // add a bag to the game
	 * me.plugin.bag.create();
	 *
	 * // add item
	 * game.bag.add( sword );
	 *
	 * // remove item
	 * game.bag.remove( sword );
	 */
	var BagObject = Object.extend( {

		/**
		 * locations of a bag
		 * @private
		 */
		_LOCATIONS: {
			top: 0,
			right: 1,
			down: 2,
			left: 3
		},

		/**
		 * @ignore
		 * @param {?string} location - top | right | down | left
		 * @param {?number} padding - item padding in px
		 */
		init: function( location, padding ) {
			this.location = this._LOCATIONS[ location ] || this._LOCATIONS[ "top" ];
			this.padding = padding || 0;
			this.items = [ ];
		},

		/**
		 * add item to the bag
		 * @param {me.CollectableEntity} item
		 * @param {?number} x - y position on viewport
		 * @param {?number} y - y position on viewport
		 */
		add: function( item, x, y ) {
			if( !item ) {
				throw new Error( "[game.bag#add] Compulsory parameter 'item' is undefined." );
			}

			item.floating = true;
			item.collidable = false;

			this.items.push( item );
			var pos = this._getItemPosition( this.items.indexOf( item ) );
			item.pos.x = pos.x;
			item.pos.y = pos.y;

			me.input.registerPointerEvent( 'mousedown', item, this._onMouseDown.bind( item ), true );
		},

		/**
		 * remove item from the bag
		 * @param {me.CollectableEntity} item
		 */
		remove: function( item ) {

			var idx = this.items.indexOf( item );
			if( idx != -1 ) {
				this.items.splice( idx, 1 );

				item.collidable = true;

				me.input.releasePointerEvent( 'mousedown', item );
				this._rearrange( );
			}
		},

		/**
		 * Destroy function
		 * @ignore
		 */
		destroy: function( ) {
			console.log( "[game.bag] destroy" );
			//TODO
		},

		/**
		 * return the bounding box for the bag
		 * @return {me.Rect}
		 */
		getBounds: function( ) {
			//TODO
			// if(this.items.length == 0){
			// return me.Rect( new me.Vector2d(0,0), 0,0);
			// }
			//
			//
			// var width = this.getPosX(  this.items.length -1 );
			//
			// var pos = new me.Vector2d( );
			//
			// switch( this.location ) {
			//
			// case this._LOCATIONS["top"]:
			// pos.x = 0;
			// pos.y = 0;
			// break;
			//
			// case this._LOCATIONS["right"]:
			// pos.x = me.game.viewport.width - this._getWidth( );
			// pos.y = 0;
			// break;
			//
			// case this._LOCATIONS["down"]:
			// pos.x = 0;
			// pos.y = me.game.viewport.height - this._getHeight( );
			// break;
			//
			// case this._LOCATIONS["left"]:
			// pos.x = 0;
			// pos.y = 0;
			// break;
			//
			// default:
			// throw new Error( "[game.bag#getBounds] Unknown location: " + this.location );
			// }
			//
			// return new me.Rect( pos, this._getWidth( ), this._getHeight( ) );
		},

		/**
		 * get position of item in bag
		 * @param {number} index - index of item in bag
		 * @return {me.Vector2d}
		 */
		_getItemPosition: function( index ) {
			return new me.Vector2d( this._getPosX( index ), this._getPosY( index ) );
		},

		/**
		 * get X position of item in the bag
		 * @private
		 * @param {index} index - index of item in bag
		 * @return {number}
		 */
		_getPosX: function( index ) {
			if( !( index >= 0 && index < this.items.length ) ) {
				throw new Error( "[game.bag#_getPosX] Index out of bounds. Index: " + index );
			}

			var pos = 0;

			if( this.location == this._LOCATIONS[ "top" ] || this.location == this._LOCATIONS[ "down" ] ) {

				// calculate width of items in bag
				for( var idx = 0; idx < this.items.length; idx++ ) {

					pos += this.padding;

					if( index == idx ) {
						break;
					}

					pos += this.items[ idx ].width;
				}

			} else if( this.location == this._LOCATIONS[ "left" ] ) {
				pos = this.padding;

			} else if( this.location == this._LOCATIONS[ "right" ] ) {
				pos = me.game.viewport.width - ( this.items[ index ].width + this.padding );
			}

			return pos;
		},

		/**
		 * get Y position of item in the bag
		 * @private
		 * @param {index} index - index of item in bag
		 * @return {number}
		 */
		_getPosY: function( index ) {
			if( !( index >= 0 && index < this.items.length ) ) {
				throw new Error( "[game.bag#_getPosY] Index out of bounds. Index: " + index );
			}

			var pos = 0;

			if( this.location == this._LOCATIONS[ "top" ] ) {
				pos = this.padding;

			} else if( this.location == this._LOCATIONS[ "down" ] ) {
				pos = me.game.viewport.height - ( this.padding + this.items[ index ].height );

			} else if( this.location == this._LOCATIONS[ "left" ] || this.location == this._LOCATIONS[ "right" ] ) {

				for( var idx = 0; idx < this.items.length; idx++ ) {

					pos += this.padding;

					if( index == idx ) {
						break;
					}

					pos += this.items[ idx ].height;
				}
			}

			return pos;
		},

		/**
		 * rearrange items in bag
		 * @private
		 */
		_rearrange: function( ) {
			for( var i = 0; i < this.items.length; i++ ) {
				var pos = this._getItemPosition( i );				
				this.items[ i ].pos.x = pos.x;
				this.items[ i ].pos.y = pos.y;
			}
		},

		/**
		 * on mouse down handler
		 * @private
		 */
		_onMouseDown: function( e ) {
			if( this.isDragged ) {
				game.bag._leave( this );
			}

			console.log( "register" );
			this.floating = false;
			this.isDragged = true;
			me.input.registerPointerEvent( 'mousemove', me.game.viewport, game.bag._onMouseMove.bind( this ), false );
			me.input.registerPointerEvent( 'mouseup', me.game.viewport, game.bag._onMouseUp.bind( this ), false );

			e.stopPropagation( );
			e.preventDefault( );
			return false;
		},

		/**
		 * on mouse move handler
		 * @private
		 */
		_onMouseMove: function( e ) {
			this.pos.x = e.gameX;
			this.pos.y = e.gameY;

			e.stopPropagation( );
			e.preventDefault( );
			return false;
		},

		/**
		 * on mouse up handler
		 * @private
		 */
		_onMouseUp: function( e ) {
			game.bag._leave( this );

			e.stopPropagation( );
			e.preventDefault( );
			return false;
		},

		/**
		 * leave item from bag
		 * @private
		 * @param {me.CollectableEntity} item
		 */
		_leave: function( item ) {
			me.input.releasePointerEvent( 'mousemove', me.game.viewport );
			me.input.releasePointerEvent( 'mouseup', me.game.viewport );
			item.isDragged = false;
			game.bag.remove( item );
			console.log( "unregister" );
		},
	} );

	// register plugin
	me.plugin.register( Bag, "bag" );

	/*---------------------------------------------------------*/
	// END END END
	/*---------------------------------------------------------*/
} )( window );

