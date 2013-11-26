## Bag plugin
The plugin lets store artifacts in a backpack, 
return an artifact from backpack into the game and 
use artifact from the bag using **Drag and Drop**

**MelonJS Version**: 0.9.9

**Status**: finished

###How it work
1. The Hero takes an item.
2. The item is moved into a backpack.
3. The player use drag and drop to pull items from the back to the game or interacts an item with other entities.

### Screen from the demo
![Screen](https://raw.github.com/Kibo/melonjs-cookbook/master/cookbook/dragAndDrop/demo/data/img/bag_screen.png)

###Usage
Get resource to your index.html 
```
<script type="text/javascript" src="plugins/bag.js"></script>
```

Create a new bag.
```
//the bag on bottom side with padding 10 px
me.plugin.bag.create("bottom", 10);
```

Add an item to the bag
```
var sword = new me.CollectableEntity({...})
game.bag.add( sword );
```

Remove an item from the bag
```
game.bag.remove( sword );
```

Get the bounds of bag
```
game.bag.getBounds();
```

For more detail see [demo](https://github.com/Kibo/melonjs-cookbook/tree/756471e3a122f2adf88d92fc028938bc01b4aa1d/cookbook/dragAndDrop/demo) or [source](https://github.com/Kibo/melonjs-cookbook/blob/756471e3a122f2adf88d92fc028938bc01b4aa1d/cookbook/dragAndDrop/source/bag.js).

###Advantage:
- no depending on the third party library
- documented code
- tested code


