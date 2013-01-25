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

    for(var i = 0; i < 5; i++) {
        currentPlayer.newUnit(currentPlayer.spawnX + 220, currentPlayer.spawnY);
        enemyPlayer.newUnit(enemyPlayer.spawnX - 220, enemyPlayer.spawnY);
    }


    game.events.new(currentPlayer.name + '.newUnit', 2, true, function() {
        var playerNotAtMaxUnits = currentPlayer.numberOfUnits() !== currentPlayer.maxUnits;

        playerNotAtMaxUnits && currentPlayer.newUnit(currentPlayer.spawnX + 220, currentPlayer.spawnY);
    });

    game.events.new(enemyPlayer.name + '.newUnit', 2, true, function() {
        var playerNotAtMaxUnits = enemyPlayer.numberOfUnits() !== enemyPlayer.maxUnits;

        playerNotAtMaxUnits && enemyPlayer.newUnit(enemyPlayer.spawnX - 220, enemyPlayer.spawnY);
    });

    controls.new(controls.type.mouseup, function() {
        var mouse      = controls.mouse;
        var leftClick  = event.button === mouse.code.leftButton;
        var rightClick = event.button === mouse.code.rightButton;

        mouse.upX      = event.clientX;
        mouse.upY      = event.clientY;

        leftClick && mouse.leftClick(currentPlayer.units, function() {
            currentPlayer.deselectAllUnits();
        });

        rightClick && mouse.rightClick(game.currentPlayer.findEnemyPlayerItems(), function(target, isColliding) {
            var noTarget = target === false;

            noTarget && currentPlayer.moveItems(mouse.upX, mouse.upY);
            (target && isColliding) && currentPlayer.attackItem(target);

            var color = isColliding ? 'rgba(255, 50, 50, 0.5)' : 'rgba(50, 255, 50, 0.5)';

            game.particles.new(0.2, game.foreground, game.particles.drawCircle, {
                'x': mouse.upX,
                'y': mouse.upY,
                'width': 20,
                'height': 20,
                'color': color,
                'lineColor': 'rgba(0, 0, 0, 0)',
                'lineWidth': 0,
                'center': true
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