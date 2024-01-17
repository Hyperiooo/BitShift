import { Cel, LayerTexture } from "./Image.js";
window.Image = Image;
var m4 = twgl.m4;
window.gl = document.getElementById("c").getContext("webgl");
export class Renderer {
	constructor() {
		this.programInfo = twgl.createProgramInfo(gl, ["vs", "fs"]);
		// a unit quad
		this.bufferInfo = twgl.primitives.createXYQuadBufferInfo(gl);

		this.baseCanvasWidth = 1000;
		this.baseCanvasHeight = 1000;

		this.canvasScale = 1;
		this.canvasAngle = 0;

		if (
			window.innerHeight /
				window.devicePixelRatio /
				this.baseCanvasHeight /
				1.25 <
			window.innerWidth / window.devicePixelRatio / this.baseCanvasWidth / 1.25
		) {
			this.canvasScale =
				window.innerHeight /
				window.devicePixelRatio /
				this.baseCanvasHeight /
				1.25;
		} else {
			this.canvasScale =
				window.innerWidth /
				window.devicePixelRatio /
				this.baseCanvasWidth /
				1.25;
		}

		this.inputLayer = document.getElementById("input-layer");
		this.inputLayer.width = this.baseCanvasWidth;
		this.inputLayer.height = this.baseCanvasHeight;
		this.inputLayer.style.width = this.baseCanvasWidth + "px";
		this.inputLayer.style.height = this.baseCanvasHeight + "px";

		this.zoom = new SuperZoom(this.inputLayer, {
			minZoom: 0.25,
			initialAngle: 0,
			initialZoom: this.canvasScale,
			onTransform: function (e) {
				if (!this.zoom) return;
				if (!this.zoom.getTransform) return;
				var transf = this.zoom.getTransform();
				this.canvasScale = transf.scale;
				this.canvasAngle = transf.angle;
			}.bind(this),

			onTouchPanComplete: function (e, x, y) {
				return;
				var threshold = 5;
				var snapAngle = 90;
				var targetAngle = snapAngle * Math.round(e.angle / snapAngle);
				var curAngle = e.angle;
				var transf = {
					angle: curAngle,
				};
				if (
					e.angle % snapAngle < threshold ||
					e.angle % snapAngle > snapAngle - threshold
				) {
					//rn();
					var am = anime({
						targets: transf,
						angle: targetAngle,
						duration: 100,
						easing: "easeOutCirc",
						update: function () {
							if (this.zoom.transforming) am.pause();
							this.zoom.rotateTo(transf.angle, x, y);
						}.bind(this),
					});
				}
			}.bind(this),
			validateMousePan: function (e) {
				if (e.button == 1) return true;
			},
			validateTouchPan: function (e) {
				if (e.touches.length == 2) return true;
			},
			zoomStep: 10,
			snapRotation: true,
			snapRotationStep: 45,
			snapRotationTolerance: 10,
		});

		setTimeout(() => {
			this.zoom.options.onTransform();
		}, 1);
		setTimeout(() => {
			var targetX =
				(window.innerWidth - this.baseCanvasWidth * this.canvasScale) / 2;
			var targetY =
				(window.innerHeight - this.baseCanvasHeight * this.canvasScale) / 2;

			this.zoom.zoomTo(
				this.canvasScale,
				window.innerWidth / 2,
				window.innerHeight / 2
			);
			this.zoom.rotateTo(0);
			this.zoom.moveTo(targetX, targetY);
		}, 1);

		this.renderQueue = [];
		this.constructRenderQueue();
		this.time = 1;
	}
	startRendering() {
		requestAnimationFrame(this.render.bind(this));
	}
	constructRenderQueue() {
		var whiteTexData = new Cel(
			this.baseCanvasWidth,
			this.baseCanvasHeight,
			[255, 255, 255, 255]
		);
		whiteTexData.clear();
		whiteTexData.data = generateGridImageData(
			this.baseCanvasWidth,
			this.baseCanvasHeight
		);

		let texData = new Cel(
			this.baseCanvasWidth,
			this.baseCanvasHeight,
			[255, 255, 255, 0]
		);
		window.texData = texData;
		this.dummycel = new Cel(30, 30, [255, 0, 0, 100]);
		// create a dummy texture, as we'll generate the texture data in the shader
		var blankTex = new LayerTexture(
			whiteTexData,
			this.baseCanvasWidth,
			this.baseCanvasHeight
		);
		blankTex.updateTexture();
		var temp = new LayerTexture(
			texData,
			this.baseCanvasWidth,
			this.baseCanvasHeight
		);
		texData.drawCel(this.dummycel, 10, 10);
		this.dummycel.fill(0, 255, 0, 100);
		texData.drawCel(this.dummycel, 9, 9);
		this.dummycel.fill(96, 159, 0, 161);
		texData.drawCel(this.dummycel, 1, 1);
		this.dummycel.fill(125, 125, 0, 161);
		texData.drawCel(this.dummycel, 4, 4);
		this.renderQueue.push(blankTex);
		this.renderQueue.push(temp);
	}
	render() {
		this.time *= 0.01;
		// texData.clear();
		// texData.drawRect(
		// 	44,
		// 	40,
		// 	20,
		// 	20,
		// 	Math.random() * 255,
		// 	Math.random() * 255,
		// 	255,
		// 	255
		// );
		var {rawX, rawY, x, y} = this.getCoordinatesFromInputEvent(null, mouseX, mouseY);
		this.dummycel.fill(Math.floor(Math.random() * 255),Math.floor(Math.random() * 255),Math.floor(Math.random() * 255),125);
		//texData.drawCel(this.dummycel, x, y);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		twgl.resizeCanvasToDisplaySize(gl.canvas);
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		var transform = this.zoom.getTransform();
		this.renderQueue.forEach((layer) => {
			this.drawImage(
				gl.canvas.width,
				gl.canvas.height,
				layer.glTex,
				this.baseCanvasWidth,
				this.baseCanvasHeight,
				transform.centerX,
				transform.centerY,
				0
			);
		});
		requestAnimationFrame(this.render.bind(this));
	}
	drawImage(
		targetWidth,
		targetHeight,
		tex,
		texWidth,
		texHeight,
		dstX,
		dstY,
		zOffset
	) {
		let dstWidth = texWidth;
		let dstHeight = texHeight;
		//dstWidth /= window.devicePixelRatio;
		//dstHeight /= window.devicePixelRatio;
		//dstX /= window.devicePixelRatio;
		//dstY /= window.devicePixelRatio;

		var mat = m4.identity();
		var tmat = m4.identity();

		var uniforms = {
			matrix: mat,
			textureMatrix: tmat,
			texture: tex,
		};

		gl.enable(gl.BLEND);
		gl.blendFuncSeparate(
			gl.SRC_ALPHA,
			gl.ONE_MINUS_SRC_ALPHA,
			gl.ONE,
			gl.ONE_MINUS_SRC_ALPHA
		);

		m4.ortho(0, targetWidth, targetHeight, 0, -1, 1, mat);

		dstX -= (dstWidth / 2) * this.canvasScale;
		dstY -= (dstHeight / 2) * this.canvasScale;
		m4.translate(mat, [dstX, dstY, zOffset], mat);
		m4.translate(
			mat,
			[
				(dstWidth / 2) * this.canvasScale,
				(dstHeight / 2) * this.canvasScale,
				zOffset,
			],
			mat
		);
		m4.rotateZ(mat, this.zoom.toRadians(this.canvasAngle), mat);
		m4.translate(
			mat,
			[
				(-dstWidth / 2) * this.canvasScale,
				(-dstHeight / 2) * this.canvasScale,
				zOffset,
			],
			mat
		);
		m4.scale(
			mat,
			[dstWidth * this.canvasScale, dstHeight * this.canvasScale, 1],
			mat
		);

		gl.useProgram(this.programInfo.program);
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		twgl.setBuffersAndAttributes(gl, this.programInfo, this.bufferInfo);
		twgl.setUniforms(this.programInfo, uniforms);
		twgl.drawBufferInfo(gl, this.bufferInfo);
	}
	getCoordinatesFromInputEvent(e, xi, yi) {
		var rect = this.inputLayer.getBoundingClientRect();
		var x, y;
		if (e) {
			x = e.clientX - rect.left || e.touches[0].clientX - rect.left || -1;
			y = e.clientY - rect.top || e.touches[0].clientY - rect.top || -1;
		} else {
			x = xi - rect.left;
			y = yi - rect.top;
		}
		var centerX = rect.width / 2;
		var centerY = rect.height / 2;
		x -= centerX;
		y -= centerY;
		var r = Math.sqrt(x * x + y * y);
		var theta = Math.atan2(y, x);
		theta -= this.zoom.toRadians(this.canvasAngle);
		x = r * Math.cos(theta);
		y = r * Math.sin(theta);

		var rawX = (x + centerX) / this.canvasScale;
		var rawY = (y + centerY) / this.canvasScale;
		rawX +=
			(0.5 - rect.width / (this.canvasScale * this.baseCanvasWidth) / 2) *
			this.baseCanvasWidth;
		rawY +=
			(0.5 - rect.height / (this.canvasScale * this.baseCanvasHeight) / 2) *
			this.baseCanvasHeight;
		x = Math.floor(rawX);
		y = Math.floor(rawY);
		return { rawX, rawY, x, y };
	}
}

function generateGridImageData(w, h, gridSize = 8) {
	let data = new Uint8Array(w * h * 4);
	for (let i = 0; i < w * h; i++) {
		let x = i % w;
		let y = Math.floor(i / w);
		let color = 240;
		if (Math.floor(x / gridSize) % 2 == 0) {
			if (Math.floor(y / gridSize) % 2 == 0) {
				color = 255;
			}
		} else {
			if (Math.floor(y / gridSize) % 2 == 1) {
				color = 255;
			}
		}
		data[i * 4 + 0] = color;
		data[i * 4 + 1] = color;
		data[i * 4 + 2] = color;
		data[i * 4 + 3] = 255;
	}
	return data;
}

window.mouseX = window.mouseY = 1;
document.onpointermove = function (e) {
	window.mouseX = e.clientX;
	window.mouseY = e.clientY;
};
