function Game(setup) {
    this.foreground         = document.getElementById('foreground');
    this.background         = document.getElementById('background');
    this.foreground.context = this.foreground.getContext('2d');
    this.background.context = this.background.getContext('2d');

    this.currentPlayer;
    this.players            = [];

    // Configuration
    this.FPS                = 100;
    this.showFPS            = false;

    this.start = function() {
        this.foreground.width  = window.innerWidth;
        this.foreground.height = window.innerHeight;

        this.background.width  = window.innerWidth;
        this.background.height = window.innerHeight;

        this.gui               = new GUI();
        this.sprites           = new Sprites();
        this.animations        = new Animations();
        this.controls          = new Controls();
        this.collisions        = new Collisions();
        this.events            = new Events();
        this.particles         = new Particles();
        this.performance       = new Performance();

        this.loop();

        setup();
    };

    // Game Logic Loop
    this.loop = function() {
        setInterval(function() {
            game.animations.process();
            game.events.process();
            game.particles.process();
            game.performance.calculate();
            game.gui.process();
        }, 1000 / this.FPS);
    };

    this.newPlayer = function(team) {
        var player  = new Player();
        player.team = team;

        this.players[player.name] = player;

        return player;
    };

    this.newComputerPlayer = function(team) {
        var player = this.newPlayer(team);

        player.isComputerControlled = true;

        return player;
    };

    this.numberOfPlayers = function() {
        return Object.keys(this.players).length;
    };

    this.doForEveryEnemyPlayer = function(currentPlayer, functionToExecute) {
        for(var key in this.players) {
            var player          = this.players[key];
            var onDifferentTeam = currentPlayer.team !== player.team;

            onDifferentTeam && functionToExecute(player);
        }
    };

    this.newColor = function(alpha) {
        return 'rgba(' + this.randomColor() +
                   ',' + this.randomColor() +
                   ',' + this.randomColor() +
                   ',' + alpha/100 + ')';
    };

    this.randomColor = function() {
        return Math.floor(Math.random() * 256);
    };

    this.victory = function() {
        this.gui.new('victoryModal', game.gui.modal, {
            'color': 'rgba(0, 0, 0, 0.5)'
        });

        this.gui.new('victoryText', game.gui.text, {
            'x': this.foreground.width / 2 - 360,
            'y': this.foreground.height / 2 - 40,
            'size': 80,
            'font': 'Tahoma',
            'color': 'rgba(255, 255, 255, 1)',
            'text': 'You are Victorious!'
        });
        game.events.remove('CheckVictory');
    };

    this.defeat = function() {
        this.gui.new('defeatModal', game.gui.modal, {
            'color': 'rgba(0, 0, 0, 0.5)'
        });

        this.gui.new('defeatText', game.gui.text, {
            'x': this.foreground.width / 2 - 260,
            'y': this.foreground.height / 2 - 40,
            'size': 80,
            'font': 'Tahoma',
            'color': 'rgba(255, 255, 255, 1)',
            'text': 'You Lost!'
        });
        game.events.remove('CheckVictory');
    };
}