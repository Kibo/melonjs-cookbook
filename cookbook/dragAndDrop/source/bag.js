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

			item.collidable = false;
			item.floating = true;

			this._setItemPosition( item );
			this.items.push( item );

			me.input.registerPointerEvent( 'mousedown', item, this._onMouseDown.bind( item ) );
		},

		/**
		 * remove item from the bag
		 * @param {me.CollectableEntity} item
		 */
		remove: function( item ) {					
			var idx = this.items.indexOf( item );
			if( idx != -1 ) {						
				this.items.splice( idx, 1 );

				item.floating = false;
				item.collidable = true;
			
				// set world position
				item.pos = me.game.viewport.localToWorld( item.pos.x, item.pos.y );
														
				me.input.releasePointerEvent( 'mousedown', item );
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
			var pos = new me.Vector2d( );

			switch( this.location ) {

				case this._LOCATIONS["top"]:
					pos.x = 0;
					pos.y = 0;
					break;

				case this._LOCATIONS["right"]:
					pos.x = me.game.viewport.width - this._getWidth( );
					pos.y = 0;
					break;

				case this._LOCATIONS["down"]:
					pos.x = 0;
					pos.y = me.game.viewport.height - this._getHeight( );
					break;

				case this._LOCATIONS["left"]:
					pos.x = 0;
					pos.y = 0;
					break;

				default:
					throw new Error( "[game.bag#getBounds] Unknown location: " + this.location );
			}

			return new me.Rect( pos, this._getWidth( ), this._getHeight( ) );
		},

		/**
		 * calculate position for an item in bag
		 * @private
		 * @param {me.CollectableEntity} item
		 * @return {number}
		 */
		_setItemPosition: function( item ) {
			switch( this.location ) {
				case this._LOCATIONS["top"]:

					item.pos.x = this._getWidth( );
					item.pos.y = this.padding;

					if( this.items.length == 0 ) {
						item.pos.x += this.padding;
					}

					break;

				case this._LOCATIONS["right"]:

					item.pos.x = me.game.viewport.width - ( item.width + this.padding );
					item.pos.y = this._getHeight( );

					if( this.items.length == 0 ) {
						item.pos.y += this.padding;
					}

					break;

				case this._LOCATIONS["down"]:

					item.pos.x = this._getWidth( );
					item.pos.y = me.game.viewport.height - ( item.height + this.padding );

					if( this.items.length == 0 ) {
						item.pos.x += this.padding;
					}

					break;

				case this._LOCATIONS["left"]:

					item.pos.x = this.padding;
					item.pos.y = this._getHeight( );

					if( this.items.length == 0 ) {
						item.pos.y += this.padding;
					}

					break;

				default:
					throw new Error( "[game.bag#_getPosition] Unknown location: " + this.location );
			}
		},

		/**
		 * get width of the bag
		 * @private
		 * @return {number}
		 */
		_getWidth: function( ) {
			var size = 0;

			if( this.location == this._LOCATIONS[ "top" ] || this.location == this._LOCATIONS[ "down" ] ) {

				// calculate width of items in bag
				for( var idx = 0; idx < this.items.length; idx++ ) {
					size += this.items[ idx ].width;
				}

				// calculate padding between items
				if( this.items.length > 0 ) {
					size += ( this.items.length + 1 ) * this.padding;
				}

			} else if( this.location == this._LOCATIONS[ "left" ] || this.location == this._LOCATIONS[ "right" ] ) {

				// look for the max width item
				for( var idx = 0; idx < this.items.length; idx++ ) {
					size = Math.max( size, this.items[ idx ].width );
				}

				// add padding for top/ down side
				size += ( 2 * this.padding );
			}

			return size;
		},

		/**
		 * get height of the bag
		 * @private
		 * @return {number}
		 */
		_getHeight: function( ) {
			var size = 0;

			if( this.location == this._LOCATIONS[ "left" ] || this.location == this._LOCATIONS[ "right" ] ) {

				// calculate height of items in bag
				for( var idx = 0; idx < this.items.length; idx++ ) {
					size += this.items[ idx ].height;
				}

				// calculate padding between items
				if( this.items.length > 0 ) {
					size += ( this.items.length + 1 ) * this.padding;
				}

			} else if( this.location == this._LOCATIONS[ "top" ] || this.location == this._LOCATIONS[ "down" ] ) {

				// look for the max height item
				for( var idx = 0; idx < this.items.length; idx++ ) {
					size = Math.max( size, this.items[ idx ].height );
				}

				// add padding for left/ right side
				size += ( 2 * this.padding );
			}

			return size;
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
			this.isDragged = true;
			me.input.registerPointerEvent( 'mousemove', me.game.viewport, game.bag._onMouseMove.bind( this ) );
			me.input.registerPointerEvent( 'mouseup', me.game.viewport, game.bag._onMouseUp.bind( this ) );

			e.stopPropagation( );
			e.preventDefault( );
			return false;
		},

		/**
		 * on mouse move handler
		 * @private
		 */
		_onMouseMove: function( e ) {
			this.pos.x = e.gameScreenX;
			this.pos.y = e.gameScreenY;

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

