function prepareTransform() {
	var selectionRect = getSelectionRect();
	transformDummyCanvas.width = getSelectionRect().width;
	transformDummyCanvas.height = getSelectionRect().height;
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
		board.canvas,
		getSelectionRect().x,
		getSelectionRect().y,
		getSelectionRect().width,
		getSelectionRect().height,
		0,
		0,
		getSelectionRect().width,
		getSelectionRect().height
	);
	transformDummyCtx.restore();
	board.eraseSelection();

	board.pctx.clearRect(0, 0, board.width, board.height);

	board.previewcanvas.style.opacity = 1;
	board.pctx.drawImage(transformDummyCanvas, selectionRect.x, selectionRect.y);
}
function confirmTransform() {
	notify.log("transformed");
	pasted = false;
	board.ctx.drawImage(board.previewcanvas, 0, 0);
	board.pctx.clearRect(0, 0, board.width, board.height);
	transformDummyCtx.clearRect(
		0,
		0,
		transformDummyCanvas.width,
		transformDummyCanvas.height
	);
	updateCanvasPreview();
}
var selectionMoving = false;
var prevMovementPosition = [0, 0];
document.body.addEventListener("pointerdown", function (e) {
	if (e.target == boundingRectElement && Tools.transform) {
		selectionMoving = true;
		var rect = board.bggridcanvas.getBoundingClientRect();
		var x = e.clientX - rect.left || e.touches[0].clientX - rect.left || -1;
		var y = e.clientY - rect.top || e.touches[0].clientY - rect.top || -1;
		x = Math.floor(x / board.canvScale);
		y = Math.floor(y / board.canvScale);
		prevMovementPosition = [x, y];
	}
});
document.body.addEventListener("pointerup", function (e) {
	selectionMoving = false;
});

document.body.addEventListener("pointermove", function (e) {
	if (selectionMoving && !pasted) {
		var rect = board.bggridcanvas.getBoundingClientRect();
		var x = e.clientX - rect.left || e.touches[0].clientX - rect.left || -1;
		var y = e.clientY - rect.top || e.touches[0].clientY - rect.top || -1;
		x = Math.floor(x / board.canvScale);
		y = Math.floor(y / board.canvScale);

		var selectionRect = getSelectionRect();
		var dx = x - prevMovementPosition[0];
		var dy = y - prevMovementPosition[1];

		board.pctx.clearRect(0, 0, board.width, board.height);

		board.previewcanvas.style.opacity = 1;
		board.pctx.drawImage(
			transformDummyCanvas,
			selectionRect.x + dx,
			selectionRect.y + dy
		);
		moveSelection(dx, dy);
		prevMovementPosition = [x, y];
	} else if (selectionMoving && pasted) {
		var rect = board.bggridcanvas.getBoundingClientRect();
		var x = e.clientX - rect.left || e.touches[0].clientX - rect.left || -1;
		var y = e.clientY - rect.top || e.touches[0].clientY - rect.top || -1;
		x = Math.floor(x / board.canvScale);
		y = Math.floor(y / board.canvScale);

		var selectionRect = getSelectionRect();
		var dx = x - prevMovementPosition[0];
		var dy = y - prevMovementPosition[1];

		board.pctx.clearRect(0, 0, board.width, board.height);

		board.previewcanvas.style.opacity = 1;
		board.pctx.drawImage(
			copyDummyCanvas,
			selectionRect.x + dx,
			selectionRect.y + dy
		);
		moveSelection(dx, dy);
		prevMovementPosition = [x, y];
	}
});
var transformDummyCanvas = document.createElement("canvas");
var transformDummyCtx = transformDummyCanvas.getContext("2d");
transformDummyCanvas.id = "transformdummycanvas";
var copyDummyCanvas = document.createElement("canvas");
var copyDummyCtx = copyDummyCanvas.getContext("2d");
copyDummyCanvas.id = "transformdummycanvas";
document.body.appendChild(copyDummyCanvas);
var pasted = false;

function cutSelection() {
	var selectionRect = getSelectionRect();
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
		board.canvas,
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
	board.eraseSelection();
}
function copySelection() {
	copyDummyCtx.clearRect(0, 0, copyDummyCanvas.width, copyDummyCanvas.height);
	var selectionRect = getSelectionRect();
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
		board.canvas,
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
	pasted = true;
	var selectionRect = getSelectionRect();
	board.pctx.clearRect(0, 0, board.width, board.height);

	board.previewcanvas.style.opacity = 1;
	board.pctx.drawImage(copyDummyCanvas, selectionRect.x, selectionRect.y);
	setTool("transform");
	showBoundingBox();
}
function duplicateSelection() {
	copySelection();
	pasteSelection();
}
