function Structure(player) {
    this.player    = player;
    
    this.name      = this.player.name + 'Structure' + this.player.getUniqueId();
    this.color     = this.player.color;
    this.health    = 1000;
    this.maxHealth = 1000;
    this.defense   = 10;
    
    // Position and Dimensions
    this.x         = 0;
    this.y         = 0;
    this.width     = 200;
    this.height    = 200;
    
    this.idle = function() {};
    
    this.perish = function() {
        this.player.killStructure(this.name);
    };
    this.drawHealthBar = function() {
        game.foreground.context.fillStyle   = '#CD0000';
        game.foreground.context.fillRect(this.x, this.y + this.height - 5, this.width / this.maxHealth * this.health, 5);
        
        game.foreground.context.strokeStyle = this.color;
        game.foreground.context.lineWidth   = 1;
    };
    
    this.render = function() {
        // Corners
        game.foreground.context.fillStyle = '#000';
        game.foreground.context.fillRect(this.x, this.y, 50, 50);
        game.foreground.context.fillStyle = '#000';
        game.foreground.context.fillRect(this.x + 150, this.y, 50, 50);
        game.foreground.context.fillStyle = '#000';
        game.foreground.context.fillRect(this.x, this.y + 150, 50, 50);
        game.foreground.context.fillStyle = '#000';
        game.foreground.context.fillRect(this.x + 150, this.y + 150, 50, 50);
        
        // Edges Border
        game.foreground.context.fillStyle = '#000';
        game.foreground.context.fillRect(this.x + 50, this.y, 100, 40);
        game.foreground.context.fillStyle = '#000';
        game.foreground.context.fillRect(this.x, this.y + 50, 40, 100);
        game.foreground.context.fillStyle = '#000';
        game.foreground.context.fillRect(this.x + 160, this.y + 50, 40, 100);
        game.foreground.context.fillStyle = '#000';
        game.foreground.context.fillRect(this.x + 50, this.y + 160, 100, 40);
        
        // Edges
        game.foreground.context.fillStyle = this.color;
        game.foreground.context.fillRect(this.x + 50, this.y + 5, 100, 30);
        game.foreground.context.fillStyle = this.color;
        game.foreground.context.fillRect(this.x + 5, this.y + 50, 30, 100);
        game.foreground.context.fillStyle = this.color;
        game.foreground.context.fillRect(this.x + 165, this.y + 50, 30, 100);
        game.foreground.context.fillStyle = this.color;
        game.foreground.context.fillRect(this.x + 50, this.y + 165, 100, 30);
        
        this.drawHealthBar();
    };
}