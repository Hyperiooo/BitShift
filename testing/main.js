var srcWidth = 16;
var srcHeight = 16;
var destWidth = 32;
var destHeight = 32;

var srcCanvas = document.getElementById("src");
var destBufferCanvas = document.getElementById("destbuffer");
var srcCtx = srcCanvas.getContext("2d");
var destBufferCtx = destBufferCanvas.getContext("2d");

srcCanvas.width = srcWidth;
srcCanvas.height = srcHeight;
destBufferCanvas.width = destWidth;
destBufferCanvas.height = destHeight;

//function to draw random shapes on the src canvas
function drawRandomShapes() {
	srcCtx.clearRect(0, 0, srcCanvas.width, srcCanvas.height);
	srcCtx.fillRect(0, 0, 3, 3);
	srcCtx.fillRect(10, 10, 4, 5);
}

drawRandomShapes();

//function that draws an image from a url to the src canvas
function drawImageFromUrl(url) {
	var img = new Image();

	img.onload = function () {
		srcWidth = img.width;
		srcHeight = img.height;
		srcCanvas.width = srcWidth;
		srcCanvas.height = srcHeight;
		srcCtx.drawImage(img, 0, 0);
		scale();
	};
	img.src = url;
}
drawImageFromUrl(
	"https://cdn.lospec.com/palette-examples/oil-6-palette-example-example-by-mate-cziner-5b4d49.png"
);

function scale() {
	var data = srcCtx.getImageData(0, 0, srcWidth, srcHeight).data;
	destBufferCtx.clearRect(
		0,
		0,
		destBufferCanvas.width,
		destBufferCanvas.height
	);
	destBufferCanvas.width = destWidth;
	destBufferCanvas.height = destHeight;
	for (let x = 0; x < destWidth; x++) {
		for (let y = 0; y < destHeight; y++) {
			let srcX = Math.floor((x * srcWidth) / destWidth);
			let srcY = Math.floor((y * srcHeight) / destHeight);
			let srcIndex = (srcY * srcWidth + srcX) * 4;
			destBufferCtx.fillStyle =
				"rgba(" +
				data[srcIndex] +
				"," +
				data[srcIndex + 1] +
				"," +
				data[srcIndex + 2] +
				"," +
				data[srcIndex + 3] +
				")";
			destBufferCtx.fillRect(x, y, 1, 1);
		}
	}
}
scale();
