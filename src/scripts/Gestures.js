var gestureAssignments = {
	"ALT+SHIFT+C": (e) => {
		canvasInterface.clear();
	},
	"ALT+C": (e) => {
		toggleColorPicker();
	},
	P: (e) => {
		setTool("pen");
	},
	B: (e) => {
		setTool("pen");
	},
	E: (e) => {
		setTool("eraser");
	},
	G: (e) => {
		setTool("fillBucket");
	},
	S: (e) => {
		setTool("sprayPaint");
	},
	I: (e) => {
		setTool("eyedropper");
	},
	L: (e) => {
		setTool("line");
	},
	"CONTROL+Z": (e) => {
		undo();
	},
	"CONTROL+SHIFT+Z": (e) => {
		redo();
	},
};

class TapGesture {
	/**
	 *
	 * @param {Object} options
	 * @param {DOMElement} element
	 * @param {Function} callback
	 */
	constructor(options, element, callback) {
		this.options = {
			inputs: options.inputs || 1,
			maxDelay: options.maxDelay || 300,
			threshold: options.threshold || 10,
			duration: options.duration || 1000,
		};
		console.log(options, this.options);
		this.callback = callback;
		this.totalTouches = 0;
		this.currentTouches = 0;
		this.touchStarts = [];
		this.touchEnds = [];
		this.beginningPositions = {};
		this.previousPositions = {};
		this.positionDeltas = {};
		console.log(element);

		var _self = this;
		element.addEventListener("touchstart", function (e) {
			_self.touchStart(e, _self);
		});
		element.addEventListener("touchmove", function (e) {
			_self.touchMove(e, _self);
		});
		element.addEventListener("touchend", function (e) {
			_self.touchEnd(e, _self);
		});
		//element.ontouchstart = this.touchStart
		//element.ontouchend = this.touchEnd
	}

	touchStart(e, _self) {
		console.groupCollapsed();
		for (let i = 0; i < e.changedTouches.length; i++) {
			_self.touchStarts.push(Date.now());
			_self.totalTouches += 1;
			_self.beginningPositions[e.changedTouches[i].identifier.toString()] = {
				x: e.changedTouches[i].clientX,
				y: e.changedTouches[i].clientY,
			};
			_self.previousPositions[e.changedTouches[i].identifier.toString()] = {
				x: e.changedTouches[i].clientX,
				y: e.changedTouches[i].clientY,
			};
			_self.positionDeltas[e.changedTouches[i].identifier.toString()] = {
				x: 0,
				y: 0,
			};
		}
		_self.currentTouches = e.touches.length;
		//console.log('Touch Started', e, e.targetTouches.length)
		console.groupEnd();
		//console.log(_self.beginningPositions)
	}
	touchEnd(e, _self) {
		console.groupCollapsed();
		for (let i = 0; i < e.changedTouches.length; i++) {
			_self.touchEnds.push(Date.now());
		}
		_self.currentTouches = e.touches.length;
		//console.log("Touch Ended", e) /
		//console.log(_self.touchStarts) /
		//console.log(_self.currentTouches)
		if (_self.currentTouches == 0) _self.evaluateGesture(_self);
		console.groupEnd();
	}
	touchMove(e, _self) {
		console.groupCollapsed();

		for (let i = 0; i < e.changedTouches.length; i++) {
			_self.positionDeltas[e.changedTouches[i].identifier.toString()].x +=
				e.changedTouches[i].clientX -
				_self.previousPositions[e.changedTouches[i].identifier.toString()].x;
			_self.positionDeltas[e.changedTouches[i].identifier.toString()].y +=
				e.changedTouches[i].clientY -
				_self.previousPositions[e.changedTouches[i].identifier.toString()].y;
			_self.previousPositions[e.changedTouches[i].identifier.toString()] = {
				x: e.changedTouches[i].clientX,
				y: e.changedTouches[i].clientY,
			};
		}
		_self.touchStarts.push(Date.now());
		_self.currentTouches = e.touches.length;
		//console.log('Touch Started', e, e.targetTouches.length)
		console.groupEnd();
	}

	evaluateGesture(_self) {
		//console.log("evaluating gesture")
		//console.log(_self.totalTouches)
		var pass = true;
		if (
			_self.touchStarts[_self.touchStarts.length - 1] - _self.touchStarts[0] >
				_self.options.maxDelay ||
			_self.touchEnds[_self.touchEnds.length - 1] - _self.touchEnds[0] >
				_self.options.maxDelay
		) {
			pass = false;
		}
		if (
			_self.touchEnds[0] - _self.touchStarts[_self.touchStarts.length - 1] >
			_self.options.duration
		) {
			pass = false;
		}
		if (_self.totalTouches != _self.options.inputs) {
			//debug.log("gesture failed - incnum")
			pass = false;
		}
		for (const key in _self.positionDeltas) {
			if (Object.hasOwnProperty.call(_self.positionDeltas, key)) {
				const element = _self.positionDeltas[key];
				if (
					Math.abs(element.x) > _self.options.threshold ||
					Math.abs(element.y) > _self.options.threshold
				) {
					pass = false;
				}
			}
		}

		if (pass) {
			//debug.log("gesture passed")
			_self.callback(_self);
		}
		_self.resetGesture(_self);
	}
	resetGesture(_self) {
		_self.totalTouches = 0;
		_self.currentTouches = 0;
		_self.touchStarts = [];
		_self.touchEnds = [];
		_self.beginningPositions = {};
		_self.positionDeltas = {};
		_self.previousPositions = {};
	}
}

function initializeGestures() {
	var doubleTapGesture = new TapGesture(
		{ inputs: 2, maxDelay: 300, threshold: 10 },
		canvasInterface.canvasParent,
		undo
	);
	new TapGesture(
		{ inputs: 3, maxDelay: 300, threshold: 10 },
		canvasInterface.canvasParent,
		redo
	);
}

function doubleTapCallback(e) {
	undo();
}
