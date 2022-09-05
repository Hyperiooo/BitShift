function prepareTransform() {
	var selectionRect = getSelectionRect();
	notify.log(getSelectionRect().height);
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
	board.ctx.drawImage(board.previewcanvas, 0, 0);
	board.pctx.clearRect(0, 0, board.width, board.height);
	transformDummyCtx.clearRect(
		0,
		0,
		transformDummyCanvas.width,
		transformDummyCanvas.height
	);
}
var selectionMoving = false;
var prevMovementPosition = [0, 0];
document.body.addEventListener("pointerdown", function (e) {
	if (e.target == boundingRectElement) {
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
	if (selectionMoving) {
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
	}
});
var transformDummyCanvas = document.createElement("canvas");
var transformDummyCtx = transformDummyCanvas.getContext("2d");
transformDummyCanvas.id = "transformdummycanvas";
