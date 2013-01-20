function Player() {
    this.name               = 'Player' + game.numberOfPlayers();
    this.color              = game.newColor(100);

    this.units              = [];
    this.maxUnits           = 50;
    this.structures         = [];

    this.spawnX             = 0;
    this.spawnY             = 0;
    
    this.isComputredControlled = true;

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

    this.killUnit = function(key) {
        var unitExists = this.units[key] !== undefined;

        if(unitExists) {
            delete this.units[key];

            game.events.remove(key + '.attacking');
            game.animations.remove(key);
            game.collisions.remove(key);
        }
    };

    this.killStructure = function(key) {
        var structureExists = this.structures[key] !== undefined;

        if(structureExists) {
            delete this.structures[key];

            game.events.remove(key + '.attacking');
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

function Ai() {
    this.inProximityOfEnemy = function() {
        
    };
//
//    this.aiStart = function() {
//
//    };
//
//    this.aiMovement = function() {
//
//    };
}

