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

        this.animations    = new Animations();
        this.controls      = new Controls();
        this.collisions    = new Collisions();
        this.events        = new Events();
        this.performance   = new Performance();

        this.loop();

        setup();
    };

    // Game Logic Loop
    this.loop = function() {
        setInterval(function() {
            game.animations.process();
            game.events.process();
            game.performance.calculate();
        }, 1000 / this.FPS);
    };

    this.newPlayer = function() {
        var player = Ai.prototype = new Player();
        this.players[player.name] = player;

        return player;
    };

    this.newComputerPlayer = function() {
        var player = this.newPlayer();
        player.isComputredControlled = true;

        return player;
    };

    this.numberOfPlayers = function() {
        return Object.keys(this.players).length;
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