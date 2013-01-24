function FogOfWar() {
    this.darkness = function() {
        game.context.fillStyle = 'rgba(0,0,0 1)';
        game.context.fillRect(0, 0, game.canvas.width, game.canvas.height);
    };
}


$(window).on('load', function () {
  var
    ctx = $('#canvas')[0].getContext('2d'),
    mouse = {x: -100, y: -100};
  
  // fill black
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // track mouse
  $('#canvas').on('mousemove.fog', function (evt) {
    mouse.x = evt.offsetX;
    mouse.y = evt.offsetY;
  });

  (function animloop(now) {
    var
      frame = webkitRequestAnimationFrame(animloop),
      x = mouse.x,
      y = mouse.y,
      r = 10,
      grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    
    grad.addColorStop(0, "rgba(0, 0, 0, 255)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = grad;
    ctx.arc(x, y, r, 0, 2 * Math.PI, true);
    ctx.fill();
  }(Date.now()));
});