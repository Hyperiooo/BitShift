/*
 *
 *  function Template
 *
 *  function Shape_name(data){
 *	//data -> parameters Required for the Shape
 *	let points = [];
 *
 *	// Calculate points
 *
 *	return points;
 * }
 *
 * example:
 * 	function line(x0, y0, x1, y1){
 * 	  //x0, y0 -> Initial Points of Line
 *	  //x1, y1 ->  End Points of the line
 *        let points = []
 * 	
 *	  //Calculate points
 *
 *	  return points
 *	
 */


class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

function rectangle(sP, eP) {
	let allP = [];
	let lH = line(new Point(sP.x, eP.y), new Point(eP.x, eP.y))
	let lV = line(new Point(sP.x, sP.y), new Point(sP.x, eP.y))
	let tH = line(new Point(sP.x, sP.y), new Point(eP.x, sP.y))
	let tV = line(new Point(eP.x, sP.y), new Point(eP.x, eP.y))
	let l;
	for (l of lH) allP.push(l)
	for (l of lV) allP.push(l)
	for (l of tH) allP.push(l)
	for (l of tV) allP.push(l)
	return allP
}
function filledRectangle(sP, eP) {
	let allP = [];
	let lH = line(new Point(sP.x, eP.y), new Point(eP.x, eP.y))
	let lV = line(new Point(sP.x, sP.y), new Point(sP.x, eP.y))
	let tH = line(new Point(sP.x, sP.y), new Point(eP.x, sP.y))
	let tV = line(new Point(eP.x, sP.y), new Point(eP.x, eP.y))
	let l;
	for (l of lH) allP.push(l)
	for (l of lV) allP.push(l)
	for (l of tH) allP.push(l)
	for (l of tV) allP.push(l)
	for (let i = 0; i < lV.length; i++) {
		const p = lV[i];
		const p2 = tV[i];

		let lin = line(p, p2);
		for (let lo of lin) allP.push(lo)

	}
	return allP
}


function line(p1, p2) {
	/* this function calculates the points of the line with endpoints p1 &p2
	 */
	let points = [];
	let dx = Math.abs(p2.x - p1.x);
	let sx = p1.x < p2.x ? 1 : -1;
	let dy = -Math.abs(p2.y - p1.y);
	let sy = p1.y < p2.y ? 1 : -1;
	let err = dx + dy;

	let x1 = p1.x;
	let y1 = p1.y;
	while (true) {
		points.push(new Point(x1, y1));
		if (x1 == p2.x && y1 == p2.y) {
			break;
		}
		let e2 = 2 * err;
		if (e2 >= dy) {
			err += dy;
			x1 += sx;
		}

		if (e2 <= dx) {
			err += dx;
			y1 += sy;
		}
	}
	return points;
}


//console.log(line(new Point(1, 1), new Point(5, 5)));


function circleO(r, pc) {
	/* This function returns points of Circle with radius r and center as pc*/

	let points = [];
	let x = 0;
	let y = r;
	points.push(new Point(x, y));
	p = 1 - r;

	while (x <= y) {
		//conditions
		x++;

		if (p < 0) {
			points.push(new Point(x, y));
			p = p + (2 * x) + 1;
		} else if (p >= 0) {
			y--;
			points.push(new Point(x, y));
			p = p + (2 * x) + 1 - (2 * y);
		}
	}

	points = _sym8(points);
	for (let pt of points) {
		pt.x += pc.x;
		pt.y += pc.y;
	}

	return points;
}
function filledCircleO(r, pc) {
	/* This function returns points of Circle with radius r and center as pc*/

	let points = [];
	let x = 0;
	let y = r;
	points.push(new Point(x, y));
	p = 1 - r;

	while (x <= y) {
		//conditions
		x++;

		if (p < 0) {
			points.push(new Point(x, y));
			p = p + (2 * x) + 1;
		} else if (p >= 0) {
			y--;
			points.push(new Point(x, y));
			p = p + (2 * x) + 1 - (2 * y);
		}
	}

	points = _sym45(points);
	let nPoints = []
	let usedY = []
	for (let it of points) {
		nPoints.push(new Point(it.x, it.y))
		if (!usedY.includes(it.y)) {
			nPoints.push(new Point(0, it.y))
			usedY.push(it.y);
			let l = line(new Point(it.x, it.y), new Point(0, it.y))
			for (let lP of l) {
				nPoints.push(lP)
			}
		}
	}
	nPoints = _sym4(nPoints)
	for (let pt of nPoints) {
		pt.x += pc.x;
		pt.y += pc.y;
	}

	return { "f": nPoints, "l": points };
}
function _sym45(points) {
	/* This is a helper function for circle which calculates points on all the 8 symmetries */
	let nPoints = [];

	Array.prototype.push.apply(nPoints, points);

	for (let p of points) {
		nPoints.push(new Point(p.y, p.x));
	}
	for (let p of points) {
		//nPoints.push(new Point(-p.y, p.x));
	}
	for (let p of points) {
		//nPoints.push(new Point(-p.x, p.y));
	}
	for (let p of points) {
		//nPoints.push(new Point(-p.x, -p.y));
	}
	for (let p of points) {
		//nPoints.push(new Point(-p.y, -p.x));
	}
	for (let p of points) {
		//nPoints.push(new Point(p.y, -p.x));
	}
	for (let p of points) {
		//nPoints.push(new Point(p.x, -p.y));
	}
	return nPoints;
}
function _sym8(points) {
	/* This is a helper function for circle which calculates points on all the 8 symmetries */
	let nPoints = [];

	Array.prototype.push.apply(nPoints, points);

	for (let p of points) {
		nPoints.push(new Point(p.y, p.x));
	}
	for (let p of points) {
		nPoints.push(new Point(-p.y, p.x));
	}
	for (let p of points) {
		nPoints.push(new Point(-p.x, p.y));
	}
	for (let p of points) {
		nPoints.push(new Point(-p.x, -p.y));
	}
	for (let p of points) {
		nPoints.push(new Point(-p.y, -p.x));
	}
	for (let p of points) {
		nPoints.push(new Point(p.y, -p.x));
	}
	for (let p of points) {
		nPoints.push(new Point(p.x, -p.y));
	}
	return nPoints;
}

function ellipseB(rx, ry, pc) {
	/* This function return the points of the ellipse with major axis rx and minor axis ry with center pc */
	let points = [];
	let x = 0;
	let y = ry;
	points.push(new Point(x, y));

	//Region 1
	let p1 = Math.pow(ry, 2) + (1 / 4) * Math.pow(rx, 2) - Math.pow(rx, 2) * ry;

	while ((2 * Math.pow(ry, 2) * x) < (2 * Math.pow(rx, 2) * y)) {
		x++;
		//console.log(x);
		if (p1 < 0) {
			points.push(new Point(x, y));
			p1 = p1 + 2 * Math.pow(ry, 2) * x + Math.pow(ry, 2);
		} else {
			y--;
			points.push(new Point(x, y));
			p1 = p1 + 2 * Math.pow(ry, 2) * x - 2 * Math.pow(rx, 2) * y + Math.pow(ry, 2);
		}
	}

	//Region 2
	let x0 = points[points.length - 1].x;
	let y0 = points[points.length - 1].y;

	let p2 = Math.pow(ry, 2) * Math.pow((x0 + 1 / 2), 2) + Math.pow(rx, 2) * Math.pow((y0 - 1), 2) - Math.pow(rx, 2) * Math.pow(ry, 2);

	while (y0 >= 0) {
		y0--;

		if (p2 < 0) {
			points.push(new Point(x0, y0));
			p2 = p2 - 2 * Math.pow(rx, 2) * y0 + Math.pow(rx, 2);
		}
		else {
			x0++;
			points.push(new Point(x0, y0));
			p2 = p2 + 2 * Math.pow(ry, 2) * x0 - 2 * Math.pow(rx, 2) * y0 + Math.pow(rx, 2);
		}
	}
	//symmetrizing
	points = _sym4(points);
	//offsetting the center
	for (let pt of points) {
		pt.x += pc.x;
		pt.y += pc.y;
	}
	return points;
}

function _sym4(points) {
	/* This is a helper function for ellipse which calculates points on all the 4 symmetries */
	let nPoints = [];

	Array.prototype.push.apply(nPoints, points);

	for (let p of points) {
		nPoints.push(new Point(-p.x, p.y));
	}
	for (let p of points) {
		nPoints.push(new Point(-p.x, -p.y));
	}
	for (let p of points) {
		nPoints.push(new Point(p.x, -p.y));
	}
	return nPoints;
}

//console.log(ellipse(5, 5,new Point(0, 0)));
//console.log(circle(5,new Point(0, 0)));


function circle(r, pc) {
	let xm = pc.x
	let ym = pc.y
	let points = []
	var x = -r, y = 0, err = 2 - 2 * r;                /* bottom left to top right */
	do {
		points.push(new Point(xm - x, ym + y));                            /*   I. Quadrant +x +y */
		points.push(new Point(xm - y, ym - x));                            /*  II. Quadrant -x +y */
		points.push(new Point(xm + x, ym - y));                            /* III. Quadrant -x -y */
		points.push(new Point(xm + y, ym + x));                            /*  IV. Quadrant +x -y */
		r = err;
		if (r <= y) err += ++y * 2 + 1;                                   /* y step */
		if (r > x || err > y) err += ++x * 2 + 1;                         /* x step */
	} while (x < 0);
	return (points)
}

function filledCircle(r, pc) {
	let xm = pc.x
	let ym = pc.y
	let points = []
	for (let x = -r; x < r; x++) {
		let height = Math.sqrt((r * r) - x * x)

		for (let y = -height; y < height; y++) {
			points.push(new Point(Math.round(x + xm), Math.round(y + ym)));
		}
	}
	return points
}

function ellipse(x0, y0, x1, y1) {                              /* rectangular parameter enclosing the ellipse */
	var a = Math.abs(x1 - x0), b = Math.abs(y1 - y0), b1 = b & 1;        /* diameter */
	var dx = 4 * (1.0 - a) * b * b, dy = 4 * (b1 + 1) * a * a;              /* error increment */
	var err = dx + dy + b1 * a * a, e2;                             /* error of 1.step */

	if (x0 > x1) { x0 = x1; x1 += a; }        /* if called with swapped points */
	if (y0 > y1) y0 = y1;                                  /* .. exchange them */
	y0 += (b + 1) >> 1; y1 = y0 - b1;                              /* starting pixel */
	a = 8 * a * a; b1 = 8 * b * b;
	let points = []
	do {
		points.push(new Point(x1, y0));                                      /*   I. Quadrant */
		points.push(new Point(x0, y0));                                      /*  II. Quadrant */
		points.push(new Point(x0, y1));                                      /* III. Quadrant */
		points.push(new Point(x1, y1));                                      /*  IV. Quadrant */
		e2 = 2 * err;
		if (e2 <= dy) { y0++; y1--; err += dy += a; }                 /* y step */
		if (e2 >= dx || 2 * err > dy) { x0++; x1--; err += dx += b1; }       /* x */
	} while (x0 <= x1);

	while (y0 - y1 <= b) {                /* too early stop of flat ellipses a=1 */
		points.push(new Point(x0 - 1, y0));                         /* -> finish tip of ellipse */
		points.push(new Point(x1 + 1, y0++));
		points.push(new Point(x0 - 1, y1));
		points.push(new Point(x1 + 1, y1--));
	}
	let nPoints = []
	let usedY = []
	for (let it of points) {
		nPoints.push(new Point(it.x - x0, it.y - ((y0+y1)/2)))
		if (!usedY.includes(it.y)) {
			nPoints.push(new Point(x0- x0, it.y - ((y0+y1)/2)))
			usedY.push(it.y);
			let l = line(new Point(it.x - x0, it.y - ((y0+y1)/2)), new Point(x0 - x0, it.y - ((y0+y1)/2)))
			for (let lP of l) {
				nPoints.push(lP)
			}
		}
	}
	nPoints = _sym4(nPoints)
	for (let pt of nPoints) {
		pt.x += ((x0+x1)/2);
		pt.y += ((y0+y1)/2);
	}
	return points
}


function setPixel(x, y) {
	board.draw(x, y)
}
