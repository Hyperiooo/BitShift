// Type Vector is [ x, y ]
// Type Matrix is [ Vector, Vector ]
// Type ZoomTransform is [ Matrix, Vector ]

/**
 * Multiply Scalar with Vector returns a Vector.
 *
 * @param {number} l scalar to multiply with
 * @param {Array<number>} x 2D vector.
 * @return {Array<number>}
 */
var scmult = function (l, x) {
	return [l * x[0], l * x[1]];
};

/**
 * Adding two vectors is another vector.
 *
 * @param {Array<number>} a 2D vector.
 * @param {Array<number>} b 2D vector.
 * @return {Array<number>} Sum vector.
 */
var vcadd = function (a, b) {
	return [a[0] + b[0], a[1] + b[1]];
};

/**
 * Subtracting two vectors is another vector.
 *
 * @param {Array<number>} a 2D vector.
 * @param {Array<number>} b 2D vector.
 * @return {Array<number>} Difference vector.
 */
var minus = function (a, b) {
	return [a[0] - b[0], a[1] - b[1]];
};

/**
 * Dot product of two vectors is scalar.
 *
 * @param {Array<number>} a 2D vector.
 * @param {Array<number>} b 2D vector.
 * @return {number} scalar inner product.
 */
var dot = function (a, b) {
	return a[0] * b[0] + a[1] * b[1];
};

/**
 * Exterior Product of two vectors is a pseudoscalar.
 *
 * @param {Array<number>} a 2D vector.
 * @param {Array<number>} b 2D vector.
 * @return {number} psuedo-scalar exterior product.
 */
var wedge = function (a, b) {
	return a[0] * b[1] - a[1] * b[0];
};

/**
 * Apply Matrix on Vector returns a Vector.
 *
 * @param {Array<Array<number>>} A 2x2 Matrix
 * @param {Array<number>} x 2D vector.
 * @return {Array<number>} 2D vector linear product.
 */
var apply = function (A, x) {
	return vcadd(scmult(x[0], A[0]), scmult(x[1], A[1]));
};

/**
 * Multiply two matrices.
 *
 * @param {Array<Array<number>>} A 2x2 Matrix
 * @param {Array<Array<number>>} B 2x2 Matrix
 * @return {Array<Array<number>>} A 2x2 Matrix
 */
var mult = function (A, B) {
	return [apply(A, B[0]), apply(A, B[1])];
};

/**
 * Represents a transform operation, Ax + b
 *
 * @constructor
 *
 * @param {Array<Array<number>>} A 2x2 Matrix.
 * @param {Array<number>} b 2D scalar.
 */
function ZoomTransform(A, b) {
	this.A = A;
	this.b = b;
}

/**
 * Given CSS ZoomTransform representation of the class.
 * @return {string} CSS 2D ZoomTransform.
 */
ZoomTransform.prototype.css = function () {
	var A = this.A;
	var b = this.b;
	return (
		"matrix(" +
		A[0][0] +
		"," +
		A[0][1] +
		"," +
		A[1][0] +
		"," +
		A[1][1] +
		"," +
		b[0] +
		"," +
		b[1] +
		")"
	);
};

/**
 * Multiply two transforms.
 * Defined as
 *  (T o U) (x) = T(U(x))
 *
 * Derivation:
 *  T(U(x))
 *   = T(U.A(x) + U.b)
 *   = T.A(U.A(x) + U.b)) + T.b
 *   = T.A(U.A(x)) + T.A(U.b) + T.b
 *
 * @param {ZoomTransform} T
 * @param {ZoomTransform} U
 * @return {ZoomTransform} T o U
 */
var cascade = function (T, U) {
	return new ZoomTransform(mult(T.A, U.A), vcadd(apply(T.A, U.b), T.b));
};

/**
 * Creates the default rotation matrix
 *
 * @param {number} c x-projection (r cos(theta))
 * @param {number} s y-projection (r sin(theta))
 * @return {Array<Array<number>>} Rotation matrix.
 */
var rotate = function (c, s) {
	return [
		[c, s],
		[-s, c],
	];
};

/**
 * Returns matrix that transforms vector a to vector b.
 *
 * @param {Array<number>} a 2D vector.
 * @param {Array<number>} b 2D vector.
 * @return {Array<Array<number>>} Rotation + Scale matrix
 */
var rotscale = function (a, b) {
	var alen = dot(a, a);
	var sig = dot(a, b);
	var del = wedge(a, b);
	return rotate(sig / alen, del / alen);
};

var justscale = function (a, b) {
	var alen = Math.sqrt(dot(a, a));
	var blen = Math.sqrt(dot(b, b));
	var scale = blen / alen;
	return rotate(scale, 0);
};

/**
 * Zoom is a similarity preserving transform from a pair of source
 * points to a new pair of destination points. If rotate it is false
 * then it won't be maintaining the transfer precisely, but will only
 * do scaling part of it.
 *
 * @param {Array<Array<number>>} s two source points.
 * @param {Array<Array<number>>} d two destination points.
 * @param {Boolean} rotate true - rotate; else scale.
 *
 * @return {ZoomTransform} that moves point 's' to point 'd'
 */
var zoom = function (s, d, rotate) {
	// Source vector.
	var a = minus(s[1], s[0]);
	// Destination vector.
	var b = minus(d[1], d[0]);
	// Rotation needed for source to dest vector.
	var rs = rotate ? rotscale(a, b) : justscale(a, b);

	// Position of s[0] if rotation is applied.
	var rs0 = apply(rs, s[0]);
	// Since d[0] = rs0 + t
	var t = minus(d[0], rs0);

	return new ZoomTransform(rs, t);
};

/**
 * Weighted average of two vectors.
 *
 * @param {Array<number>} u 2D vector.
 * @param {Array<number>} v 2D vector.
 * @param {number} progress (from 0 to 1)
 * @return {Array<number>} (1-p) u + (p) v
 */
var avgVector = function (u, v, progress) {
	var u1 = scmult(1 - progress, u);
	var v1 = scmult(progress, v);
	return vcadd(u1, v1);
};

/**
 * Weighted average of two vectors.
 *
 * @return {Array<Array<number>>} A 2D matrix.
 * @return {Array<Array<number>>} B 2D matrix.
 * @param {number} progress (from 0 to 1)
 * @return {Array<Array<number>>} (1-p) A + (p) B
 */
var avgMatrix = function (A, B, progress) {
	return [avgVector(A[0], B[0], progress), avgVector(A[1], B[1], progress)];
};

/**
 * Weighted average of two transforms.
 * @param {ZoomTransform} Z Source ZoomTransform
 * @param {ZoomTransform} I Destination ZoomTransform
 * @param {number} progress (from 0 to 1)
 * @return {ZoomTransform} (1-p) Z + (p) I
 */
ZoomTransform.avg = function (Z, I, progress) {
	return new ZoomTransform(
		avgMatrix(Z.A, I.A, progress),
		avgVector(Z.b, I.b, progress)
	);
};

var identity = new ZoomTransform(
	[
		[1, 0],
		[0, 1],
	],
	[0, 0]
);

/**
 * Gives a default value for an input object.
 *
 * @param {Object} param input parameter, may be undefined
 * @param {Object} val returned if param is undefined.
 * @return {Object}
 */
var defaults = function (param, val) {
	return param === undefined ? val : param;
};

/**
 * Method to override json config objects with default
 * values. If undefined in cfg corresponding value from
 * cfg_def will be picked.
 *
 * @param {Object} cfg input parameter config.
 * @param {Object} cfg_def default fallbacks.
 * @return {Object} new config
 */
var default_config = function (cfg, cfg_def) {
	var new_cfg = defaults(cfg, {});
	for (var k in cfg_def) {
		new_cfg[k] = defaults(new_cfg[k], cfg_def[k]);
	}
	return new_cfg;
};

/**
 * @constructor
 * @export
 * @param {Element} elem to attach zoom handler.
 * @param {Object} config to specify additiona features.
 */
function Zoom(elem, config, wnd) {
	this.mayBeDoubleTap = null;
	this.isAnimationRunning = false;
	// SingleFinger = 1, DoubleFinger = 2, NoTouch = 0
	this.curTouch = 0;
	this.elem = elem;
	// keep reference to parent in case elem is moved elsewhere in DOM
	this.elemParent = elem.parentNode;
	this.activeZoom = identity;
	this.resultantZoom = identity;

	this.srcCoords = [
		[0, 0],
		[1, 1],
	];
	this.destCoords = [
		[0, 0],
		[0, 0],
	];
	var _self = this;

	this.config = default_config(config, {
		pan: false,
		rotate: true,
	});

	this.minZoom = 2;
	this.maxZoom = 200;

	this.callback = config.callback || function () {};

	this.wnd = wnd || window;

	// trigger browser optimisations for the transition
	// see https://dev.opera.com/articles/css-will-change-property/
	elem.style["will-change"] = "transform";

	elem.style["transform-origin"] = "0 0";

	var getCoordsDouble = function (t) {
		var rect = elem.parentNode.getBoundingClientRect();
		var oX = rect.left;
		var oY = rect.top;
		return [
			[t[0].pageX - oX, t[0].pageY - oY],
			[t[1].pageX - oX, t[1].pageY - oY],
		];
	};

	var getCoordsSingle = function (t) {
		var rect = elem.parentNode.getBoundingClientRect();
		var oX = rect.left;
		var oY = rect.top;
		var x = t[0].pageX - oX;
		var y = t[0].pageY - oY;
		return [
			[x, y],
			[x + 1, y + 1],
		];
	};

	var getCoords = function (t) {
		return t.length > 1 ? getCoordsDouble(t) : getCoordsSingle(t);
	};

	var setSrcAndDest = function (touches) {
		_self.srcCoords = getCoords(touches);
		_self.destCoords = _self.srcCoords;
	};

	var setDest = function (touches) {
		_self.destCoords = getCoords(touches);
	};

	this._handleZoom = function (e) {
		var touches = e.touches;
		if (!touches) return;
		var numOfFingers = touches.length;
		if (numOfFingers !== _self.curTouch) {
			_self.curTouch = numOfFingers;
			_self.finalize();
			if (numOfFingers > 0) {
				setSrcAndDest(touches);
			}
		} else {
			setDest(touches);
			if (touches.length < 2) return;
			_self.previewZoom();
		}
	};
	this.doMousePan = false;
	this._handleMouseDown = function (e) {
		if (e.button != 1) return;
		_self.doMousePan = true;
		previousX = e.clientX;
		previousY = e.clientY;
	};
	var previousX = 0;
	var previousY = 0;
	this._handleMouseMove = function (e) {
		if (!_self.doMousePan) return;
		_self.moveBy(e.clientX - previousX, e.clientY - previousY);
		previousX = e.clientX;
		previousY = e.clientY;
	};
	this._handleMouseUp = function (e) {
		_self.doMousePan = false;
	};

	this._handleWheel = function (e) {
		var rect = elem.parentNode.getBoundingClientRect();
		var oX = rect.left;
		var oY = rect.top;
		var x = e.pageX - oX;
		var y = e.pageY - oY;
		_self.zoomBy(e.wheelDeltaY > 0 ? 1 : -1, x, y);
	};
	this.elemParent.addEventListener("wheel", this._handleWheel);
	this.elemParent.addEventListener("mousedown", this._handleMouseDown);
	this.elemParent.addEventListener("mousemove", this._handleMouseMove);
	this.elemParent.addEventListener("mouseup", this._handleMouseUp);
	this.elemParent.addEventListener("touchstart", this._handleZoom);
	this.elemParent.addEventListener("touchmove", this._handleZoom);
	this.elemParent.addEventListener("touchend", this._handleZoom);
}

Zoom.prototype.destroy = function () {
	this.elemParent.removeEventListener("mousedown", this._handleMouseDown);
	this.elemParent.removeEventListener("mousemove", this._handleMouseMove);
	this.elemParent.removeEventListener("mouseup", this._handleMouseUp);
	this.elemParent.removeEventListener("touchstart", this._handleZoom);
	this.elemParent.removeEventListener("touchmove", this._handleZoom);
	this.elemParent.removeEventListener("touchend", this._handleZoom);

	this.elem.style["will-change"] = null;
	this.elem.style["transform-origin"] = null;
	this.elem.style.transform = null;
};

Zoom.prototype.previewZoom = function () {
	var additionalZoom = zoom(
		this.srcCoords,
		this.destCoords,
		this.config.rotate
	);
	this.resultantZoom = cascade(additionalZoom, this.activeZoom);
	this.repaint();
};

Zoom.prototype.setZoom = function (newZoom) {
	this.resultantZoom = newZoom;
	this.repaint();
};

Zoom.prototype.getTransform = function () {
	var r = this.elem.getBoundingClientRect();
	var rotation = Math.round(
		(Math.atan2(this.resultantZoom.A[0][1], this.resultantZoom.A[0][0]) * 180) /
			Math.PI
	);
	return {
		scale: this.resultantZoom.A[0][0],
		x: r.x + r.width / 2,
		y: r.y + r.height / 2,
		angle: rotation,
		radians: rotation * (Math.PI / 180),
	};
};

Zoom.prototype.moveBy = function (dx, dy) {
	this.finalize();
	var curT = this.resultantZoom;
	var newTransform = new ZoomTransform(curT.A, [
		curT.b[0] + dx,
		curT.b[1] + dy,
	]);
	this.setZoom(newTransform);
};

Zoom.prototype.zoomBy = function (factor, pX, pY) {
	this.finalize();
	var zoomAmount = 3;
	if (factor > 0) {
		this.srcCoords = [
			[pX - 10, pY - 10],
			[pX + 10, pY + 10],
		];
		this.destCoords = [
			[pX - 10 - zoomAmount, pY - 10 - zoomAmount],
			[pX + 10 + zoomAmount, pY + 10 + zoomAmount],
		];
	} else {
		this.destCoords = [
			[pX - 10, pY - 10],
			[pX + 10, pY + 10],
		];
		this.srcCoords = [
			[pX - 10 - zoomAmount, pY - 10 - zoomAmount],
			[pX + 10 + zoomAmount, pY + 10 + zoomAmount],
		];
	}
	this.previewZoom();
};

Zoom.prototype.finalize = function () {
	this.activeZoom = this.resultantZoom;
};

Zoom.prototype.repaint = function () {
	this.elem.style.transform = this.resultantZoom.css();
	this.callback();

	document.body.style.setProperty(
		"--panzoomTransformMatrix",
		this.resultantZoom.css()
	);
};

if (typeof exports === "undefined") {
	window["Zoom"] = Zoom;
} else {
	exports["Zoom"] = Zoom;
}
