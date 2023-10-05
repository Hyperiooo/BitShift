var cursors = {
	resize: (angle = 0) => {
		var bg = getComputedStyle(document.documentElement).getPropertyValue(
			"--bg100"
		);
		var txt = getComputedStyle(document.documentElement).getPropertyValue(
			"--textMain"
		);

		var handleCursorSVG = `<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 32 32" width="30" height="30">
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
					angle
						})">
						<path class="cls-2" d="m28.3,14.35l-3.84-3.84c-.91-.91-2.39-.91-3.3,0-.91.91-.91,2.39,0,3.3l.2.2h-10.7l.2-.2c.91-.91.91-2.39,0-3.3-.91-.91-2.39-.91-3.3,0l-3.84,3.84c-.44.44-.68,1.03-.68,1.65s.25,1.21.68,1.65l3.84,3.84c.46.46,1.05.68,1.65.68s1.2-.23,1.65-.68c.91-.91.91-2.39,0-3.3l-.2-.2h10.7l-.2.2c-.91.91-.91,2.39,0,3.3.46.46,1.05.68,1.65.68s1.2-.23,1.65-.68l3.84-3.84c.44-.44.68-1.03.68-1.65s-.25-1.21-.68-1.65Z"/>
  				<path class="cls-1" d="m27.35,15.3l-3.84-3.84c-.39-.39-1.01-.39-1.4,0s-.39,1.01,0,1.4l2.15,2.15H7.74l2.15-2.15c.39-.39.39-1.01,0-1.4s-1.01-.39-1.4,0l-3.84,3.84c-.19.19-.29.44-.29.7s.1.51.29.7l3.84,3.84c.19.19.45.29.7.29s.51-.1.7-.29c.39-.39.39-1.01,0-1.4l-2.15-2.15h16.51l-2.15,2.15c-.39.39-.39,1.01,0,1.4.19.19.45.29.7.29s.51-.1.7-.29l3.84-3.84c.19-.19.29-.44.29-.7s-.1-.51-.29-.7Z"/>
  				</g>
  				</g>
			  </svg>`;

		var encoded = btoa(handleCursorSVG);

		return `url("data:image/svg+xml;base64,${encoded}") 15 15, ${defaultCursor}`;
	},
	rotate: (angle = 0)=> {
		var bg = getComputedStyle(document.documentElement).getPropertyValue(
			"--bg100"
		);
		var txt = getComputedStyle(document.documentElement).getPropertyValue(
			"--textMain"
		);

		var handleCursorSVG = `
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
							angle
						})">
						<path class="cls-2" d="m26.65,15.13c-1.1,0-1.99.89-1.99,1.99v.14l-.02-.02c-4.76-4.76-12.51-4.76-17.27,0l-.02.02v-.14c0-1.1-.89-1.99-1.99-1.99s-1.99.89-1.99,1.99v5.44c0,1.1.89,1.99,1.99,1.99h5.44c1.1,0,1.99-.89,1.99-1.99s-.89-1.99-1.99-1.99h-.14l.02-.02c2.94-2.94,7.72-2.94,10.66,0l.02.02h-.14c-1.1,0-1.99.89-1.99,1.99s.89,1.99,1.99,1.99h5.44c1.1,0,1.99-.89,1.99-1.99v-5.44c0-1.1-.89-1.99-1.99-1.99Z"/>
  						<path class="cls-1" d="m26.65,16.13c-.55,0-.99.44-.99.99v3.04l-1.97-1.97c-4.24-4.24-11.13-4.24-15.37,0l-1.97,1.97v-3.05c0-.55-.44-.99-.99-.99s-.99.44-.99.99v5.44c0,.55.44.99.99.99h5.44c.55,0,.99-.44.99-.99s-.44-.99-.99-.99h-3.04l1.97-1.97c1.68-1.68,3.91-2.6,6.28-2.6s4.6.92,6.28,2.6l1.97,1.97h-3.05c-.55,0-.99.44-.99.99s.44.99.99.99h5.44c.55,0,.99-.44.99-.99v-5.44c0-.55-.44-.99-.99-.99Z"/>
   </g>
   </g>
			  </svg>`;

		var encoded = btoa(handleCursorSVG);

		return `url("data:image/svg+xml;base64,${encoded}") 15 15, ${defaultCursor}`;
		
	},
	move: (angle = 0) => {
		var bg = getComputedStyle(document.documentElement).getPropertyValue(
			"--bg100"
		);
		var txt = getComputedStyle(document.documentElement).getPropertyValue(
			"--textMain"
		);

		var handleCursorSVG = `
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
		   <g xmlns="http://www.w3.org/2000/svg" transform-origin="15 15" transform="rotate(${angle})">
				<path class="cls-2" d="m28.3,14.35l-2.84-2.84c-.91-.91-2.39-.91-3.3,0-.68.68-.85,1.67-.52,2.5h-3.64v-3.64c.27.11.56.16.85.16.6,0,1.2-.23,1.65-.68.91-.91.91-2.39,0-3.3l-2.84-2.84c-.91-.91-2.39-.91-3.3,0l-2.84,2.84c-.91.91-.91,2.39,0,3.3.68.68,1.67.85,2.5.52v3.64h-3.64c.33-.84.16-1.83-.52-2.5-.91-.91-2.39-.91-3.3,0l-2.84,2.84c-.44.44-.68,1.03-.68,1.65s.25,1.21.68,1.65l2.84,2.84c.46.46,1.05.68,1.65.68s1.2-.23,1.65-.68c.68-.68.85-1.67.52-2.5h3.64v3.64c-.84-.33-1.83-.16-2.5.52-.91.91-.91,2.39,0,3.3l2.84,2.84c.46.46,1.05.68,1.65.68s1.2-.23,1.65-.68l2.84-2.84c.91-.91.91-2.39,0-3.3-.68-.68-1.67-.85-2.5-.52v-3.64h3.64c-.33.84-.16,1.83.52,2.5.46.46,1.05.68,1.65.68s1.2-.23,1.65-.68l2.84-2.84c.44-.44.68-1.03.68-1.65s-.25-1.21-.68-1.65Z"/>
<path class="cls-1" d="m27.35,15.3l-2.84-2.84c-.39-.39-1.01-.39-1.4,0-.39.39-.39,1.01,0,1.4l1.15,1.15h-7.27v-7.27l1.15,1.15c.19.19.45.29.7.29s.51-.1.7-.29c.39-.39.39-1.01,0-1.4l-2.84-2.84c-.39-.39-1.01-.39-1.4,0l-2.84,2.84c-.39.39-.39,1.01,0,1.4s1.01.39,1.4,0l1.15-1.15v7.27h-7.27l1.15-1.15c.39-.39.39-1.01,0-1.4s-1.01-.39-1.4,0l-2.84,2.84c-.19.19-.29.44-.29.7s.1.51.29.7l2.84,2.84c.19.19.45.29.7.29s.51-.1.7-.29c.39-.39.39-1.01,0-1.4l-1.15-1.15h7.27v7.27l-1.15-1.15c-.39-.39-1.01-.39-1.4,0s-.39,1.01,0,1.4l2.84,2.84c.19.19.45.29.7.29s.51-.1.7-.29l2.84-2.84c.39-.39.39-1.01,0-1.4s-1.01-.39-1.4,0l-1.15,1.15v-7.27h7.27l-1.15,1.15c-.39.39-.39,1.01,0,1.4.19.19.45.29.7.29s.51-.1.7-.29l2.84-2.84c.19-.19.29-.44.29-.7s-.1-.51-.29-.7Z"/></g>
</g>
	  </svg>`;

		var encoded = btoa(handleCursorSVG);

		return `url("data:image/svg+xml;base64,${encoded}") 15 15, ${defaultCursor}`;
		
	}
};

var defaultCursor = "crosshair";
var curCursor = defaultCursor;

function cursorOverride(cursor) {
	if (!cursor) {
		canvasInterface.canvasParent.style.cursor = defaultCursor;
		return;
	}
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
				{ X: b.x2, Y: b.y2 + 1 },
				{ X: b.x1, Y: b.y2 + 1 },
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
var cursorOutlinePath = [];

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
				{ X: b.x2, Y: b.y2 + 1 },
				{ X: b.x1, Y: b.y2 + 1 },
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
