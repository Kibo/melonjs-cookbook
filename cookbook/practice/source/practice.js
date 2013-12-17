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
 * @example
 * myEntity.practice = new game.Practice( data );
 */
game.Practice = Object.extend({
	
	/**
	 * All tasks
	 * @private
	 */
	_tasks:[],
	
	/**
	 * Contains all errors object
	 * @private
	 */
	_errors:[],
	
	/**
	 * Count of tasks to practice
	 * @private
	 */
	_countOfTasks:1,
	
	/**
	 * Current data index
	 * @private
	 */
	_taskIndex:0,
	
	/**
	 * @param {Array<Object>} tasks
	 */
	init:function( tasks ){
		this._tasks = tasks; 
	},
	
	show:function(){},
    hide:function(){},
    
    /**
     * Shuffle tasks
     */
    shuffle:function(){
    	this._tasks.sort(function() { return 0.5 - Math.random(); });		
    },
    
    hasNext:function(){},
    getNext:function(){},
    
    /**
     * Set count of tasks for practice
     * @param{number} count
     */
    setCountOfTask:function(count){
    	this._countOfTasks = count;
    },
    
    /**
     * Returns all tasks to its original state
     */
    reset:function(){
    	for( var idx = 0; idx < this._tasks.length; idx++){
    		delete this._tasks[idx].hasError;																				
			delete this._tasks[idx].isChecked;
    	}    	
    },
    
    /**
     * Has errors
     * @return {boolean}
     */
	hasErrors:function(){
		return this._errors.length != 0;
	},	
	
	/**
	 * Get errors
	 * @return {Array<Object>}
	 */
	getErrors:function(){
		return this._errors;
	},
	
	/**
	 * Is finished
	 * @return {boolean}
	 */
	isFinished:function(){
		return this._tasks.length > 0 
		&& this._countOfTasks == ( this._taskIndex + 1 ) 
		&& this._tasks[ this._taskIndex ].isTaskChecked();		
	},
		
	isTaskChecked:function(){},
	
	/**
	 * Has task error
	 * @return {boolean}
	 */
	hasTaskError:function(){			
		return 'hasError' in this._tasks[ this._taskIndex ] 
		&& 'isChecked' in this._tasks[ this._taskIndex ] 
		&& this._tasks[ this._taskIndex ].isChecked		 
		&& this._tasks[ this._taskIndex ].hasError;
	},	
});
	
/**
 * id for DOM container
 * @constant
 * @name DOM_CONTAINER_ID
 * @type {string}
 */
game.Practice.DOM_CONTAINER_ID = "game-task";





