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
  vCtx.setTransform(1, 0, 0, 1, 0, 0);
  requestAnimationFrame(renderCanvas);
}

var viewport = document.getElementById("viewport");
var vCtx = viewport.getContext("2d");
  viewport.width = window.innerWidth * window.devicePixelRatio;
  viewport.height = window.innerHeight * window.devicePixelRatio;

window.addEventListener("resize", () => {
  viewport.width = window.innerWidth * window.devicePixelRatio;
  viewport.height = window.innerHeight * window.devicePixelRatio;
});
