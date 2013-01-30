function Unit(player) {
    this.player         = player;

    // Unit Properties
    this.name           = this.player.name + 'Unit' + this.player.getUniqueId();
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
    this.attackOnSight  = false;

    this.attack = function(key, item) {
        var animations = game.animations;

        item.health -= this.stength / item.defense;
        if(item.health < 0) {
            game.events.remove(this.name + '.attacking');

            animations.changeState(key, animations.state.idle);
            item.perish();
        }
    };

    this.autoAttack = function(moveToPlayer) {
        var enemyUnits  = player.findEnemyPlayerItems();
        var enemyUnit   = game.collisions.inProximity(this, enemyUnits);
        var isColliding = game.collisions.isColliding(this, enemyUnit);

        isColliding === true && this.attack(this.name, enemyUnit);
        (isColliding === false && moveToPlayer) && this.move(this.name, this, enemyUnit);
    };

    this.guard = function() {
        this.autoAttack(false);
    };

    this.idle = function() {
        this.autoAttack(true);
    };

    this.move = function(key, destination) {
        // Determines whether the destination position is a positive or negative number.
        var xIsPositive         = (destination.x - this.x) > 1 + this.speed || (destination.x - this.x) > -1 - this.speed;
        var yIsPositive         = (destination.y - this.y) > 1 + this.speed || (destination.y - this.y) > -1 - this.speed;

        var xReachedDestination = xIsPositive ? this.x > destination.x : this.x < destination.x;
        var yReachedDestination = yIsPositive ? this.y > destination.y : this.y < destination.y;

        // Returns the collision based on the destination location.
        var collision           = game.collisions.hasCollision(this);

        // We increment or decrement based on the destination x position and the current position.
        var xIncrementPosition  = xIsPositive ? this.speed : -1 * this.speed; //|| (xIsPositive === false && collision)
        var yIncrementPosition  = yIsPositive ? this.speed : -1 * this.speed; //|| (yIsPositive === false && collision)

        //TODO: We need to determine if +x or -x has collisions.
        (xReachedDestination === false) && (this.x += xIncrementPosition);
        (yReachedDestination === false) && (this.y += yIncrementPosition);

        // Has reached it's destination, idle animation.
        (xReachedDestination && yReachedDestination) && game.animations.changeState(key, game.animations.state.idle);

        player.findCollisonFreePath(this, destination);

        // TODO: Rename inProximityOfEnemy to autoAttack, move outside of AI.
        // TODO: Make unit stop in place and "reach" it's destination so that it can begin attacking.
        player.moveAndAttack && this.autoAttack(false);
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