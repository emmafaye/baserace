function Player() {
    this.name               = 'Player' + game.numberOfPlayers();
    this.color              = game.newColor(100);
    this.team               = 0;

    this.units              = [];
    this.maxUnits           = 2;
    this.structures         = [];

    this.spawnX             = 0;
    this.spawnY             = 0;

    this.newStructure = function(x, y) {
        var structure = new Structure(this);

        structure.x = x;
        structure.y = y;

        game.animations.new(structure, structure, game.animations.state.idle);
        game.collisions.new(structure);

        this.structures.push(structure);
        this.numberOfStructures++;

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

    this.deselectAllUnits = function() {
        for(var key in this.units) {
            this.units[key].deselect();
        }
    };

    this.moveItems = function(x, y) {
        for(var key in this.units) {
            var unit = this.units[key];
            var target = {
                'x': x,
                'y': y
            };

            unit.selected && game.animations.new(unit, target, game.animations.state.move);
        }
    };


    this.attackItem = function(target) {
        for(var key in this.units) {
            var unit = this.units[key];

            unit.selected && game.animations.new(unit, target, game.animations.state.attack);
        }
    };

    this.findEnemyPlayerItems = function() {
        var items = [];

        game.doForEveryEnemyPlayer(this, function(player) {
            for(var key in player.units) {
                items.push(player.units[key]);
            }
            for(var key in player.structures) {
                items.push(player.structures[key]);
            }
        });

        return items;
    };

    this.killUnit = function(key) {
        var unitExists = this.units[key] !== undefined;

        if(unitExists) {
            delete this.units[key];

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

    this.numberOfUnits = function() {
        return Object.keys(this.units).length;
    };

    this.numberOfStructures = function() {
        return Object.keys(this.structures).length;
    };
}

Player.prototype = new Ai();

function Ai() {
    this.isComputerControlled = false;

    this.inProximityOfEnemy = function(unit) {
        var unitProximity   = {
            'x': unit.x - unit.lineOfSight / 2,
            'y': unit.y - unit.lineOfSight / 2,
            'width': unit.width + unit.lineOfSight,
            'height': unit.height + unit.lineOfSight
        };

        game.doForEveryEnemyPlayer(this, function(player) {
            var enemyUnits = player.units;

            for(var key in enemyUnits) {
                var enemyUnit   = enemyUnits[key];
                var inProximity = game.collisions.isColliding(unitProximity, enemyUnit);

                if(inProximity) {
                    var isColliding = game.collisions.isColliding(unit, enemyUnit);

                    isColliding === true && unit.attack(key, enemyUnit);
                    isColliding === false && unit.move(key, unit, enemyUnit);

                    break;
                }
            }

        });
    };
}

