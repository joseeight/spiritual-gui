/**
 * # gui.DOMCombos
 * This is where it gets interesting.
 * @todo Standard DOM exceptions for missing arguments and so on.
 * @todo insertAdjecantHTML
 * @todo DOM4 methods
 */
gui.DOMCombos = {

	/**
	 * Get combinations to overload native DOM methods and getters.
	 * @type {Map<String,function>}
	 */
	getem : function () {
		return this._creation || ( this._creation = this._create ());
	},

	// Private .......................................................................
	
	/**
	 * Cache combinations for reuse when next requested.
	 * @type {Map<String,function>}
	 */
	_creation : null,

	/**
	 * Building combinations when first requested. Note that property setters such as 
	 * innerHTML and textContent are skipped for WebKit where the stuff only works because 
	 * properties have been re-implemented using methods in all WebKit based browsers. 
	 * @see {gui.DOMPatcher}
	 */
	_create : function () {

		var combo = gui.Combinator;
		var guide = gui.Guide;
		
		/**
		 * Is `this` embedded in document?
		 * @returns {boolean}
		 */
		var ifEmbedded = combo.provided ( function () {
			return gui.DOMPlugin.embedded ( this );
		});

		/**
		 * Element has spirit?
		 * @returns {boolean}
		 */
		var ifSpirit = combo.provided ( function () {
			return !gui.Type.isNull ( this.spirit );
		});

		/**
		 * Attach node plus subtree.
		 * @param {Node} node
		 */
		var spiritualizeAfter = combo.after ( function ( node ) {
			guide.spiritualize ( node );
		});

		/**
		 * Detach node plus subtree.
		 * @param {Node} node
		 */
		var materializeBefore = combo.before ( function ( node ) {
			guide.materialize ( node );
		});

		/**
		 * Attach new node plus subtree.
		 * @param {Node} newnode
		 * @param {Node} oldnode
		 */
		var spiritualizeNewAfter = combo.after ( function ( newnode, oldnode ) {
			guide.spiritualize ( newnode );
		});

		/**
		 * Detach old node plus subtree
		 * @param {Node} newnode
		 * @param {Node} oldnode
		 */
		var materializeOldBefore = combo.before ( function ( newnode, oldnode ) {
			guide.materialize ( oldnode );
		});

		/**
		 * Spirit-aware setattribute.
		 * @param {String} att
		 * @param {String} val
		 */
		var setAttAfter = combo.after ( function ( att, val ) {
			this.spirit.att.__suspend__ ( function () {
				this.set ( att, val );
			});
		});

		/**
		 * Spirit-aware removeattribute.
		 * @todo use the post combo?
		 * @param {String} att
		 */
		var delAttAfter = combo.after ( function ( att ) {
			this.spirit.att.__suspend__ ( function () {
				this.del ( att );
			});
		});

		/**
		 * Disable DOM mutation observers while doing action.
		 * @param {function} action
		 */
		var suspending = combo.around ( function ( action ) {
			return gui.Observer.suspend ( this, function () {
				return action.apply ( this, arguments );
			}, this );
		});

		/**
		 * Detach subtree of `this`.
		 */
		var materializeSubBefore = combo.before ( function () {
			guide.materializeSub ( this );
		});

		/**
		 * Attach subtree of `this`
		 */
		var spiritualizeSubAfter = combo.after ( function () {
			guide.spiritualizeSub ( this );
		});

		/**
		 * Detach `this`.
		 */
		var parent = null; // @todo unref this at some point
		var materializeThisBefore = combo.before ( function () {
			parent = this.parentNode;
			guide.materialize ( this );
		});

		/**
		 * Attach parent.
		 */
		var spiritualizeParentAfter = combo.after ( function () {
			guide.spiritualize ( parent );
		});

		/**
		 * Webkit-patch property descriptors for node and subtree.
		 * @see {gui.DOMPatcher}
		 * @param {Node} node
		 */
		var patchAfter = combo.after ( function ( node ) {
			if ( gui.Client.isWebKit ) {
				gui.DOMPatcher.patch ( node );
			}
		});

		/**
		 * Pretend nothing happened when running in "managed" mode.
		 * @todo Simply mirror this prop with an internal boolean
		 */
		var ifEnabled = combo.provided ( function () {
			return this.ownerDocument.defaultView.gui.mode !== gui.MODE_MANAGED;
		});

		/**
		 * Sugar for combo readability.
		 * @param {function} action
		 * @returns {function}
		 */
		var otherwise = function ( action ) {
			return action;
		};

		/**
		 * Here we go.
		 */
		return {

			appendChild : function ( base ) {
				return (
					ifEnabled ( 
						ifEmbedded ( spiritualizeAfter ( patchAfter ( suspending ( base ))), 
						otherwise ( base )),
					otherwise ( base ))
				);
			},
			removeChild : function ( base ) {
				return (
					ifEnabled ( 
						ifEmbedded ( materializeBefore ( suspending ( base )),
						otherwise ( base )),
					otherwise ( base ))
				);
			},
			insertBefore : function ( base ) {
				return (
					ifEnabled ( 
						ifEmbedded ( spiritualizeAfter ( patchAfter ( suspending ( base ))), 
						otherwise ( base )),
					otherwise ( base ))
				);
			},
			replaceChild : function ( base ) {
				return (
					ifEnabled ( 
						ifEmbedded ( materializeOldBefore ( spiritualizeNewAfter ( patchAfter ( suspending ( base )))), 
						otherwise ( base )),
					otherwise ( base ))
				);
			},
			setAttribute : function ( base ) {
				return ( 
					ifEnabled ( 
						ifEmbedded ( 
							ifSpirit ( setAttAfter ( base ), 
							otherwise ( base )),
						otherwise ( base )),
					otherwise ( base ))
				);
			},
			removeAttribute : function ( base ) {
				return ( 
					ifEnabled ( 
						ifEmbedded ( 
							ifSpirit ( delAttAfter ( base ),
							otherwise ( base )),
						otherwise ( base )),
					otherwise ( base ))
				);
			},
			innerHTML : function ( base ) {
				return (
					ifEnabled ( 
						ifEmbedded ( materializeSubBefore ( spiritualizeSubAfter ( suspending ( base ))),
						otherwise ( base )),
					otherwise ( base ))
				);
			},
			outerHTML : function ( base ) {
				return (
					ifEnabled ( 
						ifEmbedded ( materializeThisBefore ( spiritualizeParentAfter ( suspending ( base ))),
						otherwise ( base )),
					otherwise ( base ))
				);
			},
			textContent : function ( base ) {
				return (
					ifEnabled ( 
						ifEmbedded ( materializeSubBefore ( suspending ( base )),
						otherwise ( base )),
					otherwise ( base ))
				);
			}
		};
	}
};