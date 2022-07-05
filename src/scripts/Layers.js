function toggleLayerMenu() {
    document.getElementById('layer-menu').classList.toggle("layer-open")
    document.getElementById('color-menu').classList.remove("color-open")
    document.getElementById('layer-toggle-button').classList.toggle("tool-active")
}
var container = document.querySelector("#layer-main");
sorter = new dragSort(container, "layer-wrap");

var layers = []

var activeLayer = null


function dragSort(container, handleClass, scrollElement = null) {
    if (scrollElement === null) scrollElement = window;

    this.enabled = true;
    var ths = this;

    const scrollElementTop =
        scrollElement !== window ? scrollElement.getBoundingClientRect().top : 0;

    var dragging = false;
    var draggingElement = {
        it: null,
        bbox: null,
        index: null,
        zIndex: "",
        position: "",
        transform: "",
        styleWidth: "",

        containerPadding: ""
    };


    var lastClientY;
    var lastClientX;

    var singleClick = false;

    var raf;

    var intersectionStructure = [];

    const scrollTriggerAreaRatio = 0.3;

    var scrollTriggerAreaTop, scrollTriggerAreaBottom;

    container.addEventListener("pointerdown", userPressed, {
        passive: true
    });

    function userPressed(event) {

        if (singleClick) {
            var layer = layers.find(element => element.layerElement == event.target);

            openLayerSettings(layer)
            console.log(event.target)
            clearTimeout(dbtimeout)
        }
        if (!singleClick) {
            singleClick = true;
            var dbtimeout = setTimeout(() => {
                singleClick = false;
            }, 400);
        }

        if (!ths.enabled) return;

        var dragHandle = event.target;
        if (!dragHandle.classList.contains(handleClass)) return;

        var targetElement = dragHandle;

        while (true) {
            if (targetElement.parentElement === container) break;
            targetElement = targetElement.parentElement;
        }

        function initDragging() {
            if (dragging) return;
            dragging = true;

            initIntersectionState();

            initFloatingItem(targetElement, event.clientX, event.clientY);

            document.addEventListener("pointermove", userMoved, { passive: true });
            document.addEventListener("pointerup", userReleased, { passive: true });
            document.addEventListener("pointercancel", userReleased, {
                passive: true
            });
            document.addEventListener("pointerleave", userReleased);

            beginScroll(event.clientX, event.clientY);
            beginRenderLoop(event.clientX, event.clientY);

            container.classList.add("active");
            targetElement.classList.add("moving");
        }

        timedStart(container, event.clientX, event.clientY, 400, initDragging);
    }

    function userMoved(event) {
        console.log("move");

        lastClientY = event.clientY;
        lastClientX = event.clientX;
    }

    function userReleased(event) {
        console.log("end");
        reorderLayers()

        container.classList.remove("active");

        endRenderLoop();

        document.removeEventListener("pointermove", userMoved);
        document.removeEventListener("pointerup", userReleased);
        document.removeEventListener("pointercancel", userReleased);
        document.removeEventListener("pointerleave", userReleased);

        restoreFloatingItem(event.clientY);
        returnRenderLoop()

        dragging = false;
        draggingElement.it.classList.remove("moving");
    }

    function beginRenderLoop(clientX, clientY) {
        lastClientY = clientY;
        lastClientX = clientX;
        mainRenderLoop();
    }
    var curScale = 1
    var scaleDest = 1
    var activeScale = 0.9
    var neutralScale = 1
    var curPosY = 0
    var curPosX = 0
    var activePosY = 0
    var posDestY = 0
    var posDestX = 0

    function endRenderLoop() {
        cancelAnimationFrame(raf);
    }
    var retRaf;

    function returnRenderLoop() {
        curScale = lerp(curScale, neutralScale, .25)
        curPosY = lerp(curPosY, posDestY, .25)
        curPosX = lerp(curPosX, posDestX, .25)
        draggingElement.it.style.setProperty("--s", curScale)
        draggingElement.it.style["transform"] = "translate(" + (curPosX - posDestX) + "px," + (curPosY - posDestY) + "px) scale(var(--s), var(--s))"
        retRaf = requestAnimationFrame(returnRenderLoop)
        if (Math.abs(neutralScale - curScale) < 0.01 && Math.abs(curPosY - posDestY) < 0.01 && Math.abs(curPosX - posDestX) < 0.01) {
            draggingElement.it.style.setProperty("--s", neutralScale)
            draggingElement.it.style["transform"] = "translate(0px, 0px) scale(var(--s), var(--s))"
            endReturnRenderLoop()
        }
    }

    function endReturnRenderLoop() {
        cancelAnimationFrame(retRaf)
    }

    function mainRenderLoop() {
        curScale = lerp(curScale, scaleDest, .2)
        draggingElement.it.style.setProperty("--s", Math.round(curScale * 100) / 100)
        translateFloatingItem(lastClientX, lastClientY);
        updateScroll(lastClientX, lastClientY);

        draggingElement.centerOffsetX = lerp(draggingElement.centerOffsetX, draggingElement.targetCenterOffsetX, 0.6)
        draggingElement.centerOffsetY = lerp(draggingElement.centerOffsetY, draggingElement.targetCenterOffsetY, 0.6)

        raf = requestAnimationFrame(mainRenderLoop);
    }

    function initFloatingItem(target, clientX, clientY) {
        scaleDest = activeScale
        draggingElement.it = target;
        draggingElement.bbox = draggingElement.it.getBoundingClientRect();
        draggingElement.offsetY = draggingElement.bbox.top - clientY;
        draggingElement.offsetX = clientX;
        draggingElement.centerOffsetX = 0
        draggingElement.targetCenterOffsetX = ((draggingElement.bbox.width * .5) - (clientX - draggingElement.bbox.left));
        draggingElement.centerOffsetY = 0
        draggingElement.targetCenterOffsetY = ((draggingElement.bbox.height * .5) - (clientY - draggingElement.bbox.top));
        console.log(draggingElement.bbox.top)

        draggingElement.index = Array.prototype.indexOf.call(
            draggingElement.it.parentNode.children,
            draggingElement.it
        );

        draggingElement.zIndex = draggingElement.it.style["z-index"];
        draggingElement.position = draggingElement.it.style["position"];
        draggingElement.transform = draggingElement.it.style["transform"];
        draggingElement.styleWidth = draggingElement.it.style["width"];
        draggingElement.it.style["z-index"] = 500;
        draggingElement.it.style["position"] = "fixed";
        draggingElement.it.style.setProperty("top", '0px');
        draggingElement.it.style["width"] = (draggingElement.bbox.width - 8) + "px";

        translateFloatingItem(clientX, clientY);


        var nodes = Array.prototype.slice.call(draggingElement.it.parentElement.children)
        oIndex = nodes.indexOf(draggingElement.it)
        console.log()
        draggingElement.containerPadding = container.style["padding-bottom"];
        container.style["padding-bottom"] =
            "" + (draggingElement.bbox.height + (oIndex == draggingElement.it.parentElement.children.length - 1 ? 0 : 8)) + "px";
    }

    var elementPositionY
    var elementPositionX

    function translateFloatingItem(clientX, clientY) {
        var currentScroll = getScroll();
        elementPositionY = (clientY + draggingElement.offsetY - draggingElement.centerOffsetY) - 102;
        elementPositionX = (clientX - draggingElement.offsetX - draggingElement.centerOffsetX);

        draggingElement.it.style.transform =
            "translate(" + (elementPositionX) + "px, " + (elementPositionY) + "px) scale(var(--s), var(--s))";

        drawGap(
            calculateListIndex(clientY + currentScroll),
            draggingElement.bbox.height
        );
    }

    function restoreFloatingItem(lastClientY) {
        activePosY = elementPositionY
        curPosY = activePosY
        activePosX = elementPositionX
        curPosX = activePosX
        posDestY = 69 * (calculateListIndex(lastClientY + getScroll()))
        posDestX = 0
        draggingElement.it.style["position"] = draggingElement.position;
        draggingElement.it.style["z-index"] = draggingElement.zIndex;
        clearGap();


        moveItemTo(
            draggingElement,
            calculateListIndex(lastClientY + getScroll())
        );
        container.style["padding-bottom"] = "0px";
    }

    function initIntersectionState() {
        var currentScroll = getScroll();

        sortableItems = [];

        var children = container.children;

        var previousBottom = null;
        for (var i = 0; i < children.length; i++) {
            var rect = children[i].getBoundingClientRect();

            if (i == 0) {
                sortableItems.push(rect.top + currentScroll);
                previousBottom = rect.bottom + currentScroll;
            } else if (i == children.length - 1) {
                var thisTop = rect.top + currentScroll;
                var averageTop = (previousBottom + thisTop) / 2;
                sortableItems.push(averageTop);
                sortableItems.push(rect.bottom + currentScroll);
            } else {
                var thisTop = rect.top + currentScroll;
                var averageTop = (previousBottom + thisTop) / 2;
                sortableItems.push(averageTop);
                previousBottom = rect.bottom + currentScroll;
            }
        }

        intersectionStructure = [];

        var chunk = [];
        for (var i = 0; i < sortableItems.length; i++) {
            chunk.push(sortableItems[i]);
            if (chunk.length == 33) {
                intersectionStructure.push(chunk[0]);
                intersectionStructure.push(chunk);
                chunk = [sortableItems[i]];
            }
        }

        if (chunk.length > 1) {
            intersectionStructure.push(chunk[0]);
            intersectionStructure.push(chunk);
        }

        intersectionStructure.push(chunk[chunk.length - 1]);
    }

    this.initIntersectionState = initIntersectionState;

    function calculateListIndex(yInListSpace) {
        var listIndex = 0;

        if (
            yInListSpace >=
            intersectionStructure[intersectionStructure.length - 1]
        ) {
            listIndex = container.children.length - 1;
        } else {
            for (var i = 1; i < intersectionStructure.length; i += 2) {
                if (
                    yInListSpace >= intersectionStructure[i - 1] &&
                    yInListSpace < intersectionStructure[i + 1]
                ) {
                    for (var ii = 0; ii < intersectionStructure[i].length; ii++) {
                        if (
                            yInListSpace >= intersectionStructure[i][ii] &&
                            yInListSpace < intersectionStructure[i][ii + 1]
                        ) {
                            listIndex = ((i - 1) / 2) * 32 + ii;
                            break;
                        }
                    }
                }
            }
        }

        return listIndex;
    }


    function drawGap(position, size) {
        var firstVisible = calculateListIndex(scrollElementTop + getScroll());
        var lastVisible = calculateListIndex(
            scrollElementTop + getScrollableArea() + getScroll()
        );

        lastVisible += 10;

        if (lastVisible > container.children.length - 1) {
            lastVisible = container.children.length - 1;
        }

        for (var i = firstVisible; i < lastVisible + 1; i++) {
            var it = container.children[i];
            var fixPosition = i >= draggingElement.index ? 1 : 0;

            if (i === draggingElement.index) {
                continue;
            } else if (i < Math.floor(position + fixPosition)) {
                it.style.transform = "";
            } else {
                it.style.transform = "translateY(" + (size + 8) + "px) scale(var(--s), var(--s))";
            }
        }
    }

    function clearGap() {
        for (var i = 0; i < container.children.length; i++) {
            var it = container.children[i];
            scaleDest = neutralScale
            it.style.transform = "scale(var(--s), var(--s))";
        }
    }

    function moveItemTo(item, listIndex) {
        var nodes = Array.prototype.slice.call(item.it.parentElement.children)
        oIndex = nodes.indexOf(item.it)
        listIndex = listIndex + (listIndex >= item.index ? 1 : 0);
        var finalIndex
        if (oIndex - listIndex > 0) {
            finalIndex = listIndex
        } else {
            finalIndex = listIndex - 1
        }
        arraymove(layers, oIndex, finalIndex)
        for (let i = 0; i < layers.length; i++) {
            const el = layers[i];
            el.index = (layers.length - 1) - i
        }
        console.table(layers)

        if (listIndex == 0) {
            container.prepend(item.it);
        } else {
            container.children[listIndex - 1].after(item.it);
        }
    }

    function getScrollableArea() {
        if (scrollElement === window) {
            return document.documentElement.clientHeight;
        } else {
            return scrollElement.getBoundingClientRect().height;
        }
    }

    function getScroll() {
        if (scrollElement === window) {
            return scrollElement.scrollY;
        } else {
            return scrollElement.scrollTop;
        }
    }

    function beginScroll(cursorX, cursorY) {
        var relativeCursorY = cursorY - scrollElementTop;

        height = getScrollableArea();
        var maxScrollTriggerArea = height * scrollTriggerAreaRatio;

        scrollTriggerAreaTop = maxScrollTriggerArea;
        scrollTriggerAreaBottom = maxScrollTriggerArea;

        if (relativeCursorY < maxScrollTriggerArea) {
            scrollTriggerAreaTop = relativeCursorY;
        }

        if (relativeCursorY > height - maxScrollTriggerArea) {
            scrollTriggerAreaBottom = height - relativeCursorY;
        }
    }

    function updateScroll(cursorX, cursorY) {
        var relativeCursorY = cursorY - scrollElementTop;

        var height = getScrollableArea();
        var maxScrollTriggerArea = height * scrollTriggerAreaRatio;

        var newTriggerAreaTop = relativeCursorY;
        var newTriggerAreaBottom = height - relativeCursorY;

        if (
            newTriggerAreaTop <= maxScrollTriggerArea &&
            newTriggerAreaTop > scrollTriggerAreaTop
        ) {
            scrollTriggerAreaTop = newTriggerAreaTop;
        }

        if (
            newTriggerAreaBottom <= maxScrollTriggerArea &&
            newTriggerAreaBottom > scrollTriggerAreaBottom
        ) {
            scrollTriggerAreaBottom = newTriggerAreaBottom;
        }

        if (relativeCursorY < scrollTriggerAreaTop) {
            shouldScrollBy = (relativeCursorY - scrollTriggerAreaTop) * 0.07;
        } else if (relativeCursorY > height - scrollTriggerAreaBottom) {
            shouldScrollBy =
                (relativeCursorY - (height - scrollTriggerAreaBottom)) * 0.07;
        } else {
            shouldScrollBy = 0;
        }

        scrollElement.scrollBy(0, shouldScrollBy);
    }

    function timedStart(
        eventTarget,
        startX,
        startY,
        delay,
        continueCallback
    ) {
        console.log(delay);

        var cancelAction = false;

        function setCancel() {
            cancelAction = true;
        }

        eventTarget.addEventListener("pointerup", setCancel);
        eventTarget.addEventListener("pointercancel", setCancel);
        eventTarget.addEventListener("pointerleave", setCancel);

        var endX = startX;
        var endY = startY;

        function updateMovement(e) {
            endX = e.clientX;
            endY = e.clientY;
        }

        eventTarget.addEventListener("pointermove", updateMovement);

        setTimeout(function() {
            eventTarget.removeEventListener("pointerup", setCancel);
            eventTarget.removeEventListener("pointercancel", setCancel);
            eventTarget.removeEventListener("pointerleave", setCancel);
            eventTarget.removeEventListener("pointermove", updateMovement);

            if (!cancelAction &&
                Math.abs(startX - endX) < 5 &&
                Math.abs(startY - endY) < 5
            ) {
                console.log("here");

                continueCallback();
            }
        }, delay);
    }
}


function arraymove(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}

function populateLayers() {
    layers.forEach(e => {
        createLayer(e.name)
    })
}

function createLayer(n, data, settings) { //create layer with set data; e.g. load a layer from a file
    console.log(project.width, project.height)
    var id = randomString(10)
    console.log(layers.length)
    var wrap = document.createElement("div")
    wrap.classList.add("layer-wrap")
    wrap.id = "l-" + id
    wrap.onclick = (e) => {
        if (e.target == wrap) setLayer(id)
    }
    var previewWrapper = document.createElement("div")
    previewWrapper.classList.add("layer-preview")
    var preview = document.createElement("canvas")
    preview.width = project.width
    preview.height = project.height
    var name = document.createElement("div")
    name.classList.add("layer-name")
    name.innerText = n
    wrap.appendChild(previewWrapper)
    previewWrapper.appendChild(preview)
    wrap.appendChild(name)
    document.getElementById('layer-main').prepend(wrap)

    var visButton = document.createElement("button")
    visButton.classList.add("layer-visibility")
    visButton.setAttribute("onclick", `toggleLayerVisibility('${id}', this)`)

    var visIcon = document.createElement("i")
    visIcon.classList.add("hi-eye-line")

    visButton.appendChild(visIcon)

    var lockButton = document.createElement("button")
    lockButton.classList.add("layer-locked")
    lockButton.setAttribute("onclick", `toggleLayerLock('${id}', this)`)

    var lockIcon = document.createElement("i")
    lockIcon.classList.add("hi-lock-open-line")

    lockButton.appendChild(lockIcon)

    wrap.appendChild(visButton)

    wrap.appendChild(lockButton)

    var drawCanvas = document.createElement("canvas");
    drawCanvas.setAttribute("customcursor", "")
    drawCanvas.width = project.width;
    drawCanvas.height = project.height;
    drawCanvas.classList.add("drawingCanvas")
    drawCanvas.id = "c-" + id
    drawCanvas.style.setProperty("--zindex", layers.length);
    var context = drawCanvas.getContext("2d")
    document.getElementById('layers-wrap').prepend(drawCanvas)

    layers.unshift({
        "name": n,
        "index": layers.length,
        "id": id,
        "previewCanvas": preview,
        "previewCTX": preview.getContext("2d"),
        "layerElement": wrap,
        "canvasElement": drawCanvas,
        "ctx": context,
        "settings": {
            "visible": true,
            "locked": false
        },
        "data": data
    })
    let img = new Image();
    img.setAttribute('src', data);
    img.addEventListener("load", function() {
        context.drawImage(img, 0, 0);
        preview.getContext("2d").drawImage(img, 0, 0)
    });
    setLayer(id, false)

}

function newLayer(width, height) { //create a blank layer
    console.log(project.width, project.height)
    var id = randomString(10)
    var n = "Layer " + (layers.length + 1)
    console.log(layers.length)
    var wrap = document.createElement("div")
    wrap.classList.add("layer-wrap")
    wrap.id = "l-" + id
    wrap.onclick = (e) => {
        if (e.target == wrap) setLayer(id)
    }
    var preview = document.createElement("canvas")
    preview.classList.add("layer-preview")
    preview.width = project.width
    preview.height = project.height
    var name = document.createElement("div")
    name.classList.add("layer-name")
    name.innerText = n
    wrap.appendChild(preview)
    wrap.appendChild(name)
    document.getElementById('layer-main').prepend(wrap)

    var visButton = document.createElement("button")
    visButton.classList.add("layer-visibility")
    visButton.setAttribute("onclick", `toggleLayerVisibility('${id}', this)`)

    var visIcon = document.createElement("i")
    visIcon.classList.add("hi-eye-line")

    visButton.appendChild(visIcon)

    var lockButton = document.createElement("button")
    lockButton.classList.add("layer-locked")
    lockButton.setAttribute("onclick", `toggleLayerLock('${id}', this)`)

    var lockIcon = document.createElement("i")
    lockIcon.classList.add("hi-lock-open-line")

    lockButton.appendChild(lockIcon)

    wrap.appendChild(visButton)

    wrap.appendChild(lockButton)

    var drawCanvas = document.createElement("canvas");
    drawCanvas.setAttribute("customcursor", "")
    drawCanvas.width = project.width;
    drawCanvas.height = project.height;
    drawCanvas.classList.add("drawingCanvas")
    drawCanvas.id = "c-" + id
    drawCanvas.style.setProperty("--zindex", layers.length);
    var context = drawCanvas.getContext("2d")
    document.getElementById('layers-wrap').prepend(drawCanvas)

    layers.unshift({
        "name": n,
        "index": layers.length,
        "id": id,
        "previewCanvas": preview,
        "previewCTX": preview.getContext("2d"),
        "layerElement": wrap,
        "canvasElement": drawCanvas,
        "ctx": context,
        "settings": {
            "visible": true,
            "locked": false
        },
        "data": null
    })
    setLayer(id, true)
}

function clearLayerMenu() {
    console.trace('a')
    document.getElementById('layer-main').innerText = ''
}

function clearLayers() {
    document.getElementById('layers-wrap').querySelectorAll("canvas").forEach(e => {
        e.parentElement.removeChild(e)
    })
}

function setLayer(id, setColor) {
    layer = layers.find(obj => {
        return obj.id == id
    })
    document.querySelectorAll(".layer-active").forEach(e => {
        e.classList.remove("layer-active")
    })
    if (layer) {
        layer.layerElement.classList.add("layer-active")
        activeLayer = layer
        board.ctx = layer.ctx
        board.setcolor(board.color)
    }
}

function updateCanvasPreview() {
    layer = layers.find(obj => {
        return obj.id == activeLayer.id
    })
    if (layer) {
        layer.data = layer.canvasElement.toDataURL()
        layer.previewCTX.clearRect(0, 0, layer.canvasElement.width, layer.canvasElement.height)
        layer.previewCTX.drawImage(layer.canvasElement, 0, 0)
    }
}

function reorderLayers() {
    layers.forEach(e => {
        i = e.index
        setTimeout(() => {
            e.canvasElement.style.setProperty("--zindex", e.index)
        }, 10);
    })
}

function toggleLayerVisibility(id, el) {
    layer = layers.find(obj => {
        return obj.id == id
    })
    if (layer) {
        if (layer.settings.visible == true) {
            el.querySelector("i").classList.replace("hi-eye-line", "hi-eye-crossed-line")
            layer.settings.visible = false
            layer.canvasElement.style.visibility = "hidden"
        } else if (layer.settings.visible == false) {
            el.querySelector("i").classList.replace("hi-eye-crossed-line", "hi-eye-line")
            layer.settings.visible = true
            layer.canvasElement.style.visibility = "unset"
        }
    }
}

function toggleLayerLock(id, el) {
    layer = layers.find(obj => {
        return obj.id == id
    })
    if (layer) {
        if (layer.settings.locked == true) {
            el.querySelector("i").classList.replace("hi-lock-line", "hi-lock-open-line")
            layer.settings.locked = false
        } else if (layer.settings.locked == false) {
            el.querySelector("i").classList.replace("hi-lock-open-line", "hi-lock-line")
            layer.settings.locked = true
        }
    }
}


function openLayerSettings(layer) {
    console.log(layer.settings)
}