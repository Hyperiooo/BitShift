var cursors = {
	crosshair: {
		img: "assets/cursors/crosshair.png",
		width: 7,
		height: 7,
		origin: [0.5, 0.5],
	},
	eyedropper: {
		img: "assets/cursors/eyedropper.png",
		width: 16,
		height: 16,
		origin: [0, 1],
	},
	fillbucket: {
		img: "assets/cursors/fillbucket.png",
		width: 15,
		height: 15,
		origin: [0, 1],
	},
};

var defaultCursor = "crosshair"
var curCursor = defaultCursor;

function cursorOverride(cursor) {
	if(!cursor) {canvasInterface.canvasParent.style.cursor = defaultCursor; return}
	canvasInterface.canvasParent.style.cursor = cursor;
}


var cursorGroup = document.getElementById("cursorGroup");

var eraserBufferCanvas = document.createElement("canvas");
eraserBufferCanvas.id = "eraserBufferCanvas";
var eraserBufferCtx = eraserBufferCanvas.getContext("2d");


function pathString(x, y, x2, y2, offset) {
	return `M ${x - offset} ${y - offset} H ${x2 + offset} V ${
		y2 + 1 + offset
	} H ${x - offset} Z `;
}
var svgOffset = 0;

function drawEraserPreview(x, y) {
	let brushSize = parseInt(settings.tools.eraserBrushSize.value);
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

	cursorOutlinePath = [];
	for (b of c) {
		var modifierPath = [
			[
				{ X: b.x1, Y: b.y1 },
				{ X: b.x2, Y: b.y1 },
				{ X: b.x2, Y: b.y2+1 },
				{ X: b.x1, Y: b.y2+1 },
			],
		];
		var cpr = new ClipperLib.Clipper();
		var cliptype = ClipperLib.ClipType.ctUnion;

		cpr.AddPaths(cursorOutlinePath, ClipperLib.PolyType.ptSubject, true);
		cpr.AddPaths(modifierPath, ClipperLib.PolyType.ptClip, true);
		var modifiedPaths = new ClipperLib.Paths();
		cpr.Execute(
			cliptype,
			modifiedPaths,
			ClipperLib.PolyFillType.pftNonZero,
			ClipperLib.PolyFillType.pftNonZero
		);
		cursorOutlinePath = modifiedPaths;
	}
}
var cursorOutlinePath = []

function drawSprayPreview(x, y) {
	let brushSize = parseInt(settings.tools.spraySize.value);
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

	cursorOutlinePath = [];
	for (b of c) {
		var modifierPath = [
			[
				{ X: b.x1, Y: b.y1 },
				{ X: b.x2, Y: b.y1 },
				{ X: b.x2, Y: b.y2+1 },
				{ X: b.x1, Y: b.y2+1 },
			],
		];
		var cpr = new ClipperLib.Clipper();
		var cliptype = ClipperLib.ClipType.ctUnion;

		cpr.AddPaths(cursorOutlinePath, ClipperLib.PolyType.ptSubject, true);
		cpr.AddPaths(modifierPath, ClipperLib.PolyType.ptClip, true);
		var modifiedPaths = new ClipperLib.Paths();
		cpr.Execute(
			cliptype,
			modifiedPaths,
			ClipperLib.PolyFillType.pftNonZero,
			ClipperLib.PolyFillType.pftNonZero
		);
		cursorOutlinePath = modifiedPaths;
	}
}

var cursor = document.getElementById("cursor");

function canvasResized() {
	svgOffset = 1 / canvasInterface.canvScale;
	if (Tools.eraser) {
		drawEraserPreview(canvasInterface.currentX, canvasInterface.currentY);
	}
	if (Tools.sprayPaint) {
		drawSprayPreview(canvasInterface.currentX, canvasInterface.currentY);
	}
}
function clearSVGBrushPreviews() {
	cursorGroup.innerHTML = "";
}
