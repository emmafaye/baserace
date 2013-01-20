function FogOfWar() {
    this.darkness = function() {
        game.context.fillStyle = 'rgba(0,0,0 0.5);
        game.context.fillRect(0, 0, game.canvas.width, game.canvas.height);
    };
}