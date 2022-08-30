var layers = [];

class LayerElement {
	constructor(layer) {
		this.layer = layer;
		this.layerElement = document.createElement("div");
		this.layerElement.classList.add("layer-wrap");
		//set top variable
		this.layerElement.style.setProperty(
			"--top",
			`${
				(layers.length - this.layer.index - 1) * layerHeight +
				layerMargin * (layers.length - this.layer.index - 1)
			}px`
		);
		this.layerElement.innerHTML = this.layer.name;
		var _self = this;
		this.layerElement.onpointerdown = function (e) {
			console.log(e.target);
			//sets startingTouchPosition to mouse position if there is mouse position, or touch position if theres a touch position. array of [x,y]
			startingTouchPosition = [e.clientX, e.clientY];
			timeout = setTimeout(function () {
				moving = true;
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
				requestAnimationFrame(animateIn);
			}, 400);
		};
		this.layerElement.onpointerup = function (e) {
			clearTimeout(timeout);
			moving = false;
			_self.layerElement.classList.remove("moving");
			endAnimating = true;
			inAnimating = false;
			requestAnimationFrame(animateOut);
			deltaMovingX = 0;
			deltaMovingY = 0;
			centerCorrection = [0, 0];
			distanceBetweenPointerAndCenterOfBoundingRect = [0, 0];
		};
		var endAnimating = false;
		var inAnimating = false;
		var boundingRect = this.layerElement.getBoundingClientRect();
		var distanceBetweenPointerAndCenterOfBoundingRect = [0, 0];
		var centerCorrection = [0, 0];
		var scale = 1;
		var targetScale = 0.8;
		function animateOut() {
			//gets current value of offsetx and offsety & converts to integers, pruning px
			var offsetX = parseInt(
				_self.layerElement.style.getPropertyValue("--offsetX").replace("px", "")
			);
			var offsetY = parseInt(
				_self.layerElement.style.getPropertyValue("--offsetY").replace("px", "")
			);
			scale = lerp(scale, 1, 0.25)
			//lerp between offsetx and offset y and 0
			offsetX = lerp(offsetX, 0, 0.25);
			offsetY = lerp(offsetY, 0, 0.25);
			//sets offsetx and offsety to new values
			_self.layerElement.style.setProperty("--offsetX", `${offsetX}px`);
			_self.layerElement.style.setProperty("--offsetY", `${offsetY}px`);

			_self.layerElement.style.setProperty("--s", `${scale}`);
			//if theres a change in offset, keep animating
			if (Math.abs(offsetX) < 0.01 && Math.abs(offsetY) < 0.01) {
				endAnimating = false;
				_self.layerElement.classList.add("movingIndex");
			}
			if (endAnimating) {
				requestAnimationFrame(animateOut);
			}
		}

		function animateIn() {
			if(!inAnimating) return
			//gets current value of offsetx and offsety & converts to integers, pruning px
			//lerp between offsetx and offset y and 0
			centerCorrection[0] = lerp(
				centerCorrection[0],
				-distanceBetweenPointerAndCenterOfBoundingRect[0],
				0.25
			);
			centerCorrection[1] = lerp(
				centerCorrection[1],
				-distanceBetweenPointerAndCenterOfBoundingRect[1],
				0.25
			);

			scale = lerp(
				scale,targetScale,
				0.25
			);
			//sets offsetx and offsety to new values
			_self.layerElement.style.setProperty(
				"--offsetX",
				`${centerCorrection[0] + deltaMovingX}px`
			);
			_self.layerElement.style.setProperty(
				"--offsetY",
				`${centerCorrection[1] + deltaMovingY}px`
			);
			_self.layerElement.style.setProperty(
				"--s",
				`${scale}`
			);
			//if theres a change in offset, keep animating
			if (
				Math.abs(
					centerCorrection[0] + distanceBetweenPointerAndCenterOfBoundingRect[0]
				) < 0.01 &&
				Math.abs(
					centerCorrection[1] + distanceBetweenPointerAndCenterOfBoundingRect[1]
				) < 0.01
			) {
				inAnimating = false;
			}
			if (inAnimating) {
				requestAnimationFrame(animateIn);
			}
		}
		//requestANimationFrame loop that lerps --offsetX and --offsetY back to 0 based on their current value, stopping when they are both 0
		let deltaMovingX = 0;
		let deltaMovingY = 0;
		//on pointermove, if there is more than X threshold on the movement based on the startingtouchposition and the current touch position, then move the layer.
		this.layerElement.onpointermove = function (e) {
			let currentTouchPosition = [e.clientX, e.clientY];
			deltaMovingX = currentTouchPosition[0] - startingTouchPosition[0];
			deltaMovingY = currentTouchPosition[1] - startingTouchPosition[1];
			if (moving) {
				//set offset variable to deltaY
				_self.layerElement.style.setProperty(
					"--offsetX",
					`${deltaMovingX + centerCorrection[0]}px`
				);
				_self.layerElement.style.setProperty(
					"--offsetY",
					`${deltaMovingY + centerCorrection[1]}px`
				);
				return;
			}
			deltaPosition[0] += Math.abs(deltaMovingX);
			deltaPosition[1] += Math.abs(deltaMovingY);
			if (deltaPosition[0] > 20 || deltaPosition[1] > 20) {
				clearTimeout(timeout);
			}
		};

		//timeout that acts as a delay where, if you are still touching the layer when it fires, it does something
		var timeout;
		var moving = false;
		var startingTouchPosition;
		var deltaPosition = [0, 0];
		this.layerElement.ontouchmove = function (e) {
			if (moving) e.preventDefault();
			//notify.log("touchmove + " + layer.name);
		};
		layerMain.appendChild(this.layerElement);
	}
}
var layerMain = document.getElementById("layer-main");
function createLayer(name) {
	layers.unshift({ name: name, index: layers.length });
}
function createMultipleLayers(l) {
	for (let i = 0; i < l; i++) {
		createLayer(randomString(10));
	}
	addAllLayers();
}
createMultipleLayers(10);
var layerHeight = 100;
var layerMargin = 5;
function addAllLayers() {
	layerMain.innerHTML = "";
	for (let i = 0; i < layers.length; i++) {
		let layer = layers[i];
		layers[i].id = randomString(10);
		new LayerElement(layer);
	}
}

var notify = new Alrt({
	position: "top-center",
	duration: 1000, //default duration
	theme: "bitshift-confirmation",
	behavior: "overwrite",
});
notify.log("mounted");

addAllLayers();

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
