## Patrol
A sample code to describes how to walk entity after predetermined points.

**MelonJS Version**: 0.9.9

**Status**: finished

###Usage

Add a point which a patrol has to go through
```
this.patrol_addPoint( new me.Vector2d(100, 100));
this.patrol_addPoint( new me.Vector2d(200, 100));
this.patrol_addPoint( new me.Vector2d(200, 200));
this.patrol_addPoint( new me.Vector2d(100, 200));
```

Set direction and looping
```
this.patrol_setInfinite(true) 
this.patrol_setReverse(true)
```

Start the patrol
```
this.patrol_walk();
```

For more detail see demo.
