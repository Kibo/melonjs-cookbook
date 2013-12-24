# Quiz
The extension controls a quiz. Useful for entering and solving tasks and riddles in RPG like games.

**MelonJS Version**: >= 0.9.9

**Status**: finished

###Type of task:
- question
- choice
- multichoice	(not implelemented yet)
- cloze			(not implelemented yet)

###Usage
Get resource to your index.html 
```
<script type="text/javascript" src="plugins/quiz.js"></script>
```

Create a data for tasks
```
[
	{ type:"Question", text:"<h3>Answer a question</h3><label>Write the name of the most powerful wizard:</label>", answers:["Merlin", "Gandalf"] },	
	{ type:"Choice", text:"<h3>Answer a question</h3><label>Choose the name of the forgotten kingdom.</label>", choices:["Middle-earth", "Nubia", "The Czech Republic"], answers:["Nubia"] },	
	{ type:"Question", text:"<h3>Answer a question</h3><label>Write the name of a magic sword.</label>", answers:["Kal"] }
]
```

Create new quiz
```
witch.quiz = new game.Quiz( data );
```

Would you like to implement a custom task type?
```
game.MyCustomType = Object.extend({

	/**
	 * Draw a task	
	 * @param {Object} quiz	
	 */
	draw: function( quiz ) {
		// TODO - implement me
	},
	
	/**
	 * Evaluate a task
	 * @param {game.Quiz} quiz
	 * @return {boolean} isCorrect 
	 */
	evaluate: function( quiz ) {
		// TODO - implement me
	}
});
```

For more detail see [source](https://github.com/Kibo/melonjs-cookbook/blob/master/cookbook/quiz/source/quiz.js) or [demo](https://github.com/Kibo/melonjs-cookbook/tree/master/cookbook/quiz/demo)

###Advantage:
- no depending on the third party library
- documented code
- tested code

