function Player() {
    this.name               = 'Player' + game.numberOfPlayers();
    this.color              = game.newColor(100);
    this.team               = 0;

    this.units              = [];
    this.maxUnits           = 50;
    this.structures         = [];

    this.spawnX             = 0;
    this.spawnY             = 0;

    this.uid                = 0;

    this.newStructure = function(x, y) {
        var structure = new Structure(this);

        structure.x = x;
        structure.y = y;

        game.animations.new(structure, structure, game.animations.state.idle);
        game.collisions.new(structure);

        this.structures[structure.name] = structure;

        return structure;
    };

    this.newUnit = function(x, y) {
        var unit = new Unit(this);

        unit.x   = x;
        unit.y   = y;

        while(game.collisions.hasCollision(unit)) {
            unit.y += unit.height;
            if(unit.y > unit.height * 8) {
                unit.y = y;
                unit.x += unit.width;
            }
        }

        game.animations.new(unit, unit, game.animations.state.idle);
        game.collisions.new(unit);

        this.units[unit.name] = unit;

        return unit;
    };

    this.killUnit = function(key) {
        var unitExists = this.units[key] !== undefined;

        if(unitExists) {
            delete this.units[key];
            game.events.removeAll(key);
            game.animations.remove(key);
            game.collisions.remove(key);
        }
    };

    this.killStructure = function(key) {
        var structureExists = this.structures[key] !== undefined;

        if(structureExists) {
            delete this.structures[key];

            game.animations.remove(key);
            game.collisions.remove(key);
        }

    };

    this.deselectAllUnits = function() {
        for(var key in this.units) {
            this.units[key].deselect();
        }
    };

    this.attackItem = function(target, allUnits) {
        for(var key in this.units) {
            var unit = this.units[key];

            (unit.selected || allUnits) && game.animations.new(unit, target, game.animations.state.attack);
        }
    };

    this.moveItems = function(x, y, allUnits) {
        for(var key in this.units) {
            var unit = this.units[key];
            var target = {
                'x': x - unit.width / 2,
                'y': y - unit.height / 2
            };

            (unit.selected || allUnits) && game.animations.new(unit, target, game.animations.state.move);
        }
    };


    this.guardItems = function(allUnits) {
        for(var key in this.units) {
            var unit = this.units[key];

            (unit.selected || allUnits) && game.animations.changeState(key, game.animations.state.guard);
        }
    };

    this.toggleAttackOnSight = function(boolean, allUnits) {
        for(var key in this.units) {
            (this.units[key].selected || allUnits) && (this.units[key].attackOnSight = boolean);
        }
    };

    this.findEnemyPlayerItems = function() {
        var items = [];

        game.doForEveryEnemyPlayer(this, function(enemyPlayer) {
            for(var key in enemyPlayer.units) {
                items.push(enemyPlayer.units[key]);
            }
            for(var key in enemyPlayer.structures) {
                items.push(enemyPlayer.structures[key]);
            }
        });

        return items;
    };

    this.numberOfUnits = function() {
        return this.getNumberOfItems(this.units);
    };

    this.numberOfStructures = function() {
        return this.getNumberOfItems(this.structures);
    };

    this.getNumberOfItems = function(items) {
        return Object.keys(items).length;
    };

    this.getUniqueId = function() {
        return this.uid++;
    };
}

Player.prototype = new Ai();

function Ai() {
    this.isComputerControlled = false;

    // Find path for unit based on checking if collisions occur and if collisions
    // occur change direction until collisions no longer occur. Possibly try using
    // a Try and Catch statement.

    // Try to reach destination as much as possible.
    this.findCollisonFreePath = function(item, destination) {
        var xMovementRate       = (destination.x - item.x) > 1 + item.speed || (destination.x - item.x) > -1 - item.speed;
        var yMovementRate       = (destination.y - item.y) > 1 + item.speed || (destination.y - item.y) > -1 - item.speed;

        var xReachedDestination = xMovementRate ? item.x > destination.x : item.x < destination.x;
        var yReachedDestination = yMovementRate ? item.y > destination.y : item.y < destination.y;

        // We increment or decrement based on the destination x position and the current position.
        var xDirection          = xMovementRate ? item.speed : -1 * item.speed; //|| (xMovementRate === false && collision)
        var yDirection          = yMovementRate ? item.speed : -1 * item.speed; //|| (yMovementRate === false && collision)

        this.checkPathCollisionForDirection(xDirection, yDirection, xReachedDestination, yReachedDestination, item);

        return xReachedDestination && yReachedDestination;
    };

    this.checkPathCollisionForDirection = function(xDirection, yDirection, xReachedDestination, yReachedDestination, item) {
//        if(xDirection > 0 && game.collisions.hasCollision(item)) {
//            game.collisions.hasCollision(item) && (xDirection *= -1);
//        } else if(xDirection < 0 && game.collisions.hasCollision(item)) {
//            game.collisions.hasCollision(item) && (xDirection *= 1);
//        }
//
//        if(yDirection > 0 && game.collisions.hasCollision(item)) {
//            game.collisions.hasCollision(item) && (yDirection *= -1);
//        } else if(yDirection < 0 && game.collisions.hasCollision(item)) {
//            game.collisions.hasCollision(item) && (yDirection *= 1);
//        }

        !xReachedDestination && (item.x += xDirection);
        !yReachedDestination && (item.y += yDirection);
    };
}

