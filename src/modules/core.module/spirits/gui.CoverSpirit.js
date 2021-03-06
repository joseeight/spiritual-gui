/**
 * @deprecated
 * Spirit of the cover. Use it to cover stuff up. Note that the cover should 
 * be fitted with a background-color in CSS in order to actually cover stuff.
 * TODO: get this out of here...
 * @extends {gui.Spirit}
 */
gui.CoverSpirit = gui.Spirit.extend ({

	/**
	 * Show the cover.
	 * @returns {gui.CoverSpirit}
	 */
	show : function () {
		this.dom.show ();
		return this;
	},

	/**
	 * Hide the cover.
	 * @returns {gui.CoverSpirit}
	 */
	hide : function () {
		this.dom.hide ();
		return this;
	},

	/**
	 * Position cover.
	 * @TODO: inject default styling
	 * @param {gui.Geometry} geo
	 */
	position : function ( geo ) {
		this.css.style ({
			top : geo.y,
			left : geo.x,
			width : geo.w,
			height : geo.h
		});
	},

	/**
	 * Show and fade to no opacity.
	 * @TODO promises goes here
	 * @param {number} duration in ms
	 * @returns {object} then method
	 */
	fadeIn : function ( duration ) {
		if ( gui.Client.hasTransitions ) {
			this.transition.none ();
			this.css.opacity = 0;
			this.show ();
			this.transition.run ({
				duration : duration || 250,
				property : "opacity",
				opacity : 1
			});
		} else {
			this.show ();
		}
	},

	/**
	 * Fade to full opacity and hide.
	 * @TODO promises goes here
	 * @param {number} duration in ms
	 * @returns {Object} then method
	 */
	fadeOut : function ( duration ) {
		if ( gui.Client.hasTransitions ) {
			this.transition.none ();
			this.css.opacity = 1;
			this.show ();
			this.transition.run ({
				duration : duration || 250,
				property : "opacity",
				opacity : 0
			}).then ( function () {
				this.hide();
			}, this );
		} else {
			this.hide ();
		}
	}


}, { 

	// Static ............................................................

	/**
	 * Summon spirit.
	 * @param {Document} doc
	 * @param @optional {gui.Geometry} geo
	 * @returns {gui.CoverSpirit}
	 */
	summon : function ( doc, geo ) {
		var spirit = this.possess ( doc.createElement ( "div" ));
		spirit.css.add ( gui.CLASS_COVER );
		if ( geo ) {
			spirit.position ( geo );
		}
		return spirit;
	}
});