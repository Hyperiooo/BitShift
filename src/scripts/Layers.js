class Layer {
  constructor(name, data, settings) {
    this.index = layers.length;
    this.id = randomString(10);
    this.name = name || "Layer " + layers.length;
    this.data = data || null;
    layers.unshift(this);
    if (settings) {
      this.settings = {
        visible: settings.visible == undefined ? true : settings.visible,
        locked: settings.locked == undefined ? false : settings.locked,
        alpha: settings.alpha == undefined ? false : settings.alpha,
      };
    } else {
      this.settings = {
        visible: true,
        locked: false,
        alpha: false,
      };
    }

    this.previousIndex = this.index;

    this.layerElement = document.createElement("div");
    this.layerElement.classList.add("layer-wrap");
    this.layerElement.style.setProperty("--offsetX", `0px`);
    this.layerElement.style.setProperty("--offsetY", `0px`);
    this.layerElement.id = "l-" + this.id;

    this.svgWrapper = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    this.svgWrapper.classList.add("layerWrapperWrapper");
    this.svgWrapper.setAttribute(
      "viewBox",
      "0 0 " + window.innerWidth + " " + window.innerHeight
    );
    this.svgWrapper.setAttribute("customcursor", "true");
    this.foreignObject = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "foreignObject"
    );
    this.foreignObject.classList.add("drawingCanvas");

    this.previewCanvas = document.createElement("canvas");
    this.previewCanvas.classList.add("layer-preview");
    this.previewCanvas.width = project.width;
    this.previewCanvas.height = project.height;

    this.title = document.createElement("div");
    this.title.classList.add("layer-name");

    this.titleInput = document.createElement("input");
    this.titleInput.type = "text";
    this.titleInput.value = this.name;
    this.titleInput.onkeydown = function(e) {
      if(e.key == "Enter"){
        this.titleInput.blur()
      }
    }.bind(this)
    this.titleInput.onblur = function(e) {
      this.name = this.titleInput.value
      this.title.style.pointerEvents = "none";
    }.bind(this)
    this.title.appendChild(this.titleInput);

    this.layerElement.appendChild(this.previewCanvas);
    this.previewCTX = this.previewCanvas.getContext("2d");
    this.layerElement.appendChild(this.title);

    this.visButton = document.createElement("button");
    this.visButton.classList.add("layer-visibility");
    this.visButton.setAttribute(
      "onclick",
      `toggleLayerVisibility('${this.id}', this)`
    );

    this.visIcon = document.createElement("i");
    this.visIcon.classList.add("hi-eye");

    this.visButton.appendChild(this.visIcon);

    this.lockButton = document.createElement("button");
    this.lockButton.classList.add("layer-locked");
    this.lockButton.setAttribute(
      "onclick",
      `toggleLayerLock('${this.id}', this)`
    );

    this.lockIcon = document.createElement("i");
    this.lockIcon.classList.add("hi-lock-open");

    this.lockButton.appendChild(this.lockIcon);

    this.layerElement.appendChild(this.visButton);

    this.layerElement.appendChild(this.lockButton);

    this.canvasElement = document.createElement("canvas");
    this.canvasElement.setAttribute("customcursor", "");
    this.canvasElement.width = project.width;
    this.canvasElement.height = project.height;
    this.canvasElement.classList.add("drawingCanvas");
    this.canvasElement.id = "c-" + this.id;
    this.svgWrapper.style.setProperty("--zindex", layers.length);
    updateAllIndices();
    this.ctx = this.canvasElement.getContext("2d");
    this.svgWrapper.appendChild(this.foreignObject);
    this.foreignObject.appendChild(this.canvasElement);
    document.getElementById("layerParent").prepend(this.svgWrapper);

    let img = new Image();
    img.setAttribute("src", this.data);
    img.addEventListener("load", function () {
      _self.ctx.drawImage(img, 0, 0);
      _self.previewCanvas.getContext("2d").drawImage(img, 0, 0);
    });

    var contextMenu = new ContextMenu(this.layerElement, {
      buttons: [
        {
          icon: "pencil",
          title: "Rename",
          action: function () {
            this.titleInput.focus();
            this.title.style.pointerEvents = "auto";
          }.bind(this),
        },
        { type: "divider" },
        {
          icon: "lock",
          title: "Alpha Lock",
          action: function () {
            this.settings.alpha = !this.settings.alpha;
          }.bind(this),
        },
        { type: "divider" },
        {
          color: "red",
          icon: "trash",
          title: "Delete",
          action: function () {
            this.delete();
          }.bind(this),
        },
      ],
      touchBehavior: "tap",
      touchTarget: this.previewCanvas,
      beforeTouchContext: function () {
        return layer == this;
      }.bind(this),
    });

    this.previewOffset = 0;
    this.layerTop =
      (layers.length - this.index - 1) * layerHeight +
      layerMargin * (layers.length - this.index - 1); //the height that the element would be if it werent moving
    this.absoluteTop = this.layerTop; //the current absolute height of the element, including everything

    this.containerRect = layerMain.getBoundingClientRect();
    //set top variable
    this.layerElement.style.setProperty("--top", `${this.absoluteTop}px`);
    var _self = this;
    var clickOnce = false;
    this.layerElement.onpointerdown = function (e) {
      //sets startingTouchPosition to mouse position if there is mouse position, or touch position if theres a touch position. array of [x,y]
      startingTouchPosition = [e.clientX, e.clientY];
      _self.timeout = setTimeout(function () {
        _self.moving = true;
        _self.layerElement.classList.add("moving");
        _self.layerElement.classList.add("movingIndex");
        boundingRect = _self.layerElement.getBoundingClientRect();
        distanceBetweenPointerAndCenterOfBoundingRect = [
          (boundingRect.left + boundingRect.right) / 2 -
            startingTouchPosition[0],
          (boundingRect.top + boundingRect.bottom) / 2 -
            startingTouchPosition[1],
        ];
        inAnimating = true;

        pickedUp = true;

        beginningScroll = layerMain.scrollTop;
        requestAnimationFrame(animateIn);
      }, 400);
    };
    this.layerElement.onpointerup = function (e) {
      if (clickOnce && e.pointerType == "mouse") {
        _self.titleInput.focus();
        _self.title.style.pointerEvents = "auto";
      }

      clickOnce = true;

      _self.doubleTimeout = setTimeout(() => {
        clickOnce = false;
      }, 200);
      clearTimeout(_self.timeout);

      _self.layerElement.classList.remove("moving");
      _self.layerElement.classList.add("movingIndex");
      animateScroll = false;
      clearInterval(animateScrollInterval);
      _self.endAnimating = true;
      centerAnimating = false;
      inAnimating = false;
      if (movingLayer) {
        unshiftAllLayers();
        clearPreviewLayerPosition();
        _self.updateLayerOrder();
      }
      requestAnimationFrame(animateOut);
      if (!pickedUp) {
        //it can be assumed that the element was sohrt tapped
        setLayer(_self.id);
      }
      if (pickedUp && !movingLayer) {
        //addLayerToSelection
        _self.layerElement.classList.add("layer-selection");
      }
      pickedUp = false;
      movingLayer = false;
      deltaMovingX = 0;
      deltaMovingY = 0;
      centerCorrection = [0, 0];
      distanceBetweenPointerAndCenterOfBoundingRect = [0, 0];
    };
    this.endAnimating = false;
    var inAnimating = false;
    var centerAnimating = false;
    var boundingRect = this.layerElement.getBoundingClientRect();
    var distanceBetweenPointerAndCenterOfBoundingRect = [0, 0];
    var centerCorrection = [0, 0];
    var scale = 1;
    var targetScale = 1.05;
    var smallScale = 0.6;
    var pickedUp = false;
    var movingLayer = false;
    var moveThreshold = 70; //threshold before the layer thinks that its tryna be moved
    var scrollPercentage = 0.2;
    var maxScrollSpeed = 10;
    var beginningScroll = 0;
    function animateOut() {
      //gets current value of offsetx and offsety & converts to integers, pruning px
      var offsetX = parseInt(
        _self.layerElement.style.getPropertyValue("--offsetX").replace("px", "")
      );
      var offsetY = parseInt(
        _self.layerElement.style.getPropertyValue("--offsetY").replace("px", "")
      );
      scale = lerp(scale, 1, 0.25);
      //lerp between offsetx and offset y and 0
      offsetX = lerp(offsetX, 0, 0.25);
      offsetY = lerp(offsetY, 0, 0.25);
      //sets offsetx and offsety to new values
      _self.layerElement.style.setProperty("--offsetX", `${offsetX}px`);
      _self.layerElement.style.setProperty("--offsetY", `${offsetY}px`);

      _self.absoluteTop = _self.layerTop + offsetY;
      _self.updateLayerPosition();

      _self.layerElement.style.setProperty("--s", `${scale}`);
      //if theres a change in offset, keep animating
      if (
        Math.abs(offsetX) < 0.01 &&
        Math.abs(offsetY) < 0.01 &&
        Math.abs(scale - 1) < 0.001
      ) {
        _self.endAnimating = false;
        _self.layerElement.classList.remove("movingIndex");

        _self.moving = false;
      }
      if (_self.endAnimating) {
        requestAnimationFrame(animateOut);
      }
    }

    function animateIn() {
      if (!inAnimating || centerAnimating) return;
      //gets current value of offsetx and offsety & converts to integers, pruning px
      //lerp between offsetx and offset y and 0

      scale = lerp(scale, targetScale, 0.1);
      //sets offsetx and offsety to new values

      _self.layerElement.style.setProperty("--s", `${scale}`);
      //if theres a change in offset, keep animating
      if (Math.abs(scale - targetScale) < 0.01) {
        inAnimating = false;
      }
      if (inAnimating) {
        requestAnimationFrame(animateIn);
      }
    }
    function animateCenterOffset() {
      if (!centerAnimating) return;
      centerCorrection[0] = lerp(
        centerCorrection[0],
        -distanceBetweenPointerAndCenterOfBoundingRect[0],
        0.1
      );
      centerCorrection[1] = lerp(
        centerCorrection[1],
        -distanceBetweenPointerAndCenterOfBoundingRect[1],
        0.1
      );
      _self.layerElement.style.setProperty(
        "--offsetX",
        `${centerCorrection[0] + deltaMovingX}px`
      );
      _self.layerElement.style.setProperty(
        "--offsetY",
        `${
          centerCorrection[1] +
          deltaMovingY +
          (layerMain.scrollTop - beginningScroll)
        }px`
      );

      _self.absoluteTop =
        _self.layerTop +
        centerCorrection[1] +
        deltaMovingY +
        (layerMain.scrollTop - beginningScroll);
      _self.updateLayerPosition();
      scale = lerp(scale, smallScale, 0.1);
      //sets offsetx and offsety to new values

      _self.layerElement.style.setProperty("--s", `${scale}`);
      //if theres a change in offset, keep animating
      if (
        Math.abs(
          centerCorrection[0] + distanceBetweenPointerAndCenterOfBoundingRect[0]
        ) < 0.01 &&
        Math.abs(
          centerCorrection[1] + distanceBetweenPointerAndCenterOfBoundingRect[1]
        ) < 0.01 &&
        Math.abs(scale - smallScale) < 0.01
      ) {
        centerAnimating = false;
      }
      if (centerAnimating) {
        requestAnimationFrame(animateCenterOffset);
      }
    }
    //requestANimationFrame loop that lerps --offsetX and --offsetY back to 0 based on their current value, stopping when they are both 0
    let deltaMovingX = 0;
    let deltaMovingY = 0;
    let deltaMovingLayer = [0, 0];
    var scrollAmt = 0;
    var animateScroll = false;
    var animateScrollInterval;
    var scrollTiming = 10;
    function animateScrolling() {
      layerMain.scrollBy({ top: maxScrollSpeed * scrollAmt });
      _self.layerElement.style.setProperty(
        "--offsetY",
        `${
          deltaMovingY +
          centerCorrection[1] +
          (layerMain.scrollTop - beginningScroll)
        }px`
      );
    }
    //on pointermove, if there is more than X threshold on the movement based on the startingtouchposition and the current touch position, then move the layer.

    document.addEventListener("pointermove", (e) => {
      let currentTouchPosition = [e.clientX, e.clientY];
      deltaMovingX = currentTouchPosition[0] - startingTouchPosition[0];
      deltaMovingY = currentTouchPosition[1] - startingTouchPosition[1];
      let deltaMovingLayerX =
        currentTouchPosition[0] - startingTouchPosition[0];
      let deltaMovingLayerY =
        currentTouchPosition[1] - startingTouchPosition[1];
      deltaMovingLayer[0] += Math.abs(deltaMovingLayerX);
      deltaMovingLayer[1] += Math.abs(deltaMovingLayerY);
      if (pickedUp) {
        if (movingLayer) {
          if (_self.moving) {
            var heightPercentage =
              (e.clientY - _self.containerRect.top) /
              (_self.containerRect.bottom - _self.containerRect.top);
            scrollAmt = 0;
            if (heightPercentage < scrollPercentage) {
              if (animateScroll == false) {
                animateScrollInterval = setInterval(() => {
                  animateScrolling();
                }, scrollTiming);
              }
              animateScroll = true;
              scrollAmt = (1 - heightPercentage / scrollPercentage) * -1;
            } else if (heightPercentage > 1 - scrollPercentage) {
              if (animateScroll == false) {
                animateScrollInterval = setInterval(() => {
                  animateScrolling();
                }, scrollTiming);
              }
              animateScroll = true;
              scrollAmt =
                (heightPercentage - (1 - scrollPercentage)) / scrollPercentage;
            } else {
              animateScroll = false;
              clearInterval(animateScrollInterval);
            }
            //set offset variable to deltaY
            _self.layerElement.style.setProperty(
              "--offsetX",
              `${deltaMovingX + centerCorrection[0]}px`
            );
            _self.layerElement.style.setProperty(
              "--offsetY",
              `${
                deltaMovingY +
                centerCorrection[1] +
                (layerMain.scrollTop - beginningScroll)
              }px`
            );
            _self.absoluteTop =
              _self.layerTop +
              deltaMovingY +
              centerCorrection[1] +
              (layerMain.scrollTop - beginningScroll);
            _self.updateLayerPosition();
            return;
          }
        }
        if (
          deltaMovingLayer[0] > moveThreshold ||
          deltaMovingLayer[1] > moveThreshold
        ) {
          movingLayer = true;
          centerAnimating = true;
          requestAnimationFrame(animateCenterOffset);
          shiftAllLayers(_self.index);
        }
      }
      deltaPosition[0] += Math.abs(deltaMovingX);
      deltaPosition[1] += Math.abs(deltaMovingY);
      if (deltaPosition[0] > 20 || deltaPosition[1] > 20) {
        clearTimeout(_self.timeout);
      }
    });
    //timeout that acts as a delay where, if you are still touching the layer when it fires, it does something
    this.timeout;
    this.moving = false;
    var startingTouchPosition = [0, 0];
    var deltaPosition = [0, 0];
    this.layerElement.ontouchmove = function (e) {
      if (_self.moving) e.preventDefault();
    };
    layerMain.appendChild(this.layerElement);
    this.injectSettings();
  }
  injectSettings() {
    setLayerVisibility(this.id, this.visButton, this.settings.visible);
    setLayerLock(this.id, this.lockButton, this.settings.locked);
  }
  shiftToNewLayerPosition(index) {
    if (index > this.index) {
      this.previewOffset = layerHeight + layerMargin;
      this.layerElement.style.setProperty(
        "--layerMovementOffset",
        `${this.previewOffset}px`
      );
    }
  }
  unshiftLayer() {
    this.previewOffset = 0;
    this.layerElement.style.setProperty("--layerMovementOffset", `0px`);
  }
  previewLayerPosition(i) {
    this.layerElement.style.setProperty(
      "--layerMovementOffset",
      `${this.previewOffset}px`
    );
    if (this.moving) return;
    if (i > this.index) {
      //get the property layermovementoffset
      this.layerElement.style.setProperty(
        "--layerMovementOffset",
        `${this.previewOffset - 40}px`
      );
    }
  }
  updateLayerPosition() {
    var currentIndex =
      layers.length -
      Math.floor(this.absoluteTop / (layerHeight + layerMargin)) -
      2;
    if (this.endAnimating) return;
    previewLayerPosition(
      currentIndex + (currentIndex < this.index ? 0 : 1),
      currentIndex < this.index
    );
  }
  updateLayerOrder() {
    var moveToIndex =
      layers.length -
      Math.floor(this.absoluteTop / (layerHeight + layerMargin)) -
      2;
    arraymove(layers, layers.indexOf(this), layers.length - moveToIndex - 1);
    this.previousIndex = this.index;
    this.updateIndices();
    updateNormalTops();
  }
  updateIndices() {
    for (var i = 0; i < layers.length; i++) {
      layers[i].index = layers.length - i - 1;
      layers[i].svgWrapper.style.setProperty("--zindex", layers[i].index * 2);
    }
  }
  updateNormalTop() {
    this.layerTop =
      (layers.length - this.index - 1) * layerHeight +
      layerMargin * (layers.length - this.index - 1);
    this.absoluteTop = this.layerTop + layerMain.scrollTop;
    this.layerElement.style.setProperty("--top", `${this.layerTop}px`);
    if (!this.moving) return;
    var curoff = parseInt(
      this.layerElement.style.getPropertyValue("--offsetY").replace("px", "")
    );
    this.layerElement.style.setProperty(
      "--offsetY",
      `${
        curoff - (layerHeight + layerMargin) * (this.previousIndex - this.index)
      }px`
    );
  }
  delete() {
    if (layers.length <= 1) return;
    this.layerElement.remove();
    this.svgWrapper.remove();
    var index = layers.indexOf(this);
    layers.splice(layers.indexOf(this), 1);
    updateAllIndices();
    updateNormalTops();
    setLayer(
      layers[clamp(index, 0, Math.max(layers.length - 1, 0))].id || layers[0].id
    );
  }
}

function updateAllIndices() {
  layers.forEach((layer) => {
    layer.updateIndices();
  });
}

function updateNormalTops() {
  layers.forEach((e) => {
    e.updateNormalTop();
  });
}

function previewLayerPosition(index, o) {
  previewBarHorizontal.classList.add("layer-position-preview-visible");
  previewBarHorizontal.style.top = `${
    clamp(layers.length - index - 1 + (o ? 0 : 1), 0, layers.length - 1) *
      (layerHeight + layerMargin) +
    12
  }px`;
  layers.forEach((e) => {
    e.previewLayerPosition(index);
  });
}

function clearPreviewLayerPosition() {
  layers.forEach((e) => {
    e.unshiftLayer();
  });
}

function shiftAllLayers(index) {
  layers.forEach((e) => {
    e.shiftToNewLayerPosition(index);
  });
}
function unshiftAllLayers() {
  previewBarHorizontal.classList.remove("layer-position-preview-visible");
  layers.forEach((e) => {
    e.unshiftLayer();
  });
}

var layerMain = document.getElementById("layer-main");
var previewBarHorizontal = document.getElementById(
  "layer-position-preview-horizontal"
);
function toggleLayerMenu() {
  document.getElementById("layer-menu").classList.toggle("layer-open");
  document.getElementById("color-menu").classList.remove("color-open");
  document
    .getElementById("layer-toggle-button")
    .classList.toggle("tool-active");
}
var layers = [];
var layerHeight = 63;
var layerMargin = 8;

var activeLayer = null;

function arraymove(arr, fromIndex, toIndex) {
  var element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
}

function newLayer(n, data, settings) {
  var nLayer = new Layer(n, data, settings);
  setTimeout(() => {
    updateNormalTops();
    setLayer(nLayer.id);
  }, 1);
}
function createMultipleLayers(n) {
  for (let i = 0; i < n; i++) {
    newLayer();
  }
}
function clearLayerMenu() {
  document.getElementById("layer-main").innerText = "";
}

function clearLayers() {
  document
    .getElementById("layerParent")
    .querySelectorAll(".layerWrapperWrapper")
    .forEach((e) => {
      if (e.classList.contains("nodelete")) return;
      e.parentElement.removeChild(e);
    });
}

function setLayer(id) {
  //notify.log("asdf");
  layer = layers.find((obj) => {
    return obj.id == id;
  });
  document.querySelectorAll(".layer-active").forEach((e) => {
    e.classList.remove("layer-active");
  });
  if (layer) {
    layer.layerElement.classList.add("layer-active");
    activeLayer = layer;
    canvasInterface.ctx = layer.ctx;
    canvasInterface.canvas = layer.canvasElement;
    canvasInterface.setColor(canvasInterface.color);
    document
      .getElementById("previewCanvasWrapper")
      .style.setProperty("--zindex", layer.index * 2 + 1);
  }
}

function updateCanvasPreview() {
  layer = layers.find((obj) => {
    return obj.id == activeLayer.id;
  });
  if (layer) {
    layer.data = layer.canvasElement.toDataURL();
    layer.previewCTX.clearRect(
      0,
      0,
      layer.canvasElement.width,
      layer.canvasElement.height
    );
    layer.previewCTX.drawImage(layer.canvasElement, 0, 0);
  }
}

function toggleLayerVisibility(id, el) {
  layer = layers.find((obj) => {
    return obj.id == id;
  });
  if (layer) {
    if (layer.settings.visible == true) {
      setLayerVisibility(id, el, false);
    } else if (layer.settings.visible == false) {
      setLayerVisibility(id, el, true);
    }
  }
}

function setLayerVisibility(id, el, state) {
  layer = layers.find((obj) => {
    return obj.id == id;
  });
  if (layer) {
    if (state == false) {
      el.querySelector("i").classList.replace("hi-eye", "hi-eye-crossed");
      layer.settings.visible = false;
      layer.canvasElement.style.visibility = "hidden";
    } else if (state == true) {
      el.querySelector("i").classList.replace("hi-eye-crossed", "hi-eye");
      layer.settings.visible = true;
      layer.canvasElement.style.visibility = "unset";
    }
  }
}

function toggleLayerLock(id, el) {
  layer = layers.find((obj) => {
    return obj.id == id;
  });
  if (layer) {
    if (layer.settings.locked == true) {
      setLayerLock(id, el, false);
    } else if (layer.settings.locked == false) {
      setLayerLock(id, el, true);
    }
  }
}
function setLayerLock(id, el, state) {
  layer = layers.find((obj) => {
    return obj.id == id;
  });
  if (layer) {
    if (state == true) {
      el.querySelector("i").classList.replace("hi-lock-open", "hi-lock");
      layer.settings.locked = true;
    } else if (state == false) {
      el.querySelector("i").classList.replace("hi-lock", "hi-lock-open");
      layer.settings.locked = false;
    }
  }
}
function openLayerSettings(layer) {
  console.log(layer.settings);
}
