var DIALOGUES = {
	girl: {		
		"actors": [ {
			"id": 10,
			"name": "hero"
		}, {
			"id": 20,
			"name": "girl"
		} ],
		"dialogues": [ {
			"id": 10,
			"parent": null,
			"isChoice": false,
			"actor": 10,
			"conversant": 20,
			"menuText": "",
			"dialogueText": "Hello boy",
			"conditionsString": "!this._sentence.onlyOnce",
            "codeBefore": "",
            "codeAfter": "this._sentence.onlyOnce = true;",
			"outgoingLinks": [20]
		},
		
		{
			"id": 20,
			"parent": 10,
			"isChoice": false,
			"actor": 20,
			"conversant": 10,
			"menuText": "",
			"dialogueText": "Nice to see you.",
			"conditionsString": "!this._sentence.onlyOnce",
            "codeBefore": "",
            "codeAfter": "this._sentence.onlyOnce = true;",
			"outgoingLinks": [30]
		},
		
		{
			"id": 30,
			"parent": 20,
			"isChoice": false,
			"actor": 10,
			"conversant": 20,
			"menuText": "",
			"dialogueText": "Have are you?",
			"conditionsString": "",
			"codeBefore": "",
			"codeAfter": "",
			"outgoingLinks": [40]
		},
		
		{
			"id": 40,
			"parent": 30,
			"isChoice": false,
			"actor": 20,
			"conversant": 10,
			"menuText": "",
			"dialogueText": "And you?",
			"conditionsString": "",
			"codeBefore": "",
			"codeAfter": "",
			"outgoingLinks": []
		}
								
		],
	}
};
