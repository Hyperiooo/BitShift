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
	yellow: "ui-accent-yellow",
	green: "ui-accent-green",
	teal: "ui-accent-teal",
	blue: "ui-accent-blue",
	purple: "ui-accent-purple",
	pink: "ui-accent-pink",
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
				"--appBarThemeColor"
			)
		);
	document
		.querySelector('meta[name="apple-mobile-web-app-status-bar"]')
		.setAttribute(
			"content",
			getComputedStyle(document.documentElement).getPropertyValue(
				"--appBarThemeColor"
			)
		);
	document
		.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
		.setAttribute(
			"content",
			getComputedStyle(document.documentElement).getPropertyValue(
				"--appBarThemeColor"
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
		this.direction = this.el.getAttribute("data-input-num-draggable-vertical") ? true : false;
		console.log(this.direction)
		console.log()
		this.startVal = this.el.value;
		self = this;
		this.pointerDown = function (e) {
			e.preventDefault()
			this.do = true;
			this.startP = this.direction ? e.clientY : e.clientX;
			this.startVal = this.el.value;
		};
		this.pointerUp = function (e) {
			this.do = false;
		};
		this.pointerMove = function (e) {
			e.preventDefault()
			e.stopPropagation()
			if (this.do) {
				this.el.value = clamp(
					parseInt(this.startVal) + Math.floor(((this.direction ?  this.startP - e.clientY : e.clientX- this.startP) ) / 10),
					this.el.min,
					this.el.max
				);
				window.numberPad.update(this.el);
				if (this.el.oninput) this.el.oninput(e);
			}
		};
		this.pointerDownHandler = this.pointerDown.bind(this);
		this.pointerUpHandler = this.pointerUp.bind(this);
		this.pointerMoveHandler = this.pointerMove.bind(this);
		this.el.addEventListener("pointerdown", this.pointerDownHandler);
		document.addEventListener("pointerup", this.pointerUpHandler);
		document.addEventListener("pointermove", this.pointerMoveHandler);
	}
	clear() {}
	destroy() {
		this.el.removeEventListener("pointerdown", this.pointerDownHandler);
		document.removeEventListener("pointerup", this.pointerUpHandler);
		document.removeEventListener("pointermove", this.pointerMoveHandler);
	}
}

function toggleMenu() {
	document.querySelector(".menu").classList.toggle("menu-open");
}

function closeMenu() {
	document.querySelector(".menu").classList.remove("menu-open");
}

function openMenu() {
	document.querySelector(".menu").classList.add("menu-open");
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
	document.getElementById("window-" + window).classList.remove("window-closed");
}

function closeWindow(window) {
	document.getElementById("window-" + window).classList.add("window-closed");
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
		this.title = "title"
		this.overwriteDefault = false;
		this.min = 0;
		this.max = Infinity;
		this.reposition();
		//for all number buttons, add click event listener that updates the value
		this.element.querySelectorAll("[data-value]").forEach((e) => {
			e.addEventListener("click", () => {
				this.addToValue(e.getAttribute("data-value"));
			});
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
		this.target.style.setProperty("--percent", (this.value - this.min) / (this.max - this.min) * 100 + "%" )
				
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
		this.target.style.setProperty("--percent", (this.value - this.min) / (this.max - this.min) * 100 + "%" )
		
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

var tooltips = []

function numberDraggableClickHandler(e) {
	if (!isMobile) return;
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

	tooltips = []

	var toolEls = document.querySelectorAll(".tooltip") 
	toolEls.forEach(e => {
		e.remove()
	})
	
	var ttp = document.querySelectorAll("[data-tooltip]");
	ttp.forEach((e) => {
		let tooltip = document.createElement("div")
		tooltip.innerHTML = e.getAttribute("data-tooltip")
		tooltip.classList.add("tooltip")
		var popInstance = Popper.createPopper(e, tooltip, {
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
		console.log(e)
		e.removeEventListener("touchstart", tooltipDownHandler, true);
		e.addEventListener("touchstart", tooltipDownHandler, true);
		document.body.removeEventListener("touchend", tooltipUpHandler, true);
		document.body.addEventListener("touchend", tooltipUpHandler, true);
		e.removeEventListener("mouseover", tooltipDownHandler, true);
		e.addEventListener("mouseover", tooltipDownHandler, true);
		e.removeEventListener("mouseout", tooltipUpHandler, true);
		e.addEventListener("mouseout", tooltipUpHandler, true);
		document.body.appendChild(tooltip)
		tooltips.push([popInstance, tooltip, e])
	});
}

function tooltipDownHandler(e) {
	if(!tooltips.find(l => l[2] == e.target))return
	tooltips.find(l => l[2] == e.target)[1].classList.add("tooltip-visible")

}
function tooltipUpHandler(e) {
	if(!tooltips.find(l => l[2] == e.target))return
	tooltips.find(l => l[2] == e.target)[1].classList.remove("tooltip-visible")

}
