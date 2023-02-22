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
  document.getElementById("galleryWrapper").innerHTML = "<i class='hi-loading-outline loading-icon'></i>";
  queryProjects().then(() => {
    document.getElementById("galleryWrapper").innerHTML = "";
    [...window.allLoadedProjects].reverse().forEach((project) => {
      console.log(project.name);
      var orientation = "";
      if (project.data.width > project.data.height) {
        orientation = "--width: var(--maxSize)";
      } else if (project.data.width < project.data.height) {
        orientation = "--height: var(--maxSize)";
      } else {
        orientation = "--width: var(--maxSize); --height: var(--maxSize)";
      }
      var html = `
			<button class="galleryCard" onclick="openProject('${project.id}')">
			  <br><div class="cardImage" style="${orientation}">
				<img src="${project.data.previewImage}" alt="">
			  </div><div>
			  <div class="cardTitle">${project.name}</div>
			  <div class="cardDetails">${project.data.width}px x ${project.data.height}px</div>
			  </div></button>
			`;
      document.getElementById("galleryWrapper").innerHTML += html;
    });
  });
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
