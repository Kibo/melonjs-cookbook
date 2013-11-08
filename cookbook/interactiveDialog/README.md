# Interactive dialog
This plugin controls interactive conversation between a characters in a game. For building data source structure you can use [Dialogues builder tool](http://kibo.github.com/dialoguesBuilder/).

**MelonJS Version**: 0.9.9

**Status**: under construction

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
3. Register this plugin to [MelonJS](http://melonjs.org/).

###Usage

[Get resource](https://github.com/Kibo/melonjs-cookbook/blob/master/cookbook/interactiveDialog/demo/index.html#L23) in your index.html 
```
<script type="text/javascript" src="data/dialog/dialogues.js"></script>
```

[Register](https://github.com/Kibo/melonjs-cookbook/blob/master/cookbook/interactiveDialog/demo/js/game.js#L36) this plugin to MelonJS
```
me.plugin.register(dialog, "dialog");
```

Create a new conversation. ([see demo](https://github.com/Kibo/melonjs-cookbook/blob/master/cookbook/interactiveDialog/demo/js/entities/entities.js#L210))
```
var dialog = me.plugin.dialog.newInstance( DATA );
```

[Show dialog](https://github.com/Kibo/melonjs-cookbook/blob/master/cookbook/interactiveDialog/demo/js/entities/entities.js#L145) Display dialog when meeting characters.
```
dialog.show();
```

Get the current sentence
```
dialog.get();
```

Get a actor
```
dialog.getActor( id );
```

Find a sentence
```
dialog.find( id );
```

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

**Order of execution of code**

1. codeBefore
2. conditionsString
3. codeAfter


####Dialog container
Use CSS to design your dialog UI.

**Sentence in DOM**
```
<div id="me-dialog">
	<div class="dialog hero">
		<p data-sentence-id="40">Nice to see you.</p>
	</div>
</div>
```

**Choice in DOM**
```
<div id="me-dialog">
	<div class="dialog choice">
		<p data-sentence-id="50">Ask about cave.</p>
		<p data-sentence-id="60">Leave</p>
	</div>
</div>
```

### Plugin source
- [plugin](https://github.com/Kibo/melonjs-cookbook/blob/master/cookbook/interactiveDialog/source/dialog.js)

###Advantage:
- no depending on the third party library
- documented code
- tested code

### Reference
- [Interactive dialogue for videogame - part 1](http://tomasjurman.blogspot.cz/2013/02/interactive-dialogue-for-html5-game.html)
- [Interactive dialogue for videogame - part 2](http://tomasjurman.blogspot.cz/2013/03/interactive-dialogue-for-html5-game.html)
- [Dialogues builder tool](http://kibo.github.com/dialoguesBuilder/)

