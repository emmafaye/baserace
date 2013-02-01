function Unit(player) {
    this.player         = player;

    // Unit Properties
    this.name           = this.player.name + 'Unit' + this.player.getUniqueId();
    this.color          = this.player.color;
    this.health         = 70;
    this.maxHealth      = 70;
    this.stength        = 25;
    this.defense        = 3;
    this.speed          = 1.5;
    this.range          = 20;
    this.lineOfSight    = 150;

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

    this.attack = function(target) {
        var item = this;

        game.animations.changeState(this.name, game.animations.state.attackIdle);
        
        game.events.new(this.name + '.attacking', 0.5, true, function() {
            game.animations.new(item, target, game.animations.state.attack);
        });

        game.particles.new(0.2, game.foreground, game.particles.drawCircle, {
            'x': target.x + target.width / 2,
            'y': target.y + target.height / 2,
            'radius': target.width / 2.5,
            'color': { 'r': 255, 'g': 50, 'b': 50, 'a': 0.3 },
            'lineColor': { 'r': 0, 'g': 0, 'b': 0, 'a': 0 },
            'lineWidth': 0,
            'shadowX': 0,
            'shadowY': 0,
            'shadowColor': { 'r': 255, 'g': 0, 'b': 0, 'a': 0.5 },
            'shadowBlur': 10
        });

        target.health -= this.stength / target.defense;
        if(target.health < 0) {
            game.animations.changeState(this.name, game.animations.state.idle);
            game.events.remove(this.name + '.attacking');
            
            target.perish();
        }

    };

    this.attackIdle = function() {

    };

    this.autoAttack = function() {
        var collisions  = game.collisions;
        var inProximity = collisions.inProximity(this, player.findEnemyPlayerItems());

        inProximity && game.animations.new(this, inProximity, game.animations.state.attack);
    };

    this.guard = function() {
        this.autoAttack(false);
    };

    this.idle = function() {
        this.autoAttack(true);
        this.attackOnSight = false;
    };

    this.move = function(destination) {
        var reachedDestination = player.findCollisonFreePath(this, destination);
        var inProximity        = this.attackOnSight && game.collisions.inProximity(this, player.findEnemyPlayerItems()) !== false;

        reachedDestination && (this.attackOnSight = false);
        (reachedDestination || inProximity) && game.animations.changeState(this.name, game.animations.state.idle);
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

    this.drawAttackRange = function() {
        game.background.context.fillStyle = 'rgba(0, 0, 0, 0.05)';
        game.background.context.fillRect(this.x - this.range / 2, this.y - this.range / 2, this.width + this.range, this.height + this.range);
    };

    this.render = function() {
        game.foreground.context.fillStyle = this.color;
        game.foreground.context.fillRect(this.x, this.y, this.width, this.height);

        game.foreground.context.lineWidth   = 1;
        game.foreground.context.strokeStyle = 'rgba(0, 0, 0, 1)';
        game.foreground.context.strokeRect(this.x, this.y, this.width, this.height);

        this.drawHealthBar();
        this.drawLineOfSight();
        this.drawAttackRange();
        //this.drawLight();
        this.selected && this.drawSelectionOutline();
    };
}