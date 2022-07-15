function toggleColorPicker() {
    document.getElementById('color-menu').classList.toggle("color-open")
    document.getElementById('layer-menu').classList.remove("layer-open")
    document.getElementById('layer-toggle-button').classList.remove("tool-active")
}

function act(clr) {
    document.querySelectorAll(".palette-color").forEach(x => {
        x.classList.add('palette-inactive')
        x.classList.remove('palette-active')
    });
    if (clr) {
        clr.forEach(e => {
            e.classList.remove('palette-inactive')
            e.classList.add('palette-active')
        })
    }
}
var pickerColor = [0, 0, 0, 100]

var previousData = {
    r: 0,
    g: 0,
    b: 0,
    rgba: 0,
    h: 0,
    s: 0,
    l: 0,
    hsla: 0,
    hex: "ffffffff"
}
document.querySelectorAll("[data-color-input]").forEach(el => {
    el.onblur = el.onkeyup = el.oninput = updateColorNum
})



function updateColorNum(el) {
    if (el.keyCode != null) {
        if (el.keyCode != 13) return;
    }
    var isValid = true;
    var rgb, hsv
    document.querySelectorAll("[data-color-input]").forEach(e => {
        if (e.type == "number") {
            if (e == el.target) {
                if (e.id.includes("rgba")) {
                    if (isValidNum(e.value)) {
                        rgb = [
                            clamp(document.getElementById("color-rgba-r").value, 0, 255),
                            clamp(document.getElementById("color-rgba-g").value, 0, 255),
                            clamp(document.getElementById("color-rgba-b").value, 0, 255),
                            clamp(document.getElementById("color-rgba-a").value, 0, 255),
                        ]
                        hsv = RGBToHSV(rgb)
                    } else {
                        isValid = false
                    }
                } else if (e.id.includes("hsla")) {
                    if (isValidNum(e.value)) {
                        var hsl = [
                            clamp(document.getElementById("color-hsla-h").value, 0, 360),
                            clamp(document.getElementById("color-hsla-s").value, 0, 100),
                            clamp(document.getElementById("color-hsla-l").value, 0, 100),
                            clamp(document.getElementById("color-hsla-a").value, 0, 100),
                        ]
                        rgb = HSLToRGB(hsl)
                        hsv = RGBToHSV(rgb)
                    } else {
                        isValid = false
                    }
                }
            }
        } else if (e.type == "text") {
            if (e == el.target) {
                if (isValidHex(e.value)) {
                    rgb = hexToRGB(e.value)
                    hsv = RGBToHSV(rgb)
                } else {
                    isValid = false
                }
            }
        }
    })
    if (isValid) {
        setPickerColor(rgb)
        pickerColor = hsv
        if (!pickerColor) return
        updatePickerColor()
        var rgba = HSLToRGB(HSVToHSL(pickerColor))
        board.setcolor(rgba, true)
    } else {
        updatePickerColor()
    }
}

var opacMoving = false
var opacThumb
var opacRange
var opacRect

function opacityThumb(e) {
    opacMoving = true
}

function opacEndDrag(e) {
    opacMoving = false
}

function opacDrag(e) {
    e.preventDefault()

    var x, y
    if (e.touches) {
        x = e.touches[0].clientX - (opacRect ? opacRect.left : 0)
        y = e.touches[0].clientY - (opacRect ? opacRect.top : 0)
    } else {
        x = e.clientX - (opacRect ? opacRect.left : 0)
        y = e.clientY - (opacRect ? opacRect.top : 0)
    }
    if (opacMoving) {
        document.querySelectorAll('[data-color-input]').forEach(e => { e.blur() });
        pickerColor[3] = clamp(y / opacRect.height * 100, 0, 100)
        opacThumb.style.setProperty("--pos", clamp(y / opacRect.height * 100, 0, 100) + "%")
        opacThumb.style.setProperty("--posp", clamp(y / opacRect.height, 0, 1))
        updatePickerColor()
        var rgba = HSLToRGB(HSVToHSL(pickerColor))
        board.setcolor(rgba, true)
    }
}



var hueMoving = false
var hThumb
var hueRange
var hueRect

function hueThumb(e) {
    hueMoving = true
}

function hueEndDrag(e) {
    hueMoving = false
}

function hueDrag(e) {
    e.preventDefault()
    var x, y
    if (e.touches) {
        x = e.touches[0].clientX - (hueRect ? hueRect.left : 0)
        y = e.touches[0].clientY - (hueRect ? hueRect.top : 0)
    } else {
        x = e.clientX - (hueRect ? hueRect.left : 0)
        y = e.clientY - (hueRect ? hueRect.top : 0)
    }
    if (hueMoving) {
        document.querySelectorAll('[data-color-input]').forEach(e => { e.blur() });
        pickerColor[0] = clamp((1 - (y / hueRect.height)), 0, 1) * 360
        hThumb.style.setProperty("--pos", clamp(y / hueRect.height * 100, 0, 100) + "%")
        hThumb.style.setProperty("--posp", clamp(y / hueRect.height, 0, 1))
        updatePickerColor()
        var rgba = HSLToRGB(HSVToHSL(pickerColor))
        board.setcolor(rgba, true)
    }
}


var valueMoving = false
var valThumb
var valueRange
var valueRect

var valueBuffer = [0, 0]
var valueTwoFinger = false

var valueMoved

var valueTwoFingerDist = 0
var valueTwoFingerStartDist = 0

function valueThumb(e) {
    var x, y
    if (e.touches) {
        x = e.touches[0].clientX - (valueRect ? valueRect.left : 0)
        y = e.touches[0].clientY - (valueRect ? valueRect.top : 0)
    } else {
        x = e.clientX - (valueRect ? valueRect.left : 0)
        y = e.clientY - (valueRect ? valueRect.top : 0)
    }
    valueBuffer = [x, y]
    if (e.touches && e.touches.length > 1) {
        valueTwoFinger = true
        valueTwoFingerStartDist = (distance(e.touches[0].clientX, e.touches[1].clientX, e.touches[0].clientY, e.touches[1].clientY))
    }
    valueMoving = true
}

function valueEndDrag(e) {
    if (!valueTwoFinger && e.touches && !valueMoved) {
        var x = valueBuffer[0],
            y = valueBuffer[1]
        if (valueMoving && !valueTwoFinger) {
            document.querySelectorAll('[data-color-input]').forEach(e => { e.blur() });
            pickerColor[1] = clamp(x / valueRect.width * 100, 0, 100)
            pickerColor[2] = 100 - clamp(y / valueRect.height * 100, 0, 100)
            vThumb.style.setProperty("--posX", clamp(x / valueRect.width * 100, 0, 100) + "%")
            vThumb.style.setProperty("--posY", clamp(y / valueRect.height * 100, 0, 100) + "%")
            updatePickerColor()
            var rgba = HSLToRGB(HSVToHSL(pickerColor))
            board.setcolor(rgba, true)
        }
    }
    if (valueTwoFinger) {
        if (valueTwoFingerDist - valueTwoFingerStartDist > 50) {
            valueRange.classList.add("color-value-expanded")
            valueRect.width = 296
        }
        if (valueTwoFingerStartDist - valueTwoFingerDist > 100) {
            valueRange.classList.remove("color-value-expanded")
            valueRect.width = 200
        }
    }
    valueMoving = false
    valueMoved = false
    valueTwoFinger = false
}

function valueDrag(e) {
    valueMoved = true
    e.preventDefault()
    var x, y
    if (e.touches) {
        x = e.touches[0].clientX - (valueRect ? valueRect.left : 0)
        y = e.touches[0].clientY - (valueRect ? valueRect.top : 0)
    } else {
        x = e.clientX - (valueRect ? valueRect.left : 0)
        y = e.clientY - (valueRect ? valueRect.top : 0)
    }
    if (valueMoving && !valueTwoFinger) {
        document.querySelectorAll('[data-color-input]').forEach(e => { e.blur() });
        pickerColor[1] = clamp(x / valueRect.width * 100, 0, 100)
        pickerColor[2] = 100 - clamp(y / valueRect.height * 100, 0, 100)
        vThumb.style.setProperty("--posX", clamp(x / valueRect.width * 100, 0, 100) + "%")
        vThumb.style.setProperty("--posY", clamp(y / valueRect.height * 100, 0, 100) + "%")
        updatePickerColor()
        var rgba = HSLToRGB(HSVToHSL(pickerColor))
        board.setcolor(rgba, true)
    }
    if (valueTwoFinger) {
        valueTwoFingerDist = (distance(e.touches[0].clientX, e.touches[1].clientX, e.touches[0].clientY, e.touches[1].clientY))
    }
}


function updatePickerColor() {
    var colorCurrent = document.getElementById("color-current")
    var rEl = document.getElementById("color-rgba-r")
    var gEl = document.getElementById("color-rgba-g")
    var bEl = document.getElementById("color-rgba-b")
    var rgbAEl = document.getElementById("color-rgba-a")
    var hEl = document.getElementById("color-hsla-h")
    var sEl = document.getElementById("color-hsla-s")
    var lEl = document.getElementById("color-hsla-l")
    var hslAEl = document.getElementById("color-hsla-a")
    var hexEl = document.getElementById("color-data-hex")
    opacRange.style.setProperty("--hue", pickerColor[0])
    valueRange.style.setProperty("--hue", pickerColor[0])
    let hsla = HSVToHSL(pickerColor)
    var rgba = HSLToRGB(hsla)
    opacRange.style.setProperty("--color", `hsl( ${hsla[0]}, ${hsla[1]}%, ${hsla[2]}%)`)
    colorCurrent.style.setProperty("--color", `hsla( ${hsla[0]}, ${hsla[1]}%, ${hsla[2]}%, ${hsla[3]}%)`)
    rEl.value = rgba[0]
    gEl.value = rgba[1]
    bEl.value = rgba[2]
    rgbAEl.value = rgba[3]
    hEl.value = Math.round(hsla[0])
    sEl.value = Math.round(hsla[1])
    lEl.value = Math.round(hsla[2])
    hslAEl.value = Math.round(hsla[3])
    var hex = rgbToHex(rgba[0], rgba[1], rgba[2], rgba[3])
    if (hex.endsWith("ff")) {
        hexEl.value = hex.substring(0, hex.length - 2)
    } else {
        hexEl.value = hex
    }
    previousData = {
            r: rgba[0],
            g: rgba[1],
            b: rgba[2],
            rgba: rgba[3],
            h: Math.round(hsla[0]),
            s: Math.round(hsla[1]),
            l: Math.round(hsla[2]),
            hsla: Math.round(hsla[3]),
            hex: rgbToHex(rgba[0], rgba[1], rgba[2], rgba[3])
        }
        //board.setcolor(rgba)
}

var clickedOnce = false
var colPreviewTimeout

function colorPreviewClickHandler(e) {
    return //makes palette based off current color
    e.preventDefault()
    if (!clickedOnce) {
        clickedOnce = true
        colPreviewTimeout = setTimeout(() => {
            debug.log("double failed")
            clickedOnce = false
        }, 1000);
    } else {
        let col = chroma(`rgb(${board.color.splice(0, 3).join(", ")})`)
        let rgba = [col.rgba()[0], col.rgba()[1], col.rgba()[2], 255]
        let pal
        if (chroma.contrast(col, "black") < chroma.contrast(col, 'white')) {
            if (col.temperature() < 10000) {
                pal = chroma.scale([col, col.set('hsv.h', '*.35').set('hsv.v', '*2.75').set('hsv.s', '*.35').hex()])
            } else {
                pal = chroma.scale([col, col.set('lch.l', '*.15').set('lch.c', '*50').set('lch.h', '*10').hex()])
            }
        } else {
            pal = chroma.scale([col, col])
            if (col.hsv()[0] >= 0 && col.hsv()[0] <= 36) {
                pal = chroma.scale([col, col.set('hsv.h', '-60').set('hsv.s', '*3').set('hsv.v', '*.3').hex()])
            } else if (col.hsv()[0] > 36 && col.hsv()[0] <= 65) { //sunset gradient w yellow
                pal = chroma.scale([col, col.set('hsv.h', '*5').set('hsv.v', '*.25').set('hsv.s', '*15').hex()])
            } else if (col.hsv()[0] > 65 && col.hsv()[0] <= 120) {
                pal = chroma.scale([col, col.set('lch.l', '*.35').set('lch.c', '*3').set('lch.h', '*20').hex()])
            } else if (col.hsv()[0] > 120 && col.hsv()[0] <= 180) {
                pal = chroma.scale([col, col.set('lch.l', '*.15').set('lch.c', '*3').set('lch.h', '*20').hex()])
            } else if (col.hsv()[0] > 180 && col.hsv()[0] <= 230) {
                pal = chroma.scale([col, col.set('hsv.h', '*1.3').set('hsv.s', '*2').set('hsv.v', '*.4').hex()])
            } else if (col.hsv()[0] > 230 && col.hsv()[0] <= 330) {
                pal = chroma.scale([col, col.set('hsv.h', '-50').set('hsv.s', '*3').set('hsv.v', '*.3').hex()])
            } else if (col.hsv()[0] > 330 && col.hsv()[0] <= 360) {
                pal = chroma.scale([col, col.set('hsv.h', '-60').set('hsv.s', '*3').set('hsv.v', '*.3').hex()])
            }
            debug.log(col.hsv()[0])
        }
        pal = pal.mode('lch').correctLightness().colors(8)
        let rgbPal = pal.map(e => {
            return (hexToRGB(e))
        })
        console.log(col.hex(), rgbPal, true)
        console.log(rgbPal)
        new paletteGroup("col.hex()", rgbPal, true)
        clearTimeout(colPreviewTimeout)
        clickedOnce = false
    }
}



document.onmousemove = (e) => {
    valueDrag(e)
    hueDrag(e)
    opacDrag(e)
}

document.onmouseup = (e) => {
    valueEndDrag(e)
    opacEndDrag(e)
    hueEndDrag(e)
}



function setPickerColor(rgba) {
    if (!rgba) return false;
    let convHSV = RGBToHSV(rgba)
    var newPickerColor = [convHSV[0], convHSV[1], convHSV[2], convHSV[3]]
    vThumb.style.setProperty("--posX", convHSV[1] + "%")
    vThumb.style.setProperty("--posY", 100 - convHSV[2] + "%")
    hThumb.style.setProperty("--pos", ((1 - (convHSV[0] / 360)) * 100) + "%")
    hThumb.style.setProperty("--posp", 1 - convHSV[0] / 360)
    opacThumb.style.setProperty("--pos", convHSV[3] + "%")
    opacThumb.style.setProperty("--posp", convHSV[3] / 100)
    pickerColor = newPickerColor
    let hsla = HSVToHSL(pickerColor)
    updatePickerColor(rgba)
}

function updatePrevious(col) {
    let hsla = HSVToHSL(RGBToHSV(col))
    document.getElementById("color-previous").style.setProperty("--color", `hsla( ${hsla[0]}, ${hsla[1]}%, ${hsla[2]}%, ${hsla[3]}%)`)
}



function dragOverHandler(e) {
    document.getElementById("color-menu-drop-effect").classList.add("color-menu-drop-effect-on")

    e.preventDefault();
    e.stopPropagation();
}

function dragLeaveHandler(e) {
    document.getElementById("color-menu-drop-effect").classList.remove("color-menu-drop-effect-on")

    e.preventDefault();
    e.stopPropagation();
}

async function dropHandler(e) {
    console.log('File(s) dropped');
    document.getElementById("color-menu-drop-effect").classList.remove("color-menu-drop-effect-on")

    e.preventDefault();
    e.stopPropagation();

    const dt = e.dataTransfer;
    if (!dt) return;
    if (dt.items) {
        console.log(dt.items)
        const items = await getAllFileEntries(dt.items);
        if (!items) return
        const files = await Promise.all(items.map((item) => new Promise((resolve, reject) => {
            item.file(resolve, reject);
        })));
        addPaletteViewsFromFiles(files.length ? files : [...dt.files]);
    } else if (dt.files) {
        addPaletteViewsFromFiles([...dt.files]);
    }
}

async function getAllFileEntries(dataTransferItemList) {
    let fileEntries = [];
    let queue = [];
    for (let i = 0; i < dataTransferItemList.length; i++) {
        const entry = dataTransferItemList[i].webkitGetAsEntry();
        if (entry) {
            queue.push(entry);
        }
    }
    while (queue.length > 0) {
        let entry = queue.shift();
        if (entry.isFile) {
            fileEntries.push(entry);
        } else if (entry.isDirectory) {
            return false
        }
    }
    return fileEntries;
}

const colorThief = new ColorThief();


function addPaletteViewsFromFiles(files) {
    files.forEach((file, i) => {
        if (file.type.startsWith("image/")) {
            var el = document.createElement("img")
            el.src = URL.createObjectURL(file)
            el.alt = file.name
            el.style.width = "100px"
            el.style.display = "none"
            el.onload = (e) => {
                var colors = colorThief.getPalette(el, 20)
                var finCol = []
                if (colors) {
                    colors.forEach(e => {
                        e.push(255)
                        finCol.push({ red: e[0] / 255, green: e[1] / 255, blue: e[2] / 255 })
                    })
                    new paletteGroup(truncate(el.alt), formatAnyPalette(AnyPalette.uniqueColors(finCol)), true)
                } else {
                    document.getElementById("color-menu-drop-err").classList.add("color-menu-drop-err-on")
                    setTimeout(() => {
                        document.getElementById("color-menu-drop-err").classList.remove("color-menu-drop-err-on")
                    }, 2000);
                }
                document.body.removeChild(el)

            }
            document.body.appendChild(el)
        } else {
            setTimeout(function() {
                AnyPalette.loadPalette(file, function(err, palette, formatUsed, matchedFileExtension) {
                    if (palette) {
                        console.log(file.name.replaceArray(formatUsed.fileExtensionsPretty.split(", "), ""))
                        console.log(palette)
                        new paletteGroup(truncate(file.name.replaceArray(formatUsed.fileExtensionsPretty.split(", "), "")), formatAnyPalette(AnyPalette.uniqueColors(palette)), true)
                    }
                    if (err) {
                        document.getElementById("color-menu-drop-err").classList.add("color-menu-drop-err-on")
                        setTimeout(() => {
                            document.getElementById("color-menu-drop-err").classList.remove("color-menu-drop-err-on")
                        }, 2000);
                    }
                });
            }, i * 100);
        }
    });
}

function formatAnyPalette(palette) {
    let pal = []
    palette.forEach(e => {
        pal.push([clamp(Math.round(e.red * 255), 0, 255), clamp(Math.round(e.green * 255), 0, 255), clamp(Math.round(e.blue * 255), 0, 255), 255])
    })
    return pal
}
var defaultPalettes = [{
    title: "Default",
    colors: [
        [36, 61, 126, 255],
        [28, 61, 96, 255],
        [17, 96, 102, 255],
        [31, 126, 118, 255],
        [50, 166, 139, 255],
        [23, 223, 120, 255],
        [13, 245, 125, 255],
        [1, 255, 170, 255],
        [145, 255, 231, 255],
        [217, 255, 253, 255],
        [170, 247, 255, 255],
        [140, 220, 255, 255],
        [115, 183, 255, 255],
        [74, 137, 255, 255],
        [41, 69, 254, 255],
        [32, 50, 164, 255],
        [118, 41, 195, 255],
        [176, 36, 104, 255],
        [210, 24, 86, 255],
        [237, 31, 76, 255],
        [255, 77, 46, 255],
        [255, 141, 84, 255],
        [249, 192, 131, 255],
        [255, 251, 214, 255],
        [255, 255, 255, 255],
        [180, 140, 108, 255],
        [142, 104, 73, 255],
        [99, 58, 41, 255],
        [78, 36, 25, 255],
        [42, 13, 9, 255]
    ]
}, {
    title: "dont remember",
    colors: [
        [91, 166, 117, 255],
        [107, 201, 108, 255],
        [171, 221, 100, 255],
        [252, 239, 141, 255],
        [255, 184, 121, 255],
        [234, 98, 98, 255],
        [204, 66, 94, 255],
        [163, 40, 88, 255],
        [117, 23, 86, 255],
        [57, 9, 71, 255],
        [97, 24, 81, 255],
        [135, 53, 85, 255],
        [166, 85, 95, 255],
        [201, 115, 115, 255],
        [242, 174, 153, 255],
        [255, 195, 242, 255],
        [238, 143, 203, 255],
        [212, 110, 179, 255],
        [135, 62, 132, 255],
        [31, 16, 42, 255],
        [74, 48, 82, 255],
        [123, 84, 128, 255],
        [166, 133, 159, 255],
        [217, 189, 200, 255],
        [255, 255, 255, 255],
        [174, 226, 255, 255],
        [141, 183, 255, 255],
        [109, 128, 250, 255],
        [132, 101, 236, 255],
        [131, 77, 196, 255],
        [125, 45, 160, 255],
        [78, 24, 124, 255]
    ]
}, {
    title: "Astralae",
    colors: [
        [255, 241, 170, 255],
        [255, 247, 219, 255],
        [255, 255, 255, 255],
        [224, 254, 255, 255],
        [193, 240, 255, 255],
        [174, 224, 247, 255],
        [113, 215, 253, 255],
        [20, 175, 255, 255],
        [57, 94, 255, 255],
        [82, 69, 224, 255],
        [72, 58, 153, 255],
        [122, 99, 246, 255],
        [150, 133, 251, 255],
        [188, 137, 252, 255],
        [212, 155, 243, 255],
        [253, 142, 241, 255],
        [255, 169, 251, 255],
        [253, 191, 254, 255],
        [254, 205, 255, 255],
        [253, 234, 254, 255],
        [103, 228, 255, 255],
        [94, 255, 254, 255]
    ]
}]

var defaultHexPalettes = [{
    title: "Default",
    colors: [
        "#243d7eff",
        "#1c3d60ff",
        "#116066ff",
        "#1f7e76ff",
        "#32a68bff",
        "#17df78ff",
        "#0df57dff",
        "#01ffaaff",
        "#91ffe7ff",
        "#d9fffdff",
        "#aaf7ffff",
        "#8cdcffff",
        "#73b7ffff",
        "#4a89ffff",
        "#2945feff",
        "#2032a4ff",
        "#7629c3ff",
        "#b02468ff",
        "#d21856ff",
        "#ed1f4cff",
        "#ff4d2eff",
        "#ff8d54ff",
        "#f9c083ff",
        "#fffbd6ff",
        "#ffffffff",
        "#b48c6cff",
        "#8e6849ff",
        "#633a29ff",
        "#4e2419ff",
        "#2a0d09ff"
    ]
}, {
    title: "dont remember",
    colors: [
        "#5ba675ff",
        "#6bc96cff",
        "#abdd64ff",
        "#fcef8dff",
        "#ffb879ff",
        "#ea6262ff",
        "#cc425eff",
        "#a32858ff",
        "#751756ff",
        "#390947ff",
        "#611851ff",
        "#873555ff",
        "#a6555fff",
        "#c97373ff",
        "#f2ae99ff",
        "#ffc3f2ff",
        "#ee8fcbff",
        "#d46eb3ff",
        "#873e84ff",
        "#1f102aff",
        "#4a3052ff",
        "#7b5480ff",
        "#a6859fff",
        "#d9bdc8ff",
        "#ffffffff",
        "#aee2ffff",
        "#8db7ffff",
        "#6d80faff",
        "#8465ecff",
        "#834dc4ff",
        "#7d2da0ff",
        "#4e187cff"
    ]
}, {
    title: "Astralae",
    colors: [
        "#fff1aaff",
        "#fff7dbff",
        "#ffffffff",
        "#e0feffff",
        "#c1f0ffff",
        "#aee0f7ff",
        "#71d7fdff",
        "#14afffff",
        "#395effff",
        "#5245e0ff",
        "#483a99ff",
        "#7a63f6ff",
        "#9685fbff",
        "#bc89fcff",
        "#d49bf3ff",
        "#fd8ef1ff",
        "#ffa9fbff",
        "#fdbffeff",
        "#fecdffff",
        "#fdeafeff",
        "#67e4ffff",
        "#5efffeff"
    ]
}]

function clearPalettes() {
    filePalettes = []
    var palettes = document.getElementById("palettes")
    palettes.textContent = '';

}
var setCurrent = false;

var filePalettes = []

class paletteGroup {
    constructor(title, palette, scroll) {
        var pal = {
            title: title,
            colors: palette
        }
        filePalettes.push(pal)
        console.log(palette)
        var id = randomString(7);
        console.log(id)
        var paletteParent = document.getElementById("palettes")
        var group = document.createElement("div")
        group.classList.add("color-palette-group")
        group.setAttribute("data-palette-id", id)
        var titleEl = document.createElement("h2")
        titleEl.classList.add("color-palette-title")
        titleEl.innerText = title

        group.appendChild(titleEl)
        var colorMenu = document.createElement("div")
        colorMenu.classList.add("ui")
        colorMenu.classList.add("color-palette-menu")
        group.appendChild(colorMenu)
        paletteParent.appendChild(group)

        //TODO rewrite so that this works with more than one palette


        var curX = 0;
        var startX = 0;
        var initialX = 0;
        var curY = 0;
        var startY = 0;
        var initialY = 0;
        var tX = 0
        var offsetX = 0
        var tY = 0
        var offsetY = 0
        var mainMoving = false;
        var limit = 5;
        var tempNode;
        var startRect;
        var subMoving = false;
        var tempOut = false
        var snapped = false

        var holdTimeout
        var holdMovementAllowed = false


        var _self = this

        function mouseDownHandler(e, _self) { //only initial press
            if (holdMovementAllowed && !tempOut) e.preventDefault();
            if (tempOut) return;
            startRect = group.getBoundingClientRect()
            tempNode = group.cloneNode(true)
            tempNode.style.setProperty("--pX", "-200px")
            tempNode.style.setProperty("--pY", "-200px")
            tempNode.querySelector(".color-palette-title").onmouseup = mouseUpHandler
            tempNode.querySelector(".color-palette-title").onmousedown = tempNode.querySelector(".color-palette-title").ontouchstart = (e) => {
                e.preventDefault()
                startRect = e.target.getBoundingClientRect()
                if (tempOut) {
                    subMoving = true;
                    startX = e.clientX || e.touches[0].clientX;
                    startY = e.clientY || e.touches[0].clientY;
                    document.querySelectorAll(".color-palette-group").forEach(e => {
                        e.style.setProperty('z-index', 'unset', 'important')
                    })
                    group.style.setProperty('z-index', '999', 'important')
                    tempNode.style.setProperty('z-index', '1000', 'important')
                }
            }
            tempNode.classList.replace("color-palette-group", "color-palette-standalone")
            tempNode.style.width = startRect.width + "px"
            document.body.appendChild(tempNode)
            mainMoving = true;
            startX = e.clientX || e.touches[0].clientX || 0;
            startY = e.clientY || e.touches[0].clientY || 0;
            document.querySelectorAll(".color-palette-group").forEach(e => {
                e.style.setProperty('z-index', 'unset', 'important')
            })
            holdTimeout = setTimeout(() => {
                holdMovementAllowed = true
                if (isMobile && holdMovementAllowed) {
                    snapped = true;
                    mouseUpHandler();
                    debug.log("canMove")
                    tempNode.classList.add("color-palette-standalone-popout")
                    moveHandler(e)
                    e.preventDefault();
                }
            }, 1000);
            group.style.setProperty('z-index', '999', 'important')
            tempNode.style.setProperty('z-index', '1000', 'important')
        }

        function mouseUpHandler(e, _self) {
            if (tempNode) tempNode.classList.remove("color-palette-standalone-popout")
            if (!snapped && tempNode) {
                clearTimeout(holdTimeout)
                mainMoving = false;
                subMoving = false
                tempNode.style.setProperty("--pX", "-200px")
                tempNode.style.setProperty("--pY", "-200px")
                tempNode.remove()
            }
            if (tempOut) { mouseUpSub(); return }
            if (tempOut == false) { //if the node has not snapped out
                mainMoving = false;
                if (snapped) tempOut = true
                subMoving = true
                offsetX = curX
                offsetY = curY
                var timeout = setInterval(() => {
                    var nX = lerp(curX, initialX, 0.1);
                    var nY = lerp(curY, initialY, 0.1);
                    group.style.transform = `translate(${Math.round(nX)}px, ${Math.round(nY)}px)`;
                    curX = nX;
                    curY = nY;

                    if (Math.abs(curX - initialX) < 0.1 && Math.abs(curY - initialY) < 0.1) {
                        curX = initialX;
                        curY = initialY;
                        group.style.transform = "unset";
                        clearTimeout(timeout);
                    }
                }, 2);
            } else {
                return
            }
        }

        function mouseUpSub() {
            subMoving = false
        }
        document.addEventListener("mouseup", mouseUpHandler)
        document.addEventListener("touchend", mouseUpHandler)
        document.addEventListener("mousemove", (e) => { moveHandler(e, _self) })
        document.addEventListener("touchmove", (e) => { moveHandler(e, _self) })
        titleEl.onmouseup = titleEl.ontouchend = (e) => { mouseUpHandler(e, _self) }
        titleEl.onmousedown = titleEl.ontouchstart = (e) => { mouseDownHandler(e, _self) }

        function moveHandler(e, _self) {
            if (holdMovementAllowed) { e.preventDefault(); }
            var cX, cY
            if (e.touches) {
                cX = e.touches[0].clientX
                cY = e.touches[0].clientY
            } else {
                cX = e.clientX
                cY = e.clientY
            }
            var x = cX - startX || 0;
            var y = cY - startY || 0;
            if (mainMoving && isMobile) {
                if (Math.abs(x) > 10 || Math.abs(y) > 10) {
                    clearTimeout(holdTimeout)
                }
            } else if (mainMoving && !isMobile) {
                curX = lerp(x, 0, 0.7);
                curY = lerp(y, 0, 0.7);
                group.style.transform = `translate(${Math.ceil(curX)}px, ${Math.ceil(curY)}px)`;
                tempNode.style.setProperty("--pX", `${startRect.x + Math.ceil(curX) - 8}px`)
                tempNode.style.setProperty("--pY", `${startRect.y + Math.ceil(curY) - 8}px`)
                if (Math.abs(curX) > 100 || Math.abs(curY) > 100) {
                    snapped = true;
                    mouseUpHandler();
                    debug.log("snapped")
                }
                return

            }
            if (!tempNode) return
            if (!subMoving) return;
            if (subMoving) {
                if (holdMovementAllowed && isMobile) {
                    tX = x - offsetX
                    tY = y - offsetY
                    tempNode.style.setProperty("--pX", `${startRect.x + Math.ceil(tX) - 14}px`)
                    tempNode.style.setProperty("--pY", `${startRect.y + Math.ceil(tY) - 12}px`)
                } else if (!isMobile) {
                    var timeout = setInterval(() => {
                        offsetX = lerp(0, offsetX, 0.99)
                        offsetY = lerp(0, offsetY, 0.99)
                        if (Math.abs(offsetX) < 0.1 && Math.abs(offsetY) < 0.1) {
                            offsetX = 0
                            offsetY = 0
                        }
                    }, 2);
                    tX = x - offsetX
                    tY = y - offsetY
                    tempNode.style.setProperty("--pX", `${startRect.x + Math.ceil(tX) - 8}px`)
                    tempNode.style.setProperty("--pY", `${startRect.y + Math.ceil(tY) - 30}px`)

                }

            }
        }

        palette.forEach((x, i) => {
            if (!setCurrent && typeof board !== 'undefined') {
                setCurrent = true
            }
            var rgba = `rgba(${x[0]},${x[1]},${x[2]}, ${x[3] / 256 * 100}%)`
            let e = document.createElement("div")
            e.setAttribute("data-palette-color", `${rgbToHex(x[0], x[1], x[2], x[3])}`)
            if (scroll) {
                e.style.opacity = 0;
                e.style.transitionDelay = (1000 / palette.length / 3) * i + "ms"
                setTimeout(() => {
                    e.style.opacity = 1
                }, 200);
            }
            e.classList.add('palette-color')
            e.style.setProperty("--color", rgba)
            e.setAttribute("onclick", `board.setcolor([${x}]); updatePrevious([${x}])`)
            colorMenu.appendChild(e)
        })
        console.log(palette)

        board.setcolor(palette[0])
        var rect = colorMenu.getBoundingClientRect()
        var colorMenu = document.getElementById("color-menu")
        if (scroll) document.getElementById("color-menu").scrollTo({ behavior: "smooth", top: (colorMenu.scrollTop + rect.top) });
    }
}

function preparePalette() {
    colors.forEach(g => {
        var title = truncate(g.title)
        var palette = g.colors
        new paletteGroup(title, palette)

    });
}