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
	document.documentElement.className = themeName;
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

window
	.matchMedia("(prefers-color-scheme: dark)")
	.addEventListener("change", function (e) {
		if (localStorage.theme == "ui-theme-system-default") {
			setTheme(Themes.system);
		}
	});

var draggableNumInputs = [];

class numberDraggable {
	constructor(el) {
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
	constructor(el) {
		this.element = document.createElement("div");
		this.element.style.background = "red";
		this.element.style.position = "absolute";
		this.rect = el.getBoundingClientRect().toJSON();
		this.element.style.top = this.rect.top + "px";
		this.element.style.left = this.rect.left + "px";
		this.element.style.width = this.rect.width + "px";
		this.element.style.height = this.rect.height + "px";
		this.element.style.zIndex = "99999999999999999999999";
		this.element.style.pointerEvents = "none";
		this.width = 100;
		this.targetRect = {
			top: this.rect.bottom + 20,
			width: this.width,
			left: this.rect.left + this.rect.width / 2 - this.width / 2,
			height: 200,
		};
		this.homeRect = { ...this.rect };
		this.updatedRect = { ...this.rect };
		console.log(this.rect);
		console.log(this.updatedRect, Object.assign({}, this.rect));
		document.body.appendChild(this.element);
		var _self = this;
		this.isopen = false;
	}
	open() {
		this.targetRect = {
			top: this.rect.bottom + 20,
			width: this.width,
			left: this.rect.left + this.rect.width / 2 - this.width / 2,
			height: 200,
		};
		this.isopen = true;
		requestAnimationFrame(this.animate.bind(this));
	}
	close() {
		this.isopen = false;
		this.targetRect = { ...this.homeRect };
		requestAnimationFrame(this.animate.bind(this));
	}

	animate() {
		var lerpVal = 0.2;
		this.updatedRect.top = lerp(
			this.updatedRect.top,
			this.targetRect.top,
			lerpVal
		);
		this.updatedRect.left = lerp(
			this.updatedRect.left,
			this.targetRect.left,
			lerpVal
		);
		this.updatedRect.width = lerp(
			this.updatedRect.width,
			this.targetRect.width,
			lerpVal
		);
		this.updatedRect.height = lerp(
			this.updatedRect.height,
			this.targetRect.height,
			lerpVal
		);
		this.element.style.top = this.updatedRect.top + "px";
		this.element.style.left = this.updatedRect.left + "px";
		this.element.style.width = this.updatedRect.width + "px";
		this.element.style.height = this.updatedRect.height + "px";
		var thresh = 0.01;
		if (
			this.updatedRect.top - this.targetRect.top < thresh &&
			this.updatedRect.left - this.targetRect.left < thresh &&
			this.updatedRect.width - this.targetRect.width < thresh &&
			this.updatedRect.height - this.targetRect.height < thresh
		) {
			return;
		}
		requestAnimationFrame(this.animate.bind(this));
	}
}
