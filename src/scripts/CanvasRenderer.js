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
	vCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
	var transform = canvasInterface.zoom.getTransform();
	var bounding = canvasInterface.zoom.getRect();
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

	if (transform.scale > 25) {
		vCtx.strokeStyle = "#ffffff56";
		vCtx.lineWidth = 0.5;
		vCtx.translate(
			transform.centerX - transform.width / 2,
			transform.centerY - transform.height / 2
		);
		for (let x = 1; x < project.width; x++) {
			vCtx.beginPath();
			vCtx.moveTo(transform.scale * x, 0);
			vCtx.lineTo(transform.scale * x, transform.height);
			vCtx.stroke();
		}
		for (let y = 1; y < project.height; y++) {
			vCtx.beginPath();
			vCtx.moveTo(0, transform.scale * y);
			vCtx.lineTo(transform.width, transform.scale * y);
			vCtx.stroke();
		}
		vCtx.translate(
			-(transform.centerX - transform.width / 2),
			-(transform.centerY - transform.height / 2)
		);
	}
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
		vCtx.closePath()
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
		vCtx.closePath()
		vCtx.stroke();
	});
	vCtx.setLineDash([]);

	if(Tools.transform){
		vCtx.beginPath()
		var rect = getSelectionBounds();
		vCtx.lineWidth = 2;
		vCtx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent');
		vCtx.rect(rect.x * transform.scale, rect.y * transform.scale, rect.width * transform.scale, rect.height * transform.scale)
		//rotation handle line
		vCtx.moveTo(rect.x * transform.scale + rect.width * transform.scale / 2, rect.y * transform.scale - 50)
		vCtx.lineTo(rect.x * transform.scale + rect.width * transform.scale / 2, rect.y * transform.scale)
		vCtx.stroke();   
		//draw handles
		vCtx.beginPath()
		vCtx.fillStyle = "white"
		var handleSize = 12;
		vCtx.rect(rect.x * transform.scale - handleSize / 2, rect.y * transform.scale - handleSize / 2, handleSize, handleSize)
		vCtx.rect(rect.x * transform.scale + rect.width * transform.scale - handleSize / 2, rect.y * transform.scale - handleSize / 2, handleSize, handleSize)
		vCtx.rect(rect.x * transform.scale - handleSize / 2, rect.y * transform.scale + rect.height * transform.scale - handleSize / 2, handleSize, handleSize)
		vCtx.rect(rect.x * transform.scale + rect.width * transform.scale - handleSize / 2, rect.y * transform.scale + rect.height * transform.scale - handleSize / 2, handleSize, handleSize)

		//middle handles
		if(rect.width * transform.scale > 50){
			vCtx.rect(rect.x * transform.scale + rect.width * transform.scale / 2 - handleSize / 2, rect.y * transform.scale - handleSize / 2, handleSize, handleSize)
			vCtx.rect(rect.x * transform.scale + rect.width * transform.scale / 2 - handleSize / 2, rect.y * transform.scale + rect.height * transform.scale - handleSize / 2, handleSize, handleSize)
		}
		if(rect.height * transform.scale > 50){
			vCtx.rect(rect.x * transform.scale - handleSize / 2, rect.y * transform.scale + rect.height * transform.scale / 2 - handleSize / 2, handleSize, handleSize)
			vCtx.rect(rect.x * transform.scale + rect.width * transform.scale - handleSize / 2, rect.y * transform.scale + rect.height * transform.scale / 2 - handleSize / 2, handleSize, handleSize)
		}
		//rotation handle
		vCtx.rect(rect.x * transform.scale + rect.width * transform.scale / 2 - handleSize / 2, rect.y * transform.scale - 50 - handleSize / 2, handleSize, handleSize)
		
		vCtx.fill();
		vCtx.stroke()
		
	}

	var tempCanvas = document.createElement("canvas");
	tempCanvas.width = viewport.width;
	tempCanvas.height = viewport.height;
	var tCtx = tempCanvas.getContext("2d");

	tCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
	tCtx.translate(
		transform.centerX - transform.width / 2,
		transform.centerY - transform.height / 2
	);

	tCtx.strokeStyle = vCtx.strokeStyle = "white";
	vCtx.lineWidth = 1;

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
	tCtx.filter = "invert(1) contrast(10000%) grayscale(100%)"
	tCtx.drawImage(viewport, 0, 0);

	vCtx.translate(
		-(transform.centerX - transform.width / 2),
		-(transform.centerY - transform.height / 2)
	);

	vCtx.drawImage(tempCanvas, 0, 0);

	vCtx.setTransform(1, 0, 0, 1, 0, 0);
	requestAnimationFrame(renderCanvas);
}
var offset = 0;
var viewport = document.getElementById("viewport");
var vCtx = viewport.getContext("2d");
viewport.width = window.innerWidth * window.devicePixelRatio;
viewport.height = window.innerHeight * window.devicePixelRatio;

window.addEventListener("resize", () => {
	viewport.width = window.innerWidth * window.devicePixelRatio;
	viewport.height = window.innerHeight * window.devicePixelRatio;
});
