function renderCanvas() {
  if (!window.canvasInterface) {
    requestAnimationFrame(renderCanvas);
    return;
  }
  vCtx.clearRect(0, 0, viewport.width, viewport.height);
  vCtx.msImageSmoothingEnabled = false;
  vCtx.mozImageSmoothingEnabled = false;
  vCtx.webkitImageSmoothingEnabled = false;
  vCtx.imageSmoothingEnabled = false;
  vCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
  var transform = canvasInterface.zoom.getTransform();
  var bounding = canvasInterface.zoom.getRect();
  vCtx.translate(transform.centerX, transform.centerY);
  vCtx.rotate((transform.angle * Math.PI) / 180);
  vCtx.translate(-transform.centerX, -transform.centerY);
  vCtx.drawImage(
    canvasInterface.bggridcanvas,
    transform.centerX - transform.width / 2,
    transform.centerY - transform.height / 2,
    transform.width,
    transform.height
  );

  [...layers].reverse().forEach((e) => {
    if (!e.settings.visible) return;
    vCtx.drawImage(
      e.canvasElement,
      transform.centerX - transform.width / 2,
      transform.centerY - transform.height / 2,
      transform.width,
      transform.height
    );
    if (layer == e) {
      vCtx.drawImage(
        canvasInterface.previewcanvas,
        transform.centerX - transform.width / 2,
        transform.centerY - transform.height / 2,
        transform.width,
        transform.height
      );
    }
  });

  //draw grid lines
  var targetGridOpacity = 0
  
  if (transform.scale > 20) {
    targetGridOpacity = 100
  }
  vCtx.strokeStyle = "#ffffff" + intToHex(parseInt(gridOpacity));
  vCtx.lineWidth = .5
  vCtx.translate(
    transform.centerX - transform.width / 2,
    transform.centerY - transform.height / 2
  );
  for (let x = 1; x < project.width; x++) {
    vCtx.beginPath();
    vCtx.moveTo(transform.scale * x, 0);
    vCtx.lineTo(transform.scale * x, transform.height);
    vCtx.stroke();
  }
  for (let y = 1; y < project.height; y++) {
    vCtx.beginPath();
    vCtx.moveTo(0, transform.scale * y);
    vCtx.lineTo(transform.width, transform.scale * y);
    vCtx.stroke();
  }
  vCtx.translate(
    -(transform.centerX - transform.width / 2),
    -(transform.centerY - transform.height / 2)
  );
  gridOpacity = lerp(gridOpacity, targetGridOpacity, 0.35)
  

  vCtx.setTransform(1, 0, 0, 1, 0, 0);
  requestAnimationFrame(renderCanvas);
}
var gridOpacity = 0
var viewport = document.getElementById("viewport");
var vCtx = viewport.getContext("2d");
viewport.width = window.innerWidth * window.devicePixelRatio;
viewport.height = window.innerHeight * window.devicePixelRatio;

window.addEventListener("resize", () => {
  viewport.width = window.innerWidth * window.devicePixelRatio;
  viewport.height = window.innerHeight * window.devicePixelRatio;
});
