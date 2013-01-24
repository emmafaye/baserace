function Performance() {
    this.fps         = 0;
    this.currentTime = new Date();
    this.lastUpdate  = this.currentTime * 1 - 1;

    // The higher this value, the less the FPS will be affected by quick changes
    // Setting this to 1 will show you the FPS of the last sampled frame only
    this.fpsFilter   = 50;

    this.calculate = function() {
        if(game.showFPS) {
            this.currentTime = new Date();

            var currentFrameFPS = 1000 / (this.currentTime - this.lastUpdate);
            this.fps += (currentFrameFPS - this.fps) / this.fpsFilter;

            this.lastUpdate = this.currentTime;

            game.foreground.context.fillStyle = '#FFF';
            game.foreground.context.fillText(this.fps.toFixed(1) + " FPS", 5, 10);
        }

        return this.fps;
    };
}