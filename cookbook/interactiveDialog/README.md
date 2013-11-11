# Interactive dialog
The extension adds an ability to control interactive conversation between a characters in a game.

**MelonJS Version**: independent

**Status**: finished

###Type of dialogues:
- Linear
- Linear interrupted
- Linear dialogue with questions
- Branched dialogue with different results
- Fake branched dialogue with the same end
- Procedural dialogue
- Combined dialogue

###Work procedure:
1. Use [Dialogues builder tool](http://kibo.github.com/dialoguesBuilder/) to create conversation tree.
2. Export a conversation as JSON ([example](https://github.com/Kibo/melonjs-cookbook/blob/master/cookbook/interactiveDialog/demo/data/dialog/dialogues.js))
3. Create new class of game.Data and set a data for conversation

###Usage

Get resource to your index.html 
```
<script type="text/javascript" src="data/dialog/dialog.js"></script>
```

Create a new conversation.
```
var dialog = new game.Dialog( DATA );
```

Display dialog when meeting characters.
```
dialog.show();
```

Get the current sentence
```
dialog.get();
```

Get an actor
```
dialog.getActor( id );
```

Find a sentence
```
dialog.find( id );
```

For more detail see [demo](https://github.com/Kibo/melonjs-cookbook/tree/master/cookbook/interactiveDialog/demo) or [source](https://github.com/Kibo/melonjs-cookbook/blob/master/cookbook/interactiveDialog/source/dialog.js).

###Sentence data structure
For more information see Reference.

**Sentence as data**
```
{
	"id": 41,
	"parent": 40,
	"isChoice": false,
	"actor": 20,
	"conversant": 10,
	"menuText": "",
	"dialogueText": "Nice to see you.",
	"codeBefore": "",
	"conditionsString": "",	
	"codeAfter": "",
	"outgoingLinks": [
		42
	]
}
```

**Order of execution code** <br />
if conditionsString == true<br/>
	do codeBefore<br/>
	do show<br/>
	do codeAfter

####Dialog container
Use CSS to design your dialog UI.

**Sentence in DOM**
```
<div id="game-dialog">
	<div class="dialog hero">
		<p data-sentence-id="40">Nice to see you.</p>
	</div>
</div>
```

**Choice in DOM**
```
<div id="game-dialog">
	<div class="dialog choice">
		<p data-sentence-id="50">Ask about cave.</p>
		<p data-sentence-id="60">Leave</p>
	</div>
</div>
```

###Advantage:
- no depending on the third party library
- documented code
- tested code

### Reference
- [Interactive dialogue for videogame - part 1](http://tomasjurman.blogspot.cz/2013/02/interactive-dialogue-for-html5-game.html)
- [Interactive dialogue for videogame - part 2](http://tomasjurman.blogspot.cz/2013/03/interactive-dialogue-for-html5-game.html)
- [Dialogues builder tool](http://kibo.github.com/dialoguesBuilder/)

