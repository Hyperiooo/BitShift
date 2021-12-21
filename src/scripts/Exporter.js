function exportFile() {
    var exportCanvas = document.createElement("canvas")
    //document.body.appendChild(exportCanvas)
    exportCanvas.style.width = "500px"
    exportCanvas.width = project.width
    exportCanvas.height = project.height
    var eCtx = exportCanvas.getContext("2d")
    eCtx.globalCompositeOperation = "destination-over"
    layers.forEach(e=> {
        if(e.settings.visible) eCtx.drawImage(e.canvasElement, 0, 0)
    })
    var link = document.createElement('a');
    link.download = document.getElementById("export-file-name").value + '.' + document.getElementById("export-file-type").value;
    link.href = exportCanvas.toDataURL("image/" + document.getElementById("export-file-type").value)
    link.click();
    link.delete;
    closeExportMenu()
}

function openExportMenu() {
    document.getElementById("export-menu").classList.add("export-open")
    closeMenu()
}

function closeExportMenu() {
    document.getElementById("export-menu").classList.remove("export-open")
}