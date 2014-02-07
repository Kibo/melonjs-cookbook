game.MenuItem = me.GUI_Object.extend( {
	init: function( settings ) {		
		this.parent( settings.x, settings.y, settings );
		this.name = "MenuItem";
		this.callback = settings.callback;
	},

	onClick: function( event ) {
		console.log( "clicked!" );
		
		if (this.callback) {
            this.callback(this);
        }
        
		return false;
	},

	draw: function( context ) {
		context.drawImage( this.image, this.pos.x, this.pos.y );
	}
} );

game.Menu = me.ObjectContainer.extend( {
	init: function( x, y, w, h ) {
		this.parent( x, y, w, h );
		this.name = "Menu";
		this.z = 999;
	},

	addMenuItem: function( settings ) {
		this.addChild( new game.MenuItem( settings ) );
	},
} );

game.MenuScreen = me.ScreenObject.extend( {

	"init": function( ) {
		this.parent( true );

		// flag to know if we need to refresh the display
		this.invalidate = false;
	},

	"onResetEvent": function( ) {
		this.parent( );

		this.font = new me.Font( 'Menlo, "DejaVu Sans Mono", "Lucida Console", monospace', 12, "#fff", "center" );

		this.bg = me.loader.getImage( "menu_bg" );

		if( this.bgm && me.audio.getCurrentTrack( ) !== this.bgm ) {
			me.audio.playTrack( this.bgm );
		}

		var menu = new game.Menu( );
		menu.addMenuItem( {
			x: 250,
			y: 300,
			image: "button",
			callback: function( ) {
				me.state.change( me.state.PLAY );
			}
		} );

		me.game.world.addChild( menu );
	},

	"update": function( ) {
		if( this.invalidate === true ) {
			this.invalidate = false;
			return true;
		}

		return false;
	},

	"draw": function( context ) {
		me.video.clearSurface( context, "#202020" );
		context.drawImage( this.bg, 0, 0, this.bg.width, this.bg.height, 0, 0, game.SCREEN_WIDTH, game.SCREEN_HEIGHT );
		this.font.draw( context, "The story begint", game.SCREEN_WIDTH / 2, game.SCREEN_HEIGHT / 2 );
	}
} );
