
var Tools = {
    "pen": false,
    "eraser": false,
    "fillBucket": false,
    "line": false,
    "ellipse": false,
    "rect": false,
    "sprayPaint": false,
    "eyedropper": false,
}
function updateToolSettings(tool) {
    var toolContent = document.getElementById("tool-settings-content")
    let toolSettings = settings.tools.assignments[tool]
    toolContent.classList.add("tool-settings-content-hidden")
    if (!toolSettings) {
        setTimeout(() => {
            toolContent.innerHTML = ``
            toolContent.style.setProperty("--maxHeight", "0px")
        }, 200);
        return
    }
    toolContent.style.setProperty("--maxHeight", (toolSettings.length * 28) + ((toolSettings.length - 1) * 8) + "px")
    let toolCont = ""
    for (let i = 0; i < toolSettings.length; i++) {
        const element = toolSettings[i];
        const setting = settings.tools[element]
        if (setting.type == "int") {
            toolCont += `
            <span class="popup-input-group">
              <p class="popup-input-title">${setting.title}</p>
              <div class="popup-input-wrap">
                <div class="popup-input-field">
                  <input min="${setting.min}" max="${setting.max}" ${(setting.draggable) ? "data-input-num-draggable" : ""} class="popup-input-num" onchange="console.log('a')" oninput="${setting.callback}" type="number" value="${setting.value}" />
                  <p class="popup-input-unit">${setting.unit}</p>
                </div>
              </div>
            </span>`
        } else if (setting.type == "bool") {
            toolCont += `
            <span class="popup-input-group">
              <p class="popup-input-title">${setting.title}</p>
              <div class="popup-input-wrap">
                <div class="popup-input-field">
                  <input class="popup-input-check" oninput="${setting.callback}" type="checkbox" ${(setting.value) ? "checked" : ""} />
                  <span class="checkmark"></span>
                </div>
              </div>
            </span>`
        }
    }
    if (toolContent.innerHTML == "") {
        toolContent.innerHTML = `${toolCont}`
        for (let i = 0; i < draggableNumInputs.length; i++) {
            const e = draggableNumInputs[i];
            e.clear()
        }
        draggableNumInputs = []
        document.querySelectorAll("[data-input-num-draggable]").forEach(e => {
            draggableNumInputs.push(new numberDraggable(e))
        })
        toolContent.classList.remove("tool-settings-content-hidden")
        return
    }
    setTimeout(() => {
        toolContent.innerHTML = `${toolCont}`
        for (let i = 0; i < draggableNumInputs.length; i++) {
            const e = draggableNumInputs[i];
            e.clear()
        }
        draggableNumInputs = []
        document.querySelectorAll("[data-input-num-draggable]").forEach(e => {
            draggableNumInputs.push(new numberDraggable(e))
        })
        toolContent.classList.remove("tool-settings-content-hidden")

    }, 150);
}


function closeToolSettings() {
    document.getElementById("tool-settings").classList.remove("tool-settings-open")
}

function openToolSettings() {
    document.getElementById("tool-settings").classList.add("tool-settings-open")
    document.querySelector('.tool-settings-toggle').checked = false
}
function setmode(tool) {
    if (settings.tools.shapeFilled.value) {
        Object.keys(Tools).forEach(v => Tools[v] = false)
        settings.tools.shapeFilled.value = true
    } else {
        Object.keys(Tools).forEach(v => Tools[v] = false)
    }

    if (settings.tools.assignments[tool]) {
        openToolSettings()
        updateToolSettings(tool)
    } else {
        closeToolSettings()
        updateToolSettings(tool)
    }
    Tools[tool] = true
    curCursor = settings.cursors[tool] || "crosshair"
    updateCursor()
    document.querySelectorAll("#toolbar .item").forEach((x) => {
        x.classList.remove('tool-active');
    })
    document.getElementById(`tool-btn-${tool}`).classList.add("tool-active")
}