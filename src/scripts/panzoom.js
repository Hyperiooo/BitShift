(() => {
    var __webpack_modules__ = {
        846: (__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {
            'use strict';
            eval('/* harmony import */ var _src_panzoom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(860);\n\r\nconsole.log(\'This is a demo version of Panzoom for testing.\');\r\nconsole.log(\'It exposes a global (window.Panzoom) and should not be used in production.\');\r\nwindow.Panzoom = _src_panzoom__WEBPACK_IMPORTED_MODULE_0__/* .default */ .Z;\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AcGFuem9vbS9wYW56b29tLy4vZGVtby9nbG9iYWwtcGFuem9vbS50cz83YjgwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBb0M7QUFFcEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnREFBZ0QsQ0FBQztBQUM3RCxPQUFPLENBQUMsR0FBRyxDQUFDLDRFQUE0RSxDQUFDO0FBT3pGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsMERBQU8iLCJmaWxlIjoiODQ2LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFBhbnpvb20gZnJvbSAnLi4vc3JjL3Bhbnpvb20nXG5cbmNvbnNvbGUubG9nKCdUaGlzIGlzIGEgZGVtbyB2ZXJzaW9uIG9mIFBhbnpvb20gZm9yIHRlc3RpbmcuJylcbmNvbnNvbGUubG9nKCdJdCBleHBvc2VzIGEgZ2xvYmFsICh3aW5kb3cuUGFuem9vbSkgYW5kIHNob3VsZCBub3QgYmUgdXNlZCBpbiBwcm9kdWN0aW9uLicpXG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgaW50ZXJmYWNlIFdpbmRvdyB7XG4gICAgUGFuem9vbTogdHlwZW9mIFBhbnpvb21cbiAgfVxufVxud2luZG93LlBhbnpvb20gPSBQYW56b29tXG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///846\n')
        },
        860: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
            'use strict';
            eval('\n// EXPORTS\n__webpack_require__.d(__webpack_exports__, {\n  "Z": () => (/* binding */ panzoom)\n});\n\n// EXTERNAL MODULE: ./src/polyfills.js\nvar polyfills = __webpack_require__(252);\n;// CONCATENATED MODULE: ./src/pointers.ts\n/**\r\n * Utilites for working with multiple pointer events\r\n */\r\nfunction findEventIndex(pointers, event) {\r\n    var i = pointers.length;\r\n    while (i--) {\r\n        if (pointers[i].pointerId === event.pointerId) {\r\n            return i;\r\n        }\r\n    }\r\n    return -1;\r\n}\r\nfunction addPointer(pointers, event) {\r\n    var i;\r\n    // Add touches if applicable\r\n    if (event.touches) {\r\n        i = 0;\r\n        for (var _i = 0, _a = event.touches; _i < _a.length; _i++) {\r\n            var touch = _a[_i];\r\n            touch.pointerId = i++;\r\n            addPointer(pointers, touch);\r\n        }\r\n        return;\r\n    }\r\n    i = findEventIndex(pointers, event);\r\n    // Update if already present\r\n    if (i > -1) {\r\n        pointers.splice(i, 1);\r\n    }\r\n    pointers.push(event);\r\n}\r\nfunction removePointer(pointers, event) {\r\n    // Add touches if applicable\r\n    if (event.touches) {\r\n        // Remove all touches\r\n        while (pointers.length) {\r\n            pointers.pop();\r\n        }\r\n        return;\r\n    }\r\n    var i = findEventIndex(pointers, event);\r\n    if (i > -1) {\r\n        pointers.splice(i, 1);\r\n    }\r\n}\r\n/**\r\n * Calculates a center point between\r\n * the given pointer events, for panning\r\n * with multiple pointers.\r\n */\r\nfunction getMiddle(pointers) {\r\n    // Copy to avoid changing by reference\r\n    pointers = pointers.slice(0);\r\n    var event1 = pointers.pop();\r\n    var event2;\r\n    while ((event2 = pointers.pop())) {\r\n        event1 = {\r\n            clientX: (event2.clientX - event1.clientX) / 2 + event1.clientX,\r\n            clientY: (event2.clientY - event1.clientY) / 2 + event1.clientY\r\n        };\r\n    }\r\n    return event1;\r\n}\r\n/**\r\n * Calculates the distance between two points\r\n * for pinch zooming.\r\n * Limits to the first 2\r\n */\r\nfunction getDistance(pointers) {\r\n    if (pointers.length < 2) {\r\n        return 0;\r\n    }\r\n    var event1 = pointers[0];\r\n    var event2 = pointers[1];\r\n    return Math.sqrt(Math.pow(Math.abs(event2.clientX - event1.clientX), 2) +\r\n        Math.pow(Math.abs(event2.clientY - event1.clientY), 2));\r\n}\r\n\n;// CONCATENATED MODULE: ./src/events.ts\nvar events = {\r\n    down: \'mousedown\',\r\n    move: \'mousemove\',\r\n    up: \'mouseup mouseleave\'\r\n};\r\nif (typeof window !== \'undefined\') {\r\n    if (typeof window.PointerEvent === \'function\') {\r\n        events = {\r\n            down: \'pointerdown\',\r\n            move: \'pointermove\',\r\n            up: \'pointerup pointerleave pointercancel\'\r\n        };\r\n    }\r\n    else if (typeof window.TouchEvent === \'function\') {\r\n        events = {\r\n            down: \'touchstart\',\r\n            move: \'touchmove\',\r\n            up: \'touchend touchcancel\'\r\n        };\r\n    }\r\n}\r\n\r\nfunction onPointer(event, elem, handler, eventOpts) {\r\n    events[event].split(\' \').forEach(function (name) {\r\n        ;\r\n        elem.addEventListener(name, handler, eventOpts);\r\n    });\r\n}\r\nfunction destroyPointer(event, elem, handler) {\r\n    events[event].split(\' \').forEach(function (name) {\r\n        ;\r\n        elem.removeEventListener(name, handler);\r\n    });\r\n}\r\n\n;// CONCATENATED MODULE: ./src/css.ts\nvar isIE = typeof document !== \'undefined\' && !!document.documentMode;\r\n/**\r\n * Lazy creation of a CSS style declaration\r\n */\r\nvar divStyle;\r\nfunction createStyle() {\r\n    if (divStyle) {\r\n        return divStyle;\r\n    }\r\n    return (divStyle = document.createElement(\'div\').style);\r\n}\r\n/**\r\n * Proper prefixing for cross-browser compatibility\r\n */\r\nvar prefixes = [\'webkit\', \'moz\', \'ms\'];\r\nvar prefixCache = {};\r\nfunction getPrefixedName(name) {\r\n    if (prefixCache[name]) {\r\n        return prefixCache[name];\r\n    }\r\n    var divStyle = createStyle();\r\n    if (name in divStyle) {\r\n        return (prefixCache[name] = name);\r\n    }\r\n    var capName = name[0].toUpperCase() + name.slice(1);\r\n    var i = prefixes.length;\r\n    while (i--) {\r\n        var prefixedName = "" + prefixes[i] + capName;\r\n        if (prefixedName in divStyle) {\r\n            return (prefixCache[name] = prefixedName);\r\n        }\r\n    }\r\n}\r\n/**\r\n * Gets a style value expected to be a number\r\n */\r\nfunction getCSSNum(name, style) {\r\n    return parseFloat(style[getPrefixedName(name)]) || 0;\r\n}\r\nfunction getBoxStyle(elem, name, style) {\r\n    if (style === void 0) { style = window.getComputedStyle(elem); }\r\n    // Support: FF 68+\r\n    // Firefox requires specificity for border\r\n    var suffix = name === \'border\' ? \'Width\' : \'\';\r\n    return {\r\n        left: getCSSNum(name + "Left" + suffix, style),\r\n        right: getCSSNum(name + "Right" + suffix, style),\r\n        top: getCSSNum(name + "Top" + suffix, style),\r\n        bottom: getCSSNum(name + "Bottom" + suffix, style)\r\n    };\r\n}\r\n/**\r\n * Set a style using the properly prefixed name\r\n */\r\nfunction setStyle(elem, name, value) {\r\n    // eslint-disable-next-line @typescript-eslint/no-explicit-any\r\n    elem.style[getPrefixedName(name)] = value;\r\n}\r\n/**\r\n * Constructs the transition from panzoom options\r\n * and takes care of prefixing the transition and transform\r\n */\r\nfunction setTransition(elem, options) {\r\n    var transform = getPrefixedName(\'transform\');\r\n    setStyle(elem, \'transition\', transform + " " + options.duration + "ms " + options.easing);\r\n}\r\n/**\r\n * Set the transform using the proper prefix\r\n */\r\nfunction setTransform(elem, _a, _options) {\r\n    var x = _a.x, y = _a.y, scale = _a.scale, isSVG = _a.isSVG;\r\n    setStyle(elem, \'transform\', "scale(" + scale + ") translate(" + x + "px, " + y + "px)");\r\n    if (isSVG && isIE) {\r\n        var matrixValue = window.getComputedStyle(elem).getPropertyValue(\'transform\');\r\n        elem.setAttribute(\'transform\', matrixValue);\r\n    }\r\n}\r\n/**\r\n * Dimensions used in containment and focal point zooming\r\n */\r\nfunction getDimensions(elem) {\r\n    var parent = elem.parentNode;\r\n    var style = window.getComputedStyle(elem);\r\n    var parentStyle = window.getComputedStyle(parent);\r\n    var rectElem = elem.getBoundingClientRect();\r\n    var rectParent = parent.getBoundingClientRect();\r\n    return {\r\n        elem: {\r\n            style: style,\r\n            width: rectElem.width,\r\n            height: rectElem.height,\r\n            top: rectElem.top,\r\n            bottom: rectElem.bottom,\r\n            left: rectElem.left,\r\n            right: rectElem.right,\r\n            margin: getBoxStyle(elem, \'margin\', style),\r\n            border: getBoxStyle(elem, \'border\', style)\r\n        },\r\n        parent: {\r\n            style: parentStyle,\r\n            width: rectParent.width,\r\n            height: rectParent.height,\r\n            top: rectParent.top,\r\n            bottom: rectParent.bottom,\r\n            left: rectParent.left,\r\n            right: rectParent.right,\r\n            padding: getBoxStyle(parent, \'padding\', parentStyle),\r\n            border: getBoxStyle(parent, \'border\', parentStyle)\r\n        }\r\n    };\r\n}\r\n\n;// CONCATENATED MODULE: ./src/isAttached.ts\n/**\r\n * Determine if an element is attached to the DOM\r\n * Panzoom requires this so events work properly\r\n */\r\nfunction isAttached(elem) {\r\n    var doc = elem.ownerDocument;\r\n    var parent = elem.parentNode;\r\n    return (doc &&\r\n        parent &&\r\n        doc.nodeType === 9 &&\r\n        parent.nodeType === 1 &&\r\n        doc.documentElement.contains(parent));\r\n}\r\n\n;// CONCATENATED MODULE: ./src/isExcluded.ts\nfunction getClass(elem) {\r\n    return (elem.getAttribute(\'class\') || \'\').trim();\r\n}\r\nfunction hasClass(elem, className) {\r\n    return elem.nodeType === 1 && (" " + getClass(elem) + " ").indexOf(" " + className + " ") > -1;\r\n}\r\nfunction isExcluded(elem, options) {\r\n    for (var cur = elem; cur != null; cur = cur.parentNode) {\r\n        if (hasClass(cur, options.excludeClass) || options.exclude.indexOf(cur) > -1) {\r\n            return true;\r\n        }\r\n    }\r\n    return false;\r\n}\r\n\n;// CONCATENATED MODULE: ./src/isSVGElement.ts\n/**\r\n * Determine if an element is SVG by checking the namespace\r\n * Exception: the <svg> element itself should be treated like HTML\r\n */\r\nvar rsvg = /^http:[\\w\\.\\/]+svg$/;\r\nfunction isSVGElement(elem) {\r\n    return rsvg.test(elem.namespaceURI) && elem.nodeName.toLowerCase() !== \'svg\';\r\n}\r\n\n;// CONCATENATED MODULE: ./src/shallowClone.ts\nfunction shallowClone(obj) {\r\n    var clone = {};\r\n    for (var key in obj) {\r\n        if (obj.hasOwnProperty(key)) {\r\n            clone[key] = obj[key];\r\n        }\r\n    }\r\n    return clone;\r\n}\r\n\n;// CONCATENATED MODULE: ./src/panzoom.ts\nvar __assign = (undefined && undefined.__assign) || function () {\r\n    __assign = Object.assign || function(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\r\n                t[p] = s[p];\r\n        }\r\n        return t;\r\n    };\r\n    return __assign.apply(this, arguments);\r\n};\r\n/**\r\n * Panzoom for panning and zooming elements using CSS transforms\r\n * https://github.com/timmywil/panzoom\r\n *\r\n * Copyright Timmy Willison and other contributors\r\n * Released under the MIT license\r\n * https://github.com/timmywil/panzoom/blob/master/MIT-License.txt\r\n *\r\n */\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\nvar defaultOptions = {\r\n    animate: false,\r\n    canvas: false,\r\n    cursor: \'move\',\r\n    disablePan: false,\r\n    disableZoom: false,\r\n    disableXAxis: false,\r\n    disableYAxis: false,\r\n    duration: 200,\r\n    easing: \'ease-in-out\',\r\n    exclude: [],\r\n    excludeClass: \'panzoom-exclude\',\r\n    handleStartEvent: function (e) {\r\n        e.preventDefault();\r\n        e.stopPropagation();\r\n    },\r\n    maxScale: 4,\r\n    minScale: 0.125,\r\n    overflow: \'hidden\',\r\n    panOnlyWhenZoomed: false,\r\n    relative: false,\r\n    setTransform: setTransform,\r\n    startX: 0,\r\n    startY: 0,\r\n    startScale: 1,\r\n    step: 0.3,\r\n    touchAction: \'none\'\r\n};\r\nfunction Panzoom(elem, options) {\r\n    if (!elem) {\r\n        throw new Error(\'Panzoom requires an element as an argument\');\r\n    }\r\n    if (elem.nodeType !== 1) {\r\n        throw new Error(\'Panzoom requires an element with a nodeType of 1\');\r\n    }\r\n    if (!isAttached(elem)) {\r\n        throw new Error(\'Panzoom should be called on elements that have been attached to the DOM\');\r\n    }\r\n    options = __assign(__assign({}, defaultOptions), options);\r\n    var isSVG = isSVGElement(elem);\r\n    var parent = elem.parentNode;\r\n    // Set parent styles\r\n    parent.style.overflow = options.overflow;\r\n    parent.style.userSelect = \'none\';\r\n    // This is important for mobile to\r\n    // prevent scrolling while panning\r\n    parent.style.touchAction = options.touchAction;\r\n    (options.canvas ? parent : elem).style.cursor = options.cursor;\r\n    // Set element styles\r\n    elem.style.userSelect = \'none\';\r\n    elem.style.touchAction = options.touchAction;\r\n    // The default for HTML is \'50% 50%\'\r\n    // The default for SVG is \'0 0\'\r\n    // SVG can\'t be changed in IE\r\n    setStyle(elem, \'transformOrigin\', typeof options.origin === \'string\' ? options.origin : isSVG ? \'0 0\' : \'50% 50%\');\r\n    function resetStyle() {\r\n        parent.style.overflow = \'\';\r\n        parent.style.userSelect = \'\';\r\n        parent.style.touchAction = \'\';\r\n        parent.style.cursor = \'\';\r\n        elem.style.cursor = \'\';\r\n        elem.style.userSelect = \'\';\r\n        elem.style.touchAction = \'\';\r\n        setStyle(elem, \'transformOrigin\', \'\');\r\n    }\r\n    function setOptions(opts) {\r\n        if (opts === void 0) { opts = {}; }\r\n        for (var key in opts) {\r\n            if (opts.hasOwnProperty(key)) {\r\n                options[key] = opts[key];\r\n            }\r\n        }\r\n        // Handle option side-effects\r\n        if (opts.hasOwnProperty(\'cursor\') || opts.hasOwnProperty(\'canvas\')) {\r\n            parent.style.cursor = elem.style.cursor = \'\';\r\n            (options.canvas ? parent : elem).style.cursor = options.cursor;\r\n        }\r\n        if (opts.hasOwnProperty(\'overflow\')) {\r\n            parent.style.overflow = opts.overflow;\r\n        }\r\n        if (opts.hasOwnProperty(\'touchAction\')) {\r\n            parent.style.touchAction = opts.touchAction;\r\n            elem.style.touchAction = opts.touchAction;\r\n        }\r\n        if (opts.hasOwnProperty(\'minScale\') ||\r\n            opts.hasOwnProperty(\'maxScale\') ||\r\n            opts.hasOwnProperty(\'contain\')) {\r\n            setMinMax();\r\n        }\r\n    }\r\n    var x = 0;\r\n    var y = 0;\r\n    var scale = 1;\r\n    var isPanning = false;\r\n    zoom(options.startScale, { animate: false });\r\n    // Wait for scale to update\r\n    // for accurate dimensions\r\n    // to constrain initial values\r\n    setTimeout(function () {\r\n        setMinMax();\r\n        pan(options.startX, options.startY, { animate: false });\r\n    });\r\n    function trigger(eventName, detail, opts) {\r\n        if (opts.silent) {\r\n            return;\r\n        }\r\n        var event = new CustomEvent(eventName, { detail: detail });\r\n        elem.dispatchEvent(event);\r\n    }\r\n    function setTransformWithEvent(eventName, opts, originalEvent) {\r\n        var value = { x: x, y: y, scale: scale, isSVG: isSVG, originalEvent: originalEvent };\r\n        requestAnimationFrame(function () {\r\n            if (typeof opts.animate === \'boolean\') {\r\n                if (opts.animate) {\r\n                    setTransition(elem, opts);\r\n                }\r\n                else {\r\n                    setStyle(elem, \'transition\', \'none\');\r\n                }\r\n            }\r\n            opts.setTransform(elem, value, opts);\r\n        });\r\n        trigger(eventName, value, opts);\r\n        trigger(\'panzoomchange\', value, opts);\r\n        return value;\r\n    }\r\n    function setMinMax() {\r\n        if (options.contain) {\r\n            var dims = getDimensions(elem);\r\n            var parentWidth = dims.parent.width - dims.parent.border.left - dims.parent.border.right;\r\n            var parentHeight = dims.parent.height - dims.parent.border.top - dims.parent.border.bottom;\r\n            var elemWidth = dims.elem.width / scale;\r\n            var elemHeight = dims.elem.height / scale;\r\n            var elemScaledWidth = parentWidth / elemWidth;\r\n            var elemScaledHeight = parentHeight / elemHeight;\r\n            if (options.contain === \'inside\') {\r\n                options.maxScale = Math.min(elemScaledWidth, elemScaledHeight);\r\n            }\r\n            else if (options.contain === \'outside\') {\r\n                options.minScale = Math.max(elemScaledWidth, elemScaledHeight);\r\n            }\r\n        }\r\n    }\r\n    function constrainXY(toX, toY, toScale, panOptions) {\r\n        var opts = __assign(__assign({}, options), panOptions);\r\n        var result = { x: x, y: y, opts: opts };\r\n        if (!opts.force && (opts.disablePan || (opts.panOnlyWhenZoomed && scale === opts.startScale))) {\r\n            return result;\r\n        }\r\n        toX = parseFloat(toX);\r\n        toY = parseFloat(toY);\r\n        if (!opts.disableXAxis) {\r\n            result.x = (opts.relative ? x : 0) + toX;\r\n        }\r\n        if (!opts.disableYAxis) {\r\n            result.y = (opts.relative ? y : 0) + toY;\r\n        }\r\n        if (opts.contain === \'inside\') {\r\n            var dims = getDimensions(elem);\r\n            result.x = Math.max(-dims.elem.margin.left - dims.parent.padding.left, Math.min(dims.parent.width -\r\n                dims.elem.width / toScale -\r\n                dims.parent.padding.left -\r\n                dims.elem.margin.left -\r\n                dims.parent.border.left -\r\n                dims.parent.border.right, result.x));\r\n            result.y = Math.max(-dims.elem.margin.top - dims.parent.padding.top, Math.min(dims.parent.height -\r\n                dims.elem.height / toScale -\r\n                dims.parent.padding.top -\r\n                dims.elem.margin.top -\r\n                dims.parent.border.top -\r\n                dims.parent.border.bottom, result.y));\r\n        }\r\n        else if (opts.contain === \'outside\') {\r\n            var dims = getDimensions(elem);\r\n            var realWidth = dims.elem.width / scale;\r\n            var realHeight = dims.elem.height / scale;\r\n            var scaledWidth = realWidth * toScale;\r\n            var scaledHeight = realHeight * toScale;\r\n            var diffHorizontal = (scaledWidth - realWidth) / 2;\r\n            var diffVertical = (scaledHeight - realHeight) / 2;\r\n            var minX = (-(scaledWidth - dims.parent.width) -\r\n                dims.parent.padding.left -\r\n                dims.parent.border.left -\r\n                dims.parent.border.right +\r\n                diffHorizontal) /\r\n                toScale;\r\n            var maxX = (diffHorizontal - dims.parent.padding.left) / toScale;\r\n            result.x = Math.max(Math.min(result.x, maxX), minX);\r\n            var minY = (-(scaledHeight - dims.parent.height) -\r\n                dims.parent.padding.top -\r\n                dims.parent.border.top -\r\n                dims.parent.border.bottom +\r\n                diffVertical) /\r\n                toScale;\r\n            var maxY = (diffVertical - dims.parent.padding.top) / toScale;\r\n            result.y = Math.max(Math.min(result.y, maxY), minY);\r\n        }\r\n        return result;\r\n    }\r\n    function constrainScale(toScale, zoomOptions) {\r\n        var opts = __assign(__assign({}, options), zoomOptions);\r\n        var result = { scale: scale, opts: opts };\r\n        if (!opts.force && opts.disableZoom) {\r\n            return result;\r\n        }\r\n        result.scale = Math.min(Math.max(toScale, opts.minScale), opts.maxScale);\r\n        return result;\r\n    }\r\n    function pan(toX, toY, panOptions, originalEvent) {\r\n        var result = constrainXY(toX, toY, scale, panOptions);\r\n        var opts = result.opts;\r\n        x = result.x;\r\n        y = result.y;\r\n        return setTransformWithEvent(\'panzoompan\', opts, originalEvent);\r\n    }\r\n    function zoom(toScale, zoomOptions, originalEvent) {\r\n        var result = constrainScale(toScale, zoomOptions);\r\n        var opts = result.opts;\r\n        if (!opts.force && opts.disableZoom) {\r\n            return;\r\n        }\r\n        toScale = result.scale;\r\n        var toX = x;\r\n        var toY = y;\r\n        if (opts.focal) {\r\n            // The difference between the point after the scale and the point before the scale\r\n            // plus the current translation after the scale\r\n            // neutralized to no scale (as the transform scale will apply to the translation)\r\n            var focal = opts.focal;\r\n            toX = (focal.x / toScale - focal.x / scale + x * toScale) / toScale;\r\n            toY = (focal.y / toScale - focal.y / scale + y * toScale) / toScale;\r\n        }\r\n        var panResult = constrainXY(toX, toY, toScale, { relative: false, force: true });\r\n        x = panResult.x;\r\n        y = panResult.y;\r\n        scale = toScale;\r\n        return setTransformWithEvent(\'panzoomzoom\', opts, originalEvent);\r\n    }\r\n    function zoomInOut(isIn, zoomOptions) {\r\n        var opts = __assign(__assign(__assign({}, options), { animate: true }), zoomOptions);\r\n        return zoom(scale * Math.exp((isIn ? 1 : -1) * opts.step), opts);\r\n    }\r\n    function zoomIn(zoomOptions) {\r\n        return zoomInOut(true, zoomOptions);\r\n    }\r\n    function zoomOut(zoomOptions) {\r\n        return zoomInOut(false, zoomOptions);\r\n    }\r\n    function zoomToPoint(toScale, point, zoomOptions, originalEvent) {\r\n        var dims = getDimensions(elem);\r\n        // Instead of thinking of operating on the panzoom element,\r\n        // think of operating on the area inside the panzoom\r\n        // element\'s parent\r\n        // Subtract padding and border\r\n        var effectiveArea = {\r\n            width: dims.parent.width -\r\n                dims.parent.padding.left -\r\n                dims.parent.padding.right -\r\n                dims.parent.border.left -\r\n                dims.parent.border.right,\r\n            height: dims.parent.height -\r\n                dims.parent.padding.top -\r\n                dims.parent.padding.bottom -\r\n                dims.parent.border.top -\r\n                dims.parent.border.bottom\r\n        };\r\n        // Adjust the clientX/clientY to ignore the area\r\n        // outside the effective area\r\n        var clientX = point.clientX -\r\n            dims.parent.left -\r\n            dims.parent.padding.left -\r\n            dims.parent.border.left -\r\n            dims.elem.margin.left;\r\n        var clientY = point.clientY -\r\n            dims.parent.top -\r\n            dims.parent.padding.top -\r\n            dims.parent.border.top -\r\n            dims.elem.margin.top;\r\n        // Adjust the clientX/clientY for HTML elements,\r\n        // because they have a transform-origin of 50% 50%\r\n        if (!isSVG) {\r\n            clientX -= dims.elem.width / scale / 2;\r\n            clientY -= dims.elem.height / scale / 2;\r\n        }\r\n        // Convert the mouse point from it\'s position over the\r\n        // effective area before the scale to the position\r\n        // over the effective area after the scale.\r\n        var focal = {\r\n            x: (clientX / effectiveArea.width) * (effectiveArea.width * toScale),\r\n            y: (clientY / effectiveArea.height) * (effectiveArea.height * toScale)\r\n        };\r\n        return zoom(toScale, __assign(__assign({ animate: false }, zoomOptions), { focal: focal }), originalEvent);\r\n    }\r\n    function zoomWithWheel(event, zoomOptions) {\r\n        // Need to prevent the default here\r\n        // or it conflicts with regular page scroll\r\n        event.preventDefault();\r\n        var opts = __assign(__assign({}, options), zoomOptions);\r\n        // Normalize to deltaX in case shift modifier is used on Mac\r\n        var delta = event.deltaY === 0 && event.deltaX ? event.deltaX : event.deltaY;\r\n        var wheel = delta < 0 ? 1 : -1;\r\n        var toScale = constrainScale(scale * Math.exp((wheel * opts.step) / 3), opts).scale;\r\n        return zoomToPoint(toScale, event, opts);\r\n    }\r\n    function reset(resetOptions) {\r\n        var opts = __assign(__assign(__assign({}, options), { animate: true, force: true }), resetOptions);\r\n        scale = constrainScale(opts.startScale, opts).scale;\r\n        var panResult = constrainXY(opts.startX, opts.startY, scale, opts);\r\n        x = panResult.x;\r\n        y = panResult.y;\r\n        return setTransformWithEvent(\'panzoomreset\', opts);\r\n    }\r\n    var origX;\r\n    var origY;\r\n    var startClientX;\r\n    var startClientY;\r\n    var startScale;\r\n    var startDistance;\r\n    var pointers = [];\r\n    function handleDown(event) {\r\n        // Don\'t handle this event if the target is excluded\r\n        if (isExcluded(event.target, options)) {\r\n            return;\r\n        }\r\n        if (event.button == 0) {\r\n            return;\r\n        }\r\n        addPointer(pointers, event);\r\n        isPanning = true;\r\n        options.handleStartEvent(event);\r\n        origX = x;\r\n        origY = y;\r\n        trigger(\'panzoomstart\', { x: x, y: y, scale: scale, isSVG: isSVG, originalEvent: event }, options);\r\n        // This works whether there are multiple\r\n        // pointers or not\r\n        var point = getMiddle(pointers);\r\n        startClientX = point.clientX;\r\n        startClientY = point.clientY;\r\n        startScale = scale;\r\n        startDistance = getDistance(pointers);\r\n    }\r\n    function move(event) {\r\n        if (!isPanning ||\r\n            origX === undefined ||\r\n            origY === undefined ||\r\n            startClientX === undefined ||\r\n            startClientY === undefined) {\r\n            return;\r\n        }\r\n        addPointer(pointers, event);\r\n        var current = getMiddle(pointers);\r\n        if (pointers.length > 1) {\r\n            // Use the distance between the first 2 pointers\r\n            // to determine the current scale\r\n            var diff = getDistance(pointers) - startDistance;\r\n            var toScale = constrainScale((diff * options.step) / 80 + startScale).scale;\r\n            zoomToPoint(toScale, current);\r\n        }\r\n        pan(origX + (current.clientX - startClientX) / scale, origY + (current.clientY - startClientY) / scale, {\r\n            animate: false\r\n        }, event);\r\n    }\r\n    function handleUp(event) {\r\n        // Don\'t call panzoomend when panning with 2 touches\r\n        // until both touches end\r\n        if (pointers.length === 1) {\r\n            trigger(\'panzoomend\', { x: x, y: y, scale: scale, isSVG: isSVG, originalEvent: event }, options);\r\n        }\r\n        // Note: don\'t remove all pointers\r\n        // Can restart without having to reinitiate all of them\r\n        // Remove the pointer regardless of the isPanning state\r\n        removePointer(pointers, event);\r\n        if (!isPanning) {\r\n            return;\r\n        }\r\n        isPanning = false;\r\n        origX = origY = startClientX = startClientY = undefined;\r\n    }\r\n    var bound = false;\r\n    function bind() {\r\n        if (bound) {\r\n            return;\r\n        }\r\n        bound = true;\r\n        onPointer(\'down\', options.canvas ? parent : elem, handleDown);\r\n        onPointer(\'move\', document, move, { passive: true });\r\n        onPointer(\'up\', document, handleUp, { passive: true });\r\n    }\r\n    function destroy() {\r\n        bound = false;\r\n        destroyPointer(\'down\', options.canvas ? parent : elem, handleDown);\r\n        destroyPointer(\'move\', document, move);\r\n        destroyPointer(\'up\', document, handleUp);\r\n    }\r\n    if (!options.noBind) {\r\n        bind();\r\n    }\r\n    return {\r\n        bind: bind,\r\n        destroy: destroy,\r\n        eventNames: events,\r\n        getPan: function () { return ({ x: x, y: y }); },\r\n        getScale: function () { return scale; },\r\n        getOptions: function () { return shallowClone(options); },\r\n        pan: pan,\r\n        reset: reset,\r\n        resetStyle: resetStyle,\r\n        setOptions: setOptions,\r\n        setStyle: function (name, value) { return setStyle(elem, name, value); },\r\n        zoom: zoom,\r\n        zoomIn: zoomIn,\r\n        zoomOut: zoomOut,\r\n        zoomToPoint: zoomToPoint,\r\n        zoomWithWheel: zoomWithWheel\r\n    };\r\n}\r\nPanzoom.defaultOptions = defaultOptions;\r\n/* harmony default export */ const panzoom = (Panzoom);\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AcGFuem9vbS9wYW56b29tLy4vc3JjL3BvaW50ZXJzLnRzP2QwNTgiLCJ3ZWJwYWNrOi8vQHBhbnpvb20vcGFuem9vbS8uL3NyYy9ldmVudHMudHM/MDVkMSIsIndlYnBhY2s6Ly9AcGFuem9vbS9wYW56b29tLy4vc3JjL2Nzcy50cz84MTQzIiwid2VicGFjazovL0BwYW56b29tL3Bhbnpvb20vLi9zcmMvaXNBdHRhY2hlZC50cz9hMDNiIiwid2VicGFjazovL0BwYW56b29tL3Bhbnpvb20vLi9zcmMvaXNFeGNsdWRlZC50cz81NDMyIiwid2VicGFjazovL0BwYW56b29tL3Bhbnpvb20vLi9zcmMvaXNTVkdFbGVtZW50LnRzPzQ2MjgiLCJ3ZWJwYWNrOi8vQHBhbnpvb20vcGFuem9vbS8uL3NyYy9zaGFsbG93Q2xvbmUudHM/ZTQ3NiIsIndlYnBhY2s6Ly9AcGFuem9vbS9wYW56b29tLy4vc3JjL3Bhbnpvb20udHM/YjhmNCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7R0FFRztBQUVILFNBQVMsY0FBYyxDQUFDLFFBQXdCLEVBQUUsS0FBbUI7SUFDbkUsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU07SUFDdkIsT0FBTyxDQUFDLEVBQUUsRUFBRTtRQUNWLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsS0FBSyxLQUFLLENBQUMsU0FBUyxFQUFFO1lBQzdDLE9BQU8sQ0FBQztTQUNUO0tBQ0Y7SUFDRCxPQUFPLENBQUMsQ0FBQztBQUNYLENBQUM7QUFFTSxTQUFTLFVBQVUsQ0FBQyxRQUF3QixFQUFFLEtBQW1CO0lBQ3RFLElBQUksQ0FBQztJQUNMLDRCQUE0QjtJQUM1QixJQUFLLEtBQWEsQ0FBQyxPQUFPLEVBQUU7UUFDMUIsQ0FBQyxHQUFHLENBQUM7UUFDTCxLQUFvQixVQUFzQixFQUF0QixLQUFDLEtBQWEsQ0FBQyxPQUFPLEVBQXRCLGNBQXNCLEVBQXRCLElBQXNCLEVBQUU7WUFB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UyxPQUFPO1FBQ2QsS0FBSyxHQUFHLEtBQUs7UUFDYixjQUFjLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQztRQUNsRSxjQUFjLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUM7UUFDdEMsY0FBYyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDO0lBQzFDLENBQUM7SUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtRQUNuQixJQUFJLEVBQUU7S0FDUDtJQUVELE9BQU87UUFDTCxJQUFJO1FBQ0osT0FBTztRQUNQLFVBQVU7UUFDVixNQUFNLEVBQUUsY0FBTSxRQUFDLEVBQUUsQ0FBQyxLQUFFLENBQUMsS0FBRSxDQUFDLEVBQVYsQ0FBVTtRQUN4QixRQUFRLEVBQUUsY0FBTSxZQUFLLEVBQUwsQ0FBSztRQUNyQixVQUFVLEVBQUUsY0FBTSxtQkFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFyQixDQUFxQjtRQUN2QyxHQUFHO1FBQ0gsS0FBSztRQUNMLFVBQVU7UUFDVixVQUFVO1FBQ1YsUUFBUSxFQUFFLFVBQUMsSUFBWSxFQUFFLEtBQWEsSUFBSyxlQUFRLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsRUFBM0IsQ0FBMkI7UUFDdEUsSUFBSTtRQUNKLE1BQU07UUFDTixPQUFPO1FBQ1AsV0FBVztRQUNYLGFBQWE7S0FDZDtBQUNILENBQUM7QUFFRCxPQUFPLENBQUMsY0FBYyxHQUFHLGNBQWM7QUFHdkMsOENBQWUsT0FBTyIsImZpbGUiOiI4NjAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFV0aWxpdGVzIGZvciB3b3JraW5nIHdpdGggbXVsdGlwbGUgcG9pbnRlciBldmVudHNcbiAqL1xuXG5mdW5jdGlvbiBmaW5kRXZlbnRJbmRleChwb2ludGVyczogUG9pbnRlckV2ZW50W10sIGV2ZW50OiBQb2ludGVyRXZlbnQpIHtcbiAgbGV0IGkgPSBwb2ludGVycy5sZW5ndGhcbiAgd2hpbGUgKGktLSkge1xuICAgIGlmIChwb2ludGVyc1tpXS5wb2ludGVySWQgPT09IGV2ZW50LnBvaW50ZXJJZCkge1xuICAgICAgcmV0dXJuIGlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRQb2ludGVyKHBvaW50ZXJzOiBQb2ludGVyRXZlbnRbXSwgZXZlbnQ6IFBvaW50ZXJFdmVudCkge1xuICBsZXQgaVxuICAvLyBBZGQgdG91Y2hlcyBpZiBhcHBsaWNhYmxlXG4gIGlmICgoZXZlbnQgYXMgYW55KS50b3VjaGVzKSB7XG4gICAgaSA9IDBcbiAgICBmb3IgKGNvbnN0IHRvdWNoIG9mIChldmVudCBhcyBhbnkpLnRvdWNoZXMpIHtcbiAgICAgIHRvdWNoLnBvaW50ZXJJZCA9IGkrK1xuICAgICAgYWRkUG9pbnRlcihwb2ludGVycywgdG91Y2gpXG4gICAgfVxuICAgIHJldHVyblxuICB9XG4gIGkgPSBmaW5kRXZlbnRJbmRleChwb2ludGVycywgZXZlbnQpXG4gIC8vIFVwZGF0ZSBpZiBhbHJlYWR5IHByZXNlbnRcbiAgaWYgKGkgPiAtMSkge1xuICAgIHBvaW50ZXJzLnNwbGljZShpLCAxKVxuICB9XG4gIHBvaW50ZXJzLnB1c2goZXZlbnQpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVQb2ludGVyKHBvaW50ZXJzOiBQb2ludGVyRXZlbnRbXSwgZXZlbnQ6IFBvaW50ZXJFdmVudCkge1xuICAvLyBBZGQgdG91Y2hlcyBpZiBhcHBsaWNhYmxlXG4gIGlmICgoZXZlbnQgYXMgYW55KS50b3VjaGVzKSB7XG4gICAgLy8gUmVtb3ZlIGFsbCB0b3VjaGVzXG4gICAgd2hpbGUgKHBvaW50ZXJzLmxlbmd0aCkge1xuICAgICAgcG9pbnRlcnMucG9wKClcbiAgICB9XG4gICAgcmV0dXJuXG4gIH1cbiAgY29uc3QgaSA9IGZpbmRFdmVudEluZGV4KHBvaW50ZXJzLCBldmVudClcbiAgaWYgKGkgPiAtMSkge1xuICAgIHBvaW50ZXJzLnNwbGljZShpLCAxKVxuICB9XG59XG5cbi8qKlxuICogQ2FsY3VsYXRlcyBhIGNlbnRlciBwb2ludCBiZXR3ZWVuXG4gKiB0aGUgZ2l2ZW4gcG9pbnRlciBldmVudHMsIGZvciBwYW5uaW5nXG4gKiB3aXRoIG11bHRpcGxlIHBvaW50ZXJzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWlkZGxlKHBvaW50ZXJzOiBQb2ludGVyRXZlbnRbXSkge1xuICAvLyBDb3B5IHRvIGF2b2lkIGNoYW5naW5nIGJ5IHJlZmVyZW5jZVxuICBwb2ludGVycyA9IHBvaW50ZXJzLnNsaWNlKDApXG4gIGxldCBldmVudDE6IFBpY2s8UG9pbnRlckV2ZW50LCAnY2xpZW50WCcgfCAnY2xpZW50WSc+ID0gcG9pbnRlcnMucG9wKClcbiAgbGV0IGV2ZW50MjogUG9pbnRlckV2ZW50XG4gIHdoaWxlICgoZXZlbnQyID0gcG9pbnRlcnMucG9wKCkpKSB7XG4gICAgZXZlbnQxID0ge1xuICAgICAgY2xpZW50WDogKGV2ZW50Mi5jbGllbnRYIC0gZXZlbnQxLmNsaWVudFgpIC8gMiArIGV2ZW50MS5jbGllbnRYLFxuICAgICAgY2xpZW50WTogKGV2ZW50Mi5jbGllbnRZIC0gZXZlbnQxLmNsaWVudFkpIC8gMiArIGV2ZW50MS5jbGllbnRZXG4gICAgfVxuICB9XG4gIHJldHVybiBldmVudDFcbn1cblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIHR3byBwb2ludHNcbiAqIGZvciBwaW5jaCB6b29taW5nLlxuICogTGltaXRzIHRvIHRoZSBmaXJzdCAyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXREaXN0YW5jZShwb2ludGVyczogUG9pbnRlckV2ZW50W10pIHtcbiAgaWYgKHBvaW50ZXJzLmxlbmd0aCA8IDIpIHtcbiAgICByZXR1cm4gMFxuICB9XG4gIGNvbnN0IGV2ZW50MSA9IHBvaW50ZXJzWzBdXG4gIGNvbnN0IGV2ZW50MiA9IHBvaW50ZXJzWzFdXG4gIHJldHVybiBNYXRoLnNxcnQoXG4gICAgTWF0aC5wb3coTWF0aC5hYnMoZXZlbnQyLmNsaWVudFggLSBldmVudDEuY2xpZW50WCksIDIpICtcbiAgICAgIE1hdGgucG93KE1hdGguYWJzKGV2ZW50Mi5jbGllbnRZIC0gZXZlbnQxLmNsaWVudFkpLCAyKVxuICApXG59XG4iLCJsZXQgZXZlbnRzID0ge1xuICBkb3duOiAnbW91c2Vkb3duJyxcbiAgbW92ZTogJ21vdXNlbW92ZScsXG4gIHVwOiAnbW91c2V1cCBtb3VzZWxlYXZlJ1xufVxuXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgaWYgKHR5cGVvZiB3aW5kb3cuUG9pbnRlckV2ZW50ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgZXZlbnRzID0ge1xuICAgICAgZG93bjogJ3BvaW50ZXJkb3duJyxcbiAgICAgIG1vdmU6ICdwb2ludGVybW92ZScsXG4gICAgICB1cDogJ3BvaW50ZXJ1cCBwb2ludGVybGVhdmUgcG9pbnRlcmNhbmNlbCdcbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdy5Ub3VjaEV2ZW50ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgZXZlbnRzID0ge1xuICAgICAgZG93bjogJ3RvdWNoc3RhcnQnLFxuICAgICAgbW92ZTogJ3RvdWNobW92ZScsXG4gICAgICB1cDogJ3RvdWNoZW5kIHRvdWNoY2FuY2VsJ1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgeyBldmVudHMgYXMgZXZlbnROYW1lcyB9XG5cbnR5cGUgUG9pbnRlckV2ZW50TmFtZSA9XG4gIHwgJ3BvaW50ZXJkb3duJ1xuICB8ICdwb2ludGVybW92ZSdcbiAgfCAncG9pbnRlcnVwJ1xuICB8ICdwb2ludGVybGVhdmUnXG4gIHwgJ3BvaW50ZXJjYW5jZWwnXG5cbmV4cG9ydCBmdW5jdGlvbiBvblBvaW50ZXIoXG4gIGV2ZW50OiAnZG93bicgfCAnbW92ZScgfCAndXAnLFxuICBlbGVtOiBIVE1MRWxlbWVudCB8IFNWR0VsZW1lbnQgfCBEb2N1bWVudCxcbiAgaGFuZGxlcjogKGV2ZW50OiBQb2ludGVyRXZlbnQpID0+IHZvaWQsXG4gIGV2ZW50T3B0cz86IGJvb2xlYW4gfCBBZGRFdmVudExpc3RlbmVyT3B0aW9uc1xuKSB7XG4gIGV2ZW50c1tldmVudF0uc3BsaXQoJyAnKS5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgOyhlbGVtIGFzIEhUTUxFbGVtZW50KS5hZGRFdmVudExpc3RlbmVyPFBvaW50ZXJFdmVudE5hbWU+KFxuICAgICAgbmFtZSBhcyBQb2ludGVyRXZlbnROYW1lLFxuICAgICAgaGFuZGxlcixcbiAgICAgIGV2ZW50T3B0c1xuICAgIClcbiAgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlc3Ryb3lQb2ludGVyKFxuICBldmVudDogJ2Rvd24nIHwgJ21vdmUnIHwgJ3VwJyxcbiAgZWxlbTogSFRNTEVsZW1lbnQgfCBTVkdFbGVtZW50IHwgRG9jdW1lbnQsXG4gIGhhbmRsZXI6IChldmVudDogUG9pbnRlckV2ZW50KSA9PiB2b2lkXG4pIHtcbiAgZXZlbnRzW2V2ZW50XS5zcGxpdCgnICcpLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICA7KGVsZW0gYXMgSFRNTEVsZW1lbnQpLnJlbW92ZUV2ZW50TGlzdGVuZXI8UG9pbnRlckV2ZW50TmFtZT4obmFtZSBhcyBQb2ludGVyRXZlbnROYW1lLCBoYW5kbGVyKVxuICB9KVxufVxuIiwiaW1wb3J0IHsgQ3VycmVudFZhbHVlcywgUGFuem9vbU9wdGlvbnMgfSBmcm9tICcuL3R5cGVzJ1xuXG5jb25zdCBpc0lFID0gdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJiAhIShkb2N1bWVudCBhcyBhbnkpLmRvY3VtZW50TW9kZVxuXG4vKipcbiAqIExhenkgY3JlYXRpb24gb2YgYSBDU1Mgc3R5bGUgZGVjbGFyYXRpb25cbiAqL1xubGV0IGRpdlN0eWxlOiBDU1NTdHlsZURlY2xhcmF0aW9uXG5mdW5jdGlvbiBjcmVhdGVTdHlsZSgpIHtcbiAgaWYgKGRpdlN0eWxlKSB7XG4gICAgcmV0dXJuIGRpdlN0eWxlXG4gIH1cbiAgcmV0dXJuIChkaXZTdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLnN0eWxlKVxufVxuXG4vKipcbiAqIFByb3BlciBwcmVmaXhpbmcgZm9yIGNyb3NzLWJyb3dzZXIgY29tcGF0aWJpbGl0eVxuICovXG5jb25zdCBwcmVmaXhlcyA9IFsnd2Via2l0JywgJ21veicsICdtcyddXG5jb25zdCBwcmVmaXhDYWNoZTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9XG5mdW5jdGlvbiBnZXRQcmVmaXhlZE5hbWUobmFtZTogc3RyaW5nKSB7XG4gIGlmIChwcmVmaXhDYWNoZVtuYW1lXSkge1xuICAgIHJldHVybiBwcmVmaXhDYWNoZVtuYW1lXVxuICB9XG4gIGNvbnN0IGRpdlN0eWxlID0gY3JlYXRlU3R5bGUoKVxuICBpZiAobmFtZSBpbiBkaXZTdHlsZSkge1xuICAgIHJldHVybiAocHJlZml4Q2FjaGVbbmFtZV0gPSBuYW1lKVxuICB9XG4gIGNvbnN0IGNhcE5hbWUgPSBuYW1lWzBdLnRvVXBwZXJDYXNlKCkgKyBuYW1lLnNsaWNlKDEpXG4gIGxldCBpID0gcHJlZml4ZXMubGVuZ3RoXG4gIHdoaWxlIChpLS0pIHtcbiAgICBjb25zdCBwcmVmaXhlZE5hbWUgPSBgJHtwcmVmaXhlc1tpXX0ke2NhcE5hbWV9YFxuICAgIGlmIChwcmVmaXhlZE5hbWUgaW4gZGl2U3R5bGUpIHtcbiAgICAgIHJldHVybiAocHJlZml4Q2FjaGVbbmFtZV0gPSBwcmVmaXhlZE5hbWUpXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogR2V0cyBhIHN0eWxlIHZhbHVlIGV4cGVjdGVkIHRvIGJlIGEgbnVtYmVyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDU1NOdW0obmFtZTogc3RyaW5nLCBzdHlsZTogQ1NTU3R5bGVEZWNsYXJhdGlvbikge1xuICByZXR1cm4gcGFyc2VGbG9hdChzdHlsZVtnZXRQcmVmaXhlZE5hbWUobmFtZSkgYXMgYW55XSkgfHwgMFxufVxuXG5mdW5jdGlvbiBnZXRCb3hTdHlsZShcbiAgZWxlbTogSFRNTEVsZW1lbnQgfCBTVkdFbGVtZW50LFxuICBuYW1lOiBzdHJpbmcsXG4gIHN0eWxlOiBDU1NTdHlsZURlY2xhcmF0aW9uID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbSlcbikge1xuICAvLyBTdXBwb3J0OiBGRiA2OCtcbiAgLy8gRmlyZWZveCByZXF1aXJlcyBzcGVjaWZpY2l0eSBmb3IgYm9yZGVyXG4gIGNvbnN0IHN1ZmZpeCA9IG5hbWUgPT09ICdib3JkZXInID8gJ1dpZHRoJyA6ICcnXG4gIHJldHVybiB7XG4gICAgbGVmdDogZ2V0Q1NTTnVtKGAke25hbWV9TGVmdCR7c3VmZml4fWAsIHN0eWxlKSxcbiAgICByaWdodDogZ2V0Q1NTTnVtKGAke25hbWV9UmlnaHQke3N1ZmZpeH1gLCBzdHlsZSksXG4gICAgdG9wOiBnZXRDU1NOdW0oYCR7bmFtZX1Ub3Ake3N1ZmZpeH1gLCBzdHlsZSksXG4gICAgYm90dG9tOiBnZXRDU1NOdW0oYCR7bmFtZX1Cb3R0b20ke3N1ZmZpeH1gLCBzdHlsZSlcbiAgfVxufVxuXG4vKipcbiAqIFNldCBhIHN0eWxlIHVzaW5nIHRoZSBwcm9wZXJseSBwcmVmaXhlZCBuYW1lXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRTdHlsZShlbGVtOiBIVE1MRWxlbWVudCB8IFNWR0VsZW1lbnQsIG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICBlbGVtLnN0eWxlW2dldFByZWZpeGVkTmFtZShuYW1lKSBhcyBhbnldID0gdmFsdWVcbn1cblxuLyoqXG4gKiBDb25zdHJ1Y3RzIHRoZSB0cmFuc2l0aW9uIGZyb20gcGFuem9vbSBvcHRpb25zXG4gKiBhbmQgdGFrZXMgY2FyZSBvZiBwcmVmaXhpbmcgdGhlIHRyYW5zaXRpb24gYW5kIHRyYW5zZm9ybVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0VHJhbnNpdGlvbihlbGVtOiBIVE1MRWxlbWVudCB8IFNWR0VsZW1lbnQsIG9wdGlvbnM6IFBhbnpvb21PcHRpb25zKSB7XG4gIGNvbnN0IHRyYW5zZm9ybSA9IGdldFByZWZpeGVkTmFtZSgndHJhbnNmb3JtJylcbiAgc2V0U3R5bGUoZWxlbSwgJ3RyYW5zaXRpb24nLCBgJHt0cmFuc2Zvcm19ICR7b3B0aW9ucy5kdXJhdGlvbn1tcyAke29wdGlvbnMuZWFzaW5nfWApXG59XG5cbi8qKlxuICogU2V0IHRoZSB0cmFuc2Zvcm0gdXNpbmcgdGhlIHByb3BlciBwcmVmaXhcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldFRyYW5zZm9ybShcbiAgZWxlbTogSFRNTEVsZW1lbnQgfCBTVkdFbGVtZW50LFxuICB7IHgsIHksIHNjYWxlLCBpc1NWRyB9OiBDdXJyZW50VmFsdWVzLFxuICBfb3B0aW9ucz86IFBhbnpvb21PcHRpb25zXG4pIHtcbiAgc2V0U3R5bGUoZWxlbSwgJ3RyYW5zZm9ybScsIGBzY2FsZSgke3NjYWxlfSkgdHJhbnNsYXRlKCR7eH1weCwgJHt5fXB4KWApXG4gIGlmIChpc1NWRyAmJiBpc0lFKSB7XG4gICAgY29uc3QgbWF0cml4VmFsdWUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtKS5nZXRQcm9wZXJ0eVZhbHVlKCd0cmFuc2Zvcm0nKVxuICAgIGVsZW0uc2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0nLCBtYXRyaXhWYWx1ZSlcbiAgfVxufVxuXG4vKipcbiAqIERpbWVuc2lvbnMgdXNlZCBpbiBjb250YWlubWVudCBhbmQgZm9jYWwgcG9pbnQgem9vbWluZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGltZW5zaW9ucyhlbGVtOiBIVE1MRWxlbWVudCB8IFNWR0VsZW1lbnQpIHtcbiAgY29uc3QgcGFyZW50ID0gZWxlbS5wYXJlbnROb2RlIGFzIEhUTUxFbGVtZW50IHwgU1ZHRWxlbWVudFxuICBjb25zdCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW0pXG4gIGNvbnN0IHBhcmVudFN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUocGFyZW50KVxuICBjb25zdCByZWN0RWxlbSA9IGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgY29uc3QgcmVjdFBhcmVudCA9IHBhcmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXG4gIHJldHVybiB7XG4gICAgZWxlbToge1xuICAgICAgc3R5bGUsXG4gICAgICB3aWR0aDogcmVjdEVsZW0ud2lkdGgsXG4gICAgICBoZWlnaHQ6IHJlY3RFbGVtLmhlaWdodCxcbiAgICAgIHRvcDogcmVjdEVsZW0udG9wLFxuICAgICAgYm90dG9tOiByZWN0RWxlbS5ib3R0b20sXG4gICAgICBsZWZ0OiByZWN0RWxlbS5sZWZ0LFxuICAgICAgcmlnaHQ6IHJlY3RFbGVtLnJpZ2h0LFxuICAgICAgbWFyZ2luOiBnZXRCb3hTdHlsZShlbGVtLCAnbWFyZ2luJywgc3R5bGUpLFxuICAgICAgYm9yZGVyOiBnZXRCb3hTdHlsZShlbGVtLCAnYm9yZGVyJywgc3R5bGUpXG4gICAgfSxcbiAgICBwYXJlbnQ6IHtcbiAgICAgIHN0eWxlOiBwYXJlbnRTdHlsZSxcbiAgICAgIHdpZHRoOiByZWN0UGFyZW50LndpZHRoLFxuICAgICAgaGVpZ2h0OiByZWN0UGFyZW50LmhlaWdodCxcbiAgICAgIHRvcDogcmVjdFBhcmVudC50b3AsXG4gICAgICBib3R0b206IHJlY3RQYXJlbnQuYm90dG9tLFxuICAgICAgbGVmdDogcmVjdFBhcmVudC5sZWZ0LFxuICAgICAgcmlnaHQ6IHJlY3RQYXJlbnQucmlnaHQsXG4gICAgICBwYWRkaW5nOiBnZXRCb3hTdHlsZShwYXJlbnQsICdwYWRkaW5nJywgcGFyZW50U3R5bGUpLFxuICAgICAgYm9yZGVyOiBnZXRCb3hTdHlsZShwYXJlbnQsICdib3JkZXInLCBwYXJlbnRTdHlsZSlcbiAgICB9XG4gIH1cbn1cbiIsIi8qKlxuICogRGV0ZXJtaW5lIGlmIGFuIGVsZW1lbnQgaXMgYXR0YWNoZWQgdG8gdGhlIERPTVxuICogUGFuem9vbSByZXF1aXJlcyB0aGlzIHNvIGV2ZW50cyB3b3JrIHByb3Blcmx5XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzQXR0YWNoZWQoZWxlbTogSFRNTEVsZW1lbnQgfCBTVkdFbGVtZW50IHwgRG9jdW1lbnQpIHtcbiAgY29uc3QgZG9jID0gZWxlbS5vd25lckRvY3VtZW50XG4gIGNvbnN0IHBhcmVudCA9IGVsZW0ucGFyZW50Tm9kZVxuICByZXR1cm4gKFxuICAgIGRvYyAmJlxuICAgIHBhcmVudCAmJlxuICAgIGRvYy5ub2RlVHlwZSA9PT0gOSAmJlxuICAgIHBhcmVudC5ub2RlVHlwZSA9PT0gMSAmJlxuICAgIGRvYy5kb2N1bWVudEVsZW1lbnQuY29udGFpbnMocGFyZW50KVxuICApXG59XG4iLCJpbXBvcnQgeyBQYW56b29tT3B0aW9ucyB9IGZyb20gJy4vdHlwZXMnXG5cbmZ1bmN0aW9uIGdldENsYXNzKGVsZW06IEVsZW1lbnQpIHtcbiAgcmV0dXJuIChlbGVtLmdldEF0dHJpYnV0ZSgnY2xhc3MnKSB8fCAnJykudHJpbSgpXG59XG5cbmZ1bmN0aW9uIGhhc0NsYXNzKGVsZW06IEVsZW1lbnQsIGNsYXNzTmFtZTogc3RyaW5nKSB7XG4gIHJldHVybiBlbGVtLm5vZGVUeXBlID09PSAxICYmIGAgJHtnZXRDbGFzcyhlbGVtKX0gYC5pbmRleE9mKGAgJHtjbGFzc05hbWV9IGApID4gLTFcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaXNFeGNsdWRlZChlbGVtOiBFbGVtZW50LCBvcHRpb25zOiBQYW56b29tT3B0aW9ucykge1xuICBmb3IgKGxldCBjdXIgPSBlbGVtOyBjdXIgIT0gbnVsbDsgY3VyID0gY3VyLnBhcmVudE5vZGUgYXMgRWxlbWVudCkge1xuICAgIGlmIChoYXNDbGFzcyhjdXIsIG9wdGlvbnMuZXhjbHVkZUNsYXNzKSB8fCBvcHRpb25zLmV4Y2x1ZGUuaW5kZXhPZihjdXIpID4gLTEpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuIiwiLyoqXG4gKiBEZXRlcm1pbmUgaWYgYW4gZWxlbWVudCBpcyBTVkcgYnkgY2hlY2tpbmcgdGhlIG5hbWVzcGFjZVxuICogRXhjZXB0aW9uOiB0aGUgPHN2Zz4gZWxlbWVudCBpdHNlbGYgc2hvdWxkIGJlIHRyZWF0ZWQgbGlrZSBIVE1MXG4gKi9cbmNvbnN0IHJzdmcgPSAvXmh0dHA6W1xcd1xcLlxcL10rc3ZnJC9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzU1ZHRWxlbWVudChlbGVtOiBIVE1MRWxlbWVudCB8IFNWR0VsZW1lbnQpIHtcbiAgcmV0dXJuIHJzdmcudGVzdChlbGVtLm5hbWVzcGFjZVVSSSkgJiYgZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpICE9PSAnc3ZnJ1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2hhbGxvd0Nsb25lKG9iajogYW55KSB7XG4gIGNvbnN0IGNsb25lOiBhbnkgPSB7fVxuICBmb3IgKGNvbnN0IGtleSBpbiBvYmopIHtcbiAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIGNsb25lW2tleV0gPSBvYmpba2V5XVxuICAgIH1cbiAgfVxuICByZXR1cm4gY2xvbmVcbn1cbiIsIi8qKlxuICogUGFuem9vbSBmb3IgcGFubmluZyBhbmQgem9vbWluZyBlbGVtZW50cyB1c2luZyBDU1MgdHJhbnNmb3Jtc1xuICogaHR0cHM6Ly9naXRodWIuY29tL3RpbW15d2lsL3Bhbnpvb21cbiAqXG4gKiBDb3B5cmlnaHQgVGltbXkgV2lsbGlzb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9yc1xuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKiBodHRwczovL2dpdGh1Yi5jb20vdGltbXl3aWwvcGFuem9vbS9ibG9iL21hc3Rlci9NSVQtTGljZW5zZS50eHRcbiAqXG4gKi9cbmltcG9ydCAnLi9wb2x5ZmlsbHMnXG5cbmltcG9ydCB7XG4gIFBhbk9wdGlvbnMsXG4gIFBhbnpvb21FdmVudCxcbiAgUGFuem9vbUV2ZW50RGV0YWlsLFxuICBQYW56b29tT2JqZWN0LFxuICBQYW56b29tT3B0aW9ucyxcbiAgWm9vbU9wdGlvbnNcbn0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB7IGFkZFBvaW50ZXIsIGdldERpc3RhbmNlLCBnZXRNaWRkbGUsIHJlbW92ZVBvaW50ZXIgfSBmcm9tICcuL3BvaW50ZXJzJ1xuaW1wb3J0IHsgZGVzdHJveVBvaW50ZXIsIGV2ZW50TmFtZXMsIG9uUG9pbnRlciB9IGZyb20gJy4vZXZlbnRzJ1xuaW1wb3J0IHsgZ2V0RGltZW5zaW9ucywgc2V0U3R5bGUsIHNldFRyYW5zZm9ybSwgc2V0VHJhbnNpdGlvbiB9IGZyb20gJy4vY3NzJ1xuXG5pbXBvcnQgaXNBdHRhY2hlZCBmcm9tICcuL2lzQXR0YWNoZWQnXG5pbXBvcnQgaXNFeGNsdWRlZCBmcm9tICcuL2lzRXhjbHVkZWQnXG5pbXBvcnQgaXNTVkdFbGVtZW50IGZyb20gJy4vaXNTVkdFbGVtZW50J1xuaW1wb3J0IHNoYWxsb3dDbG9uZSBmcm9tICcuL3NoYWxsb3dDbG9uZSdcblxuY29uc3QgZGVmYXVsdE9wdGlvbnM6IFBhbnpvb21PcHRpb25zID0ge1xuICBhbmltYXRlOiBmYWxzZSxcbiAgY2FudmFzOiBmYWxzZSxcbiAgY3Vyc29yOiAnbW92ZScsXG4gIGRpc2FibGVQYW46IGZhbHNlLFxuICBkaXNhYmxlWm9vbTogZmFsc2UsXG4gIGRpc2FibGVYQXhpczogZmFsc2UsXG4gIGRpc2FibGVZQXhpczogZmFsc2UsXG4gIGR1cmF0aW9uOiAyMDAsXG4gIGVhc2luZzogJ2Vhc2UtaW4tb3V0JyxcbiAgZXhjbHVkZTogW10sXG4gIGV4Y2x1ZGVDbGFzczogJ3Bhbnpvb20tZXhjbHVkZScsXG4gIGhhbmRsZVN0YXJ0RXZlbnQ6IChlOiBFdmVudCkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgfSxcbiAgbWF4U2NhbGU6IDQsXG4gIG1pblNjYWxlOiAwLjEyNSxcbiAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICBwYW5Pbmx5V2hlblpvb21lZDogZmFsc2UsXG4gIHJlbGF0aXZlOiBmYWxzZSxcbiAgc2V0VHJhbnNmb3JtLFxuICBzdGFydFg6IDAsXG4gIHN0YXJ0WTogMCxcbiAgc3RhcnRTY2FsZTogMSxcbiAgc3RlcDogMC4zLFxuICB0b3VjaEFjdGlvbjogJ25vbmUnXG59XG5cbmZ1bmN0aW9uIFBhbnpvb20oXG4gIGVsZW06IEhUTUxFbGVtZW50IHwgU1ZHRWxlbWVudCxcbiAgb3B0aW9ucz86IE9taXQ8UGFuem9vbU9wdGlvbnMsICdmb3JjZSc+XG4pOiBQYW56b29tT2JqZWN0IHtcbiAgaWYgKCFlbGVtKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdQYW56b29tIHJlcXVpcmVzIGFuIGVsZW1lbnQgYXMgYW4gYXJndW1lbnQnKVxuICB9XG4gIGlmIChlbGVtLm5vZGVUeXBlICE9PSAxKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdQYW56b29tIHJlcXVpcmVzIGFuIGVsZW1lbnQgd2l0aCBhIG5vZGVUeXBlIG9mIDEnKVxuICB9XG4gIGlmICghaXNBdHRhY2hlZChlbGVtKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignUGFuem9vbSBzaG91bGQgYmUgY2FsbGVkIG9uIGVsZW1lbnRzIHRoYXQgaGF2ZSBiZWVuIGF0dGFjaGVkIHRvIHRoZSBET00nKVxuICB9XG5cbiAgb3B0aW9ucyA9IHtcbiAgICAuLi5kZWZhdWx0T3B0aW9ucyxcbiAgICAuLi5vcHRpb25zXG4gIH1cblxuICBjb25zdCBpc1NWRyA9IGlzU1ZHRWxlbWVudChlbGVtKVxuXG4gIGNvbnN0IHBhcmVudCA9IGVsZW0ucGFyZW50Tm9kZSBhcyBIVE1MRWxlbWVudCB8IFNWR0VsZW1lbnRcblxuICAvLyBTZXQgcGFyZW50IHN0eWxlc1xuICBwYXJlbnQuc3R5bGUub3ZlcmZsb3cgPSBvcHRpb25zLm92ZXJmbG93XG4gIHBhcmVudC5zdHlsZS51c2VyU2VsZWN0ID0gJ25vbmUnXG4gIC8vIFRoaXMgaXMgaW1wb3J0YW50IGZvciBtb2JpbGUgdG9cbiAgLy8gcHJldmVudCBzY3JvbGxpbmcgd2hpbGUgcGFubmluZ1xuICBwYXJlbnQuc3R5bGUudG91Y2hBY3Rpb24gPSBvcHRpb25zLnRvdWNoQWN0aW9uXG4gIC8vIFNldCB0aGUgY3Vyc29yIHN0eWxlIG9uIHRoZSBwYXJlbnQgaWYgd2UncmUgaW4gY2FudmFzIG1vZGVcbiAgOyhvcHRpb25zLmNhbnZhcyA/IHBhcmVudCA6IGVsZW0pLnN0eWxlLmN1cnNvciA9IG9wdGlvbnMuY3Vyc29yXG5cbiAgLy8gU2V0IGVsZW1lbnQgc3R5bGVzXG4gIGVsZW0uc3R5bGUudXNlclNlbGVjdCA9ICdub25lJ1xuICBlbGVtLnN0eWxlLnRvdWNoQWN0aW9uID0gb3B0aW9ucy50b3VjaEFjdGlvblxuICAvLyBUaGUgZGVmYXVsdCBmb3IgSFRNTCBpcyAnNTAlIDUwJSdcbiAgLy8gVGhlIGRlZmF1bHQgZm9yIFNWRyBpcyAnMCAwJ1xuICAvLyBTVkcgY2FuJ3QgYmUgY2hhbmdlZCBpbiBJRVxuICBzZXRTdHlsZShcbiAgICBlbGVtLFxuICAgICd0cmFuc2Zvcm1PcmlnaW4nLFxuICAgIHR5cGVvZiBvcHRpb25zLm9yaWdpbiA9PT0gJ3N0cmluZycgPyBvcHRpb25zLm9yaWdpbiA6IGlzU1ZHID8gJzAgMCcgOiAnNTAlIDUwJSdcbiAgKVxuXG4gIGZ1bmN0aW9uIHJlc2V0U3R5bGUoKSB7XG4gICAgcGFyZW50LnN0eWxlLm92ZXJmbG93ID0gJydcbiAgICBwYXJlbnQuc3R5bGUudXNlclNlbGVjdCA9ICcnXG4gICAgcGFyZW50LnN0eWxlLnRvdWNoQWN0aW9uID0gJydcbiAgICBwYXJlbnQuc3R5bGUuY3Vyc29yID0gJydcbiAgICBlbGVtLnN0eWxlLmN1cnNvciA9ICcnXG4gICAgZWxlbS5zdHlsZS51c2VyU2VsZWN0ID0gJydcbiAgICBlbGVtLnN0eWxlLnRvdWNoQWN0aW9uID0gJydcbiAgICBzZXRTdHlsZShlbGVtLCAndHJhbnNmb3JtT3JpZ2luJywgJycpXG4gIH1cblxuICBmdW5jdGlvbiBzZXRPcHRpb25zKG9wdHM6IE9taXQ8UGFuem9vbU9wdGlvbnMsICdmb3JjZSc+ID0ge30pIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBvcHRzKSB7XG4gICAgICBpZiAob3B0cy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIG9wdGlvbnNba2V5XSA9IG9wdHNba2V5XVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBIYW5kbGUgb3B0aW9uIHNpZGUtZWZmZWN0c1xuICAgIGlmIChvcHRzLmhhc093blByb3BlcnR5KCdjdXJzb3InKSB8fCBvcHRzLmhhc093blByb3BlcnR5KCdjYW52YXMnKSkge1xuICAgICAgcGFyZW50LnN0eWxlLmN1cnNvciA9IGVsZW0uc3R5bGUuY3Vyc29yID0gJydcbiAgICAgIDsob3B0aW9ucy5jYW52YXMgPyBwYXJlbnQgOiBlbGVtKS5zdHlsZS5jdXJzb3IgPSBvcHRpb25zLmN1cnNvclxuICAgIH1cbiAgICBpZiAob3B0cy5oYXNPd25Qcm9wZXJ0eSgnb3ZlcmZsb3cnKSkge1xuICAgICAgcGFyZW50LnN0eWxlLm92ZXJmbG93ID0gb3B0cy5vdmVyZmxvd1xuICAgIH1cbiAgICBpZiAob3B0cy5oYXNPd25Qcm9wZXJ0eSgndG91Y2hBY3Rpb24nKSkge1xuICAgICAgcGFyZW50LnN0eWxlLnRvdWNoQWN0aW9uID0gb3B0cy50b3VjaEFjdGlvblxuICAgICAgZWxlbS5zdHlsZS50b3VjaEFjdGlvbiA9IG9wdHMudG91Y2hBY3Rpb25cbiAgICB9XG4gICAgaWYgKFxuICAgICAgb3B0cy5oYXNPd25Qcm9wZXJ0eSgnbWluU2NhbGUnKSB8fFxuICAgICAgb3B0cy5oYXNPd25Qcm9wZXJ0eSgnbWF4U2NhbGUnKSB8fFxuICAgICAgb3B0cy5oYXNPd25Qcm9wZXJ0eSgnY29udGFpbicpXG4gICAgKSB7XG4gICAgICBzZXRNaW5NYXgoKVxuICAgIH1cbiAgfVxuXG4gIGxldCB4ID0gMFxuICBsZXQgeSA9IDBcbiAgbGV0IHNjYWxlID0gMVxuICBsZXQgaXNQYW5uaW5nID0gZmFsc2VcbiAgem9vbShvcHRpb25zLnN0YXJ0U2NhbGUsIHsgYW5pbWF0ZTogZmFsc2UgfSlcbiAgLy8gV2FpdCBmb3Igc2NhbGUgdG8gdXBkYXRlXG4gIC8vIGZvciBhY2N1cmF0ZSBkaW1lbnNpb25zXG4gIC8vIHRvIGNvbnN0cmFpbiBpbml0aWFsIHZhbHVlc1xuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBzZXRNaW5NYXgoKVxuICAgIHBhbihvcHRpb25zLnN0YXJ0WCwgb3B0aW9ucy5zdGFydFksIHsgYW5pbWF0ZTogZmFsc2UgfSlcbiAgfSlcblxuICBmdW5jdGlvbiB0cmlnZ2VyKGV2ZW50TmFtZTogUGFuem9vbUV2ZW50LCBkZXRhaWw6IFBhbnpvb21FdmVudERldGFpbCwgb3B0czogUGFuem9vbU9wdGlvbnMpIHtcbiAgICBpZiAob3B0cy5zaWxlbnQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCBldmVudCA9IG5ldyBDdXN0b21FdmVudChldmVudE5hbWUsIHsgZGV0YWlsIH0pXG4gICAgZWxlbS5kaXNwYXRjaEV2ZW50KGV2ZW50KVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0VHJhbnNmb3JtV2l0aEV2ZW50KFxuICAgIGV2ZW50TmFtZTogUGFuem9vbUV2ZW50LFxuICAgIG9wdHM6IFBhbnpvb21PcHRpb25zLFxuICAgIG9yaWdpbmFsRXZlbnQ/OiBQYW56b29tRXZlbnREZXRhaWxbJ29yaWdpbmFsRXZlbnQnXVxuICApIHtcbiAgICBjb25zdCB2YWx1ZSA9IHsgeCwgeSwgc2NhbGUsIGlzU1ZHLCBvcmlnaW5hbEV2ZW50IH1cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBvcHRzLmFuaW1hdGUgPT09ICdib29sZWFuJykge1xuICAgICAgICBpZiAob3B0cy5hbmltYXRlKSB7XG4gICAgICAgICAgc2V0VHJhbnNpdGlvbihlbGVtLCBvcHRzKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNldFN0eWxlKGVsZW0sICd0cmFuc2l0aW9uJywgJ25vbmUnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBvcHRzLnNldFRyYW5zZm9ybShlbGVtLCB2YWx1ZSwgb3B0cylcbiAgICB9KVxuICAgIHRyaWdnZXIoZXZlbnROYW1lLCB2YWx1ZSwgb3B0cylcbiAgICB0cmlnZ2VyKCdwYW56b29tY2hhbmdlJywgdmFsdWUsIG9wdHMpXG4gICAgcmV0dXJuIHZhbHVlXG4gIH1cblxuICBmdW5jdGlvbiBzZXRNaW5NYXgoKSB7XG4gICAgaWYgKG9wdGlvbnMuY29udGFpbikge1xuICAgICAgY29uc3QgZGltcyA9IGdldERpbWVuc2lvbnMoZWxlbSlcbiAgICAgIGNvbnN0IHBhcmVudFdpZHRoID0gZGltcy5wYXJlbnQud2lkdGggLSBkaW1zLnBhcmVudC5ib3JkZXIubGVmdCAtIGRpbXMucGFyZW50LmJvcmRlci5yaWdodFxuICAgICAgY29uc3QgcGFyZW50SGVpZ2h0ID0gZGltcy5wYXJlbnQuaGVpZ2h0IC0gZGltcy5wYXJlbnQuYm9yZGVyLnRvcCAtIGRpbXMucGFyZW50LmJvcmRlci5ib3R0b21cbiAgICAgIGNvbnN0IGVsZW1XaWR0aCA9IGRpbXMuZWxlbS53aWR0aCAvIHNjYWxlXG4gICAgICBjb25zdCBlbGVtSGVpZ2h0ID0gZGltcy5lbGVtLmhlaWdodCAvIHNjYWxlXG4gICAgICBjb25zdCBlbGVtU2NhbGVkV2lkdGggPSBwYXJlbnRXaWR0aCAvIGVsZW1XaWR0aFxuICAgICAgY29uc3QgZWxlbVNjYWxlZEhlaWdodCA9IHBhcmVudEhlaWdodCAvIGVsZW1IZWlnaHRcbiAgICAgIGlmIChvcHRpb25zLmNvbnRhaW4gPT09ICdpbnNpZGUnKSB7XG4gICAgICAgIG9wdGlvbnMubWF4U2NhbGUgPSBNYXRoLm1pbihlbGVtU2NhbGVkV2lkdGgsIGVsZW1TY2FsZWRIZWlnaHQpXG4gICAgICB9IGVsc2UgaWYgKG9wdGlvbnMuY29udGFpbiA9PT0gJ291dHNpZGUnKSB7XG4gICAgICAgIG9wdGlvbnMubWluU2NhbGUgPSBNYXRoLm1heChlbGVtU2NhbGVkV2lkdGgsIGVsZW1TY2FsZWRIZWlnaHQpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY29uc3RyYWluWFkoXG4gICAgdG9YOiBudW1iZXIgfCBzdHJpbmcsXG4gICAgdG9ZOiBudW1iZXIgfCBzdHJpbmcsXG4gICAgdG9TY2FsZTogbnVtYmVyLFxuICAgIHBhbk9wdGlvbnM/OiBQYW5PcHRpb25zXG4gICkge1xuICAgIGNvbnN0IG9wdHMgPSB7IC4uLm9wdGlvbnMsIC4uLnBhbk9wdGlvbnMgfVxuICAgIGNvbnN0IHJlc3VsdCA9IHsgeCwgeSwgb3B0cyB9XG4gICAgaWYgKCFvcHRzLmZvcmNlICYmIChvcHRzLmRpc2FibGVQYW4gfHwgKG9wdHMucGFuT25seVdoZW5ab29tZWQgJiYgc2NhbGUgPT09IG9wdHMuc3RhcnRTY2FsZSkpKSB7XG4gICAgICByZXR1cm4gcmVzdWx0XG4gICAgfVxuICAgIHRvWCA9IHBhcnNlRmxvYXQodG9YIGFzIHN0cmluZylcbiAgICB0b1kgPSBwYXJzZUZsb2F0KHRvWSBhcyBzdHJpbmcpXG5cbiAgICBpZiAoIW9wdHMuZGlzYWJsZVhBeGlzKSB7XG4gICAgICByZXN1bHQueCA9IChvcHRzLnJlbGF0aXZlID8geCA6IDApICsgdG9YXG4gICAgfVxuXG4gICAgaWYgKCFvcHRzLmRpc2FibGVZQXhpcykge1xuICAgICAgcmVzdWx0LnkgPSAob3B0cy5yZWxhdGl2ZSA/IHkgOiAwKSArIHRvWVxuICAgIH1cblxuICAgIGlmIChvcHRzLmNvbnRhaW4gPT09ICdpbnNpZGUnKSB7XG4gICAgICBjb25zdCBkaW1zID0gZ2V0RGltZW5zaW9ucyhlbGVtKVxuICAgICAgcmVzdWx0LnggPSBNYXRoLm1heChcbiAgICAgICAgLWRpbXMuZWxlbS5tYXJnaW4ubGVmdCAtIGRpbXMucGFyZW50LnBhZGRpbmcubGVmdCxcbiAgICAgICAgTWF0aC5taW4oXG4gICAgICAgICAgZGltcy5wYXJlbnQud2lkdGggLVxuICAgICAgICAgICAgZGltcy5lbGVtLndpZHRoIC8gdG9TY2FsZSAtXG4gICAgICAgICAgICBkaW1zLnBhcmVudC5wYWRkaW5nLmxlZnQgLVxuICAgICAgICAgICAgZGltcy5lbGVtLm1hcmdpbi5sZWZ0IC1cbiAgICAgICAgICAgIGRpbXMucGFyZW50LmJvcmRlci5sZWZ0IC1cbiAgICAgICAgICAgIGRpbXMucGFyZW50LmJvcmRlci5yaWdodCxcbiAgICAgICAgICByZXN1bHQueFxuICAgICAgICApXG4gICAgICApXG4gICAgICByZXN1bHQueSA9IE1hdGgubWF4KFxuICAgICAgICAtZGltcy5lbGVtLm1hcmdpbi50b3AgLSBkaW1zLnBhcmVudC5wYWRkaW5nLnRvcCxcbiAgICAgICAgTWF0aC5taW4oXG4gICAgICAgICAgZGltcy5wYXJlbnQuaGVpZ2h0IC1cbiAgICAgICAgICAgIGRpbXMuZWxlbS5oZWlnaHQgLyB0b1NjYWxlIC1cbiAgICAgICAgICAgIGRpbXMucGFyZW50LnBhZGRpbmcudG9wIC1cbiAgICAgICAgICAgIGRpbXMuZWxlbS5tYXJnaW4udG9wIC1cbiAgICAgICAgICAgIGRpbXMucGFyZW50LmJvcmRlci50b3AgLVxuICAgICAgICAgICAgZGltcy5wYXJlbnQuYm9yZGVyLmJvdHRvbSxcbiAgICAgICAgICByZXN1bHQueVxuICAgICAgICApXG4gICAgICApXG4gICAgfSBlbHNlIGlmIChvcHRzLmNvbnRhaW4gPT09ICdvdXRzaWRlJykge1xuICAgICAgY29uc3QgZGltcyA9IGdldERpbWVuc2lvbnMoZWxlbSlcbiAgICAgIGNvbnN0IHJlYWxXaWR0aCA9IGRpbXMuZWxlbS53aWR0aCAvIHNjYWxlXG4gICAgICBjb25zdCByZWFsSGVpZ2h0ID0gZGltcy5lbGVtLmhlaWdodCAvIHNjYWxlXG4gICAgICBjb25zdCBzY2FsZWRXaWR0aCA9IHJlYWxXaWR0aCAqIHRvU2NhbGVcbiAgICAgIGNvbnN0IHNjYWxlZEhlaWdodCA9IHJlYWxIZWlnaHQgKiB0b1NjYWxlXG4gICAgICBjb25zdCBkaWZmSG9yaXpvbnRhbCA9IChzY2FsZWRXaWR0aCAtIHJlYWxXaWR0aCkgLyAyXG4gICAgICBjb25zdCBkaWZmVmVydGljYWwgPSAoc2NhbGVkSGVpZ2h0IC0gcmVhbEhlaWdodCkgLyAyXG4gICAgICBjb25zdCBtaW5YID1cbiAgICAgICAgKC0oc2NhbGVkV2lkdGggLSBkaW1zLnBhcmVudC53aWR0aCkgLVxuICAgICAgICAgIGRpbXMucGFyZW50LnBhZGRpbmcubGVmdCAtXG4gICAgICAgICAgZGltcy5wYXJlbnQuYm9yZGVyLmxlZnQgLVxuICAgICAgICAgIGRpbXMucGFyZW50LmJvcmRlci5yaWdodCArXG4gICAgICAgICAgZGlmZkhvcml6b250YWwpIC9cbiAgICAgICAgdG9TY2FsZVxuICAgICAgY29uc3QgbWF4WCA9IChkaWZmSG9yaXpvbnRhbCAtIGRpbXMucGFyZW50LnBhZGRpbmcubGVmdCkgLyB0b1NjYWxlXG4gICAgICByZXN1bHQueCA9IE1hdGgubWF4KE1hdGgubWluKHJlc3VsdC54LCBtYXhYKSwgbWluWClcbiAgICAgIGNvbnN0IG1pblkgPVxuICAgICAgICAoLShzY2FsZWRIZWlnaHQgLSBkaW1zLnBhcmVudC5oZWlnaHQpIC1cbiAgICAgICAgICBkaW1zLnBhcmVudC5wYWRkaW5nLnRvcCAtXG4gICAgICAgICAgZGltcy5wYXJlbnQuYm9yZGVyLnRvcCAtXG4gICAgICAgICAgZGltcy5wYXJlbnQuYm9yZGVyLmJvdHRvbSArXG4gICAgICAgICAgZGlmZlZlcnRpY2FsKSAvXG4gICAgICAgIHRvU2NhbGVcbiAgICAgIGNvbnN0IG1heFkgPSAoZGlmZlZlcnRpY2FsIC0gZGltcy5wYXJlbnQucGFkZGluZy50b3ApIC8gdG9TY2FsZVxuICAgICAgcmVzdWx0LnkgPSBNYXRoLm1heChNYXRoLm1pbihyZXN1bHQueSwgbWF4WSksIG1pblkpXG4gICAgfVxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbnN0cmFpblNjYWxlKHRvU2NhbGU6IG51bWJlciwgem9vbU9wdGlvbnM/OiBab29tT3B0aW9ucykge1xuICAgIGNvbnN0IG9wdHMgPSB7IC4uLm9wdGlvbnMsIC4uLnpvb21PcHRpb25zIH1cbiAgICBjb25zdCByZXN1bHQgPSB7IHNjYWxlLCBvcHRzIH1cbiAgICBpZiAoIW9wdHMuZm9yY2UgJiYgb3B0cy5kaXNhYmxlWm9vbSkge1xuICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH1cbiAgICByZXN1bHQuc2NhbGUgPSBNYXRoLm1pbihNYXRoLm1heCh0b1NjYWxlLCBvcHRzLm1pblNjYWxlKSwgb3B0cy5tYXhTY2FsZSlcbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cblxuICBmdW5jdGlvbiBwYW4oXG4gICAgdG9YOiBudW1iZXIgfCBzdHJpbmcsXG4gICAgdG9ZOiBudW1iZXIgfCBzdHJpbmcsXG4gICAgcGFuT3B0aW9ucz86IFBhbk9wdGlvbnMsXG4gICAgb3JpZ2luYWxFdmVudD86IFBhbnpvb21FdmVudERldGFpbFsnb3JpZ2luYWxFdmVudCddXG4gICkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGNvbnN0cmFpblhZKHRvWCwgdG9ZLCBzY2FsZSwgcGFuT3B0aW9ucylcbiAgICBjb25zdCBvcHRzID0gcmVzdWx0Lm9wdHNcblxuICAgIHggPSByZXN1bHQueFxuICAgIHkgPSByZXN1bHQueVxuXG4gICAgcmV0dXJuIHNldFRyYW5zZm9ybVdpdGhFdmVudCgncGFuem9vbXBhbicsIG9wdHMsIG9yaWdpbmFsRXZlbnQpXG4gIH1cblxuICBmdW5jdGlvbiB6b29tKFxuICAgIHRvU2NhbGU6IG51bWJlcixcbiAgICB6b29tT3B0aW9ucz86IFpvb21PcHRpb25zLFxuICAgIG9yaWdpbmFsRXZlbnQ/OiBQYW56b29tRXZlbnREZXRhaWxbJ29yaWdpbmFsRXZlbnQnXVxuICApIHtcbiAgICBjb25zdCByZXN1bHQgPSBjb25zdHJhaW5TY2FsZSh0b1NjYWxlLCB6b29tT3B0aW9ucylcbiAgICBjb25zdCBvcHRzID0gcmVzdWx0Lm9wdHNcbiAgICBpZiAoIW9wdHMuZm9yY2UgJiYgb3B0cy5kaXNhYmxlWm9vbSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHRvU2NhbGUgPSByZXN1bHQuc2NhbGVcbiAgICBsZXQgdG9YID0geFxuICAgIGxldCB0b1kgPSB5XG5cbiAgICBpZiAob3B0cy5mb2NhbCkge1xuICAgICAgLy8gVGhlIGRpZmZlcmVuY2UgYmV0d2VlbiB0aGUgcG9pbnQgYWZ0ZXIgdGhlIHNjYWxlIGFuZCB0aGUgcG9pbnQgYmVmb3JlIHRoZSBzY2FsZVxuICAgICAgLy8gcGx1cyB0aGUgY3VycmVudCB0cmFuc2xhdGlvbiBhZnRlciB0aGUgc2NhbGVcbiAgICAgIC8vIG5ldXRyYWxpemVkIHRvIG5vIHNjYWxlIChhcyB0aGUgdHJhbnNmb3JtIHNjYWxlIHdpbGwgYXBwbHkgdG8gdGhlIHRyYW5zbGF0aW9uKVxuICAgICAgY29uc3QgZm9jYWwgPSBvcHRzLmZvY2FsXG4gICAgICB0b1ggPSAoZm9jYWwueCAvIHRvU2NhbGUgLSBmb2NhbC54IC8gc2NhbGUgKyB4ICogdG9TY2FsZSkgLyB0b1NjYWxlXG4gICAgICB0b1kgPSAoZm9jYWwueSAvIHRvU2NhbGUgLSBmb2NhbC55IC8gc2NhbGUgKyB5ICogdG9TY2FsZSkgLyB0b1NjYWxlXG4gICAgfVxuICAgIGNvbnN0IHBhblJlc3VsdCA9IGNvbnN0cmFpblhZKHRvWCwgdG9ZLCB0b1NjYWxlLCB7IHJlbGF0aXZlOiBmYWxzZSwgZm9yY2U6IHRydWUgfSlcbiAgICB4ID0gcGFuUmVzdWx0LnhcbiAgICB5ID0gcGFuUmVzdWx0LnlcbiAgICBzY2FsZSA9IHRvU2NhbGVcbiAgICByZXR1cm4gc2V0VHJhbnNmb3JtV2l0aEV2ZW50KCdwYW56b29tem9vbScsIG9wdHMsIG9yaWdpbmFsRXZlbnQpXG4gIH1cblxuICBmdW5jdGlvbiB6b29tSW5PdXQoaXNJbjogYm9vbGVhbiwgem9vbU9wdGlvbnM/OiBab29tT3B0aW9ucykge1xuICAgIGNvbnN0IG9wdHMgPSB7IC4uLm9wdGlvbnMsIGFuaW1hdGU6IHRydWUsIC4uLnpvb21PcHRpb25zIH1cbiAgICByZXR1cm4gem9vbShzY2FsZSAqIE1hdGguZXhwKChpc0luID8gMSA6IC0xKSAqIG9wdHMuc3RlcCksIG9wdHMpXG4gIH1cblxuICBmdW5jdGlvbiB6b29tSW4oem9vbU9wdGlvbnM/OiBab29tT3B0aW9ucykge1xuICAgIHJldHVybiB6b29tSW5PdXQodHJ1ZSwgem9vbU9wdGlvbnMpXG4gIH1cblxuICBmdW5jdGlvbiB6b29tT3V0KHpvb21PcHRpb25zPzogWm9vbU9wdGlvbnMpIHtcbiAgICByZXR1cm4gem9vbUluT3V0KGZhbHNlLCB6b29tT3B0aW9ucylcbiAgfVxuXG4gIGZ1bmN0aW9uIHpvb21Ub1BvaW50KFxuICAgIHRvU2NhbGU6IG51bWJlcixcbiAgICBwb2ludDogeyBjbGllbnRYOiBudW1iZXI7IGNsaWVudFk6IG51bWJlciB9LFxuICAgIHpvb21PcHRpb25zPzogWm9vbU9wdGlvbnMsXG4gICAgb3JpZ2luYWxFdmVudD86IFBhbnpvb21FdmVudERldGFpbFsnb3JpZ2luYWxFdmVudCddXG4gICkge1xuICAgIGNvbnN0IGRpbXMgPSBnZXREaW1lbnNpb25zKGVsZW0pXG5cbiAgICAvLyBJbnN0ZWFkIG9mIHRoaW5raW5nIG9mIG9wZXJhdGluZyBvbiB0aGUgcGFuem9vbSBlbGVtZW50LFxuICAgIC8vIHRoaW5rIG9mIG9wZXJhdGluZyBvbiB0aGUgYXJlYSBpbnNpZGUgdGhlIHBhbnpvb21cbiAgICAvLyBlbGVtZW50J3MgcGFyZW50XG4gICAgLy8gU3VidHJhY3QgcGFkZGluZyBhbmQgYm9yZGVyXG4gICAgY29uc3QgZWZmZWN0aXZlQXJlYSA9IHtcbiAgICAgIHdpZHRoOlxuICAgICAgICBkaW1zLnBhcmVudC53aWR0aCAtXG4gICAgICAgIGRpbXMucGFyZW50LnBhZGRpbmcubGVmdCAtXG4gICAgICAgIGRpbXMucGFyZW50LnBhZGRpbmcucmlnaHQgLVxuICAgICAgICBkaW1zLnBhcmVudC5ib3JkZXIubGVmdCAtXG4gICAgICAgIGRpbXMucGFyZW50LmJvcmRlci5yaWdodCxcbiAgICAgIGhlaWdodDpcbiAgICAgICAgZGltcy5wYXJlbnQuaGVpZ2h0IC1cbiAgICAgICAgZGltcy5wYXJlbnQucGFkZGluZy50b3AgLVxuICAgICAgICBkaW1zLnBhcmVudC5wYWRkaW5nLmJvdHRvbSAtXG4gICAgICAgIGRpbXMucGFyZW50LmJvcmRlci50b3AgLVxuICAgICAgICBkaW1zLnBhcmVudC5ib3JkZXIuYm90dG9tXG4gICAgfVxuXG4gICAgLy8gQWRqdXN0IHRoZSBjbGllbnRYL2NsaWVudFkgdG8gaWdub3JlIHRoZSBhcmVhXG4gICAgLy8gb3V0c2lkZSB0aGUgZWZmZWN0aXZlIGFyZWFcbiAgICBsZXQgY2xpZW50WCA9XG4gICAgICBwb2ludC5jbGllbnRYIC1cbiAgICAgIGRpbXMucGFyZW50LmxlZnQgLVxuICAgICAgZGltcy5wYXJlbnQucGFkZGluZy5sZWZ0IC1cbiAgICAgIGRpbXMucGFyZW50LmJvcmRlci5sZWZ0IC1cbiAgICAgIGRpbXMuZWxlbS5tYXJnaW4ubGVmdFxuICAgIGxldCBjbGllbnRZID1cbiAgICAgIHBvaW50LmNsaWVudFkgLVxuICAgICAgZGltcy5wYXJlbnQudG9wIC1cbiAgICAgIGRpbXMucGFyZW50LnBhZGRpbmcudG9wIC1cbiAgICAgIGRpbXMucGFyZW50LmJvcmRlci50b3AgLVxuICAgICAgZGltcy5lbGVtLm1hcmdpbi50b3BcblxuICAgIC8vIEFkanVzdCB0aGUgY2xpZW50WC9jbGllbnRZIGZvciBIVE1MIGVsZW1lbnRzLFxuICAgIC8vIGJlY2F1c2UgdGhleSBoYXZlIGEgdHJhbnNmb3JtLW9yaWdpbiBvZiA1MCUgNTAlXG4gICAgaWYgKCFpc1NWRykge1xuICAgICAgY2xpZW50WCAtPSBkaW1zLmVsZW0ud2lkdGggLyBzY2FsZSAvIDJcbiAgICAgIGNsaWVudFkgLT0gZGltcy5lbGVtLmhlaWdodCAvIHNjYWxlIC8gMlxuICAgIH1cblxuICAgIC8vIENvbnZlcnQgdGhlIG1vdXNlIHBvaW50IGZyb20gaXQncyBwb3NpdGlvbiBvdmVyIHRoZVxuICAgIC8vIGVmZmVjdGl2ZSBhcmVhIGJlZm9yZSB0aGUgc2NhbGUgdG8gdGhlIHBvc2l0aW9uXG4gICAgLy8gb3ZlciB0aGUgZWZmZWN0aXZlIGFyZWEgYWZ0ZXIgdGhlIHNjYWxlLlxuICAgIGNvbnN0IGZvY2FsID0ge1xuICAgICAgeDogKGNsaWVudFggLyBlZmZlY3RpdmVBcmVhLndpZHRoKSAqIChlZmZlY3RpdmVBcmVhLndpZHRoICogdG9TY2FsZSksXG4gICAgICB5OiAoY2xpZW50WSAvIGVmZmVjdGl2ZUFyZWEuaGVpZ2h0KSAqIChlZmZlY3RpdmVBcmVhLmhlaWdodCAqIHRvU2NhbGUpXG4gICAgfVxuXG4gICAgcmV0dXJuIHpvb20odG9TY2FsZSwgeyBhbmltYXRlOiBmYWxzZSwgLi4uem9vbU9wdGlvbnMsIGZvY2FsIH0sIG9yaWdpbmFsRXZlbnQpXG4gIH1cblxuICBmdW5jdGlvbiB6b29tV2l0aFdoZWVsKGV2ZW50OiBXaGVlbEV2ZW50LCB6b29tT3B0aW9ucz86IFpvb21PcHRpb25zKSB7XG4gICAgLy8gTmVlZCB0byBwcmV2ZW50IHRoZSBkZWZhdWx0IGhlcmVcbiAgICAvLyBvciBpdCBjb25mbGljdHMgd2l0aCByZWd1bGFyIHBhZ2Ugc2Nyb2xsXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG4gICAgY29uc3Qgb3B0cyA9IHsgLi4ub3B0aW9ucywgLi4uem9vbU9wdGlvbnMgfVxuXG4gICAgLy8gTm9ybWFsaXplIHRvIGRlbHRhWCBpbiBjYXNlIHNoaWZ0IG1vZGlmaWVyIGlzIHVzZWQgb24gTWFjXG4gICAgY29uc3QgZGVsdGEgPSBldmVudC5kZWx0YVkgPT09IDAgJiYgZXZlbnQuZGVsdGFYID8gZXZlbnQuZGVsdGFYIDogZXZlbnQuZGVsdGFZXG4gICAgY29uc3Qgd2hlZWwgPSBkZWx0YSA8IDAgPyAxIDogLTFcbiAgICBjb25zdCB0b1NjYWxlID0gY29uc3RyYWluU2NhbGUoc2NhbGUgKiBNYXRoLmV4cCgod2hlZWwgKiBvcHRzLnN0ZXApIC8gMyksIG9wdHMpLnNjYWxlXG5cbiAgICByZXR1cm4gem9vbVRvUG9pbnQodG9TY2FsZSwgZXZlbnQsIG9wdHMpXG4gIH1cblxuICBmdW5jdGlvbiByZXNldChyZXNldE9wdGlvbnM/OiBQYW56b29tT3B0aW9ucykge1xuICAgIGNvbnN0IG9wdHMgPSB7IC4uLm9wdGlvbnMsIGFuaW1hdGU6IHRydWUsIGZvcmNlOiB0cnVlLCAuLi5yZXNldE9wdGlvbnMgfVxuICAgIHNjYWxlID0gY29uc3RyYWluU2NhbGUob3B0cy5zdGFydFNjYWxlLCBvcHRzKS5zY2FsZVxuICAgIGNvbnN0IHBhblJlc3VsdCA9IGNvbnN0cmFpblhZKG9wdHMuc3RhcnRYLCBvcHRzLnN0YXJ0WSwgc2NhbGUsIG9wdHMpXG4gICAgeCA9IHBhblJlc3VsdC54XG4gICAgeSA9IHBhblJlc3VsdC55XG4gICAgcmV0dXJuIHNldFRyYW5zZm9ybVdpdGhFdmVudCgncGFuem9vbXJlc2V0Jywgb3B0cylcbiAgfVxuXG4gIGxldCBvcmlnWDogbnVtYmVyXG4gIGxldCBvcmlnWTogbnVtYmVyXG4gIGxldCBzdGFydENsaWVudFg6IG51bWJlclxuICBsZXQgc3RhcnRDbGllbnRZOiBudW1iZXJcbiAgbGV0IHN0YXJ0U2NhbGU6IG51bWJlclxuICBsZXQgc3RhcnREaXN0YW5jZTogbnVtYmVyXG4gIGNvbnN0IHBvaW50ZXJzOiBQb2ludGVyRXZlbnRbXSA9IFtdXG5cbiAgZnVuY3Rpb24gaGFuZGxlRG93bihldmVudDogUG9pbnRlckV2ZW50KSB7XG4gICAgLy8gRG9uJ3QgaGFuZGxlIHRoaXMgZXZlbnQgaWYgdGhlIHRhcmdldCBpcyBleGNsdWRlZFxuICAgIGlmIChpc0V4Y2x1ZGVkKGV2ZW50LnRhcmdldCBhcyBFbGVtZW50LCBvcHRpb25zKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGFkZFBvaW50ZXIocG9pbnRlcnMsIGV2ZW50KVxuICAgIGlzUGFubmluZyA9IHRydWVcbiAgICBvcHRpb25zLmhhbmRsZVN0YXJ0RXZlbnQoZXZlbnQpXG4gICAgb3JpZ1ggPSB4XG4gICAgb3JpZ1kgPSB5XG5cbiAgICB0cmlnZ2VyKCdwYW56b29tc3RhcnQnLCB7IHgsIHksIHNjYWxlLCBpc1NWRywgb3JpZ2luYWxFdmVudDogZXZlbnQgfSwgb3B0aW9ucylcblxuICAgIC8vIFRoaXMgd29ya3Mgd2hldGhlciB0aGVyZSBhcmUgbXVsdGlwbGVcbiAgICAvLyBwb2ludGVycyBvciBub3RcbiAgICBjb25zdCBwb2ludCA9IGdldE1pZGRsZShwb2ludGVycylcbiAgICBzdGFydENsaWVudFggPSBwb2ludC5jbGllbnRYXG4gICAgc3RhcnRDbGllbnRZID0gcG9pbnQuY2xpZW50WVxuICAgIHN0YXJ0U2NhbGUgPSBzY2FsZVxuICAgIHN0YXJ0RGlzdGFuY2UgPSBnZXREaXN0YW5jZShwb2ludGVycylcbiAgfVxuXG4gIGZ1bmN0aW9uIG1vdmUoZXZlbnQ6IFBvaW50ZXJFdmVudCkge1xuICAgIGlmIChcbiAgICAgICFpc1Bhbm5pbmcgfHxcbiAgICAgIG9yaWdYID09PSB1bmRlZmluZWQgfHxcbiAgICAgIG9yaWdZID09PSB1bmRlZmluZWQgfHxcbiAgICAgIHN0YXJ0Q2xpZW50WCA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICBzdGFydENsaWVudFkgPT09IHVuZGVmaW5lZFxuICAgICkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGFkZFBvaW50ZXIocG9pbnRlcnMsIGV2ZW50KVxuICAgIGNvbnN0IGN1cnJlbnQgPSBnZXRNaWRkbGUocG9pbnRlcnMpXG4gICAgaWYgKHBvaW50ZXJzLmxlbmd0aCA+IDEpIHtcbiAgICAgIC8vIFVzZSB0aGUgZGlzdGFuY2UgYmV0d2VlbiB0aGUgZmlyc3QgMiBwb2ludGVyc1xuICAgICAgLy8gdG8gZGV0ZXJtaW5lIHRoZSBjdXJyZW50IHNjYWxlXG4gICAgICBjb25zdCBkaWZmID0gZ2V0RGlzdGFuY2UocG9pbnRlcnMpIC0gc3RhcnREaXN0YW5jZVxuICAgICAgY29uc3QgdG9TY2FsZSA9IGNvbnN0cmFpblNjYWxlKChkaWZmICogb3B0aW9ucy5zdGVwKSAvIDgwICsgc3RhcnRTY2FsZSkuc2NhbGVcbiAgICAgIHpvb21Ub1BvaW50KHRvU2NhbGUsIGN1cnJlbnQpXG4gICAgfVxuXG4gICAgcGFuKFxuICAgICAgb3JpZ1ggKyAoY3VycmVudC5jbGllbnRYIC0gc3RhcnRDbGllbnRYKSAvIHNjYWxlLFxuICAgICAgb3JpZ1kgKyAoY3VycmVudC5jbGllbnRZIC0gc3RhcnRDbGllbnRZKSAvIHNjYWxlLFxuICAgICAge1xuICAgICAgICBhbmltYXRlOiBmYWxzZVxuICAgICAgfSxcbiAgICAgIGV2ZW50XG4gICAgKVxuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlVXAoZXZlbnQ6IFBvaW50ZXJFdmVudCkge1xuICAgIC8vIERvbid0IGNhbGwgcGFuem9vbWVuZCB3aGVuIHBhbm5pbmcgd2l0aCAyIHRvdWNoZXNcbiAgICAvLyB1bnRpbCBib3RoIHRvdWNoZXMgZW5kXG4gICAgaWYgKHBvaW50ZXJzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgdHJpZ2dlcigncGFuem9vbWVuZCcsIHsgeCwgeSwgc2NhbGUsIGlzU1ZHLCBvcmlnaW5hbEV2ZW50OiBldmVudCB9LCBvcHRpb25zKVxuICAgIH1cbiAgICAvLyBOb3RlOiBkb24ndCByZW1vdmUgYWxsIHBvaW50ZXJzXG4gICAgLy8gQ2FuIHJlc3RhcnQgd2l0aG91dCBoYXZpbmcgdG8gcmVpbml0aWF0ZSBhbGwgb2YgdGhlbVxuICAgIC8vIFJlbW92ZSB0aGUgcG9pbnRlciByZWdhcmRsZXNzIG9mIHRoZSBpc1Bhbm5pbmcgc3RhdGVcbiAgICByZW1vdmVQb2ludGVyKHBvaW50ZXJzLCBldmVudClcbiAgICBpZiAoIWlzUGFubmluZykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlzUGFubmluZyA9IGZhbHNlXG4gICAgb3JpZ1ggPSBvcmlnWSA9IHN0YXJ0Q2xpZW50WCA9IHN0YXJ0Q2xpZW50WSA9IHVuZGVmaW5lZFxuICB9XG5cbiAgbGV0IGJvdW5kID0gZmFsc2VcbiAgZnVuY3Rpb24gYmluZCgpIHtcbiAgICBpZiAoYm91bmQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBib3VuZCA9IHRydWVcbiAgICBvblBvaW50ZXIoJ2Rvd24nLCBvcHRpb25zLmNhbnZhcyA/IHBhcmVudCA6IGVsZW0sIGhhbmRsZURvd24pXG4gICAgb25Qb2ludGVyKCdtb3ZlJywgZG9jdW1lbnQsIG1vdmUsIHsgcGFzc2l2ZTogdHJ1ZSB9KVxuICAgIG9uUG9pbnRlcigndXAnLCBkb2N1bWVudCwgaGFuZGxlVXAsIHsgcGFzc2l2ZTogdHJ1ZSB9KVxuICB9XG5cbiAgZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICBib3VuZCA9IGZhbHNlXG4gICAgZGVzdHJveVBvaW50ZXIoJ2Rvd24nLCBvcHRpb25zLmNhbnZhcyA/IHBhcmVudCA6IGVsZW0sIGhhbmRsZURvd24pXG4gICAgZGVzdHJveVBvaW50ZXIoJ21vdmUnLCBkb2N1bWVudCwgbW92ZSlcbiAgICBkZXN0cm95UG9pbnRlcigndXAnLCBkb2N1bWVudCwgaGFuZGxlVXApXG4gIH1cblxuICBpZiAoIW9wdGlvbnMubm9CaW5kKSB7XG4gICAgYmluZCgpXG4gIH1cblxuICByZXR1cm4ge1xuICAgIGJpbmQsXG4gICAgZGVzdHJveSxcbiAgICBldmVudE5hbWVzLFxuICAgIGdldFBhbjogKCkgPT4gKHsgeCwgeSB9KSxcbiAgICBnZXRTY2FsZTogKCkgPT4gc2NhbGUsXG4gICAgZ2V0T3B0aW9uczogKCkgPT4gc2hhbGxvd0Nsb25lKG9wdGlvbnMpLFxuICAgIHBhbixcbiAgICByZXNldCxcbiAgICByZXNldFN0eWxlLFxuICAgIHNldE9wdGlvbnMsXG4gICAgc2V0U3R5bGU6IChuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpID0+IHNldFN0eWxlKGVsZW0sIG5hbWUsIHZhbHVlKSxcbiAgICB6b29tLFxuICAgIHpvb21JbixcbiAgICB6b29tT3V0LFxuICAgIHpvb21Ub1BvaW50LFxuICAgIHpvb21XaXRoV2hlZWxcbiAgfVxufVxuXG5QYW56b29tLmRlZmF1bHRPcHRpb25zID0gZGVmYXVsdE9wdGlvbnNcblxuZXhwb3J0IHsgUGFuem9vbU9iamVjdCwgUGFuem9vbU9wdGlvbnMgfVxuZXhwb3J0IGRlZmF1bHQgUGFuem9vbVxuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///860\n')
        },
        252: () => {
            eval('/* eslint-disable no-var */\nif (typeof window !== \'undefined\') {\n  // Support: IE11 only\n  if (window.NodeList && !NodeList.prototype.forEach) {\n    NodeList.prototype.forEach = Array.prototype.forEach\n  }\n  // Support: IE11 only\n  // CustomEvent is an object instead of a constructor\n  if (typeof window.CustomEvent !== \'function\') {\n    window.CustomEvent = function CustomEvent(event, params) {\n      params = params || { bubbles: false, cancelable: false, detail: null }\n      var evt = document.createEvent(\'CustomEvent\')\n      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)\n      return evt\n    }\n  }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AcGFuem9vbS9wYW56b29tLy4vc3JjL3BvbHlmaWxscy5qcz8wNjc0Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiIyNTIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBuby12YXIgKi9cbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAvLyBTdXBwb3J0OiBJRTExIG9ubHlcbiAgaWYgKHdpbmRvdy5Ob2RlTGlzdCAmJiAhTm9kZUxpc3QucHJvdG90eXBlLmZvckVhY2gpIHtcbiAgICBOb2RlTGlzdC5wcm90b3R5cGUuZm9yRWFjaCA9IEFycmF5LnByb3RvdHlwZS5mb3JFYWNoXG4gIH1cbiAgLy8gU3VwcG9ydDogSUUxMSBvbmx5XG4gIC8vIEN1c3RvbUV2ZW50IGlzIGFuIG9iamVjdCBpbnN0ZWFkIG9mIGEgY29uc3RydWN0b3JcbiAgaWYgKHR5cGVvZiB3aW5kb3cuQ3VzdG9tRXZlbnQgIT09ICdmdW5jdGlvbicpIHtcbiAgICB3aW5kb3cuQ3VzdG9tRXZlbnQgPSBmdW5jdGlvbiBDdXN0b21FdmVudChldmVudCwgcGFyYW1zKSB7XG4gICAgICBwYXJhbXMgPSBwYXJhbXMgfHwgeyBidWJibGVzOiBmYWxzZSwgY2FuY2VsYWJsZTogZmFsc2UsIGRldGFpbDogbnVsbCB9XG4gICAgICB2YXIgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0N1c3RvbUV2ZW50JylcbiAgICAgIGV2dC5pbml0Q3VzdG9tRXZlbnQoZXZlbnQsIHBhcmFtcy5idWJibGVzLCBwYXJhbXMuY2FuY2VsYWJsZSwgcGFyYW1zLmRldGFpbClcbiAgICAgIHJldHVybiBldnRcbiAgICB9XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///252\n')
        }
    },
        __webpack_module_cache__ = {
        },
        inProgress,
        dataWebpackPrefix;
    function __webpack_require__(Q) {
        var U = __webpack_module_cache__[Q];
        if (void 0 !== U) {
            if (void 0 !== U.error) throw U.error;
            return U.exports
        }
        var F = __webpack_module_cache__[Q] = {
            exports: {
            }
        };
        try {
            var B = {
                id: Q,
                module: F,
                factory: __webpack_modules__[Q],
                require: __webpack_require__
            };
            __webpack_require__.i.forEach((function (Q) {
                Q(B)
            })),
                F = B.module,
                B.factory.call(F.exports, F, F.exports, B.require)
        } catch (Q) {
            throw F.error = Q,
            Q
        }
        return F.exports
    }
    __webpack_require__.m = __webpack_modules__,
        __webpack_require__.c = __webpack_module_cache__,
        __webpack_require__.i = [
        ],
        __webpack_require__.d = (Q, U) => {
            for (var F in U) __webpack_require__.o(U, F) && !__webpack_require__.o(Q, F) && Object.defineProperty(Q, F, {
                enumerable: !0,
                get: U[F]
            })
        },
        __webpack_require__.hu = Q => Q + '.' + __webpack_require__.h() + '.hot-update.js',
        __webpack_require__.hmrF = () => 'panzoom.' + __webpack_require__.h() + '.hot-update.json',
        __webpack_require__.h = () => 'a15180ed1cd44db471a6',
        __webpack_require__.g = function () {
            if ('object' == typeof globalThis) return globalThis;
            try {
                return this || new Function('return this')()
            } catch (Q) {
                if ('object' == typeof window) return window
            }
        }(),
        __webpack_require__.o = (Q, U) => Object.prototype.hasOwnProperty.call(Q, U),
        inProgress = {
        },
        dataWebpackPrefix = '@panzoom/panzoom:',
        __webpack_require__.l = (Q, U, F, B) => {
            if (inProgress[Q]) inProgress[Q].push(U);
            else {
                var n,
                    e;
                if (void 0 !== F) for (var s = document.getElementsByTagName('script'), t = 0; t < s.length; t++) {
                    var l = s[t];
                    if (l.getAttribute('src') == Q || l.getAttribute('data-webpack') == dataWebpackPrefix + F) {
                        n = l;
                        break
                    }
                }
                n || (e = !0, (n = document.createElement('script')).charset = 'utf-8', n.timeout = 120, __webpack_require__.nc && n.setAttribute('nonce', __webpack_require__.nc), n.setAttribute('data-webpack', dataWebpackPrefix + F), n.src = Q),
                    inProgress[Q] = [
                        U
                    ];
                var r = (U, F) => {
                    n.onerror = n.onload = null,
                        clearTimeout(c);
                    var B = inProgress[Q];
                    if (delete inProgress[Q], n.parentNode && n.parentNode.removeChild(n), B && B.forEach((Q => Q(F))), U) return U(F)
                },
                    c = setTimeout(r.bind(null, void 0, {
                        type: 'timeout',
                        target: n
                    }), 120000);
                n.onerror = r.bind(null, n.onerror),
                    n.onload = r.bind(null, n.onload),
                    e && document.head.appendChild(n)
            }
        },
        (() => {
            var Q,
                U,
                F,
                B,
                n = {
                },
                e = __webpack_require__.c,
                s = [
                ],
                t = [
                ],
                l = 'idle';
            function r(Q) {
                l = Q;
                for (var U = 0; U < t.length; U++) t[U].call(null, Q)
            }
            function c(Q) {
                if (0 === U.length) return Q();
                var F = U;
                return U = [
                ],
                    Promise.all(F).then((function () {
                        return c(Q)
                    }))
            }
            function i(Q) {
                if ('idle' !== l) throw new Error('check() is only allowed in idle status');
                return r('check'),
                    __webpack_require__.hmrM().then((function (B) {
                        if (!B) return r(d() ? 'ready' : 'idle'),
                            null;
                        r('prepare');
                        var n = [
                        ];
                        return U = [
                        ],
                            F = [
                            ],
                            Promise.all(Object.keys(__webpack_require__.hmrC).reduce((function (Q, U) {
                                return __webpack_require__.hmrC[U](B.c, B.r, B.m, Q, F, n),
                                    Q
                            }), [
                            ])).then((function () {
                                return c((function () {
                                    return Q ? g(Q) : (r('ready'), n)
                                }))
                            }))
                    }))
            }
            function b(Q) {
                return 'ready' !== l ? Promise.resolve().then((function () {
                    throw new Error('apply() is only allowed in ready status')
                })) : g(Q)
            }
            function g(Q) {
                Q = Q || {
                },
                    d();
                var U = F.map((function (U) {
                    return U(Q)
                }));
                F = void 0;
                var n,
                    e = U.map((function (Q) {
                        return Q.error
                    })).filter(Boolean);
                if (e.length > 0) return r('abort'),
                    Promise.resolve().then((function () {
                        throw e[0]
                    }));
                r('dispose'),
                    U.forEach((function (Q) {
                        Q.dispose && Q.dispose()
                    })),
                    r('apply');
                var s = function (Q) {
                    n || (n = Q)
                },
                    t = [
                    ];
                return U.forEach((function (Q) {
                    if (Q.apply) {
                        var U = Q.apply(s);
                        if (U) for (var F = 0; F < U.length; F++) t.push(U[F])
                    }
                })),
                    n ? (r('fail'), Promise.resolve().then((function () {
                        throw n
                    }))) : B ? g(Q).then((function (Q) {
                        return t.forEach((function (U) {
                            Q.indexOf(U) < 0 && Q.push(U)
                        })),
                            Q
                    })) : (r('idle'), Promise.resolve(t))
            }
            function d() {
                if (B) return F || (F = [
                ]),
                    Object.keys(__webpack_require__.hmrI).forEach((function (Q) {
                        B.forEach((function (U) {
                            __webpack_require__.hmrI[Q](U, F)
                        }))
                    })),
                    B = void 0,
                    !0
            }
            __webpack_require__.hmrD = n,
                __webpack_require__.i.push((function (g) {
                    var d,
                        x,
                        I,
                        a,
                        o = g.module,
                        L = function (F, B) {
                            var n = e[B];
                            if (!n) return F;
                            var t = function (U) {
                                if (n.hot.active) {
                                    if (e[U]) {
                                        var t = e[U].parents;
                                        - 1 === t.indexOf(B) && t.push(B)
                                    } else s = [
                                        B
                                    ],
                                        Q = U;
                                    - 1 === n.children.indexOf(U) && n.children.push(U)
                                } else console.warn('[HMR] unexpected require(' + U + ') from disposed module ' + B),
                                    s = [
                                    ];
                                return F(U)
                            },
                                i = function (Q) {
                                    return {
                                        configurable: !0,
                                        enumerable: !0,
                                        get: function () {
                                            return F[Q]
                                        },
                                        set: function (U) {
                                            F[Q] = U
                                        }
                                    }
                                };
                            for (var b in F) Object.prototype.hasOwnProperty.call(F, b) && 'e' !== b && Object.defineProperty(t, b, i(b));
                            return t.e = function (Q) {
                                return function (Q) {
                                    switch (l) {
                                        case 'ready':
                                            return r('prepare'),
                                                U.push(Q),
                                                c((function () {
                                                    r('ready')
                                                })),
                                                Q;
                                        case 'prepare':
                                            return U.push(Q),
                                                Q;
                                        default:
                                            return Q
                                    }
                                }(F.e(Q))
                            },
                                t
                        }(g.require, g.id);
                    o.hot = (d = g.id, x = o, a = {
                        _acceptedDependencies: {
                        },
                        _acceptedErrorHandlers: {
                        },
                        _declinedDependencies: {
                        },
                        _selfAccepted: !1,
                        _selfDeclined: !1,
                        _selfInvalidated: !1,
                        _disposeHandlers: [
                        ],
                        _main: I = Q !== d,
                        _requireSelf: function () {
                            s = x.parents.slice(),
                                Q = I ? void 0 : d,
                                __webpack_require__(d)
                        },
                        active: !0,
                        accept: function (Q, U, F) {
                            if (void 0 === Q) a._selfAccepted = !0;
                            else if ('function' == typeof Q) a._selfAccepted = Q;
                            else if ('object' == typeof Q && null !== Q) for (var B = 0; B < Q.length; B++) a._acceptedDependencies[Q[B]] = U || function () {
                            },
                                a._acceptedErrorHandlers[Q[B]] = F;
                            else a._acceptedDependencies[Q] = U || function () {
                            },
                                a._acceptedErrorHandlers[Q] = F
                        },
                        decline: function (Q) {
                            if (void 0 === Q) a._selfDeclined = !0;
                            else if ('object' == typeof Q && null !== Q) for (var U = 0; U < Q.length; U++) a._declinedDependencies[Q[U]] = !0;
                            else a._declinedDependencies[Q] = !0
                        },
                        dispose: function (Q) {
                            a._disposeHandlers.push(Q)
                        },
                        addDisposeHandler: function (Q) {
                            a._disposeHandlers.push(Q)
                        },
                        removeDisposeHandler: function (Q) {
                            var U = a._disposeHandlers.indexOf(Q);
                            U >= 0 && a._disposeHandlers.splice(U, 1)
                        },
                        invalidate: function () {
                            switch (this._selfInvalidated = !0, l) {
                                case 'idle':
                                    F = [
                                    ],
                                        Object.keys(__webpack_require__.hmrI).forEach((function (Q) {
                                            __webpack_require__.hmrI[Q](d, F)
                                        })),
                                        r('ready');
                                    break;
                                case 'ready':
                                    Object.keys(__webpack_require__.hmrI).forEach((function (Q) {
                                        __webpack_require__.hmrI[Q](d, F)
                                    }));
                                    break;
                                case 'prepare':
                                case 'check':
                                case 'dispose':
                                case 'apply':
                                    (B = B || [
                                    ]).push(d)
                            }
                        },
                        check: i,
                        apply: b,
                        status: function (Q) {
                            if (!Q) return l;
                            t.push(Q)
                        },
                        addStatusHandler: function (Q) {
                            t.push(Q)
                        },
                        removeStatusHandler: function (Q) {
                            var U = t.indexOf(Q);
                            U >= 0 && t.splice(U, 1)
                        },
                        data: n[d]
                    }, Q = void 0, a),
                        o.parents = s,
                        o.children = [
                        ],
                        s = [
                        ],
                        g.require = L
                })),
                __webpack_require__.hmrC = {
                },
                __webpack_require__.hmrI = {
                }
        })(),
        (() => {
            var Q;
            __webpack_require__.g.importScripts && (Q = __webpack_require__.g.location + '');
            var U = __webpack_require__.g.document;
            if (!Q && U && (U.currentScript && (Q = U.currentScript.src), !Q)) {
                var F = U.getElementsByTagName('script');
                F.length && (Q = F[F.length - 1].src)
            }
            if (!Q) throw new Error('Automatic publicPath is not supported in this browser');
            Q = Q.replace(/#.*$/, '').replace(/\?.*$/, '').replace(/\/[^\/]+$/, '/'),
                __webpack_require__.p = Q
        })(),
        (() => {
            var Q,
                U,
                F,
                B,
                n = {
                    478: 0
                },
                e = {
                };
            function s(Q) {
                return new Promise(((U, F) => {
                    e[Q] = U;
                    var B = __webpack_require__.p + __webpack_require__.hu(Q),
                        n = new Error;
                    __webpack_require__.l(B, (U => {
                        if (e[Q]) {
                            e[Q] = void 0;
                            var B = U && ('load' === U.type ? 'missing' : U.type),
                                s = U && U.target && U.target.src;
                            n.message = 'Loading hot update chunk ' + Q + ' failed.\n(' + B + ': ' + s + ')',
                                n.name = 'ChunkLoadError',
                                n.type = B,
                                n.request = s,
                                F(n)
                        }
                    }))
                }))
            }
            function t(e) {
                function s(Q) {
                    for (var U = [
                        Q
                    ], F = {
                    }, B = U.map((function (Q) {
                        return {
                            chain: [
                                Q
                            ],
                            id: Q
                        }
                    })); B.length > 0;) {
                        var n = B.pop(),
                            e = n.id,
                            s = n.chain,
                            l = __webpack_require__.c[e];
                        if (l && (!l.hot._selfAccepted || l.hot._selfInvalidated)) {
                            if (l.hot._selfDeclined) return {
                                type: 'self-declined',
                                chain: s,
                                moduleId: e
                            };
                            if (l.hot._main) return {
                                type: 'unaccepted',
                                chain: s,
                                moduleId: e
                            };
                            for (var r = 0; r < l.parents.length; r++) {
                                var c = l.parents[r],
                                    i = __webpack_require__.c[c];
                                if (i) {
                                    if (i.hot._declinedDependencies[e]) return {
                                        type: 'declined',
                                        chain: s.concat([c]),
                                        moduleId: e,
                                        parentId: c
                                    };
                                    - 1 === U.indexOf(c) && (i.hot._acceptedDependencies[e] ? (F[c] || (F[c] = [
                                    ]), t(F[c], [
                                        e
                                    ])) : (delete F[c], U.push(c), B.push({
                                        chain: s.concat([c]),
                                        id: c
                                    })))
                                }
                            }
                        }
                    }
                    return {
                        type: 'accepted',
                        moduleId: Q,
                        outdatedModules: U,
                        outdatedDependencies: F
                    }
                }
                function t(Q, U) {
                    for (var F = 0; F < U.length; F++) {
                        var B = U[F];
                        - 1 === Q.indexOf(B) && Q.push(B)
                    }
                }
                __webpack_require__.f && delete __webpack_require__.f.jsonpHmr,
                    Q = void 0;
                var l = {
                },
                    r = [
                    ],
                    c = {
                    },
                    i = function (Q) {
                        console.warn('[HMR] unexpected require(' + Q.id + ') to disposed module')
                    };
                for (var b in U) if (__webpack_require__.o(U, b)) {
                    var g,
                        d = U[b],
                        x = !1,
                        I = !1,
                        a = !1,
                        o = '';
                    switch ((g = d ? s(b) : {
                        type: 'disposed',
                        moduleId: b
                    }).chain && (o = '\nUpdate propagation: ' + g.chain.join(' -> ')), g.type) {
                        case 'self-declined':
                            e.onDeclined && e.onDeclined(g),
                                e.ignoreDeclined || (x = new Error('Aborted because of self decline: ' + g.moduleId + o));
                            break;
                        case 'declined':
                            e.onDeclined && e.onDeclined(g),
                                e.ignoreDeclined || (x = new Error('Aborted because of declined dependency: ' + g.moduleId + ' in ' + g.parentId + o));
                            break;
                        case 'unaccepted':
                            e.onUnaccepted && e.onUnaccepted(g),
                                e.ignoreUnaccepted || (x = new Error('Aborted because ' + b + ' is not accepted' + o));
                            break;
                        case 'accepted':
                            e.onAccepted && e.onAccepted(g),
                                I = !0;
                            break;
                        case 'disposed':
                            e.onDisposed && e.onDisposed(g),
                                a = !0;
                            break;
                        default:
                            throw new Error('Unexception type ' + g.type)
                    }
                    if (x) return {
                        error: x
                    };
                    if (I) for (b in c[b] = d, t(r, g.outdatedModules), g.outdatedDependencies) __webpack_require__.o(g.outdatedDependencies, b) && (l[b] || (l[b] = [
                    ]), t(l[b], g.outdatedDependencies[b]));
                    a && (t(r, [
                        g.moduleId
                    ]), c[b] = i)
                }
                U = void 0;
                for (var L, u = [
                ], S = 0; S < r.length; S++) {
                    var C = r[S],
                        G = __webpack_require__.c[C];
                    G && (G.hot._selfAccepted || G.hot._main) && c[C] !== i && !G.hot._selfInvalidated && u.push({
                        module: C,
                        require: G.hot._requireSelf,
                        errorHandler: G.hot._selfAccepted
                    })
                }
                return {
                    dispose: function () {
                        var Q;
                        F.forEach((function (Q) {
                            delete n[Q]
                        })),
                            F = void 0;
                        for (var U, B = r.slice(); B.length > 0;) {
                            var e = B.pop(),
                                s = __webpack_require__.c[e];
                            if (s) {
                                var t = {
                                },
                                    c = s.hot._disposeHandlers;
                                for (S = 0; S < c.length; S++) c[S].call(null, t);
                                for (__webpack_require__.hmrD[e] = t, s.hot.active = !1, delete __webpack_require__.c[e], delete l[e], S = 0; S < s.children.length; S++) {
                                    var i = __webpack_require__.c[s.children[S]];
                                    i && (Q = i.parents.indexOf(e)) >= 0 && i.parents.splice(Q, 1)
                                }
                            }
                        }
                        for (var b in l) if (__webpack_require__.o(l, b) && (s = __webpack_require__.c[b])) for (L = l[b], S = 0; S < L.length; S++) U = L[S],
                            (Q = s.children.indexOf(U)) >= 0 && s.children.splice(Q, 1)
                    },
                    apply: function (Q) {
                        for (var U in c) __webpack_require__.o(c, U) && (__webpack_require__.m[U] = c[U]);
                        for (var F = 0; F < B.length; F++) B[F](__webpack_require__);
                        for (var n in l) if (__webpack_require__.o(l, n)) {
                            var s = __webpack_require__.c[n];
                            if (s) {
                                L = l[n];
                                for (var t = [
                                ], i = [
                                ], b = [
                                ], g = 0; g < L.length; g++) {
                                    var d = L[g],
                                        x = s.hot._acceptedDependencies[d],
                                        I = s.hot._acceptedErrorHandlers[d];
                                    if (x) {
                                        if (- 1 !== t.indexOf(x)) continue;
                                        t.push(x),
                                            i.push(I),
                                            b.push(d)
                                    }
                                }
                                for (var a = 0; a < t.length; a++) try {
                                    t[a].call(null, L)
                                } catch (U) {
                                    if ('function' == typeof i[a]) try {
                                        i[a](U, {
                                            moduleId: n,
                                            dependencyId: b[a]
                                        })
                                    } catch (F) {
                                        e.onErrored && e.onErrored({
                                            type: 'accept-error-handler-errored',
                                            moduleId: n,
                                            dependencyId: b[a],
                                            error: F,
                                            originalError: U
                                        }),
                                            e.ignoreErrored || (Q(F), Q(U))
                                    } else e.onErrored && e.onErrored({
                                        type: 'accept-errored',
                                        moduleId: n,
                                        dependencyId: b[a],
                                        error: U
                                    }),
                                        e.ignoreErrored || Q(U)
                                }
                            }
                        }
                        for (var o = 0; o < u.length; o++) {
                            var S = u[o],
                                C = S.module;
                            try {
                                S.require(C)
                            } catch (U) {
                                if ('function' == typeof S.errorHandler) try {
                                    S.errorHandler(U, {
                                        moduleId: C,
                                        module: __webpack_require__.c[C]
                                    })
                                } catch (F) {
                                    e.onErrored && e.onErrored({
                                        type: 'self-accept-error-handler-errored',
                                        moduleId: C,
                                        error: F,
                                        originalError: U
                                    }),
                                        e.ignoreErrored || (Q(F), Q(U))
                                } else e.onErrored && e.onErrored({
                                    type: 'self-accept-errored',
                                    moduleId: C,
                                    error: U
                                }),
                                    e.ignoreErrored || Q(U)
                            }
                        }
                        return r
                    }
                }
            }
            self.webpackHotUpdate_panzoom_panzoom = (Q, F, n) => {
                for (var s in F) __webpack_require__.o(F, s) && (U[s] = F[s]);
                n && B.push(n),
                    e[Q] && (e[Q](), e[Q] = void 0)
            },
                __webpack_require__.hmrI.jsonp = function (Q, n) {
                    U || (U = {
                    }, B = [
                    ], F = [
                    ], n.push(t)),
                        __webpack_require__.o(U, Q) || (U[Q] = __webpack_require__.m[Q])
                },
                __webpack_require__.hmrC.jsonp = function (e, l, r, c, i, b) {
                    i.push(t),
                        Q = {
                        },
                        F = l,
                        U = r.reduce((function (Q, U) {
                            return Q[U] = !1,
                                Q
                        }), {
                        }),
                        B = [
                        ],
                        e.forEach((function (U) {
                            __webpack_require__.o(n, U) && void 0 !== n[U] && (c.push(s(U)), Q[U] = !0)
                        })),
                        __webpack_require__.f && (__webpack_require__.f.jsonpHmr = function (U, F) {
                            Q && !__webpack_require__.o(Q, U) && __webpack_require__.o(n, U) && void 0 !== n[U] && (F.push(s(U)), Q[U] = !0)
                        })
                },
                __webpack_require__.hmrM = () => {
                    if ('undefined' == typeof fetch) throw new Error('No browser support: need fetch API');
                    return fetch(__webpack_require__.p + __webpack_require__.hmrF()).then((Q => {
                        if (404 !== Q.status) {
                            if (!Q.ok) throw new Error('Failed to fetch update manifest ' + Q.statusText);
                            return Q.json()
                        }
                    }))
                }
        })();
    var __webpack_exports__ = __webpack_require__(846)
})();
