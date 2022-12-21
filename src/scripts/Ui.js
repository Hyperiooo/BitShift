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
	console.log(accentName);
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
		console.log(el);
		this.do = false;
		this.startX = 0;
		this.el = el;
		this.startVal = this.el.value;
		self = this;
		this.el.addEventListener("mousedown", (e) => {
			this.do = true;
			this.startX = e.clientX;
			this.startVal = this.el.value;
		});
		this.el.addEventListener("mouseup", () => {
			this.do = false;
		});
		document.addEventListener("mouseup", () => {
			this.do = false;
		});
		this.el.addEventListener("touchstart", (e) => {
			this.do = true;
			this.startX = e.touches[0].clientX;
			this.startVal = this.el.value;
		});
		this.el.addEventListener("touchend", () => {
			this.do = false;
		});
		document.addEventListener("touchend", () => {
			this.do = false;
		});
		document.addEventListener("touchmove", (e) => {
			if (this.do) {
				this.el.value = clamp(
					parseInt(this.startVal) +
						Math.floor((e.touches[0].clientX - this.startX) / 10),
					this.el.min,
					this.el.max
				);
				numpad.update(this.el.value);
				if (this.el.oninput) this.el.oninput(e);
			}
		});
		document.addEventListener("mousemove", (e) => {
			if (this.do) {
				console.log("move");
				this.el.value = clamp(
					parseInt(this.startVal) + Math.floor((e.clientX - this.startX) / 10),
					this.el.min,
					this.el.max
				);
				numpad.update(this.el.value);
				if (this.el.oninput) this.el.oninput(e);
			}
		});
	}
	clear() {}
}
class Popup {
	constructor(s) {
		this.s = s;
		document.querySelector(this.s).classList.add("popup-open");
	}
	close() {
		document.querySelector(this.s).classList.remove("popup-open");
	}
}

function closePopup() {
	window.dim.close();
}

function confirmNewProject() {
	clearPalettes();
	clearLayerMenu();
	clearLayers();
	layers = [];
	if (typeof board !== "undefined") {
		board.destroy();
	}
	var width = +document.querySelector("#width").value;
	var height = +document.querySelector("#height").value;
	window.board = new Canvas(width, height);
	window.colors = defaultPalettes;
	preparePalette();
	board.setColor(new Color(colors[0].colors[0]));
	window.dim.close();
	project = {
		name: "Untitled Sprite",
		palettes: filePalettes,
		currColor: board.color,
		width: width,
		height: height,
		layers: [],
	};

	projName = project.name;

	document.getElementById("topbar-project-name").value = projName;
	newLayer();
	initializeGestures();
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
function openSettingsWindow() {
	document.getElementById("window-settings").classList.remove("window-closed");
}

function closeSettingsWindow() {
	document.getElementById("window-settings").classList.add("window-closed");
}

class NumberInputKeypad {
	constructor(el, value, unit, min, max) {
		this.el = el;
		this.element = document.createElement("div");
		this.value = value || 0;
		this.unit = unit || false;
		this.overwriteDefault = false;
		this.min = min || 0;
		this.max = max || Infinity;
		this.reposition();
		this.element.classList.add("number-pad-input-wrap");
		this.element.classList.add("number-pad-input-hidden");
		this.preview = document.createElement("div");
		this.preview.classList.add("number-pad-preview");
		this.preview.classList.add("grid-row-1");
		this.preview.classList.add("grid-col-1-4");
		this.preview.innerHTML =
			this.value +
			(this.unit ? `<span class='number-pad-unit'>${this.unit}</span>` : "");
		this.element.appendChild(this.preview);
		this.buttons = [];
		for (let i = 0; i < 9; i++) {
			this.buttons[i] = document.createElement("button");
			this.buttons[i].classList.add("number-pad-input-button");
			this.buttons[i].classList.add("grid-row-" + (Math.floor(i / 3) + 2));
			this.buttons[i].classList.add("grid-col-" + ((i % 3) + 1));
			this.buttons[i].setAttribute(
				"data-value",
				(2 - Math.floor(i / 3)) * 3 + ((i % 3) + 1)
			);
			this.buttons[i].innerHTML = (2 - Math.floor(i / 3)) * 3 + ((i % 3) + 1);
			this.element.appendChild(this.buttons[i]);
			this.buttons[i].addEventListener("click", () => {
				this.addToValue(this.buttons[i].getAttribute("data-value"));
			});
		}
		this.buttons[10] = document.createElement("button");
		this.buttons[10].classList.add("number-pad-input-button");
		this.buttons[10].classList.add("grid-row-5");
		this.buttons[10].classList.add("grid-col-1-2");
		this.buttons[10].innerHTML = "0";
		this.buttons[10].setAttribute("data-value", 0);
		this.buttons[10].addEventListener("click", () => {
			this.addToValue(this.buttons[10].getAttribute("data-value"));
		});
		this.element.appendChild(this.buttons[10]);
		this.buttons[11] = document.createElement("button");
		this.buttons[11].classList.add("number-pad-input-button");
		this.buttons[11].classList.add("grid-row-5");
		this.buttons[11].classList.add("grid-col-3");
		this.buttons[11].innerHTML = ".";
		this.element.appendChild(this.buttons[11]);
		this.buttons[12] = document.createElement("button");
		this.buttons[12].classList.add("number-pad-input-button");
		this.buttons[12].classList.add("grid-col-4");
		this.buttons[12].classList.add("grid-row-2-3");
		this.buttons[12].classList.add("font-icon");
		this.buttons[12].innerHTML = '<i class="hi-backspace-line"></i>';
		this.element.appendChild(this.buttons[12]);
		this.buttons[12].addEventListener("click", () => {
			this.backspace();
		});
		this.buttons[13] = document.createElement("button");
		this.buttons[13].classList.add("number-pad-input-button");
		this.buttons[13].classList.add("grid-col-4");
		this.buttons[13].classList.add("grid-row-4-5");
		this.buttons[13].classList.add("bg-important-t");
		this.buttons[13].classList.add("font-icon");
		this.buttons[13].innerHTML = '<i class="hi-check-line"></i>';
		this.buttons[13].addEventListener("click", () => {
			this.confirm();
			this.close();
		});
		this.element.appendChild(this.buttons[13]);
		this.el.appendChild(this.element);
		document.body.appendChild(this.element);
		this.padBoundingRect = this.element.getBoundingClientRect();
		//gets all document inputs and close if the event target is not the parent el
		document.addEventListener("pointerdown", (e) => {
			if (
				this.el != e.target &&
				!this.element.contains(e.target) &&
				this.element != e.target
			) {
				this.close();
			}
		});
	}
	reposition() {
		this.inputBoundingRect = this.el.getBoundingClientRect();
		this.padBoundingRect = this.element.getBoundingClientRect();
		this.element.style.top =
			this.inputBoundingRect.top + this.inputBoundingRect.height + 20 + "px";
		this.element.style.left =
			this.inputBoundingRect.width / 2 +
			this.inputBoundingRect.left -
			this.padBoundingRect.width / 2 +
			"px";
	}
	update(value) {
		this.value = value || 0;
		this.preview.innerHTML =
			this.value +
			(this.unit ? `<span class='number-pad-unit'>${this.unit}</span>` : "");
	}
	open(targetElement) {
		this.el = targetElement;
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
		notify.log(typeof this.max);
		if (parseInt(this.value) > this.max) {
			this.value = this.max.toString();
		}
		this.overwriteDefault = false;
		this.preview.innerHTML =
			this.value +
			(this.unit ? `<span class='number-pad-unit'>${this.unit}</span>` : "");
	}
	backspace() {
		this.value = this.value.toString().slice(0, -1);
		//clamp value based on min
		this.value = Math.max(this.value, this.min);
		this.preview.innerHTML =
			this.value +
			(this.unit ? `<span class='number-pad-unit'>${this.unit}</span>` : "");
	}
	confirm() {
		this.el.value = parseInt(this.value);
		if (this.el.oninput) this.el.oninput();
	}
	animate() {}
}
class ColorPicker {
	//convert the above html to js
	constructor() {
		this.colorMenu = document.createElement("div");
		//document.body.appendChild(this.colorMenu);
		this.colorMenu.classList.add("color-menu");
		this.colorMenu.classList.add("color-open");
		this.colorMenu.id = "color-menu";
		this.colorMenu.ondragleave = this.dragLeaveHandler.bind(this);
		this.colorMenu.ondragover = this.dragOverHandler.bind(this);
		this.colorMenu.ondrop = this.dropHandler.bind(this);

		this.pickerContent = document.createElement("div");
		this.pickerContent.classList.add("color-menu-content");
		this.colorMenu.appendChild(this.pickerContent);

		this.colorMenuCloseButton = document.createElement("button");
		this.colorMenuCloseButton.classList.add("color-menu-close-button");
		this.colorMenuCloseButton.onclick = this.closeMenu.bind(this);
		this.colorMenuCloseButton.innerHTML = `<i class="hi-x-large-line"></i>`;
		this.colorMenu.appendChild(this.colorMenuCloseButton);

		this.colorPreview = document.createElement("div");
		this.colorPreview.classList.add("color-preview");
		this.colorPreview.id = "color-preview";
		this.colorMenu.appendChild(this.colorPreview);

		this.colorPrevious = document.createElement("div");
		this.colorPrevious.classList.add("color-previous");
		this.colorPrevious.id = "color-previous";
		this.colorPreview.appendChild(this.colorPrevious);

		this.colorCurrent = document.createElement("div");
		this.colorCurrent.classList.add("color-current");
		this.colorCurrent.id = "color-current";
		this.colorPreview.appendChild(this.colorCurrent);

		this.colorMenuDropEffect = document.createElement("div");
		this.colorMenuDropEffect.classList.add("color-menu-drop-effect");
		this.colorMenuDropEffect.id = "color-menu-drop-effect";
		this.colorMenuDropEffect.innerHTML = `Import Palette`;
		this.pickerContent.appendChild(this.colorMenuDropEffect);

		this.colorMenuDropErr = document.createElement("div");
		this.colorMenuDropErr.classList.add("color-menu-drop-err");
		this.colorMenuDropErr.id = "color-menu-drop-err";
		this.colorMenuDropErr.innerHTML = `Could Not Import Palette`;
		this.pickerContent.appendChild(this.colorMenuDropErr);

		this.hueSlider = document.createElement("div");
		this.hueSlider.classList.add("color-selector");
		this.hueSlider.id = "color-hue";
		//this.hueSlider.onpointerdown = this.hueDown.bind(this);
		//this.hueSlider.onpointermove = this.hueMove.bind(this);
		//this.hueSlider.onpointercancel = this.hueUp.bind(this);
		this.hueThumb = document.createElement("div");
		this.hueThumb.id = "color-hue-thumb";
		this.hueSlider.appendChild(this.hueThumb);
		this.pickerContent.appendChild(this.hueSlider);
		console.log(this.hueSlider);

		this.valueBlock = document.createElement("div");
		this.valueBlock.classList.add("color-selector");
		this.valueBlock.id = "color-value";
		//this.valueBlock.onpointerdown = this.valueDown.bind(this);
		//this.valueBlock.onpointermove = this.valueMove.bind(this);
		//this.valueBlock.onpointercancel = this.valueUp.bind(this);
		this.valueThumb = document.createElement("div");
		this.valueThumb.id = "color-value-thumb";
		this.pickerContent.appendChild(this.valueBlock);
		this.valueBlock.appendChild(this.valueThumb);

		this.recentColorParent = document.createElement("div");
		this.recentColorParent.id = "color-menu-recent-colors";
		this.pickerContent.appendChild(this.recentColorParent);

		this.tabbar = document.createElement("div");
		this.tabbar.id = "color-menu-tabbar";
		this.colorMenu.appendChild(this.tabbar);

		this.pickerButton = document.createElement("button");
		this.pickerButton.classList.add("color-menu-tabbar-button");
		this.pickerButton.classList.add("color-menu-tabbar-button-active");
		this.pickerButton.innerHTML = `<i class="hi-circle-fill"></i>Picker`;
		this.tabbar.appendChild(this.pickerButton);

		this.valueButton = document.createElement("button");
		this.valueButton.classList.add("color-menu-tabbar-button");
		this.valueButton.innerHTML = `<i class="hi-circle-fill"></i>Value`;
		this.tabbar.appendChild(this.valueButton);

		this.paletteButton = document.createElement("button");
		this.paletteButton.classList.add("color-menu-tabbar-button");
		this.paletteButton.innerHTML = `<i class="hi-circle-fill"></i>Palette`;
		this.tabbar.appendChild(this.paletteButton);

		this.valueContent = document.createElement("div");
		this.valueContent.classList.add("color-menu-content");
		this.valueContent.classList.add("color-menu-content-hidden");
	}
	async dropHandler() {
		console.log("File(s) dropped");
		this.colorMenuDropEffect.classList.remove("color-menu-drop-effect-on");

		e.preventDefault();
		e.stopPropagation();

		const dt = e.dataTransfer;
		if (!dt) return;
		if (dt.items) {
			console.log(dt.items);
			const items = await getAllFileEntries(dt.items);
			if (!items) return;
			const files = await Promise.all(
				items.map(
					(item) =>
						new Promise((resolve, reject) => {
							item.file(resolve, reject);
						})
				)
			);
			addPaletteViewsFromFiles(files.length ? files : [...dt.files]);
		} else if (dt.files) {
			addPaletteViewsFromFiles([...dt.files]);
		}
	}
	dragLeaveHandler() {
		this.colorMenuDropEffect.classList.remove("color-menu-drop-effect-on");

		e.preventDefault();
		e.stopPropagation();
	}
	dragOverHandler() {
		this.colorMenuDropEffect.classList.add("color-menu-drop-effect-on");

		e.preventDefault();
		e.stopPropagation();
	}
	colorPreviewClickHandler() {}
	closeMenu() {}
}

new ColorPicker();
