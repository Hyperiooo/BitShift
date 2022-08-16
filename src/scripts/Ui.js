let vh = window.innerHeight;
let vw = window.innerWidth;
document.documentElement.style.setProperty("--vh", `${vh}px`);
document.documentElement.style.setProperty("--vw", `${vw}px`);
window.addEventListener("resize", () => {
	vh = window.innerHeight;
	vw = window.innerWidth;
	document.documentElement.style.setProperty("--vh", `${vh}px`);
	document.documentElement.style.setProperty("--vw", `${vw}px`);
});

let debug;

var Themes = {
	light: "ui-theme-light",
	dark: "ui-theme-dark",
	black: "ui-theme-black",
};

function setTheme(themeName) {
	localStorage.setItem("theme", themeName);
	document.documentElement.className = themeName;
	document
		.querySelector('meta[name="theme-color"]')
		.setAttribute(
			"content",
			getComputedStyle(document.documentElement).getPropertyValue("--appBarThemeColor")
		);
	document
		.querySelector('meta[name="apple-mobile-web-app-status-bar"]')
		.setAttribute(
			"content",
			getComputedStyle(document.documentElement).getPropertyValue("--appBarThemeColor")
		);
	document
		.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
		.setAttribute(
			"content",
			getComputedStyle(document.documentElement).getPropertyValue("--appBarThemeColor")
		);
}

var draggableNumInputs = [];

class numberDraggable {
	constructor(el) {
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
	newLayer(width, height);
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
     document.getElementById("splash").classList.add("hidden") 
}
