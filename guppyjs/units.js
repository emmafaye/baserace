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
    this.lineOfSight    = 100;

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
            game.events.remove(this.name + '.attacking');

            item.perish();
            animations.changeState(key, animations.state.idle);
        }
    };

    this.idle = function() {
        player.inProximityOfEnemy(this);
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
        var xIncrementPosition  = xIsPositive ? item.speed : -1 * item.speed; //|| (xIsPositive === false && collision)
        var yIncrementPosition  = yIsPositive ? item.speed : -1 * item.speed; //|| (yIsPositive === false && collision)

        //TODO: We need to determine if +x or -x has collisions.
        (xReachedDestination === false) && (item.x += xIncrementPosition);
        (yReachedDestination === false) && (item.y += yIncrementPosition);

        // Has reached it's destination, idle animation.
        (xReachedDestination && yReachedDestination) && game.animations.changeState(key, game.animations.state.idle);
    };

    this.perish = function() {
        this.player.killUnit(this.name);
    };

    this.select = function() {
        this.selected = true;
    };

    this.deselect = function() {
        this.selected = false;
    };

    this.drawHealthBar = function() {
        game.foreground.context.fillStyle   = '#CD0000';
        game.foreground.context.fillRect(this.x, this.y + this.height - 5, this.width / this.maxHealth * this.health, 5);

        game.foreground.context.strokeStyle = this.color;
        game.foreground.context.lineWidth   = 1;
    };

    this.drawSelectionOutline = function() {
        game.foreground.context.strokeStyle = this.selectionColor;
        game.foreground.context.lineWidth   = this.lineWidth;

        game.foreground.context.strokeRect(this.x, this.y, this.width, this.height);
    };

//    this.drawLight = function(x, y, radius) {
//        var radius = this.width * 2;
//
//        game.background.context.fillStyle = 'rgba(255, 255, 255, 0.1)';
//
//        for(var i = 0; i < 3; i++) {
//            game.background.context.beginPath();
//            game.background.context.arc(this.x, this.y, radius + (i * 10), 0, 2 * Math.PI, false);
//            game.background.context.closePath();
//            game.background.context.fill();
//        }
//
//    };

    this.drawLineOfSight = function() {
        game.background.context.fillStyle = 'rgba(255, 255, 255, 0.02)';
        game.background.context.fillRect(this.x - this.lineOfSight / 2, this.y - this.lineOfSight / 2, this.width + this.lineOfSight, this.height + this.lineOfSight);
    };

    this.render = function() {
        game.foreground.context.fillStyle = this.color;
        game.foreground.context.fillRect(this.x, this.y, this.width, this.height);

        game.foreground.context.lineWidth   = 1;
        game.foreground.context.strokeStyle = 'rgba(0, 0, 0, 1)';
        game.foreground.context.strokeRect(this.x, this.y, this.width, this.height);

        this.drawHealthBar();
        this.drawLineOfSight();
        //this.drawLight();
        this.selected && this.drawSelectionOutline();
    };
}