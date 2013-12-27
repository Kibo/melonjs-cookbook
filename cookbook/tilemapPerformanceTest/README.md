# Tilemap performace test
me.TMXLayer & me.ImageLayer

**MelonJS Version**: 0.9.10

**Status**: finished

TileMap size: 200x200 32x32<br>
Tile size: 32x32<br>
Ortogonal<br>
Count of layers: 2
- bg - no transparency
- fg - with transparency

Layering	|	Fps	|	Profile 1 minute
------------|-------|---------------------
TileLayer	|	30	|	90% me.TMXLayer.draw()
ImageLayer	|	60	|	5% me.ImageLayer.draw()

- OS GNU Linux
- Firefox 26
- no GPU

For more detail see [tileLayer demo](https://github.com/Kibo/melonjs-cookbook/tree/master/cookbook/tilemapPerformanceTest/tileLayer), [imageLayer demo](https://github.com/Kibo/melonjs-cookbook/tree/master/cookbook/tilemapPerformanceTest/imageLayer)
