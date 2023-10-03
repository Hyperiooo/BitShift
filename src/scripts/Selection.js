var selectionGroup = document.getElementById("selectionGroup");

var boundingSVG = document.getElementById("boundingSVG");
var boundingRectElement = document.querySelector("#boundingRect");
var handlebl = document.querySelector(".boundingRectHandle-bl");
var handlebr = document.querySelector(".boundingRectHandle-br");
var handletl = document.querySelector(".boundingRectHandle-tl");
var handletr = document.querySelector(".boundingRectHandle-tr");
var handlebm = document.querySelector(".boundingRectHandle-bm");
var handleml = document.querySelector(".boundingRectHandle-ml");
var handletm = document.querySelector(".boundingRectHandle-tm");
var handlemr = document.querySelector(".boundingRectHandle-mr");
var handlerot = document.querySelector(".boundingRectHandle-rot");
var linerot = document.querySelector("#boundingRotLine");
var boundingHandleSize = 5;
var boundingLineRotSize = 50;
var boundingRotOffset = 0;

var selectionPath = [];
var outlinePath = [];
var stripeWidth = 1;
var selectionStripeDefs = document.createElementNS(
	"http://www.w3.org/2000/svg",
	"defs"
);
var selectionStripePattern = document.createElementNS(
	"http://www.w3.org/2000/svg",
	"pattern"
);
var selectionStripePath = document.createElementNS(
	"http://www.w3.org/2000/svg",
	"path"
);
var selectionStripeFill = document.createElementNS(
	"http://www.w3.org/2000/svg",
	"rect"
);

var selectionMaskBox, selectionMaskAnti, selectionMask;
var svgOffset = 1;
var handleWidth = boundingHandleSize;

function drawOnSelectionSVG(antiPath) {
	svgOffset = 1 / canvasInterface.canvScale;
	handleWidth = boundingHandleSize / canvasInterface.canvScale;

	selectionMaskBox.setAttributeNS(null, "d", antiPath);
	selectionMaskBox.setAttributeNS(null, "stroke", "white");
	selectionMaskBox.setAttributeNS(null, "stroke-width", svgOffset);
	selectionMaskAnti.setAttributeNS(null, "d", antiPath);
	selectionMaskAnti.setAttributeNS(null, "stroke", "black");
	selectionMaskAnti.setAttributeNS(null, "stroke-dasharray", stripeWidth);
	selectionMaskAnti.setAttributeNS(null, "stroke-width", svgOffset);
}

function updateSelectionOutline() {
	selectionMaskBox.setAttributeNS(null, "stroke-width", svgOffset);
	selectionMaskAnti.setAttributeNS(null, "stroke-width", svgOffset);
	boundingSVG.setAttributeNS(null, "stroke-width", svgOffset * 1.5);
	document.querySelectorAll(".boundingRectCircleHandle").forEach((e) => {
		e.setAttributeNS(null, "r", handleWidth);
	});
	selectionMaskAnti.setAttributeNS(null, "stroke-dasharray", stripeWidth);
}
var calledAlready = false;

function debounce(callback) {
	if (calledAlready) return;
	setTimeout(() => {
		calledAlready = false;
	}, 500);
	calledAlready = true;
	callback();
}

function modifySelectionPath(x1, y1, x2, y2, type) {
	var modifierPath = [
		[
			{ X: x1, Y: y1 },
			{ X: x2, Y: y1 },
			{ X: x2, Y: y2 },
			{ X: x1, Y: y2 },
		],
	];
	var cpr = new ClipperLib.Clipper();
	var cliptype;
	if (type == "add") {
		cliptype = ClipperLib.ClipType.ctUnion;
	} else if (type == "subtract") {
		cliptype = ClipperLib.ClipType.ctDifference;
	} else if (type == "replace") {
		cliptype = ClipperLib.ClipType.ctUnion;
	}
	cpr.AddPaths(selectionPath, ClipperLib.PolyType.ptSubject, true);
	cpr.AddPaths(modifierPath, ClipperLib.PolyType.ptClip, true);
	var modifiedPaths = new ClipperLib.Paths();
	cpr.Execute(
		cliptype,
		modifiedPaths,
		ClipperLib.PolyFillType.pftNonZero,
		ClipperLib.PolyFillType.pftNonZero
	);
	selectionPath = modifiedPaths;
	//bind it to canvas
	modifierPath = [
		[
			{ X: 0, Y: 0 },
			{ X: canvasInterface.width, Y: 0 },
			{ X: canvasInterface.width, Y: canvasInterface.height },
			{ X: 0, Y: canvasInterface.height },
		],
	];
	var cpr2 = new ClipperLib.Clipper();
	cpr2.AddPaths(selectionPath, ClipperLib.PolyType.ptSubject, true);
	cpr2.AddPaths(modifierPath, ClipperLib.PolyType.ptClip, true);
	modifiedPaths = new ClipperLib.Paths();
	cpr2.Execute(
		ClipperLib.ClipType.ctIntersection,
		modifiedPaths,
		ClipperLib.PolyFillType.pftNonZero,
		ClipperLib.PolyFillType.pftNonZero
	);
	selectionPath = modifiedPaths;

	drawSelectionPreview();
}

function deselect() {
	if (Tools.transform) confirmTransform();
	console.log(selectionPath)
	selectionPath = [];
	drawSelectionPreview();
	attemptActionMenu(getTool());
}

function selectAll(){
	modifySelectionPath(0, 0, canvasInterface.width, canvasInterface.height, "add")
}
function invertSelection() {
	//inverts selection. wow
	modifierPath = [
		[
			{ X: 0, Y: 0 },
			{ X: canvasInterface.width, Y: 0 },
			{ X: canvasInterface.width, Y: canvasInterface.height },
			{ X: 0, Y: canvasInterface.height },
		],
	];
	var cpr = new ClipperLib.Clipper();
	var cliptype = ClipperLib.ClipType.ctDifference;
	cpr.AddPaths(modifierPath, ClipperLib.PolyType.ptSubject, true);
	cpr.AddPaths(selectionPath, ClipperLib.PolyType.ptClip, true);
	var modifiedPaths = new ClipperLib.Paths();
	cpr.Execute(
		cliptype,
		modifiedPaths,
		ClipperLib.PolyFillType.pftNonZero,
		ClipperLib.PolyFillType.pftNonZero
	);
	selectionPath = modifiedPaths;
	drawSelectionPreview();
}

function drawSelectionPreview() {
	outlinePath = [];
	selectionPath.forEach((e) => {
		var outlinedPath = [[], [], [], []];
		e.forEach((x) => {
			outlinedPath[0].push({ X: x.X + svgOffset, Y: x.Y + svgOffset });
			outlinedPath[1].push({ X: x.X - svgOffset, Y: x.Y + svgOffset });
			outlinedPath[2].push({ X: x.X + svgOffset, Y: x.Y - svgOffset });
			outlinedPath[3].push({ X: x.X - svgOffset, Y: x.Y - svgOffset });
		});
		outlinedPath.forEach((e) => {
			outlinePath.push(e);
		});
	});
	drawOnSelectionSVG(paths2string(selectionPath));
	if (isSelected()) {
	} else {
		hideBoundingBox();
	}
	updateBounding();
}
function moveSelection(dx, dy) {
	selectionPath.forEach((e) => {
		e.forEach((x) => {
			x.X += dx;
			x.Y += dy;
		});
	});
	drawSelectionPreview();
}

function adjustBoundingRect(side, amount) {
	var largestX = 0;
	var largestY = 0;
	var smallestX = canvasInterface.width;
	var smallestY = canvasInterface.height;
	selectionPath.forEach((e) => {
		e.forEach((x) => {
			if (x.X > largestX) largestX = x.X;
			if (x.Y > largestY) largestY = x.Y;
			if (x.X < smallestX) smallestX = x.X;
			if (x.Y < smallestY) smallestY = x.Y;
		});
	});
	if (side == "top") {
		//for whatever elements of the array with smallest y, adjust by amount
		selectionPath.forEach((e) => {
			e.forEach((x) => {
				if (x.Y == smallestY) x.Y += amount;
			});
		});
	} else if (side == "bottom") {
		selectionPath.forEach((e) => {
			e.forEach((x) => {
				if (x.Y == largestY) x.Y += amount;
			});
		});
	} else if (side == "left") {
		selectionPath.forEach((e) => {
			e.forEach((x) => {
				if (x.X == smallestX) x.X += amount;
			});
		});
	} else if (side == "right") {
		selectionPath.forEach((e) => {
			e.forEach((x) => {
				if (x.X == largestX) x.X += amount;
			});
		});
	}
	drawSelectionPreview();
}

function canvasResized() {
	stripeWidth = 6 / (canvasInterface ? canvasInterface.canvScale : 4);
	svgOffset = 1 / canvasInterface.canvScale;
	handleWidth = boundingHandleSize / canvasInterface.canvScale;
	boundingRotOffset = boundingLineRotSize / canvasInterface.canvScale;
	updateBounding();
	updateSelectionOutline();
}

function paths2string(paths, scale) {
	var svgpath = "",
		i,
		j;
	if (!scale) scale = 1;
	for (i = 0; i < paths.length; i++) {
		for (j = 0; j < paths[i].length; j++) {
			if (!j) svgpath += "M";
			else svgpath += "L";
			svgpath += paths[i][j].X / scale + ", " + paths[i][j].Y / scale;
		}
		svgpath += "Z";
	}
	if (svgpath == "") svgpath = "M0,0";
	return svgpath;
}

function isSelected() {
	return selectionPath.length != 0;
}

function setUpSelectionSVG() {
	selectionMaskBox = document.createElementNS(
		"http://www.w3.org/2000/svg",
		"path"
	);
	selectionMaskAnti = document.createElementNS(
		"http://www.w3.org/2000/svg",
		"path"
	);
	selectionMaskBox.setAttributeNS(null, "id", "selectionMaskContent");
	selectionMaskAnti.setAttributeNS(null, "id", "selectionMaskSubtract");
	selectionMaskBox.setAttributeNS(null, "fill", "#0000");
	selectionMaskAnti.setAttributeNS(null, "fill", "#0000");
	selectionMask = document.createElementNS(
		"http://www.w3.org/2000/svg",
		"mask"
	);
	selectionMask.setAttributeNS(null, "id", "selectMask");
	var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
	//group.setAttributeNS(null, "mask", "url(#selectMask)")

	group.appendChild(selectionMaskBox);
	group.appendChild(selectionMaskAnti);
	//selectionGroup.appendChild(selectionMask)
	selectionGroup.appendChild(group);
	requestAnimationFrame(stripeAnimation);
}
var stripeOffset = 0;
var previousElapsed;

function stripeAnimation(elapsed) {
	if (window.canvasInterface) stripeOffset += 0.5 / canvasInterface.canvScale;

	selectionMaskAnti.setAttributeNS(null, "stroke-dashoffset", stripeOffset);
	requestAnimationFrame(stripeAnimation);
}
var minX = 0;
var maxX = 0;
var minY = 0;
var maxY = 0;

function updateBounding() {
	var rect = getSelectionBounds();
	boundingRectElement.setAttributeNS(null, "x", rect.x);
	boundingRectElement.setAttributeNS(null, "y", rect.y);
	boundingRectElement.setAttributeNS(null, "width", rect.width);
	boundingRectElement.setAttributeNS(null, "height", rect.height);
	handletl.setAttributeNS(null, "cx", rect.x);
	handletl.setAttributeNS(null, "cy", rect.y);
	handletr.setAttributeNS(null, "cx", rect.maxX);
	handletr.setAttributeNS(null, "cy", rect.y);
	handletm.setAttributeNS(null, "cx", (rect.x + rect.maxX) / 2);
	handletm.setAttributeNS(null, "cy", rect.y);
	handlebl.setAttributeNS(null, "cx", rect.x);
	handlebl.setAttributeNS(null, "cy", rect.maxY);
	handlebr.setAttributeNS(null, "cx", rect.maxX);
	handlebr.setAttributeNS(null, "cy", rect.maxY);
	handlebm.setAttributeNS(null, "cx", (rect.x + rect.maxX) / 2);
	handlebm.setAttributeNS(null, "cy", rect.maxY);
	handleml.setAttributeNS(null, "cx", rect.x);
	handleml.setAttributeNS(null, "cy", (rect.y + rect.maxY) / 2);
	handlemr.setAttributeNS(null, "cx", rect.maxX);
	handlemr.setAttributeNS(null, "cy", (rect.y + rect.maxY) / 2);
	handlerot.setAttributeNS(null, "cx", (rect.x + rect.maxX) / 2);
	handlerot.setAttributeNS(null, "cy", rect.y - boundingRotOffset);
	linerot.setAttributeNS(null, "x1", (rect.x + rect.maxX) / 2);
	linerot.setAttributeNS(null, "x2", (rect.x + rect.maxX) / 2);
	linerot.setAttributeNS(null, "y1", rect.y);
	linerot.setAttributeNS(null, "y2", rect.y - boundingRotOffset);
	rotationBoundingGroup.style.setProperty(
		"--originX",
		(rect.x + rect.maxX) / 2 + "px"
	);
	rotationBoundingGroup.style.setProperty(
		"--originY",
		(rect.y + rect.maxY) / 2 + "px"
	);
}
var boundingGroup = document.querySelector("#boundingGroup");
var rotationBoundingGroup = document.querySelector("#rotationBoundingGroup");

function showBoundingBox() {
	boundingSVG.classList.remove("boundingHidden");
}

function hideBoundingBox() {
	boundingSVG.classList.add("boundingHidden");
}

function getSelectionBounds() {
	var a = ClipperLib.Clipper.GetBounds(selectionPath);
	return {
		width: a.right - a.left,
		height: a.bottom - a.top,
		x: a.left,
		y: a.top,
		maxX: a.right,
		maxY: a.bottom,
	};
}
