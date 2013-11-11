/**
 * A dialog manager
 *
 * @deprecated
 * 
 * This plugin for MelonJS engine controls interactive conversation between a characters in a game.
 * usage : me.plugin.register(dialog, "dialog");
 *
 * For building data structure of your conversation you can use the Dialogues builder tool.
 *
 * @author Tomas Jurman (tomasjurman@gmail.com)
 * @license Dual licensed under the MIT or GPL licenses.
 * @see Blog post (http://tomasjurman.blogspot.cz/2013/03/interactive-dialogue-for-html5-game.html)
 * @see Dialogues builder tool ( http://kibo.github.com/dialoguesBuilder/ )
 */
( function( $ ) {

	/**
	 * @class
	 * @public
	 * @extends me.plugin.Base
	 * @memberOf me
	 * @constructor
	 */
	dialog = me.plugin.Base.extend( {

		// minimum melonJS version expected
		version: "0.9.9",

		/** @private */
		init: function( ) {
			this.parent( );
		},

		/**
		 * Create a new instance of me.Dialog class
		 * @name newInstance
		 * @public
		 * @function
		 * @param {?Object} data
		 * @param {?Function} onReset - callback when dialog is reset
		 * @param {?Function} onShow - callback when dialog is show
		 * @return {me.Dialog}
		 */
		newInstance: function( data, onReset, onShow ) {
			var dialog = new me.Dialog( );

			if( data ) {
				dialog.setData( data );
			}

			if( typeof onReset == "function" ) {
				dialog.onReset = onReset;
			}

			if( typeof onShow == "function" ) {
				dialog.onShow = onShow;
			}

			return dialog;
		}
	} );

	/**
	 * Dialog Object <br>
	 * @class
	 * @extends Object
	 * @memberOf me
	 * @constructor
	 * @example
	 * // create instance of me.Dialog class
	 * var dialog = me.plugin.dialog.newInstance( data );
	 * // show dialog
	 * dialog.show();
	 */
	me.Dialog = Object.extend( {

		/**
		 * set a source data
		 * @name me.Dialog#setData
		 * @public
		 * @function
		 * @param {Object} data
		 * @throw {Error} Data is not valid.
		 * @return {Object} this
		 */
		setData: function( data ) {
			if( !this._isValid( data ) ) {
				throw new Error( "[me.Dialog#setData] Source Data is not valid." );
			}

			this._data = data;
			return this;
		},

		/**
		 * get the source data
		 * @name me.Dialog#getData
		 * @public
		 * @function
		 * @return {Object}
		 */
		getData: function( ) {
			return this._data;
		},

		/**
		 * get the current sentence or root of dialogues
		 * @name me.Dialog#get
		 * @public
		 * @function
		 * @return {Object}
		 */
		get: function( ) {
			if( !this._sentence ) {
				this._sentence = this.getRoot();				
				if( !this._isActive( this._sentence )) {			
					this._next();				
				}
				this._execCode( this._sentence.codeBefore );							
			}

			return this._sentence;
		},

		/**
		 * set a sentence
		 * @name me.Dialog#set
		 * @public
		 * @function
		 * @param {number} id
		 */
		set: function( id ) {
			this._sentence = this.find( id );
		},

		/**
		 * show a sentence as HTML
		 * @name me.Dialog#show
		 * @public
		 * @function
		 */
		show: function( ) {												
			this._cleanDOMContainer( );

			var DOMSentence = this.get( ).isChoice ? this._getChoiceAsDOM( this.get( ) ) : this._getSentenceAsDOM( this.get( ) );

			this._getDOMContainer( ).appendChild( DOMSentence );
			this.onShow && this.onShow( {
				sentence:this.get(),
				DOM: DOMSentence
			} );
		},

		/**
		 * get the root of dialogues
		 * @name me.Dialog#getRoot
		 * @public
		 * @function
		 * @return {Object}
		 */
		getRoot: function( ) {
			for( var idx = 0; idx < this._data.dialogues.length; idx++ ) {
				if( !this._data.dialogues[ idx ].parent ) {
					return this._data.dialogues[ idx ];
				}
			}
		},

		/**
		 * get the actor
		 * @name me.Dialog#getActor
		 * @public
		 * @function
		 * @param {number} id
		 * @return {?Object} actor or null
		 */
		getActor: function( id ) {
			var actor = null;
			for( var idx = 0; idx < this._data.actors.length; idx++ ) {
				if( this._data.actors[ idx ].id == id ) {
					actor = this._data.actors[ idx ];
					break;
				}
			}

			return actor;
		},

		/**
		 * find a dialog by id
		 * @name me.Dialog#find
		 * @public
		 * @function
		 * @param {number} id
		 * @return {?Object} dialog or null
		 */
		find: function( id ) {
			var dialog = null;

			for( var idx = 0; idx < this._data.dialogues.length; idx++ ) {
				if( this._data.dialogues[ idx ].id == id ) {
					return this._data.dialogues[ idx ];
					break;
				}
			}

			return dialog;
		},

		/**
		 * reset conversation
		 * @name me.Dialog#reset
		 * @public
		 * @function
		 */
		reset: function( ) {
			this._sentence = null;
			this._cleanDOMContainer( );
			this.onReset && this.onReset( );
		},
				
		/**
		 * set next sentence
		 * @name me.Dialog#_next
		 * @private
		 * @function
		 */
		_next: function( ) {
			if( this._sentence && this._isActive( this._sentence )) {
				this._execCode( this._sentence.codeAfter );
			}

			var nextSentenceID = this._sentence.outgoingLinks.length == 1 ? this._sentence.outgoingLinks[ 0 ] : null;
			this.set( nextSentenceID );
			if( !this._sentence ) {
				this.reset( );
				return;
			}
					
			if( !this._isActive( this._sentence )) {			
				this._next( );				
			}
			
			this._execCode( this._sentence.codeBefore );			
		},

		/**
		 * get DOM container
		 * @name me.Dialog#_getDOMContainer
		 * @private
		 * @function
		 * @return {Object} DOM element
		 */
		_getDOMContainer: function( ) {
			var container = document.getElementById( me.Dialog.DOM_CONTAINER_ID );

			if( !container ) {
				container = document.createElement( "div" );
				container.setAttribute( "id", me.Dialog.DOM_CONTAINER_ID );
				document.getElementsByTagName("body")[ 0 ].appendChild( container );
			}

			return container;
		},

		/**
		 * clean the DOM container
		 * @name me.Dialog#_cleanDOMContainer
		 * @private
		 * @function
		 */
		_cleanDOMContainer: function( ) {
			this._getDOMContainer( ).innerHTML = '';
		},

		/**
		 * check a source data
		 * @name me.Dialog#_isValid
		 * @private
		 * @function
		 * @param {Object} data
		 * @return {boolean}
		 */
		_isValid: function( data ) {
			var isValid = true;
			if( !data || !data.dialogues || !data.actors || data.dialogues.length == 0 || data.actors.length <= 1 || !this._getRoots( data ) ) {
				isValid = false;
			}

			return isValid;
		},

		/**
		 * get number of roots in a source data
		 * @name me.Dialog#_getRoots
		 * @private
		 * @function
		 * @param {Object} data
		 * @return {number}
		 */
		_getRoots: function( data ) {
			var roots = [ ];
			for( var idx = 0; idx < data.dialogues.length; idx++ ) {
				if( !data.dialogues[ idx ].parent ) {// reference to parent is null
					roots.push( data.dialogues[ idx ] );
				}
			}
			return roots.length;
		},

		/**
		 * parse string and execute it as JavaScript code <br>
		 * use eval() function
		 * @name me.Dialog#_execCode
		 * @private
		 * @function
		 * @param {string} code
		 * @see eval(string) (https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/eval)
		 */
		_execCode: function( code ) {
			try {
				return eval( code );
			} catch (e) {
				if( e ) {
					throw new Error( "[me.Dialog#_execCode] Syntax error on your code: " + code );
				}
			}
		},

		/**
		 * evaluates conditionString property in sentence
		 * @name me.Dialog#_isActive
		 * @private
		 * @function
		 * @param {Object} sentence
		 * @return {boolean}
		 */
		_isActive: function( sentence ) {			
			return sentence.conditionsString ? this._execCode( sentence.conditionsString ) : true;
		},

		/**
		 * get a sentence as DOM
		 * @name me.Dialog#_getSentenceAsDOM
		 * @private
		 * @function
		 * @param {Object} sentence
		 * @return {Object} DOM element
		 */
		_getSentenceAsDOM: function( sentence ) {
			var container = document.createElement( "div" );
			container.setAttribute( "class", "dialog " + this.getActor( sentence.actor ).name );
			container.appendChild( this._createSentence( sentence ) );
			return container;
		},

		/**
		 * get a choice as DOM
		 * @name me.Dialog#_getChoiceAsDOM
		 * @private
		 * @function
		 * @param {Object} choice
		 * @return {Object} DOM element
		 */
		_getChoiceAsDOM: function( choice ) {
			var container = document.createElement( "div" );
			container.setAttribute( "class", "dialog choice" );

			for( var idx = 0; idx < choice.outgoingLinks.length; idx++ ) {
				var sentence = this.find( choice.outgoingLinks[ idx ] );
				if( !this._isActive( sentence ) )
					continue;

				container.appendChild( this._createMenuItem( sentence ) );
			}

			return container;
		},

		/**
		 * create DOM for a sentence
		 * @name me.Dialog#_createSentence
		 * @private
		 * @function
		 * @param {Object} sentence
		 * @return {Object} DOM element
		 */
		_createSentence: function( sentence ) {
			var sentenceWrapper = document.createElement( me.Dialog.SENTENCE_ELEMENT );
			sentenceWrapper.setAttribute( "data-sentence-id", sentence.id );
			sentenceWrapper.appendChild( document.createTextNode( sentence.dialogueText ) );
			sentenceWrapper.addEventListener( this._isTouchDevice( ) ? "touchstart" : "mousedown", function( e ) {
				var currentSentence = this.find( e.target.getAttribute( "data-sentence-id" ) );
				this._next( );
				if( this._sentence ) {
					this.show( );
				}
			}.bind( this ), false );

			return sentenceWrapper;
		},

		/**
		 * create DOM for a choice
		 * @name me.Dialog#_createMenuItem
		 * @private
		 * @function
		 * @param {Object} sentence
		 * @return {Object} DOM element
		 */
		_createMenuItem: function( sentence ) {
			var menuItem = document.createElement( me.Dialog.SENTENCE_ELEMENT );
			menuItem.setAttribute( "data-sentence-id", sentence.id );
			menuItem.appendChild( document.createTextNode( sentence.menuText ) );
			menuItem.addEventListener( this._isTouchDevice( ) ? "touchstart" : "mousedown", function( e ) {
				this.set( e.target.getAttribute( "data-sentence-id" ) );
				if( this._sentence ) {					
					if( !this._isActive( this._sentence )) {			
						this._next();				
					}
					this._execCode( this._sentence.codeBefore );	
					this.show( );
				}
			}.bind( this ), false );

			return menuItem;
		},

		/**
		 * Is touch device
		 * @name me.Dialog#_isTouchDevice
		 * @private
		 * @function
		 * @return {boolean}
		 */
		_isTouchDevice: function( ) {
			return ( 'ontouchstart' in document.documentElement );
		},
	} );

	/**
	 * id for DOM container
	 * @constant
	 * @name DOM_CONTAINER_ID
	 * @memberOf me.dialog
	 * @type {string}
	 */
	me.Dialog.DOM_CONTAINER_ID = "me-dialog";

	/**
	 * DOM Element for a sentence
	 * @constant
	 * @name SENTENCE_ELEMENT
	 * @memberOf me.dialog
	 * @type {string}
	 */
	me.Dialog.SENTENCE_ELEMENT = "p";

	/*---------------------------------------------------------*/
	// END END END
	/*---------------------------------------------------------*/
} )( window ); 