window.game = window.game || {};
/**
 * A bag
 * The plugin lets store artifacts in a backpack,
 * return an artifact from backpack into the game and
 * use artifact from the bag using Drag and Drop.
 *
 * @author Tomas Jurman (tomasjurman@gmail.com)
 * @license Dual licensed under the MIT or GPL licenses.
 */

( function( $ ) {

	/**
	 * @class
	 * @public
	 * @extends me.plugin.Base
	 * @constructor
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
		 * create a bag to the game
		 * @public
		 * @param {int} x - x position of the bag
		 * @param {int} y - y position of the bag
		 * @param {int} w - width of the bag
		 * @param {int} h - height of the bag
		 * @param {String} bg - background color (e.g. "#0000ff")
		 */
		create: function( x, y, w, h, bg ) {
			if( game.bag == null ) {
				game.bag = new BagObject( x, y, w, h, bg );
				me.game.add( game.bag );
			}
		},

		/**
		 * remove the bag from a game
		 * @public
		 */
		remove: function( ) {
			if( game.bag != null ) {
				me.game.remove( game.bag );
				game.bag = null;
			}
		},
	} );

	/**
	 * Bag Object<br>
	 * Object instance is accessible through {@link game.Bag} if previously initialized using me.plugin.bag.create(...);
	 * @class
	 * @extends me.Renderable
	 * @example
	 * // add a bag to the game
	 * me.plugin.bag.create(0,0,480,100);
	 *
	 * // add item
	 * game.bag.add( TODO );
	 *
	 * // remove item
	 * game.bag.remove( TODO );
	 */
	var BagObject = me.Renderable.extend( {

		/**
		 * @ignore
		 */
		init: function( x, y, w, h, bg ) {

			// call the parent constructor
			this.parent( new me.Vector2d( x || 0, y || 0 ), w || me.video.getWidth( ), h || BagObject.BAG_DEFAULT_HEIGHT );

			// default background color (if specified)
			this.bgcolor = bg;

			// hold all the items labels
			this.items = [ ];

			// visible or not...
			this.visible = true;

			// use screen coordinates
			this.floating = true;

			// state of bag (to trigger redraw);
			this._invalidated = true;

			// create a canvas where to draw everything
			this.bagCanvas = me.video.createCanvas( this.width, this.height );
			this.bagContext = me.video.getContext2d( this.bagCanvas );

			// this is a little hack to ensure the bag is always the first draw
			this.z = 999;

			// ensure me.game.removeAll() will not remove the bag
			this.isPersistent = true;
		},

		add: function( item ) {
		},
		remove: function( item ) {
		},

		/**
		 * return true if the bag has been updated
		 * @ignore
		 */
		update: function( ) {
			return this._invalidated;
		},

		/**
		 * draw the bag
		 * @ignore
		 */
		draw: function( context ) {
			if( this._invalidated ) {

				if( this.bgcolor ) {
					me.video.clearSurface( this.bagContext, this.bgcolor );
				}

				var count = this.items.length;
				for( var i = 0, obj = this.items[ i ]; i < count; i++ ) {
					if( obj.visible ) {
						obj.draw( this.bagContext, 0, 0 );
						// clear the updated flag
						if( obj.updated ) {
							obj.updated = false;
						}
					}
				}
			}

			// draw the bag
			context.drawImage( this.bagCanvas, this.pos.x, this.pos.y );

			// reset the flag
			this._invalidated = false;
		}
	} );
	
	/**
	 * the bag default height
	 * @constant
	 * @name BAG_DEFAULT_HEIGHT
	 * @type {int}
	 * @ignore
	 */
	BagObject.BAG_DEFAULT_HEIGHT = 30;

	// register plugin
	me.plugin.register( Bag, "bag" );

	/*---------------------------------------------------------*/
	// END END END
	/*---------------------------------------------------------*/
} )( window );

