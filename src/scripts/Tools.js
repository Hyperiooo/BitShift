var Tools = {
	pen: false,
	eraser: false,
	fillBucket: false,
	line: false,
	ellipse: false,
	rectangle: false,
	filledEllipse: false,
	filledRectangle: false,
	sprayPaint: false,
	eyedropper: false,
	rectangleMarquee: false,
	ellipseMarquee: false,
	freehandSelect: false,
	magicWand: false,
	transform: false,
};
previousTool = "pen";

var ToolParams = {
	pen: {
		name: "pen",
		id: "tool-btn-pen",
		icon: "hi-pencil",
		action: "setTool('pen')",
	},
	eraser: {
		name: "eraser",
		id: "tool-btn-eraser",
		icon: "hi-eraser",
		action: "setTool('eraser')",
	},
	fillBucket: {
		name: "fillBucket",
		id: "tool-btn-fillBucket",
		icon: "hi-fill",
		action: "setTool('fillBucket')",
	},
	line: {
		name: "line",
		id: "tool-btn-line",
		icon: "hi-line",
		action: "setTool('line')",
	},
	ellipse: {
		name: "ellipse",
		id: "tool-btn-ellipse",
		icon: "hi-circle-line",
		action: "setTool('ellipse')",
	},
	rectangle: {
		name: "rectangle",
		id: "tool-btn-rectangle",
		icon: "hi-square-line",
		action: "setTool('rectangle')",
	},
	filledEllipse: {
		name: "filledEllipse",
		id: "tool-btn-filledEllipse",
		icon: "hi-circle-fill",
		action: "setTool('filledEllipse')",
	},
	filledRectangle: {
		name: "filledRectangle",
		id: "tool-btn-filledRectangle",
		icon: "hi-square-fill",
		action: "setTool('filledRectangle')",
	},
	sprayPaint: {
		name: "sprayPaint",
		id: "tool-btn-sprayPaint",
		icon: "hi-spray",
		action: "setTool('sprayPaint')",
	},
	rectangleMarquee: {
		name: "rectangleMarquee",
		id: "tool-btn-rectangleMarquee",
		icon: "hi-marquee",
		actionMenu: "selection",
		action: "setTool('rectangleMarquee')",
	},
	ellipseMarquee: {
		name: "ellipseMarquee",
		id: "tool-btn-ellipseMarquee",
		icon: "hi-circle-marquee",
		actionMenu: "selection",
		action: "setTool('ellipseMarquee')",
	},
	freehandSelect: {
		name: "freehandSelect",
		id: "tool-btn-freehandSelect",
		icon: "hi-lasso-line",
		actionMenu: "selection",
		action: "setTool('freehandSelect')",
	},
	magicWand: {
		name: "magicWand",
		id: "tool-btn-magicWand",
		icon: "hi-magic-wand-line",
		actionMenu: "selection",
		action: "setTool('magicWand')",
	},
	transform: {
		name: "transform",
		id: "tool-btn-transform",
		icon: "hi-move",
		actionMenu: "transform",
		action: "setTool('transform'); showBoundingBox(); prepareTransform()",
	},
};

var ToolbarAssignments = [
	{
		type: "multiple",
		name: "drawing",
		default: "pen",
		tools: ["pen", "sprayPaint"],
	},
	{
		type: "single",
		tool: "eraser",
	},
	{
		type: "single",
		tool: "fillBucket",
	},
	{
		type: "multiple",
		name: "shapes",
		default: "ellipse",
		tools: ["ellipse", "rectangle", "filledEllipse", "filledRectangle", "line"],
	},
	{ type: "single", tool: "transform" },
	{
		type: "multiple",
		name: "selection",
		default: "rectangleMarquee",
		tools: [
			"rectangleMarquee",
			"ellipseMarquee",
			"freehandSelect",
			"magicWand",
		],
	},
];

var ToolbarActionMenus = {
	universal: [
		{
			name: "Deselect",
			action: "deselect()",
			icon: "hi-x",
			condition: () => {
				return isSelected() || ToolParams[getTool()].actionMenu == "selection";
			},
		},
	],
	transform: [
		{
			name: "Confirm",
			action: "confirmTransform(); setTool(previousTool)",
			icon: "hi-check",
		},
		{
			name: "Flip Horizontal",
			action: "flipHorizontal()",
			icon: "hi-flip-horizontal-line",
		},
		{
			name: "Flip Vertical",
			action: "flipVertical()",
			icon: "hi-flip-vertical-line",
		},
		{
			name: "Rotate Left",
			action: "rotateLeft()",
			icon: "hi-rotate-left-line",
		},
		{
			name: "Rotate Right",
			action: "rotateRight()",
			icon: "hi-rotate-right-line",
		},
		{
			name: "Reset Transform",
			action: "resetTransform()",
			icon: "hi-undo",
		},
	],
	selection: [
		{
			name: "Invert",
			action: "invertSelection()",
			icon: "hi-invert-line",
		},
		{
			name: "Cut",
			action: "cutSelection()",
			icon: "hi-scissors-line",
		},
		{
			name: "Copy",
			action: "copySelection()",
			icon: "hi-copy-line",
		},
		{
			name: "Paste",
			action: "pasteSelection()",
			icon: "hi-paste-line",
		},
	],
};

var toolPopInstances = {};

function createToolUI() {
	var wrapper = document.getElementById("dynamic-tool-wrap");
	ToolbarAssignments.forEach((t) => {
		if (t.type == "single") {
			wrapper.innerHTML += `
            <span id="${ToolParams[t.tool].id}" data-tool-name="${
				ToolParams[t.tool].name
			}" class="item" onclick="${ToolParams[t.tool].action}"><i
            class="${ToolParams[t.tool].icon}"></i></span>`;
		} else if (t.type == "multiple") {
			wrapper.innerHTML += `
            <span data-multiple-tool-name="${t.name}" id="${
				ToolParams[t.default].id
			}" 
            data-tool-name="${ToolParams[t.default].name}"
            class="item tool-multiple" onclick="${
							ToolParams[t.default].action
						}"><i
            class="${ToolParams[t.default].icon}"></i></span>
            `;

			var dummyDiv = `<div id='tool-popup-${t.name}' class='tool-popup ui'>`;

			t.tools.forEach((tl) => {
				var tool = ToolParams[tl];
				dummyDiv += `<span data-multiple-tool-parent="${t.name}" id="${tool.id}"
                data-tool-name="${tool.name}"
                class="item" onclick="setPopupTool('${t.name}','${tool.name}')"><i
                class="${tool.icon}"></i></span>`;
			});

			dummyDiv += `</div>`;
			wrapper.innerHTML += dummyDiv;
			setTimeout(() => {
				var button = document.querySelector(
					`[data-multiple-tool-name="${t.name}"]`
				);
				var popup = document.querySelector(`#tool-popup-${t.name}`);

				toolPopInstances[t.name] = Popper.createPopper(button, popup, {
					placement: "left",
					modifiers: [
						{
							name: "offset",
							options: {
								offset: [0, 10],
							},
						},
						{
							name: "preventOverflow",
							options: {
								padding: 55,
							},
						},
					],
				});
				button.onmousedown = (e) => {
					detectToolLongPress(e, popup, toolPopInstances[t.name]);
				};

				button.ontouchstart = (e) => {
					detectToolLongPress(e, popup, toolPopInstances[t.name]);
				};

				button.onmouseup = (e) => {
					cancelToolLongPress(e);
				};

				button.ontouchend = (e) => {
					cancelToolLongPress(e);
				};
			}, 1);
		}
	});
}

var toolHoldTimeout;

function detectToolLongPress(e, popup, instance) {
	toolHoldTimeout = setTimeout(() => {
		closeAllToolPopups();
		popup.setAttribute("data-show", "");
		instance.update();
	}, 500);
}

function cancelToolLongPress(e, el) {
	clearTimeout(toolHoldTimeout);
}

function closeAllToolPopups() {
	document.querySelectorAll(".tool-popup").forEach((e) => {
		e.removeAttribute("data-show");
	});
}

function updateToolSettings(tool) {
	var toolContent = document.getElementById("tool-settings-content");
	let toolSettings = settings.tools.assignments[tool];
	toolContent.innerHTML = "";
	if (!toolSettings) return;
	for (let i = 0; i < toolSettings.length; i++) {
		const element = toolSettings[i];
		const setting = settings.tools[element];
		if (setting.type == "int") {
			let inputGroup = document.createElement("span");
			inputGroup.classList.add("tool-settings-ui-input-group");
			let inputTitle = document.createElement("p");
			inputTitle.classList.add("tool-settings-ui-input-title");
			inputTitle.innerHTML = setting.title;
			let inputWrap = document.createElement("div");
			inputWrap.classList.add("tool-settings-ui-input-wrap");
			let inputField = document.createElement("div");
			inputField.classList.add("tool-settings-ui-input-field");
			inputWrap.appendChild(inputField);
			let inputElement = document.createElement("input");
			inputElement.setAttribute("data-input-filter", "true");
			inputElement.min = setting.min;
			inputElement.max = setting.max;
			if (setting.draggable)
				inputElement.setAttribute("data-input-num-draggable", "true");
			inputElement.classList.add("tool-settings-ui-input-num");
			inputElement.onchange = "console.log('a')";
			inputElement.oninput = (e) => {
				setting.callback(inputElement);
			};
			inputElement.type = "number";
			inputElement.value = setting.value;
			if (setting.unit) {
				let inputUnit = document.createElement("p");
				inputUnit.classList.add("tool-settings-ui-input-unit");
				inputUnit.innerHTML = setting.unit;
				inputField.appendChild(inputUnit);
			}
			inputField.appendChild(inputElement);
			inputGroup.appendChild(inputTitle);
			inputGroup.appendChild(inputWrap);
			toolContent.appendChild(inputGroup);
			inputElement.max = setting.max;
			inputElement.min = setting.min;
			inputElement.setAttribute("data-input-num-unit", setting.unit);
			refreshAllNumberDraggables();
		} else if (setting.type == "bool") {
			let inputGroup = document.createElement("span");
			inputGroup.classList.add("tool-settings-ui-input-group");
			let inputTitle = document.createElement("p");
			inputTitle.classList.add("tool-settings-ui-input-title");
			inputTitle.innerHTML = setting.title;
			let inputWrap = document.createElement("div");
			inputWrap.classList.add("tool-settings-ui-input-wrap");
			let inputField = document.createElement("div");
			inputField.classList.add("tool-settings-ui-input-field");
			inputWrap.appendChild(inputField);
			let inputElement = document.createElement("input");
			inputElement.classList.add("tool-settings-ui-input-check");
			inputElement.oninput = (e) => {
				setting.callback(inputElement);
			};
			inputElement.type = "checkbox";
			if (setting.value) inputElement.setAttribute("checked", "");
			let inputCheck = document.createElement("span");
			inputCheck.classList.add("checkmark");
			inputField.appendChild(inputElement);
			inputField.appendChild(inputCheck);
			inputGroup.appendChild(inputTitle);
			inputGroup.appendChild(inputWrap);
			toolContent.appendChild(inputGroup);
		} else if (setting.type == "iconArray") {
			let inputGroup = document.createElement("span");
			inputGroup.classList.add("tool-settings-ui-input-group");
			let inputWrap = document.createElement("div");
			inputWrap.classList.add("tool-settings-ui-input-wrap");
			let inputField = document.createElement("div");
			inputField.classList.add("tool-settings-ui-input-field");
			inputWrap.appendChild(inputField);
			setting.values.forEach((e) => {
				let wrap = document.createElement("button");
				wrap.classList.add("input-group-item");
				if (setting.value == e.name) wrap.classList.add("tool-active");
				wrap.id = `input-button-${e.name}`;
				let icon = document.createElement("i");
				icon.classList.add(e.icon);
				wrap.onclick = (ev) => {
					e.callback(wrap);
				};
				wrap.appendChild(icon);
				inputField.appendChild(wrap);
			});
			inputGroup.appendChild(inputWrap);
			toolContent.appendChild(inputGroup);
		}
	}
}

function setTool(tool, el) {
	var toolbarFound = false;
	if (Tools.transform) {
		confirmTransform();
	}
	if (tool == getTool()) {
		ToolbarAssignments.forEach((e) => {
			if (e.tools) {
				if (e.tools.includes(tool)) {
					//notify.log(e.name);
					var popup = document.querySelector(`#tool-popup-${e.name}`);
					var instance = toolPopInstances[e.name];
					closeAllToolPopups();
					popup.setAttribute("data-show", "");
					instance.update();
					toolbarFound = true;
				}
			}
		});
	}
	if (toolbarFound) return;
	hideBoundingBox();
	closeAllToolPopups();
	Object.keys(Tools).forEach((v) => (Tools[v] = false));

	updateToolSettings(tool);

	Tools[tool] = true;
	curCursor = settings.cursors[tool] || "crosshair";
	updateCursor();
	document.querySelectorAll("#toolbar .item").forEach((x) => {
		x.classList.remove("tool-active");
	});

	document.querySelectorAll(`[data-tool-name="${tool}"]`).forEach((e) => {
		e.classList.add("tool-active");
	});
	attemptActionMenu(tool);
}
function attemptActionMenu(tool) {
	var shouldActionMenuBeShown = false;
	ToolbarActionMenus["universal"].forEach((e) => {
		if (e.condition()) {
			shouldActionMenuBeShown = true;
		}
	});
	if (ToolParams[tool].actionMenu) shouldActionMenuBeShown = true;
	if (shouldActionMenuBeShown) {
		document
			.querySelector("#actionButtons")
			.classList.remove("actionButtonsHidden");
		createActionMenu(
			ToolbarActionMenus[ToolParams[tool].actionMenu] || "noAction"
		);
	} else {
		document
			.querySelector("#actionButtons")
			.classList.add("actionButtonsHidden");
	}
}
function createActionMenu(menu) {
	var actionMenu = document.getElementById("actionButtons");
	actionMenu.innerHTML = "";
	var universal = false;
	ToolbarActionMenus["universal"].forEach((e) => {
		if (e.condition()) {
			actionMenu.innerHTML += `<button class="actionButton" onclick="${e.action}">
			<i class="${e.icon}"></i>
			${e.name}</button>`;
			universal = true;
		}
	});
	if (universal && menu != "noAction") {
		actionMenu.innerHTML += `<div class="actionButtonDivider"></div>`;
	}
	if (!menu.forEach) return;
	menu.forEach((e) => {
		actionMenu.innerHTML += `<button class="actionButton" onclick="${e.action}">
		<i class="${e.icon}"></i>
		${e.name}</button>`;
	});
}
//find true in Tools
function getTool() {
	return Object.keys(Tools).find((key) => Tools[key]);
}

function setPopupTool(set, tool) {
	var toolParent = document.querySelector(`[data-multiple-tool-name="${set}"]`);
	toolParent.id = ToolParams[tool].id;
	toolParent.setAttribute("data-tool-name", ToolParams[tool].name);
	toolParent.setAttribute("onclick", ToolParams[tool].action);
	toolParent.firstChild.className = ToolParams[tool].icon;
	var fn = new Function("return " + ToolParams[tool].action);
	fn();
}

function compileForEyedropper() {
	var eyedropperPreviewCanvas = document.getElementById(
		"eyedropperPreviewCanvas"
	);
	eyedropperPreviewCanvas.width = project.width;
	eyedropperPreviewCanvas.height = project.height;
	var eCtx = eyedropperPreviewCanvas.getContext("2d");
	eCtx.clearRect(0, 0, project.width, project.height);
	eCtx.globalCompositeOperation = "source-over";
	eCtx.imageSmoothingEnabled = false;
	eCtx.drawImage(canvasInterface.bggridcanvas, 0, 0);
	var reversed = [...layers].reverse();
	reversed.forEach((e) => {
		if (e.settings.visible) eCtx.drawImage(e.canvasElement, 0, 0);
	});
}
