## Gate
A sample code to describes how to go to the next part of a world in RPG like game.

**MelonJS Version**: >= 0.9.9

**Status**: finished

###Description
- In a TMX map are Object layer "doors" with a pairs of door object: "doorOut" with property "to" and "doorIn" with property "from".
- Entity game.DoorOutEntity extends me.LevelEntity.
- When hero entity is in collisio with game.DoorOutEntity the property "to" determines which level name the hero is move.
- The game.DoorInEntity determines at which point on the new level is the hero appears when the hero comes from a place with name in property "from".


