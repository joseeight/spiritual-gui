/**
 * Spirit styling studio.
 * @param {gui.Spirit} spirit
 */
gui.SpiritCSS = gui.SpiritPlugin.extend ( "gui.SpiritCSS", {
	
	/**
	 * Set single element.style.
	 * @param {String} prop
	 * @param {String} val
	 * @returns {gui.Spirit}
	 */
	set : function ( prop, val ) {
		
		gui.SpiritCSS.set ( this.spirit.element, prop, val );
		return this.spirit;
	},
	
	/**
	 * Get single element.style; see also compute method.
	 * @param {String} prop
	 * @returns {String}
	 */
	get : function ( prop ) {
		
		return gui.SpiritCSS.get ( this.spirit.element, prop );
	},
	
	/**
	 * Compute runtime style.
	 * @param {String} prop
	 * @returns {String}
	 */
	compute : function ( prop ) {
		
		return gui.SpiritCSS.compute ( this.spirit.element, prop );
	},
	
	/**
	 * Set multiple styles via key value map.
	 * @param {Map<String,String>} map
	 * @returns {gui.Spirit}
	 */
	style : function ( map ) {
		
		gui.SpiritCSS.style ( this.spirit.element, map );
		return this.spirit;
	},
	 
	/**
	 * Get or set (full) className.
	 * @param @optional {String} name
	 * @returns {object} gui.Spirit or String
	 */
	name : function ( name ) {
		
		var result = this.spirit.element.className;
		if ( name !== undefined ) {
			this.spirit.element.className = name;
			result = this.spirit;
		}
		return result;
	},
	
	/**
	 * classList.add
	 * @param {String} name
	 * @returns {gui.Spirit}
	 */
	add : function ( name ) {
		
		gui.SpiritCSS.add ( this.spirit.element, name );
		return this.spirit;
	},
	
	/**
	 * classList.remove
	 * @param {String} name
	 * @returns {gui.Spirit}
	 */
	remove : function ( name ) {
		
		gui.SpiritCSS.remove ( this.spirit.element, name );
		return this.spirit;
	},
	
	/**
	 * classList.toggle
	 * @param {String} name
	 * @returns {gui.Spirit}
	 */
	toggle : function ( name ) {
		
		gui.SpiritCSS.toggle ( this.spirit.element, name );
		return this.spirit;
	},
	
	/**
	 * classList.contains
	 * @param {String} name
	 * @returns {boolean}
	 */
	contains : function ( name ) {
		
		return gui.SpiritCSS.contains ( this.spirit.element, name );
	}, 

	/**
	 * Spirit element mathes selector?
	 * @param {String} selector
	 * @returns {boolean}
	 */
	matches : function ( selector ) {

		return gui.SpiritCSS.matches ( this.spirit.element, selector );
	}
	
	
}, {}, { // STATICS .............................................................

	/**
	 * @static
	 * Non-matching vendors removed after first run. First entry 
	 * gets to stay since it represents the unprefixed property.
	 * @type {Array<String>}
	 */
	_vendors : [ "", "-webkit-", "-moz-", "-ms-", "-o-" ],

	/**
	 * @static
	 * _supports Element.classList?
	 * @type {boolean}
	 */
	_supports : document.documentElement.classList !== undefined,

	/**
	 * @static
	 * classList.add
	 * @param {Element} element
	 * @param {String} names
	 */
	add : function ( element, name ) {
		
		if ( name.indexOf ( " " ) >-1 ) {
			name = name.split ( " " );
		}
		if ( Array.isArray ( name )) {
			name.forEach ( function ( n ) {
				this.add ( element, n );
			}, this );
		} else {
			if ( this._supports ) {
				element.classList.add ( name );
			} else {
				var now = element.className.split ( " " );
				if ( now.indexOf ( name ) === -1 ) {
					now.push ( name );
					element.className = now.join ( " " );
				}
			}
		}
	},

	/**
	 * @static
	 * classList.remove
	 * @param {Element} element
	 * @param {String} name
	 * @returns {gui.SpiritCSS}
	 */
	remove : function ( element, name ) {
		
		if ( name.indexOf ( " " ) >-1 ) {
			name = name.split ( " " );
		}
		if ( Array.isArray ( name )) {
			name.forEach ( function ( n ) {
				this.remove ( element, n );
			}, this );
		} else {
			if ( this._supports ) {
				element.classList.remove ( name );
			} else {
				var now = element.className.split ( " " );
				var idx = now.indexOf ( name );
				if ( idx > -1 ) {
					now.remove ( idx );
				}
				element.className = now.join ( " " );
			}
		};
	},

	/**
	 * @static
	 * classList.toggle
	 * @param {Element} element
	 * @param {String} name
	 * @returns {gui.SpiritCSS}
	 */
	toggle : function ( element, name ) {
		
		if ( this._supports ) {
			element.classList.toggle ( name );
		} else {
			if ( this.contains ( element, name )) {
				this.remove ( element, name );
			} else {
				this.add ( element, name );
			}
		}
	},

	/**
	 * @static
	 * classList.contains
	 * @param {Element} element
	 * @param {String} name
	 * @returns {boolean}
	 */
	contains : function ( element, name ) {
		
		var result = false;
		if ( this._supports ) {
			result = element.classList.contains ( name );
		} else {
			result = element.className.indexOf ( name ) >-1;
		}
		return result;
	},

	/**
	 * @static
	 * Set single element.style property (use style() for multiple)
	 * @param {Element}
	 * @param {String} prop
	 * @returns {gui.SpiritCSS}
	 */
	set : function ( element, prop, value ) {

		// TODO: also automate shorthands such as "10px 20px 10px 20px"
		if ( gui.Type.isNumber ( value )) {
			value = ( this._shorthands [ prop ] || "@" ).replace ( "@", value );
		}

		value = String ( value );
		switch ( prop ) {
			case "float": 
				prop = "cssFloat";
				break;
			default :
				value = this._normval ( element, value );
				prop = this._normprop ( element, prop );
				break;
		}
		element.style [ prop ] = value;
		return this;
	},
	
	/**
	 * @static
	 * TODO: Get element.style property; if this has been set. 
	 * Not to be confused with compute() for computedStyle!!!
	 * @param {Element}
	 * @param {String} prop
	 * @returns {String}
	 */
	get : function ( element, prop ) {

		return this._normval ( element.style [
			this._normprop ( element, prop )
		]);
	},

	/**
	 * @static
	 * Set multiple element.style properties.
	 * @param {object} thing Spirit or element.
	 * @param {Map<String,String>} styles
	 * @returns {object} Spirit or element
	 */
	style : function ( thing, styles ) {
		
		var element = thing instanceof gui.Spirit ? thing.element : thing;
		gui.Object.each ( styles, function ( prop, value ) {
			this.set ( element, prop, value );
		}, this );
		return thing;
	},

	/**
	 * @static
	 * Compute runtime style.
	 * @param {object} thing Spirit or element.
	 * @param {String} prop
	 * @returns {String}
	 */
	compute : function ( thing, prop ) {
		
		var element = thing instanceof gui.Spirit ? thing.element : thing;
		var doc = element.ownerDocument, win = doc.defaultView;
		prop = this._standardcase ( this._normprop ( element, prop ));
		return win.getComputedStyle ( element, null ).getPropertyValue ( prop );
	},

	/**
	 * Node matches CSS selector?
	 * @param {Node} node
	 * @param {String} selector
	 * @returns {boolean}
	 */
	matches : function ( node, selector ) {
		
		return node [ this._matchmethod ]( selector );
	},

	/**
	 * @static
	 * CamelCase string.
	 * @param {String} string
	 * @returns {String}
	 */
	_camelcase : function ( string ) {
		
		return string.replace ( /-([a-z])/ig, function ( all, letter ) {
			return letter.toUpperCase();
		});
	},

	/**
	 * @static
	 * standard-css-notate CamelCased string.
	 * @param {String} string
	 * @returns {String}
	 */
	_standardcase : function ( string ) {
		
		return string.replace ( /[A-Z]/g, function ( all, letter ) {
			return "-" + string.charAt ( letter ).toLowerCase ();
		});
	},	

	/**
	 * @static 
	 * Setter shorthands will autosuffix properties that require units 
	 * in support of the syntax: this.css.width = 300; // no method()
	 * TODO: add tons of things to this list
	 * @type {Map<String,String>
	 */
	_shorthands : {
			 
		top : "@px",
		right : "@px",
		bottom : "@px",
		left : "@px",
		width	: "@px",
		height : "@px",
		maxWidth : "@px",
		maxHeight : "@px",
		minWidth : "@px",
		minHeight : "@px",
		textIndent : "@px",
		fontWeight : "@",
		opacity : "@",
		zIndex : "@",
		position : "@",
		display : "@",
		visibility : "@"
	},

	/*
	 * Normalize declaration value.
	 * @param {String} value
	 * @returns {value}
	 */
	_normval : function ( element, value ) {
		
		var vendors = this._vendors;
		if ( value && value.contains ( "-beta-" )) {
			var parts = [];
			value.split ( ", " ).forEach ( function ( part ) {
				if (( part = part.trim ()).startsWith ( "-beta-" )) {
					vendors.every ( function ( vendor ) {
						var test = this._camelcase ( part.replace ( "-beta-", vendor ));
						if ( element.style [ test ] !== undefined ) {
							if ( vendors.length > 2 ) {
								this._vendors = [ "", vendor ];
							}
							parts.push ( part.replace ( "-beta-", vendor ));
							return false;
						}
						return true;
					 }, this );		
				} else {
					parts.push ( part );
				}
			}, this );
			value = parts.join ( "," );
		}
		return value;
	},

	/*
	 * Normalize declaration property.
	 * @param {Element} element
	 * @param {String} prop
	 * @returns {String}
	 */
	_normprop : function ( element, prop, xxx ) {
		
		var vendors = this._vendors, fixt = prop;
		if ( true ) {
			if ( prop.startsWith ( "-beta-" )) {
				vendors.every ( function ( vendor ) {
					var test = this._camelcase ( prop.replace ( "-beta-", vendor ));
					if ( element.style [ test ] !== undefined ) {
						if ( vendors.length > 2 ) {
							this._vendors = [ "", vendor ]; // TODO: at startup
						}
						fixt = test;
						return false;
					}
					return true;
				}, this );
			} else {
				fixt = this._camelcase ( fixt );
			}
		}
		return fixt;
	},

	/**
	 * Lookup vendors "matchesSelector" method.
	 * @type {String}
	 */ 
	_matchmethod : ( function () {

		var match = null, root = document.documentElement;
		[ 
			"mozMatchesSelector", 
			"webkitMatchesSelector", 
			"msMatchesSelector", 
			"oMatchesSelector", 
			"matchesSelector" 
		].every ( function ( method ) {
			if ( gui.Type.isDefined ( root [ method ])) {
				match = method;
			}
			return match === null;
		});
		return match;
	})()
	
});

/*
 * Generate shorthand getters/setters for top|left|width|height etc.
 */
( function shorthands () {
	
	var shorts = gui.SpiritCSS._shorthands;
	for ( var prop in shorts ) {
		if ( shorts.hasOwnProperty ( prop )) {
			( function ( prop ) {
				Object.defineProperty ( gui.SpiritCSS.prototype, prop, {
					enumerable : true,
					configurable : true,
					get : function get () {
						return parseInt ( this.get ( prop ));
					},
					set : function set ( val ) {
						this.set ( prop, val );
					}
				});
			}) ( prop );
		}
	}
	
})();