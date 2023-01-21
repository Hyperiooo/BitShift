class Canvas {
	constructor(width, height) {
		document.documentElement.style.setProperty("--canvX", width + "px");
		document.documentElement.style.setProperty("--canvY", height + "px");

		this.canvasParent = document.getElementById("canvas-parent");
		this.canvasParent.addEventListener("touchmove", (e) => {
			e.preventDefault();
		});

		this.undoBuffer = "";
		this.redoBuffer = "";

		this.initialScale = 1;
		this.canvScale = settings.ui.canvasScale;
		this.previewcanvas = document.querySelector("#previewcanv");
		this.selectionCanvas = document.createElement("canvas");
		this.selectionBufferCanvas = document.createElement("canvas");
		this.sctx = this.selectionCanvas.getContext("2d");
		//document.body.appendChild(this.selectionCanvas)
		//document.body.appendChild(this.selectionBufferCanvas)
		this.cursorGroup = document.querySelector("#cursorGroup");
		this.cursorGroup.setAttribute("viewBox", "0 0 " + width + " " + height);
		this.selectionGroup = document.querySelector("#selectionGroup");
		this.boundingGroup = document.querySelector("#boundingGroup");
		this.boundingSVG = document.querySelector("#boundingSVG");
		this.selectionSVG = document.querySelector("#selectionSVG");
		this.cursorSVG = document.querySelector("#cursorSVG");
		this.selectionGroup.setAttribute("viewBox", "0 0 " + width + " " + height);
		this.eyedropperPreviewCanvas = document.getElementById(
			"eyedropperPreviewCanvas"
		);
		this.eyedropperPreviewElement =
			document.getElementById("eyedropper-preview");
		this.eyedropperPreviewCtx = this.eyedropperPreviewCanvas.getContext("2d");

		document.querySelectorAll(".layerWrapperWrapper").forEach((e) => {
			e.setAttribute(
				"viewBox",
				"0 0 " + window.innerWidth + " " + window.innerHeight
			);
		});
		this.boundingSVG.setAttribute(
			"viewBox",
			"0 0 " + window.innerWidth + " " + window.innerHeight
		);
		this.selectionSVG.setAttribute(
			"viewBox",
			"0 0 " + window.innerWidth + " " + window.innerHeight
		);
		this.cursorSVG.setAttribute(
			"viewBox",
			"0 0 " + window.innerWidth + " " + window.innerHeight
		);
		window.addEventListener("resize", () => {
			this.boundingSVG.setAttribute(
				"viewBox",
				"0 0 " + window.innerWidth + " " + window.innerHeight
			);
			this.selectionSVG.setAttribute(
				"viewBox",
				"0 0 " + window.innerWidth + " " + window.innerHeight
			);

			this.cursorSVG.setAttribute(
				"viewBox",
				"0 0 " + window.innerWidth + " " + window.innerHeight
			);
			document.querySelectorAll(".layerWrapperWrapper").forEach((e) => {
				e.setAttribute(
					"viewBox",
					"0 0 " + window.innerWidth + " " + window.innerHeight
				);
			});
		});
		this.bggridcanvas = document.querySelector("#bggridcanv");
		this.eBufferCanvas = document.getElementById("eraserBrushBufferParent");
		this.inputLayer = document.getElementById("input-layer");
		this.newLayerParent = document.getElementById("layerParent");
		this.ectx = this.eBufferCanvas.getContext("2d");
		document.documentElement.style.setProperty("--canvScale", this.canvScale);
		this.bggridcanvas.width = width;
		this.bggridcanvas.height = height;
		this.previewcanvas.width = width;
		this.previewcanvas.height = height;
		this.selectionCanvas.width = width;
		this.selectionCanvas.height = height;
		this.selectionCanvas.style.width = "500px";
		this.selectionCanvas.classList.add("bufferCanvas");
		this.selectionBufferCanvas.width = width;
		this.selectionBufferCanvas.height = height;
		this.selectionBufferCanvas.style.width = "500px";
		this.selectionBufferCanvas.classList.add("bufferCanvas");
		this.width = width;
		this.height = height;
		this.inputLayer.width = this.width;
		this.inputLayer.height = this.height;
		this.inputLayer.style.width = this.width + "px";
		this.inputLayer.style.height = this.height + "px";
		if (
			window.innerHeight / this.height / 1.25 <
			window.innerWidth / this.width / 1.25
		) {
			settings.ui.canvasScale = window.innerHeight / this.height / 1.25;
		} else {
			settings.ui.canvasScale = window.innerWidth / this.width / 1.25;
		}
		this.previewcanvas.style.display = "block";
		this.bggridcanvas.style.display = "block";
		this.w = width;
		this.h = height;
		this.ctx;
		this.pctx = this.previewcanvas.getContext("2d");
		this.bggctx = this.bggridcanvas.getContext("2d");
		this.data = [...Array(this.width)].map((e) =>
			Array(this.height).fill([255, 255, 255, 255])
		);
		this.steps = [];
		this.redo_arr = [];
		this.frames = [];
		this.sX = null;
		this.sY = null;
		this.tempL = null;
		this.linePoints = [];
		this.filledData = {};
		this.shiftKey = false;
		this.ctrlKey = false;
		this.altKey = false;
		this.wasInCanv = false;
		this.drawBgGrid();
		this.currentX = 0;
		this.currentY = 0;

		this.panzoom = panzoom(this.inputLayer, {
			smoothScroll: false,
			initialZoom: settings.ui.canvasScale,
			zoomSpeed: 0.15,
			onDoubleClick: function (e) {
				return false;
			},
			beforeMouseDown: function (e) {
				return e.button != 1;
			},
			beforeTouchDown: function (e) {
				return !(e.touches.length > 1);
			},
			zoomDoubleClickSpeed: 1,
			maxZoom: 200,
			minZoom: 0.1,
		});

		this.panzoom.moveTo(
			(window.innerWidth - this.width * settings.ui.canvasScale) / 2,
			(window.innerHeight - this.height * settings.ui.canvasScale) / 2
		);
		var _self = this;
		this.panzoom.on(
			"transform",
			function (e) {
				_self.inputLayer.style.transform;
				_self.inputLayer.style.transformOrigin;
				_self.setCanvScale(_self.panzoom.getTransform().scale);
				_self.setCanvTransform(
					_self.panzoom.getTransform().x,
					_self.panzoom.getTransform().y
				);
				document.body.style.setProperty(
					"--panzoomTransformMatrix",
					_self.inputLayer.style.transform
				);
				document.body.style.setProperty(
					"--panzoomTransformOrigin",
					_self.inputLayer.style.transformOrigin
				);
				var rect = _self.inputLayer.getBoundingClientRect();
				document.body.style.setProperty("--scaledX", rect.left + "px");
				document.body.style.setProperty("--scaledY", rect.top + "px");

				document.body.style.setProperty("--scaledWidth", rect.width + "px");

				document.body.style.setProperty("--scaledHeight", rect.height + "px");
			}.bind(this)
		);

		this.startZoomX = 0;
		this.startZoomY = 0;
		this.deltaX = 0;
		this.deltaY = 0;
		this.deltaPanX = 0;
		this.deltaPanY = 0;
		this.panning = false;

		this.mouseDownEvent = (e) => {
			if (e.button == 1) this.panning = true;
			if (e.button != 0) {
				return;
			}
			this.inputDown(e);
			this.inputActive(e);
		};

		this.touchStartEvent = (e) => {
			this.inputDown(e);
			if (e.touches.length > 1) {
				this.panning = true;
				this.deltaX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
				this.deltaY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
			} else {
				this.deltaX = e.touches[0].clientX;
				this.deltaY = e.touches[0].clientY;
			}
		};

		this.moveEvent = (e) => {
			var x, y;
			if (e.touches && e.touches.length > 1) {
				x = (e.touches[0].clientX + e.touches[1].clientX) / 2;
				y = (e.touches[0].clientY + e.touches[1].clientY) / 2;
			} else if (e.touches) {
				x = e.touches[0].clientX;
				y = e.touches[0].clientY;
			}

			if (e.touches && e.touches.length > 1) {
				this.panning = true;
				this.panzoom.moveBy(-(this.deltaX - x), -(this.deltaY - y));
				this.deltaX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
				this.deltaY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
				return;
			} else {
			}

			if (e.button) {
				if (e.button != 0) return;
			}

			this.inputActive(e);
		};

		this.mouseUpEvent = (e) => {
			this.prevTX = null;
			this.prevTY = null;
			this.inputUp(e, this.panning);
			this.panning = false;
		};

		this.touchEndEvent = (e) => {
			this.inputUp(e, this.panning);

			if (e.touches.length == 0) this.panning = false;
		};

		this.clickEvent = (e) => {
			var rect = this.inputLayer.getBoundingClientRect();
			var x, y;
			if (e.touches) {
				x = e.touches[0].clientX;
				y = e.touches[0].clientY;
			} else {
				x = e.clientX;
				y = e.clientY;
			}
			x = x - rect.left;
			y = y - rect.top;
			x = Math.floor(
				(this.width * x) / (this.inputLayer.clientWidth * this.canvScale)
			);
			y = Math.floor(
				(this.height * y) / (this.inputLayer.clientHeight * this.canvScale)
			);
		};
		this.touching = false;

		this.canvasParent.addEventListener("touchmove", this.moveEvent);
		this.canvasParent.addEventListener("mousemove", this.moveEvent);
		this.canvasParent.addEventListener("touchstart", this.touchStartEvent);
		this.canvasParent.addEventListener("mousedown", this.mouseDownEvent);
		this.canvasParent.addEventListener("touchstart", this.touchStartEvent);
		this.canvasParent.addEventListener("touchend", this.touchEndEvent);
		this.canvasParent.addEventListener("mouseup", this.mouseUpEvent);
		this.canvasParent.addEventListener("touchstart", this.clickEvent);
		this.canvasParent.addEventListener("click", this.clickEvent);
	}
	recenter() {
		var targetCanvasScale;
		if (
			window.innerHeight / this.height / 1.25 <
			window.innerWidth / this.width / 1.25
		) {
			targetCanvasScale = window.innerHeight / this.height / 1.25;
		} else {
			targetCanvasScale = window.innerWidth / this.width / 1.25;
		}
		var targetX = (window.innerWidth - this.width * targetCanvasScale) / 2;
		var targetY = (window.innerHeight - this.height * targetCanvasScale) / 2;
		var _self = this;
		var lerpFactor = 0.25;
		function animateSmoothRecenter() {
			_self.panzoom.zoomAbs(
				window.innerWidth / 2,
				window.innerHeight / 2,
				lerp(settings.ui.canvasScale, targetCanvasScale, lerpFactor)
			);
			_self.panzoom.moveTo(
				lerp(_self.panzoom.getTransform().x, targetX, lerpFactor),
				lerp(_self.panzoom.getTransform().y, targetY, lerpFactor)
			);
			if (Math.abs(settings.ui.canvasScale - targetCanvasScale) < 0.01) {
				settings.ui.canvasScale = targetCanvasScale;
			}
			//cancel request if close enough
			if (
				Math.abs(settings.ui.canvasScale - targetCanvasScale) >= 0.01 ||
				Math.abs(targetX - _self.panzoom.getTransform().x) >= 0.01 ||
				Math.abs(targetY - _self.panzoom.getTransform().y) >= 0.01
			) {
				requestAnimationFrame(animateSmoothRecenter);
			} else {
				_self.panzoom.zoomAbs(
					window.innerWidth / 2,
					window.innerHeight / 2,
					targetCanvasScale
				);
				_self.panzoom.moveTo(targetX, targetY);
			}
		}
		var transf = {
			x: { ..._self.panzoom.getTransform() }.x,
			y: { ..._self.panzoom.getTransform() }.y,
			scale: settings.ui.canvasScale,
		};
		if (
			transf.x == targetX &&
			transf.y == targetY &&
			transf.scale == targetCanvasScale
		)
			return;

		anime({
			targets: transf,
			x: targetX,
			y: targetY,
			scale: targetCanvasScale,
			easing: "linear",
			duration: 800,
			easing: "easeInOutBack",
			update: function () {
				_self.panzoom.zoomAbs(
					window.innerWidth / 2,
					window.innerHeight / 2,
					transf.scale
				);
				_self.panzoom.moveTo(transf.x, transf.y);
			},
		});
		//requestAnimationFrame(animateSmoothRecenter);
	}
	destroy() {
		this.panzoom.dispose();
		this.canvasParent.removeEventListener("touchmove", this.moveEvent);
		this.canvasParent.removeEventListener("mousemove", this.moveEvent);
		this.canvasParent.removeEventListener("touchstart", this.touchStartEvent);
		this.canvasParent.removeEventListener("mousedown", this.mouseDownEvent);
		this.canvasParent.removeEventListener("touchstart", this.touchStartEvent);
		this.canvasParent.removeEventListener("touchend", this.touchEndEvent);
		this.canvasParent.removeEventListener("mouseup", this.mouseUpEvent);
	}
	inputDown(e) {
		closeAllToolPopups();
		updatePrevious(this.color);
		var rect = this.inputLayer.getBoundingClientRect();
		var x = e.clientX - rect.left || e.touches[0].clientX - rect.left;
		var y = e.clientY - rect.top || e.touches[0].clientY - rect.top;
		x = Math.floor(
			(this.width * x) / (this.inputLayer.clientWidth * this.canvScale)
		);
		y = Math.floor(
			(this.height * y) / (this.inputLayer.clientHeight * this.canvScale)
		);
		if (
			Tools.circle ||
			Tools.ellipse ||
			Tools.filledEllipse ||
			Tools.ellipseMarquee ||
			Tools.line ||
			Tools.rectangle ||
			Tools.filledRectangle ||
			Tools.rectangleMarquee ||
			Tools.pen ||
			Tools.eraser
		) {
			this.sX = x;
			this.sY = y;
		}
		this.touching = true;

		this.undoBuffer = layer.canvasElement.toDataURL();
	}
	inputUp(e, wasPanning) {
		if (
			Tools.circle ||
			Tools.ellipse ||
			Tools.filledEllipse ||
			Tools.line ||
			Tools.rectangle ||
			Tools.filledRectangle
		) {
			var p;
			for (p of this.tempL) this.draw(p);
			console.log(this.tempL);
			this.clearPreview();
			this.tempL = [];
		}
		if (Tools.rectangleMarquee) {
			var p;
			if (settings.tools.selectionMode.value == "replace") {
				selectionPath = [];
				this.sctx.clearRect(0, 0, this.width, this.height);
			}
			for (p of this.tempL) {
				this.sBufferDraw(p);
				if (p.constructor.name == "Rect") {
					var q = {};
					if (p.x1 > p.x2) {
						q.x1 = p.x2;
						q.x2 = p.x1 + 1;
					} else if (p.x1 < p.x2) {
						q.x1 = p.x1;
						q.x2 = p.x2 + 1;
					} else if (p.x1 == p.x2) {
						q.x1 = p.x1;
						q.x2 = p.x2 + 1;
					}
					if (p.y1 > p.y2) {
						q.y1 = p.y2;
						q.y2 = p.y1 + 1;
					} else if (p.y1 < p.y2) {
						q.y1 = p.y1;
						q.y2 = p.y2 + 1;
					} else if (p.y1 == p.y2) {
						q.y1 = p.y1;
						q.y2 = p.y2 + 1;
					}
					modifySelectionPath(
						q.x1,
						q.y1,
						q.x2,
						q.y2,
						settings.tools.selectionMode.value
					);
				}
			}
			this.clearPreview();
			this.tempL = [];
		}
		if (Tools.ellipseMarquee) {
			var p;
			if (settings.tools.selectionMode.value == "replace") {
				selectionPath = [];
				this.sctx.clearRect(0, 0, this.width, this.height);
			}
			for (p of this.tempL) {
				this.sBufferDraw(p);
				if (p.constructor.name == "Rect") {
					var q = {};
					modifySelectionPath(
						p.x1,
						p.y1,
						p.x2,
						p.y2 + 1,
						settings.tools.selectionMode.value
					);
				}
			}
			this.clearPreview();
			this.tempL = [];
		}
		if (!wasPanning) {
			if (Tools.fillBucket && settings.tools.contiguous.value) {
				this.filler(
					this.lastKnownX,
					this.lastKnownY,
					this.data[this.lastKnownX][this.lastKnownY]
				);
			} else if (Tools.fillBucket && !settings.tools.contiguous.value) {
				this.fillerNonContiguous(new Point(this.lastKnownX, this.lastKnownY));
			}
		}
		this.sX = null;
		this.sY = null;
		updateCanvasPreview();
		clearSVGBrushPreviews();
		this.linePoints = [];
		this.redoBuffer = layer.canvasElement.toDataURL();
		var buf = this.undoBuffer;
		var rbuf = this.redoBuffer;
		var curCtx = layer.ctx;
		var curCanv = layer.canvasElement;
		var uCallback = function () {
			var img = new window.Image();
			img.setAttribute("src", buf);
			img.onload = function () {
				curCtx.clearRect(0, 0, curCanv.width, curCanv.height);
				curCtx.drawImage(img, 0, 0);
			};
		};
		var rCallback = function () {
			var img = new window.Image();
			img.setAttribute("src", rbuf);
			img.onload = function () {
				curCtx.clearRect(0, 0, curCanv.width, curCanv.height);
				curCtx.drawImage(img, 0, 0);
			};
		};
		//debug.log("wasPanning: " + wasPanning)
		if (!wasPanning) addToUndoStack(uCallback, rCallback);
		this.touching = false;
		if (Tools.eyedropper) {
			setTool(previousTool);
			this.eyedropperPreviewElement.classList.remove(
				"eyedropper-preview-visible"
			);
		}
		if (this.canvasUpdated) {
			this.canvasUpdated = false;

			window.dispatchEvent(window.cloudSyncEvent);
		}
	}
	inputActive(e) {
		this.touching = true;
		this.shiftKey = e.shiftKey;
		this.ctrlKey = e.ctrlKey;
		this.altKey = e.altKey;
		var rect = this.inputLayer.getBoundingClientRect();
		var x = e.clientX - rect.left || e.touches[0].clientX - rect.left || -1;
		var y = e.clientY - rect.top || e.touches[0].clientY - rect.top || -1;
		var rawX = x / this.canvScale;
		var rawY = y / this.canvScale;
		x = Math.floor(x / this.canvScale);
		y = Math.floor(y / this.canvScale);
		var clientX = e.clientX || e.touches[0].clientX;
		var clientY = e.clientY || e.touches[0].clientY;
		this.currentX = x;
		this.currentY = y;
		this.lastKnownX = x;
		this.lastKnownY = y;
		if (Tools.transform) return;
		if (Tools.eraser) {
			drawEraserPreview(x, y);
		}
		if (Tools.sprayPaint) {
			drawSprayPreview(x, y);
		}
		if (e.buttons != 0) {
			//calls whenever there is touch
			if (activeLayer.settings.locked) return;
			if (this.sX === null || this.sY === null) {
				if (!Tools.sprayPaint && !Tools.eyedropper) return;
			}
			if (Tools.pen) {
				let P = line(new Point(this.sX, this.sY), new Point(x, y));
				let p;
				//notify.log(Math.floor(normalize(e.changedTouches[0].force, 10) * 5))
				for (p of P) {
					this.draw(new Point(p.x, p.y));
					//adjust brush size based on force
					let brushSize = parseInt(settings.tools.penBrushSize.value);
					let r = brushSize - 1;
					//let c = filledEllipse(p.x, p.y, 2, 2)
					let c;
					if (brushSize % 2 == 0) {
						c = filledEllipse(
							p.x - r / 2 - 0.5,
							p.y - r / 2 - 0.5,
							p.x + r / 2 - 0.5,
							p.y + r / 2 - 0.5
						);
					} else if (brushSize % 2 != 0) {
						c = filledEllipse(
							p.x - r / 2,
							p.y - r / 2,
							p.x + r / 2,
							p.y + r / 2
						);
					}
					var b;
					for (b of c) this.draw(b);
				}
				this.draw(new Point(x, y));
				this.sX = x;
				this.sY = y;
			} else if (Tools.sprayPaint) {
				if (this.panning) return;
				let brushSize = parseInt(settings.tools.spraySize.value);
				let r = brushSize - 1;
				//let c = filledEllipse(p.x, p.y, 2, 2)
				let c;
				if (brushSize % 2 == 0) {
					c = filledEllipse(
						x - r / 2 - 0.5,
						y - r / 2 - 0.5,
						x + r / 2 - 0.5,
						y + r / 2 - 0.5
					);
				} else if (brushSize % 2 != 0) {
					c = filledEllipse(x - r / 2, y - r / 2, x + r / 2, y + r / 2);
				}
				var b = [];
				c.forEach((e) => {
					for (let i = 0; i < e.x2 - e.x1; i++) {
						b.push(new Point(e.x1 + i, e.y1));
					}
				});
				var d = [];
				for (let i = 0; i < parseInt(settings.tools.spraySpeed.value); i++) {
					d.push(b[Math.floor(Math.random() * b.length)]);
				}
				d.forEach((e) => {
					let p = e;
					this.draw(new Point(p.x, p.y));
					let brushSize = parseInt(settings.tools.sprayBrushSize.value);
					let r = brushSize - 1;
					//let c = filledEllipse(p.x, p.y, 2, 2)
					let c;
					if (brushSize % 2 == 0) {
						c = filledEllipse(
							p.x - r / 2 - 0.5,
							p.y - r / 2 - 0.5,
							p.x + r / 2 - 0.5,
							p.y + r / 2 - 0.5
						);
					} else if (brushSize % 2 != 0) {
						c = filledEllipse(
							p.x - r / 2,
							p.y - r / 2,
							p.x + r / 2,
							p.y + r / 2
						);
					}
					var a;
					for (a of c) this.draw(a);
				});
			} else if (Tools.eraser) {
				this.ctx.globalCompositeOperation = "destination-out";
				let P = line(new Point(this.sX, this.sY), new Point(x, y));
				let p;
				for (p of P) {
					this.erase(new Point(p.x, p.y));
					let brushSize = parseInt(settings.tools.eraserBrushSize.value);
					let r = brushSize - 1;
					//let c = filledEllipse(p.x, p.y, 2, 2)
					let c;
					if (brushSize % 2 == 0) {
						c = filledEllipse(
							p.x - r / 2 - 0.5,
							p.y - r / 2 - 0.5,
							p.x + r / 2 - 0.5,
							p.y + r / 2 - 0.5
						);
					} else if (brushSize % 2 != 0) {
						c = filledEllipse(
							p.x - r / 2,
							p.y - r / 2,
							p.x + r / 2,
							p.y + r / 2
						);
					}
					var b;
					for (b of c) this.erase(b);
				}
				this.erase(new Point(x, y));
				this.sX = x;
				this.sY = y;
				this.ctx.globalCompositeOperation = "source-over";
			} else if (Tools.eyedropper) {
				this.eyedropperPreviewElement.style.top = clientY + "px";
				this.eyedropperPreviewElement.style.left = clientX + "px";
				this.eyedropperPreviewElement.classList.add(
					"eyedropper-preview-visible"
				);
				this.eyedropperPreviewCanvas.style.setProperty(
					"--x",
					rawX / this.width
				);
				this.eyedropperPreviewCanvas.style.setProperty(
					"--y",
					rawY / this.width
				);
				this.setColor(this.getEyedropperPixelCol(new Point(x, y)));
			}
			if (preview) {
				this.clearPreview();
				if (Tools.ellipse || Tools.filledEllipse || Tools.ellipseMarquee) {
					if (this.shiftKey) {
						var centre = new Point(this.sX, this.sY);
						//var radius = +prompt("radius?");
						let r = 0;
						let c = 0;
						if (!this.ctrlKey) {
							if (x - this.sX > y - this.sY) {
								r = Math.abs(x - this.sX) / 2;
							} else if (x - this.sX <= y - this.sY) {
								r = Math.abs(y - this.sY) / 2;
							}
							if (x - this.sX >= 0 && y - this.sY >= 0) {
								// bottom right
								if (x - this.sX > y - this.sY) {
									let mid = (this.sX + x) / 2 - this.sX;
								} else if (x - this.sX <= y - this.sY) {
									let mid = (this.sY + y) / 2 - this.sY;
								}
							} else if (x - this.sX < 0 && y - this.sY < 0) {
								// top left
								if (x - this.sX > y - this.sY) {
									let mid = (this.sX + x) / 2 - this.sX;
								} else if (x - this.sX <= y - this.sY) {
									let mid = (this.sY + y) / 2 - this.sY;
								}
							}
							if (x - this.sX < 0 && y - this.sY >= 0) {
								// bottom left
								if (x - this.sX > y - this.sY) {
									let mid = (this.sX + x) / 2 - this.sX;
								} else if (x - this.sX <= y - this.sY) {
									let mid = (this.sY + y) / 2 - this.sY;
								}
							} else if (x - this.sX >= 0 && y - this.sY < 0) {
								// top right
								if (x - this.sX > y - this.sY) {
									let mid = (this.sX + x) / 2 - this.sX;
								} else if (x - this.sX <= y - this.sY) {
									let mid = (this.sY + y) / 2 - this.sY;
								}
							}
							c = new Point(this.sX, this.sY);
						}
						if (this.ctrlKey) {
							c = new Point(this.sX, this.sY);
							if (x - this.sX > y - this.sY) {
								r = Math.abs(x - this.sX);
							} else if (x - this.sX <= y - this.sY) {
								r = Math.abs(y - this.sY);
							}
						}

						var q = {};
						if (c.x + r * 2 > c.x) {
							q.x1 = c.x;
							q.x2 = c.x + r * 2;
						} else if (c.x + r * 2 < c.x) {
							q.x1 = c.x + r * 2;
							q.x2 = c.x;
						} else if (c.x + r * 2 == c.x) {
							q.x1 = c.x + r * 2;
							q.x2 = c.x;
						}
						if (c.y + r * 2 > c.y) {
							q.y1 = c.y;
							q.y2 = c.y + r * 2;
						} else if (c.y + r * 2 < c.y) {
							q.y1 = c.y + r * 2;
							q.y2 = c.y;
						} else if (c.y + r * 2 == c.y) {
							q.y1 = c.y + r * 2;
							q.y2 = c.y;
						}
						if (Tools.ellipse) this.tempL = ellipse(q.x1, q.y1, q.x2, q.y2);
						if (Tools.filledEllipse || Tools.ellipseMarquee)
							this.tempL = filledEllipse(q.x1, q.y1, q.x2, q.y2);

						//if (Tools.ellipse) this.tempL = ellipse(c.x + (r * 2), c.y + (r * 2), c.x, c.y)
						//if (Tools.filledEllipse || Tools.ellipseMarquee) this.tempL = filledEllipse(c.x + (r * 2), c.y + (r * 2), c.x, c.y)
						if (settings.tools.shapeFilled.value)
							this.filledData = { r: math.floor(r), c: c };
						var p;
						for (p of this.tempL) this.pDraw(p);
					} else if (!this.shiftKey) {
						let c = new Point(this.sX, this.sY);
						if (this.ctrlKey) {
							c = new Point(this.sX - (x - this.sX), this.sY - (y - this.sY));
						}
						//this.tempL = ellipse(this.round(Math.abs(x - c.x) / 2, .5), this.round(Math.abs(y - c.y) / 2, .5), c);

						var q = {};
						if (c.x > x) {
							q.x1 = x;
							q.x2 = c.x;
						} else if (c.x < x) {
							q.x1 = c.x;
							q.x2 = x;
						} else if (c.x == x) {
							q.x1 = c.x;
							q.x2 = x;
						}
						if (c.y > y) {
							q.y1 = y;
							q.y2 = c.y;
						} else if (c.y < y) {
							q.y1 = c.y;
							q.y2 = y;
						} else if (c.y == y) {
							q.y1 = c.y;
							q.y2 = y;
						}
						if (Tools.ellipse) this.tempL = ellipse(q.x1, q.y1, q.x2, q.y2);
						if (Tools.filledEllipse || Tools.ellipseMarquee)
							this.tempL = filledEllipse(q.x1, q.y1, q.x2, q.y2);
						var p;
						for (p of this.tempL) this.pDraw(p);
						//if(this.ctrlKey) console.log('control hehe')
					}
				}
				if (Tools.line) {
					console.log("a");
					let c = new Point(this.sX, this.sY);
					this.tempL = line(c, new Point(x, y));
					var p;
					for (p of this.tempL) this.pDraw(new Point(p.x, p.y));
				}
				if (
					Tools.rectangle ||
					Tools.filledRectangle ||
					Tools.rectangleMarquee
				) {
					if (this.shiftKey) {
						let c = 0;
						let e = new Point(x, y);
						if (this.ctrlKey) {
							c = new Point(this.sX, this.sY);
							if (e.x - c.x >= 0 && e.y - c.y >= 0) {
								if (e.x - c.x > e.y - c.y) {
									e.x = c.x + Math.abs(e.y - c.y);
								} else if (e.x - c.x <= e.y - c.y) {
									e.y = c.y + Math.abs(e.x - c.x);
								}
							} else if (e.x - c.x < 0 && e.y - c.y < 0) {
								if (e.x - c.x > e.y - c.y) {
									e.y = c.y - Math.abs(e.x - c.x);
								} else if (e.x - c.x <= e.y - c.y) {
									e.x = c.x - Math.abs(e.y - c.y);
								}
							} else if (e.x - c.x < 0 && e.y - c.y >= 0) {
								if (c.x - e.x > e.y - c.y) {
									e.x = c.x - Math.abs(e.y - c.y);
								} else if (c.x - e.x <= e.y - c.y) {
									e.y = c.y + Math.abs(e.x - c.x);
								}
							} else if (e.x - c.x >= 0 && e.y - c.y < 0) {
								if (e.x - c.x > c.y - e.y) {
									e.x = c.x + Math.abs(e.y - c.y);
								} else if (e.x - c.x <= c.y - e.y) {
									e.y = c.y - Math.abs(e.x - c.x);
								}
							}
							c = new Point(
								this.sX - (e.x - this.sX),
								this.sY - (e.y - this.sY)
							);
						}
						if (!this.ctrlKey) {
							c = new Point(this.sX, this.sY);
							if (e.x - c.x >= 0 && e.y - c.y >= 0) {
								if (e.x - c.x > e.y - c.y) {
									e.x = c.x + Math.abs(e.y - c.y);
								} else if (e.x - c.x <= e.y - c.y) {
									e.y = c.y + Math.abs(e.x - c.x);
								}
							} else if (e.x - c.x < 0 && e.y - c.y < 0) {
								if (e.x - c.x > e.y - c.y) {
									e.y = c.y - Math.abs(e.x - c.x);
								} else if (e.x - c.x <= e.y - c.y) {
									e.x = c.x - Math.abs(e.y - c.y);
								}
							} else if (e.x - c.x < 0 && e.y - c.y >= 0) {
								if (c.x - e.x > e.y - c.y) {
									e.x = c.x - Math.abs(e.y - c.y);
								} else if (c.x - e.x <= e.y - c.y) {
									e.y = c.y + Math.abs(e.x - c.x);
								}
							} else if (e.x - c.x >= 0 && e.y - c.y < 0) {
								if (e.x - c.x > c.y - e.y) {
									e.x = c.x + Math.abs(e.y - c.y);
								} else if (e.x - c.x <= c.y - e.y) {
									e.y = c.y - Math.abs(e.x - c.x);
								}
							}
						}

						if (Tools.rectangle) this.tempL = rectangle(c, e);
						if (Tools.filledRectangle || Tools.rectangleMarquee)
							this.tempL = filledRectangle(c, e);
						var p;
						for (p of this.tempL) this.pDraw(new Point(p.x, p.y));
					} else if (!this.shiftKey) {
						let c = new Point(this.sX, this.sY);
						if (this.ctrlKey) {
							c = new Point(this.sX - (x - this.sX), this.sY - (y - this.sY));
						}
						let e = new Point(x, y);
						if (Tools.rectangle) this.tempL = rectangle(c, e);
						if (Tools.filledRectangle || Tools.rectangleMarquee)
							this.tempL = filledRectangle(c, e);
						let aa = [];
						for (let p of this.tempL) this.pDraw(p);
					}
				}
			}
		} else if (e.buttons == 0) {
			//calls whenever there is no touch, aka previewing
			if (preview) {
				if (activeLayer.settings.locked) return;
				var tempCol;
				this.previewcanvas.style.setProperty("--opac", 1);
				if (Tools.eyedropper) return;
				if (Tools.eraser) {
					return;
				}
				this.clearPreview();
				if (isMobile) return;
				let brushSize = parseInt(settings.tools.penBrushSize.value);
				let r = brushSize - 1;
				if (Tools.fillBucket) r = 0;
				let c;
				if (brushSize % 2 == 0) {
					c = filledEllipse(
						x - r / 2 - 0.5,
						y - r / 2 - 0.5,
						x + r / 2 - 0.5,
						y + r / 2 - 0.5
					);
				} else if (brushSize % 2 != 0) {
					c = filledEllipse(x - r / 2, y - r / 2, x + r / 2, y + r / 2);
				}
				var b;
				for (b of c) {
					this.pDraw(b);
				}

				if (Tools.eraser) {
				}
			}
		}
	}
	round(value, step) {
		step || (step = 1.0);
		var inv = 1.0 / step;
		return Math.round(value * inv) / inv;
	}
	zoom(z) {
		this.setCanvScale(Math.max(settings.ui.canvasScale + z, 1));
	}
	setCanvScale(s) {
		settings.ui.canvasScale = s;
		this.canvScale = settings.ui.canvasScale;
		canvasResized();
		//document.documentElement.style.setProperty('--canvScale', this.canvScale);
	}
	setCanvTransform(x, y) {
		if (!this.prevTX) {
			this.prevTX = x;
		}
		if (!this.prevTY) {
			this.prevTY = y;
		}
		if (!this.prevTY || !this.prevTX) {
			return;
		}
		settings.ui.transformX = settings.ui.transformX + (x - this.prevTX);
		settings.ui.transformY = settings.ui.transformY + (y - this.prevTY);
		//document.documentElement.style.setProperty('--canvTransformX', settings.ui.transformX + "px");
		//document.documentElement.style.setProperty('--canvTransformY', settings.ui.transformY + "px");
		this.prevTX = x;
		this.prevTY = y;
	}
	drawBgGrid() {
		let nCol = Math.ceil(this.width / settings.background.width);
		let nRow = Math.ceil(this.height / settings.background.height);
		var ctx = this.bggctx;
		this.clearBgGrid();
		var w = settings.background.width;
		var h = settings.background.height;
		nRow = nRow || 8; // default number of rows
		nCol = nCol || 8; // default number of columns

		//w /= nCol;            // width of a block
		//h /= nRow;            // height of a block

		ctx.fillStyle = settings.background.colorOne;
		ctx.fillRect(0, 0, this.bggridcanvas.width, this.bggridcanvas.height);
		ctx.fillStyle = settings.background.colorTwo;
		for (var i = 0; i < nRow; ++i) {
			for (var j = 0, col = nCol / 2; j < col; ++j) {
				ctx.fillRect(2 * j * w + (i % 2 ? 0 : w), i * h, w, h);
			}
		}
	}

	clearBgGrid() {
		this.bggctx.globalCompositeOperation = "destination-out";
		this.bggctx.fillRect(0, 0, this.w, this.h);
		this.bggctx.globalCompositeOperation = "source-over";
	}

	clearPreview() {
		this.pctx.clearRect(0, 0, this.width, this.height);
	}
	draw(coord) {
		if (coord.constructor.name == "Point") {
			this.canvasUpdated = true;
			var x = coord.x;
			var y = coord.y;
			if (x === undefined || y === undefined) return;
			this.ctx.globalCompositeOperation = "source-over";
			if (isSelected()) {
				this.ctx.save();
				var clipPath = new Path2D();
				selectionPath.forEach((e) => {
					clipPath.moveTo(e[0].X, e[0].Y);
					for (let i = 0; i < e.length - 1; i++) {
						const pt = e[i + 1];
						clipPath.lineTo(pt.X, pt.Y);
					}
					clipPath.closePath();
				});
				this.ctx.clip(clipPath, "evenodd");
				this.ctx.fillRect(x, y, 1, 1);
				this.ctx.restore();
			} else {
				this.ctx.fillRect(x, y, 1, 1);
			}
		} else if (coord.constructor.name == "Rect") {
			this.canvasUpdated = true;
			var x1 = coord.x1;
			var y1 = coord.y1;
			var x2 = coord.x2;
			var y2 = coord.y2;
			if (
				x1 === undefined ||
				y1 === undefined ||
				x2 === undefined ||
				y2 === undefined
			)
				return;
			var ax1, ax2, ay1, ay2;
			this.pctx.globalCompositeOperation = "source-over";
			if (x1 >= x2) {
				ax1 = x2;
				ax2 = x1;
			} else if (x1 < x2) {
				ax1 = x1;
				ax2 = x2;
			}
			if (y1 >= y2) {
				ay1 = y2;
				ay2 = y1;
			} else if (y1 < y2) {
				ay1 = y1;
				ay2 = y2;
			}
			if (ay2 - ay1 == 0) ay2 = ay1 + 1;
			if (isSelected()) {
				this.ctx.save();
				var clipPath = new Path2D();
				selectionPath.forEach((e) => {
					clipPath.moveTo(e[0].X, e[0].Y);
					for (let i = 0; i < e.length - 1; i++) {
						const pt = e[i + 1];
						clipPath.lineTo(pt.X, pt.Y);
					}
					clipPath.closePath();
				});
				this.ctx.clip(clipPath, "evenodd");
				this.ctx.fillRect(ax1, ay1, ax2 - ax1, ay2 - ay1);
				this.ctx.restore();
			} else {
				this.ctx.fillRect(ax1, ay1, ax2 - ax1, ay2 - ay1);
			}
		}
	}
	sBufferDraw(coord) {
		this.sctx.fillStyle = "red";
		if (settings.tools.selectionMode.value == "replace") {
			this.sctx.globalCompositeOperation = "source-over";
		} else if (settings.tools.selectionMode.value == "add") {
			this.sctx.globalCompositeOperation = "source-over";
		} else if (settings.tools.selectionMode.value == "subtract") {
			this.sctx.globalCompositeOperation = "destination-out";
		}
		if (coord.constructor.name == "Point") {
			var x = coord.x;
			var y = coord.y;
			if (x === undefined || y === undefined) return;
			this.sctx.fillRect(x, y, 1, 1);
		} else if (coord.constructor.name == "Rect") {
			var x1 = coord.x1;
			var y1 = coord.y1;
			var x2 = coord.x2;
			var y2 = coord.y2;
			if (
				x1 === undefined ||
				y1 === undefined ||
				x2 === undefined ||
				y2 === undefined
			)
				return;
			var ax1, ax2, ay1, ay2;
			if (x1 >= x2) {
				ax1 = x2;
				ax2 = x1;
			} else if (x1 < x2) {
				ax1 = x1;
				ax2 = x2;
			}
			if (y1 >= y2) {
				ay1 = y2;
				ay2 = y1;
			} else if (y1 < y2) {
				ay1 = y1;
				ay2 = y2;
			}
			if (ay2 - ay1 == 0) ay2 = ay1 + 1;
			this.sctx.fillRect(ax1, ay1, ax2 - ax1, ay2 - ay1);
		}
	}
	clearPreviews() {
		this.pctx.clearRect(0, 0, this.width, this.height);
	}
	pDraw(coord) {
		this.pctx.fillStyle = this.color.hex;
		this.pctx.globalCompositeOperation = "source-over";
		this.previewcanvas.style.opacity = 1;
		if (Tools.rectangleMarquee || Tools.ellipseMarquee) {
			this.previewcanvas.style.opacity = 0.5;
			this.pctx.fillStyle =
				"rgba(" + 61 + "," + 135 + "," + 255 + "," + 255 + ")";
		}
		if (coord.constructor.name == "Point") {
			var x = coord.x;
			var y = coord.y;
			this.pctx.fillRect(x, y, 1, 1);
		} else if (coord.constructor.name == "Rect") {
			var x1 = coord.x1;
			var y1 = coord.y1;
			var x2 = coord.x2;
			var y2 = coord.y2;
			var ax1, ax2, ay1, ay2;
			if (x1 >= x2) {
				ax1 = x2;
				ax2 = x1;
			} else if (x1 < x2) {
				ax1 = x1;
				ax2 = x2;
			}
			if (y1 >= y2) {
				ay1 = y2;
				ay2 = y1;
			} else if (y1 < y2) {
				ay1 = y1;
				ay2 = y2;
			}
			if (ay2 - ay1 == 0) ay2 = ay1 + 1;
			this.pctx.fillRect(ax1, ay1, ax2 - ax1, ay2 - ay1);
		}
	}
	erase(coord) {
		if (coord.constructor.name == "Point") {
			var x = coord.x;
			var y = coord.y;
			if (isSelected()) {
				this.ctx.save();
				var clipPath = new Path2D();
				selectionPath.forEach((e) => {
					clipPath.moveTo(e[0].X, e[0].Y);
					for (let i = 0; i < e.length - 1; i++) {
						const pt = e[i + 1];
						clipPath.lineTo(pt.X, pt.Y);
					}
					clipPath.closePath();
				});
				this.ctx.clip(clipPath, "evenodd");
				this.ctx.fillRect(x, y, 1, 1);
				this.ctx.restore();
			} else {
				this.ctx.fillRect(x, y, 1, 1);
			}
		} else if (coord.constructor.name == "Rect") {
			var x1 = coord.x1;
			var y1 = coord.y1;
			var x2 = coord.x2;
			var y2 = coord.y2;
			var ax1, ax2, ay1, ay2;
			if (x1 >= x2) {
				ax1 = x2;
				ax2 = x1;
			} else if (x1 < x2) {
				ax1 = x1;
				ax2 = x2;
			}
			if (y1 >= y2) {
				ay1 = y2;
				ay2 = y1;
			} else if (y1 < y2) {
				ay1 = y1;
				ay2 = y2;
			}
			if (ay2 - ay1 == 0) ay2 = ay1 + 1;
			if (isSelected()) {
				this.ctx.save();
				var clipPath = new Path2D();
				selectionPath.forEach((e) => {
					clipPath.moveTo(e[0].X, e[0].Y);
					for (let i = 0; i < e.length - 1; i++) {
						const pt = e[i + 1];
						clipPath.lineTo(pt.X, pt.Y);
					}
					clipPath.closePath();
				});
				this.ctx.clip(clipPath, "evenodd");
				this.ctx.fillRect(ax1, ay1, ax2 - ax1, ay2 - ay1);
				this.ctx.restore();
			} else {
				this.ctx.fillRect(ax1, ay1, ax2 - ax1, ay2 - ay1);
			}
		}
	}
	eraseSelection() {
		if (isSelected()) {
			this.ctx.save();
			var clipPath = new Path2D();
			selectionPath.forEach((e) => {
				clipPath.moveTo(e[0].X, e[0].Y);
				for (let i = 0; i < e.length - 1; i++) {
					const pt = e[i + 1];
					clipPath.lineTo(pt.X, pt.Y);
				}
				clipPath.closePath();
			});
			this.ctx.clip(clipPath, "evenodd");
			this.ctx.clearRect(0, 0, canvasInterface.width, canvasInterface.height);
			this.ctx.restore();
		}
	}
	setColor(color, skipDuplicate) {
		if (!skipDuplicate) setPickerColor(color);
		if (skipDuplicate) updatePickerColor(color);
		this.color = color;
		document.documentElement.style.setProperty("--currentColor", color.hex);
		if (this.ctx) this.ctx.fillStyle = color.hex;
		this.pctx.fillStyle = color.hex;
		act(document.querySelectorAll(`[data-palette-color='${color.hexh}']`));
	}
	save() {
		this.canvas.toBlob(function (blob) {
			var url = URL.createObjectURL(blob);
			var link = document.createElement("a");
			link.download = "canvas.png";
			link.href = url;
			link.click();
		});
	}

	clear() {
		this.ctx.globalCompositeOperation = "destination-out";
		this.ctx.fillRect(0, 0, this.w, this.h);
		this.data = [...Array(this.width)].map((e) =>
			Array(this.height).fill([255, 255, 255, 255])
		);
		this.setColor(this.color);
		updateCanvasPreview();
	}

	clearCanv() {
		this.ctx.globalCompositeOperation = "destination-out";
		this.ctx.fillRect(0, 0, this.w, this.h);
	}

	colorPixel(pos) {
		this.imageData.data[pos] = this.color.rgba.r;
		this.imageData.data[pos + 1] = this.color.rgba.g;
		this.imageData.data[pos + 2] = this.color.rgba.b;
		this.imageData.data[pos + 3] = this.color.rgba.a;
	}

	matchStartColor(pos, sR, sG, sB, sA) {
		var r = this.imageData.data[pos],
			g = this.imageData.data[pos + 1],
			b = this.imageData.data[pos + 2],
			a = this.imageData.data[pos + 3];

		// If the current pixel matches the clicked color
		if (r === sR && g === sG && b === sB && a === sA) {
			return true;
		}

		// If current pixel matches the new color
		if (
			r === this.color[0] &&
			g === this.color[1] &&
			b === this.color[2] &&
			a === this.color[3]
		) {
			return false;
		}
		return false;
	}

	putImgData(d) {
		this.ctx.putImageData(d, 0, 0);
	}

	redraw() {
		this.clearCanv();

		this.putImgData(this.imageData);

		window.dispatchEvent(window.cloudSyncEvent);
	}

	getPixelCol(p) {
		var imgData = this.ctx.getImageData(0, 0, this.width, this.height);

		var pixel = (p.y * this.width + p.x) * 4;
		console.log(imgData.data[pixel + 3]);
		return new Color({
			r: imgData.data[pixel],
			g: imgData.data[pixel + 1],
			b: imgData.data[pixel + 2],
			a: imgData.data[pixel + 3],
		});
	}

	getEyedropperPixelCol(p) {
		var imgData = this.eyedropperPreviewCtx.getImageData(
			0,
			0,
			this.width,
			this.height
		);

		var pixel = (p.y * this.width + p.x) * 4;
		return new Color({
			r: 0 || imgData.data[pixel],
			g: 0 || imgData.data[pixel + 1],
			b: 0 || imgData.data[pixel + 2],
			a: 255 || imgData.data[pixel + 3],
		});
	}

	fillerNonContiguous(p) {
		var src = this.getPixelCol(p).rgba;
		console.log(src);
		var im = this.ctx.getImageData(0, 0, this.width, this.height);
		console.log(im.data[0], im.data[1], im.data[2], im.data[3]);
		for (var i = 0; i < im.data.length; i += 4) {
			if (
				im.data[i] === src.r &&
				im.data[i + 1] === src.g &&
				im.data[i + 2] === src.b &&
				im.data[i + 3] === src.a
			) {
				im.data[i] = this.color.rgba.r;
				im.data[i + 1] = this.color.rgba.g;
				im.data[i + 2] = this.color.rgba.b;
				im.data[i + 3] = this.color.rgba.a;
			}
		}
		this.imageData = im;
		this.redraw();
	}

	filler(startX, startY) {
		this.imageData = this.ctx.getImageData(0, 0, this.width, this.height);

		var pixelPos = (startY * this.width + startX) * 4,
			r = this.imageData.data[pixelPos],
			g = this.imageData.data[pixelPos + 1],
			b = this.imageData.data[pixelPos + 2],
			a = this.imageData.data[pixelPos + 3];
		if (
			r == this.color.rgba.r &&
			g == this.color.rgba.g &&
			b == this.color.rgba.b &&
			a == this.color.rgba.a
		)
			return;
		this.floodFill(startX, startY, r, g, b, a);

		this.redraw();
		updateCanvasPreview();
	}

	floodFill(startX, startY, startR, startG, startB, startA) {
		var newPos,
			x,
			y,
			pixelPos,
			reachLeft,
			reachRight,
			drawingBoundLeft = 0,
			drawingBoundTop = 0,
			drawingBoundRight = this.width - 1,
			drawingBoundBottom = this.height - 1,
			pixelStack = [[startX, startY]];

		while (pixelStack.length) {
			newPos = pixelStack.pop(); //sets newPos to start x and y in beginning
			x = newPos[0]; //sets x to x val of newPos
			y = newPos[1]; //sets y to y val of newPos

			// Get current pixel position
			pixelPos = (y * this.width + x) * 4;
			// Go up as long as the color matches and are inside the canvas
			while (
				y >= drawingBoundTop &&
				this.matchStartColor(pixelPos, startR, startG, startB, startA)
			) {
				y -= 1;
				pixelPos -= this.width * 4;
			}

			pixelPos += this.width * 4;
			//y += 1;
			reachLeft = false;
			reachRight = false;

			// Go down as long as the color matches and in inside the canvas
			while (
				y <= drawingBoundBottom &&
				this.matchStartColor(pixelPos, startR, startG, startB, startA)
			) {
				y += 1;

				this.colorPixel(pixelPos);

				if (x > drawingBoundLeft) {
					if (
						this.matchStartColor(pixelPos - 4, startR, startG, startB, startA)
					) {
						if (!reachLeft) {
							// Add pixel to stack
							pixelStack.push([x - 1, y]);
							reachLeft = true;
						}
					} else if (reachLeft) {
						reachLeft = false;
					}
				}

				if (x < drawingBoundRight) {
					if (
						this.matchStartColor(pixelPos + 4, startR, startG, startB, startA)
					) {
						if (!reachRight) {
							// Add pixel to stack
							pixelStack.push([x + 1, y]);
							reachRight = true;
						}
					} else if (reachRight) {
						reachRight = false;
					}
				}

				pixelPos += this.width * 4;
			}
		}
	}

	addFrame(data = null) {
		var img = new Image();
		img.src = data || this.canvas.toDataURL();
		this.frames.push([img, this.data.map((inner) => inner.slice())]);
	}

	deleteFrame(f) {
		this.frames.splice(f, 1);
	}

	loadFrame(f) {
		this.clear();
		var img = this.frames[f][1];
		var tmp_color = this.color;
		var tmp_alpha = this.ctx.globalAlpha;
		this.ctx.globalAlpha = 1;
		var i, j;
		for (i = 0; i < this.width; i++) {
			for (j = 0; j < this.height; j++) {
				this.setColor(img[i][j]);
				this.draw(i, j);
			}
		}
		this.setColor(tmp_color);
		this.ctx.globalAlpha = tmp_alpha;
	}

	renderGIF() {
		this.frames.forEach((frame) => {
			gif.addFrame(frame[0], {
				copy: true,
				delay: 100,
			});
		});
		gif.render();
	}

	/*
        addImage() {
            var _this = this;
            var fp = document.createElement("input");
            fp.type = "file";
            fp.click();
            fp.onchange = function (e) {
                var reader = new FileReader();
                reader.readAsDataURL(e.target.files[0]);
                reader.onload = function () {
                    var uimg = new Image();
                    uimg.src = reader.result;
                    uimg.width = _this.w;
                    uimg.height = _this.h;
                    uimg.onload = function () {
                        var pxc = document.createElement("canvas");
                        pxc.width = _this.w;
                        pxc.height = _this.h;
                        var pxctx = pxc.getContext("2d");
                        pxctx.drawImage(uimg, 0, 0, _this.w, _this.h);
                        var i, j;
                        for (i = 0; i < _this.width; i++) {
                            for (j = 0; j < _this.height; j++) {
                                var ctr = 0;
                                var avg = [0, 0, 0, 0];
                                var pix = pxctx.getImageData(10 * i, 10 * j, 10, 10).data;
                                pix.forEach((x, k) => { avg[k % 4] += x; if (k % 4 == 0) ctr++; });
                                avg = avg.map(x => ~~(x / ctr));
                                _this.setColor(avg);
                                _this.draw(i, j);
                            }
                        }
                    }
                }
            }
        }*/
}

class Frames {
	static open() {
		document.querySelector("#frames").style.display = "block";
		document.querySelector("#frames").style.transform =
			"translate(-50%,-50%) scale(1,1)";
		document.querySelector("#frames").focus();
		document.querySelector("#frames #gallery").innerHTML = "";
		for (var frame of canvasInterface.frames)
			document.querySelector("#frames #gallery").appendChild(frame[0]);
		document.querySelectorAll("#frames #gallery img").forEach((x, i) => {
			x.onclick = (e) => {
				canvasInterface.loadFrame(i);
				Frames.close();
			};
			x.oncontextmenu = (e) => {
				e.preventDefault();
				var del_confirmation = confirm("Delete?");
				if (del_confirmation) {
					canvasInterface.deleteFrame(i);
					Frames.open();
				}
			};
		});
	}
	static close() {
		document.querySelector("#frames").style.transform =
			"translate(-50%,-50%) scale(0,0)";
	}
}
