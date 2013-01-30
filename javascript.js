var game = new Game(function() {
    var events           = game.events;
    var particles        = game.particles;
    var controls         = game.controls;
    var mouse            = controls.mouse;
    var keyboard         = controls.keyboard;

    var team1            = 1;
    var team2            = 2;

    // -----------------------------------------------------------------------//
    // Create human player.
    // -----------------------------------------------------------------------//
    var currentPlayer    = game.newPlayer(team1);
    game.currentPlayer   = currentPlayer;
    currentPlayer.spawnX = 20;
    currentPlayer.spawnY = 50;

    var playerBase       = currentPlayer.newStructure(currentPlayer.spawnX, currentPlayer.spawnY);

    // -----------------------------------------------------------------------//
    // Create AI player
    // -----------------------------------------------------------------------//
    var enemyPlayer      = game.newComputerPlayer(team2);
    game.enemyPlayer     = enemyPlayer;
    enemyPlayer.spawnX   = 800;
    enemyPlayer.spawnY   = 50;

    var enemyBase        = enemyPlayer.newStructure(enemyPlayer.spawnX, enemyPlayer.spawnY);

    // -----------------------------------------------------------------------//
    // Spawning for units
    // -----------------------------------------------------------------------//
    for(var i = 0; i < 5; i++) {
        currentPlayer.newUnit(currentPlayer.spawnX + 220, currentPlayer.spawnY);
        enemyPlayer.newUnit(enemyPlayer.spawnX - 220, enemyPlayer.spawnY);
    }

    events.new(currentPlayer.name + '.newUnit', 2, true, function() {
        var playerNotAtMaxUnits = currentPlayer.numberOfUnits() !== currentPlayer.maxUnits;

        playerNotAtMaxUnits && currentPlayer.newUnit(currentPlayer.spawnX + 220, currentPlayer.spawnY);
    });

    events.new(enemyPlayer.name + '.newUnit', 2, true, function() {
        var playerNotAtMaxUnits = enemyPlayer.numberOfUnits() !== enemyPlayer.maxUnits;

        playerNotAtMaxUnits && enemyPlayer.newUnit(enemyPlayer.spawnX - 220, enemyPlayer.spawnY);
    });

    // -----------------------------------------------------------------------//
    // Game victory conditions
    // -----------------------------------------------------------------------//
    events.new('CheckVictory', 1, true, function() {
        (currentPlayer.numberOfStructures() === 0) && game.defeat();
        (enemyPlayer.numberOfStructures() === 0) && game.victory();
    });

    // -----------------------------------------------------------------------//
    // Ai Pathing
    // -----------------------------------------------------------------------//
    events.new('AIPathing', 5, true, function() {
        enemyPlayer.moveAndAttack = true;
        enemyPlayer.moveItems(playerBase.x + playerBase.width / 2, playerBase.y + playerBase.height / 2, true);
    });

    // -----------------------------------------------------------------------//
    // Controls
    // -----------------------------------------------------------------------//
    controls.new(controls.type.mouseup, function(event) {
        var type  = event.button;

        mouse.upX = event.clientX;
        mouse.upY = event.clientY;

        controls.mouse[type]();

        mouse.clicked               = false;
        mouse.drag                  = false;
        currentPlayer.moveAndAttack = false;
    });

    controls.mouse[mouse.code.leftButton] = function() {
        var items        = currentPlayer.units;
        var clickedItems = [];

        for(var key in items) {
            var item    = items[key];
            var clicked = game.collisions.isColliding(mouse, item);

            if(clicked) {
                currentPlayer.deselectAllUnits();
                item.select();

                clicked && clickedItems.push(item);
                break;
            }
        }

        clickedItems < 1 && currentPlayer.deselectAllUnits();
        mouse.drag && mouse.selection.check(currentPlayer.units);
    };

    controls.mouse[mouse.code.rightButton] = function() {
        var isColliding;
        var items  = currentPlayer.findEnemyPlayerItems();
        var target = false;

        for(var key in items) {
            target      = items[key];
            isColliding = game.collisions.isColliding(mouse, target);

            if(isColliding) {
                break;
            } else {
                target = false;
            }
        }

        var noTarget = target === false;
        noTarget && currentPlayer.moveItems(mouse.upX, mouse.upY, false);
        (target && isColliding) && currentPlayer.attackItem(target, false);

        var moveAndAttack = currentPlayer.moveAndAttack;
        var color         = (isColliding || moveAndAttack) ? 'rgba(255, 50, 50, 0.5)' : 'rgba(50, 255, 50, 0.5)';
        particles.new(0.2, game.foreground, particles.drawCircle, {
            'x': mouse.upX,
            'y': mouse.upY,
            'width': 20,
            'height': 20,
            'color': color,
            'lineColor': 'rgba(0, 0, 0, 0)',
            'lineWidth': 0,
            'center': true
        });
    };

    controls.new(controls.type.mousedown, function(event) {
        mouse.downX = event.clientX;
        mouse.downY = event.clientY;

        if(event.button === mouse.code.leftButton) {
            mouse.clicked = true;
        }
    });

    controls.new(controls.type.mousemove, function(event) {
        mouse.x = event.clientX;
        mouse.y = event.clientY;

        if(mouse.clicked === true) {
            mouse.selection.setDimensions();
            mouse.selection.render = mouse.selection.draw;

            mouse.drag             = true;
        } else {
            mouse.selection.render = function() {};
        }
    });

    controls.new(controls.type.keyup, function(event) {
        var type = event.keyCode;

        switch(type) {
            case keyboard.code.a:
                currentPlayer.toggleAttackOnSight(true);
                game.currentPlayer.moveAndAttack = true;
                break;
            case keyboard.code.s:
                currentPlayer.guardItems();
                break;
        }
    });

});

game.start();