function packFile() {
    project = {
        'name': projName,
        'palettes': filePalettes,
        'currColor': board.color,
        'width': board.width,
        'height': board.height,
        'dim': window.dim,
        'layers': layers.reverse()
    }
    var packedData = btoa(JSON.stringify(project))
    return packedData
}

function saveFile() {
    var packedData = packFile()
    var link = document.createElement('a');
    link.download = (project.name.toLowerCase().replace(" ", "_")) + '.bspr'
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(packedData)
    link.click();
    link.delete;
}

function parseFile() {
    var curFiles = document.getElementById("fileOpenDialog").files;
    if (curFiles.length === 0) {
        console.error("no files selected")
    } else {
        console.log(curFiles)
        for (let i = 0; i < curFiles.length; i++) {
            const file = curFiles[i];

            let reader = new FileReader();
            reader.addEventListener('load', (event) => {
                console.log(JSON.parse(atob(event.target.result)));
            });

            reader.readAsText(file);

        }
    }
}

function openFile() {
    document.getElementById("fileOpenDialog").click()
}

document.getElementById("fileOpenDialog").onchange = parseFile