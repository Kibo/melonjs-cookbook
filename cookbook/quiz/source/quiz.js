window.game = window.game || {};
/**
 * A quiz extension
 *
 * The extension controls a quiz. Useful for entering and solving tasks and riddles in RPG like games.
 *
 * @author Tomas Jurman (tomasjurman@gmail.com)
 * @license Dual licensed under the MIT or GPL licenses.
 *
 * @constructor
 * @abstract
 * @example
 * myEntity.quiz = new game.Quiz( data );
 */
game.Quiz = Object.extend( {

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
	 * @param {?number} count - count of task
	 */
	init: function( tasks, count ) {
		this._tasks = tasks;
		this._countOfTasks = count || this._tasks.length; 
	},

	/**
	 * Show the screen
	 * Set the DOM container CSS-class named 'show'
	 */
	show: function( ) {						
		this._getDOMContainer().classList.remove('hide');
		this._getDOMContainer().classList.add('show');
	},

	/**
	 * Hide the screen
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
	 * Is the quiz finished
	 * @return {boolean}
	 */
	isFinished: function( ) {
		return this._tasks.length > 0 && this._countOfTasks == ( this._taskIndex + 1 ) && this.isTaskChecked();
	},

	/*
	 * Has next task
	 * @return {boolean}
	 */
	hasNextTask: function( ) {
		var curentTaskNumber = this._taskIndex + 1; 
		return curentTaskNumber < this._tasks.length && curentTaskNumber < this._countOfTasks;
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
	 * Draw a task
	 */
	drawTask: function( ) {
		if( this.isTaskChecked() && this.hasNextTask() ){
			this.nextTask();	
		}

		// clean container
		this._getDOMContainer().innerHTML = "";
		
		var taskObj;		
		switch( this._tasks[ this._taskIndex ].type ){
			case "question":
				taskObj = new game.QuestionTask( this );
				taskObj.draw();
				break;
			
			case "choice":
				// TODO
				break;
			
			default:
				throw new Error("Unknown task type: " + this._tasks[ this._taskIndex ].type );
		}
				
		var buttonWrapper = document.createElement("div");
		buttonWrapper.setAttribute("class", "button-wrapper");	
		
		// leave button		
		var leaveButton = document.createElement("input");
		leaveButton.setAttribute("id", "game-quiz-leave");
		leaveButton.setAttribute("type", "button");	
		leaveButton.setAttribute("class", "btn btn-leave");	
		leaveButton.setAttribute("value", "Leave");
		leaveButton.addEventListener( me.device.touch ? "touchstart" : "mousedown", taskObj._onLeave.bind( taskObj ), false);		
		buttonWrapper.appendChild( leaveButton );	

		// check button		
		var checkButton = document.createElement("input");
		checkButton.setAttribute("id", "game-quiz-check");
		checkButton.setAttribute("type", "button");	
		checkButton.setAttribute("class", "btn btn-check show");	
		checkButton.setAttribute("value", "Check");
		checkButton.addEventListener( me.device.touch ? "touchstart" : "mousedown", taskObj._onCheck.bind( taskObj ), false);		
		buttonWrapper.appendChild( checkButton );

		// next button		
		var nextButton = document.createElement("input");
		nextButton.setAttribute("id", "game-quiz-next");
		nextButton.setAttribute("type", "button");	
		nextButton.setAttribute("class", "btn btn-next hide");	
		nextButton.setAttribute("value", "Next");
		nextButton.addEventListener( me.device.touch ? "touchstart" : "mousedown", taskObj._onNext.bind( taskObj ), false);		
		buttonWrapper.appendChild( nextButton );
		
		this._getDOMContainer().appendChild( buttonWrapper );
	},
	
	/**
	 * Draw answers
	 */
	drawAnswers:function(){		
		var answersWrapper = document.createElement("div");	
		answersWrapper.setAttribute("class", "answer-wrapper");	
		
		var htmlAnswers = '<label>The correct answer:</label>';

		htmlAnswers += '<ul>';
		for( var idx = 0; idx < this._tasks[ this._taskIndex ].answers.length; idx++ ){
			htmlAnswers += '<li>' + this._tasks[ this._taskIndex ].answers[idx] + '</li>' ;	
		}		
		htmlAnswers += '</ul>';

		answersWrapper.innerHTML = htmlAnswers ;
		
		this._getDOMContainer().appendChild( answersWrapper );
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
		var container = document.getElementById( game.Quiz.DOM_CONTAINER_ID );

		if( !container ) {		
			container = document.createElement( "div" );
			container.setAttribute( "id", game.Quiz.DOM_CONTAINER_ID );
			document.getElementsByTagName("body")[ 0 ].appendChild( container );
		}

		return container;
	},
	
	/**
	 * Toggle buttons
	 */
	_toggleButtons:function(){
		var checkButton = document.getElementById("game-quiz-check");
		var nextButton = document.getElementById("game-quiz-next");

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

} );

/**
 * id for DOM container
 * @constant
 * @name DOM_CONTAINER_ID
 * @type {string}
 */
game.Quiz.DOM_CONTAINER_ID = "game-quiz";

/* ###################################################### */

/**
 * Question quiz
 */
game.QuestionTask = Object.extend({

	/**
	 * @constructor
	 * @param {Object} quiz
	 */
	init: function( quiz ) {
		this._quiz = quiz;
		this._container = this._quiz._getDOMContainer();		
		this._task = this._quiz._tasks[ this._quiz._taskIndex ];
	},

	/**
	 * Draw a question	
	 */
	draw: function() {						
		var wrapper = document.createElement("div");

		// Instruction
		wrapper.innerHTML = this._task.text;

		// Input			
		var textField = document.createElement("input");
		textField.setAttribute("id", "game-quiz-answer");
		textField.setAttribute("type", "text");		
		wrapper.appendChild( textField );
						
		this._container.appendChild( wrapper );
	},

	/**
	 * Evaluate a question
	 * @return {boolean} isCorrect 
	 */
	evaluate: function() {			
		var answerElement = document.getElementById("game-quiz-answer");
		var answerValue = answerElement.value.trim();

		for( var idx = 0; idx < this._task.answers.length; idx++ ){
			if( this._task.answers[idx] == answerValue ){
				answerElement.classList.add('isCorrect');
				return true;
			}
		}

		answerElement.classList.add('isMistake');									
		return false;
	},	

	/**
	 * on check handler	
	 */
	_onCheck:function(){					
		this._task.isChecked = true;
		
		if( !this.evaluate() ){
			this._task.hasError = false;			
			this._quiz.drawAnswers();
		}
				
		this._quiz._toggleButtons();
		if( !this._quiz.hasNextTask() ){
			var nextButton = document.getElementById("game-quiz-next");
			nextButton.value="Finish";	
		}
	},

	/**
	 * on leave handler 	
	 */
	_onLeave:function(){
		me.state.resume();		
		this._quiz.hide();		
	},

	/**
	 * on next handler 
	 */
	_onNext:function(){
		this._quiz._toggleButtons();

		if( this._quiz.hasNextTask()){
			this._quiz.nextTask();
		}else{			
			this._onLeave();	
		}

		this._quiz.drawTask();	
	},
});

