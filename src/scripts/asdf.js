function zoomWithWheel(event, zoomOptions) {
	// Need to prevent the default here
	// or it conflicts with regular page scroll
	event.preventDefault();
	var opts = __assign(__assign({}, options), zoomOptions);
	// Normalize to deltaX in case shift modifier is used on Mac
	var delta = event.deltaY === 0 && event.deltaX ? event.deltaX : event.deltaY;
	var wheel = delta < 0 ? 1 : -1;
	var toScale = constrainScale(scale * Math.exp((wheel * opts.step) / 3), opts).scale;
	return zoomToPoint(toScale, event, opts);
}

function zoomToPoint(toScale, point, zoomOptions, originalEvent) {
	var dims = getDimensions(elem);
	// Instead of thinking of operating on the panzoom element,
	// think of operating on the area inside the panzoom
	// element\'s parent
	// Subtract padding and border
	var effectiveArea = {
		width: dims.parent.width - dims.parent.padding.left - dims.parent.padding.right - dims.parent.border.left - dims.parent.border.right,
		height: dims.parent.height - dims.parent.padding.top - dims.parent.padding.bottom - dims.parent.border.top - dims.parent.border.bottom
	};
	// Adjust the clientX/clientY to ignore the area
	// outside the effective area
	var clientX = point.clientX - dims.parent.left - dims.parent.padding.left - dims.parent.border.left - dims.elem.margin.left;
	var clientY = point.clientY - dims.parent.top - dims.parent.padding.top - dims.parent.border.top - dims.elem.margin.top; 
	// Adjust the clientX/clientY for HTML elements,
	// because they have a transform-origin of 50% 50%
	if (!isSVG) {
		clientX -= dims.elem.width / scale / 2;
		clientY -= dims.elem.height / scale / 2;
	}
	// Convert the mouse point from it\'s position over the
	// effective area before the scale to the position
	// over the effective area after the scale.
	var focal = {
		x: (clientX / effectiveArea.width) * (effectiveArea.width * toScale),
		y: (clientY / effectiveArea.height) * (effectiveArea.height * toScale)
	};
	return zoom(toScale, __assign(__assign({ animate: false }, zoomOptions), { focal: focal }), originalEvent);
}