var settings = {
    "background": {
        "width": 4, //size in px
        "height": 4, //size in px
        "colorOne": "#f0f0f0",
        "colorTwo": "#d4d4d4",
        "colorOne": "#ffffff",
        "colorTwo": "#f0f0f0",
    },
    "ui": {
        "canvasScale": 2,
        "angle": 0,
        "transformX": 0,
        "transformY": 0,
    },
    "tools": {
        "assignments": {
            "pen": ["brushSize", "brushSquare", "brushSmoothing", "brushPixelPerfect"],
            "eraser": ["brushSize", "brushSquare", "brushSmoothing", "brushPixelPerfect"],
            "sprayPaint": ["brushSize", "brushSquare", "brushSmoothing", "spraySpeed", "spraySize"],
            "fillBucket": ["contiguous"],
        },
        "brushSize": {
            "title": "Brush Size",
            "value": 1,
            "type": "int",
            "draggable": true,
            "min": 1,
            "max": 100,
            "unit": "px",
            "callback": "settings.tools.brushSize.value = this.value"
        },
        "brushSquare": {
            "title": "Square Brush",
            "value": false,
            "type": "bool",
            "callback": "settings.tools.brushSquare.value = this.checked"
        },
        "brushSmoothing": {
            "title": "Brush Smoothness",
            "value": 0,
            "type": "int",
            "draggable": true,
            "min": 0,
            "max": 100,
            "unit": "px",
            "callback": "settings.tools.brushSmoothing.value = this.value"
        },
        "brushPixelPerfect": {
            "title": "Pixel Perfect",
            "value": false,
            "type": "bool",
            "callback": "settings.tools.brushPixelPerfect.value = this.value"
        },
        "shapeFilled": {
            "value": false,
            "type": "bool"
        },
        "spraySpeed": {
            "title": "Spray Speed",
            "value": 1,
            "type": "int",
            "draggable": true,
            "min": 1,
            "max": 100,
            "unit": "px",
            "callback": "settings.tools.spraySpeed.value = this.value"
        },
        "spraySize": {
            "title": "Spray Size",
            "value": 10,
            "type": "int",
            "draggable": true,
            "min": 1,
            "max": 100,
            "unit": "px",
            "callback": "settings.tools.spraySize.value = this.value"
        },
        "contiguous": {
            "title": "Contiguous",
            "value": true,
            "type": "bool",
            "callback": "settings.tools.contiguous.value = this.checked"
        },
    }
};
var Tools = {
    "pen": false,
    "eraser": false,
    "fillBucket": false,
    "line": false,
    "ellipse": false,
    "rect": false,
    "pan": false,
    "zoom": false,
    "sprayPaint": false,
    "eyedropper": false,
}
var lc = [];
var draggableNumInputs = []
var preview = true;
class Canvas {
    constructor(width, height) {
        document.documentElement.style.setProperty('--canvX', width + "px");
        document.documentElement.style.setProperty('--canvY', height + "px");
        this.mobile = false
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            this.mobile = true
        }

        this.canvasParent = document.getElementById("canvas-parent")
        this.canvasParent.addEventListener("touchmove", (e) => {
            e.preventDefault()
        })


        this.initialScale = 1
        this.canvUnit = 1
        this.canvScale = settings.ui.canvasScale
        this.canvas = document.querySelector("#canvas");
        this.previewcanvas = document.querySelector("#previewcanv");
        this.bggridcanvas = document.querySelector("#bggridcanv");
        this.eBufferCanvas = document.getElementById("eraserBrushBufferParent");
        this.ectx = this.eBufferCanvas.getContext("2d");
        document.documentElement.style.setProperty('--canvScale', this.canvScale);
        this.canvas.width = this.canvUnit * width;
        this.canvas.height = this.canvUnit * height;
        this.bggridcanvas.width = this.canvUnit * width;
        this.bggridcanvas.height = this.canvUnit * height;
        this.previewcanvas.width = this.canvUnit * width;
        this.previewcanvas.height = this.canvUnit * height;
        this.width = width;
        this.height = height;
        if (window.innerHeight / this.height / 1.25 < window.innerWidth / this.width / 1.25) {
            settings.ui.canvasScale = window.innerHeight / this.height / 1.25
        } else {
            settings.ui.canvasScale = window.innerWidth / this.width / 1.25

        }
        this.canvas.style.display = "block";
        //this.canvas.style.height = Math.floor((height / width) * this.canvas.clientWidth) + "px";
        console.log(this.canvas.clientWidth)
        this.previewcanvas.style.display = "block";
        //this.previewcanvas.style.height = Math.floor((height / width) * this.previewcanvas.clientWidth) + "px";
        this.bggridcanvas.style.display = "block";
        //this.bggridcanvas.style.height = Math.floor((height / width) * this.previewcanvas.clientWidth) + "px";
        this.w = +this.canvas.width;
        this.h = +this.canvas.height;
        this.ctx = this.canvas.getContext("2d");
        this.pctx = this.previewcanvas.getContext("2d");
        this.bggctx = this.bggridcanvas.getContext("2d");
        /*this.ctx.fillStyle = "white";
        this.ctx.globalAlpha = 1;
        this.ctx.fillRect(0, 0, this.w, this.h);*/
        this.data = [...Array(this.width)].map(e => Array(this.height).fill([255, 255, 255, 255]));
        this.steps = [];
        this.redo_arr = [];
        this.frames = [];
        this.sX = null;
        this.sY = null;
        this.tempL = null;
        this.linePoints = [];
        this.filledData = {};
        this.shiftKey = false;
        this.ctrlKey = false;
        this.altKey = false;
        this.wasInCanv = false;
        this.drawBgGrid()
        this.changeBrushSize(settings.tools.brushSize.value)
        this.imageData = this.ctx.getImageData(0, 0, this.width, this.height)
        console.log(this.imageData)
        this.canvas.addEventListener("click", e => {
            var rect = this.canvas.getBoundingClientRect();
            var x = (e.clientX) - rect.left;
            var y = (e.clientY) - rect.top;
            x = Math.floor(this.width * x / (this.canvas.clientWidth * this.canvScale));
            y = Math.floor(this.height * y / (this.canvas.clientHeight * this.canvScale));
            if (Tools.fillBucket && settings.tools.contiguous.value) {
                console.log(x >= this.width)
                this.filler(x, y, this.data[x][y]);
            } else if (Tools.fillBucket && !settings.tools.contiguous.value) {
                this.fillerNonContiguous(new Point(x, y));
            }

        });

        this.panzoom = Panzoom(this.canvas, {
            setTransform: (elem, { scale, x, y }) => {
                console.log('asdf')
                this.canvas.style.setProperty('transform', `scale(${scale}) translate(${x}px, ${y}px)`)
                this.previewcanvas.style.setProperty('transform', `scale(${scale}) translate(${x}px, ${y}px)`)
                this.bggridcanvas.style.setProperty('transform', `scale(${scale}) translate(${x}px, ${y}px)`)
                this.setCanvScale(scale)
                this.setCanvTransform(x, y)
            },
            maxScale: 150,
            minScale: 0.125,
            startScale: settings.ui.canvasScale,
            startX: ((this.canvasParent.offsetWidth / 2) - (this.width / 2)) / settings.ui.canvasScale,
            startY: ((this.canvasParent.offsetHeight / 2) - (this.height / 2)) / settings.ui.canvasScale,
            canvas: true,
        })
        this.canvasParent.addEventListener('wheel', this.panzoom.zoomWithWheel)
        this.startZoomX = 0
        this.startZoomY = 0
        this.deltaX = 0
        this.deltaY = 0
        this.deltaPanX = 0
        this.deltaPanY = 0

        this.canvasParent.addEventListener("mousedown", e => {
            if (e.button == 1 || Tools.pan) {
                this.deltaX = e.clientX
                this.deltaY = e.clientY
            } else if (e.button == 1 || Tools.zoom) {
                this.startZoomX = e.clientX
                this.startZoomY = e.clientY
            }
        })

        this.canvasParent.addEventListener("touchstart", e => {
            if (Tools.pan) {
                this.deltaX = e.touches[0].clientX
                this.deltaY = e.touches[0].clientY
            }
        })


        this.canvasParent.addEventListener("touchmove", e => {
            if (e.touches) {
                if (Tools.pan) {
                    this.panzoom.pan(((e.touches[0].clientX) - this.deltaX) / this.panzoom.getScale(), (e.touches[0].clientY - this.deltaY) / this.panzoom.getScale(), { relative: true })
                    this.deltaX = e.touches[0].clientX
                    this.deltaY = e.touches[0].clientY
                } else if (Tools.zoom) {
                    var dummy = {
                        clientX: e.touches[0].clientX,
                        clientY: e.touches[0].clientY,
                        preventDefault: function () {
                        },
                        deltaY: -(this.deltaY - e.touches[0].clientY) / this.panzoom.getScale(),
                        deltaX: -(this.deltaX - e.touches[0].clientX) / this.panzoom.getScale(),
                    }
                    this.panzoom.zoomWithWheel(dummy)
                    this.deltaX = e.touches[0].clientX
                    this.deltaY = e.touches[0].clientY
                }
            }
        })
        this.canvasParent.addEventListener("touchstart", e => {
            this.inputDown(e)
        });
        this.canvasParent.addEventListener("touchend", e => {
            this.inputUp(e)
        });
        this.canvasParent.addEventListener("touchmove", e => {
            this.inputActive(e)
        })
        this.canvasParent.addEventListener("mousemove", e => {
            if (e.buttons) {
                if (Tools.pan) {
                    this.panzoom.pan(((e.clientX) - this.deltaX) / this.panzoom.getScale(), (e.clientY - this.deltaY) / this.panzoom.getScale(), { relative: true })
                    this.deltaX = e.clientX
                    this.deltaY = e.clientY
                } else if (Tools.zoom) {
                    var dummy = {
                        clientX: e.clientX,
                        clientY: e.clientY,
                        preventDefault: function () {
                        },
                        deltaY: -(this.deltaY - e.clientY) / this.panzoom.getScale(),
                        deltaX: -(this.deltaX - e.clientX) / this.panzoom.getScale(),
                    }
                    this.panzoom.zoomWithWheel(dummy)
                    this.deltaX = e.clientX
                    this.deltaY = e.clientY
                }
            }
        })


        this.canvasParent.addEventListener("mouseup", e => {
            this.prevTX = null;
            this.prevTY = null;
        })

        this.canvasParent.addEventListener("mousemove", e => {
            this.inputActive(e)
        });


        this.canvasParent.addEventListener("mousedown", e => {
            if (e.button != 0) {
                return
            }
            this.inputDown(e)
            this.inputActive(e)
        });
        this.canvasParent.addEventListener("mouseup", e => {
            this.inputUp(e)
        });

    }
    inputDown(e) {
        updatePrevious(this.color)
        var rect = this.canvas.getBoundingClientRect();
        var x = e.clientX - rect.left || e.touches[0].clientX - rect.left;
        var y = e.clientY - rect.top || e.touches[0].clientY - rect.top;
        x = Math.floor(this.width * x / (this.canvas.clientWidth * this.canvScale));
        y = Math.floor(this.height * y / (this.canvas.clientHeight * this.canvScale));
        if (Tools.circle || Tools.ellipse || Tools.line || Tools.rect || Tools.pen || Tools.eraser) {
            this.sX = x;
            this.sY = y;
        }

    }
    inputUp(e) {
        if (Tools.circle || Tools.ellipse || Tools.line || Tools.rect) {
            var p;
            for (p of this.tempL) this.draw(p);
            this.clearPreview()
            this.tempL = []
            //if (settings.tools.shapeFilled.value && Tools.ellipse) {
            //    console.log(this.filledData)
            //    let fillL = filledEllipse(this.filledData.c.x, this.filledData.c.y, this.filledData.x, this.filledData.y)
            //    for (let l of fillL) this.draw(l);
            //} else if (settings.tools.shapeFilled.value && Tools.rect) {
            //    let fillL = filledRectangle(this.filledData.r, this.filledData.c)
            //    for (let l of fillL) this.draw(l);
            //}
        }
        this.sX = null;
        this.sY = null;
        console.log(this.linePoints)
        this.linePoints = [];

    }
    inputActive(e) {
        this.shiftKey = e.shiftKey;
        this.ctrlKey = e.ctrlKey;
        this.altKey = e.altKey;
        var rect = this.canvas.getBoundingClientRect();
        var x = (e.clientX) - rect.left || e.touches[0].clientX - rect.left || -1;
        var y = (e.clientY) - rect.top || e.touches[0].clientY - rect.top || -1;
        x = Math.floor((x) / (this.canvScale));
        y = Math.floor((y) / (this.canvScale));
        if (e.buttons != 0) {
            if (this.sX === null || this.sY === null) { if (!Tools.sprayPaint && !Tools.eyedropper) return }
            if (Tools.pen) {
                let P = line(new Point(this.sX, this.sY), new Point(x, y))
                let p
                for (p of P) {
                    this.draw(new Point(p.x, p.y))
                    let brushSize = parseInt(settings.tools.brushSize.value)
                    let r = brushSize - 1
                    //let c = filledEllipse(p.x, p.y, 2, 2)
                    let c;
                    if (brushSize % 2 == 0) {
                        c = filledEllipse(p.x - (r / 2) - .5, p.y - (r / 2) - .5, p.x + (r / 2) - .5, p.y + (r / 2) - .5)
                    } else if (brushSize % 2 != 0) {
                        c = filledEllipse(p.x - (r / 2), p.y - (r / 2), p.x + (r / 2), p.y + (r / 2))
                    }
                    var b;
                    for (b of c) this.draw(b);
                }
                this.draw(new Point(x, y))
                this.sX = x;
                this.sY = y;
            }
            else if (Tools.sprayPaint) {
                console.log('a')
                let brushSize = parseInt(settings.tools.spraySize.value)
                let r = brushSize - 1
                //let c = filledEllipse(p.x, p.y, 2, 2)
                let c;
                if (brushSize % 2 == 0) {
                    c = filledEllipse(x - (r / 2) - .5, y - (r / 2) - .5, x + (r / 2) - .5, y + (r / 2) - .5)
                } else if (brushSize % 2 != 0) {
                    c = filledEllipse(x - (r / 2), y - (r / 2), x + (r / 2), y + (r / 2))
                }
                var b = [];
                c.forEach(e => {
                    for (let i = 0; i < e.x2 - e.x1; i++) {
                        b.push(new Point(e.x1 + i, e.y1))

                    }
                })
                var d = []
                for (let i = 0; i < parseInt(settings.tools.spraySpeed.value); i++) {
                    d.push(b[Math.floor(Math.random() * b.length)])
                }
                d.forEach(e => {
                    let p = e
                    this.draw(new Point(p.x, p.y))
                    let brushSize = parseInt(settings.tools.brushSize.value)
                    let r = brushSize - 1
                    //let c = filledEllipse(p.x, p.y, 2, 2)
                    let c;
                    if (brushSize % 2 == 0) {
                        c = filledEllipse(p.x - (r / 2) - .5, p.y - (r / 2) - .5, p.x + (r / 2) - .5, p.y + (r / 2) - .5)
                    } else if (brushSize % 2 != 0) {
                        c = filledEllipse(p.x - (r / 2), p.y - (r / 2), p.x + (r / 2), p.y + (r / 2))
                    }
                    var a;
                    for (a of c) this.draw(a);
                })
            }
            else if (Tools.eraser) {
                this.ctx.globalCompositeOperation = 'destination-out'
                let P = line(new Point(this.sX, this.sY), new Point(x, y))
                let p
                for (p of P) {
                    this.erase(new Point(p.x, p.y))
                    let brushSize = parseInt(settings.tools.brushSize.value)
                    let r = brushSize - 1
                    //let c = filledEllipse(p.x, p.y, 2, 2)
                    let c;
                    if (brushSize % 2 == 0) {
                        c = filledEllipse(p.x - (r / 2) - .5, p.y - (r / 2) - .5, p.x + (r / 2) - .5, p.y + (r / 2) - .5)
                    } else if (brushSize % 2 != 0) {
                        c = filledEllipse(p.x - (r / 2), p.y - (r / 2), p.x + (r / 2), p.y + (r / 2))
                    }
                    var b;
                    for (b of c) this.erase(b);
                }
                this.erase(new Point(x, y))
                this.sX = x;
                this.sY = y;
                this.ctx.globalCompositeOperation = 'source-over'
            }
            else if (Tools.eyedropper) {
                this.setcolor(this.getPixelCol(new Point(x, y)));
            }
            if (preview) {
                this.pctx.globalCompositeOperation = "destination-out";
                this.pctx.fillRect(0, 0, this.w, this.h);
                if (Tools.ellipse) {
                    if (this.shiftKey) {
                        var centre = new Point(this.sX, this.sY);
                        //var radius = +prompt("radius?");
                        let r = 0
                        let c = 0
                        if (!this.ctrlKey) {
                            if (x - this.sX > y - this.sY) {
                                r = Math.abs(x - this.sX) / 2
                            } else if (x - this.sX <= y - this.sY) {
                                r = Math.abs(y - this.sY) / 2
                            }
                            if (x - this.sX >= 0 && y - this.sY >= 0) { // bottom right
                                if (x - this.sX > y - this.sY) {
                                    let mid = ((this.sX + x) / 2) - this.sX
                                } else if (x - this.sX <= y - this.sY) {
                                    let mid = ((this.sY + y) / 2) - this.sY
                                }
                            } else if (x - this.sX < 0 && y - this.sY < 0) { // top left
                                if (x - this.sX > y - this.sY) {
                                    let mid = ((this.sX + x) / 2) - this.sX;
                                } else if (x - this.sX <= y - this.sY) {
                                    let mid = ((this.sY + y) / 2) - this.sY
                                }
                            } if (x - this.sX < 0 && y - this.sY >= 0) { // bottom left
                                if (x - this.sX > y - this.sY) {
                                    let mid = ((this.sX + x) / 2) - this.sX
                                } else if (x - this.sX <= y - this.sY) {
                                    let mid = ((this.sY + y) / 2) - this.sY
                                }
                            } else if (x - this.sX >= 0 && y - this.sY < 0) { // top right
                                if (x - this.sX > y - this.sY) {
                                    let mid = ((this.sX + x) / 2) - this.sX
                                } else if (x - this.sX <= y - this.sY) {
                                    let mid = ((this.sY + y) / 2) - this.sY
                                }
                            }
                            c = new Point(this.sX, this.sY)
                        }
                        if (this.ctrlKey) {
                            c = new Point(this.sX, this.sY)
                            if (x - this.sX > y - this.sY) {
                                r = Math.abs(x - this.sX)
                            } else if (x - this.sX <= y - this.sY) {
                                r = Math.abs(y - this.sY)
                            }
                        }
                        //this.tempL = circle(Math.floor(r), c);
                        this.tempL = ellipse(c.x + (r * 2), c.y + (r * 2), c.x, c.y)
                        if (settings.tools.shapeFilled.value) this.filledData = { "r": math.floor(r), "c": c };
                        var p;
                        for (p of this.tempL) this.pDraw(new Point(p.x, p.y));
                    } else if (!this.shiftKey) {
                        let c = new Point(this.sX, this.sY)
                        if (this.ctrlKey) { c = new Point(this.sX - (x - this.sX), this.sY - (y - this.sY)) }
                        //this.tempL = ellipse(this.round(Math.abs(x - c.x) / 2, .5), this.round(Math.abs(y - c.y) / 2, .5), c);
                        this.tempL = ellipse(x, y, c.x, c.y)
                        if (settings.tools.shapeFilled.value) this.filledData = { "x": x, "y": y, "c": c };
                        var p;
                        for (p of this.tempL) this.pDraw(new Point(p.x, p.y));
                        //if(this.ctrlKey) console.log('control hehe')
                    }

                }
                if (Tools.line) {
                    console.log("a")
                    let c = new Point(this.sX, this.sY)
                    this.tempL = line(c, new Point(x, y));
                    var p;
                    for (p of this.tempL) this.pDraw(new Point(p.x, p.y));

                }
                if (Tools.rect) {
                    if (this.shiftKey) {
                        let c = 0
                        let e = new Point(x, y)
                        if (this.ctrlKey) {
                            c = new Point(this.sX, this.sY)
                            if (e.x - c.x >= 0 && e.y - c.y >= 0) {
                                if (e.x - c.x > e.y - c.y) {
                                    e.x = c.x + Math.abs(e.y - c.y);
                                } else if (e.x - c.x <= e.y - c.y) {
                                    e.y = c.y + Math.abs(e.x - c.x);
                                }
                            } else if (e.x - c.x < 0 && e.y - c.y < 0) {
                                if (e.x - c.x > e.y - c.y) {
                                    e.y = c.y - Math.abs(e.x - c.x);
                                } else if (e.x - c.x <= e.y - c.y) {
                                    e.x = c.x - Math.abs(e.y - c.y);
                                }
                            } else if (e.x - c.x < 0 && e.y - c.y >= 0) {
                                if (c.x - e.x > e.y - c.y) {
                                    e.x = c.x - Math.abs(e.y - c.y);
                                } else if (c.x - e.x <= e.y - c.y) {
                                    e.y = c.y + Math.abs(e.x - c.x);
                                }
                            } else if (e.x - c.x >= 0 && e.y - c.y < 0) {
                                if (e.x - c.x > c.y - e.y) {
                                    e.x = c.x + Math.abs(e.y - c.y);
                                } else if (e.x - c.x <= c.y - e.y) {
                                    e.y = c.y - Math.abs(e.x - c.x);
                                }
                            }
                            c = new Point(this.sX - (e.x - this.sX), this.sY - (e.y - this.sY))
                        }
                        if (!this.ctrlKey) {
                            c = new Point(this.sX, this.sY)
                            if (e.x - c.x >= 0 && e.y - c.y >= 0) {
                                if (e.x - c.x > e.y - c.y) {
                                    e.x = c.x + Math.abs(e.y - c.y);
                                } else if (e.x - c.x <= e.y - c.y) {
                                    e.y = c.y + Math.abs(e.x - c.x);
                                }
                            } else if (e.x - c.x < 0 && e.y - c.y < 0) {
                                if (e.x - c.x > e.y - c.y) {
                                    e.y = c.y - Math.abs(e.x - c.x);
                                } else if (e.x - c.x <= e.y - c.y) {
                                    e.x = c.x - Math.abs(e.y - c.y);
                                }
                            } else if (e.x - c.x < 0 && e.y - c.y >= 0) {
                                if (c.x - e.x > e.y - c.y) {
                                    e.x = c.x - Math.abs(e.y - c.y);
                                } else if (c.x - e.x <= e.y - c.y) {
                                    e.y = c.y + Math.abs(e.x - c.x);
                                }
                            } else if (e.x - c.x >= 0 && e.y - c.y < 0) {
                                if (e.x - c.x > c.y - e.y) {
                                    e.x = c.x + Math.abs(e.y - c.y);
                                } else if (e.x - c.x <= c.y - e.y) {
                                    e.y = c.y - Math.abs(e.x - c.x);
                                }
                            }
                        }

                        this.tempL = rectangle(c, e);
                        var p;
                        for (p of this.tempL) this.pDraw(new Point(p.x, p.y));

                    } else if (!this.shiftKey) {
                        //var radius = +prompt("radius?");
                        let c = new Point(this.sX, this.sY)
                        if (this.ctrlKey) { c = new Point(this.sX - (x - this.sX), this.sY - (y - this.sY)) }
                        let e = new Point(x, y)
                        this.tempL = rectangle(c, e);
                        let aa = []
                        for (let p of this.tempL) this.pDraw(new Point(p.x, p.y));
                    }

                }
            }
        } else if (e.buttons == 0) {
            let brushSize = parseInt(settings.tools.brushSize.value)
            if (preview) {
                if (!Tools.eraser) {
                    this.pctx.globalCompositeOperation = "destination-out";
                    this.pctx.fillRect(0, 0, this.w, this.h);
                    if (this.mobile || Tools.pan) return;
                    let brushSize = parseInt(settings.tools.brushSize.value)
                    let r = brushSize - 1
                    let c;
                    if (brushSize % 2 == 0) {
                        c = filledEllipse(x - (r / 2) - .5, y - (r / 2) - .5, x + (r / 2) - .5, y + (r / 2) - .5)
                    } else if (brushSize % 2 != 0) {
                        c = filledEllipse(x - (r / 2), y - (r / 2), x + (r / 2), y + (r / 2))
                    }
                    var b;
                    for (b of c) this.pDraw(b)
                };
                if (Tools.eraser) {
                    this.pctx.globalCompositeOperation = "destination-out";
                    this.pctx.fillRect(0, 0, this.w, this.h);
                    if (this.mobile || Tools.pan) return;
                    let brushSize = parseInt(settings.tools.brushSize.value)
                    let r = brushSize - 1
                    let c;
                    if (brushSize % 2 == 0) {
                        c = filledEllipse(0 - (r / 2) - .5 + (r / 2), 0 - (r / 2) - .5 + (r / 2), 0 + (r / 2) - .5 + (r / 2), 0 + (r / 2) - .5 + (r / 2))
                    } else if (brushSize % 2 != 0) {
                        c = filledEllipse(0 - (r / 2) + (r / 2), 0 - (r / 2) + (r / 2), 0 + (r / 2) + (r / 2), 0 + (r / 2) + (r / 2))
                    }
                    var b;
                    this.eBufferCanvas.width = this.eBufferCanvas.height = parseInt(settings.tools.brushSize.value)
                    for (b of c) this.ePDraw(b, x, y)
                };

            }
        }

    }
    round(value, step) {
        step || (step = 1.0);
        var inv = 1.0 / step;
        return Math.round(value * inv) / inv;
    }
    changeBrushSize(sz) {
        console.log(sz)
        //let slide = document.getElementById('brushSzSlide')
        //let txt = document.getElementById('brushSzNum')
        //let icon = document.getElementById('brushSzIcon')
        //slide.value = sz
        //txt.value = sz
        settings.tools.brushSize.value = sz
        //icon.style.fontSize = Math.max(Math.min(sz, 30), 5) + "px"
        //var value = (slide.value - slide.min) / (slide.max - slide.min) * 100
        //slide.style.background = 'linear-gradient(to right, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.15) ' + value + '%, rgba(255, 255, 255, 0.03) ' + value + '%, rgba(255, 255, 255, 0.03) 100%)'
    }
    zoom(z) {
        this.setCanvScale(Math.max(settings.ui.canvasScale + z, 1))
    }
    setCanvScale(s) {
        settings.ui.canvasScale = s;
        this.canvScale = settings.ui.canvasScale;
        //document.documentElement.style.setProperty('--canvScale', this.canvScale);
    }
    setCanvTransform(x, y) {
        if (!this.prevTX) { this.prevTX = x; }
        if (!this.prevTY) { this.prevTY = y; }
        if (!this.prevTY || !this.prevTX) { return; }
        settings.ui.transformX = settings.ui.transformX + (x - this.prevTX)
        settings.ui.transformY = settings.ui.transformY + (y - this.prevTY)
        //document.documentElement.style.setProperty('--canvTransformX', settings.ui.transformX + "px");
        //document.documentElement.style.setProperty('--canvTransformY', settings.ui.transformY + "px");
        this.prevTX = x
        this.prevTY = y
    }
    drawBgGrid() {
        let nCol = Math.ceil(this.width / settings.background.width)
        let nRow = Math.ceil(this.height / settings.background.height)
        var ctx = this.bggctx;
        this.clearBgGrid()
        var w = settings.background.width * this.canvUnit;
        var h = settings.background.height * this.canvUnit;
        nRow = nRow || 8;    // default number of rows
        nCol = nCol || 8;    // default number of columns

        //w /= nCol;            // width of a block
        //h /= nRow;            // height of a block

        ctx.fillStyle = settings.background.colorOne;
        ctx.fillRect(0, 0, this.bggridcanvas.width, this.bggridcanvas.height)
        ctx.fillStyle = settings.background.colorTwo;
        for (var i = 0; i < nRow; ++i) {
            for (var j = 0, col = nCol / 2; j < col; ++j) {
                ctx.fillRect(2 * j * w + (i % 2 ? 0 : w), i * h, w, h);
            }
        }

    }

    clearBgGrid() {

        this.bggctx.globalCompositeOperation = "destination-out";
        this.bggctx.fillRect(0, 0, this.w, this.h);
        this.bggctx.globalCompositeOperation = 'source-over'

    }

    ctest() {
        let Points = [[0, 20], [20, 20], [30, 10], [40, 8], [50, 10], [60, 20], [70, 30]]
        let c = this.CatmullRomChain(Points)
        console.log(c)
        let C
        let cc
        for (C of c) {
            for (cc of C) this.draw(cc.x, cc.y)
        }
    }
    fillLine() {
        let c = this.CatmullRomChain(this.linePoints)
        console.log(c)
        let C
        let cc
        for (C of c) {
            for (cc of C) this.draw(cc.x, cc.y)
        }
    }
    CatmullRomChain(P) {
        /*
        Calculate Catmull–Rom for a chain of points and return the combined curve.
        
        let sz = P.length;
        //The curve C will contain an array of (x, y) points.
        let C = []
        for (let i = 0; i < sz - 3; i++) {
            let c = this.CatmullRomSpline(P[i], P[i + 1], P[i + 2], P[i + 3])
            C.push(c)
        }
        return C*/
        let C = [];
        for (let i = 0; i < P.length - 1; i++) {
            let c = line(new Point(P[i][0], P[i][1]), new Point(P[i + 1][0], P[i + 1][1]))
            C.push(c)
        }
        return C
    }
    CatmullRomSpline(P0, P1, P2, P3, nPoints) {
        if (nPoints == null) {
            nPoints = 100
        }
        console.log(nPoints)
        //Parametric constant: 0.5 for the centripetal spline, 0.0 for the uniform spline, 1.0 for the chordal spline.
        let alpha = 0.5
        //Premultiplied power constant for the following tj() function.
        alpha = alpha / 2
        function tj(ti, Pi, Pj) {
            let xi = Pi[0]; let yi = Pi[1];
            let xj = Pj[0]; let yj = Pj[1];
            return Math.pow((Math.pow(xj - xi, 2) + Math.pow(yj - yi, 2)), alpha) + ti
        }
        function linspace(startValue, stopValue, cardinality) {
            var arr = [];
            var step = (stopValue - startValue) / (cardinality - 1);
            for (var i = 0; i < cardinality; i++) {
                arr.push(startValue + (step * i));
            }
            return arr;
        }
        function newArr(le, ch) {
            let arr = []
            for (let i = 0; i < le; i++) {
                arr.push(ch)
            }
            return arr
        }
        let t0 = 0
        let t1 = tj(t0, P0, P1);
        let t2 = tj(t1, P1, P2);
        let t3 = tj(t2, P2, P3);

        let t = linspace(t1, t2, nPoints);
        let array = (newArr(t.length, 1))
        t = math.reshape(t, [t.length, 1])
        console.log(math.add(math.multiply(math.divide(math.subtract(t1, t), math.subtract(t1, t0)), P0), math.multiply(math.divide(math.subtract(t, t0), math.subtract(t1, t0)), P1)))
        /*
                let A1 = (t1-t)/(t1-t0)*P0 + (t-t0)/(t1-t0)*P1;
                let A2 = (t2-t)/(t2-t1)*P1 + (t-t1)/(t2-t1)*P2;
                let A3 = (t3-t)/(t3-t2)*P2 + (t-t2)/(t3-t2)*P3;
                let B1 = (t2-t)/(t2-t0)*A1 + (t-t0)/(t2-t0)*A2
                let B2 = (t3-t)/(t3-t1)*A2 + (t-t1)/(t3-t1)*A3
                let C = (t2-t)/(t2-t1)*B1 + (t-t1)/(t2-t1)*B2
                return C*/
    }
    clearPreview() {
        this.pctx.globalCompositeOperation = "destination-out";
        this.pctx.fillRect(0, 0, this.w, this.h);
    }
    draw(coord) {
        if (coord.constructor.name == "Point") {
            var x = coord.x
            var y = coord.y
            if (x === undefined || y === undefined) return
            this.ctx.globalCompositeOperation = 'source-over'
            this.ctx.fillRect(x, y, 1, 1);
        } else if (coord.constructor.name == "Rect") {
            var x1 = coord.x1
            var y1 = coord.y1
            var x2 = coord.x2
            var y2 = coord.y2
            if (x1 === undefined || y1 === undefined || x2 === undefined || y2 === undefined) return
            var ax1, ax2, ay1, ay2
            this.pctx.globalCompositeOperation = 'source-over'
            if (x1 >= x2) {
                ax1 = x2
                ax2 = x1
            } else if (x1 < x2) {
                ax1 = x1
                ax2 = x2
            }
            if (y1 >= y2) {
                ay1 = y2
                ay2 = y1
            } else if (y1 < y2) {
                ay1 = y1
                ay2 = y2
            }
            if (ay2 - ay1 == 0) ay2 = ay1 + 1
            this.ctx.fillRect(ax1, ay1, ax2 - ax1, ay2 - ay1);

        }
    }
    pDraw(coord) {
        this.pctx.globalCompositeOperation = 'source-over'
        this.previewcanvas.style.setProperty("--invert", 0)
        if (coord.constructor.name == "Point") {
            var x = coord.x
            var y = coord.y
            this.pctx.fillRect(x, y, 1, 1);
        } else if (coord.constructor.name == "Rect") {
            var x1 = coord.x1
            var y1 = coord.y1
            var x2 = coord.x2
            var y2 = coord.y2
            var ax1, ax2, ay1, ay2
            if (x1 >= x2) {
                ax1 = x2
                ax2 = x1
            } else if (x1 < x2) {
                ax1 = x1
                ax2 = x2
            }
            if (y1 >= y2) {
                ay1 = y2
                ay2 = y1
            } else if (y1 < y2) {
                ay1 = y1
                ay2 = y2
            }
            if (ay2 - ay1 == 0) ay2 = ay1 + 1
            this.pctx.fillRect(ax1, ay1, ax2 - ax1, ay2 - ay1);
        }
    }
    ePDraw(coord, x, y) {
        this.pctx.drawImage(this.canvas, 0, 0)
        this.pctx.globalCompositeOperation = 'destination-in'
        this.ectx.globalCompositeOperation = 'source-over'
        this.previewcanvas.style.setProperty("--invert", 1)
        let brushSize = parseInt(settings.tools.brushSize.value)
        if (coord.constructor.name == "Point") {
            var x = coord.x
            var y = coord.y
            this.ectx.fillRect(x, y, 1, 1);
        } else if (coord.constructor.name == "Rect") {
            var x1 = coord.x1
            var y1 = coord.y1
            var x2 = coord.x2
            var y2 = coord.y2
            var ax1, ax2, ay1, ay2
            if (x1 >= x2) {
                ax1 = x2
                ax2 = x1
            } else if (x1 < x2) {
                ax1 = x1
                ax2 = x2
            }
            if (y1 >= y2) {
                ay1 = y2
                ay2 = y1
            } else if (y1 < y2) {
                ay1 = y1
                ay2 = y2
            }
            if (ay2 - ay1 == 0) ay2 = ay1 + 1
            if (brushSize % 2 == 0) {
                this.ectx.fillRect(ax1 + .5, ay1 + .5, ax2 - ax1, ay2 - ay1)
            } else {
                this.ectx.fillRect(ax1, ay1, ax2 - ax1, ay2 - ay1)
            }
        }
        if (brushSize % 2 == 0) {
            this.pctx.drawImage(this.eBufferCanvas, x - (brushSize / 2), y - (brushSize / 2))
        } else {
            this.pctx.drawImage(this.eBufferCanvas, x - (brushSize / 2) + .5, y - (brushSize / 2) + .5)
        }
        this.pctx.globalCompositeOperation = 'source-over'
    }
    erase(coord) {

        if (coord.constructor.name == "Point") {
            var x = coord.x
            var y = coord.y
            this.ctx.fillRect(x, y, 1, 1);
        } else if (coord.constructor.name == "Rect") {
            var x1 = coord.x1
            var y1 = coord.y1
            var x2 = coord.x2
            var y2 = coord.y2
            var ax1, ax2, ay1, ay2
            if (x1 >= x2) {
                ax1 = x2
                ax2 = x1
            } else if (x1 < x2) {
                ax1 = x1
                ax2 = x2
            }
            if (y1 >= y2) {
                ay1 = y2
                ay2 = y1
            } else if (y1 < y2) {
                ay1 = y1
                ay2 = y2
            }
            if (ay2 - ay1 == 0) ay2 = ay1 + 1
            this.ctx.fillRect(ax1, ay1, ax2 - ax1, ay2 - ay1);
        }
    }
    setcolor(color, skipDuplicate) {
        if (!skipDuplicate) setPickerColor(color)
        if (skipDuplicate) updatePickerColor(color)
        this.color = color;
        document.getElementById("tool-color").style.setProperty("--color", "rgba(" + color[0] + "," + color[1] + "," + color[2] + "," + color[3] + ")");
        this.ctx.fillStyle = "rgba(" + color[0] + "," + color[1] + "," + color[2] + "," + color[3] + ")";
        this.pctx.fillStyle = "rgba(" + color[0] + "," + color[1] + "," + color[2] + "," + color[3] + ")";
        act(document.querySelectorAll(`[data-palette-color='${rgbToHex(color[0], color[1], color[2], color[3])}']`))
    }
    setmode(tool) {
        if (settings.tools.shapeFilled.value) {
            Object.keys(Tools).forEach(v => Tools[v] = false)
            settings.tools.shapeFilled.value = true
        } else {
            Object.keys(Tools).forEach(v => Tools[v] = false)
        }

        if (settings.tools.assignments[tool]) {
            openToolSettings()
            updateToolSettings(tool)
        } else {
            closeToolSettings()
            updateToolSettings(tool)
        }
        Tools[tool] = true
        document.querySelectorAll("#toolbar .item").forEach((x) => {
            x.classList.remove('tool-active');
        })
        document.getElementById(`tool-btn-${tool}`).classList.add("tool-active")
    }
    save() {
        this.canvas.toBlob(function (blob) {
            var url = URL.createObjectURL(blob);
            var link = document.createElement('a');
            link.download = 'canvas.png';
            link.href = url;
            link.click();
        })
    }

    clear() {
        this.ctx.globalCompositeOperation = "destination-out";
        this.ctx.fillRect(0, 0, this.w, this.h);
        this.data = [...Array(this.width)].map(e => Array(this.height).fill([255, 255, 255, 255]));
        this.setcolor(this.color);
    }

    clearCanv() {
        this.ctx.globalCompositeOperation = "destination-out";
        this.ctx.fillRect(0, 0, this.w, this.h);
    }

    colorPixel(pos) {
        this.imageData.data[pos] = this.color[0];
        this.imageData.data[pos + 1] = this.color[1];
        this.imageData.data[pos + 2] = this.color[2];
        this.imageData.data[pos + 3] = this.color[3] !== undefined ? this.color[3] : 255;
    }

    matchStartColor(pos, sR, sG, sB, sA) {

        var r = this.imageData.data[pos],
            g = this.imageData.data[pos + 1],
            b = this.imageData.data[pos + 2],
            a = this.imageData.data[pos + 3];


        // If the current pixel matches the clicked color
        if (r === sR && g === sG && b === sB && a === sA) {

            return true;
        }

        // If current pixel matches the new color
        if (r === this.color[0] && g === this.color[1] && b === this.color[2] && a === this.color[3]) {
            return false;
        }
        return false;
    }

    putImgData(d) {
        this.ctx.putImageData(d, 0, 0)
    }

    redraw() {
        this.clearCanv()

        this.putImgData(this.imageData)
    }

    getPixelCol(p) {
        var imgData = this.ctx.getImageData(0, 0, this.width, this.height)

        var pixel = (p.y * this.width + p.x) * 4

        return [
            imgData.data[pixel],
            imgData.data[pixel + 1],
            imgData.data[pixel + 2],
            imgData.data[pixel + 3],
        ]
    }

    fillerNonContiguous(p) {
        var src = this.getPixelCol(p)
        var im = this.ctx.getImageData(0, 0, this.width, this.height);
        console.log(im.data[0], im.data[1], im.data[2], im.data[3])
        for (var i = 0; i < im.data.length; i += 4) {
            if (
                im.data[i] === src[0] &&
                im.data[i + 1] === src[1] &&
                im.data[i + 2] === src[2] &&
                im.data[i + 3] === src[3]
            ) {
                im.data[i] = this.color[0];
                im.data[i + 1] = this.color[1];
                im.data[i + 2] = this.color[2];
                im.data[i + 3] = this.color[3];
            }
        }
        this.ctx.putImageData(im, 0, 0);
    }

    filler(startX, startY) {

        this.imageData = this.ctx.getImageData(0, 0, this.width, this.height)

        var pixelPos = (startY * this.width + startX) * 4,
            r = this.imageData.data[pixelPos],
            g = this.imageData.data[pixelPos + 1],
            b = this.imageData.data[pixelPos + 2],
            a = this.imageData.data[pixelPos + 3];

        if (r == this.color[0] && b == this.color[1] && g == this.color[2] && a == this.color[3]) return
        this.floodFill(startX, startY, r, g, b, a);

        this.redraw();
    }

    floodFill(startX, startY, startR, startG, startB, startA) {
        var newPos,
            x,
            y,
            pixelPos,
            reachLeft,
            reachRight,
            drawingBoundLeft = 0,
            drawingBoundTop = 0,
            drawingBoundRight = this.width - 1,
            drawingBoundBottom = this.height - 1,
            pixelStack = [[startX, startY]];

        while (pixelStack.length) {

            newPos = pixelStack.pop();	//sets newPos to start x and y in beginning
            x = newPos[0];				//sets x to x val of newPos
            y = newPos[1];				//sets y to y val of newPos

            // Get current pixel position
            pixelPos = (y * this.width + x) * 4;
            // Go up as long as the color matches and are inside the canvas
            while (y >= drawingBoundTop && this.matchStartColor(pixelPos, startR, startG, startB, startA)) {
                y -= 1;
                pixelPos -= this.width * 4;

            }

            pixelPos += this.width * 4;
            //y += 1;
            reachLeft = false;
            reachRight = false;

            // Go down as long as the color matches and in inside the canvas
            while (y <= drawingBoundBottom && this.matchStartColor(pixelPos, startR, startG, startB, startA)) {
                y += 1;

                this.colorPixel(pixelPos, this.color[0], this.color[1], this.color[2], 255, [startX, startY]);

                if (x > drawingBoundLeft) {
                    if (this.matchStartColor(pixelPos - 4, startR, startG, startB, startA)) {
                        if (!reachLeft) {
                            // Add pixel to stack
                            pixelStack.push([x - 1, y]);
                            reachLeft = true;
                        }
                    } else if (reachLeft) {
                        reachLeft = false;
                    }
                }

                if (x < drawingBoundRight) {
                    if (this.matchStartColor(pixelPos + 4, startR, startG, startB, startA)) {
                        if (!reachRight) {
                            // Add pixel to stack
                            pixelStack.push([x + 1, y]);
                            reachRight = true;
                        }
                    } else if (reachRight) {
                        reachRight = false;
                    }
                }

                pixelPos += this.width * 4;
            }
        }
    }

    addFrame(data = null) {
        var img = new Image();
        img.src = data || this.canvas.toDataURL();
        this.frames.push([img, this.data.map(inner => inner.slice())]);
    }

    deleteFrame(f) {
        this.frames.splice(f, 1);
    }

    loadFrame(f) {
        this.clear();
        var img = this.frames[f][1];
        var tmp_color = this.color;
        var tmp_alpha = this.ctx.globalAlpha;
        this.ctx.globalAlpha = 1;
        var i, j;
        for (i = 0; i < this.width; i++) {
            for (j = 0; j < this.height; j++) {
                this.setcolor(img[i][j]);
                this.draw(i, j);
            }
        }
        this.setcolor(tmp_color);
        this.ctx.globalAlpha = tmp_alpha;
    }

    renderGIF() {
        this.frames.forEach(frame => {
            gif.addFrame(frame[0], {
                copy: true,
                delay: 100
            });
        });
        gif.render();
    }

    undo() {
        this.clear();
        this.redo_arr.push(this.steps.pop());
        var step;
        this.steps.forEach(step => {
            this.setcolor(step[2]);
            this.ctx.globalAlpha = step[3];
            this.draw(step[0], step[1], true);
        });
    }

    redo() {
        this.steps.push(this.redo_arr.pop());
        var step;
        this.steps.forEach(step => {
            this.setcolor(step[2]);
            this.ctx.globalAlpha = step[3];
            this.draw(step[0], step[1], true);
        });
    }

    saveInLocal() {
        /*let a = this.frames.map(frame=> [frame[0].src,frame[1]]);
        let f =  JSON.stringify(a);*/
        let d = {
            'colors': window.colors,
            'currColor': this.color,
            'width': this.width,
            'height': this.height,
            'url': this.canvas.toDataURL(),
            'steps': this.steps,
            'redo_arr': this.redo_arr,
            'dim': window.dim,
        }
        localStorage.setItem('pc-canvas-data', JSON.stringify(d));
    }
    /*
        addImage() {
            var _this = this;
            var fp = document.createElement("input");
            fp.type = "file";
            fp.click();
            fp.onchange = function (e) {
                var reader = new FileReader();
                reader.readAsDataURL(e.target.files[0]);
                reader.onload = function () {
                    var uimg = new Image();
                    uimg.src = reader.result;
                    uimg.width = _this.w;
                    uimg.height = _this.h;
                    uimg.onload = function () {
                        var pxc = document.createElement("canvas");
                        pxc.width = _this.w;
                        pxc.height = _this.h;
                        var pxctx = pxc.getContext("2d");
                        pxctx.drawImage(uimg, 0, 0, _this.w, _this.h);
                        var i, j;
                        for (i = 0; i < _this.width; i++) {
                            for (j = 0; j < _this.height; j++) {
                                var ctr = 0;
                                var avg = [0, 0, 0, 0];
                                var pix = pxctx.getImageData(10 * i, 10 * j, 10, 10).data;
                                pix.forEach((x, k) => { avg[k % 4] += x; if (k % 4 == 0) ctr++; });
                                avg = avg.map(x => ~~(x / ctr));
                                _this.setcolor(avg);
                                _this.draw(i, j);
                            }
                        }
                    }
                }
            }
        }*/
}
class Popup {
    constructor(s) {
        this.s = s;
        document.querySelector(this.s).classList.add("popup-open")
    }
    close() {
        document.querySelector(this.s).classList.remove("popup-open")
    }
}

class Frames {
    static open() {
        document.querySelector("#frames").style.display = "block";
        document.querySelector("#frames").style.transform = "translate(-50%,-50%) scale(1,1)";
        document.querySelector("#frames").focus();
        document.querySelector("#frames #gallery").innerHTML = "";
        for (var frame of board.frames) document.querySelector("#frames #gallery").appendChild(frame[0]);
        document.querySelectorAll("#frames #gallery img").forEach((x, i) => {
            x.onclick = (e) => {
                board.loadFrame(i);
                Frames.close();
            };
            x.oncontextmenu = (e) => {
                e.preventDefault();
                var del_confirmation = confirm("Delete?");
                if (del_confirmation) {
                    board.deleteFrame(i);
                    Frames.open();
                }
            };
        });
    }
    static close() {
        document.querySelector("#frames").style.transform = "translate(-50%,-50%) scale(0,0)";
    }
}

function updateToolSettings(tool) {
    var toolContent = document.getElementById("tool-settings-content")
    let toolSettings = settings.tools.assignments[tool]
    toolContent.classList.add("tool-settings-content-hidden")
    if (!toolSettings) {
        setTimeout(() => {
            toolContent.innerHTML = ``
            toolContent.style.setProperty("--maxHeight", "0px")
        }, 200);
        return
    }
    toolContent.style.setProperty("--maxHeight", (toolSettings.length * 28) + ((toolSettings.length - 1) * 8) + "px")
    let toolCont = ""
    for (let i = 0; i < toolSettings.length; i++) {
        const element = toolSettings[i];
        const setting = settings.tools[element]
        if (setting.type == "int") {
            toolCont += `
            <span class="popup-input-group">
              <p class="popup-input-title">${setting.title}</p>
              <div class="popup-input-wrap">
                <div class="popup-input-field">
                  <input min="${setting.min}" max="${setting.max}" ${(setting.draggable) ? "data-input-num-draggable" : ""} class="popup-input-num" onchange="console.log('a')" oninput="${setting.callback}" type="number" value="${setting.value}" />
                  <p class="popup-input-unit">${setting.unit}</p>
                </div>
              </div>
            </span>`
        } else if (setting.type == "bool") {
            toolCont += `
            <span class="popup-input-group">
              <p class="popup-input-title">${setting.title}</p>
              <div class="popup-input-wrap">
                <div class="popup-input-field">
                  <input class="popup-input-check" oninput="${setting.callback}" type="checkbox" ${(setting.value) ? "checked" : ""} />
                  <span class="checkmark"></span>
                </div>
              </div>
            </span>`
        }
    }
    if (toolContent.innerHTML == "") {
        toolContent.innerHTML = `${toolCont}`
        for (let i = 0; i < draggableNumInputs.length; i++) {
            const e = draggableNumInputs[i];
            e.clear()
        }
        draggableNumInputs = []
        document.querySelectorAll("[data-input-num-draggable]").forEach(e => {
            draggableNumInputs.push(new numberDraggable(e))
        })
        toolContent.classList.remove("tool-settings-content-hidden")
        return
    }
    setTimeout(() => {
        toolContent.innerHTML = `${toolCont}`
        for (let i = 0; i < draggableNumInputs.length; i++) {
            const e = draggableNumInputs[i];
            e.clear()
        }
        draggableNumInputs = []
        document.querySelectorAll("[data-input-num-draggable]").forEach(e => {
            draggableNumInputs.push(new numberDraggable(e))
        })
        toolContent.classList.remove("tool-settings-content-hidden")

    }, 150);
}

function drawPix(x, y) {
    document.body.innerHTML += `
    <div style="background:white; width:1px; height:1px; position: absolute; top: ${y}px; left: ${x}px; "></div>
    `
}

class numberDraggable {
    constructor(el) {
        this.do = false
        this.startX = 0
        this.el = el
        this.startVal = this.el.value
        self = this
        this.el.addEventListener('mousedown', (e) => { this.do = true; this.startX = e.clientX; this.startVal = this.el.value })
        this.el.addEventListener('mouseup', () => { this.do = false })
        document.addEventListener('mouseup', () => { this.do = false })
        document.addEventListener("mousemove", e => {
            if (this.do) {
                this.el.value = clamp(parseInt(this.startVal) + Math.floor((e.clientX - this.startX) / 10), this.el.min, this.el.max)
                this.el.oninput()
            }
        })
    }
    clear() {
    }
}

function closeToolSettings() {
    document.getElementById("tool-settings").classList.remove("tool-settings-open")
}

function openToolSettings() {
    document.getElementById("tool-settings").classList.add("tool-settings-open")
    document.querySelector('.tool-settings-toggle').checked = false
}

window.onload = function () {


    opacThumb = document.getElementById("color-opacity-thumb")
    opacRange = document.getElementById("color-opacity")
    opacRect = opacRange.getBoundingClientRect()
    hThumb = document.getElementById("color-hue-thumb")
    hueRange = document.getElementById("color-hue")
    hueRect = hueRange.getBoundingClientRect()
    vThumb = document.getElementById("color-value-thumb")
    valueRange = document.getElementById("color-value")
    valueRect = valueRange.getBoundingClientRect()

    var numDraggable = document.querySelectorAll("[data-input-num-draggable]")
    numDraggable.forEach(e => {
        draggableNumInputs.push(new numberDraggable(e))
    })

    let canvasData = localStorage.getItem('pc-canvas-data');
    if (canvasData) {
        data = JSON.parse(canvasData);
        window.colors = data.colors;
        window.board = new Canvas(data.width, data.height);
        let img = new Image();
        img.setAttribute('src', data.url);
        img.addEventListener("load", function () {
            window.board.ctx.drawImage(img, 0, 0);
            window.board.imageData = window.board.ctx.getImageData(0, 0, window.board.height, window.board.width)
            console.log(window.board.imageData)
        });
        /*
        window.board.frames = JSON.parse(data.frames).map(frame=>{
          let img = new Image();
          img.src = frame[0]
          return [img, frame[1]]
        });
        
        for(let f in data.frames){
          let c = document.createElement('canvas');
          c.width = data.width;
          c.height = data.height;
          let c_ctx = c.getContext('2d');
          c_ctx.drawImage(f[0], 0, 0);
          window.board.addFrame(c.toDataURL());
        }
       */

        preparePalette()

        window.board.steps = data.steps;
        window.board.redo_arr = data.redo_arr;
        window.board.setcolor(data.currColor);
        updatePrevious(data.currColor)
        window.gif = new GIF({
            workers: 2,
            quality: 10,
            width: this.canvUnit * window.board.width,
            height: this.canvUnit * window.board.height
        });
        window.gif.on('finished', function (blob) {
            var url = URL.createObjectURL(blob);
            var link = document.createElement('a');
            link.download = 'canvas.gif';
            link.href = url;
            link.click();
        });
        board.setmode("pen")
    }
    else {
        newProject();
        preparePalette()
    }

}

function randomString(l) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < l; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}
function preparePalette() {
    colors.forEach(g => {
        var title = g.title
        var palette = g.colors
        new paletteGroup(title, palette)

    });
}
var setCurrent = false;

class paletteGroup {
    constructor(title, palette, scroll) {
        console.log(palette)
        var id = randomString(7);
        console.log(id)
        var paletteParent = document.getElementById("palettes")
        var group = document.createElement("div")
        group.classList.add("color-palette-group")
        group.setAttribute("data-palette-id", id)
        var titleEl = document.createElement("h2")
        titleEl.classList.add("color-palette-title")
        titleEl.innerText = title

        group.appendChild(titleEl)
        var colorMenu = document.createElement("div")
        colorMenu.classList.add("ui")
        colorMenu.classList.add("color-palette-menu")
        group.appendChild(colorMenu)
        paletteParent.appendChild(group)

        //TODO rewrite so that this works with more than one palette


        var curX = 0;
        var startX = 0;
        var initialX = 0;
        var curY = 0;
        var startY = 0;
        var initialY = 0;
        var tX = 0
        var offsetX = 0
        var tY = 0
        var offsetY = 0
        var mainMoving = false;
        var limit = 5;
        var tempNode;
        var startRect;
        var subMoving = false;
        var tempOut = false
        var snapped = false
        titleEl.onmousedown = titleEl.ontouchstart = mouseDownHandler
        function mouseDownHandler(e) {
            if (tempOut) return;
            startRect = group.getBoundingClientRect()
            tempNode = group.cloneNode(true)
            tempNode.style.setProperty("transform", "translate(-1000%, -1000%)")
            tempNode.querySelector(".color-palette-title").onmouseup = mouseUpHandler
            tempNode.querySelector(".color-palette-title").onmousedown = tempNode.querySelector(".color-palette-title").ontouchstart = (e) => {
                startRect = e.target.getBoundingClientRect()
                if (tempOut) {
                    subMoving = true;
                    startX = e.clientX || e.touches[0].clientX;
                    startY = e.clientY || e.touches[0].clientY;
                    document.querySelectorAll(".color-palette-group").forEach(e => {
                        e.style.setProperty('z-index', 'unset', 'important')
                    })
                    group.style.setProperty('z-index', '999', 'important')
                    tempNode.style.setProperty('z-index', '1000', 'important')
                }
            }
            tempNode.classList.replace("color-palette-group", "color-palette-standalone")
            tempNode.style.width = startRect.width + "px"
            document.body.appendChild(tempNode)
            console.log(group)
            mainMoving = true;
            startX = e.clientX || e.touches[0].clientX || 0;
            startY = e.clientY || e.touches[0].clientY || 0;
            document.querySelectorAll(".color-palette-group").forEach(e => {
                e.style.setProperty('z-index', 'unset', 'important')
            })
            group.style.setProperty('z-index', '999', 'important')
            tempNode.style.setProperty('z-index', '1000', 'important')
        }
        titleEl.onmouseup = titleEl.ontouchend = mouseUpHandler
        function mouseUpHandler(e, c) {
            if (!snapped && tempNode) {
                mainMoving = false;
                subMoving = false
                tempNode.style.setProperty("transform", "unset")
                tempNode.remove()
            }
            if (tempOut) { mouseUpSub(); return }
            if (tempOut == false) {
                mainMoving = false;
                if (snapped) tempOut = true
                subMoving = true
                offsetX = curX
                offsetY = curY
                var timeout = setInterval(() => {
                    var nX = lerp(curX, initialX, 0.1);
                    var nY = lerp(curY, initialY, 0.1);
                    group.style.transform = `translate(${Math.round(nX)}px, ${Math.round(nY)}px)`;
                    curX = nX;
                    curY = nY;

                    if (Math.abs(curX - initialX) < 0.1 && Math.abs(curY - initialY) < 0.1) {
                        curX = initialX;
                        curY = initialY;
                        group.style.transform = "unset";
                        clearTimeout(timeout);
                    }
                }, 2);
            } else {
                return
            }
        }

        function mouseUpSub() {
            subMoving = false
        }
        document.addEventListener("mouseup", mouseUpHandler)
        document.addEventListener("touchend", mouseUpHandler)
        document.addEventListener("mousemove", moveHandler)
        document.addEventListener("touchmove", moveHandler)
        function moveHandler(e) {
            var cX, cY
            if (e.touches) {
                cX = e.touches[0].clientX
                cY = e.touches[0].clientY
            } else {
                cX = e.clientX
                cY = e.clientY
            }
            var x = cX - startX || 0;
            var y = cY - startY || 0;
            if (mainMoving) {
                curX = lerp(x, 0, 0.7);
                curY = lerp(y, 0, 0.7);
                group.style.transform = `translate(${Math.ceil(curX)}px, ${Math.ceil(curY)}px)`;
                tempNode.style.transform = `translate(${startRect.x + Math.ceil(curX) - 8}px, ${startRect.y + Math.ceil(curY) - 30}px)`;
                if (Math.abs(curX) > 100 || Math.abs(curY) > 100) { snapped = true; mouseUpHandler(); }
                return
            }
            if (!tempNode) return
            if (!subMoving) return;
            if (subMoving) {
                var timeout = setInterval(() => {
                    offsetX = lerp(0, offsetX, 0.99)
                    offsetY = lerp(0, offsetY, 0.99)
                    if (Math.abs(offsetX) < 0.1 && Math.abs(offsetY) < 0.1) {
                        offsetX = 0
                        offsetY = 0
                    }
                }, 2);
                tX = x - offsetX
                tY = y - offsetY
                tempNode.style.transform = `translate(${startRect.x + Math.ceil(tX) - 8}px, ${startRect.y + Math.ceil(tY) - 30}px)`;

            }
        }

        palette.forEach((x, i) => {
            if (!setCurrent) {
                setCurrent = true
                board.setcolor(x)
            }
            var rgba = `rgba(${x[0]},${x[1]},${x[2]}, ${x[3] / 256 * 100}%)`
            let e = document.createElement("span")
            e.setAttribute("data-palette-color", `${rgbToHex(x[0], x[1], x[2], x[3])}`)
            if (scroll) {
                e.style.opacity = 0;
                e.style.transitionDelay = (1000 / palette.length / 3) * i + "ms"
                setTimeout(() => {
                    e.style.opacity = 1
                }, 200);
            }
            e.classList.add('palette-color')
            e.style.setProperty("--color", rgba)
            e.setAttribute("onclick", `board.setcolor([${x}]); updatePrevious([${x}])`)
            colorMenu.appendChild(e)
        })
        console.log(palette)
        var rect = colorMenu.getBoundingClientRect()
        var colorMenu = document.getElementById("color-menu")
        if (scroll) document.getElementById("color-menu").scrollTo({ behavior: "smooth", top: (colorMenu.scrollTop + rect.top) });
    }
}

function rgbToHex(r, g, b, a) {
    if (a) return componentToHex(r) + componentToHex(g) + componentToHex(b) + componentToHex(a);
    else if (!a) return componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function closePopup() {
    window.dim.close()
}

document.querySelector("#close").onclick = function () {
    var width = +document.querySelector("#width").value;
    var height = +document.querySelector("#height").value;
    window.board = new Canvas(width, height);
    window.board.setcolor(colors[0].colors[0]);
    window.dim.close();
    window.gif = new GIF({
        workers: 2,
        quality: 10,
        width: this.canvUnit * window.board.width,
        height: this.canvUnit * window.board.height
    });
    window.gif.on('finished', function (blob) {
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.download = 'canvas.gif';
        link.href = url;
        link.click();
    });
}

var palettes = [{
    title: "Default",
    colors: [
        [36, 61, 126, 255],
        [28, 61, 96, 255],
        [17, 96, 102, 255],
        [31, 126, 118, 255],
        [50, 166, 139, 255],
        [23, 223, 120, 255],
        [13, 245, 125, 255],
        [1, 255, 170, 255],
        [145, 255, 231, 255],
        [217, 255, 253, 255],
        [170, 247, 255, 255],
        [140, 220, 255, 255],
        [115, 183, 255, 255],
        [74, 137, 255, 255],
        [41, 69, 254, 255],
        [32, 50, 164, 255],
        [118, 41, 195, 255],
        [176, 36, 104, 255],
        [210, 24, 86, 255],
        [237, 31, 76, 255],
        [255, 77, 46, 255],
        [255, 141, 84, 255],
        [249, 192, 131, 255],
        [255, 251, 214, 255],
        [255, 255, 255, 255],
        [180, 140, 108, 255],
        [142, 104, 73, 255],
        [99, 58, 41, 255],
        [78, 36, 25, 255],
        [42, 13, 9, 255]
    ]
}, {
    title: "dont remember",
    colors: [
        [91, 166, 117, 255],
        [107, 201, 108, 255],
        [171, 221, 100, 255],
        [252, 239, 141, 255],
        [255, 184, 121, 255],
        [234, 98, 98, 255],
        [204, 66, 94, 255],
        [163, 40, 88, 255],
        [117, 23, 86, 255],
        [57, 9, 71, 255],
        [97, 24, 81, 255],
        [135, 53, 85, 255],
        [166, 85, 95, 255],
        [201, 115, 115, 255],
        [242, 174, 153, 255],
        [255, 195, 242, 255],
        [238, 143, 203, 255],
        [212, 110, 179, 255],
        [135, 62, 132, 255],
        [31, 16, 42, 255],
        [74, 48, 82, 255],
        [123, 84, 128, 255],
        [166, 133, 159, 255],
        [217, 189, 200, 255],
        [255, 255, 255, 255],
        [174, 226, 255, 255],
        [141, 183, 255, 255],
        [109, 128, 250, 255],
        [132, 101, 236, 255],
        [131, 77, 196, 255],
        [125, 45, 160, 255],
        [78, 24, 124, 255]
    ]
}, {
    title: "Astralae",
    colors: [
        [255, 241, 170, 255],
        [255, 247, 219, 255],
        [255, 255, 255, 255],
        [224, 254, 255, 255],
        [193, 240, 255, 255],
        [174, 224, 247, 255],
        [113, 215, 253, 255],
        [20, 175, 255, 255],
        [57, 94, 255, 255],
        [82, 69, 224, 255],
        [72, 58, 153, 255],
        [122, 99, 246, 255],
        [150, 133, 251, 255],
        [188, 137, 252, 255],
        [212, 155, 243, 255],
        [253, 142, 241, 255],
        [255, 169, 251, 255],
        [253, 191, 254, 255],
        [254, 205, 255, 255],
        [253, 234, 254, 255],
        [103, 228, 255, 255],
        [94, 255, 254, 255]
    ]
}]
function newProject() {
    closeMenu()
    localStorage.removeItem('pc-canvas-data');
    window.dim = new Popup("#popup");
    window.colors = palettes
}
var fillCol = [0, 0, 0, 0]
function filler(x, y, cc) {
    fillCol = cc
    console.log(x, y, cc)
}

function lerp(v0, v1, t) {
    return v0 * (1 - t) + v1 * t;
}
function act(clr) {
    document.querySelectorAll(".palette-color").forEach(x => {
        x.classList.add('palette-inactive')
        x.classList.remove('palette-active')
    });
    if (clr) {
        clr.forEach(e => {
            e.classList.remove('palette-inactive')
            e.classList.add('palette-active')
        })
    }
}

window.onbeforeunload = function () {
    board.saveInLocal();
};

//var scope = {
//    scope: './'
//};
//if ('serviceWorker' in navigator) {
//    navigator.serviceWorker.register(
//        'sw.js',
//        scope
//    ).then(function (serviceWorker) {
//        console.log('successful');
//    }).catch(function (error) {
//        alert("error");
//    });
//} else {
//    console.log('unavailable');
//}

var msg;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    msg = e;
});

function install() {
    msg.prompt();
}

window.onerror = function (errorMsg, url, lineNumber) {
    //alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber);
}

function toggleColorPicker() {
    document.getElementById('color-menu').classList.toggle("color-open")
}

function toggleMenu() {

    document.querySelector(".menu").classList.toggle("menu-open")

}

function closeMenu() {
    document.querySelector(".menu").classList.remove("menu-open")

}

function openMenu() {
    document.querySelector(".menu").classList.add("menu-open")

}

function toggleFile() {

}

var pickerColor = [0, 0, 0, 100]

var previousData = {
    r: 0, g: 0, b: 0, rgba: 0, h: 0, s: 0, l: 0, hsla: 0, hex: "ffffffff"
}
document.querySelectorAll("[data-color-input]").forEach(el => {
    el.onblur = el.onkeyup = updateColorNum
})



function updateColorNum(el) {
    if (el.keyCode) {
        if (el.keyCode != 13) return;
    }
    var isValid = true;
    var rgb, hsv
    document.querySelectorAll("[data-color-input]").forEach(e => {
        if (e.type == "number") {
            if (e == el.target) {
                if (e.id.includes("rgba")) {
                    if (isValidNum(e.value)) {
                        rgb = [
                            clamp(document.getElementById("color-rgba-r").value, 0, 255),
                            clamp(document.getElementById("color-rgba-g").value, 0, 255),
                            clamp(document.getElementById("color-rgba-b").value, 0, 255),
                            clamp(document.getElementById("color-rgba-a").value, 0, 255),
                        ]
                        hsv = RGBToHSV(rgb)
                        console.log(rgb)
                    } else {
                        isValid = false
                    }
                } else if (e.id.includes("hsla")) {
                    if (isValidNum(e.value)) {
                        var hsl = [
                            clamp(document.getElementById("color-hsla-h").value, 0, 360),
                            clamp(document.getElementById("color-hsla-s").value, 0, 100),
                            clamp(document.getElementById("color-hsla-l").value, 0, 100),
                            clamp(document.getElementById("color-hsla-a").value, 0, 100),
                        ]
                        rgb = HSLToRGB(hsl)
                        hsv = RGBToHSV(rgb)
                    } else {
                        isValid = false
                    }
                }
            }
        } else if (e.type == "text") {
            if (e == el.target) {
                if (isValidHex(e.value)) {
                    rgb = hexToRGB(e.value)
                    hsv = RGBToHSV(rgb)
                } else {
                    isValid = false
                }
            }
        }
    })
    if (isValid) {
        console.log("valid")
        setPickerColor(rgb)
        pickerColor = hsv
        updatePickerColor()
    } else {
        updatePickerColor()
    }
}

var opacMoving = false
var opacThumb
var opacRange
var opacRect

function opacityThumb(e) {
    opacMoving = true
}

function opacEndDrag(e) {
    opacMoving = false
}

function opacDrag(e) {
    e.preventDefault()

    var x, y
    if (e.touches) {
        x = e.touches[0].clientX - opacRect.left
        y = e.touches[0].clientY - opacRect.top
    } else {
        x = e.clientX - opacRect.left
        y = e.clientY - opacRect.top
    }
    if (opacMoving) {
        document.querySelectorAll('[data-color-input]').forEach(e => { e.blur() });
        pickerColor[3] = clamp(y / opacRect.height * 100, 0, 100)
        opacThumb.style.setProperty("--pos", clamp(y / opacRect.height * 100, 0, 100) + "%")
        opacThumb.style.setProperty("--posp", clamp(y / opacRect.height, 0, 1))
        updatePickerColor()
        var rgba = HSLToRGB(HSVToHSL(pickerColor))
        board.setcolor(rgba, true)
    }
}



var hueMoving = false
var hThumb
var hueRange
var hueRect

function hueThumb(e) {
    hueMoving = true
}

function hueEndDrag(e) {
    hueMoving = false
}

function hueDrag(e) {
    e.preventDefault()
    var x, y
    if (e.touches) {
        x = e.touches[0].clientX - hueRect.left
        y = e.touches[0].clientY - hueRect.top
    } else {
        x = e.clientX - hueRect.left
        y = e.clientY - hueRect.top
    }
    x = e.clientX - hueRect.left
    y = e.clientY - hueRect.top
    if (hueMoving) {
        document.querySelectorAll('[data-color-input]').forEach(e => { e.blur() });
        pickerColor[0] = clamp((1 - (y / hueRect.height)), 0, 1) * 360
        hThumb.style.setProperty("--pos", clamp(y / hueRect.height * 100, 0, 100) + "%")
        hThumb.style.setProperty("--posp", clamp(y / hueRect.height, 0, 1))
        updatePickerColor()
        var rgba = HSLToRGB(HSVToHSL(pickerColor))
        board.setcolor(rgba, true)
    }
}


var valueMoving = false
var valThumb
var valueRange
var valueRect

function valueThumb(e) {
    valueMoving = true
}

function valueEndDrag(e) {
    valueMoving = false
}

function valueDrag(e) {
    e.preventDefault()
    var x, y
    if (e.touches) {
        x = e.touches[0].clientX - valueRect.left
        y = e.touches[0].clientY - valueRect.top
    } else {
        x = e.clientX - valueRect.left
        y = e.clientY - valueRect.top
    }
    if (valueMoving) {
        document.querySelectorAll('[data-color-input]').forEach(e => { e.blur() });
        pickerColor[1] = clamp(x / valueRect.width * 100, 0, 100)
        pickerColor[2] = 100 - clamp(y / valueRect.height * 100, 0, 100)
        vThumb.style.setProperty("--posX", clamp(x / valueRect.width * 100, 0, 100) + "%")
        vThumb.style.setProperty("--posY", clamp(y / valueRect.height * 100, 0, 100) + "%")
        updatePickerColor()
        var rgba = HSLToRGB(HSVToHSL(pickerColor))
        board.setcolor(rgba, true)
    }
}


function updatePickerColor() {
    var colorCurrent = document.getElementById("color-current")
    var rEl = document.getElementById("color-rgba-r")
    var gEl = document.getElementById("color-rgba-g")
    var bEl = document.getElementById("color-rgba-b")
    var rgbAEl = document.getElementById("color-rgba-a")
    var hEl = document.getElementById("color-hsla-h")
    var sEl = document.getElementById("color-hsla-s")
    var lEl = document.getElementById("color-hsla-l")
    var hslAEl = document.getElementById("color-hsla-a")
    var hexEl = document.getElementById("color-data-hex")
    opacRange.style.setProperty("--hue", pickerColor[0])
    valueRange.style.setProperty("--hue", pickerColor[0])
    let hsla = HSVToHSL(pickerColor)
    var rgba = HSLToRGB(hsla)
    opacRange.style.setProperty("--color", `hsl( ${hsla[0]}, ${hsla[1]}%, ${hsla[2]}%)`)
    colorCurrent.style.setProperty("--color", `hsla( ${hsla[0]}, ${hsla[1]}%, ${hsla[2]}%, ${hsla[3]}%)`)
    rEl.value = rgba[0]
    gEl.value = rgba[1]
    bEl.value = rgba[2]
    rgbAEl.value = rgba[3]
    hEl.value = Math.round(hsla[0])
    sEl.value = Math.round(hsla[1])
    lEl.value = Math.round(hsla[2])
    hslAEl.value = Math.round(hsla[3])
    var hex = rgbToHex(rgba[0], rgba[1], rgba[2], rgba[3])
    if (hex.endsWith("ff")) {
        hexEl.value = hex.substring(0, hex.length - 2)
    } else {
        hexEl.value = hex
    }
    previousData = {
        r: rgba[0], g: rgba[1], b: rgba[2], rgba: rgba[3], h: Math.round(hsla[0]), s: Math.round(hsla[1]), l: Math.round(hsla[2]), hsla: Math.round(hsla[3]), hex: rgbToHex(rgba[0], rgba[1], rgba[2], rgba[3])
    }
    //board.setcolor(rgba)
}


function isValidHex(color) {
    if (!color || typeof color !== 'string') return false;

    if (color.substring(0, 1) === '#') color = color.substring(1);

    switch (color.length) {
        case 3: return /^[0-9A-F]{3}$/i.test(color);
        case 4: return /^[0-9A-F]{4}$/i.test(color);
        case 6: return /^[0-9A-F]{6}$/i.test(color);
        case 8: return /^[0-9A-F]{8}$/i.test(color);
        default: return false;
    }

    return false;
}

function isValidNum(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

function hexToRGB(hex) {
    hex = hex.replace("#", '')
    if (hex.length == 3) {
        hex += "f"
    } else if (hex.length == 6) {
        hex += "ff"
    }
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b, a) {
        return r + r + g + g + b + b + (a || "ff") + (a || "ff");
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
        parseInt(result[4], 16)] : null;
}
function HSLToHSV(hsla) {
    var h = hsla[0]
    var s = hsla[1]
    var l = hsla[2]
    var a = hsla[3]
    const hsv1 = s * (l < 50 ? l : 100 - l) / 100;
    const hsvS = hsv1 === 0 ? 0 : 2 * hsv1 / (l + hsv1) * 100;
    const hsvV = l + hsv1;
    return [h, hsvS, hsvV, a];
}
function HSVToHSL(hsva) {
    var h = hsva[0]
    var s = hsva[1] / 100
    var v = hsva[2] / 100
    var a = hsva[3]
    var l = (2 - s) * v / 2;

    if (l != 0) {
        if (l == 1) {
            s = 0
        } else if (l < 0.5) {
            s = s * v / (l * 2)
        } else {
            s = s * v / (2 - l * 2)
        }
    }

    return [h, s * 100, l * 100, a]
}

document.onmousemove = (e) => {
    valueDrag(e)
    hueDrag(e)
    opacDrag(e)
}

document.onmouseup = (e) => {
    valueEndDrag(e)
    opacEndDrag(e)
    hueEndDrag(e)
}


const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function setPickerColor(rgba) {
    if (!rgba) return false;
    let convHSV = RGBToHSV(rgba)
    var newPickerColor = [convHSV[0], convHSV[1], convHSV[2], convHSV[3]]
    vThumb.style.setProperty("--posX", convHSV[1] + "%")
    vThumb.style.setProperty("--posY", 100 - convHSV[2] + "%")
    hThumb.style.setProperty("--pos", ((1 - (convHSV[0] / 360)) * 100) + "%")
    hThumb.style.setProperty("--posp", 1 - convHSV[0] / 360)
    opacThumb.style.setProperty("--pos", convHSV[3] + "%")
    opacThumb.style.setProperty("--posp", convHSV[3] / 100)
    pickerColor = newPickerColor
    let hsla = HSVToHSL(pickerColor)
    updatePickerColor(rgba)
}
function updatePrevious(col) {
    let hsla = HSVToHSL(RGBToHSV(col))
    document.getElementById("color-previous").style.setProperty("--color", `hsla( ${hsla[0]}, ${hsla[1]}%, ${hsla[2]}%, ${hsla[3]}%)`)
}

function RGBToHSV(rgba) {
    var r = rgba[0]
    var g = rgba[1]
    var b = rgba[2]
    var a = rgba[3]
    let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
    rabs = r / 255;
    gabs = g / 255;
    babs = b / 255;
    v = Math.max(rabs, gabs, babs),
        diff = v - Math.min(rabs, gabs, babs);
    diffc = c => (v - c) / 6 / diff + 1 / 2;
    percentRoundFn = num => Math.round(num * 100) / 100;
    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(rabs);
        gg = diffc(gabs);
        bb = diffc(babs);

        if (rabs === v) {
            h = bb - gg;
        } else if (gabs === v) {
            h = (1 / 3) + rr - bb;
        } else if (babs === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        } else if (h > 1) {
            h -= 1;
        }
    }
    return [
        Math.round(h * 360),
        percentRoundFn(s * 100),
        percentRoundFn(v * 100),
        a / 255 * 100
    ];
}

function HSLToRGB(hsla) {
    var h = hsla[0] / 360
    var s = hsla[1] / 100
    var l = hsla[2] / 100
    var a = hsla[3]
    var r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), Math.round(a / 100 * 255)];
}



function dragOverHandler(e) {
    document.getElementById("color-menu-drop-effect").classList.add("color-menu-drop-effect-on")

    e.preventDefault();
    e.stopPropagation();
}

function dragLeaveHandler(e) {
    document.getElementById("color-menu-drop-effect").classList.remove("color-menu-drop-effect-on")

    e.preventDefault();
    e.stopPropagation();
}

async function dropHandler(e) {
    console.log('File(s) dropped');
    document.getElementById("color-menu-drop-effect").classList.remove("color-menu-drop-effect-on")

    e.preventDefault();
    e.stopPropagation();

    const dt = e.dataTransfer;
    if (!dt) return;
    if (dt.items) {
        console.log(dt.items)
        const items = await getAllFileEntries(dt.items);
        if (!items) return
        const files = await Promise.all(items.map((item) => new Promise((resolve, reject) => {
            item.file(resolve, reject);
        })));
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
            return false
        }
    }
    return fileEntries;
}

function addPaletteViewsFromFiles(files) {
    files.forEach((file, i) => {
        setTimeout(function () {
            AnyPalette.loadPalette(file, function (err, palette, formatUsed, matchedFileExtension) {
                if (palette) {
                    console.log(formatUsed.fileExtensionsPretty)
                    new paletteGroup(file.name.replace(formatUsed.fileExtensionsPretty, ""), formatAnyPalette(AnyPalette.uniqueColors(palette)), true)
                    //document.getElementById("palettes").scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
                }
            });
        }, i * 100);
    });
}

function formatAnyPalette(palette) {
    let pal = []
    palette.forEach(e => {
        pal.push([clamp(Math.round(e.red * 255), 0, 255), clamp(Math.round(e.green * 255), 0, 255), clamp(Math.round(e.blue * 255), 0, 255), 255])
    })
    return pal
}