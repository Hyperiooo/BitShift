async function exportFile() {
	var scaleFactor = 1;
	scaleFactor = document.getElementById("export-scale").value;
	var exportCanvas = document.createElement("canvas");
	//document.body.appendChild(exportCanvas)
	exportCanvas.style.width = "500px";
	exportCanvas.width = project.width * scaleFactor;
	exportCanvas.height = project.height * scaleFactor;
	console.log(scaleFactor);
	var eCtx = exportCanvas.getContext("2d");
	eCtx.globalCompositeOperation = "source-over";
	eCtx.imageSmoothingEnabled = false;
	eCtx.scale(scaleFactor, scaleFactor);
	layers.reverse().forEach((e) => {
		if (e.settings.visible) eCtx.drawImage(e.canvasElement, 0, 0);
	});
	if (navigator.share && isMobile) {
		var url = exportCanvas.toDataURL(
			"image/" + document.getElementById("export-file-type").value
		);
		var blob = await (await fetch(url)).blob();
		var file = new File(
			[blob],
			project.name.replace(" ", "_") +
				"." +
				document.getElementById("export-file-type").value,
			{ type: "image/png" }
		);
		navigator.share({
			title: "Export " + project.name,
			text: document.getElementById("export-file-name").value,
			files: [file],
		});
	} else {
		var link = document.createElement("a");
		link.download =
		project.name.replace(" ", "_") +
			"." +
			document.getElementById("export-file-type").value;
		link.href = exportCanvas.toDataURL(
			"image/" + document.getElementById("export-file-type").value
		);
		link.click();
		link.delete;
	}
	closeWindow('export')
}

function updateExportMenu() {
	document.getElementById("export-preview").src = createPreviewImage()
	document.getElementById("export-title").value = project.name
	document.getElementById("export-src-size").innerHTML = `SOURCE: ${project.width} * ${project.height}`
	scaleFactor = document.getElementById("export-scale").value;
	document.getElementById("export-dst-size").innerHTML = `EXPORT: ${project.width * scaleFactor} * ${project.height * scaleFactor}`
	if(project.width > project.height){
		document.getElementById("export-preview").classList.add("export-preview-landscape")
	}
	if(project.width <= project.height){
		document.getElementById("export-preview").classList.add("export-preview-portrait")
	}
}

