window.game = window.game || {};
/**
 * A task extension
 *
 * The extension controls a dialog with the form. Useful for entering and solving tasks in RPG games.
 *
 * @author Tomas Jurman (tomasjurman@gmail.com)
 * @license Dual licensed under the MIT or GPL licenses.
 *
 * @constructor
 * @abstract
 * @example
 * myEntity.practice = new game.Practice( data );
 */
game.Practice = Object.extend( {

	/**
	 * All tasks
	 * @private
	 */
	_tasks: [ ],

	/**
	 * Contains all errors object
	 * @private
	 */
	_errors: [ ],

	/**
	 * Count of tasks to practice
	 * @private
	 */
	_countOfTasks: 1,

	/**
	 * Current data index
	 * @private
	 */
	_taskIndex: 0,

	/**
	 * @param {Array<Object>} tasks
	 */
	init: function( tasks ) {
		this._tasks = tasks;
	},

	/**
	 * Hook function - called when a task showing.<br>
	 * It has to be owerwridden in subclasses<br>
	 * @param {DOMElement} container - DOM element
	 * @param {Object} task
	 */
	drawTask: function( container, task ) {
	},

	/**
	 * Hook function - called when a task is checked.<br>
	 * It has to be owerwridden in subclasses<br>
	 * Return true if task is correct<br>
	 * @param {DOMElement} container - DOM element
	 * @param {Object} task
	 * @return {boolean}
	 */
	evaluateTask: function( container, task ) {
		return false;
	},

	/**
	 * Show the practice
	 * Set the DOM container CSS-class named 'show'
	 */
	show: function( ) {						
		this._getDOMContainer().classList.remove('hide');
		this._getDOMContainer().classList.add('show');
	},

	/**
	 * Hide the practice
	 * Set the DOM container CSS-class named 'hide'
	 */
	hide: function( ) {			
		this._getDOMContainer().classList.remove('show');
		this._getDOMContainer().classList.add('hide');
	},

	/**
	 * Shuffle tasks
	 */
	shuffle: function( ) {
		this._tasks.sort( function( ) {
			return 0.5 - Math.random( );
		} );
	},

	/**
	 * Set count of tasks for practice
	 * @param {number} count
	 */
	setCountOfTask: function( count ) {
		this._countOfTasks = count;
	},

	/**
	 * Returns all tasks to its original state
	 */
	reset: function( ) {
		for( var idx = 0; idx < this._tasks.length; idx++ ) {
			delete this._tasks[ idx ].hasError;
			delete this._tasks[ idx ].isChecked;
		}
	},

	/**
	 * Has errors
	 * @return {boolean}
	 */
	hasErrors: function( ) {
		return this._errors.length != 0;
	},

	/**
	 * Get errors
	 * @return {Array<Object>}
	 */
	getErrors: function( ) {
		return this._errors;
	},

	/**
	 * Is the practice finished
	 * @return {boolean}
	 */
	isFinished: function( ) {
		return this._tasks.length > 0 && this._countOfTasks == ( this._taskIndex + 1 ) && this._tasks[ this._taskIndex ].isTaskChecked( );
	},

	/*
	 * Has next task
	 * @return {boolean}
	 */
	hasNextTask: function( ) {
		return this._taskIndex < this._tasks.length && this._taskIndex < this._countOfTasks;
	},

	/**
	 * Set a next task if has
	 */
	nextTask: function( ) {
		if( this.hasNextTask( ) ) {
			this._taskIndex++;
		}
	},

	/**
	 * Check a task
	 */
	checkTask: function( ) {
		this._tasks[ this._taskIndex ].isChecked = true;

		if( this.evaluateTask( this._getDOMContainer, this._tasks[ this._taskIndex ] ) ) {
			this._tasks[ this._taskIndex ].hasError = false;
		}
	},

	/**
	 * Show a task
	 */
	showTask: function( ) {
		this._getDOMContainer().innerHTML = "";
		this.drawTask( this._getDOMContainer( ), this._tasks[ this._taskIndex ] );
	},

	/**
	 * Has task error
	 * @return {boolean}
	 */
	hasTaskError: function( ) {
		return 'hasError' in this._tasks[ this._taskIndex ] && 'isChecked' in this._tasks[ this._taskIndex ] && this._tasks[ this._taskIndex ].isChecked && this._tasks[ this._taskIndex ].hasError;
	},

	/**
	 * Is a task checked
	 * @return {boolean}
	 */
	isTaskChecked: function( ) {
		return 'isChecked' in this._tasks[ this._taskIndex ] && this._tasks[ this._taskIndex ].isChecked;
	},

	/**
	 * Get a root DOM container
	 * If container not exists creates it
	 * @private
	 */
	_getDOMContainer: function( ) {
		var container = document.getElementById( game.Practice.DOM_CONTAINER_ID );

		if( !container ) {		
			container = document.createElement( "div" );
			container.setAttribute( "id", game.Practice.DOM_CONTAINER_ID );
			document.getElementsByTagName("body")[ 0 ].appendChild( container );
		}

		return container;
	},
	
} );

/**
 * id for DOM container
 * @constant
 * @name DOM_CONTAINER_ID
 * @type {string}
 */
game.Practice.DOM_CONTAINER_ID = "game-practice";

/**
 * Question practice
 * @extends {game.Practice}
 */
game.QuestionPractice = game.Practice.extend({
	
	/**
	* Draw a question
 	* @override
 	* @inheritDoc
	*/
	drawTask: function( container, task ) {
		var wrapper = document.createElement("div");
		
		// Instruction
		wrapper.innerHTML = task.text;
		
		// Input			
		var textField = document.createElement("input");
		textField.setAttribute("id", "game-practice-task");
		textField.setAttribute("type", "text");		
		wrapper.appendChild( textField );
		
		var buttonWrapper = document.createElement("div");
		buttonWrapper.setAttribute("class", "button-wrapper");	
		wrapper.appendChild( buttonWrapper );
		
		// leave button		
		var leaveButton = document.createElement("input");
		leaveButton.setAttribute("id", "game-practice-leave");
		leaveButton.setAttribute("type", "button");	
		leaveButton.setAttribute("class", "btn btn-leave");	
		leaveButton.setAttribute("value", "Leave");
		leaveButton.addEventListener( me.device.touch ? "touchstart" : "mousedown", this._onLeave.bind(this), false);		
		buttonWrapper.appendChild( leaveButton );	
				
		// check button		
		var checkButton = document.createElement("input");
		checkButton.setAttribute("id", "game-practice-check");
		checkButton.setAttribute("type", "button");	
		checkButton.setAttribute("class", "btn btn-check show");	
		checkButton.setAttribute("value", "Check");
		checkButton.addEventListener( me.device.touch ? "touchstart" : "mousedown", this._onCheck.bind(this), false);		
		buttonWrapper.appendChild( checkButton );
		
		// next button		
		var nextButton = document.createElement("input");
		nextButton.setAttribute("id", "game-practice-next");
		nextButton.setAttribute("type", "button");	
		nextButton.setAttribute("class", "btn btn-next hide");	
		nextButton.setAttribute("value", "Next");
		nextButton.addEventListener( me.device.touch ? "touchstart" : "mousedown", this._onNext.bind(this), false);		
		buttonWrapper.appendChild( nextButton );				
		
		container.appendChild( wrapper );
	},
	
	/**
	 * Evaluate a question 
     * @override
 	 * @inheritDoc
	 */
	evaluateTask: function( container, task ) {
		console.log("checke");
		//TODO
		return false;
	},	
	
	/**
	 * on check or next handler
	 * @param {Object} e - event
	 */
	_onCheck:function(e){			
		this._toggleButtons();
		this.checkTask();
	},
	
	/**
	 * on leave handler
 	 * @param {Object} e - event
	 */
	_onLeave:function(e){
		me.state.resume();		
		this.hide();		
	},
	
	/**
	 * on next handler 
 	 * @param {Object} e - event
	 */
	_onNext:function(e){
		this._toggleButtons();		
	},
	
	/**
	 * Toggle buttons
	 */
	_toggleButtons:function(){
		var checkButton = document.getElementById("game-practice-check");
		var nextButton = document.getElementById("game-practice-next");
		
		if( checkButton.classList.contains('show') ){			
			checkButton.classList.remove('show');
			checkButton.classList.add('hide');
			
			nextButton.classList.remove('hide');
			nextButton.classList.add('show');
						
		}else{
			checkButton.classList.remove('hide');
			checkButton.classList.add('show');
			
			nextButton.classList.remove('show');
			nextButton.classList.add('hide');							
		} 				
	},
});

