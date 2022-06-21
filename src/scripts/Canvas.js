class Canvas {
    constructor(width, height) {
        document.documentElement.style.setProperty('--canvX', width + "px");
        document.documentElement.style.setProperty('--canvY', height + "px");

        this.canvasParent = document.getElementById("canvas-parent")
        this.canvasParent.addEventListener("touchmove", (e) => {
            e.preventDefault()
        })

        this.undoBuffer = "";
        this.redoBuffer = "";


        this.initialScale = 1
        this.canvScale = settings.ui.canvasScale
        this.previewcanvas = document.querySelector("#previewcanv");
        this.cursorcanvas = document.querySelector("#cursorcanv");
        this.bggridcanvas = document.querySelector("#bggridcanv");
        this.eBufferCanvas = document.getElementById("eraserBrushBufferParent");
        this.canvaslayersparent = document.getElementById("layers-wrap")
        this.ectx = this.eBufferCanvas.getContext("2d");
        document.documentElement.style.setProperty('--canvScale', this.canvScale);
        this.bggridcanvas.width = width;
        this.bggridcanvas.height = height;
        this.previewcanvas.width = width;
        this.previewcanvas.height = height;
        this.width = width;
        this.height = height;
        this.canvaslayersparent.width = this.width
        this.canvaslayersparent.height = this.height
        this.canvaslayersparent.style.width = this.width + "px"
        this.canvaslayersparent.style.height = this.height + "px"
        if (window.innerHeight / this.height / 1.25 < window.innerWidth / this.width / 1.25) {
            settings.ui.canvasScale = window.innerHeight / this.height / 1.25
        } else {
            settings.ui.canvasScale = window.innerWidth / this.width / 1.25

        }
        this.previewcanvas.style.display = "block";
        this.bggridcanvas.style.display = "block";
        this.w = width;
        this.h = height;
        this.ctx
        this.pctx = this.previewcanvas.getContext("2d");
        this.ccctx = this.cursorcanvas.getContext("2d");
        this.bggctx = this.bggridcanvas.getContext("2d");
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

        this.panzoom = panzoom(this.canvaslayersparent, {
            smoothScroll: false,
            initialX: this.width / 2 - (((this.canvasParent.offsetWidth / 2) - (this.width / 2)) / settings.ui.canvasScale),
            initialY: this.height / 2 - (((this.canvasParent.offsetHeight / 2) - (this.height / 2)) / settings.ui.canvasScale),
            initialZoom: settings.ui.canvasScale,
            zoomSpeed: 0.15,
            onDoubleClick: function(e) {
                return false;
            },
            beforeMouseDown: function(e) {
                return e.button != 1;
            },
            beforeTouchDown: function(e) {
                return !(e.touches.length > 1);
            },
            zoomDoubleClickSpeed: 1,
        })
        var _self = this
        this.panzoom.on('transform', function(e) {
            // This event will be called along with events above.
            _self.cursorcanvas.style.transform = _self.previewcanvas.style.transform = _self.bggridcanvas.style.transform = _self.canvaslayersparent.style.transform
            _self.cursorcanvas.style.transformOrigin = _self.previewcanvas.style.transformOrigin = _self.bggridcanvas.style.transformOrigin = _self.canvaslayersparent.style.transformOrigin
            _self.setCanvScale(_self.panzoom.getTransform().scale)
            _self.setCanvTransform(_self.panzoom.getTransform().x, _self.panzoom.getTransform().y)
        });
        this.startZoomX = 0
        this.startZoomY = 0
        this.deltaX = 0
        this.deltaY = 0
        this.deltaPanX = 0
        this.deltaPanY = 0
        this.panning = false;

        this.mouseDownEvent = (e) => {
            if (e.button == 1) this.panning = true
            if (e.button != 0) {
                return
            }
            this.inputDown(e)
            this.inputActive(e)

        }


        this.touchStartEvent = (e) => {
            this.inputDown(e)
            if (e.touches.length > 1) {
                this.panning = true;
                this.deltaX = (e.touches[0].clientX + e.touches[1].clientX) / 2
                this.deltaY = (e.touches[0].clientY + e.touches[1].clientY) / 2
            } else {
                this.deltaX = e.touches[0].clientX
                this.deltaY = e.touches[0].clientY
            }
        }


        this.moveEvent = (e) => {
            var x, y
            if (e.touches && e.touches.length > 1) {
                x = (e.touches[0].clientX + e.touches[1].clientX) / 2
                y = (e.touches[0].clientY + e.touches[1].clientY) / 2
            } else if (e.touches) {
                x = e.touches[0].clientX
                y = e.touches[0].clientY
            }

            if (e.touches && e.touches.length != 1) {
                this.panning = true;
                this.panzoom.moveBy(-(this.deltaX - x), -(this.deltaY - y))
                this.deltaX = (e.touches[0].clientX + e.touches[1].clientX) / 2
                this.deltaY = (e.touches[0].clientY + e.touches[1].clientY) / 2
                return
            } else {}

            if (e.button) {
                if (e.button != 0) return
            }

            this.inputActive(e)
        }

        this.mouseUpEvent = (e) => {
            this.prevTX = null;
            this.prevTY = null;
            this.inputUp(e, this.panning)
            this.panning = false
        }

        this.touchEndEvent = (e) => {
            this.inputUp(e, this.panning)

            if (e.touches.length == 0) this.panning = false
        }

        this.clickEvent = (e) => {
            var rect = this.bggridcanvas.getBoundingClientRect();
            var x, y
            if (e.touches) {
                x = e.touches[0].clientX
                y = e.touches[0].clientY
            } else {
                x = e.clientX
                y = e.clientY
            }
            x = x - rect.left;
            y = y - rect.top;
            x = Math.floor(this.width * x / (this.bggridcanvas.clientWidth * this.canvScale));
            y = Math.floor(this.height * y / (this.bggridcanvas.clientHeight * this.canvScale));
            if (Tools.fillBucket && settings.tools.contiguous.value) {
                this.filler(x, y, this.data[x][y]);
            } else if (Tools.fillBucket && !settings.tools.contiguous.value) {
                this.fillerNonContiguous(new Point(x, y));
            }
        }

        this.canvasParent.addEventListener("touchmove", this.moveEvent)
        this.canvasParent.addEventListener("mousemove", this.moveEvent)
        this.canvasParent.addEventListener("touchstart", this.touchStartEvent)
        this.canvasParent.addEventListener("mousedown", this.mouseDownEvent)
        this.canvasParent.addEventListener("touchstart", this.touchStartEvent);
        this.canvasParent.addEventListener("touchend", this.touchEndEvent);
        this.canvasParent.addEventListener("mouseup", this.mouseUpEvent)
        this.canvasParent.addEventListener("touchstart", this.clickEvent);
        this.canvasParent.addEventListener("click", this.clickEvent);

    }
    destroy() {
        this.canvasParent.removeEventListener("touchmove", this.moveEvent)
        this.canvasParent.removeEventListener("mousemove", this.moveEvent)
        this.canvasParent.removeEventListener("touchstart", this.touchStartEvent)
        this.canvasParent.removeEventListener("mousedown", this.mouseDownEvent)
        this.canvasParent.removeEventListener("touchstart", this.touchStartEvent);
        this.canvasParent.removeEventListener("touchend", this.touchEndEvent);
        this.canvasParent.removeEventListener("mouseup", this.mouseUpEvent)
    }
    inputDown(e) {
        updatePrevious(this.color)
        var rect = this.bggridcanvas.getBoundingClientRect();
        var x = e.clientX - rect.left || e.touches[0].clientX - rect.left;
        var y = e.clientY - rect.top || e.touches[0].clientY - rect.top;
        x = Math.floor(this.width * x / (this.bggridcanvas.clientWidth * this.canvScale));
        y = Math.floor(this.height * y / (this.bggridcanvas.clientHeight * this.canvScale));
        if (Tools.circle || Tools.ellipse || Tools.line || Tools.rect || Tools.pen || Tools.eraser) {
            this.sX = x;
            this.sY = y;
        }

        this.undoBuffer = layer.canvasElement.toDataURL();
    }
    inputUp(e, wasPanning) {
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
        updateCanvasPreview()
        this.linePoints = [];
        this.redoBuffer = layer.canvasElement.toDataURL();
        var buf = this.undoBuffer;
        var rbuf = this.redoBuffer;
        var curCtx = layer.ctx
        var curCanv = layer.canvasElement
        var uCallback = function() {
            var img = new window.Image();
            img.setAttribute("src", buf);
            img.onload = function() {
                curCtx.clearRect(0, 0, curCanv.width, curCanv.height)
                curCtx.drawImage(img, 0, 0);
            };
        }
        var rCallback = function() {
            var img = new window.Image();
            img.setAttribute("src", rbuf);
            img.onload = function() {
                curCtx.clearRect(0, 0, curCanv.width, curCanv.height)
                curCtx.drawImage(img, 0, 0);
            };
        }
        debug.log("wasPanning: " + wasPanning)
        if (!wasPanning) addToUndoStack(uCallback, rCallback);
    }
    inputActive(e) {
        this.shiftKey = e.shiftKey;
        this.ctrlKey = e.ctrlKey;
        this.altKey = e.altKey;
        var rect = this.bggridcanvas.getBoundingClientRect();
        var x = (e.clientX) - rect.left || e.touches[0].clientX - rect.left || -1;
        var y = (e.clientY) - rect.top || e.touches[0].clientY - rect.top || -1;
        x = Math.floor((x) / (this.canvScale));
        y = Math.floor((y) / (this.canvScale));
        if (Tools.eraser) {
            drawEraserPreview(x, y)
        };
        if (Tools.sprayPaint) {
            drawSprayPreview(x, y)
        };
        if (e.buttons != 0) { //calls whenever there is touch
            console.log('a')
            if (activeLayer.settings.locked) return
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
            } else if (Tools.sprayPaint) {
                if (this.panning) return
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
            } else if (Tools.eraser) {
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
            } else if (Tools.eyedropper) {
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
                            }
                            if (x - this.sX < 0 && y - this.sY >= 0) { // bottom left
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
        } else if (e.buttons == 0) { //calls whenever there is no touch, aka previewing
            if (preview) {
                if (activeLayer.settings.locked) return
                var tempCol
                this.previewcanvas.style.setProperty("--opac", 1)
                if (Tools.eyedropper) return
                if (Tools.eraser) {
                    return;
                };
                this.pctx.globalCompositeOperation = "destination-out";
                this.pctx.fillRect(0, 0, this.w, this.h);
                if (isMobile) return;
                let brushSize = parseInt(settings.tools.brushSize.value)
                let r = brushSize - 1
                if (Tools.fillBucket) r = 0;
                let c;
                if (brushSize % 2 == 0) {
                    c = filledEllipse(x - (r / 2) - .5, y - (r / 2) - .5, x + (r / 2) - .5, y + (r / 2) - .5)
                } else if (brushSize % 2 != 0) {
                    c = filledEllipse(x - (r / 2), y - (r / 2), x + (r / 2), y + (r / 2))
                }
                var b;
                for (b of c) { this.pDraw(b) }

                if (Tools.eraser) {}

            }
        }
    }
    round(value, step) {
        step || (step = 1.0);
        var inv = 1.0 / step;
        return Math.round(value * inv) / inv;
    }
    zoom(z) {
        this.setCanvScale(Math.max(settings.ui.canvasScale + z, 1))
    }
    setCanvScale(s) {
        settings.ui.canvasScale = s;
        this.canvScale = settings.ui.canvasScale;
        this.cursorcanvas.width = project.width * this.canvScale;
        this.cursorcanvas.height = project.height * this.canvScale;

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
        var w = settings.background.width;
        var h = settings.background.height;
        nRow = nRow || 8; // default number of rows
        nCol = nCol || 8; // default number of columns

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
        let Points = [
            [0, 20],
            [20, 20],
            [30, 10],
            [40, 8],
            [50, 10],
            [60, 20],
            [70, 30]
        ]
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
            let xi = Pi[0];
            let yi = Pi[1];
            let xj = Pj[0];
            let yj = Pj[1];
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
        document.querySelectorAll("[data-tool-color-menu-button]").forEach(e => {
            e.style.setProperty("--color", "rgba(" + color[0] + "," + color[1] + "," + color[2] + "," + color[3] + ")");
        })
        if (this.ctx) this.ctx.fillStyle = "rgba(" + color[0] + "," + color[1] + "," + color[2] + "," + color[3] + ")";
        this.pctx.fillStyle = "rgba(" + color[0] + "," + color[1] + "," + color[2] + "," + color[3] + ")";
        act(document.querySelectorAll(`[data-palette-color='${rgbToHex(color[0], color[1], color[2], color[3])}']`))
    }
    save() {
        this.canvas.toBlob(function(blob) {
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
        updateCanvasPreview();
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
        if (r == this.color[0] && g == this.color[1] && b == this.color[2] && a == this.color[3]) return
        this.floodFill(startX, startY, r, g, b, a);

        this.redraw();
        updateCanvasPreview();
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
            pixelStack = [
                [startX, startY]
            ];

        while (pixelStack.length) {

            newPos = pixelStack.pop(); //sets newPos to start x and y in beginning
            x = newPos[0]; //sets x to x val of newPos
            y = newPos[1]; //sets y to y val of newPos

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