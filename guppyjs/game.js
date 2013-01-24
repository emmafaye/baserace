function Game(setup) {
    this.foreground         = document.getElementById('foreground');
    this.background         = document.getElementById('background');
    this.foreground.context = this.foreground.getContext('2d');
    this.background.context = this.background.getContext('2d');

    this.players            = [];

    // Configuration
    this.FPS                = 100;
    this.showFPS            = true;

    this.currentPlayer;

    this.start = function() {
        this.foreground.width  = window.innerWidth;
    	this.foreground.height = window.innerHeight;

        this.background.width  = window.innerWidth;
        this.background.height = window.innerHeight;

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
}