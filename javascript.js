var game = new Game(function() {
    // Create human player.
    var currentPlayer    = game.newPlayer();
    game.currentPlayer   = currentPlayer;
    currentPlayer.spawnX = 20;
    currentPlayer.spawnY = 50;

    // Create AI player
    var enemyPlayer      = game.newComputerPlayer();
    game.enemyPlayer     = enemyPlayer;
    enemyPlayer.spawnX   = 800;
    enemyPlayer.spawnY   = 50;

    var playerBase       = currentPlayer.newStructure(currentPlayer.spawnX, currentPlayer.spawnY);
    var enemyBase        = enemyPlayer.newStructure(enemyPlayer.spawnX, enemyPlayer.spawnY);

    var controls         = game.controls;

    game.events.new(currentPlayer.name + '.newUnit', 0.2, true, function() {
        var playerNotAtMaxUnits = currentPlayer.numberOfUnits() !== currentPlayer.maxUnits;

        playerNotAtMaxUnits && currentPlayer.newUnit(currentPlayer.spawnX + 220, currentPlayer.spawnY);
    });

    game.events.new(enemyPlayer.name + '.newUnit', 0.2, true, function() {
        var playerNotAtMaxUnits = enemyPlayer.numberOfUnits() !== enemyPlayer.maxUnits;

        playerNotAtMaxUnits && enemyPlayer.newUnit(enemyPlayer.spawnX - 220, enemyPlayer.spawnY);
    });

    controls.new(controls.type.mouseup, function() {
        var mouse = controls.mouse;

        mouse.upX = event.clientX;
        mouse.upY = event.clientY;

        switch(event.button) {
            case mouse.code.leftButton:
                mouse.leftClick(currentPlayer.units, function() { currentPlayer.deselectAllUnits() });
                mouse.drag && mouse.selection.check(currentPlayer.units);
                break;
            case mouse.code.rightButton:
                currentPlayer.moveItems(event.clientX, event.clientY);
                mouse.rightClick(enemyPlayer.units, function(target) {
                    currentPlayer.attackItem(target);
                });
                break;
        }

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