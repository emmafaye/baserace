function Unit(player) {
    this.player         = player;
    
    // Unit Properties
    this.name           = this.player.name + 'Unit' + this.player.numberOfUnits();
    this.color          = this.player.color;
    this.health         = 70;
    this.maxHealth      = 70;
    this.stength        = 15;
    this.defense        = 3;
    this.speed          = 1.5;

    // Position and Dimensions
    this.x              = 0;
    this.y              = 0;
    this.width          = 32;
    this.height         = 37;

    // Selection Styling
    this.lineWidth      = 2;
    this.selectionColor = 'rgba(255, 255, 255, 0.8)';

    // Displays whether the unit is selected or not.
    this.selected       = false;

    this.attack = function(key, item) {
        var animations = game.animations;
        
        item.health -= this.stength / item.defense;
        if(item.health < 0) { 
            this.kill(item);
            animations.changeState(key, animations.state.idle);
        }
    };

    this.idle = function() {

    };

    this.kill = function(item) {
        item.player.killUnit(item.name);
    };

    this.move = function(key, item, queue) {
        // Determines whether the destination position is a positive or negative number.
        var xIsPositive         = (queue.x - item.x) > 1 + item.speed || (queue.x - item.x) > -1 - item.speed;
        var yIsPositive         = (queue.y - item.y) > 1 + item.speed || (queue.y - item.y) > -1 - item.speed;
 
        var xReachedDestination = xIsPositive ? item.x > queue.x : item.x < queue.x;
        var yReachedDestination = yIsPositive ? item.y > queue.y : item.y < queue.y;

        // Returns the collision based on the destination location.
        var collision           = game.collisions.hasCollision(item);

        // We increment or decrement based on the destination x position and the current position.
        var xIncrementPosition  = xIsPositive || (xIsPositive === false && collision) ? item.speed : -1 * item.speed;
        var yIncrementPosition  = yIsPositive || (yIsPositive === false && collision) ? item.speed : -1 * item.speed;

        //TODO: We need to determine if +x or -x has collisions.
        (xReachedDestination === false) && (item.x += xIncrementPosition);
        (yReachedDestination === false) && (item.y += yIncrementPosition);

        // Has reached it's destination, idle animation.
        (xReachedDestination && yReachedDestination) && game.animations.changeState(key, game.animations.state.idle);
    };

    this.select = function() {
        this.selected = true;
    };

    this.deselect = function() {
        this.selected = false;
    };

    this.drawHealthBar = function() {
        game.foregorund.context.fillStyle   = '#CD0000';
        game.foregorund.context.fillRect(this.x, this.y + this.height - 5, this.width / this.maxHealth * this.health, 5);

        game.foregorund.context.strokeStyle = this.color;
        game.foregorund.context.lineWidth   = 1;

//        game.context.strokeRect(this.x + 0.5, this.y + this.height, this.width - 1, 5);
    };

    this.drawSelectionOutline = function() {
        game.foregorund.context.strokeStyle = this.selectionColor;
        game.foregorund.context.lineWidth   = this.lineWidth;

        game.foregorund.context.strokeRect(this.x, this.y, this.width, this.height);
    };
    
    this.drawLight = function(x, y, radius) {
        game.foregorund.context.fillStyle = 'rgba(255, 255, 255, 0.2)';
        
        game.foregorund.context.beginPath();
        game.foregorund.context.arc(x, y, radius, 0, 2 * Math.PI, false);
        game.foregorund.context.closePath();
        game.foregorund.context.fill();
    };

    this.render = function() {
        game.foregorund.context.fillStyle = this.color;
        game.foregorund.context.fillRect(this.x, this.y, this.width, this.height);

        game.foregorund.context.lineWidth   = 1;
        game.foregorund.context.strokeStyle = 'rgba(0, 0, 0, 1)';
        game.foregorund.context.strokeRect(this.x, this.y, this.width, this.height);


        this.drawLight(this.x + this.width / 2, this.y + this.height / 2, this.width * 2);
        this.drawHealthBar();
        this.selected && this.drawSelectionOutline();
    };
}