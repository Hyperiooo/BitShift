function prepareTransform() {
	var selectionRect = getSelectionRect();
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
document.body.addEventListener("pointerdown", function (e) {
	if (!Tools.transform) return;
	if (e.target == boundingRectElement || allHandles.includes(e.target)) {
		var rect = canvasInterface.bggridcanvas.getBoundingClientRect();
		var x = e.clientX - rect.left || e.touches[0].clientX - rect.left || -1;
		var y = e.clientY - rect.top || e.touches[0].clientY - rect.top || -1;
		x = Math.floor(x / canvasInterface.canvScale);
		y = Math.floor(y / canvasInterface.canvScale);
		prevMovementPosition = [x, y];
	}
	if (!scaleAlreadyMoving) {
		scaleWidth = transformDummyCanvas.width;
		scaleHeight = transformDummyCanvas.height;
	}
	scale();
	if (e.target == boundingRectElement && Tools.transform) {
		selectionMoving = true;
	} else if (allHandles.includes(e.target) && Tools.transform) {
		scaleMoving = true;
		if (e.target == handlebl) {
			scaleMovingHandle = "bl";
		} else if (e.target == handlebr) {
			scaleMovingHandle = "br";
		} else if (e.target == handletl) {
			scaleMovingHandle = "tl";
		} else if (e.target == handletm) {
			scaleMovingHandle = "tm";
		} else if (e.target == handlebm) {
			scaleMovingHandle = "bm";
		} else if (e.target == handleml) {
			scaleMovingHandle = "ml";
		} else if (e.target == handlemr) {
			scaleMovingHandle = "mr";
		} else if (e.target == handletr) {
			scaleMovingHandle = "tr";
		}
	}
});
document.body.addEventListener("pointerup", function (e) {
	selectionMoving = false;
	scaleMoving = false;
});

document.body.addEventListener("pointermove", function (e) {
	if (!scaleMoving && !selectionMoving) return;
	var rect = canvasInterface.bggridcanvas.getBoundingClientRect();
	var x = e.clientX - rect.left || e.touches[0].clientX - rect.left || -1;
	var y = e.clientY - rect.top || e.touches[0].clientY - rect.top || -1;
	x = Math.floor(x / canvasInterface.canvScale);
	y = Math.floor(y / canvasInterface.canvScale);

	var selectionRect = getSelectionRect();
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

		var selectionRect = getSelectionRect();

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
function copySelection() {
	copyDummyCtx.clearRect(0, 0, copyDummyCanvas.width, copyDummyCanvas.height);
	var selectionRect = getSelectionRect();
	copiedSelectionRect = JSON.parse(JSON.stringify(selectionRect));
	copiedSelectionPath = JSON.parse(JSON.stringify(selectionPath));
	copyDummyCanvas.width = getSelectionRect().width;
	copyDummyCanvas.height = getSelectionRect().height;
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
		getSelectionRect().x,
		getSelectionRect().y,
		getSelectionRect().width,
		getSelectionRect().height,
		0,
		0,
		getSelectionRect().width,
		getSelectionRect().height
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
