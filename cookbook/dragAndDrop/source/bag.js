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
		 * @param {?string} location - top | right | bottom | left
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
			bottom: 2,
			left: 3
		},

		/**
		 * @ignore
		 * @param {?string} location - top | right | bottom | left
		 * @param {?number} padding - item padding in px
		 */
		init: function( location, padding ) {
			this.location = this._LOCATIONS[ location ] || this._LOCATIONS[ "top" ];
			this.padding = padding || 0;
			this.items = [ ];
			
			me.event.subscribe(me.event.LEVEL_LOADED, this._reset);
			
			if(BagObject._DEBUG && window.console){window.console.log("[game.bag#init]");};
		},

		/**
		 * add item to the bag
		 * @param {me.CollectableEntity} item
		 * @param {?number} x - y position on viewport
		 * @param {?number} y - y position on viewport
		 * @fires game.bag#onAddItem
		 */
		add: function( item, x, y ) {
			if( !item ) {
				throw new Error( "[game.bag#add] Compulsory parameter 'item' is undefined." );
			}

			item.floating = true;
			item.collidable = false;
			item.isPersistent = true;

			this.items.push( item );
			var pos = this._getItemPosition( this.items.indexOf( item ) );
			item.pos.x = pos.x;
			item.pos.y = pos.y;

			me.input.registerPointerEvent( 'mousedown', item, this._onMouseDown.bind( item ), true );
			
			/**
			 * onAddItem event				
			 * @event game.bag#onAddItem
			 * @type {Array}
			 * @property {Object} item
			 */
			me.event.publish(BagObject.ADD_ITEM_CHANNEL_NAME, [item]);					
		},
		
		/**
		 * has item
		 * @param {string} name
		 * @return {boolean}
		 */
		hasItem: function( name ){						
			return this.getItem( name ) ? true : false;
		},
		
		/**
		 * get item
		 * @param {string} name
		 * @return {me.CollectableEntity | null}
		 */
		getItem: function(name){
			for(var idx = 0; idx < this.items.length; idx++){										
				if( this.items[idx].name && this.items[idx].name === name ){
					return this.items[idx];
				}
			}	
			
			return null;
		},

		/**
		 * remove item from the bag
		 * @param {me.CollectableEntity} item
		 * @fires game.bag#onRemoveItem
		 */
		remove: function( item ) {

			var idx = this.items.indexOf( item );
			if( idx != -1 ) {
				this.items.splice( idx, 1 );

				item.floating = false;
				item.collidable = true;	
				item.isPersistent = false;			

				me.input.releasePointerEvent( 'mousedown', item );
				this._arrange();
								
				/**
				 * onRemoveItem event				
				 * @event game.bag#onRemoveItem
				 * @type {Array}
				 * @property {Object} item
				 */
				me.event.publish(BagObject.REMOVE_ITEM_CHANNEL_NAME, [item]);							
			}								
		},
				
		/**
		 * Destroy function
		 * @ignore
		 */
		destroy: function( ) {
			for( var idx = 0; idx < this.items.length; idx++ ) {
				this.remove( this.items.idx );					
			}
								
			me.event.unsubscribe( me.event.LEVEL_LOADED, this._reset );
			
			if(BagObject._DEBUG && window.console){window.console.log("[game.bag#destroy]");};											
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

				case this._LOCATIONS["bottom"]:
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
		 * get position of item in bag
		 * @private
		 * @param {number} index - index of item in bag
		 * @return {me.Vector2d}
		 */
		_getItemPosition: function( index ) {
			return new me.Vector2d( this._getItemPosX( index ), this._getItemPosY( index ) );
		},

		/**
		 * get X position of item in the bag
		 * @private
		 * @param {index} index - index of item in bag
		 * @return {number}
		 */
		_getItemPosX: function( index ) {
			if( !( index >= 0 && index < this.items.length ) ) {
				throw new Error( "[game.bag#_getItemPosX] Index out of bounds. Index: " + index );
			}

			var pos = 0;

			if( this.location == this._LOCATIONS[ "top" ] || this.location == this._LOCATIONS[ "bottom" ] ) {

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
		_getItemPosY: function( index ) {
			if( !( index >= 0 && index < this.items.length ) ) {
				throw new Error( "[game.bag#_getItemPosY] Index out of bounds. Index: " + index );
			}

			var pos = 0;

			if( this.location == this._LOCATIONS[ "top" ] ) {
				pos = this.padding;

			} else if( this.location == this._LOCATIONS[ "bottom" ] ) {
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
		 * calculate width of bag
		 * @private
		 * @return {numner}
		 */
		_getWidth: function( ) {

			var size = 0;

			if( this.location == this._LOCATIONS[ "top" ] || this.location == this._LOCATIONS[ "bottom" ] ) {

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

				// calculate padding between items
				if( this.items.length > 0 ) {
					size += ( 2 * this.padding );
				}
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

			} else if( this.location == this._LOCATIONS[ "top" ] || this.location == this._LOCATIONS[ "bottom" ] ) {

				// look for the max height item
				for( var idx = 0; idx < this.items.length; idx++ ) {
					size = Math.max( size, this.items[ idx ].height );
				}
				
				// calculate padding between items
				if( this.items.length > 0 ) {
					size += ( 2 * this.padding );
				}
			}

			return size;
		},

		/**
		 * arrange items in bag
		 * @private
		 */
		_arrange: function( ) {
			for( var i = 0; i < this.items.length; i++ ) {
				var pos = this._getItemPosition( i );
				this.items[ i ].pos.x = pos.x;
				this.items[ i ].pos.y = pos.y;
			}
		},
		
		/**
		 * reset events in bag
		 * recreate events, when player goes to the next level
		 * @private
		 */
		_reset: function(){										
			for( var idx = 0; idx < game.bag.items.length; idx++ ) {								
				me.input.releasePointerEvent( 'mousedown', game.bag.items[idx]);				
				me.input.registerPointerEvent( 'mousedown', game.bag.items[idx], game.bag._onMouseDown.bind( game.bag.items[idx] ), true );
			}
						
			if(BagObject._DEBUG && window.console){window.console.log("[game.bag#_reset] recreate events of item in bag.");};
		},

		/**
		 * on mouse down handler
		 * @private
		 */
		_onMouseDown: function( e ) {							
			if( this._isDragged ) {
				game.bag._leave( this );				
			}
									
			this._isDragged = true;
			me.input.registerPointerEvent( 'mousemove', me.game.viewport, game.bag._onMouseMove.bind( this ), false );
			me.input.registerPointerEvent( 'mouseup', me.game.viewport, game.bag._onMouseUp.bind( this ), false );
			
			if(BagObject._DEBUG && window.console){window.console.log("[game.bag#_onMouseDown] register events");};			

			e.stopPropagation( );
			e.preventDefault( );							
			return false;
		},

		/**
		 * on mouse move handler
		 * @private
		 */
		_onMouseMove: function( e ) {
			this.floating = false;
			this.isMoving = true;
			
			this.pos.x = e.gameX;
			this.pos.y = e.gameY;

			e.stopPropagation( );
			e.preventDefault( );
			
			if(BagObject._DEBUG && window.console){window.console.log("[game.bag#_onMouseMove] move");};
			
			return false;
		},

		/**
		 * on mouse up handler
		 * @private
		 */
		_onMouseUp: function( e ) {	
			if(BagObject._DEBUG && window.console){window.console.log("[game.bag#_onMouseUp] mouseUp");};
							
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
			
			if(BagObject._DEBUG && window.console){ window.console.log("[game.bag#_leave] unregister events");};
						
			if( item.isMoving ){
				if(BagObject._DEBUG && window.console){ window.console.log("[game.bag#_leave] remove from bag.");};
								
				delete item.isMoving;				
				item._isDragged = false;
				game.bag.remove( item );						
			}									
		},
	} );
	
	/**
     * Channel Constant for when a item is added    
     * @constant
     * @name ADD_ITEM_CHANNEL_NAME
     * @type {string}
     */
	BagObject.ADD_ITEM_CHANNEL_NAME = "game.bag.onAddItem";
	
	/**
     * Channel Constant for when a item is remove   
     * @constant
     * @name REMOVE_ITEM_CHANNEL_NAME
     * @type {string}
     */
	BagObject.REMOVE_ITEM_CHANNEL_NAME = "game.bag.onRemoveItem";
	
	/**
     * Debug to window.console
     * @constant
     * @name _DEBUG
     * @type {boolean}
     */
	BagObject._DEBUG = false;

	// register plugin
	me.plugin.register( Bag, "bag" );

	/*---------------------------------------------------------*/
	// END END END
	/*---------------------------------------------------------*/
} )( window );

