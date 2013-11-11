window.game = window.game || {};
/**
 * A dialog extension
 *
 * The extension adds an ability to control interactive conversation between a characters in a game.
 * For building data structure of your conversation you can use the Dialogues builder tool.
 *
 * @author Tomas Jurman (tomasjurman@gmail.com)
 * @license Dual licensed under the MIT or GPL licenses.
 * @see Blog post (http://tomasjurman.blogspot.cz/2013/03/interactive-dialogue-for-html5-game.html)
 * @see Dialogues builder tool ( http://kibo.github.com/dialoguesBuilder/ )
 *
 * @constructor
 * @param {?Object} data
 * @param {?Function} onReset - callback when dialog is reset
 * @param {?Function} onShow - callback when dialog is showed
 * @example
 * myEntity.dialog = new game.Dialog();
 */
game.Dialog = function( data, onReset, onShow ) {
	if( data ) {
		this.setData( data );
	}

	if( typeof onReset == "function" ) {
		this.onReset = onReset;
	}

	if( typeof onShow == "function" ) {
		this.onShow = onShow;
	}
};

/**
 * id for DOM container
 * @constant
 * @name DOM_CONTAINER_ID
 * @type {string}
 */
game.Dialog.DOM_CONTAINER_ID = "game-dialog";

/**
 * DOM Element for a sentence
 * @constant
 * @name SENTENCE_ELEMENT
 * @type {string}
 */
game.Dialog.SENTENCE_ELEMENT = "p";

_p = game.Dialog.prototype;

/**
 * set a source data
 * @public
 * @function
 * @param {Object} data
 * @throw {Error} Data is not valid.
 * @return {Object} this
 */
_p.setData = function( data ) {
	if( !this._isValid( data ) ) {
		throw new Error( "[game.Dialog#setData] Source Data is not valid." );
	}

	this._data = data;
	return this;
};

/**
 * get the source data
 * @public
 * @function
 * @return {Object}
 */
_p.getData = function( ) {
	return this._data;
};

/**
 * get the current sentence or root of dialogues
 * @public
 * @function
 * @return {Object}
 */
_p.get = function( ) {
	if( !this._sentence ) {
		this._sentence = this.getRoot( );
		if( !this._isActive( this._sentence ) ) {
			this._next( );
		}
		this._execCode( this._sentence.codeBefore );
	}

	return this._sentence;
};

/**
 * set a sentence
 * @public
 * @function
 * @param {number} id
 */
_p.set = function( id ) {
	this._sentence = this.find( id );
};

/**
 * show a sentence as HTML
 * @public
 * @function
 */
_p.show = function( ) {
	this._cleanDOMContainer( );

	var DOMSentence = this.get( ).isChoice ? this._getChoiceAsDOM( this.get( ) ) : this._getSentenceAsDOM( this.get( ) );

	this._getDOMContainer( ).appendChild( DOMSentence );
	this.onShow && this.onShow( {
		sentence: this.get( ),
		DOM: DOMSentence
	} );
};

/**
 * hook function - called when the dialog is showed
 * Should be owerwritten if you need any extra functionality here.
 * @public
 * @function
 * @param {Object} e - event: { DOM: < sentence as DOM > , sentence: < sentence object > }
 */
_p.onShow = function( e ) {
};

/**
 * get the root of dialogues
 * @public
 * @function
 * @return {Object}
 */
_p.getRoot = function( ) {
	for( var idx = 0; idx < this._data.dialogues.length; idx++ ) {
		if( !this._data.dialogues[ idx ].parent ) {
			return this._data.dialogues[ idx ];
		}
	}
};

/**
 * get the actor
 * @public
 * @function
 * @param {number} id
 * @return {?Object} actor or null
 */
_p.getActor = function( id ) {
	var actor = null;
	for( var idx = 0; idx < this._data.actors.length; idx++ ) {
		if( this._data.actors[ idx ].id == id ) {
			actor = this._data.actors[ idx ];
			break;
		}
	}

	return actor;
};

/**
 * find a dialog by id
 * @public
 * @function
 * @param {number} id
 * @return {?Object} dialog or null
 */
_p.find = function( id ) {
	var dialog = null;

	for( var idx = 0; idx < this._data.dialogues.length; idx++ ) {
		if( this._data.dialogues[ idx ].id == id ) {
			return this._data.dialogues[ idx ];
			break;
		}
	}

	return dialog;
};

/**
 * reset conversation
 * @public
 * @function
 */
_p.reset = function( ) {
	this._sentence = null;
	this._cleanDOMContainer( );
	this.onReset && this.onReset( );
};

/**
 * hook function - called when dialog is reset
 * Should be owerwritten if you need any extra functionality here.
 * @public
 * @function
 */
_p.onReset = function( ) {
},

/**
 * set next sentence
 * @private
 * @function
 */
_p._next = function( ) {
	if( this._sentence && this._isActive( this._sentence ) ) {
		this._execCode( this._sentence.codeAfter );
	}

	var nextSentenceID = this._sentence.outgoingLinks.length == 1 ? this._sentence.outgoingLinks[ 0 ] : null;
	this.set( nextSentenceID );
	if( !this._sentence ) {
		this.reset( );
		return;
	}

	if( !this._isActive( this._sentence ) ) {
		this._next( );
	}

	this._execCode( this._sentence.codeBefore );
};

/**
 * get DOM container
 * @private
 * @function
 * @return {Object} DOM element
 */
_p._getDOMContainer = function( ) {
	var container = document.getElementById( game.Dialog.DOM_CONTAINER_ID );

	if( !container ) {
		container = document.createElement( "div" );
		container.setAttribute( "id", game.Dialog.DOM_CONTAINER_ID );
		document.getElementsByTagName("body")[ 0 ].appendChild( container );
	}

	return container;
};

/**
 * clean the DOM container
 * @private
 * @function
 */
_p._cleanDOMContainer = function( ) {
	this._getDOMContainer( ).innerHTML = '';
};

/**
 * check a source data
 * @private
 * @function
 * @param {Object} data
 * @return {boolean}
 */
_p._isValid = function( data ) {
	var isValid = true;
	if( !data || !data.dialogues || !data.actors || data.dialogues.length == 0 || data.actors.length <= 1 || !this._getRoots( data ) ) {
		isValid = false;
	}

	return isValid;
};

/**
 * get number of roots in a source data
 * @private
 * @function
 * @param {Object} data
 * @return {number}
 */
_p._getRoots = function( data ) {
	var roots = [ ];
	for( var idx = 0; idx < data.dialogues.length; idx++ ) {
		if( !data.dialogues[ idx ].parent ) {// reference to parent is null
			roots.push( data.dialogues[ idx ] );
		}
	}
	return roots.length;
};

/**
 * parse string and execute it as JavaScript code <br>
 * use eval() function
 * @private
 * @function
 * @param {string} code
 * @see eval(string) (https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/eval)
 */
_p._execCode = function( code ) {
	try {
		return eval( code );
	} catch (e) {
		if( e ) {
			throw new Error( "[game.Dialog#_execCode] Syntax error on your code: " + code );
		}
	}
};

/**
 * evaluates conditionString property in sentence
 * @private
 * @function
 * @param {Object} sentence
 * @return {boolean}
 */
_p._isActive = function( sentence ) {
	return sentence.conditionsString ? this._execCode( sentence.conditionsString ) : true;
};

/**
 * get a sentence as DOM
 * @private
 * @function
 * @param {Object} sentence
 * @return {Object} DOM element
 */
_p._getSentenceAsDOM = function( sentence ) {
	var container = document.createElement( "div" );
	container.setAttribute( "class", "dialog " + this.getActor( sentence.actor ).name );
	container.appendChild( this._createSentence( sentence ) );
	return container;
};

/**
 * get a choice as DOM
 * @private
 * @function
 * @param {Object} choice
 * @return {Object} DOM element
 */
_p._getChoiceAsDOM = function( choice ) {
	var container = document.createElement( "div" );
	container.setAttribute( "class", "dialog choice" );

	for( var idx = 0; idx < choice.outgoingLinks.length; idx++ ) {
		var sentence = this.find( choice.outgoingLinks[ idx ] );
		if( !this._isActive( sentence ) )
			continue;

		container.appendChild( this._createMenuItem( sentence ) );
	}

	return container;
};

/**
 * create DOM for a sentence
 * @private
 * @function
 * @param {Object} sentence
 * @return {Object} DOM element
 */
_p._createSentence = function( sentence ) {
	var sentenceWrapper = document.createElement( game.Dialog.SENTENCE_ELEMENT );
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
};

/**
 * create DOM for a choice
 * @private
 * @function
 * @param {Object} sentence
 * @return {Object} DOM element
 */
_p._createMenuItem = function( sentence ) {
	var menuItem = document.createElement( game.Dialog.SENTENCE_ELEMENT );
	menuItem.setAttribute( "data-sentence-id", sentence.id );
	menuItem.appendChild( document.createTextNode( sentence.menuText ) );
	menuItem.addEventListener( this._isTouchDevice( ) ? "touchstart" : "mousedown", function( e ) {
		this.set( e.target.getAttribute( "data-sentence-id" ) );
		if( this._sentence ) {
			if( !this._isActive( this._sentence ) ) {
				this._next( );
			}
			this._execCode( this._sentence.codeBefore );
			this.show( );
		}
	}.bind( this ), false );

	return menuItem;
};

/**
 * Is touch device
 * @private
 * @function
 * @return {boolean}
 */
_p._isTouchDevice = function( ) {
	return ( 'ontouchstart' in document.documentElement );
};