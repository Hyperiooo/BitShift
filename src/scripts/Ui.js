let vh = window.innerHeight;
let vw = window.innerWidth;
document.documentElement.style.setProperty("--vh", `${vh}px`);
document.documentElement.style.setProperty("--vw", `${vw}px`);
window.addEventListener("resize", () => {
	vh = window.innerHeight;
	vw = window.innerWidth;
	document.documentElement.style.setProperty("--vh", `${vh}px`);
	document.documentElement.style.setProperty("--vw", `${vw}px`);
	hueRect = hueRange.getBoundingClientRect();
	valueRect = valueRange.getBoundingClientRect();
});

let debug;

var Themes = {
	light: "ui-theme-light",
	dark: "ui-theme-dark",
	black: "ui-theme-black",
	system: "ui-theme-system-default",
};
var Accents = {
	red: "ui-accent-red",
	orange: "ui-accent-orange",
	green: "ui-accent-green",
	blue: "ui-accent-blue",
	purple: "ui-accent-purple",
	pink: "ui-accent-pink",
	gray: "ui-accent-gray",
};
function setTheme(themeName) {
	localStorage.setItem("theme", themeName);
	//activate the button with pattern of theme-*-button to match the theme
	document.querySelectorAll(".theme-button").forEach((e) => {
		e.classList.remove("window-btn-imp");
		if (e.id == themeName) {
			e.classList.add("window-btn-imp");
		}
	});
	if (themeName === "ui-theme-system-default") {
		//see what the system theme is
		var systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
		if (systemTheme) {
			themeName = Themes.dark;
		} else {
			themeName = Themes.light;
		}
	}
	//remove other themes from document
	document.documentElement.classList.remove(Themes.light);
	document.documentElement.classList.remove(Themes.dark);

	document.documentElement.classList.add(themeName);
	document
		.querySelector('meta[name="theme-color"]')
		.setAttribute(
			"content",
			getComputedStyle(document.documentElement).getPropertyValue(
				"--bg200"
			)
		);
	document
		.querySelector('meta[name="apple-mobile-web-app-status-bar"]')
		.setAttribute(
			"content",
			getComputedStyle(document.documentElement).getPropertyValue(
				"--bg200"
			)
		);
	document
		.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
		.setAttribute(
			"content",
			getComputedStyle(document.documentElement).getPropertyValue(
				"--bg200"
			)
		);
}
function setAccent(accentName) {
	localStorage.setItem("accent", accentName);
	//activate the button with pattern of theme-*-button to match the theme
	document.querySelectorAll(".accent-button").forEach((e) => {
		e.classList.remove("window-btn-imp");
		if (e.id == accentName) {
			e.classList.add("window-btn-imp");
		}
	});
	//remove other accents
	for (var key in Accents) {
		document.documentElement.classList.remove(Accents[key]);
	}
	document.documentElement.classList.add(accentName);
}

window
	.matchMedia("(prefers-color-scheme: dark)")
	.addEventListener("change", function (e) {
		if (localStorage.theme == "ui-theme-system-default") {
			setTheme(Themes.system);
		}
	});

var draggableNumInputs = [];

class numberDraggable {
	constructor(el, numpad) {
		this.do = false;
		this.startP = 0;
		this.el = el;
		this.direction = this.el.getAttribute("data-input-num-draggable-vertical")
			? true
			: false;
		this.startVal = this.el.value;
		self = this;
		this.rawValue = this.el.value;
		this.startEffectPosition = 0;
		this.pointerDown = function (e) {
			if (isMobile) e.preventDefault();
			e.stopPropagation();
			this.do = true;
			this.startP = this.direction ? e.clientY : e.clientX;
			this.startVal = this.el.value;
			this.rawValue = parseInt(this.startVal);
			this.startEffectPosition = this.direction ? e.clientX : e.clientY;
			this.deltaX = e.clientX;
			this.deltaY = e.clientY;
		};
		this.pointerUp = function (e) {
			this.do = false;
		};
		this.deltaX;
		this.deltaY;
		this.pointerMove = function (e) {
			e.preventDefault();
			e.stopPropagation();
			if (this.do) {
				var pullDistance = 200;
				let deltaMultiplier =
					this.startEffectPosition - (this.direction ? e.clientX : e.clientY);
				deltaMultiplier = pullDistance - Math.abs(deltaMultiplier);
				deltaMultiplier = clamp(deltaMultiplier / pullDistance, 0.1, 1);

				this.rawValue +=
					((this.direction
						? this.deltaY - e.clientY
						: -this.deltaX + e.clientX) /
						10) *
					deltaMultiplier;
				this.el.value = clamp(
					Math.floor(this.rawValue),
					this.el.min,
					this.el.max
				);
				this.deltaX = e.clientX;
				this.deltaY = e.clientY;
				window.numberPad.update(this.el);
				if (this.el.oninput) this.el.oninput(e);
			}
		};
		this.pointerDownHandler = this.pointerDown.bind(this);
		this.pointerUpHandler = this.pointerUp.bind(this);
		this.pointerMoveHandler = this.pointerMove.bind(this);
		this.el.addEventListener("pointerdown", this.pointerDownHandler, {
			passive: false,
		});
		document.addEventListener("pointerup", this.pointerUpHandler, {
			passive: false,
		});
		document.addEventListener("pointermove", this.pointerMoveHandler, {
			passive: false,
		});
	}
	clear() {}
	destroy() {
		this.el.removeEventListener("pointerdown", this.pointerDownHandler, {
			passive: false,
		});
		document.removeEventListener("pointerup", this.pointerUpHandler, {
			passive: false,
		});
		document.removeEventListener("pointermove", this.pointerMoveHandler, {
			passive: false,
		});
	}
}

class elementResizable {
	constructor(el) {
		this.el = el
		this.resizableContainer = document.createElement("div")
		this.resizableContainer.classList.add("resizable-container")
		this.el.appendChild(this.resizableContainer)

		this.resizing = false; 
		this.horizontal = null; 
		this.vertical = null;

		this.baseWidth = this.el.offsetWidth
		this.baseHeight = this.el.offsetHeight
		this.baseX = this.el.offsetLeft
		this.baseY = this.el.offsetTop

		this.startMouseX = 0;
		this.startMouseY = 0;

		console.log(this.baseWidth, this.baseHeight, this.baseX, this.baseY)

		this.catchSize = 8;

		this.leftSideCatch = document.createElement("div")
		this.leftSideCatch.classList.add("resizable-catch")
		this.leftSideCatch.style.width = (this.catchSize) + "px"
		this.leftSideCatch.style.height = `calc(100% - ${this.catchSize}px)`
		this.leftSideCatch.style.top = (this.catchSize/2) + "px"
		this.leftSideCatch.style.left = `-${this.catchSize/2}px`
		this.leftSideCatch.style.cursor = cursors.resize()
		this.leftSideCatch.onpointerdown = (e)=>{
			this.resizing = true;
			this.horizontal = "right"
			this.vertical = null
			this.startMouseX = e.clientX
		}
		this.resizableContainer.appendChild(this.leftSideCatch)

		this.rightSideCatch = document.createElement("div")
		this.rightSideCatch.classList.add("resizable-catch")
		this.rightSideCatch.style.width = (this.catchSize) + "px"
		this.rightSideCatch.style.height = `calc(100% - ${this.catchSize}px)`
		this.rightSideCatch.style.top = (this.catchSize/2) + "px"
		this.rightSideCatch.style.right = `-${this.catchSize/2}px`
		this.rightSideCatch.style.cursor = cursors.resize()
		this.rightSideCatch.onpointerdown = (e)=>{
			this.resizing = true;
			this.horizontal = "right"
			this.vertical = null
			this.startMouseX = e.clientX
		}
		this.resizableContainer.appendChild(this.rightSideCatch)

		this.topSideCatch = document.createElement("div")
		this.topSideCatch.classList.add("resizable-catch")
		this.topSideCatch.style.height = (this.catchSize) + "px"
		this.topSideCatch.style.width = `calc(100% - ${this.catchSize}px)`
		this.topSideCatch.style.left = (this.catchSize/2) + "px"
		this.topSideCatch.style.top = `-${this.catchSize/2}px`
		this.topSideCatch.style.cursor = cursors.resize(90)
		
		this.leftSideCatch.onpointerdown = (e)=>{
			this.resizing = true;
			this.vertical = "top"
			this.horizontal = null
			this.startMouseY = e.clientY
		}
		this.resizableContainer.appendChild(this.topSideCatch)

		this.bottomSideCatch = document.createElement("div")
		this.bottomSideCatch.classList.add("resizable-catch")
		this.bottomSideCatch.style.height = (this.catchSize) + "px"
		this.bottomSideCatch.style.width = `calc(100% - ${this.catchSize}px)`
		this.bottomSideCatch.style.left = (this.catchSize/2) + "px"
		this.bottomSideCatch.style.bottom = `-${this.catchSize/2}px`
		this.bottomSideCatch.style.cursor = cursors.resize(90)
		this.bottomSideCatch.onpointerdown = (e)=>{
			this.resizing = true;
			this.vertical = "bottom"
			this.horizontal = null
			this.startMouseY = e.clientY
		}
		this.resizableContainer.appendChild(this.bottomSideCatch)

		this.leftTopCornerCatch = document.createElement("div")
		this.leftTopCornerCatch.classList.add("resizable-catch")
		this.leftTopCornerCatch.style.width = (this.catchSize) + "px"
		this.leftTopCornerCatch.style.height = (this.catchSize) + "px"
		this.leftTopCornerCatch.style.top = `-${this.catchSize/2}px`
		this.leftTopCornerCatch.style.left = `-${this.catchSize/2}px`
		this.leftTopCornerCatch.style.cursor = cursors.resize(45)
		this.leftTopCornerCatch.onpointerdown = (e)=>{
			this.resizing = true;
			this.horizontal = "left"
			this.vertical = "top"
			this.startMouseX = e.clientX
			this.startMouseY = e.clientY

		}
		this.resizableContainer.appendChild(this.leftTopCornerCatch)

		this.rightTopCornerCatch = document.createElement("div")
		this.rightTopCornerCatch.classList.add("resizable-catch")
		this.rightTopCornerCatch.style.width = (this.catchSize) + "px"
		this.rightTopCornerCatch.style.height = (this.catchSize) + "px"
		this.rightTopCornerCatch.style.top = `-${this.catchSize/2}px`
		this.rightTopCornerCatch.style.right = `-${this.catchSize/2}px`
		this.rightTopCornerCatch.style.cursor = cursors.resize(135)
		this.rightTopCornerCatch.onpointerdown = (e)=>{
			this.resizing = true;
			this.horizontal = "right"
			this.vertical = "top"
			this.startMouseX = e.clientX
			this.startMouseY = e.clientY

		}
		this.resizableContainer.appendChild(this.rightTopCornerCatch)

		this.leftBottomCornerCatch = document.createElement("div")
		this.leftBottomCornerCatch.classList.add("resizable-catch")
		this.leftBottomCornerCatch.style.width = (this.catchSize) + "px"
		this.leftBottomCornerCatch.style.height = (this.catchSize) + "px"
		this.leftBottomCornerCatch.style.bottom = `-${this.catchSize/2}px`
		this.leftBottomCornerCatch.style.left = `-${this.catchSize/2}px`
		this.leftBottomCornerCatch.style.cursor = cursors.resize(135)
		this.leftBottomCornerCatch.onpointerdown = (e)=>{
			this.resizing = true;
			this.horizontal = "left"
			this.vertical = "bottom"
			this.startMouseX = e.clientX
			this.startMouseY = e.clientY

		}
		this.resizableContainer.appendChild(this.leftBottomCornerCatch)

		this.rightBottomCornerCatch = document.createElement("div")
		this.rightBottomCornerCatch.classList.add("resizable-catch")
		this.rightBottomCornerCatch.style.width = (this.catchSize) + "px"
		this.rightBottomCornerCatch.style.height = (this.catchSize) + "px"
		this.rightBottomCornerCatch.style.bottom = `-${this.catchSize/2}px`
		this.rightBottomCornerCatch.style.right = `-${this.catchSize/2}px`
		this.rightBottomCornerCatch.style.cursor = cursors.resize(45)
		this.rightBottomCornerCatch.onpointerdown = (e)=>{
			this.resizing = true;
			this.horizontal = "right"
			this.vertical = "bottom"
			this.startMouseX = e.clientX
			this.startMouseY = e.clientY

		}
		this.resizableContainer.appendChild(this.rightBottomCornerCatch)
		
		document.addEventListener("pointerup", function(e) {
			this.resizing= false;
			this.baseWidth = this.el.offsetWidth
			this.baseHeight = this.el.offsetHeight
			this.baseX = this.el.offsetLeft
			this.baseY = this.el.offsetTop
		}.bind(this), {
			passive: false,
		});
		document.addEventListener("pointermove", function (e){
			if(!this.resizing) return

			if(this.horizontal == "left") {
				this.el.style.width = (this.baseWidth + (this.startMouseX - e.clientX)) + "px"
				console.log(this.el.style.width)
				this.el.style.left = (this.baseX - (this.startMouseX - e.clientX)) + "px"
			}
			if(this.horizontal == "right") {
				this.el.style.width = (this.baseWidth - (this.startMouseX - e.clientX)) + "px"
			}
			if(this.vertical == "top") {
				this.el.style.height = (this.baseHeight + (this.startMouseY - e.clientY)) + "px"
				this.el.style.top = (this.baseY - (this.startMouseY - e.clientY)) + "px"
			}
			if(this.vertical == "bottom") {
				this.el.style.height = (this.baseHeight - (this.startMouseY - e.clientY)) + "px"
			}

		}.bind(this) , {
			passive: false,
		});


	}
}

function toggleMenu(menu, el) {
	if (menu.nodeName) {
		if (menu.parentElement.classList.contains("menu-open")) {
			closeMenu(menu, el);
		} else {
			openMenu(menu, el);
		}
		return;
	}
	if (document.getElementById("menu-" + menu).classList.contains("menu-open")) {
		closeMenu(menu, el);
	} else {
		openMenu(menu, el);
	}
}

function closeMenu(menu, el) {
	if (menu.nodeName) {
		menu.parentElement.classList.remove("menu-open");
		return;
	}
	document.getElementById("menu-" + menu).classList.remove("menu-open");
}

function openMenu(menu, el) {
	if (menu.nodeName) {
		menu.parentElement.classList.add("menu-open");
		return;
	}
	document.getElementById("menu-" + menu).classList.add("menu-open");
	Popper.createPopper(el, document.getElementById("menu-" + menu), {
		placement: "auto",
		modifiers: [
			{
				name: "preventOverflow",
				options: {
					mainAxis: true, // true by default
					altAxis: true, // false by default
					padding: 10,
				},
			},

			{
				name: "offset",
				options: {
					offset: [0, 10],
				},
			},
			{
				name: "arrow",
				options: {
					element: this.arrow,
				},
			},
		],
	});
}

function toggleFile() {}

function setSelectionMode(m) {
	settings.tools.selectionMode.value = m;
	document.querySelectorAll(".input-group-item").forEach((e) => {
		e.classList.remove("tool-active");
	});
	document.getElementById("input-button-" + m).classList.add("tool-active");
}

function openGallery() {
	window.dispatchEvent(window.cloudSyncEvent);
	window.location.href = "./";
}

function openEditor() {
	window.location.href = "./draw";
}

window.closeSplash = () => {
	setTimeout(() => {
		document.getElementById("splash").classList.add("hidden");
	}, 1000);
};

//replace when you have a functioning window system
function openWindow(window) {
	document.getElementById("window-" + window).classList.add("window-open");
}

function closeWindow(window) {
	document.getElementById("window-" + window).classList.remove("window-open");
}

class NumberInputKeypad {
	constructor() {
		this.target = null;
		this.element = document.getElementById("number-pad");

		this.arrow = document.getElementById("numpadArrow");

		this.popper = Popper.createPopper(document.documentElement, this.element, {
			placement: "auto",
			modifiers: [
				{
					name: "preventOverflow",
					options: {
						mainAxis: true, // true by default
						altAxis: true, // false by default
					},
				},
				{
					name: "offset",
					options: {
						offset: [0, 18],
					},
				},
				{
					name: "arrow",
					options: {
						element: this.arrow,
					},
				},
			],
		});
		this.previewValue = this.element.querySelector("#number-pad-preview-value");
		this.previewUnit = this.element.querySelector("#number-pad-preview-unit");
		this.value = 0;
		this.unit = false;
		this.title = "title";
		this.overwriteDefault = false;
		this.min = 0;
		this.max = Infinity;
		this.reposition();
		//for all number buttons, add click event listener that updates the value
		this.element.querySelectorAll("[data-value]").forEach((e) => {
			e.addEventListener("touchend", (ev)=>{ev.preventDefault();
				this.addToValue(e.getAttribute("data-value"));
			}, {passive: false})
			e.addEventListener("click", (ev) => {
				ev.stopPropagation()
				ev.stopImmediatePropagation()
				ev.preventDefault()
				this.addToValue(e.getAttribute("data-value"));
			}, {passive: false});
		});
		document.addEventListener("keydown", (e) => {
			if (!this.isopen) return;
			if (e.key == "Backspace") this.backspace();
			if (e.key == "Enter") {
				this.confirm();
				this.close();
			}
			if (!isNaN(parseInt(e.key))) this.addToValue(e.key);
		});
		this.element
			.querySelector("[data-backspace]")
			.addEventListener("click", () => {
				this.backspace();
			});
		this.element
			.querySelector("[data-confirm]")
			.addEventListener("click", () => {
				this.confirm();
				this.close();
			});
		document.body.appendChild(this.element);
		this.padBoundingRect = this.element.getBoundingClientRect();
		//gets all document inputs and close if the event target is not the parent el
		document.addEventListener("pointerdown", (e) => {
			if (
				this.target != e.target &&
				!this.element.contains(e.target) &&
				this.element != e.target
			) {
				this.close();
			}
		});
	}
	reposition() {
		if (!this.target) return;
		this.popper.state.elements.reference = this.target;
		this.popper.update();
		this.popper.forceUpdate();
	}
	update(targetElement) {
		this.target = targetElement;
		this.value = this.target.value || 0;
		this.unit =
			this.target.getAttribute("data-input-num-unit") == "undefined"
				? ""
				: this.target.getAttribute("data-input-num-unit");
		this.min = this.target.min;
		this.max = this.target.max;
		this.reposition();
		this.previewValue.innerHTML = this.value;
		this.previewUnit.innerHTML = this.unit;
		this.target.style.setProperty(
			"--percent",
			((this.value - this.min) / (this.max - this.min)) * 100 + "%"
		);
	}
	open(targetElement) {
		this.target = targetElement;
		this.reposition();
		this.overwriteDefault = true;
		this.isopen = true;
		this.element.classList.remove("number-pad-input-hidden");
	}
	close() {
		this.isopen = false;
		this.element.classList.add("number-pad-input-hidden");
	}
	addToValue(i) {
		//append to value, if value is 0 overwrite value
		if (this.value == 0 || this.overwriteDefault) {
			this.value = i;
		} else {
			this.value += i;
		}
		if (parseInt(this.value) > this.max) {
			this.value = this.max.toString();
		}
		this.overwriteDefault = false;
		this.previewValue.innerHTML = this.value;
		this.previewUnit.innerHTML = this.unit;
	}
	backspace() {
		this.value = this.value.toString().slice(0, -1);
		//clamp value based on min
		this.value = Math.max(this.value, this.min);
		this.previewValue.innerHTML = this.value;
		this.previewUnit.innerHTML = this.unit;
	}
	confirm() {
		this.target.value = Math.max(parseInt(this.value), this.min);
		if (this.target.oninput) this.target.oninput(this.target);
		this.target.style.setProperty(
			"--percent",
			((this.value - this.min) / (this.max - this.min)) * 100 + "%"
		);
	}
	animate() {}
}
//destroys all old draggables and creates new ones
function refreshAllNumberDraggables() {
	draggableNumInputs.forEach((e) => {
		e.destroy();
	});
	draggableNumInputs = [];
	var numDraggable = document.querySelectorAll("[data-input-num-draggable]");
	numDraggable.forEach((e) => {
		if (isMobile) e.setAttribute("readonly", "true");
		e.removeEventListener("click", numberDraggableClickHandler, true);
		e.addEventListener("click", numberDraggableClickHandler, true);
		draggableNumInputs.push(new numberDraggable(e));
	});
}

var tooltips = [];

function numberDraggableClickHandler(e) {
	if (!isMobile) return;
	if (isMobile) e.preventDefault();
	if (!window.numberPad.isopen) {
		window.numberPad.update(e.target);
		window.numberPad.open(e.target);
	} else {
		window.numberPad.close();
	}
}

function refreshAllTooltips() {
	tooltips.forEach((e) => {
		e[0].destroy();
	});

	tooltips = [];

	var toolEls = document.querySelectorAll(".tooltip");
	toolEls.forEach((e) => {
		e.remove();
	});

	var ttp = document.querySelectorAll("[data-tooltip]");
	ttp.forEach((e) => {
		let tooltip = document.createElement("div");
		tooltip.innerHTML = e.getAttribute("data-tooltip");
		tooltip.classList.add("tooltip");
		var popInstance = Popper.createPopper(e, tooltip, {
			placement: "auto",
			modifiers: [
				{
					name: "preventOverflow",
					options: {
						mainAxis: true, // true by default
						altAxis: true, // false by default
						padding: 55,
					},
				},

				{
					name: "offset",
					options: {
						offset: [0, 10],
					},
				},
				{
					name: "arrow",
					options: {
						element: this.arrow,
					},
				},
			],
		});
		e.removeEventListener("touchstart", tooltipDownHandler, true);
		e.addEventListener("touchstart", tooltipDownHandler, true);
		document.body.removeEventListener("touchend", tooltipUpHandler, true);
		document.body.addEventListener("touchend", tooltipUpHandler, true);
		e.removeEventListener("mouseover", tooltipDownHandler, true);
		e.addEventListener("mouseover", tooltipDownHandler, true);
		e.removeEventListener("mouseout", tooltipUpHandler, true);
		e.addEventListener("mouseout", tooltipUpHandler, true);
		document.body.appendChild(tooltip);
		tooltips.push([popInstance, tooltip, e]);
	});
}

function tooltipDownHandler(e) {
	if (!tooltips.find((l) => l[2] == e.target)) return;
	tooltips.find((l) => l[2] == e.target)[1].classList.add("tooltip-visible");
}
function tooltipUpHandler(e) {
	if (!tooltips.find((l) => l[2] == e.target)) return;
	tooltips.find((l) => l[2] == e.target)[1].classList.remove("tooltip-visible");
}

function mobileDesktopCallback(mobileCallback, desktopCallback) {
	if (isMobile) {
		mobileCallback();
	} else {
		desktopCallback();
	}
}

function setSettingSection(section) {
	document.querySelectorAll(".setting-section").forEach((e) => {
		e.classList.remove("window-main-show");
	});
	document.querySelectorAll(".setting-button").forEach((e) => {
		e.classList.remove("window-sidebar-button-active");
	});
	document
		.getElementById("settings-sidebar")
		.classList.remove("window-sidebar-open");
	document
		.getElementById("setting-button-" + section)
		.classList.add("window-sidebar-button-active");

	document
		.getElementById("setting-section-" + section)
		.classList.add("window-main-show");
}

class ConfirmModal {
	constructor(
		title,
		message,
		confirmText,
		cancelText,
		confirmCallback,
		cancelCallback
	) {
		this.title = title;
		this.message = message;
		this.confirmText = confirmText;
		this.cancelText = cancelText;
		this.confirmCallback = confirmCallback;
		this.cancelCallback = cancelCallback || function () {};
		this.create();
	}
	create() {
		this.modal = document.createElement("div");
		this.modal.classList.add("confirm-modal");
		this.modal.innerHTML = `
		<div class="confirm-modal-title">${this.title}</div>
		<div class="confirm-modal-message">${this.message}</div>
		<div class="confirm-modal-buttons">
			<div class="confirm-modal-button confirm-modal-button-cancel">${this.cancelText}</div>
			<div class="confirm-modal-button confirm-modal-button-confirm">${this.confirmText}</div>
		</div>
		`;
		document.body.appendChild(this.modal);
		this.modal
			.querySelector(".confirm-modal-button-cancel")
			.addEventListener("click", () => {
				this.modal.classList.add("confirm-modal-closing");
				setTimeout(() => {
					this.modal.remove();
				}, 300);
				this.cancelCallback().bind(this);
			});
		this.modal
			.querySelector(".confirm-modal-button-confirm")
			.addEventListener("click", 
			
			() => {
				this.modal.classList.add("confirm-modal-closing");
				setTimeout(() => {
					this.modal.remove();
				}, 300);
				this.confirmCallback().bind(this)
			});
	}
}
