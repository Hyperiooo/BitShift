function prepareTransform() {
	var selectionRect = getSelectionBounds();
	if (selectionRect.width == 0 && selectionRect.height == 0) {
		selectAll();
		selectionRect = getSelectionBounds();
	}
	transformDummyCanvas.width = selectionRect.width;
	transformDummyCanvas.height = selectionRect.height;
	transformDummyCtx.save();
	var clipPath = new Path2D();
	selectionPath.forEach((e) => {
		clipPath.moveTo(e[0].X - selectionRect.x, e[0].Y - selectionRect.y);
		for (let i = 0; i < e.length - 1; i++) {
			const pt = e[i + 1];
			clipPath.lineTo(pt.X - selectionRect.x, pt.Y - selectionRect.y);
		}
		clipPath.closePath();
	});
	transformDummyCtx.clip(clipPath, "evenodd");
	transformDummyCtx.drawImage(
		canvasInterface.canvas,
		selectionRect.x,
		selectionRect.y,
		selectionRect.width,
		selectionRect.height,
		0,
		0,
		selectionRect.width,
		selectionRect.height
	);
	transformDummyCtx.restore();
	canvasInterface.eraseSelection();

	canvasInterface.pctx.clearRect(
		0,
		0,
		canvasInterface.width,
		canvasInterface.height
	);

	canvasInterface.previewcanvas.style.opacity = 1;
	canvasInterface.pctx.drawImage(
		transformDummyCanvas,
		selectionRect.x,
		selectionRect.y
	);
}
function confirmTransform() {
	scaleAlreadyMoving = false;
	//notify.log("Transformed", { icon: "hi-move" });
	pasted = false;
	canvasInterface.ctx.drawImage(canvasInterface.previewcanvas, 0, 0);
	canvasInterface.pctx.clearRect(
		0,
		0,
		canvasInterface.width,
		canvasInterface.height
	);
	transformDummyCtx.clearRect(
		0,
		0,
		transformDummyCanvas.width,
		transformDummyCanvas.height
	);
	updateCanvasPreview();
	prevMovementPosition = [0, 0];
	selectionMoving = false;
}
var hoveredHandle = "";
var selectionMoving = false;
var scaleMoving = false;
var scaleMovingHandle = "";
var scaleAlreadyMoving = false;
var prevMovementPosition = [0, 0];
var allHandles = [
	handlebl, // bottom left
	handlebr, // bottom right
	handletl, // top left
	handletr, // top right
	handlebm, // bottom
	handleml, // left
	handletm, // top
	handlemr, // right
];
function detectTransformHandleInteraction(e) {
	var transform = canvasInterface.zoom.getTransform();
	if (!transformHandlePositions) return;
	if (scaleMoving) return;
	transformHandlePositions.forEach((handle) => {
		var adjustedMousePos = canvasInterface.getCoordinatesFromInputEvent(e);
		adjustedMousePos.rawX *= transform.scale;
		adjustedMousePos.rawY *= transform.scale;
		if (
			Math.sqrt(
				Math.pow(handle.x - adjustedMousePos.rawX, 2) +
					Math.pow(handle.y - adjustedMousePos.rawY, 2)
			) < 12
		) {
			hoveredHandle = handle.name;
			var handleCursorSVG = "";
			var bg = getComputedStyle(document.documentElement)
			.getPropertyValue('--bg100');
			var txt = getComputedStyle(document.documentElement)
			.getPropertyValue('--textMain');
			if (hoveredHandle != "rot") {
				handleCursorSVG = `<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 32 32" width="30" height="30">
				<defs>
				  <style>
				  .cls-1 {
					fill: ${bg};
				  }
			
				  .cls-2 {
					fill: ${txt};
				  }
				  .shadow {
					filter: drop-shadow( 1px 1px 2px rgba(0, 0, 0, .35));
					/* Similar syntax to box-shadow */
				  }
				  </style>
				</defs>
				<g class="shadow">
				   <g xmlns="http://www.w3.org/2000/svg" transform-origin="15 15" transform="rotate(${
							handle.cursorAngle + transform.angle
						})">
						<path class="cls-2" d="m28.3,14.35l-3.84-3.84c-.91-.91-2.39-.91-3.3,0-.91.91-.91,2.39,0,3.3l.2.2h-10.7l.2-.2c.91-.91.91-2.39,0-3.3-.91-.91-2.39-.91-3.3,0l-3.84,3.84c-.44.44-.68,1.03-.68,1.65s.25,1.21.68,1.65l3.84,3.84c.46.46,1.05.68,1.65.68s1.2-.23,1.65-.68c.91-.91.91-2.39,0-3.3l-.2-.2h10.7l-.2.2c-.91.91-.91,2.39,0,3.3.46.46,1.05.68,1.65.68s1.2-.23,1.65-.68l3.84-3.84c.44-.44.68-1.03.68-1.65s-.25-1.21-.68-1.65Z"/>
  <path class="cls-1" d="m27.35,15.3l-3.84-3.84c-.39-.39-1.01-.39-1.4,0s-.39,1.01,0,1.4l2.15,2.15H7.74l2.15-2.15c.39-.39.39-1.01,0-1.4s-1.01-.39-1.4,0l-3.84,3.84c-.19.19-.29.44-.29.7s.1.51.29.7l3.84,3.84c.19.19.45.29.7.29s.51-.1.7-.29c.39-.39.39-1.01,0-1.4l-2.15-2.15h16.51l-2.15,2.15c-.39.39-.39,1.01,0,1.4.19.19.45.29.7.29s.51-.1.7-.29l3.84-3.84c.19-.19.29-.44.29-.7s-.1-.51-.29-.7Z"/>
  </g>
  </g>
			  </svg>`;
			} else {
				handleCursorSVG = `
				<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 32 32" width="30" height="30">
				<defs>
				  <style>
				  .cls-1 {
					fill: ${bg};
				  }
			
				  .cls-2 {
					fill: ${txt};
				  }
				  .shadow {
					filter: drop-shadow( 1px 1px 2px rgba(0, 0, 0, .35));
					/* Similar syntax to box-shadow */
				  }
				  </style>
				</defs>
				<g class="shadow">
				   <g xmlns="http://www.w3.org/2000/svg" transform-origin="15 15" transform="rotate(${
							handle.cursorAngle + transform.angle
						})">
						<path class="cls-2" d="m26.65,15.13c-1.1,0-1.99.89-1.99,1.99v.14l-.02-.02c-4.76-4.76-12.51-4.76-17.27,0l-.02.02v-.14c0-1.1-.89-1.99-1.99-1.99s-1.99.89-1.99,1.99v5.44c0,1.1.89,1.99,1.99,1.99h5.44c1.1,0,1.99-.89,1.99-1.99s-.89-1.99-1.99-1.99h-.14l.02-.02c2.94-2.94,7.72-2.94,10.66,0l.02.02h-.14c-1.1,0-1.99.89-1.99,1.99s.89,1.99,1.99,1.99h5.44c1.1,0,1.99-.89,1.99-1.99v-5.44c0-1.1-.89-1.99-1.99-1.99Z"/>
  						<path class="cls-1" d="m26.65,16.13c-.55,0-.99.44-.99.99v3.04l-1.97-1.97c-4.24-4.24-11.13-4.24-15.37,0l-1.97,1.97v-3.05c0-.55-.44-.99-.99-.99s-.99.44-.99.99v5.44c0,.55.44.99.99.99h5.44c.55,0,.99-.44.99-.99s-.44-.99-.99-.99h-3.04l1.97-1.97c1.68-1.68,3.91-2.6,6.28-2.6s4.6.92,6.28,2.6l1.97,1.97h-3.05c-.55,0-.99.44-.99.99s.44.99.99.99h5.44c.55,0,.99-.44.99-.99v-5.44c0-.55-.44-.99-.99-.99Z"/>
   </g>
   </g>
			  </svg>`;
			}

			var encoded = btoa(handleCursorSVG);

			cursorOverride(
				`url("data:image/svg+xml;base64,${encoded}") 15 15, ${defaultCursor}`
			);
		} else if (hoveredHandle == handle.name) {
			hoveredHandle = false;
		}
	});
	if (!hoveredHandle) {
		cursorOverride();
	}
}
document.body.addEventListener("pointerdown", function (e) {
	if (!Tools.transform || canvasInterface.panning) return;
	if (e.target != canvasInterface.canvasParent) return;
	var { rawX, rawY, x, y } = canvasInterface.getCoordinatesFromInputEvent(e);
	prevMovementPosition = [x, y];
	if (!scaleAlreadyMoving) {
		scaleWidth = transformDummyCanvas.width;
		scaleHeight = transformDummyCanvas.height;
	}
	scale();

	detectTransformHandleInteraction(e);

	if (Tools.transform && !hoveredHandle) {
		selectionMoving = true;
	} else if (hoveredHandle && hoveredHandle != "rot") {
		scaleMoving = true;
		scaleMovingHandle = hoveredHandle;
	}
});
document.body.addEventListener("pointerup", function (e) {
	selectionMoving = false;
	scaleMoving = false;
});

document.body.addEventListener("pointermove", function (e) {
	if (canvasInterface.panning) return;

	detectTransformHandleInteraction(e);

	if (!scaleMoving && !selectionMoving) return;
	var { rawX, rawY, x, y } = canvasInterface.getCoordinatesFromInputEvent(e);

	var selectionRect = getSelectionBounds();
	var dx = x - prevMovementPosition[0];
	var dy = y - prevMovementPosition[1];
	canvasInterface.pctx.clearRect(
		0,
		0,
		canvasInterface.width,
		canvasInterface.height
	);

	canvasInterface.previewcanvas.style.opacity = 1;
	if (selectionMoving) {
		canvasInterface.pctx.drawImage(
			scaleDummyCanvas,
			selectionRect.x + dx,
			selectionRect.y + dy
		);
		moveSelection(dx, dy);
		prevMovementPosition = [x, y];
	}
	if (scaleMoving) {
		scaleAlreadyMoving = true;

		if (scaleMovingHandle == "bl") {
			scaleWidth -= dx;
			scaleHeight += dy;
			adjustBoundingRect("left", dx);
			adjustBoundingRect("bottom", dy);
		} else if (scaleMovingHandle == "br") {
			scaleWidth += dx;
			scaleHeight += dy;
			adjustBoundingRect("right", dx);
			adjustBoundingRect("bottom", dy);
		} else if (scaleMovingHandle == "tl") {
			scaleWidth -= dx;
			scaleHeight -= dy;
			adjustBoundingRect("left", dx);
			adjustBoundingRect("top", dy);
		} else if (scaleMovingHandle == "tr") {
			scaleWidth += dx;
			scaleHeight -= dy;
			adjustBoundingRect("right", dx);
			adjustBoundingRect("top", dy);
		} else if (scaleMovingHandle == "bm") {
			scaleHeight += dy;
			adjustBoundingRect("bottom", dy);
		} else if (scaleMovingHandle == "tm") {
			scaleHeight -= dy;
			adjustBoundingRect("top", dy);
		} else if (scaleMovingHandle == "ml") {
			scaleWidth -= dx;
			adjustBoundingRect("left", dx);
		} else if (scaleMovingHandle == "mr") {
			scaleWidth += dx;
			adjustBoundingRect("right", dx);
		}
		scale();

		var selectionRect = getSelectionBounds();

		canvasInterface.pctx.drawImage(
			scaleDummyCanvas,
			selectionRect.x,
			selectionRect.y
		);

		prevMovementPosition = [x, y];
	}
});
var transformDummyCanvas = document.createElement("canvas");
var transformDummyCtx = transformDummyCanvas.getContext("2d");
transformDummyCanvas.id = "transformdummycanvas";
var copyDummyCanvas = document.createElement("canvas");
var copyDummyCtx = copyDummyCanvas.getContext("2d");
copyDummyCanvas.id = "transformdummycanvas";
var scaleDummyCanvas = document.createElement("canvas");
var scaleDummyCtx = scaleDummyCanvas.getContext("2d");
scaleDummyCanvas.id = "scaledummycanvas";
//document.body.appendChild(transformDummyCanvas);
//document.body.appendChild(scaleDummyCanvas);
var pasted = false;
var copiedSelectionRect;
var copiedSelectionPath;

function cutSelection() {
	copySelection();
	canvasInterface.eraseSelection();
}
function clearSelection() {
	canvasInterface.eraseSelection();
}
function copySelection() {
	copyDummyCtx.clearRect(0, 0, copyDummyCanvas.width, copyDummyCanvas.height);
	var selectionRect = getSelectionBounds();
	copiedSelectionRect = JSON.parse(JSON.stringify(selectionRect));
	copiedSelectionPath = JSON.parse(JSON.stringify(selectionPath));
	copyDummyCanvas.width = getSelectionBounds().width;
	copyDummyCanvas.height = getSelectionBounds().height;
	copyDummyCtx.save();
	var clipPath = new Path2D();
	selectionPath.forEach((e) => {
		clipPath.moveTo(e[0].X - selectionRect.x, e[0].Y - selectionRect.y);
		for (let i = 0; i < e.length - 1; i++) {
			const pt = e[i + 1];
			clipPath.lineTo(pt.X - selectionRect.x, pt.Y - selectionRect.y);
		}
		clipPath.closePath();
	});
	copyDummyCtx.clip(clipPath, "evenodd");
	copyDummyCtx.drawImage(
		canvasInterface.canvas,
		getSelectionBounds().x,
		getSelectionBounds().y,
		getSelectionBounds().width,
		getSelectionBounds().height,
		0,
		0,
		getSelectionBounds().width,
		getSelectionBounds().height
	);
	copyDummyCtx.restore();
}
function pasteSelection() {
	confirmTransform();

	selectionPath = JSON.parse(JSON.stringify(copiedSelectionPath));
	drawSelectionPreview();
	transformDummyCanvas.width = copyDummyCanvas.width;
	transformDummyCanvas.height = copyDummyCanvas.height;
	transformDummyCtx.drawImage(copyDummyCanvas, 0, 0);

	canvasInterface.pctx.clearRect(
		0,
		0,
		canvasInterface.width,
		canvasInterface.height
	);

	canvasInterface.previewcanvas.style.opacity = 1;
	canvasInterface.pctx.drawImage(
		transformDummyCanvas,
		copiedSelectionRect.x,
		copiedSelectionRect.y
	);
	setTool("transform");
	showBoundingBox();
	pasted = true;
}
function duplicateSelection() {
	copySelection();
	pasteSelection();
}
var scaleWidth = 10;
var scaleHeight = 10;

function scale() {
	scaleDummyCanvas.width = scaleWidth;
	scaleDummyCanvas.height = scaleHeight;
	var srcWidth = transformDummyCanvas.width;
	var srcHeight = transformDummyCanvas.height;
	var data = transformDummyCtx.getImageData(0, 0, srcWidth, srcHeight).data;
	scaleDummyCtx.clearRect(
		0,
		0,
		scaleDummyCanvas.width,
		scaleDummyCanvas.height
	);
	for (let x = 0; x < scaleWidth; x++) {
		for (let y = 0; y < scaleHeight; y++) {
			let srcX = Math.floor((x * srcWidth) / scaleWidth);
			let srcY = Math.floor((y * srcHeight) / scaleHeight);
			let srcIndex = (srcY * srcWidth + srcX) * 4;
			scaleDummyCtx.fillStyle =
				"rgba(" +
				data[srcIndex] +
				"," +
				data[srcIndex + 1] +
				"," +
				data[srcIndex + 2] +
				"," +
				data[srcIndex + 3] +
				")";
			scaleDummyCtx.fillRect(x, y, 1, 1);
		}
	}
}
scale();

//read image from url, get its width and height, and draw it on canvas
function drawImageFromUrl(url) {
	var img = new Image();
	img.onload = function () {
		canvasInterface.ctx.drawImage(img, 0, 0);
	};
	img.src = url;
}
