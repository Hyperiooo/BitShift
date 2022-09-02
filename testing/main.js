var layers = [];

class LayerElement {
	constructor(layer) {
		this.layer = layer;
		this.index = layer.index;
		this.id = layer.id;

		this.previousIndex = this.index;
		console.log("as");

		this.layerElement = document.createElement("div");
		this.layerElement.classList.add("layer-wrap");
		this.layerElement.style.setProperty("--offsetX", `0px`);
		this.layerElement.style.setProperty("--offsetY", `0px`);
		this.previewOffset = 0;
		this.layerTop =
			(layers.length - this.layer.index - 1) * layerHeight +
			layerMargin * (layers.length - this.layer.index - 1); //the height that the element would be if it werent moving
		this.absoluteTop = this.layerTop; //the current absolute height of the element, including everything

		this.containerRect = layerMain.getBoundingClientRect();
		//set top variable
		this.layerElement.style.setProperty("--top", `${this.absoluteTop}px`);
		this.layerElement.innerHTML = this.layer.name;
		var _self = this;
		this.layerElement.onpointerdown = function (e) {
			//sets startingTouchPosition to mouse position if there is mouse position, or touch position if theres a touch position. array of [x,y]
			startingTouchPosition = [e.clientX, e.clientY];
			timeout = setTimeout(function () {
				_self.moving = true;
				_self.layerElement.classList.add("moving");
				_self.layerElement.classList.add("movingIndex");
				boundingRect = _self.layerElement.getBoundingClientRect();
				//requestAnimationFrame(animateIn);
				distanceBetweenPointerAndCenterOfBoundingRect = [
					(boundingRect.left + boundingRect.right) / 2 -
						startingTouchPosition[0],
					(boundingRect.top + boundingRect.bottom) / 2 -
						startingTouchPosition[1],
				];
				inAnimating = true;
				pickedUp = true;
				beginningScroll = layerMain.scrollTop;
				requestAnimationFrame(animateIn);
			}, 400);
		};
		this.layerElement.onpointerup = function (e) {
			clearTimeout(timeout);

			_self.layerElement.classList.remove("moving");
			_self.layerElement.classList.add("movingIndex");
			animateScroll = false;
			clearInterval(animateScrollInterval);
			_self.endAnimating = true;
			centerAnimating = false;
			inAnimating = false;
			if (movingLayer) {
				unshiftAllLayers();
				clearPreviewLayerPosition();
				_self.updateLayerOrder();
			}
			requestAnimationFrame(animateOut);
			if (!pickedUp) {
				//it can be assumed that the element was sohrt tapped
				setLayer(_self.id);
			}
			pickedUp = false;
			movingLayer = false;
			deltaMovingX = 0;
			deltaMovingY = 0;
			centerCorrection = [0, 0];
			distanceBetweenPointerAndCenterOfBoundingRect = [0, 0];
		};
		this.endAnimating = false;
		var inAnimating = false;
		var centerAnimating = false;
		var boundingRect = this.layerElement.getBoundingClientRect();
		var distanceBetweenPointerAndCenterOfBoundingRect = [0, 0];
		var centerCorrection = [0, 0];
		var scale = 1;
		var targetScale = 1.05;
		var smallScale = 0.6;
		var pickedUp = false;
		var movingLayer = false;
		var moveThreshold = 70; //threshold before the layer thinks that its tryna be moved
		var scrollPercentage = 0.2;
		var maxScrollSpeed = 10;
		var beginningScroll = 0;
		function animateOut() {
			//gets current value of offsetx and offsety & converts to integers, pruning px
			var offsetX = parseInt(
				_self.layerElement.style.getPropertyValue("--offsetX").replace("px", "")
			);
			var offsetY = parseInt(
				_self.layerElement.style.getPropertyValue("--offsetY").replace("px", "")
			);
			scale = lerp(scale, 1, 0.25);
			//lerp between offsetx and offset y and 0
			offsetX = lerp(offsetX, 0, 0.25);
			offsetY = lerp(offsetY, 0, 0.25);
			//sets offsetx and offsety to new values
			_self.layerElement.style.setProperty("--offsetX", `${offsetX}px`);
			_self.layerElement.style.setProperty("--offsetY", `${offsetY}px`);

			_self.absoluteTop = _self.layerTop + offsetY;
			_self.updateLayerPosition();

			_self.layerElement.style.setProperty("--s", `${scale}`);
			//if theres a change in offset, keep animating
			if (
				Math.abs(offsetX) < 0.01 &&
				Math.abs(offsetY) < 0.01 &&
				Math.abs(scale - 1) < 0.001
			) {
				_self.endAnimating = false;
				_self.layerElement.classList.remove("movingIndex");

				_self.moving = false;
			}
			if (_self.endAnimating) {
				requestAnimationFrame(animateOut);
			}
		}

		function animateIn() {
			if (!inAnimating || centerAnimating) return;
			//gets current value of offsetx and offsety & converts to integers, pruning px
			//lerp between offsetx and offset y and 0

			scale = lerp(scale, targetScale, 0.1);
			//sets offsetx and offsety to new values

			_self.layerElement.style.setProperty("--s", `${scale}`);
			//if theres a change in offset, keep animating
			if (Math.abs(scale - targetScale) < 0.01) {
				inAnimating = false;
			}
			if (inAnimating) {
				requestAnimationFrame(animateIn);
			}
		}
		function animateCenterOffset() {
			if (!centerAnimating) return;
			centerCorrection[0] = lerp(
				centerCorrection[0],
				-distanceBetweenPointerAndCenterOfBoundingRect[0],
				0.1
			);
			centerCorrection[1] = lerp(
				centerCorrection[1],
				-distanceBetweenPointerAndCenterOfBoundingRect[1],
				0.1
			);
			_self.layerElement.style.setProperty(
				"--offsetX",
				`${centerCorrection[0] + deltaMovingX}px`
			);
			_self.layerElement.style.setProperty(
				"--offsetY",
				`${
					centerCorrection[1] +
					deltaMovingY +
					(layerMain.scrollTop - beginningScroll)
				}px`
			);

			_self.absoluteTop =
				_self.layerTop +
				centerCorrection[1] +
				deltaMovingY +
				(layerMain.scrollTop - beginningScroll);
			_self.updateLayerPosition();
			scale = lerp(scale, smallScale, 0.1);
			//sets offsetx and offsety to new values

			_self.layerElement.style.setProperty("--s", `${scale}`);
			//if theres a change in offset, keep animating
			if (
				Math.abs(
					centerCorrection[0] + distanceBetweenPointerAndCenterOfBoundingRect[0]
				) < 0.01 &&
				Math.abs(
					centerCorrection[1] + distanceBetweenPointerAndCenterOfBoundingRect[1]
				) < 0.01 &&
				Math.abs(scale - smallScale) < 0.01
			) {
				centerAnimating = false;
			}
			if (centerAnimating) {
				requestAnimationFrame(animateCenterOffset);
			}
		}
		//requestANimationFrame loop that lerps --offsetX and --offsetY back to 0 based on their current value, stopping when they are both 0
		let deltaMovingX = 0;
		let deltaMovingY = 0;
		let deltaMovingLayer = [0, 0];
		var scrollAmt = 0;
		var animateScroll = false;
		var animateScrollInterval;
		var scrollTiming = 10;
		function animateScrolling() {
			layerMain.scrollBy({ top: maxScrollSpeed * scrollAmt });
			_self.layerElement.style.setProperty(
				"--offsetY",
				`${
					deltaMovingY +
					centerCorrection[1] +
					(layerMain.scrollTop - beginningScroll)
				}px`
			);
		}
		//on pointermove, if there is more than X threshold on the movement based on the startingtouchposition and the current touch position, then move the layer.
		this.layerElement.onpointermove = function (e) {
			let currentTouchPosition = [e.clientX, e.clientY];
			deltaMovingX = currentTouchPosition[0] - startingTouchPosition[0];
			deltaMovingY = currentTouchPosition[1] - startingTouchPosition[1];
			let deltaMovingLayerX =
				currentTouchPosition[0] - startingTouchPosition[0];
			let deltaMovingLayerY =
				currentTouchPosition[1] - startingTouchPosition[1];
			deltaMovingLayer[0] += Math.abs(deltaMovingLayerX);
			deltaMovingLayer[1] += Math.abs(deltaMovingLayerY);
			if (pickedUp) {
				if (movingLayer) {
					if (_self.moving) {
						var heightPercentage =
							(e.clientY - _self.containerRect.top) /
							(_self.containerRect.bottom - _self.containerRect.top);
						scrollAmt = 0;
						if (heightPercentage < scrollPercentage) {
							if (animateScroll == false) {
								animateScrollInterval = setInterval(() => {
									animateScrolling();
								}, scrollTiming);
							}
							animateScroll = true;
							scrollAmt = (1 - heightPercentage / scrollPercentage) * -1;
						} else if (heightPercentage > 1 - scrollPercentage) {
							if (animateScroll == false) {
								animateScrollInterval = setInterval(() => {
									animateScrolling();
								}, scrollTiming);
							}
							animateScroll = true;
							scrollAmt =
								(heightPercentage - (1 - scrollPercentage)) / scrollPercentage;
						} else {
							animateScroll = false;
							clearInterval(animateScrollInterval);
						}
						//set offset variable to deltaY
						_self.layerElement.style.setProperty(
							"--offsetX",
							`${deltaMovingX + centerCorrection[0]}px`
						);
						_self.layerElement.style.setProperty(
							"--offsetY",
							`${
								deltaMovingY +
								centerCorrection[1] +
								(layerMain.scrollTop - beginningScroll)
							}px`
						);
						_self.absoluteTop =
							_self.layerTop +
							deltaMovingY +
							centerCorrection[1] +
							(layerMain.scrollTop - beginningScroll);
						_self.updateLayerPosition();
						return;
					}
				}
				if (
					deltaMovingLayer[0] > moveThreshold ||
					deltaMovingLayer[1] > moveThreshold
				) {
					movingLayer = true;
					centerAnimating = true;
					requestAnimationFrame(animateCenterOffset);
					shiftAllLayers(_self.index);
				}
			}
			deltaPosition[0] += Math.abs(deltaMovingX);
			deltaPosition[1] += Math.abs(deltaMovingY);
			if (deltaPosition[0] > 20 || deltaPosition[1] > 20) {
				clearTimeout(timeout);
			}
		};

		//timeout that acts as a delay where, if you are still touching the layer when it fires, it does something
		var timeout;
		this.moving = false;
		var startingTouchPosition = [0, 0];
		var deltaPosition = [0, 0];
		this.layerElement.ontouchmove = function (e) {
			if (_self.moving) e.preventDefault();
		};
		layerMain.appendChild(this.layerElement);
	}
	shiftToNewLayerPosition(index) {
		if (index > this.index) {
			this.previewOffset = layerHeight + layerMargin;
			this.layerElement.style.setProperty(
				"--layerMovementOffset",
				`${this.previewOffset}px`
			);
		}
	}
	unshiftLayer() {
		this.previewOffset = 0;
		this.layerElement.style.setProperty("--layerMovementOffset", `0px`);
	}
	previewLayerPosition(i) {
		this.layerElement.style.setProperty(
			"--layerMovementOffset",
			`${this.previewOffset}px`
		);
		if (this.moving) return;
		if (i > this.index) {
			//get the property layermovementoffset
			this.layerElement.style.setProperty(
				"--layerMovementOffset",
				`${this.previewOffset - 40}px`
			);
		}
	}
	updateLayerPosition() {
		var currentIndex =
			layerElements.length -
			Math.floor(this.absoluteTop / (layerHeight + layerMargin)) -
			2;
		notify.log(
			layerElements.length -
				Math.floor(this.absoluteTop / (layerHeight + layerMargin)) -
				2
		);
		if (this.endAnimating) return;
		previewLayerPosition(
			currentIndex + (currentIndex < this.index ? 0 : 1),
			currentIndex < this.index
		);
	}
	updateLayerOrder() {
		var moveToIndex =
			layerElements.length -
			Math.floor(this.absoluteTop / (layerHeight + layerMargin)) -
			2;
		arraymove(
			layers,
			layerElements.indexOf(this),
			layerElements.length - moveToIndex - 1
		);
		arraymove(
			layerElements,
			layerElements.indexOf(this),
			layerElements.length - moveToIndex - 1
		);
		console.log(
			this,
			layerElements,
			layerElements.indexOf(this),
			layerElements.length - moveToIndex - 1
		);
		this.previousIndex = this.index;
		this.updateIndices();
		updateNormalTops();
		layers[layerElements.indexOf(this)];
	}
	updateIndices() {
		for (var i = 0; i < layerElements.length; i++) {
			layerElements[i].index = layerElements.length - i - 1;
			layers[i].index = layers.length - i - 1;
		}
	}
	updateNormalTop() {
		this.layerTop =
			(layers.length - this.layer.index - 1) * layerHeight +
			layerMargin * (layers.length - this.layer.index - 1);
		this.absoluteTop = this.layerTop + layerMain.scrollTop;
		this.layerElement.style.setProperty("--top", `${this.layerTop}px`);
		if (!this.moving) return;
		var curoff = parseInt(
			this.layerElement.style.getPropertyValue("--offsetY").replace("px", "")
		);
		this.layerElement.style.setProperty(
			"--offsetY",
			`${
				curoff - (layerHeight + layerMargin) * (this.previousIndex - this.index)
			}px`
		);
	}
}
function updateNormalTops() {
	layerElements.forEach((e) => {
		e.updateNormalTop();
	});
}

function previewLayerPosition(index, o) {
	previewBarHorizontal.classList.add("layer-position-preview-visible");
	previewBarHorizontal.style.top = `${
		clamp(
			layerElements.length - index - 1 + (o ? 0 : 1),
			0,
			layerElements.length - 1
		) *
			(layerHeight + layerMargin) +
		18
	}px`;
	layerElements.forEach((e) => {
		e.previewLayerPosition(index);
	});
}

function clearPreviewLayerPosition() {
	layerElements.forEach((e) => {
		e.unshiftLayer();
	});
}

function shiftAllLayers(index) {
	layerElements.forEach((e) => {
		e.shiftToNewLayerPosition(index);
	});
}
function unshiftAllLayers(index) {
	previewBarHorizontal.classList.remove("layer-position-preview-visible");
	layerElements.forEach((e) => {
		e.unshiftLayer(index);
	});
}
var layerMain = document.getElementById("layer-main");
var previewBarHorizontal = document.getElementById(
	"layer-position-preview-horizontal"
);
var debug = document.getElementById("debug");
function createLayer(name) {
	debug.innerHTML += layers.length;
	var layer = { name: name, index: layers.length, id: randomString(8) };
	var layerElement = new LayerElement(layer);
	layer.layerElement = layerElement.layerElement;
	layers.unshift(layer);
	layerElements.unshift(layerElement);
	setTimeout(() => {
		updateNormalTops();
		setLayer(layer.id);
	}, 1);
}
function newLayer() {
	createLayer("Layer " + layers.length);
	setTimeout(() => {
		addAllLayers();
	}, 100);
}

function setLayer(id) {
	layer = layers.find((obj) => {
		return obj.id == id;
	});
	document.querySelectorAll(".layer-active").forEach((e) => {
		e.classList.remove("layer-active");
	});
	if (layer) {
		layer.layerElement.classList.add("layer-active");
		activeLayer = layer;
		//board.ctx = layer.ctx;
		//board.setColor(board.color);
	}
}
function createMultipleLayers(l) {
	layerElements = [];
	layerMain.querySelectorAll(".layer-wrap").forEach((e) => {
		e.remove();
	});
	for (let i = 0; i < l; i++) {
		createLayer("Layer " + i);
	}
}
let layerElements = [];
createMultipleLayers(80);
var layerHeight = 55;
var layerMargin = 5;
function addAllLayers() {
	for (let i = 0; i < layers.length; i++) {}
}

var notify = new Alrt({
	position: "top-center",
	duration: 1000, //default duration
	theme: "bitshift-confirmation",
	behavior: "overwrite",
});
notify.log("mounted");

function randomString(l) {
	var result = "";
	var characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	var charactersLength = characters.length;
	for (var i = 0; i < l; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}
//lerp function

function lerp(v0, v1, t) {
	return v0 * (1 - t) + v1 * t;
}

//clamp functio
function clamp(val, min, max) {
	return Math.min(Math.max(val, min), max);
}
Array.prototype.insert = function (index, ...items) {
	this.splice(index, 0, ...items);
};

function arraymove(arr, fromIndex, toIndex) {
	var element = arr[fromIndex];
	arr.splice(fromIndex, 1);
	arr.splice(toIndex, 0, element);
}
