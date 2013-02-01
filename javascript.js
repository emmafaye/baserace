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
    // Intro
    // -----------------------------------------------------------------------//
    var introImage = game.sprites.load('logo.png');
    game.gui.new('Intro', game.gui.image, {
        'x': 0,
        'y': 0,
        'width': game.foreground.width,
        'height': game.foreground.height,
        'image': introImage
    });
    events.new('startGame', 2, false, function() {
        game.gui.remove('Intro');
        game.events.remove('removeIntro');

        for(var i = 0; i < 14; i++) {
            currentPlayer.newUnit(currentPlayer.spawnX + 220, currentPlayer.spawnY);
            enemyPlayer.newUnit(enemyPlayer.spawnX - 220, enemyPlayer.spawnY);
        }

        events.new('AttackUserPathing', 2, true, function() {
            enemyPlayer.toggleAttackOnSight(true, true);
            enemyPlayer.moveItems(playerBase.x + playerBase.width / 2, playerBase.y + playerBase.height / 2, true);
        });
    });

    events.new(currentPlayer.name + '.newUnit', 2, true, function() {
        var playerNotAtMaxUnits = currentPlayer.numberOfUnits() !== currentPlayer.maxUnits;

        playerNotAtMaxUnits && currentPlayer.newUnit(currentPlayer.spawnX + 220, currentPlayer.spawnY);
    });

    events.new(enemyPlayer.name + '.newUnit', 2, true, function() {
        var playerNotAtMaxUnits = enemyPlayer.numberOfUnits() !== enemyPlayer.maxUnits;

        playerNotAtMaxUnits && enemyPlayer.newUnit(enemyPlayer.spawnX - 220, enemyPlayer.spawnY);
    });

    // -----------------------------------------------------------------------//
    // Game victory Condition Event
    // -----------------------------------------------------------------------//
    events.new('CheckVictory', 1, true, function() {
        (currentPlayer.numberOfStructures() === 0) && game.defeat();
        (enemyPlayer.numberOfStructures() === 0) && game.victory();

        (currentPlayer.numberOfStructures() === 0 || enemyPlayer.numberOfStructures() === 0) && events.new('refreshPage', 3, false, function() {
            location.reload();
        });
    });

    // -----------------------------------------------------------------------//
    // Controls
    // -----------------------------------------------------------------------//
    controls.moveAndAtttackKeyPressed = false;

    controls.new(controls.type.mouseup, function(event) {
        var type  = event.button;

        mouse.upX = event.clientX;
        mouse.upY = event.clientY;

        controls.mouse[type]();

        mouse.clicked                     = false;
        mouse.drag                        = false;
        controls.moveAndAtttackKeyPressed = false;
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

        controls.moveAndAtttackKeyPressed && currentPlayer.toggleAttackOnSight(true, false);

        var color = (isColliding || controls.moveAndAtttackKeyPressed) ? { 'r': 255, 'g': 50, 'b': 50, 'a': 0.5 } : { 'r': 50, 'g': 255, 'b': 50, 'a': 0.5 };
        particles.new(0.3, game.foreground, particles.drawCircle, {
            'x': mouse.upX,
            'y': mouse.upY,
            'radius': 20,
            'color': color,
            'lineColor': { 'r': 0, 'g': 0, 'b': 0, 'a': 0 },
            'lineWidth': 0,
            'center': true
        }, {
            'x': mouse.upX,
            'y': mouse.upY,
            'radius': 10,
            'color': color,
            'lineColor': { 'r': 0, 'g': 0, 'b': 0, 'a': 0.5 },
            'lineWidth': 20,
            'center': true
        });
        particles.new(0.1, game.foreground, particles.drawCircle, {
            'x': mouse.upX,
            'y': mouse.upY,
            'radius': 25,
            'color': { 'r': 255, 'g': 255, 'b': 255, 'a': 0.5 },
            'lineColor': { 'r': 0, 'g': 0, 'b': 0, 'a': 0 },
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
                controls.moveAndAtttackKeyPressed = true;
                break;
            case keyboard.code.s:
                currentPlayer.guardItems();
                break;
        }
    });

});

game.start();