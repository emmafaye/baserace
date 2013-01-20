function Structure(player) {
    this.player = player;
    
    this.name   = this.player.name + 'Structure' + this.player.numberOfStructures();
    this.color  = this.player.color;
    this.health = 1000;

    // Position and Dimensions
    this.x      = 0;
    this.y      = 0;
    this.width  = 200;
    this.height = 200;

    this.render = function() {
        // Corners
        game.foregorund.context.fillStyle = '#000';
        game.foregorund.context.fillRect(this.x, this.y, 50, 50);
        game.foregorund.context.fillStyle = '#000';
        game.foregorund.context.fillRect(this.x + 150, this.y, 50, 50);
        game.foregorund.context.fillStyle = '#000';
        game.foregorund.context.fillRect(this.x, this.y + 150, 50, 50);
        game.foregorund.context.fillStyle = '#000';
        game.foregorund.context.fillRect(this.x + 150, this.y + 150, 50, 50);

        // Edges Border
        game.foregorund.context.fillStyle = '#000';
        game.foregorund.context.fillRect(this.x + 50, this.y, 100, 40);
        game.foregorund.context.fillStyle = '#000';
        game.foregorund.context.fillRect(this.x, this.y + 50, 40, 100);
        game.foregorund.context.fillStyle = '#000';
        game.foregorund.context.fillRect(this.x + 160, this.y + 50, 40, 100);
        game.foregorund.context.fillStyle = '#000';
        game.foregorund.context.fillRect(this.x + 50, this.y + 160, 100, 40);

        // Edges
        game.foregorund.context.fillStyle = this.color;
        game.foregorund.context.fillRect(this.x + 50, this.y + 5, 100, 30);
        game.foregorund.context.fillStyle = this.color;
        game.foregorund.context.fillRect(this.x + 5, this.y + 50, 30, 100);
        game.foregorund.context.fillStyle = this.color;
        game.foregorund.context.fillRect(this.x + 165, this.y + 50, 30, 100);
        game.foregorund.context.fillStyle = this.color;
        game.foregorund.context.fillRect(this.x + 50, this.y + 165, 100, 30);
    };
}