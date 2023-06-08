function toggleColorPicker() {
	document.getElementById("color-menu").classList.toggle("color-open");
	document.getElementById("layer-menu").classList.remove("layer-open");
	document
		.getElementById("layer-toggle-button")
		.classList.remove("tool-active");
}

function act(clr) {
	document.querySelectorAll(".palette-color").forEach((x) => {
		x.classList.add("palette-inactive");
		x.classList.remove("palette-active");
	});
	if (clr) {
		clr.forEach((e) => {
			e.classList.remove("palette-inactive");
			e.classList.add("palette-active");
		});
	}
}
var pickerColor = [0, 0, 0, 100];

document.querySelectorAll("[data-color-input]").forEach((el) => {
	el.onblur = el.onkeyup = el.oninput = proxyUpdate;
	function proxyUpdate(ev) {
		updateColorNum(el, ev.keyCode);
	}
});

//TODO: fix this
function updateColorNum(el, keycode) {
	if (keycode != null) {
		if (keycode != 13) return;
	}
	var isValid = true;
	var color;
	document.querySelectorAll("[data-color-input]").forEach((e) => {
		if (e.type == "number") {
			if (e == el) {
				if (e.id.includes("rgba")) {
					if (isValidNum(e.value) || e.value == "") {
						color = new Color({
							r: clamp(
								document.getElementById("color-rgba-r").value || 0,
								0,
								255
							),
							g: clamp(
								document.getElementById("color-rgba-g").value || 0,
								0,
								255
							),
							b: clamp(
								document.getElementById("color-rgba-b").value || 0,
								0,
								255
							),
						});
					} else {
						isValid = false;
					}
				} else if (e.id.includes("hsla")) {
					if (isValidNum(e.value) || e.value == "") {
						color = new Color({
							h: clamp(document.getElementById("color-hsla-h").value, 0, 360),
							s: clamp(document.getElementById("color-hsla-s").value, 0, 100),
							l: clamp(document.getElementById("color-hsla-l").value, 0, 100),
						});
					} else {
						isValid = false;
					}
				}
			}
		} else if (e.type == "text") {
			if (e == el) {
				if (isValidHex(e.value)) {
					color = new Color(e.value);
				} else {
					isValid = false;
				}
			}
		}
	});
	if (isValid) {
		setPickerColor(color);
		pickerColor = color;
		if (!pickerColor) return;
		updatePickerColor();
		canvasInterface.setColor(color, true);
	} else {
		updatePickerColor();
	}
}

var hueMoving = false;
var hThumb;
var hueRange;
var hueRect;

function hueThumb(e) {
	hueMoving = true;
}

function hueEndDrag(e) {
	hueMoving = false;
}

function hueDrag(e) {
	e.preventDefault();
	var x, y;
	if (e.touches) {
		x = e.touches[0].clientX - (hueRect ? hueRect.left : 0);
		y = e.touches[0].clientY - (hueRect ? hueRect.top : 0);
	} else {
		x = e.clientX - (hueRect ? hueRect.left : 0);
		y = e.clientY - (hueRect ? hueRect.top : 0);
	}
	if (hueMoving) {
		document.querySelectorAll("[data-color-input]").forEach((e) => {
			e.blur();
		});
		//pickerColor[0] = clamp((1 - (y / hueRect.height)), 0, 1) * 360

		pickerColor = new Color({
			h: (pickerColor[0] = clamp(x / hueRect.width, 0, 1) * 360),
			s: pickerColor.hsva.s,
			v: pickerColor.hsva.v,
			a: pickerColor.hsva.a,
		});
		hThumb.style.setProperty(
			"--pos",
			clamp((x / hueRect.width) * 100, 0, 100) + "%"
		);
		hThumb.style.setProperty("--posp", clamp(x / hueRect.width, 0, 1));
		updatePickerColor();
		canvasInterface.setColor(pickerColor, true);
	}
}

var valueMoving = false;
var valThumb;
var valueRange;
var valueRect;

var valueBuffer = [0, 0];
var valueTwoFinger = false;

var valueMoved;

var valueTwoFingerDist = 0;
var valueTwoFingerStartDist = 0;

function valueThumb(e) {
	var x, y;
	if (e.touches) {
		x = e.touches[0].clientX - (valueRect ? valueRect.left : 0);
		y = e.touches[0].clientY - (valueRect ? valueRect.top : 0);
	} else {
		x = e.clientX - (valueRect ? valueRect.left : 0);
		y = e.clientY - (valueRect ? valueRect.top : 0);
	}
	valueBuffer = [x, y];
	if (e.touches && e.touches.length > 1) {
		valueTwoFinger = true;
		valueTwoFingerStartDist = distance(
			e.touches[0].clientX,
			e.touches[1].clientX,
			e.touches[0].clientY,
			e.touches[1].clientY
		);
	}
	valueMoving = true;
	if (valueMoving && !valueTwoFinger) {
		document.querySelectorAll("[data-color-input]").forEach((e) => {
			e.blur();
		});
		//pickerColor[1] = clamp(x / valueRect.width * 100, 0, 100)
		//pickerColor[2] = 100 - clamp(y / valueRect.height * 100, 0, 100)
		pickerColor = new Color({
			h: pickerColor.hsva.h,
			s: clamp((x / valueRect.width) * 100, 0, 100),
			v: 100 - clamp((y / valueRect.height) * 100, 0, 100),
			a: pickerColor.hsva.a,
		});
		vThumb.style.setProperty(
			"--posX",
			clamp((x / valueRect.width) * 100, 0, 100) + "%"
		);
		vThumb.style.setProperty(
			"--posY",
			clamp((y / valueRect.height) * 100, 0, 100) + "%"
		);
		updatePickerColor();
		canvasInterface.setColor(pickerColor, true);
	}
}

function valueEndDrag(e) {
	if (!valueTwoFinger && e.touches && !valueMoved) {
		var x = valueBuffer[0],
			y = valueBuffer[1];
		if (valueMoving && !valueTwoFinger) {
			document.querySelectorAll("[data-color-input]").forEach((e) => {
				e.blur();
			});
			//pickerColor[1] = clamp(x / valueRect.width * 100, 0, 100)
			//pickerColor[2] = 100 - clamp(y / valueRect.height * 100, 0, 100)
			pickerColor = new Color({
				h: pickerColor.hsva.h,
				s: clamp((x / valueRect.width) * 100, 0, 100),
				v: 100 - clamp((y / valueRect.height) * 100, 0, 100),
				a: pickerColor.hsva.a,
			});
			vThumb.style.setProperty(
				"--posX",
				clamp((x / valueRect.width) * 100, 0, 100) + "%"
			);
			vThumb.style.setProperty(
				"--posY",
				clamp((y / valueRect.height) * 100, 0, 100) + "%"
			);
			updatePickerColor();
			canvasInterface.setColor(pickerColor, true);
		}
	}
	if (valueTwoFinger) {
		if (valueTwoFingerDist - valueTwoFingerStartDist > 50) {
			valueRange.classList.add("color-value-expanded");
			valueRect.width = 296;
		}
		if (valueTwoFingerStartDist - valueTwoFingerDist > 100) {
			valueRange.classList.remove("color-value-expanded");
			valueRect.width = 200;
		}
	}
	valueMoving = false;
	valueMoved = false;
	valueTwoFinger = false;
}

function valueDrag(e) {
	valueMoved = true;
	e.preventDefault();
	var x, y;
	if (e.touches) {
		x = e.touches[0].clientX - (valueRect ? valueRect.left : 0);
		y = e.touches[0].clientY - (valueRect ? valueRect.top : 0);
	} else {
		x = e.clientX - (valueRect ? valueRect.left : 0);
		y = e.clientY - (valueRect ? valueRect.top : 0);
	}
	if (valueMoving && !valueTwoFinger) {
		document.querySelectorAll("[data-color-input]").forEach((e) => {
			e.blur();
		});
		//pickerColor[1] = clamp(x / valueRect.width * 100, 0, 100)
		//pickerColor[2] = 100 - clamp(y / valueRect.height * 100, 0, 100)
		pickerColor = new Color({
			h: pickerColor.hsva.h,
			s: clamp((x / valueRect.width) * 100, 0, 100),
			v: 100 - clamp((y / valueRect.height) * 100, 0, 100),
			a: pickerColor.hsva.a,
		});
		vThumb.style.setProperty(
			"--posX",
			clamp((x / valueRect.width) * 100, 0, 100) + "%"
		);
		vThumb.style.setProperty(
			"--posY",
			clamp((y / valueRect.height) * 100, 0, 100) + "%"
		);
		updatePickerColor();
		canvasInterface.setColor(pickerColor, true);
	}
	if (valueTwoFinger) {
		valueTwoFingerDist = distance(
			e.touches[0].clientX,
			e.touches[1].clientX,
			e.touches[0].clientY,
			e.touches[1].clientY
		);
	}
}

class ColorSlider {
	constructor(el, value) {
		this.mode;
		if (value == "h" || value == "s" || value == "l") {
			this.mode = "hsla";
		} else if (value == "r" || value == "g" || value == "b") {
			this.mode = "rgba";
		}
		this.value = value;
		this.start = 0;
		this.enabled = false;
		this.el = el;
		this.inputElement = document.getElementById(
			"color-" + this.mode + "-" + this.value
		);
		this.min = this.inputElement.min;
		this.max = this.inputElement.max;
		this.boundingClientRect = this.el.getBoundingClientRect();
		this.width = this.boundingClientRect.width;
		document.addEventListener("pointerdown", handlePointerDown.bind(this), {
			passive: false,
		});
		document.addEventListener("pointermove", handlePointerMove.bind(this), {
			passive: false,
		});
		document.addEventListener("pointerup", handlePointerUp.bind(this), {
			passive: false,
		});

		this.startY = 0;
		this.rawValue;
		this.rawX = 0;
		this.pX = 0;

		this.startEffectPosition = 0;

		function handlePointerDown(e) {
			if (e.target == this.el || this.el.contains(e.target)) {
				this.rawX = e.clientX - this.boundingClientRect.left;
				this.startEffectPosition = e.clientY;
				this.pX = this.rawX;
				this.rawValue = (this.rawX / this.width) * this.max;

				this.inputElement.value = clamp(
					Math.floor(this.rawValue),
					this.min,
					this.max
				);
				this.inputElement.oninput(this.inputElement, null);
				this.enabled = true;
			}
		}
		function handlePointerMove(e) {
			if (this.enabled) {
				var pullDistance = 200;
				let deltaMultiplier = this.startEffectPosition - e.clientY;

				deltaMultiplier = pullDistance - Math.abs(deltaMultiplier);

				deltaMultiplier = clamp(deltaMultiplier / pullDistance, 0.1, 1);

				let delta = this.pX - (e.clientX - this.boundingClientRect.left);

				this.rawX -= delta * deltaMultiplier;
				this.rawValue = (this.rawX / this.width) * this.max;

				this.inputElement.value = clamp(
					Math.floor(this.rawValue),
					this.min,
					this.max
				);
				this.pX = e.clientX - this.boundingClientRect.left;
				this.inputElement.oninput(this.inputElement, null);
			}
		}
		function handlePointerUp(e) {
			this.enabled = false;
		}
	}
}

function updatePickerColor() {
	var colorCurrent = document.getElementById("color-current");
	var rEl = document.getElementById("color-rgba-r");
	var gEl = document.getElementById("color-rgba-g");
	var bEl = document.getElementById("color-rgba-b");
	var hEl = document.getElementById("color-hsla-h");
	var sEl = document.getElementById("color-hsla-s");
	var lEl = document.getElementById("color-hsla-l");
	var hexEl = document.getElementById("color-hex");
	document.documentElement.style.setProperty(
		"--currentColor",
		`hsla( ${pickerColor.hsla.h}, ${pickerColor.hsla.s}%, ${pickerColor.hsla.l}%, ${pickerColor.hsla.a}%)`
	);
	rEl.value = pickerColor.rgba.r;
	gEl.value = pickerColor.rgba.g;
	bEl.value = pickerColor.rgba.b;
	hEl.value = Math.round(pickerColor.hsla.h);
	sEl.value = Math.round(pickerColor.hsla.s);
	lEl.value = Math.round(pickerColor.hsla.l);
	hexEl.value = pickerColor.hex;
	var hex = pickerColor.hexh;
	//set document root css variables r to current r value, rp to current r percentage etc
	document.documentElement.style.setProperty("--r", pickerColor.rgba.r);
	document.documentElement.style.setProperty("--g", pickerColor.rgba.g);
	document.documentElement.style.setProperty("--b", pickerColor.rgba.b);
	document.documentElement.style.setProperty(
		"--rp",
		(pickerColor.rgba.r / 255) * 100 + "%"
	);
	document.documentElement.style.setProperty(
		"--gp",
		(pickerColor.rgba.g / 255) * 100 + "%"
	);
	document.documentElement.style.setProperty(
		"--bp",
		(pickerColor.rgba.b / 255) * 100 + "%"
	);
	document.documentElement.style.setProperty("--h", pickerColor.hsla.h);
	document.documentElement.style.setProperty("--s", pickerColor.hsla.s);
	document.documentElement.style.setProperty("--l", pickerColor.hsla.l);
	document.documentElement.style.setProperty(
		"--hp",
		(pickerColor.hsla.h / 360) * 100 + "%"
	);
	document.documentElement.style.setProperty(
		"--sp",
		(pickerColor.hsla.s / 100) * 100 + "%"
	);
	document.documentElement.style.setProperty(
		"--lp",
		(pickerColor.hsla.l / 100) * 100 + "%"
	);
}

var clickedOnce = false;
var colPreviewTimeout;

function colorPreviewClickHandler(e) {
	notify.log("Smart Palette Created");
	e.preventDefault();
	if (!clickedOnce) {
		clickedOnce = true;
		colPreviewTimeout = setTimeout(() => {
			debug.log("double failed");
			clickedOnce = false;
		}, 1000);
	} else {
		let col = chroma(canvasInterface.color.hex);
		let rgba = [col.rgba()[0], col.rgba()[1], col.rgba()[2], 255];
		let pal;
		if (chroma.contrast(col, "black") < chroma.contrast(col, "white")) {
			if (col.temperature() < 10000) {
				pal = chroma.scale([
					col,
					col
						.set("hsv.h", "*.35")
						.set("hsv.v", "*2.75")
						.set("hsv.s", "*.35")
						.hex(),
				]);
			} else {
				pal = chroma.scale([
					col,
					col
						.set("lch.l", "*.15")
						.set("lch.c", "*50")
						.set("lch.h", "*10")
						.hex(),
				]);
			}
		} else {
			pal = chroma.scale([col, col]);
			if (col.hsv()[0] >= 0 && col.hsv()[0] <= 36) {
				pal = chroma.scale([
					col,
					col.set("hsv.h", "-60").set("hsv.s", "*3").set("hsv.v", "*.3").hex(),
				]);
			} else if (col.hsv()[0] > 36 && col.hsv()[0] <= 65) {
				//sunset gradient w yellow
				pal = chroma.scale([
					col,
					col.set("hsv.h", "*5").set("hsv.v", "*.25").set("hsv.s", "*15").hex(),
				]);
			} else if (col.hsv()[0] > 65 && col.hsv()[0] <= 120) {
				pal = chroma.scale([
					col,
					col.set("lch.l", "*.35").set("lch.c", "*3").set("lch.h", "*20").hex(),
				]);
			} else if (col.hsv()[0] > 120 && col.hsv()[0] <= 180) {
				pal = chroma.scale([
					col,
					col.set("lch.l", "*.15").set("lch.c", "*3").set("lch.h", "*20").hex(),
				]);
			} else if (col.hsv()[0] > 180 && col.hsv()[0] <= 230) {
				pal = chroma.scale([
					col,
					col.set("hsv.h", "*1.3").set("hsv.s", "*2").set("hsv.v", "*.4").hex(),
				]);
			} else if (col.hsv()[0] > 230 && col.hsv()[0] <= 330) {
				pal = chroma.scale([
					col,
					col.set("hsv.h", "-50").set("hsv.s", "*3").set("hsv.v", "*.3").hex(),
				]);
			} else if (col.hsv()[0] > 330 && col.hsv()[0] <= 360) {
				pal = chroma.scale([
					col,
					col.set("hsv.h", "-60").set("hsv.s", "*3").set("hsv.v", "*.3").hex(),
				]);
			}
		}
		pal = pal.mode("lch").correctLightness().colors(8);
		let rgbPal = pal.map((e) => {
			return hexToRGB(e);
		});
		new paletteGroup(paletteName(pal), pal, true);
		clearTimeout(colPreviewTimeout);
		clickedOnce = false;
	}
}

document.body.onmousemove = (e) => {
	valueDrag(e);
	hueDrag(e);
};

document.body.onmouseup = (e) => {
	valueEndDrag(e);
	hueEndDrag(e);
};

function setPickerColor(color) {
	//let convHSV = RGBToHSV(rgba)
	var newPickerColor = [color.hsva.h, color.hsva.s, color.hsva.v, color.hsva.a];
	vThumb.style.setProperty("--posX", color.hsva.s + "%");
	vThumb.style.setProperty("--posY", 100 - color.hsva.v + "%");
	hThumb.style.setProperty("--pos", (color.hsva.h / 360) * 100 + "%");
	hThumb.style.setProperty("--posp", 1 - color.hsva.h / 360);
	pickerColor = color;
	updatePickerColor();
}

var previousPrevious = null;

function updatePrevious(col) {
	document.documentElement.style.setProperty("--previousColor", col.hex);
	document.getElementById("color-previous").onclick = () => {
		canvasInterface.setColor({ ...col });
	};
	if (previousPrevious != null) {
		if (previousPrevious == col) return;
		else {
			let e = document.createElement("div");
			e.setAttribute("data-palette-color", previousPrevious.hexh);
			e.classList.add("palette-color");
			e.style.setProperty("--color", previousPrevious.hex);
			var color = { ...previousPrevious };
			e.addEventListener("click", () => {
				window.canvasInterface.setColor(color);
			});
			//only prepend if it's not already there
			if (
				!document
					.getElementById("color-menu-recent-colors")
					.querySelector(`[data-palette-color="${previousPrevious.hexh}"]`)
			)
				document.getElementById("color-menu-recent-colors").prepend(e);
		}
	}
	previousPrevious = col;
}

function dragOverHandler(e) {
	document
		.getElementById("color-menu-drop-effect")
		.classList.add("color-menu-drop-effect-on");

	e.preventDefault();
	e.stopPropagation();
}

function dragLeaveHandler(e) {
	document
		.getElementById("color-menu-drop-effect")
		.classList.remove("color-menu-drop-effect-on");

	e.preventDefault();
	e.stopPropagation();
}

async function dropHandler(e) {
	document
		.getElementById("color-menu-drop-effect")
		.classList.remove("color-menu-drop-effect-on");

	e.preventDefault();
	e.stopPropagation();

	const dt = e.dataTransfer;
	if (!dt) return;
	if (dt.items) {
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

async function getAllFileEntries(dataTransferItemList) {
	let fileEntries = [];
	let queue = [];
	for (let i = 0; i < dataTransferItemList.length; i++) {
		const entry = dataTransferItemList[i].webkitGetAsEntry();
		if (entry) {
			queue.push(entry);
		}
	}
	while (queue.length > 0) {
		let entry = queue.shift();
		if (entry.isFile) {
			fileEntries.push(entry);
		} else if (entry.isDirectory) {
			return false;
		}
	}
	return fileEntries;
}

const colorThief = new ColorThief();

function addPaletteViewsFromFiles(files) {
	files.forEach((file, i) => {
		if (file.type.startsWith("image/")) {
			var el = document.createElement("img");
			el.src = URL.createObjectURL(file);
			el.alt = file.name;
			el.style.width = "100px";
			el.style.display = "none";
			el.onload = (e) => {
				var colors = colorThief.getPalette(el, 20);
				var finCol = [];
				if (colors) {
					colors.forEach((e) => {
						e.push(255);
						finCol.push({
							red: e[0] / 255,
							green: e[1] / 255,
							blue: e[2] / 255,
						});
					});
					var palette = formatAnyPalette(AnyPalette.uniqueColors(finCol)).map(
						(e) => {
							return new Color({ r: e[0], g: e[1], b: e[2], a: e[3] }).hex;
						}
					);
					new paletteGroup(truncate(el.alt), palette, true);
				} else {
					document
						.getElementById("color-menu-drop-err")
						.classList.add("color-menu-drop-err-on");
					setTimeout(() => {
						document
							.getElementById("color-menu-drop-err")
							.classList.remove("color-menu-drop-err-on");
					}, 2000);
				}
				document.body.removeChild(el);
			};
			document.body.appendChild(el);
		} else {
			setTimeout(function () {
				AnyPalette.loadPalette(
					file,
					function (err, palette, formatUsed, matchedFileExtension) {
						if (palette) {
							var finPalette = formatAnyPalette(
								AnyPalette.uniqueColors(palette)
							).map((e) => {
								return new Color({ r: e[0], g: e[1], b: e[2], a: e[3] }).hex;
							});
							new paletteGroup(
								truncate(
									file.name.replaceArray(
										formatUsed.fileExtensionsPretty.split(", "),
										""
									)
								),
								finPalette,
								true
							);
						}
						if (err) {
							document
								.getElementById("color-menu-drop-err")
								.classList.add("color-menu-drop-err-on");
							setTimeout(() => {
								document
									.getElementById("color-menu-drop-err")
									.classList.remove("color-menu-drop-err-on");
							}, 2000);
						}
					}
				);
			}, i * 100);
		}
	});
}

function formatAnyPalette(palette) {
	let pal = [];
	palette.forEach((e) => {
		pal.push([
			clamp(Math.round(e.red * 255), 0, 255),
			clamp(Math.round(e.green * 255), 0, 255),
			clamp(Math.round(e.blue * 255), 0, 255),
			255,
		]);
	});
	return pal;
}

var defaultPalettes = [
	{
		title: "Lospec Snackbar",
		creator: "Isa",
		colors: [
			"#0b2458",
			"#0c5c67",
			"#12916b",
			"#27e931",
			"#fff34f",
			"#f6c23b",
			"#e97b21",
			"#d44b49",
			"#a21839",
			"#5d093a",
			"#3e0346",
			"#7d1475",
			"#ba2e89",
			"#f481b0",
			"#eeb8b4",
			"#9756c7",
			"#2c226e",
			"#11073a",
			"#2424af",
			"#4b7cdb",
			"#6acaf4",
			"#86ffed",
			"#fff7e9",
			"#ffd8a5",
			"#dd9c60",
			"#752314",
			"#4b050a",
			"#2c0008",
			"#35281f",
			"#3c3c3c",
			"#7f7f7f",
			"#b8a7b9",
			
		],
	}
];

function clearPalettes() {
	filePalettes = [];
	var palettes = document.getElementById("palettes");
	palettes.textContent = "";
}
var setCurrent = false;

var filePalettes = [];

class paletteGroup {
	constructor(title, palette, creator, scroll) {
		if (scroll) {
			setPickerMode("palette");
		}
		var pal = {
			title: title,
			colors: palette,
		};
		filePalettes.push(pal);
		var id = randomString(7);
		var paletteParent = document.getElementById("palettes");
		var group = document.createElement("div");
		group.classList.add("color-palette-group");
		group.setAttribute("data-palette-id", id);
		var headerEl = document.createElement("div")
		headerEl.classList.add("color-palette-header")
		group.appendChild(headerEl)
		var titleEl = document.createElement("h2");
		titleEl.classList.add("color-palette-title");
		titleEl.innerHTML = title;
		headerEl.appendChild(titleEl);

		var menu = document.createElement("button");
		menu.classList.add("color-palette-menu-button");
		menu.innerHTML = "<i class='hi-three-dots'></i>";

		headerEl.appendChild(menu);

		var colorMenu = document.createElement("div");
		colorMenu.classList.add("ui");
		colorMenu.classList.add("color-palette-menu");
		group.appendChild(colorMenu);
		paletteParent.appendChild(group);


		palette.forEach((x, i) => {
			var color = new Color(x);
			if (!setCurrent && typeof canvasInterface !== "undefined") {
				setCurrent = true;
			}
			let e = document.createElement("div");
			e.setAttribute("data-palette-color", color.hexh);
			if (scroll) {
				e.style.opacity = 0;
				e.style.transitionDelay = (1000 / palette.length / 3) * i + "ms";
				setTimeout(() => {
					e.style.opacity = 1;
				}, 200);
			}
			e.innerHTML = color.name;
			e.style.color = color.contrastingColor;
			e.classList.add("palette-color");
			e.style.setProperty("--color", color.hex);
			e.addEventListener("click", () => {
				pickerColor = color;
				updatePickerColor();
				canvasInterface.setColor(color);
			});
			colorMenu.appendChild(e);
		});

		canvasInterface.setColor(new Color(palette[0]));
		var rect = colorMenu.getBoundingClientRect();
		var colorMenu = document.getElementById("color-menu");
		if (scroll)
			document
				.getElementById("color-menu-palette-panel")
				.scrollTo({ behavior: "smooth", top: colorMenu.scrollTop + rect.top });
	}
}

function preparePalette() {
	window.colors.forEach((g) => {
		var title = truncate(g.title);
		var palette = g.colors;
		new paletteGroup(title, palette, g.creator);
	});
}

function setPickerMode(m) {
	document.querySelectorAll(".color-menu-panel").forEach((e) => {
		e.classList.remove("color-menu-panel-visible");
	});
	document
		.getElementById(`color-menu-${m}-panel`)
		.classList.add("color-menu-panel-visible");
	document.querySelectorAll(".color-menu-tabbar-button").forEach((e) => {
		e.classList.remove("color-menu-tabbar-button-active");
	});
	document
		.getElementById(`color-mode-${m}`)
		.classList.add("color-menu-tabbar-button-active");
}

function initEyedropper(clientX, clientY) {
	
	canvasInterface.eyedropperPreviewElement.style.top = clientY + "px";
	canvasInterface.eyedropperPreviewElement.style.left = clientX + "px";
	canvasInterface.eyedropperPreviewElement.classList.add(
		"eyedropper-preview-visible"
	);
}