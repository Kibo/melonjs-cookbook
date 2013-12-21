# Quiz
The extension controls a quiz. Useful for entering and solving tasks and riddles in RPG like games.

**MelonJS Version**: >= 0.9.9

**Status**: under construction

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
	{ type:"question", text:"<h3>Answer a question</h3><label>Write the name of the most powerful wizard:</label>", answers:["Merlin", "Gandalf"] },
	{ type:"question", text:"<h3>Answer a question</h3><label>Write the name of the forgotten kingdom.</label>", answers:["Middle-earth", "Middleearth", "Middle earth"] },
	{ type:"question", text:"<h3>Answer a question</h3><label>Write the name of a magic sword.</label>", answers:["Kal"] }
]
```

Create new quiz
```
witch.quiz = new game.Quiz( data );
```

Would you like to implement a custom task type? Implements two methods:
```
game.MyCustomType = Object.extend({

	/**
	 * Draw a task	
	 * @param {Object} quiz	
	 */
	draw: function( quiz ) {
		// TODO - implement it
	},
	
	/**
	 * Evaluate a question
	 * @param {game.Quiz} quiz
	 * @return {boolean} isCorrect 
	 */
	evaluate: function( quiz ) {
		// TODO - implement it
	}
});
```

For more detail see [source](https://github.com/Kibo/melonjs-cookbook/blob/master/cookbook/quiz/source/quiz.js) or [demo](https://github.com/Kibo/melonjs-cookbook/tree/master/cookbook/quiz/demo)

###Advantage:
- no depending on the third party library
- documented code
- tested code

