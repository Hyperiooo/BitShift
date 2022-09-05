function exportFile() {
	var scaleFactor = 1;
	scaleFactor = document.getElementById("export-scale").value;
	var exportCanvas = document.createElement("canvas");
	//document.body.appendChild(exportCanvas)
	exportCanvas.style.width = "500px";
	exportCanvas.width = project.width * scaleFactor;
	exportCanvas.height = project.height * scaleFactor;
	var eCtx = exportCanvas.getContext("2d");
	eCtx.globalCompositeOperation = "source-over";
	eCtx.imageSmoothingEnabled = false;
	eCtx.scale(scaleFactor, scaleFactor);
	layers.reverse().forEach((e) => {
		if (e.settings.visible) eCtx.drawImage(e.canvasElement, 0, 0);
	});
	if (navigator.share) {
		var url = exportCanvas.toDataURL(
			"image/" + document.getElementById("export-file-type").value
		);
		var blob = dataURItoBlob(url);
		var file = new File(
			[blob],
			document.getElementById("export-file-name").value +
				"." +
				document.getElementById("export-file-type").value,
			{ type: blob.type }
		);
		navigator.share({
			title: document.getElementById("export-file-name").value,
			files: [file],
		});
	} else {
		var link = document.createElement("a");
		link.download =
			document.getElementById("export-file-name").value +
			"." +
			document.getElementById("export-file-type").value;
		link.href = exportCanvas.toDataURL(
			"image/" + document.getElementById("export-file-type").value
		);
		link.click();
		link.delete;
	}
	closeExportMenu();
}

function openExportMenu() {
	document.getElementById("export-menu").classList.add("export-open");
	closeMenu();
}

if (navigator.share) {
	notify.log("Share API is supported");
}

function closeExportMenu() {
	document.getElementById("export-menu").classList.remove("export-open");
}
