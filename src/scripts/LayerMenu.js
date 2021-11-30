
function toggleLayerMenu() {
    document.getElementById('layer-menu').classList.toggle("layer-open")
    document.getElementById('color-menu').classList.remove("color-open")
}
var container = document.querySelector("#layer-main");
sorter = new dragSort(container, "layer-wrap");

var order = [
    {
        "name": "Layer 1",
        "index": 5
    },
    {
        "name": "Layer 2",
        "index": 4

    },
    {
        "name": "Layer 3",
        "index": 3

    },
    {
        "name": "Layer 4",
        "index": 2

    },
    {
        "name": "Layer 5",
        "index": 1

    },
    {
        "name": "Layer 6",
        "index": 0

    }
]


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

    var raf;

    var intersectionStructure = [];

    const scrollTriggerAreaRatio = 0.3;

    var scrollTriggerAreaTop, scrollTriggerAreaBottom;

    container.addEventListener("pointerdown", userPressed, {
        passive: true
    });

    function userPressed(event) {
        console.log("start");

        console.log(ths.enabled);

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

            initFloatingItem(targetElement, event.clientY);

            container.addEventListener("pointermove", userMoved, { passive: true });
            container.addEventListener("pointerup", userReleased, { passive: true });
            container.addEventListener("pointercancel", userReleased, {
                passive: true
            });
            container.addEventListener("pointerleave", userReleased);

            beginScroll(event.clientY);
            beginRenderLoop(event.clientY);

            container.classList.add("active");
            targetElement.classList.add("moving");
        }

        timedStart(container, event.clientX, event.clientY, 400, initDragging);
    }

    function userMoved(event) {
        console.log("move");

        lastClientY = event.clientY;
    }

    function userReleased(event) {
        console.log("end");

        container.classList.remove("active");

        endRenderLoop();

        container.removeEventListener("pointermove", userMoved);
        container.removeEventListener("pointerup", userReleased);
        container.removeEventListener("pointercancel", userReleased);
        container.removeEventListener("pointerleave", userReleased);

        restoreFloatingItem(event.clientY);
        returnRenderLoop()

        dragging = false;
        draggingElement.it.classList.remove("moving");
    }

    function beginRenderLoop(clientY) {
        lastClientY = clientY;
        mainRenderLoop();
    }
    var curScale = 1
    var scaleDest = 1
    var activeScale = 0.8
    var neutralScale = 1
    var curPos = 0
    var activePos = 0
    var posDest = 0
    function mainRenderLoop() {
        curScale = lerp(curScale, scaleDest, .6)
        draggingElement.it.style.setProperty("--s", Math.round(curScale * 100) / 100)
        translateFloatingItem(lastClientY);
        updateScroll(lastClientY);

        raf = requestAnimationFrame(mainRenderLoop);
    }

    function endRenderLoop() {
        cancelAnimationFrame(raf);
    }
    var retRaf;

    function returnRenderLoop() {
        curScale = lerp(curScale, neutralScale, .25)
        curPos = lerp(curPos, posDest, .25)
        draggingElement.it.style.setProperty("--s", curScale)
        draggingElement.it.style["transform"] = "translateY(" + (curPos - posDest) + "px) scale(var(--s), var(--s))"
        retRaf = requestAnimationFrame(returnRenderLoop)
        if (Math.abs(neutralScale - curScale) < 0.01 && Math.abs(curPos - posDest) < 0.01) {
            draggingElement.it.style.setProperty("--s", neutralScale)
            draggingElement.it.style["transform"] = "translateY(0px) scale(var(--s), var(--s))"
            endReturnRenderLoop()
        }
    }

    function endReturnRenderLoop() {
        cancelAnimationFrame(retRaf)
    }

    function initFloatingItem(target, clientY) {
        scaleDest = activeScale
        draggingElement.it = target;
        draggingElement.bbox = draggingElement.it.getBoundingClientRect();
        draggingElement.offset = draggingElement.bbox.top - clientY;
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

        translateFloatingItem(clientY);


        var nodes = Array.prototype.slice.call(draggingElement.it.parentElement.children)
        oIndex = nodes.indexOf(draggingElement.it)
        console.log()
        draggingElement.containerPadding = container.style["padding-bottom"];
        container.style["padding-bottom"] =
            "" + (draggingElement.bbox.height + (oIndex == draggingElement.it.parentElement.children.length - 1 ? 0 : 6) ) + "px";
    }

    var elementPosition
    function translateFloatingItem(clientY) {
        var currentScroll = getScroll();
        elementPosition = (clientY + draggingElement.offset) - 70;

        draggingElement.it.style.transform =
            "translateY(" + (elementPosition) + "px) scale(var(--s), var(--s))";

        drawGap(
            calculateListIndex(clientY + currentScroll),
            draggingElement.bbox.height
        );
    }

    function restoreFloatingItem(lastClientY) {
        activePos = elementPosition
        curPos = activePos
        posDest = 69 * (calculateListIndex(lastClientY + getScroll()))
        console.log(elementPosition, 69 * (calculateListIndex(lastClientY + getScroll())))
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
                it.style.transform = "translateY(" + (size + 6) + "px) scale(var(--s), var(--s))";
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
        arraymove(order, oIndex, finalIndex)
        for (let i = 0; i < order.length; i++) {
            const el = order[i];
            el.index = (order.length - 1) - i
        }
        console.table(order)

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

    function beginScroll(cursorY) {
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

    function updateScroll(cursorY) {
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

        setTimeout(function () {
            eventTarget.removeEventListener("pointerup", setCancel);
            eventTarget.removeEventListener("pointercancel", setCancel);
            eventTarget.removeEventListener("pointerleave", setCancel);
            eventTarget.removeEventListener("pointermove", updateMovement);

            if (
                !cancelAction &&
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