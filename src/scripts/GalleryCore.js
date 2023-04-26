var settings = {
	background: {
		width: 4, //size in px
		height: 4, //size in px
		colorOne: "#f0f0f0",
		colorTwo: "#d4d4d4",
		colorOne: "#ffffff",
		colorTwo: "#f0f0f0",
	},
	ui: {
		canvasScale: 2,
		angle: 0,
		transformX: 0,
		transformY: 0,
	},
	cursors: {
		pen: "crosshair",
		eyedropper: "eyedropper",
		fillBucket: "fillbucket",
	},
	tools: {
		assignments: {
			pen: ["penBrushSize", "brushSquare", "brushPixelPerfect"],
			eraser: ["eraserBrushSize", "brushSquare", "brushPixelPerfect"],
			sprayPaint: ["sprayBrushSize", "brushSquare", "spraySpeed", "spraySize"],
			fillBucket: ["contiguous"],
		},
		penBrushSize: {
			title: "Brush Size",
			value: 1,
			type: "int",
			draggable: true,
			min: 1,
			max: 100,
			unit: "px",
			callback: "settings.tools.penBrushSize.value = this.value",
		},
		eraserBrushSize: {
			title: "Brush Size",
			value: 1,
			type: "int",
			draggable: true,
			min: 1,
			max: 100,
			unit: "px",
			callback: "settings.tools.eraserBrushSize.value = this.value",
		},
		sprayBrushSize: {
			title: "Brush Size",
			value: 1,
			type: "int",
			draggable: true,
			min: 1,
			max: 100,
			unit: "px",
			callback: (e) => {
				settings.tools.sprayBrushSize.value = e.value;
			},
		},
		brushSquare: {
			title: "Square Brush",
			value: false,
			type: "bool",
			callback: "settings.tools.brushSquare.value = this.checked",
		},
		brushSmoothing: {
			title: "Brush Smoothness",
			value: 0,
			type: "int",
			draggable: true,
			min: 0,
			max: 100,
			unit: "px",
			callback: "settings.tools.brushSmoothing.value = this.value",
		},
		brushPixelPerfect: {
			title: "Pixel Perfect",
			value: false,
			type: "bool",
			callback: "settings.tools.brushPixelPerfect.value = this.value",
		},
		shapeFilled: {
			value: false,
			type: "bool",
		},
		spraySpeed: {
			title: "Spray Speed",
			value: 1,
			type: "int",
			draggable: true,
			min: 1,
			max: 100,
			unit: "px",
			callback: "settings.tools.spraySpeed.value = this.value",
		},
		spraySize: {
			title: "Spray Size",
			value: 10,
			type: "int",
			draggable: true,
			min: 1,
			max: 100,
			unit: "px",
			callback:
				"settings.tools.spraySize.value = this.value; createSprayPoints();",
		},
		contiguous: {
			title: "Contiguous",
			value: true,
			type: "bool",
			callback: "settings.tools.contiguous.value = this.checked",
		},
	},
};

var project = {
	palettes: null,
	currColor: null,
	width: null,
	height: null,
	layers: null,
};

var lc = [];
var preview = true;

var isMobile = window.matchMedia("(pointer: coarse)").matches;

window.onload = async function () {
	debug = new Alrt({
		position: "bottom-left",
		duration: 2000,
		theme: "alrt-default-light",
	});
	notify = new Alrt({
		position: "top-center",
		duration: 5000, //default duration
		theme: "bitshift-confirmation",
		behavior: "overwrite",
	});
	const namedCols = window.namedColors.reduce(
		(o, { name, hex }) => Object.assign(o, { [name]: hex }),
		{}
	);
	nCol = nearestColor.from(namedCols);
	window.colors = defaultPalettes;

	refreshAllNumberDraggables();

	setTheme(localStorage.getItem("theme") || "ui-theme-dark");
	setAccent(localStorage.getItem("accent") || "ui-accent-blue");
	window.numberPad = new NumberInputKeypad();
	populatePresets();

	const {
		data: { user },
	} = await supabase.auth.getUser();
};
function populateProjects() {
	document.getElementById("galleryWrapper").innerHTML =
		"<i class='hi-loading-outline loading-icon'></i>";
	queryProjects().then(() => {
		document.getElementById("galleryWrapper").innerHTML = "";
		[...window.allLoadedProjects].reverse().forEach((project) => {
			new ProjectCard(project);
		});
	});
}
class ProjectCard {
	constructor(project) {
		this.project = project;
		this.orientation = "";
		if (project.data.width > project.data.height) {
			this.orientation = "--width: var(--maxSize)";
		} else if (project.data.width < project.data.height) {
			this.orientation = "--height: var(--maxSize)";
		} else {
			this.orientation = "--width: var(--maxSize); --height: var(--maxSize)";
		}
		this.card = document.createElement("button");
		this.card.classList.add("galleryCard");
    
    this.doubleClick = false;
		this.card.onclick = () => {
      if(isMobile) {
        openProject(this.project.id)
      }else {
        if(this.doubleClick) {
          openProject(this.project.id)
        }
        this.doubleClick = true
        setTimeout(() => {
          this.doubleClick = false
        }, 200)
      }
		};

		this.cardImage = document.createElement("div");
		this.cardImage.classList.add("cardImage");
		this.card.style = this.orientation;

		this.cardImageImg = document.createElement("img");
		this.cardImageImg.src = project.data.previewImage;
		this.cardImageImg.alt = "";

		this.cardTitleWrapper = document.createElement("div")
		this.cardTitleWrapper.classList.add("card-title-wrap")
		this.cardOptionsButton = document.createElement("button")
		this.cardOptionsButton.classList.add("card-options")
		this.cardOptionsButton.onclick = ()=>{ 
			console.log("asdfasdf")
		}
		

		this.cardTitle = document.createElement("div");
    this.cardTitle.setAttribute('contenteditable', 'false')
		this.cardTitle.classList.add("cardTitle");
		this.cardTitle.innerText = project.name;
		this.cardTitle.title = project.name
    this.cardTitle.spellcheck = false;

    
    this.cardTitle.onkeydown = function(e) {
      if(e.key == "Enter"){
        this.cardTitle.blur()
      }
    }.bind(this)
    this.cardTitle.onblur = function(e) {
      notify.log(this.cardTitle.innerHTML)
      this.cardTitle.style.pointerEvents = "none";
      this.project.data.name = this.cardTitle.innerHTML
      updateProject(this.project.id, this.project.data)
    }.bind(this)

		this.cardDetails = document.createElement("div");
		this.cardDetails.classList.add("cardDetails");
		this.cardDetails.innerText = `${project.data.width}px x ${project.data.height}px`;

		this.cardImage.appendChild(this.cardImageImg);
		this.card.appendChild(document.createElement("br"));
		var div = document.createElement("div");
		this.cardTitleWrapper.appendChild(this.cardTitle)
		this.cardTitleWrapper.appendChild(this.cardOptionsButton)
		div.appendChild(this.cardTitleWrapper);
		div.appendChild(this.cardDetails);
		this.card.appendChild(this.cardImage);
		this.card.appendChild(div);
		document.getElementById("galleryWrapper").appendChild(this.card);

    var contextMenu = new ContextMenu(this.card, {
      buttons: [
        {
          icon: "pencil",
          title: "Rename",
          action: function () {
            this.cardTitle.setAttribute('contenteditable', 'true')
            this.cardTitle.focus();
            this.cardTitle.style.pointerEvents = "auto";
          }.bind(this),
        },
        { type: "divider" },
        {
          color: "red",
          icon: "trash",
          title: "Delete",
          action: function () {
            //this.delete();
            new ConfirmModal("Delete Project", "Are you sure you want to delete this project? This cannot be undone.", "Delete", "Cancel", this.delete.bind(this), null)
          }.bind(this),
        },
      ],
      touchTarget: this.previewCanvas,
	  onRightClick: false,
	  buttonTarget: this.cardOptionsButton,
	  contextPlacement: "bottom"
    });
	}
  delete() { 
    deleteProject(this.project.id)
  }
}
function openProject(id) {
	window.location.href = "/draw#" + id;
}

function saveData() {
	/*
    project = {
        'name': projName,
        'palettes': filePalettes,
        'currColor': canvasInterface.color,
        'width': canvasInterface.width,
        'height': canvasInterface.height,
        'layers': layers.reverse()
    }
    localStorage.setItem('pc-canvas-data', JSON.stringify(project));*/
}

var presets = [
	[16, 16],
	[32, 32],
	[64, 64],
	[128, 128],

	[256, 256],
	[512, 512],
	[1024, 1024],

	[256, 256],
	[512, 512],
	[1024, 1024],

	[160, 144, "Gameboy"],
	[240, 160, "GBA"],
	[256, 240, "NES"],
	[256, 225, "SNES"],
	[320, 224, "Genesis"],
];

function setPreset(w, h, el) {
	document.querySelectorAll(".file-preset-active").forEach((e) => {
		e.classList.remove("file-preset-active");
	});
	el.classList.add("file-preset-active");
	document.getElementById("width").value = w;
	document.getElementById("height").value = h;
}

function populatePresets() {
	var parent = document.getElementById("file-presets");

	for (let i = 0; i < presets.length; i++) {
		let preset = presets[i];
		parent.innerHTML += `<button class="file-preset" onclick="setPreset(${
			preset[0]
		}, ${preset[1]}, this)">
          <i class="hi-file"></i>
          ${
						preset[2]
							? `<h1>${preset[2]}</h1>`
							: `<h1 style="opacity: 0; visibility: hidden">+</h1>`
					}
          <h2>${preset[0]} x ${preset[1]}</h2>
        </button>`;
	}
}
var projName = "";

function renameProject(el) {
	if (el.value == "" || el.value == null) {
		return;
	} else {
		projName = el.value;
	}
}

var ev = new Event("build");

document.dispatchEvent(ev);

document.addEventListener("asdfasdf", (e) => {
	console.alert("asdfasdfasdfa");
});
function f() {
	document.getElementById("galleryContent").classList.toggle("visible");
	document.getElementById("editorContent").classList.toggle("visible");
}
