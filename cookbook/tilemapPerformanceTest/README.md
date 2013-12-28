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

Screen Size	|	Layering								|	Fps	|	Profile 1 minute
------------|-------------------------------------------|-------|---------------------
800x600		|	TileLayer (me.sys.preRender = false)	|	30	|	90% me.TMXLayer.draw()
800x600		|	TileLayer (me.sys.preRender = true)		|	55	|	5.5% me.TMXLayer.draw()
800x600		|	ImageLayer (me.sys.preRender = false)	|	59	|	5% me.ImageLayer.draw()
800x600		|	ImageLayer (me.sys.preRender = true)	|	58	|	6% me.ImageLayer.draw()

- OS GNU Linux
- Firefox 26
- no GPU

See also [this topic](https://groups.google.com/forum/#!topic/melonjs/fHLhNjVL6zc) in MelonsJS forum.

For more detail see [tileLayer demo](https://github.com/Kibo/melonjs-cookbook/tree/master/cookbook/tilemapPerformanceTest/tileLayer), [imageLayer demo](https://github.com/Kibo/melonjs-cookbook/tree/master/cookbook/tilemapPerformanceTest/imageLayer)
