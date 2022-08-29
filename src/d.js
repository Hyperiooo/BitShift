// TODO try to use the scroll button to also pop up a contextual menu, do any issues arise from that?
var scroll_container = document.querySelector(".scroll_container");

var container = document.querySelector("#layer-main");

for (var i = 0; i < container.children.length; i++) {
	var el = document.createElement("div");
	el.classList.add("handle");
	el.innerText = "drag";
	container.children[i].append(el);
}

sorter = new drag_sort(container, "handle", scroll_container);

/*
         * An implementation of a drag and drop sortable list using pointer events.
        
         * The problem can be divided into a number of distinct problems, which are
         * represented in the structure of the code:
         *
         * - Handling of pointer events
         * - Render loop
         * - State management of the floating item
         * - Calculating where the new position of the floating item is in the list after moving
         * - Handling of the list, and drawing a gap under the floating item
         * - Handling of scrolling the list when the item is close to the top or bottom of the scrollable area
         */

function drag_sort(container, handle_class, scroll_element = null) {
	if (scroll_element === null) scroll_element = window;

	/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
             * Globals
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
	this.enabled = true;
	var ths = this;

	// As we support dragging elements within a scrollable sub element and not only the window,
	// we need to store the top of the container so our position calculations will be correct
	const scroll_element_top =
		scroll_element !== window ? scroll_element.getBoundingClientRect().top : 0;

	// Is the user currently dragging anything? Used to prevent multiple
	// items being dragged at the same time
	var dragging = false;

	// This structure stores data about the element which is currently being dragged
	var dragging_element = {
		it: null,
		bbox: null,
		index: null,

		// Used to store the state of styles before dragging started so we can restore them
		z_index: "",
		position: "",
		transform: "",
		style_width: "",

		// =============
		container_padding: "",
	};

	// Used to transfer the cursor position from the event to the render loop
	var last_client_y;

	// Request animation frame is used to sync our updates with the browser. This stores the ID of the
	// last animation frame request so we can cancel it when the user drops the item they are dragging
	var raf;

	// Stores a structure used to calculate element intersections, including
	// which item the dragging item is hovering over, and which items are
	// currently visible so we don't waste time updating off screen elements
	var intersection_structure = [];

	// The per portion of the top and bottom of the scrollable area, which should
	// cause the screen to scroll if the dragged item is dragged into that area
	const scroll_trigger_area_ratio = 0.3;

	// Used to store the sizes of the trigger area, which may be smaller than expected
	// as we compensate so that dragging an item in the scroll area does not cause the
	// screen to scroll immediately. Explained in scroll handing section
	var scroll_trigger_area_top, scroll_trigger_area_bottom;

	// =======================================================================================
	// Section implementing pointer event handling. All event handlers are attached to
	// the container, as we are using event delegation
	// =======================================================================================
	container.addEventListener("pointerdown", userPressed, {
		passive: true,
	});

	/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
             * When dragging starts, we prepare the item for dragging, and draw a
             * gap in the list at the starting location. We also attach events
             * to register when the dragged item moves, and when dragging ends
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
	function userPressed(event) {
		console.log("start");

		console.log(ths.enabled);

		if (!ths.enabled) return;

		var drag_handle = event.target;
		if (!drag_handle.classList.contains(handle_class)) return;

		// Find the actual dragging element from the handle
		var target_element = drag_handle;

		while (true) {
			if (target_element.parentElement === container) break;
			target_element = target_element.parentElement;
		}

		function init_dragging() {
			if (dragging) return;
			dragging = true;

			// Store the current positions of all items for intersection detection
			init_intersection_state();

			// Init the floating item
			init_floating_item(target_element, event.clientY);

			// Attach events
			container.addEventListener("pointermove", userMoved, { passive: true });
			container.addEventListener("pointerup", userReleased, { passive: true });
			container.addEventListener("pointercancel", userReleased, {
				passive: true,
			});
			container.addEventListener("pointerleave", userReleased);

			beginScroll(event.clientY);
			begin_render_loop(event.clientY);

			container.classList.add("active");
		}

		timed_start(container, event.clientX, event.clientY, 400, init_dragging);
	}

	/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
             * Store Y position for the animation loop
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
	function userMoved(event) {
		console.log("move");

		last_client_y = event.clientY;
	}

	/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
             * When the item being dragged is dropped, it gets inserted back into
             * the list in the correct location, and its styles are restored
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
	function userReleased(event) {
		console.log("end");

		container.classList.remove("active");

		end_render_loop();

		container.removeEventListener("pointermove", userMoved);
		container.removeEventListener("pointerup", userReleased);
		container.removeEventListener("pointercancel", userReleased);
		container.removeEventListener("pointerleave", userReleased);

		restore_floating_item(event.clientY);

		dragging = false;
	}

	// =======================================================================================
	// Section implementing render loop for updating elements. Request animation
	// frame API is used to synchronise with the browsers internal render loop. Nothing
	// complex here, last_client_y is initialised before movement events happen so
	// the dragged item doesn't jump suddenly when dragging starts.
	// =======================================================================================
	function begin_render_loop(client_y) {
		last_client_y = client_y;
		main_render_loop();
	}

	// ==========
	function main_render_loop() {
		translate_floating_item(last_client_y);
		update_scroll(last_client_y);

		raf = requestAnimationFrame(main_render_loop);
	}

	// ==========
	function end_render_loop() {
		cancelAnimationFrame(raf);
	}

	// =======================================================================================
	// Section implementing handling and transforming floating item
	// =======================================================================================

	/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
             * initialises the state of the floating item. Caches the items
             * existing styles so that they can be restored when dragging ends.
             * and sets styles to make it float over other items.
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
	function init_floating_item(target, client_y) {
		dragging_element.it = target;
		dragging_element.bbox = dragging_element.it.getBoundingClientRect();
		dragging_element.offset = dragging_element.bbox.top - client_y;
		dragging_element.index = Array.prototype.indexOf.call(
			dragging_element.it.parentNode.children,
			dragging_element.it
		);

		// Make the dragging element float over other elements, storing the
		// original styles so they can be restored later
		dragging_element.z_index = dragging_element.it.style["z-index"];
		dragging_element.position = dragging_element.it.style["position"];
		dragging_element.transform = dragging_element.it.style["transform"];
		dragging_element.style_width = dragging_element.it.style["width"];
		dragging_element.it.style["z-index"] = 500;
		dragging_element.it.style["position"] = "fixed";
		dragging_element.it.style["top"] = "0px";
		dragging_element.it.style["width"] = dragging_element.bbox.width + "px";
		dragging_element.it.classList.add("currently_dragging");

		// Translate the floating item and draw a gap in the list for it
		translate_floating_item(client_y);

		// As the floating item is removed from the flow, add padding to  the
		// container so its height remains the same
		dragging_element.container_padding = container.style["padding-bottom"];
		container.style["padding-bottom"] =
			"" + dragging_element.bbox.height + "px";
	}

	/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
             * Apply a transform to the floating element, and draw a gap below it.
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
	function translate_floating_item(client_y) {
		var current_scroll = get_scroll();

		var element_position = client_y + dragging_element.offset;

		dragging_element.it.style.transform =
			"translate3d(0px," + element_position + "px, 0px)";

		// ======================
		draw_gap(
			calculate_list_index(client_y + current_scroll),
			dragging_element.bbox.height
		);
	}

	/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
             * Once the item has been dragged to its final location, we restore
             * it to it's original state, and update the DOM to insert the item in
             * the new location
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
	function restore_floating_item(last_client_y) {
		// Restore styles
		dragging_element.it.style["z-index"] = dragging_element.z_index;
		dragging_element.it.style["position"] = dragging_element.position;
		dragging_element.it.style["transform"] = dragging_element.transform;
		dragging_element.it.style["width"] = dragging_element.style_width;
		dragging_element.it.classList.remove("currently_dragging");
		clear_gap();

		// Put the previously floating item back in the DOM
		move_item_to(
			dragging_element,
			calculate_list_index(last_client_y + get_scroll())
		);

		// Restore container padding
		container.style["padding-bottom"] = container.style["padding-bottom"];
	}

	// =======================================================================================
	// Section implementing intersection detection
	// =======================================================================================

	/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
             * When dragging begins, after the list has been initialised, we need
             * to store the positions of the items in the list in order to calculate
             * which item the floating item is hovering over. This data cached at the
             * beginning instead of getting it every animation frame for
             * performance reasons.
             *       
             * The data is put into a data structure that is essentially a b-tree
             * with branching factor 32, however it only ever has 1 root node,
             * and the root element may contain more than 32 items, so performance
             * will degrade linearly at that point.
             *
             * In practice it's good enough as the structure can contain 1024 items
             * (32 times 32) before performance would degrade at all. This should
             * be adequate, as a drag and drop list with thousands of items would
             * be cumbersome to use anyway.
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
	function init_intersection_state() {
		var current_scroll = get_scroll();

		sortable_items = [];

		var children = container.children;

		// We average the bottom of each element with the top of the previous one,
		// to end up with the mid-point of element margins, without having to read them.

		var previous_bottom = null;
		for (var i = 0; i < children.length; i++) {
			var rect = children[i].getBoundingClientRect();

			if (i == 0) {
				sortable_items.push(rect.top + current_scroll);
				previous_bottom = rect.bottom + current_scroll;
			} else if (i == children.length - 1) {
				var this_top = rect.top + current_scroll;
				var avarage_top = (previous_bottom + this_top) / 2;
				sortable_items.push(avarage_top);
				sortable_items.push(rect.bottom + current_scroll);
			} else {
				var this_top = rect.top + current_scroll;
				var avarage_top = (previous_bottom + this_top) / 2;
				sortable_items.push(avarage_top);
				previous_bottom = rect.bottom + current_scroll;
			}
		}

		// Put the data in a shallow tree for faster searching
		intersection_structure = [];

		var chunk = [];
		for (var i = 0; i < sortable_items.length; i++) {
			chunk.push(sortable_items[i]);
			if (chunk.length == 33) {
				intersection_structure.push(chunk[0]);
				intersection_structure.push(chunk);
				chunk = [sortable_items[i]];
			}
		}

		if (chunk.length > 1) {
			intersection_structure.push(chunk[0]);
			intersection_structure.push(chunk);
		}

		intersection_structure.push(chunk[chunk.length - 1]);
	}

	this.init_intersection_state = init_intersection_state;

	/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
             * Calculates a list index given a pixel Y coordinate in list space
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
	function calculate_list_index(y_in_list_space) {
		// If pointer is above the sortable area, this clamps it to the first item
		var list_index = 0;

		// Clamp to last item if the pointer is below the sortable area
		if (
			y_in_list_space >=
			intersection_structure[intersection_structure.length - 1]
		) {
			list_index = container.children.length - 1;

			// Handle coordinate when it  is within sortable area
		} else {
			for (var i = 1; i < intersection_structure.length; i += 2) {
				if (
					y_in_list_space >= intersection_structure[i - 1] &&
					y_in_list_space < intersection_structure[i + 1]
				) {
					for (var ii = 0; ii < intersection_structure[i].length; ii++) {
						if (
							y_in_list_space >= intersection_structure[i][ii] &&
							y_in_list_space < intersection_structure[i][ii + 1]
						) {
							list_index = ((i - 1) / 2) * 32 + ii;
							break;
						}
					}
				}
			}
		}

		return list_index;
	}

	// =======================================================================================
	// Section implementing manipulation of the list
	// =======================================================================================

	/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
             * Draws a gap in the list representing where the floating item will
             * be inserted when the user drops it. I tried implementing this
             * using several methods of direct DOM manipulations initially,
             * redrawing the whole list every frame, swapping adjacent elements,
             * and inserting a 'gap element' at an index, but they all resulted in
             * visual jitter or were too slow.
             *
             * The most reliable approach seems to be to leave the DOM structure
             * alone. Make the dragging element float by fixed positioning
             * it, and create a gap in the list using the transform translate
             * CSS feature.
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
	var debug = document.createElement("div");
	document.body.appendChild(debug);

	function draw_gap(position, size) {
		debug.innerText = "" + position;

		// For performance, we only apply translation to the area of the list
		// which is actually in the viewport. We transform a few items after
		// the visible area to give CSS transitions chance to complete outside
		// of the viewport to reduce chance of visual artifacts showing
		var first_visible = calculate_list_index(scroll_element_top + get_scroll());
		var last_visible = calculate_list_index(
			scroll_element_top + get_scrollable_area() + get_scroll()
		);

		var last_visible_raw = last_visible;
		last_visible += 10;

		if (last_visible > container.children.length - 1) {
			last_visible = container.children.length - 1;
		}

		// Apply the transforms to the items in the visible window.
		for (var i = first_visible; i < last_visible + 1; i++) {
			var it = container.children[i];

			// The dom element that is being dragged requires special handling. It is
			// logically still in the dom, but essentially isn't due to the transforms.
			// We need to skip this element when applying transforms, and the position
			// of following items need to be treated as if they were in the previous slot
			var fix_position = i >= dragging_element.index ? 1 : 0;

			if (i === dragging_element.index) {
				continue;
			} else if (i < Math.floor(position + fix_position)) {
				it.style.transform = "";
			} else {
				it.style.transform = "translate3d(0px," + size + "px, 0px)";
			}
		}
	}

	/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
             * Clears any gap previously inserted by draw_gap by resetting the
             * transform property.
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
	function clear_gap() {
		for (var i = 0; i < container.children.length; i++) {
			var it = container.children[i];
			it.style.transform = "";
		}
	}

	/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
             * As updating the DOM in real time was causing visual jitter, the
             * change is applied only once when the user finally drops the element
             * they were dragging.
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
	function move_item_to(item, list_index) {
		// This is explained in draw_gap
		list_index = list_index + (list_index >= item.index ? 1 : 0);

		console.log(list_index);

		if (list_index == 0) {
			container.prepend(item.it);
		} else {
			container.children[list_index - 1].after(item.it);
		}
	}

	// =======================================================================================
	// Section implementing scroll handling
	// =======================================================================================

	/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
             * Get the height of the scrollable element in screen space
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
	function get_scrollable_area() {
		if (scroll_element === window) {
			console.log("a");
			return document.documentElement.clientHeight;
		} else {
			return scroll_element.getBoundingClientRect().height;
		}
	}

	/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
             * Get the current scroll position of the scrollable element
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
	function get_scroll() {
		if (scroll_element === window) {
			return scroll_element.scrollY;
		} else {
			return scroll_element.scrollTop;
		}
	}

	/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
             * When the user moves an item to the edge of the scrollable area, we
             * want to scroll  the area up or down to allow them to put the
             * element in the desired location. This area is called the scroll
             * trigger area.
             *
             * However, if the user picks up an element that is already in the
             * scroll trigger area, we don't want the list to suddenly start
             *  scrolling, as this is annoying. Thus, we reduce the scroll trigger
             * area to the distance between the current cursor position, and
             * edge of the scroll area.
             *
             * Moving the cursor towards the edge of the scrollable area causes
             * the list to scroll, and moving it away expands the scroll trigger
             * area up to a maximum value.
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
	function beginScroll(cursor_y) {
		var relative_cursor_y = cursor_y - scroll_element_top;

		height = get_scrollable_area();
		var max_scroll_trigger_area = height * scroll_trigger_area_ratio;

		scroll_trigger_area_top = max_scroll_trigger_area;
		scroll_trigger_area_bottom = max_scroll_trigger_area;

		if (relative_cursor_y < max_scroll_trigger_area) {
			scroll_trigger_area_top = relative_cursor_y;
		}

		if (relative_cursor_y > height - max_scroll_trigger_area) {
			scroll_trigger_area_bottom = height - relative_cursor_y;
		}
	}

	/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
             * Scroll the scrollable element When the pointer is near the top
             * or bottom edge
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
	function update_scroll(cursor_y) {
		var relative_cursor_y = cursor_y - scroll_element_top;

		var height = get_scrollable_area();
		var max_scroll_trigger_area = height * scroll_trigger_area_ratio;

		// If cursor moves away from the edge, increase scroll trigger area if needed
		var new_trigger_area_top = relative_cursor_y;
		var new_trigger_area_bottom = height - relative_cursor_y;

		if (
			new_trigger_area_top <= max_scroll_trigger_area &&
			new_trigger_area_top > scroll_trigger_area_top
		) {
			scroll_trigger_area_top = new_trigger_area_top;
		}

		if (
			new_trigger_area_bottom <= max_scroll_trigger_area &&
			new_trigger_area_bottom > scroll_trigger_area_bottom
		) {
			scroll_trigger_area_bottom = new_trigger_area_bottom;
		}

		// Restore position if cursor moves up
		if (relative_cursor_y < scroll_trigger_area_top) {
			should_scroll_by = (relative_cursor_y - scroll_trigger_area_top) * 0.07;
		} else if (relative_cursor_y > height - scroll_trigger_area_bottom) {
			should_scroll_by =
				(relative_cursor_y - (height - scroll_trigger_area_bottom)) * 0.07;
		} else {
			should_scroll_by = 0;
		}

		scroll_element.scrollBy(0, should_scroll_by);
	}

	// =======================================================================================
	// Utility functions
	// =======================================================================================

	/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
             * Require the user to hold the drag handle for a given period before
             * dragging begins, used to prevent unintended reordering of content.
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
	function timed_start(
		event_target,
		start_x,
		start_y,
		delay,
		continue_callback
	) {
		console.log(delay);

		// Require the user to hold the scroll trigger for some time before it will move
		var cancel_action = false;

		function set_cancel() {
			cancel_action = true;
		}

		event_target.addEventListener("pointerup", set_cancel);
		event_target.addEventListener("pointercancel", set_cancel);
		event_target.addEventListener("pointerleave", set_cancel);

		var end_x = start_x;
		var end_y = start_y;

		function update_movement(e) {
			end_x = e.clientX;
			end_y = e.clientY;
		}

		event_target.addEventListener("pointermove", update_movement);

		// Require the user to hold the scroll trigger for some time before it will move
		setTimeout(function () {
			event_target.removeEventListener("pointerup", set_cancel);
			event_target.removeEventListener("pointercancel", set_cancel);
			event_target.removeEventListener("pointerleave", set_cancel);
			event_target.removeEventListener("pointermove", update_movement);

			if (
				!cancel_action &&
				Math.abs(start_x - end_x) < 5 &&
				Math.abs(start_y - end_y) < 5
			) {
				console.log("here");

				continue_callback();
			}
		}, delay);
	}
}
