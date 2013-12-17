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
			"dialogueText": "Hello nice girl.",
			"conditionsString": "!this._sentence.onlyOnce",
			"codeBefore": "",
			"codeAfter": "this._sentence.onlyOnce = true;",
			"outgoingLinks": [ 20 ]
		}, {
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
			"outgoingLinks": [ 30 ]
		}, {
			"id": 30,
			"parent": 20,
			"isChoice": true,
			"conditionsString": "",
			"codeBefore": "",
			"codeAfter": "",
			"outgoingLinks": [ 40, 50 ]
		}, {
			"id": 40,
			"parent": 30,
			"isChoice": false,
			"actor": 10,
			"conversant": 20,
			"menuText": "Invite to party",
			"dialogueText": "Can I invite you to a party?",
			"conditionsString": "",
			"codeBefore": "if( this._data.numberOfInvitation >= 2 ) this._sentence.outgoingLinks = [70];",
			"codeAfter": "this._data.numberOfInvitation++;",
			"outgoingLinks": [ 60 ]
		}, {
			"id": 50,
			"parent": 30,
			"isChoice": false,
			"actor": 10,
			"conversant": 20,
			"menuText": "Leave",
			"dialogueText": "Good by.",
			"conditionsString": "",
			"codeBefore": "",
			"codeAfter": "",
			"outgoingLinks": []
		}, {
			"id": 60,
			"parent": 40,
			"isChoice": false,
			"actor": 20,
			"conversant": 10,
			"menuText": "",
			"dialogueText": "Sorry, I am in a hurry.",
			"conditionsString": "",
			"codeBefore": "",
			"codeAfter": "",
			"outgoingLinks": []
		}, {
			"id": 70,
			"parent": 60,
			"isChoice": false,
			"actor": 20,
			"conversant": 10,
			"menuText": "",
			"dialogueText": "Thank you for the invitation. I'm sure I will.",
			"conditionsString": "",
			"codeBefore": "",
			"codeAfter": "",
			"outgoingLinks": [ ]
		} ],
		
		numberOfInvitation:0	
	}
};
