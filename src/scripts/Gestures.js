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
			maxDuration: options.maxDuration || 1000,
			minDuration: options.maxDuration || 1,
		};
		this.callback = callback;
		this.totalTouches = 0;
		this.currentTouches = 0;
		this.touchStarts = [];
		this.touchEnds = [];
		this.beginningPositions = {};
		this.previousPositions = {};
		this.positionDeltas = {};

		var _self = this;
		element.addEventListener(
			"touchstart",
			function (e) {
				this.touchStart(e);
			}.bind(this)
		);
		element.addEventListener(
			"touchmove",
			function (e) {
				this.touchMove(e);
			}.bind(this)
		);
		element.addEventListener(
			"touchend",
			function (e) {
				this.touchEnd(e);
			}.bind(this)
		);
	}

	touchStart(e) {
		for (let i = 0; i < e.changedTouches.length; i++) {
			this.touchStarts.push(Date.now());
			this.totalTouches += 1;
			this.beginningPositions[e.changedTouches[i].identifier.toString()] = {
				x: e.changedTouches[i].clientX,
				y: e.changedTouches[i].clientY,
			};
			this.previousPositions[e.changedTouches[i].identifier.toString()] = {
				x: e.changedTouches[i].clientX,
				y: e.changedTouches[i].clientY,
			};
			this.positionDeltas[e.changedTouches[i].identifier.toString()] = {
				x: 0,
				y: 0,
			};
		}
		this.currentTouches = e.touches.length;
	}
	touchEnd(e) {
		for (let i = 0; i < e.changedTouches.length; i++) {
			this.touchEnds.push(Date.now());
		}
		this.currentTouches = e.touches.length;
		if (this.currentTouches == 0) this.evaluateGesture(this);
	}
	touchMove(e) {
		for (let i = 0; i < e.changedTouches.length; i++) {
			this.positionDeltas[e.changedTouches[i].identifier.toString()].x +=
				e.changedTouches[i].clientX -
				this.previousPositions[e.changedTouches[i].identifier.toString()].x;
			this.positionDeltas[e.changedTouches[i].identifier.toString()].y +=
				e.changedTouches[i].clientY -
				this.previousPositions[e.changedTouches[i].identifier.toString()].y;
			this.previousPositions[e.changedTouches[i].identifier.toString()] = {
				x: e.changedTouches[i].clientX,
				y: e.changedTouches[i].clientY,
			};
		}
		this.touchStarts.push(Date.now());
		this.currentTouches = e.touches.length;
	}

	evaluateGesture() {
		//console.log("evaluating gesture")
		//console.log(this.totalTouches)
		var pass = true;
		if (
			this.touchStarts[this.touchStarts.length - 1] - this.touchStarts[0] >
				this.options.maxDelay ||
			this.touchEnds[this.touchEnds.length - 1] - this.touchEnds[0] >
				this.options.maxDelay
		) {
			pass = false;
		}
		if (
			this.touchEnds[this.touchEnds.length - 1] - this.touchStarts[0] >
			this.options.maxDuration
		) {
			pass = false;
		}
		if (
			this.touchEnds[this.touchEnds.length - 1] - this.touchStarts[0] <
			this.options.minDuration
		) {
			pass = false;
		}
		if (this.totalTouches != this.options.inputs) {
			//debug.log("gesture failed - incnum")
			pass = false;
		}
		for (const key in this.positionDeltas) {
			if (Object.hasOwnProperty.call(this.positionDeltas, key)) {
				const element = this.positionDeltas[key];
				if (
					Math.abs(element.x) > this.options.threshold ||
					Math.abs(element.y) > this.options.threshold
				) {
					pass = false;
				}
			}
		}

		if (pass) {
			//debug.log("gesture passed")
			this.callback(this);
		}
		this.resetGesture(this);
	}
	resetGesture() {
		this.totalTouches = 0;
		this.currentTouches = 0;
		this.touchStarts = [];
		this.touchEnds = [];
		this.beginningPositions = {};
		this.positionDeltas = {};
		this.previousPositions = {};
	}
}

class HoldGesture {
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
		this.callback = callback;
		this.totalTouches = 0;
		this.currentTouches = 0;
		this.touchStarts = [];
		this.touchEnds = [];
		this.beginningPositions = {};
		this.previousPositions = {};
		this.positionDeltas = {};
		notify.log("asdf");

		var _self = this;
		element.addEventListener(
			"touchstart",
			function (e) {
				this.touchStart(e);
			}.bind(this)
		);
		element.addEventListener(
			"touchmove",
			function (e) {
				this.touchMove(e);
			}.bind(this)
		);
		element.addEventListener(
			"touchend",
			function (e) {
				this.touchEnd(e);
			}.bind(this)
		);
	}

	touchStart(e) {
		for (let i = 0; i < e.changedTouches.length; i++) {
			this.touchStarts.push(Date.now());
			this.totalTouches += 1;
			this.beginningPositions[e.changedTouches[i].identifier.toString()] = {
				x: e.changedTouches[i].clientX,
				y: e.changedTouches[i].clientY,
			};
			this.previousPositions[e.changedTouches[i].identifier.toString()] = {
				x: e.changedTouches[i].clientX,
				y: e.changedTouches[i].clientY,
			};
			this.positionDeltas[e.changedTouches[i].identifier.toString()] = {
				x: 0,
				y: 0,
			};
		}
		this.currentTouches = e.touches.length;
		clearTimeout(this.timeout);
		this.timeout = setTimeout(() => {
			this.evaluateGesture(e).bind(this);
			console.log("e");
		}, this.options.duration);

	}
	touchEnd(e) {
		for (let i = 0; i < e.changedTouches.length; i++) {
			this.touchEnds.push(Date.now());
		}
		this.currentTouches = e.touches.length;
		if (this.currentTouches == 0) {
			clearTimeout(this.timeout);
			this.resetGesture(this);
		}
	}
	touchMove(e) {
		for (let i = 0; i < e.changedTouches.length; i++) {
			this.positionDeltas[e.changedTouches[i].identifier.toString()].x +=
				e.changedTouches[i].clientX -
				this.previousPositions[e.changedTouches[i].identifier.toString()].x;
			this.positionDeltas[e.changedTouches[i].identifier.toString()].y +=
				e.changedTouches[i].clientY -
				this.previousPositions[e.changedTouches[i].identifier.toString()].y;
			this.previousPositions[e.changedTouches[i].identifier.toString()] = {
				x: e.changedTouches[i].clientX,
				y: e.changedTouches[i].clientY,
			};
		}
		this.touchStarts.push(Date.now());
		this.currentTouches = e.touches.length;
	}

	evaluateGesture(e) {
		var clientX = 0
		var clientY = 0
		//average out all beginning positions
		for (const key in this.beginningPositions) {
			if (Object.hasOwnProperty.call(this.beginningPositions, key)) {
				const element = this.beginningPositions[key];
				clientX += element.x
				clientY += element.y
			}
		}
		clientX /= Object.keys(this.beginningPositions).length
		clientY /= Object.keys(this.beginningPositions).length

		console.log(e);
		notify.log(this.totalTouches);
		//console.log(this.totalTouches)
		var pass = true;
		if (
			this.touchStarts[this.touchStarts.length - 1] - this.touchStarts[0] >
				this.options.maxDelay ||
			this.touchEnds[this.touchEnds.length - 1] - this.touchEnds[0] >
				this.options.maxDelay
		) {
			pass = false;
		}
		if (
			this.touchEnds[this.touchEnds.length - 1] - this.touchStarts[0] >
			this.options.maxDuration
		) {
			pass = false;
		}
		if (
			this.touchEnds[this.touchEnds.length - 1] - this.touchStarts[0] <
			this.options.minDuration
		) {
			pass = false;
		}
		if (this.totalTouches != this.options.inputs) {
			//debug.log("gesture failed - incnum")
			pass = false;
		}
		for (const key in this.positionDeltas) {
			if (Object.hasOwnProperty.call(this.positionDeltas, key)) {
				const element = this.positionDeltas[key];
				if (
					Math.abs(element.x) > this.options.threshold ||
					Math.abs(element.y) > this.options.threshold
				) {
					pass = false;
				}
			}
		}

		if (pass) {
			//debug.log("gesture passed")
			this.callback(clientX, clientY);
		}
		this.resetGesture(this);
	}
	resetGesture() {
		this.totalTouches = 0;
		this.currentTouches = 0;
		this.touchStarts = [];
		this.touchEnds = [];
		this.beginningPositions = {};
		this.positionDeltas = {};
		this.previousPositions = {};
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
	new HoldGesture(
		{ inputs: 1, maxDelay: 300, threshold: 20, duration: 500 },
		canvasInterface.canvasParent,
		function (clientX, clientY) {
			previousTool = getTool();
			compileForEyedropper();
			initEyedropper(clientX, clientY)
			setTool("eyedropper", document.getElementById("tool-btn-eyedropper"));
		}
	);
}

function doubleTapCallback(e) {
	undo();
}
