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
}
var transformDummyCanvas = document.createElement("canvas");
var transformDummyCtx = transformDummyCanvas.getContext("2d");
document.body.appendChild(transformDummyCanvas);
transformDummyCanvas.id = "transformdummycanvas";
