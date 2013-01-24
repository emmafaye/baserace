var game = new Game(function() {
    // Create human player.
    var currentPlayer    = game.newPlayer(1);
    game.currentPlayer   = currentPlayer;
    currentPlayer.spawnX = 20;
    currentPlayer.spawnY = 50;

    // Create AI player
    var enemyPlayer      = game.newComputerPlayer(2);
    game.enemyPlayer     = enemyPlayer;
    enemyPlayer.spawnX   = 800;
    enemyPlayer.spawnY   = 50;

    var playerBase       = currentPlayer.newStructure(currentPlayer.spawnX, currentPlayer.spawnY);
    var enemyBase        = enemyPlayer.newStructure(enemyPlayer.spawnX, enemyPlayer.spawnY);

    var controls         = game.controls;

    game.events.new(currentPlayer.name + '.newUnit', 5, true, function() {
        var playerNotAtMaxUnits = currentPlayer.numberOfUnits() !== currentPlayer.maxUnits;

        playerNotAtMaxUnits && currentPlayer.newUnit(currentPlayer.spawnX + 220, currentPlayer.spawnY);
    });

    game.events.new(enemyPlayer.name + '.newUnit', 5, true, function() {
        var playerNotAtMaxUnits = enemyPlayer.numberOfUnits() !== enemyPlayer.maxUnits;

        playerNotAtMaxUnits && enemyPlayer.newUnit(enemyPlayer.spawnX - 220, enemyPlayer.spawnY);
    });

    controls.new(controls.type.mouseup, function() {
        var mouse      = controls.mouse;
        var leftClick  = event.button === mouse.code.leftButton;
        var rightClick = event.button === mouse.code.rightButton;

        mouse.upX      = event.clientX;
        mouse.upY      = event.clientY;
        
        mouse.drag && mouse.selection.check(currentPlayer.units);

        leftClick && mouse.leftClick(currentPlayer.units, function() {
            currentPlayer.deselectAllUnits();
        });

        rightClick && mouse.rightClick(game.currentPlayer.findEnemyPlayerItems(), function(target, isColliding) {
            var noTarget = target === false;

            noTarget && currentPlayer.moveItems(event.clientX, event.clientY);
            (target && isColliding) && currentPlayer.attackItem(target);

            game.particles.new(1, game.foreground, game.particles.drawRectangle, {
                'x': event.ClientX,
                'y': event.ClientY,
                'width': 20,
                'height': 20,
                'color': 'rgba(255, 255, 255, 1)',
                'lineColor': 'rgba(0, 0, 0, 0)',
                'lineWidth': 0
            });
        });

        mouse.clicked = false;
        mouse.drag    = false;
    });

    controls.new(controls.type.mousedown, function() {
        var mouse   = controls.mouse;

        mouse.downX = event.clientX;
        mouse.downY = event.clientY;

        if(event.button === mouse.code.leftButton) {
            mouse.clicked = true;
        }
    });

    controls.new(controls.type.mousemove, function() {
        var mouse = controls.mouse;

        mouse.x   = event.clientX;
        mouse.y   = event.clientY;

        if(mouse.clicked === true) {
            mouse.selection.setDimensions();
            mouse.selection.render = mouse.selection.draw;

            mouse.drag             = true;
        } else {
            mouse.selection.render = function() {};
        }
    });

});

game.start();