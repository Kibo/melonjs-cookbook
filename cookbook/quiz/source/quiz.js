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
	 * Shows answer after evaluating
	 */
	 showAnswer:true,

	/**
	 * @param {Array<Object>} tasks
	 * @param {?number} count - count of task
	 * @param {?Function} onLeave - callback when quiz is left
	 */
	init: function( tasks, count, onLeave ) {
		if(!tasks){
			throw Error("game.Quiz#init tasks is: " + tasks);
		}
		this._tasks = tasks;
		this._countOfTasks = (count && count <= this._tasks.length) ? count : this._tasks.length;
		
		if( typeof onLeave == "function" ) {
			this.onLeaveCallback = onLeave;
		}	 
	},

	/**
	 * Show the screen
	 * Set the DOM container CSS-class named 'show'
	 */
	show: function( ) {						
		this.getDOMContainer().classList.remove('hide');
		this.getDOMContainer().classList.add('show');
	},

	/**
	 * Hide the screen
	 * Set the DOM container CSS-class named 'hide'
	 */
	hide: function( ) {			
		this.getDOMContainer().classList.remove('show');
		this.getDOMContainer().classList.add('hide');
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
		
		this._taskIndex = 0;
		this._errors = [];
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
		return this._countOfTasks === ( this._taskIndex + 1 ) && this.isTaskChecked();
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
		this.getDOMContainer().innerHTML = "";
		
		// create a task object					
		this._taskObj = new window.game[ this._tasks[ this._taskIndex ].type ];
		if( !this._taskObj ){
			throw new Error("Unknown task type: " + this._tasks[ this._taskIndex ].type );	
		}
		this._taskObj.draw( this );
				
		var buttonWrapper = document.createElement("div");
		buttonWrapper.setAttribute("class", game.Quiz.DOM_BUTTONS_CLASS);	
		
		// leave button		
		var leaveButton = document.createElement("input");
		leaveButton.setAttribute("id", game.Quiz.DOM_LEAVE_BUTTON_ID);
		leaveButton.setAttribute("type", "button");	
		leaveButton.setAttribute("class", "btn btn-leave");	
		leaveButton.setAttribute("value", "Leave");
		leaveButton.addEventListener( me.device.touch ? "touchstart" : "mousedown", this._onLeave.bind( this ), false);		
		buttonWrapper.appendChild( leaveButton );	

		// check button		
		var checkButton = document.createElement("input");
		checkButton.setAttribute("id", game.Quiz.DOM_CHECK_BUTTON_ID);
		checkButton.setAttribute("type", "button");	
		checkButton.setAttribute("class", "btn btn-check show");	
		checkButton.setAttribute("value", "Check");
		checkButton.addEventListener( me.device.touch ? "touchstart" : "mousedown", this._onCheck.bind( this ), false);		
		buttonWrapper.appendChild( checkButton );

		// next button		
		var nextButton = document.createElement("input");
		nextButton.setAttribute("id", game.Quiz.DOM_NEXT_BUTTON_ID);
		nextButton.setAttribute("type", "button");	
		nextButton.setAttribute("class", "btn btn-next hide");	
		nextButton.setAttribute("value", "Next");
		nextButton.addEventListener( me.device.touch ? "touchstart" : "mousedown", this._onNext.bind( this ), false);		
		buttonWrapper.appendChild( nextButton );
		
		this.getDOMContainer().appendChild( buttonWrapper );
	},
	
	/**
	 * Draw answers
	 */
	drawAnswers:function(){		
		var answersWrapper = document.createElement("div");	
		answersWrapper.setAttribute("class", game.Quiz.DOM_ANSWERS_CLASS);	
		
		var htmlAnswers = '<label>The correct answer:</label>';

		htmlAnswers += '<ul>';
		for( var idx = 0; idx < this._tasks[ this._taskIndex ].answers.length; idx++ ){
			htmlAnswers += '<li>' + this._tasks[ this._taskIndex ].answers[idx] + '</li>' ;	
		}		
		htmlAnswers += '</ul>';

		answersWrapper.innerHTML = htmlAnswers ;
		
		this.getDOMContainer().appendChild( answersWrapper );
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
	 */
	getDOMContainer: function( ) {
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
		var checkButton = document.getElementById( game.Quiz.DOM_CHECK_BUTTON_ID );
		var nextButton = document.getElementById( game.Quiz.DOM_NEXT_BUTTON_ID );

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
	
	/**
	 * on check handler	
	 */
	_onCheck:function(){					
		this._tasks[ this._taskIndex ].isChecked = true;
		
		if( !this._taskObj.evaluate( this ) ){
			this._tasks[ this._taskIndex ].hasError = false;	
			this._errors.push( this._tasks[ this._taskIndex ] );		
			
			if(this.showAnswer){
				this.drawAnswers();
			}
		}
				
		this._toggleButtons();
		if( !this.hasNextTask() ){
			var nextButton = document.getElementById(game.Quiz.DOM_NEXT_BUTTON_ID);
			nextButton.value="Finish";	
		}
	},

	/**
	 * on leave handler 	
	 */
	_onLeave:function(){
		me.state.resume();		
		this.hide();	
		
		/**
		 * user defined callback
		 * @see constructor
		 */
		this.onLeaveCallback && this.onLeaveCallback(); 	
	},

	/**
	 * on next handler 
	 */
	_onNext:function(){
		this._toggleButtons();

		if( this.hasNextTask()){
			this.nextTask();
		}else{			
			this._onLeave();	
		}

		this.drawTask();	
	},

} );

/**
 * id for DOM container
 * @constant
 * @name DOM_CONTAINER_ID
 * @type {string}
 */
game.Quiz.DOM_CONTAINER_ID = "quiz";

/**
 * id for DOM check button
 * @constant
 * @name DOM_CHECK_BUTTON_ID
 * @type {string}
 */
game.Quiz.DOM_CHECK_BUTTON_ID = "quiz-check-btn";

/**
 * id for DOM leave button
 * @constant
 * @name DOM_LEAVE_BUTTON_ID
 * @type {string}
 */
game.Quiz.DOM_LEAVE_BUTTON_ID = "quiz-leave-btn";

/**
 * id for DOM next button
 * @constant
 * @name DOM_NEXT_BUTTON_ID
 * @type {string}
 */
game.Quiz.DOM_NEXT_BUTTON_ID = "quiz-next-btn";

/**
 * class for content
 * @constant
 * @name DOM_CONTENT_CLASS
 * @type {string}
 */
game.Quiz.DOM_CONTENT_CLASS = "quiz-content";

/**
 * class for answers
 * @constant
 * @name DOM_ANSTWERS_CLASS
 * @type {string}
 */
game.Quiz.DOM_ANSWERS_CLASS = "quiz-answers";

/**
 * class for buttons
 * @constant
 * @name DOM_BUTTONS_CLASS
 * @type {string}
 */
game.Quiz.DOM_BUTTONS_CLASS = "quiz-buttons";

/* ###################################################### */

/**
 * Question
 */
game.Question = Object.extend({
	
	/**
	 * Draw a task	
	 * @param {game.Quiz} quiz	
	 */
	draw: function( quiz ) {						
		var wrapper = document.createElement("div");
		wrapper.setAttribute("class", game.Quiz.DOM_CONTENT_CLASS + " quiz-question");

		// Instruction
		wrapper.innerHTML = quiz._tasks[ quiz._taskIndex ].text;

		// Input			
		var textField = document.createElement("input");
		textField.setAttribute("id", game.Question.DOM_ANSWER_INPUT_ID );
		textField.setAttribute("type", "text");		
		wrapper.appendChild( textField );
						
		quiz.getDOMContainer().appendChild( wrapper );
	},

	/**
	 * Evaluate a question
	 * @param {game.Quiz} quiz
	 * @return {boolean} isCorrect 
	 */
	evaluate: function( quiz ) {			
		var answerElement = document.getElementById( game.Question.DOM_ANSWER_INPUT_ID );
		var answerValue = answerElement.value.trim();

		for( var idx = 0; idx < quiz._tasks[ quiz._taskIndex ].answers.length; idx++ ){
			if( quiz._tasks[ quiz._taskIndex ].answers[idx] == answerValue ){
				answerElement.classList.add('isCorrect');
				return true;
			}
		}

		answerElement.classList.add('isMistake');									
		return false;
	},	
});

/**
 * id for DOM input for answer 
 * @constant
 * @name DOM_ANSWER_INPUT_ID
 * @type {string}
 */
game.Question.DOM_ANSWER_INPUT_ID = "quiz-answer";

/* ###################################################### */

/**
 * Choice
 */
game.Choice = Object.extend({
	
	/**
	 * Draw a task	
	 * @param {Object} quiz	
	 */
	draw: function( quiz ) {						
		var wrapper = document.createElement("div");
		wrapper.setAttribute("class", game.Quiz.DOM_CONTENT_CLASS + " quiz-choice");

		// Instruction
		wrapper.innerHTML = quiz._tasks[ quiz._taskIndex ].text;
		
		var list = document.createElement("ul");
		for(var idx = 0; idx < quiz._tasks[ quiz._taskIndex ].choices.length; idx++){			
			var item = document.createElement("li");
			var label = document.createElement("label");						
				var radio = document.createElement("input");
				radio.setAttribute("type", "radio");	
				radio.setAttribute("name", game.Choice.DOM_ANSWER_INPUT_CLASS);	
				radio.setAttribute("class", game.Choice.DOM_ANSWER_INPUT_CLASS);
				radio.setAttribute("value", quiz._tasks[ quiz._taskIndex ].choices[idx]);	
			label.appendChild( radio );
			label.appendChild( document.createTextNode( quiz._tasks[ quiz._taskIndex ].choices[idx] ) );
			item.appendChild( label );
			list.appendChild( item );		
		}
		
		wrapper.appendChild( list );							
		quiz.getDOMContainer().appendChild( wrapper );
	},	
	
	/**
	 * Evaluate a task
	 * @param {game.Quiz} quiz
	 * @return {boolean} isCorrect 
	 */
	evaluate: function( quiz ) {
		
		var radios = document.querySelectorAll("." + game.Choice.DOM_ANSWER_INPUT_CLASS);
		for(var idx = 0; idx < radios.length; idx++ ){
			if(radios[idx].type === 'radio' && radios[idx].checked){
											
				if( quiz._tasks[ quiz._taskIndex ].answers.indexOf( radios[idx].value )  == -1 ){
					radios[idx].parentNode.classList.add('isMistake');
					return false;								
				}else{
					radios[idx].parentNode.classList.add('isCorrect');
					return true;
				}										
			}			
		}
													
		return false;
	}
});

/**
 * Class for answer input 
 * @constant
 * @name DOM_ANSWER_INPUT_CLASS
 * @type {string}
 */
game.Choice.DOM_ANSWER_INPUT_CLASS = "quiz-answer";
