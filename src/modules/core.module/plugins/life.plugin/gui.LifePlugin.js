/**
 * Tracking spirit life cycle events.
 * @TODO Support optional data argument
 * @extends {gui.Tracker}
 */
gui.LifePlugin = gui.Tracker.extend ({

	/**
	 * Spirit is constructed? This is almost certainly true by 
	 * the time you address the spirit.
	 * @type {boolean}
	 */
	constructed : false,

	/**
	 * Spirit is configured?
	 * @type {boolean}
	 */
	configured : false,

	/**
	 * Is now or has ever been in page DOM?
	 * @type {boolean}
	 */
	entered : false,

	/**
	 * Is curently located in page DOM? 
	 * False whenever detached is true. 
	 * @TODO: make udefined on startup
	 * @type {boolean}
	 */
	attached : false,

	/**
	 * Is currently not located in page DOM? Note that this is initially 
	 * true until the spirit has been discovered and registered as attached.
	 * @TODO: make udefined on startup
	 * @type {boolean}
	 */
	detached : true,

	/**
	 * Is ready? If so, it implies that all descendant spirits are also ready.
	 * @type {boolean}
	 */
	ready : false,

	/**
	 * Is after whatever happens roughly 4 milliseconds after 'ready'?
	 * @type {boolean}
	 */
	async : false,

	/**
	 * Spirit was in page DOM, but has now been removed (ie. it was 
	 * detached and not re-attached in the same execution stack). 
	 * This schedules the spirit for destruction.
	 * @type {boolean}
	 */
	exited : false,

	/**
	 * Is destructed? If true, don't try anything funny.
	 * @type {boolean}
	 */
	destructed : false,

	/**
	 * Is visible?
	 * @type {boolean}
	 */
	visible : undefined,

	/**
	 * Mapping plugin prefix to initialized status, 'false' 
	 * is a lazy plugin that has not yet been constructed. 
	 * @type {[type]}
	 */
	plugins : null,

	/**
	 * Construction time.
	 * @overrides {gui.Tracker#construct}
	 */
	onconstruct : function () {
		this._super.onconstruct ();
		this._handlers = Object.create ( null );
		this.plugins = Object.create ( null );
	},

	/**
	 * Add one or more action handlers.
	 * @param {object} arg
	 * @param @optional {object} handler implements LifeListener interface, defaults to this.spirit
	 * @returns {gui.Spirit}
	 */
	add : function ( arg, handler ) {		
		handler = handler ? handler : this.spirit;
		this._breakdown ( arg ).forEach ( function ( type ) {
			if ( this._addchecks ( type, [ handler ])) {
				if ( !this._handlers [ type ]) {
					this._handlers [ type ] = [];
				}
				this._handlers [ type ].push ( handler );
			}
		}, this );
		return this.spirit;
	},

	/**
	 * Remove one or more action handlers.
	 * @param {object} arg
	 * @param @optional {object} handler implements LifeListener interface, defaults to spirit
	 * @returns {gui.Spirit}
	 */
	remove : function ( arg, handler ) {
		handler = handler ? handler : this.spirit;
		this._breakdown ( arg ).forEach ( function ( type ) {
			if ( this._removechecks ( type, [ handler ])) {
				var index = this._handlers [ type ].indexOf ( type );
				gui.Array.remove ( this._handlers [ type ], index );
				if ( this._handlers [ type ].length === 0 ) {
					delete this._handlers [ type ];
				}
			}
		}, this );
		return this.spirit;
	},

	/**
	 * Dispatch type and cleanup handlers for life cycle events that only occurs once.
	 * @TODO support optional data argument
	 * @param {String} type
	 */
	dispatch : function ( type ) {
		var list = this._handlers [ type ];
		if ( list !== undefined ) {
			var life = new gui.Life ( this.spirit, type );
			list.forEach ( function ( handler ) {
				handler.onlife ( life );
			});
			switch ( type ) {
				case gui.Life.CONSTRUCT :
				case gui.Life.CONFIGURE :
				case gui.Life.ENTER :
				case gui.Life.READY :
				case gui.Life.DETACH :
				case gui.Life.EXIT :
				case gui.Life.DESTRUCT :
					delete this._handlers [ type ];
					break;
			}
		}
	},

	/**
	 * @TODO move declaration to super or something (?)
	 * @type {Map<String,Array<object>}
	 */
	_handlers : null,

	/**
	 * Cleanup.
	 */
	_cleanup : function ( type, checks ) {
		var handler = checks [ 0 ];
		this.remove ( type, handler );
	}

});