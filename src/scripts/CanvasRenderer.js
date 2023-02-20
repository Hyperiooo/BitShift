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
		vCtx.lineTo(
			Math.floor(e[0].X * transform.scale),
			Math.floor(e[0].Y * transform.scale)
		);
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
		vCtx.lineTo(
			Math.floor(e[0].X * transform.scale),
			Math.floor(e[0].Y * transform.scale)
		);
		vCtx.stroke();
	});
	vCtx.setLineDash([]);

	vCtx.strokeStyle = "grey";
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

	vCtx.translate(
		-(transform.centerX - transform.width / 2),
		-(transform.centerY - transform.height / 2)
	);

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
