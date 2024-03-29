function renderCanvas() {
	if (!window.canvasInterface) {
		requestAnimationFrame(renderCanvas);
		return;
	}
	vCtx.clearRect(0, 0, viewport.width, viewport.height);
	vCtx.msImageSmoothingEnabled = false;
	vCtx.mozImageSmoothingEnabled = false;
	vCtx.webkitImageSmoothingEnabled = false;
	vCtx.imageSmoothingEnabled = false;
	var transform = canvasInterface.zoom.getTransform();
	var bounding = canvasInterface.zoom.getRect();
	vCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
	vCtx.translate(transform.centerX, transform.centerY);
	vCtx.rotate((transform.angle * Math.PI) / 180);
	vCtx.translate(-transform.centerX, -transform.centerY);
	vCtx.drawImage(
		canvasInterface.bggridcanvas,
		transform.centerX - transform.width / 2,
		transform.centerY - transform.height / 2,
		transform.width,
		transform.height
	);

	[...layers].reverse().forEach((e) => {
		if (!e.settings.visible) return;
		vCtx.drawImage(
			e.canvasElement,
			transform.centerX - transform.width / 2,
			transform.centerY - transform.height / 2,
			transform.width,
			transform.height
		);
		if (layer == e) {
			if (Tools.rectangleMarquee || Tools.ellipseMarquee) {
				vCtx.globalAlpha = 0.5;
			}
			vCtx.drawImage(
				canvasInterface.previewcanvas,
				transform.centerX - transform.width / 2,
				transform.centerY - transform.height / 2,
				transform.width,
				transform.height
			);
			vCtx.globalAlpha = 1;
		}
	});

	//draw grid lines

	vCtx.translate(
		transform.centerX - transform.width / 2,
		transform.centerY - transform.height / 2
	);

	vCtx.strokeStyle = "white";
	vCtx.lineWidth = 1;
	vCtx.lineDashOffset = offset;

	offset += 0.5;

	vCtx.setLineDash([]);
	selectionPath.forEach((e, i) => {
		vCtx.beginPath();
		vCtx.moveTo(
			Math.floor(e[0].X * transform.scale),
			Math.floor(e[0].Y * transform.scale)
		);
		for (let j = 1; j < e.length; j++) {
			vCtx.lineTo(
				Math.floor(e[j].X * transform.scale),
				Math.floor(e[j].Y * transform.scale)
			);
		}
		vCtx.closePath();
		vCtx.stroke();
	});
	vCtx.strokeStyle = "black";

	vCtx.setLineDash([7, 7]);
	selectionPath.forEach((e, i) => {
		vCtx.beginPath();
		vCtx.moveTo(
			Math.floor(e[0].X * transform.scale),
			Math.floor(e[0].Y * transform.scale)
		);
		for (let j = 1; j < e.length; j++) {
			vCtx.lineTo(
				Math.floor(e[j].X * transform.scale),
				Math.floor(e[j].Y * transform.scale)
			);
		}
		vCtx.closePath();
		vCtx.stroke();
	});
	vCtx.setLineDash([]);

	if (isSelected()) {
		var tempCanvas = document.createElement("canvas");
		tempCanvas.width = viewport.width;
		tempCanvas.height = viewport.height;
		var tCtx = tempCanvas.getContext("2d");

		tCtx.setTransform(1, 0, 0, 1, 0, 0);
		tCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
		/*
		lineOffset++
		lineOffset %= 30
		tCtx.drawImage(diagonalStripeCanvas, lineOffset, 0)
		tCtx.drawImage(diagonalStripeCanvas, lineOffset - window.innerWidth * window.devicePixelRatio, 0)*/
		tCtx.globalAlpha = 1;
		tCtx.globalCompositeOperation = "xor";
		tCtx.fillStyle = "#0f0";

		tCtx.translate(transform.centerX, transform.centerY);
		tCtx.rotate((transform.angle * Math.PI) / 180);
		tCtx.translate(-transform.centerX, -transform.centerY);
		tCtx.translate(
			transform.centerX - transform.width / 2,
			transform.centerY - transform.height / 2
		);

		selectionPath.forEach((e, i) => {
			tCtx.beginPath();
			tCtx.moveTo(
				Math.floor(e[0].X * transform.scale),
				Math.floor(e[0].Y * transform.scale)
			);
			for (let j = 1; j < e.length; j++) {
				tCtx.lineTo(
					Math.floor(e[j].X * transform.scale),
					Math.floor(e[j].Y * transform.scale)
				);
			}
			tCtx.closePath();
			tCtx.fill();
		});
		tCtx.setTransform(1, 0, 0, 1, 0, 0);
		tCtx.globalCompositeOperation = "source-out";
		tCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
		tCtx.fillStyle = "#0000003b";
		tCtx.fillRect(0, 0, viewport.width, viewport.height);

		vCtx.setTransform(1, 0, 0, 1, 0, 0);
		vCtx.drawImage(tempCanvas, 0, 0);
		vCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
		vCtx.translate(transform.centerX, transform.centerY);
		vCtx.rotate((transform.angle * Math.PI) / 180);
		vCtx.translate(-transform.centerX, -transform.centerY);
		vCtx.translate(
			transform.centerX - transform.width / 2,
			transform.centerY - transform.height / 2
		);
	} else {
	}

	if (Tools.transform) {
		vCtx.beginPath();
		var rect = getSelectionBounds();
		vCtx.lineWidth = 2;
		vCtx.strokeStyle = getComputedStyle(
			document.documentElement
		).getPropertyValue("--accent");
		vCtx.rect(
			rect.x * transform.scale,
			rect.y * transform.scale,
			rect.width * transform.scale,
			rect.height * transform.scale
		);
		//rotation handle line
		vCtx.moveTo(
			rect.x * transform.scale + (rect.width * transform.scale) / 2,
			rect.y * transform.scale - 50
		);
		vCtx.lineTo(
			rect.x * transform.scale + (rect.width * transform.scale) / 2,
			rect.y * transform.scale
		);
		vCtx.stroke();
		//draw handles
		vCtx.fillStyle = "white";
		var handleSize = 12;
		function drawCircle(x, y) {
			vCtx.beginPath();

			vCtx.ellipse(x, y, handleSize / 2, handleSize / 2, 0, 0, 2 * Math.PI);
			vCtx.fill();
			vCtx.stroke();
		}
    transformHandlePositions = [
      {
        x:rect.x * transform.scale + (rect.width * transform.scale) / 2,
        y:rect.y * transform.scale - 50,
        name: "rot",
      },
      {
        x: rect.x * transform.scale,
        y: rect.y * transform.scale,
        name: "tl",
		cursorAngle: 45,
      },
      {
        x: rect.x * transform.scale + rect.width * transform.scale,
        y: rect.y * transform.scale,
        name: "tr",
		cursorAngle: 135,
      },
      {
        x: rect.x * transform.scale,
        y: rect.y * transform.scale + rect.height * transform.scale,
        name: "bl",
		cursorAngle: 315,
      },
      {
        x: rect.x * transform.scale + rect.width * transform.scale,
        y: rect.y * transform.scale + rect.height * transform.scale,
        name: "br",
		cursorAngle: 225,
      },
      {
        x: rect.x * transform.scale + (rect.width * transform.scale) / 2,
        y: rect.y * transform.scale,
        name: "tm",
		cursorAngle: 90,
      },
      {
        x: rect.x * transform.scale + (rect.width * transform.scale) / 2,
        y: rect.y * transform.scale + rect.height * transform.scale,
        name: "bm",
		cursorAngle: 270,
      },
      {
        x: rect.x * transform.scale,
        y: rect.y * transform.scale + (rect.height * transform.scale) / 2,
        name: "ml",
		cursorAngle: 0,
      },
      {
        x: rect.x * transform.scale + rect.width * transform.scale,
        y: rect.y * transform.scale + (rect.height * transform.scale) / 2,
        name: "mr",
		cursorAngle: 180,
      },
      
    ]
    transformHandlePositions.forEach(handle => {
      if((handle.name == "bm" || handle.name == "tm") && rect.width * transform.scale < 50) return;
      if((handle.name == "ml" || handle.name == "mr") && rect.height * transform.scale < 50) return;
      var adjustedMousePos = canvasInterface.getCoordinatesFromInputEvent(false, canvasInterface.rawGlobalMouseX, canvasInterface.rawGlobalMouseY);
      adjustedMousePos.rawX *= transform.scale
	  adjustedMousePos.rawY *= transform.scale
	  drawCircle(handle.x, handle.y);
	  drawCircle(adjustedMousePos.rawX, adjustedMousePos.rawY, false);
	  
    })
	}

	/*
	var tempCanvas = document.createElement("canvas");
	tempCanvas.width = window.innerWidth * window.devicePixelRatio;
	tempCanvas.height = window.innerHeight * window.devicePixelRatio;
	var tCtx = tempCanvas.getContext("2d");

	tCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
	tCtx.translate(
		transform.centerX - transform.width / 2,
		transform.centerY - transform.height / 2
	);

	tCtx.strokeStyle = vCtx.strokeStyle = "white";
	tCtx.lineWidth = 2;
	cursorOutlinePath.forEach((e, i) => {
		if (isMobile) {
			if (!canvasInterface.touching) {
				return;
			}
			if (!Tools.eraser && !Tools.sprayPaint) {
				return;
			}
		} else {
			if (!Tools.eraser && !Tools.sprayPaint) {
				return;
			}
		}
		tCtx.beginPath();
		tCtx.moveTo(
			Math.floor(e[0].X * transform.scale),
			Math.floor(e[0].Y * transform.scale)
		);
		for (let j = 1; j < e.length; j++) {
			tCtx.lineTo(
				Math.floor(e[j].X * transform.scale),
				Math.floor(e[j].Y * transform.scale)
			);
		}
		tCtx.lineTo(
			Math.floor(e[0].X * transform.scale),
			Math.floor(e[0].Y * transform.scale)
		);
		tCtx.stroke();
	});

	tCtx.globalCompositeOperation = "source-in";

	tCtx.translate(
		-(transform.centerX - transform.width / 2),
		-(transform.centerY - transform.height / 2)
	);
	tCtx.filter = "invert(1) contrast(100000000%) grayscale(100%)";
	tCtx.drawImage(viewport, 0, 0);
*/
	vCtx.globalCompositeOperation = "difference";
	vCtx.strokeStyle = "white";
	cursorOutlinePath.forEach((e, i) => {
		if (isMobile) {
			if (canvasInterface.panning) {
				return;
			}
			if (!canvasInterface.touching) {
				return;
			}
			if (!Tools.eraser && !Tools.sprayPaint) {
				return;
			}
		} else {
			if (!Tools.eraser && !Tools.sprayPaint) {
				return;
			}
		}
		vCtx.beginPath();
		vCtx.moveTo(
			Math.floor(e[0].X * transform.scale),
			Math.floor(e[0].Y * transform.scale)
		);
		for (let j = 1; j < e.length; j++) {
			vCtx.lineTo(
				Math.floor(e[j].X * transform.scale),
				Math.floor(e[j].Y * transform.scale)
			);
		}
		vCtx.lineTo(
			Math.floor(e[0].X * transform.scale),
			Math.floor(e[0].Y * transform.scale)
		);
		vCtx.stroke();
	});
	vCtx.globalCompositeOperation = "source-over";
	vCtx.translate(
		-(transform.centerX - transform.width / 2),
		-(transform.centerY - transform.height / 2)
	);
	vCtx.translate(
		transform.centerX - transform.width / 2,
		transform.centerY - transform.height / 2
	);
	vCtx.strokeStyle = "#ffffff56";
	vCtx.lineWidth = 0.5;

	//the grid lines !!!!!!!!!!!!!!
	let startTime = Date.now();
	if (transform.scale > 25 && renderGridLines) {
		vCtx.beginPath();
		vCtx.moveTo(0, 0);
		var step = 0;
		for (let x = 0; x < project.width + 1; x++) {
			step += 1;
			step %= 2;

			vCtx.lineTo(transform.scale * x, transform.height * step);
			vCtx.lineTo(transform.scale * x, transform.height * (1 - step));
		}
		vCtx.moveTo(0, 0);
		step = 0;
		for (let y = 0; y < project.height + 1; y++) {
			step += 1;
			step %= 2;

			vCtx.lineTo(transform.width * step, transform.scale * y);
			vCtx.lineTo(transform.width * (1 - step), transform.scale * y);
		}
		vCtx.stroke();
		let endTime = Date.now();
		if (endTime - startTime > 0) {
			renderGridLines = false;
		}
	}
	vCtx.translate(
		-(transform.centerX - transform.width / 2),
		-(transform.centerY - transform.height / 2)
	);

	//vCtx.drawImage(tempCanvas, 0, 0);

	vCtx.setTransform(1, 0, 0, 1, 0, 0);
	vCtx.strokeStyle = "red";

	vCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
	vCtx.strokeRect(
		0,
		0,
		canvasInterface.rawGlobalMouseX,
		canvasInterface.rawGlobalMouseY
	);
	vCtx.setTransform(1, 0, 0, 1, 0, 0);

	requestAnimationFrame(renderCanvas);
}
var transformHandlePositions;
var lineOffset = 0;
var renderGridLines = true;
var diagonalStripeCanvas = document.createElement("canvas");
diagonalStripeCanvas.width = window.innerWidth * window.devicePixelRatio;
diagonalStripeCanvas.height = window.innerHeight * window.devicePixelRatio;
var dCtx = diagonalStripeCanvas.getContext("2d");
dCtx.fillStyle = "white";
dCtx.fillRect(0, 0, diagonalStripeCanvas.width, diagonalStripeCanvas.height);

generateStripes();

function generateStripes() {
	dCtx.clearRect(0, 0, diagonalStripeCanvas.width, diagonalStripeCanvas.height);
	//generate diagonal stripes. 45 degrees
	var stripeWidth = 15;
	dCtx.lineWidth = stripeWidth;
	var totalWidth = diagonalStripeCanvas.width + diagonalStripeCanvas.height;
	for (let i = 0; i < totalWidth / stripeWidth; i++) {
		if (i % 2 == 0) {
			dCtx.strokeStyle = "white";
		} else {
			dCtx.strokeStyle = "#9c9c9c";
		}
		dCtx.beginPath();
		dCtx.moveTo(i * stripeWidth, 0);
		dCtx.lineTo(
			i * stripeWidth - diagonalStripeCanvas.height,
			diagonalStripeCanvas.height
		);
		dCtx.lineTo(
			i * stripeWidth + stripeWidth - diagonalStripeCanvas.height,
			diagonalStripeCanvas.height
		);
		dCtx.lineTo(i * stripeWidth + stripeWidth, 0);
		dCtx.stroke();
	}
}

var offset = 0;
var viewport = document.getElementById("viewport");
var vCtx = viewport.getContext("2d");
viewport.width = window.innerWidth * window.devicePixelRatio;
viewport.height = window.innerHeight * window.devicePixelRatio;

window.addEventListener("resize", () => {
	viewport.width = window.innerWidth * window.devicePixelRatio;
	viewport.height = window.innerHeight * window.devicePixelRatio;
	diagonalStripeCanvas.width = window.innerWidth * window.devicePixelRatio;
	diagonalStripeCanvas.height = window.innerHeight * window.devicePixelRatio;
	generateStripes();
});
