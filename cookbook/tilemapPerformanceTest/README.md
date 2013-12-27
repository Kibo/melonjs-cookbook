# Tilemap performace test
me.TMXLayer & me.ImageLayer

**MelonJS Version**: 0.9.10

**Status**: finished

TileMap size: 200x200<br>
Tile size: 32x32<br>
Ortogonal<br>
Count of layers: 2
- bg - no transparency
- fg - with transparency

Layering								|	Fps	|	Profile 1 minute
----------------------------------------|-------|---------------------
TileLayer (me.sys.preRender = false)	|	30	|	90% me.TMXLayer.draw()
TileLayer (me.sys.preRender = true)		|	55	|	5.5% me.TMXLayer.draw()
ImageLayer (me.sys.preRender = false)	|	59	|	5% me.ImageLayer.draw()
ImageLayer (me.sys.preRender = true)	|	58	|	6% me.ImageLayer.draw()

- OS GNU Linux
- Firefox 26
- no GPU

For more detail see [tileLayer demo](https://github.com/Kibo/melonjs-cookbook/tree/master/cookbook/tilemapPerformanceTest/tileLayer), [imageLayer demo](https://github.com/Kibo/melonjs-cookbook/tree/master/cookbook/tilemapPerformanceTest/imageLayer)
