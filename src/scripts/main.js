var Tool = {
    "pen": 0,
    "eraser": 1,
    "fillBucket": 2,
    "line": 3,
    "ellipse": 4,
    "rect": 5,
    "shapeFilled": 6
};
var settings = {
    "background": {
        "width": 4, //size in px
        "height": 4, //size in px
        "colorOne": "#f0f0f0",
        "colorTwo": "#d4d4d4",
    },
    "ui": {
        "canvasScale": 20,
        "angle": 0,
        "transformX": 0,
        "transformY": 0,
    },
    "tools": {
        "brushSize": 1
    }
};
//class shadowRange {
//    constructor(el, func) {
//        var val1 = (el.value - el.min) / (el.max - el.min) * 100
//        el.style.background = 'linear-gradient(to right, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.15) ' + val1 + '%, rgba(255, 255, 255, 0.03) ' + val1 + '%, rgba(255, 255, 255, 0.03) 100%)'
//        el.oninput = function () {
//            var value = (this.value - this.min) / (this.max - this.min) * 100
//            this.style.background = 'linear-gradient(to right, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.15) ' + value + '%, rgba(255, 255, 255, 0.03) ' + value + '%, rgba(255, 255, 255, 0.03) 100%)'
//            eval(func)
//        };
//    }
//}
var tools = [true, false, false, false, false, false, true, true];
var lc = [];
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

        interact(this.canvasParent)
            .gesturable({
                listeners: {
                    start(event) {
                        settings.ui.angle -= event.angle
                        console.log(event)
                        event.preventDefault()
                        board.active = false
                        board.initialScale = settings.ui.canvasScale
                        console.log(settings.ui.canvasScale)
                    },
                    move(event) {
                        var currentScale = event.scale * board.initialScale
                        event.preventDefault()
                        board.active = false
                        board.setCanvScale(Math.pow(currentScale / 5, 1.25))
                    },
                    end(event) {
                        settings.ui.canvasScale = board.initialScale * event.scale
                        event.preventDefault()
                        board.active = true
                        console.log(settings.ui.canvasScale)
                    }
                }
            })
        this.canvas = document.querySelector("#canvas");
        this.previewcanvas = document.querySelector("#previewcanv");
        this.bggridcanvas = document.querySelector("#bggridcanv");
        document.documentElement.style.setProperty('--canvScale', this.canvScale);
        this.canvas.width = this.canvUnit * width;
        this.canvas.height = this.canvUnit * height;
        this.bggridcanvas.width = this.canvUnit * width;
        this.bggridcanvas.height = this.canvUnit * height;
        this.previewcanvas.width = this.canvUnit * width;
        this.previewcanvas.height = this.canvUnit * height;
        this.width = width;
        this.height = height;
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
        this.sX = 1;
        this.sY = 1;
        this.tempL = null;
        this.linePoints = [];
        this.filledData = {};
        this.shiftKey = false;
        this.ctrlKey = false;
        this.altKey = false;
        this.wasInCanv = false;
        this.drawBgGrid()
        this.changeBrushSize(settings.tools.brushSize)
        this.imageData = this.ctx.getImageData(0, 0, this.width, this.height)
        console.log(this.imageData)
        this.canvas.addEventListener("click", e => {
            var rect = this.canvas.getBoundingClientRect();
            var x = (e.clientX) - rect.left;
            var y = (e.clientY) - rect.top;
            x = Math.floor(this.width * x / (this.canvas.clientWidth * this.canvScale));
            y = Math.floor(this.height * y / (this.canvas.clientHeight * this.canvScale));
            if (tools[Tool.fillBucket]) {
                this.filler(x, y, this.data[x][y]);
            } else if (tools[Tool.eraser]) {
                var temp = this.color;
                this.setcolor([255, 255, 255, 255]);
                this.erase(x, y);
                this.setcolor(temp);
            } else if (tools[Tool.line]) {
            } else if (tools[Tool.rect]) {
            } else if (tools[Tool.ellipse]) {
            } else {
                //this.draw(new Point(x, y));
            }

        });

        this.canvasParent.addEventListener("mousedown", e => {
            if (e.button == 1) {
                this.setCanvTransform(e.clientX, e.clientY)
            }
        })

        this.canvasParent.addEventListener("mousemove", e => {
            if (e.buttons == 4) {
                this.setCanvTransform(e.clientX, e.clientY)
            }
        })
        this.canvasParent.addEventListener("wheel", e => {
            this.zoom(e.deltaY / 100 * -1, 0)
        })


        this.canvasParent.addEventListener("mouseup", e => {
            this.prevTX = null;
            this.prevTY = null;
        })

        this.canvas.addEventListener("mousemove", e => {
            this.inputActive(e)
        });

        this.canvas.addEventListener("mouseout", e => {
            if (tools[Tool.pen]) this.clearPreview()
        });

        this.canvas.addEventListener("touchmove", e => {
            this.inputActive(e)
        })

        this.canvas.addEventListener("mousedown", e => {
            console.log('acu')
            if (e.button != 0) {
                return
            }
            console.log('puncture')
            this.inputDown(e)
            this.inputActive(e)
        });
        this.canvas.addEventListener("mouseup", e => {
            this.inputUp(e)
        });

        this.canvas.addEventListener("touchstart", e => {
            this.inputDown(e)
        });
        this.canvas.addEventListener("touchend", e => {
            this.inputUp(e)
        });
    }
    inputDown(e) {
        this.active = true;
        var rect = this.canvas.getBoundingClientRect();
        var x = e.clientX - rect.left || e.touches[0].clientX - rect.left;
        var y = e.clientY - rect.top || e.touches[0].clientY - rect.top;
        x = Math.floor(this.width * x / (this.canvas.clientWidth * this.canvScale));
        y = Math.floor(this.height * y / (this.canvas.clientHeight * this.canvScale));
        if (tools[Tool.circle] || tools[Tool.ellipse] || tools[Tool.line] || tools[Tool.rect] || tools[Tool.pen]) {
            this.sX = x;
            this.sY = y;
        }

    }
    inputUp(e) {
        this.active = false;
        if (tools[Tool.circle] || tools[Tool.ellipse] || tools[Tool.line] || tools[Tool.rect]) {
            var p;
            for (p of this.tempL) this.draw(p);
            this.clearPreview()
            this.tempL = []
            //if (tools[Tool.shapeFilled] && tools[Tool.ellipse]) {
            //    console.log(this.filledData)
            //    let fillL = filledEllipse(this.filledData.c.x, this.filledData.c.y, this.filledData.x, this.filledData.y)
            //    for (let l of fillL) this.draw(l);
            //} else if (tools[Tool.shapeFilled] && tools[Tool.rect]) {
            //    let fillL = filledRectangle(this.filledData.r, this.filledData.c)
            //    for (let l of fillL) this.draw(l);
            //}
        }
        console.log(this.linePoints)
        this.linePoints = [];

    }
    inputActive(e) {//console.log(e.which)
        this.shiftKey = e.shiftKey;
        this.ctrlKey = e.ctrlKey;
        this.altKey = e.altKey;
        var rect = this.canvas.getBoundingClientRect();
        var x = (e.clientX) - rect.left || e.touches[0].clientX - rect.left || -1;
        var y = (e.clientY) - rect.top || e.touches[0].clientY - rect.top || -1;
        x = Math.floor((x) / (this.canvScale));
        y = Math.floor((y) / (this.canvScale));
        if (this.active) {
            if (tools[Tool.pen]) {
                let P = line(new Point(this.sX, this.sY), new Point(x, y))
                let p
                for (p of P) {
                    this.draw(new Point(p.x, p.y))
                    let brushSize = parseInt(settings.tools.brushSize)
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
            else if (tools[Tool.eraser]) {
                this.erase(x, y);
            }
            if (preview) {
                this.pctx.globalCompositeOperation = "destination-out";
                this.pctx.fillRect(0, 0, this.w, this.h);
                if (tools[Tool.ellipse]) {
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
                        if (tools[Tool.shapeFilled]) this.filledData = { "r": math.floor(r), "c": c };
                        var p;
                        for (p of this.tempL) this.pDraw(new Point(p.x, p.y));
                    } else if (!this.shiftKey) {
                        let c = new Point(this.sX, this.sY)
                        if (this.ctrlKey) { c = new Point(this.sX - (x - this.sX), this.sY - (y - this.sY)) }
                        //this.tempL = ellipse(this.round(Math.abs(x - c.x) / 2, .5), this.round(Math.abs(y - c.y) / 2, .5), c);
                        this.tempL = ellipse(x, y, c.x, c.y)
                        if (tools[Tool.shapeFilled]) this.filledData = { "x": x, "y": y, "c": c };
                        var p;
                        for (p of this.tempL) this.pDraw(new Point(p.x, p.y));
                        //if(this.ctrlKey) console.log('control hehe')
                    }

                }
                if (tools[Tool.line]) {
                    console.log("a")
                    let c = new Point(this.sX, this.sY)
                    this.tempL = line(c, new Point(x, y));
                    var p;
                    for (p of this.tempL) this.pDraw(new Point(p.x, p.y));

                }
                if (tools[Tool.rect]) {
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
        } else if (!this.active) {
            let brushSize = parseInt(settings.tools.brushSize)
            if (preview) {
                this.pctx.globalCompositeOperation = "destination-out";
                this.pctx.fillRect(0, 0, this.w, this.h);
                //TODO when doing brush size you'd modify it here
                if (!this.mobile) {
                    //let c = filledEllipse(x, y, 2, 2)
                    //var p;
                    //for (p of c) this.pDraw(p);
                    let brushSize = parseInt(settings.tools.brushSize)
                    let r = brushSize - 1
                    //let c = filledEllipse(p.x, p.y, 2, 2)
                    let c;
                    if (brushSize % 2 == 0) {
                        c = filledEllipse(x - (r / 2) - .5, y - (r / 2) - .5, x + (r / 2) - .5, y + (r / 2) - .5)
                    } else if (brushSize % 2 != 0) {
                        c = filledEllipse(x - (r / 2), y - (r / 2), x + (r / 2), y + (r / 2))
                    }
                    var b;
                    for (b of c) this.pDraw(b);
                }
            }
        }

    }
    round(value, step) {
        step || (step = 1.0);
        var inv = 1.0 / step;
        return Math.round(value * inv) / inv;
    }
    changeBrushSize(sz) {
        //let slide = document.getElementById('brushSzSlide')
        //let txt = document.getElementById('brushSzNum')
        //let icon = document.getElementById('brushSzIcon')
        //slide.value = sz
        //txt.value = sz
        settings.tools.brushSize = sz
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
        document.documentElement.style.setProperty('--canvScale', this.canvScale);
    }
    setCanvTransform(x, y) {
        if (!this.prevTX) { this.prevTX = x; }
        if (!this.prevTY) { this.prevTY = y; }
        if (!this.prevTY || !this.prevTX) { return; }
        settings.ui.transformX = settings.ui.transformX + (x - this.prevTX)
        settings.ui.transformY = settings.ui.transformY + (y - this.prevTY)
        document.documentElement.style.setProperty('--canvTransformX', settings.ui.transformX + "px");
        document.documentElement.style.setProperty('--canvTransformY', settings.ui.transformY + "px");
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
            this.ctx.globalCompositeOperation = 'source-over'
            this.ctx.fillRect(x, y, 1, 1);
        } else if (coord.constructor.name == "Rect") {
            var x1 = coord.x1
            var y1 = coord.y1
            var x2 = coord.x2
            var y2 = coord.y2
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
        if (coord.constructor.name == "Point") {
            var x = coord.x
            var y = coord.y
            this.pctx.globalCompositeOperation = 'source-over'
            this.pctx.fillRect(x, y, 1, 1);
        } else if (coord.constructor.name == "Rect") {
            var x1 = coord.x1
            var y1 = coord.y1
            var x2 = coord.x2
            var y2 = coord.y2
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
            this.pctx.fillRect(ax1, ay1, ax2 - ax1, ay2 - ay1);
        }
    }
    eDraw(coord) {
        if (coord.constructor.name == "Point") {
            var x = coord.x
            var y = coord.y
            if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                this.ctx.globalCompositeOperation = 'destination-out'
                this.ctx.fillRect(x, y, 1, 1);
            }
        }
    }
    erase(x, y) {
        var temp = this.color;
        this.eDraw(new Point(x, y));
        this.setcolor(temp);
        this.ctx.globalCompositeOperation = 'source-over'
    }
    setcolor(color) {
        console.log('a')
        setPickerColor(color)
        this.color = color;
        document.getElementById("tool-color").style.setProperty("--color", "rgba(" + color[0] + "," + color[1] + "," + color[2] + "," + color[3] + ")");
        this.ctx.fillStyle = "rgba(" + color[0] + "," + color[1] + "," + color[2] + "," + color[3] + ")";
        this.pctx.fillStyle = "rgba(" + color[0] + "," + color[1] + "," + color[2] + "," + color[3] + ")";
        //act(document.getElementById("pc-" + rgbToHex(color[0], color[1], color[2], color[3])))
        act(document.querySelectorAll(`[data-palette-color='${rgbToHex(color[0], color[1], color[2], color[3])}']`))
    }
    setmode(i, el) {
        if (tools[Tool.shapeFilled]) {
            tools = [false, false, false, false, false, false, false, false, false];
            tools[Tool.shapeFilled] = true

        } else {
            tools = [false, false, false, false, false, false, false, false, false];
        }
        tools[i] = true;
        document.querySelectorAll("#toolbar .item").forEach((x) => {
            x.classList.remove('tool-active');
        })
        el.classList.add("tool-active")
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
        this.setmode(Tool.pen);
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

    filler(startX, startY) {

        this.imageData = this.ctx.getImageData(0, 0, this.width, this.height)

        var pixelPos = (startY * this.width + startX) * 4,
            r = this.imageData.data[pixelPos],
            g = this.imageData.data[pixelPos + 1],
            b = this.imageData.data[pixelPos + 2],
            a = this.imageData.data[pixelPos + 3];

        console.log('test')
        //context.fillRect(startX, startY, 1, 1)
        console.log(r, g, b, a)

        if (r != this.color[0] || b != this.color[1] || g != this.color[2] || a != this.color[3]) this.floodFill(startX, startY, r, g, b, a);

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
    //document.querySelectorAll("input[type=range]").forEach((e) => {
    //    console.log(e.getAttribute('data-input-function'))
    //	new shadowRange(e, e.getAttribute('data-input-function'))
    //})
    let canvasData = localStorage.getItem('pc-canvas-data');
    if (canvasData) {
        data = JSON.parse(canvasData);
        console.log(data);
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
    else {
        newProject();
        preparePalette()
    }
}

function preparePalette() {
    var setCurrent = false;
    colors.forEach(g => {
        var title = g.title
        var palette = g.colors
        var paletteParent = document.getElementById("palettes")
        var group = document.createElement("div")
        group.classList.add("color-palette-group")
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
        titleEl.onmousedown = (e) => {
            if(tempOut) return;
            startRect = group.getBoundingClientRect()
            tempNode = group.cloneNode(true)
            tempNode.querySelector(".color-palette-title").onmouseup = mouseUpHandler
            tempNode.onmousedown = (e) => {
                startRect = e.target.getBoundingClientRect()
                if (tempOut) {
                    subMoving = true;
                    startX = e.clientX;
                    startY = e.clientY;
                    document.querySelectorAll(".color-palette-group").forEach(e => {
                        e.style.setProperty('z-index', 'unset', 'important')
                    })
                    group.style.setProperty('z-index', '100000000', 'important')
                    tempNode.style.setProperty('z-index', '100000001', 'important')
                }
            }
            tempNode.classList.replace("color-palette-group", "color-palette-standalone")
            tempNode.style.width = startRect.width + "px"
            document.body.appendChild(tempNode)
            console.log(group)
            mainMoving = true;
            startX = e.clientX;
            startY = e.clientY;
            document.querySelectorAll(".color-palette-group").forEach(e => {
                e.style.setProperty('z-index', 'unset', 'important')
            })
            group.style.setProperty('z-index', '100000000', 'important')
            tempNode.style.setProperty('z-index', '100000001', 'important')
        }
        titleEl.onmouseup = mouseUpHandler
        function mouseUpHandler(e) {
            console.log(tempOut)
            if(tempOut) {mouseUpSub(); return}
            if(tempOut == false){
                mainMoving = false;
                tempOut = true
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
        document.addEventListener("mousemove", (e) => {
            if (mainMoving) {
                curX = lerp(e.clientX - startX, 0, 0.7);
                curY = lerp(e.clientY - startY, 0, 0.7);
                group.style.transform = `translate(${Math.ceil(curX)}px, ${Math.ceil(curY)}px)`;
                tempNode.style.transform = `translate(${startRect.x + Math.ceil(curX) - 8}px, ${startRect.y + Math.ceil(curY) - 30}px)`;
                if (Math.abs(curX) > 100 || Math.abs(curY) > 100) mouseUpHandler()
            }
            if(!tempNode) return
            if(!subMoving) return;
            if (subMoving) {
                var timeout = setInterval(() => {
                    offsetX = lerp(0, offsetX, 0.9)
                    offsetY = lerp(0, offsetY, 0.9)
                }, 2);
                tX = e.clientX - startX - offsetX
                tY = e.clientY - startY - offsetY
                tempNode.style.transform = `translate(${startRect.x + Math.ceil(tX) - 8}px, ${startRect.y + Math.ceil(tY) - 30}px)`;

            }
        })

        palette.forEach(x => {
            if (!setCurrent) {
                setCurrent = true
                board.setcolor(x)
            }
            var rgba = `rgba(${x[0]},${x[1]},${x[2]}, ${x[3] / 256 * 100}%)`
            //inner += `<span id="pc-${rgbToHex(x[0], x[1], x[2], x[3])}" class="item" onclick="board.setcolor([${x}]);" ></span>\n`
            let e = document.createElement("span")
            e.setAttribute("data-palette-color", `${rgbToHex(x[0], x[1], x[2], x[3])}`)
            e.classList.add('palette-color')
            e.style.setProperty("--color", rgba)
            e.setAttribute("onclick", `board.setcolor([${x}])`)
            colorMenu.appendChild(e)
        })
        console.log(palette)
    });
}
function rgbToHex(r, g, b, a) {
    return componentToHex(r) + componentToHex(g) + componentToHex(b) + componentToHex(a);
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

var test = [{
    title: "Default",
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
    title: "Ice Cream GB",
    colors: [
        [124, 63, 88, 255],
        [235, 107, 111, 255],
        [249, 168, 117, 255],
        [255, 246, 211, 255]
    ]
}, {
    title: "SpaceHaze",
    colors: [
        [248, 227, 196, 255],
        [204, 52, 149, 255],
        [107, 31, 177, 255],
        [11, 6, 48, 255]
    ]
}, {
    title: "Neon Space",
    colors: [
        [223, 7, 114, 255],
        [254, 84, 111, 255],
        [255, 158, 125, 255],
        [255, 208, 128, 255],
        [255, 253, 255, 255],
        [11, 255, 230, 255],
        [1, 203, 207, 255],
        [1, 136, 165, 255],
        [62, 50, 100, 255],
        [53, 42, 85, 255]
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
    localStorage.removeItem('pc-canvas-data');
    window.dim = new Popup("#popup");
    window.colors = [{
        title: "Default",
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
        title: "Ice Cream GB",
        colors: [
            [124, 63, 88, 255],
            [235, 107, 111, 255],
            [249, 168, 117, 255],
            [255, 246, 211, 255]
        ]
    }, {
        title: "SpaceHaze",
        colors: [
            [248, 227, 196, 255],
            [204, 52, 149, 255],
            [107, 31, 177, 255],
            [11, 6, 48, 255]
        ]
    }, {
        title: "Neon Space",
        colors: [
            [223, 7, 114, 255],
            [254, 84, 111, 255],
            [255, 158, 125, 255],
            [255, 208, 128, 255],
            [255, 253, 255, 255],
            [11, 255, 230, 255],
            [1, 203, 207, 255],
            [1, 136, 165, 255],
            [62, 50, 100, 255],
            [53, 42, 85, 255]
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

function toggleFile() {

}

var pickerColor = [0, 0, 0, 100]

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
    if (opacMoving) {
        pickerColor[3] = clamp((e.clientY - opacRect.top) / opacRect.height * 100, 0, 100)
        opacThumb.style.setProperty("--pos", clamp((e.clientY - opacRect.top) / opacRect.height * 100, 0, 100) + "%")
        opacThumb.style.setProperty("--posp", clamp((e.clientY - opacRect.top) / opacRect.height, 0, 1))
        updatePickerColor()
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
    if (hueMoving) {
        pickerColor[0] = clamp((1 - ((e.clientY - hueRect.top) / hueRect.height)), 0, 1) * 360
        hThumb.style.setProperty("--pos", clamp((e.clientY - hueRect.top) / hueRect.height * 100, 0, 100) + "%")
        hThumb.style.setProperty("--posp", clamp((e.clientY - hueRect.top) / hueRect.height, 0, 1))
        updatePickerColor()
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
    if (valueMoving) {
        pickerColor[1] = clamp((e.clientX - valueRect.left) / valueRect.width * 100, 0, 100)
        pickerColor[2] = 100 - clamp((e.clientY - valueRect.top) / valueRect.height * 100, 0, 100)
        vThumb.style.setProperty("--posX", clamp((e.clientX - valueRect.left) / valueRect.width * 100, 0, 100) + "%")
        vThumb.style.setProperty("--posY", clamp((e.clientY - valueRect.top) / valueRect.height * 100, 0, 100) + "%")
        updatePickerColor()
    }
}

function updatePickerColor() {
    opacRange.style.setProperty("--hue", pickerColor[0])
    valueRange.style.setProperty("--hue", pickerColor[0])
    let hsla = HSVToHSL(pickerColor)
    opacRange.style.setProperty("--color", `hsl( ${hsla[0]}, ${hsla[1]}%, ${hsla[2]}%)`)
    document.getElementById("color-current").style.setProperty("--color", `hsla( ${hsla[0]}, ${hsla[1]}%, ${hsla[2]}%, ${hsla[3]}%)`)
    //console.log(`hsla( ${hsla[0]}, ${hsla[1]}%, ${hsla[2]}%, ${hsla[3]}%)`)
    //console.log("%c _", `background: hsla( ${hsla[0]}, ${hsla[1]}%, ${hsla[2]}%, ${hsla[3]}%)`)
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
    console.log(rgba)
    let convHSV = RGBToHSV(rgba)
    console.log(convHSV)
    var newPickerColor = [convHSV.h, convHSV.s, convHSV.v, convHSV.a]
    vThumb.style.setProperty("--posX", convHSV.s + "%")
    vThumb.style.setProperty("--posY", 100 - convHSV.v + "%")
    hThumb.style.setProperty("--pos", ((1 - (convHSV.h / 360)) * 100) + "%")
    hThumb.style.setProperty("--posp", 1 - convHSV.h / 360)
    opacThumb.style.setProperty("--pos", convHSV.a + "%")
    opacThumb.style.setProperty("--posp", convHSV.a / 100)
    pickerColor = newPickerColor
    let hsla = HSVToHSL(pickerColor)
    document.getElementById("color-previous").style.setProperty("--color", `hsla( ${hsla[0]}, ${hsla[1]}%, ${hsla[2]}%, ${hsla[3]}%)`)
    updatePickerColor()
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
    return {
        h: Math.round(h * 360),
        s: percentRoundFn(s * 100),
        v: percentRoundFn(v * 100),
        a: a / 255 * 100
    };
}