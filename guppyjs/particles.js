function Particles() {
    this.queue  = [];
    this.uid    = 0;

    this.new = function(lifeSpan, layer, typeToDraw, style) {
        var name         = 'Particle' + this.getUniqueId();
        this.queue[name] = {
            'lifeSpan': lifeSpan,
            'layer': layer,
            'typeToDraw': typeToDraw,
            'style': style
        };

        game.events.new(name, lifeSpan, false, function() {
            game.particles.remove(name);
        });
    };

    this.remove = function(key) {
        delete this.queue[key];
    };

    this.process = function() {
        for(var key in this.queue) {
            var particle = this.queue[key];

            particle.typeToDraw(particle.layer, particle.style);
        }
    };

    this.drawRectangle = function(layer, style) {
        var x = style.center ? style.x - style.width / 2 : style.x;
        var y = style.center ? style.y - style.height / 2 : style.y;

        layer.context.fillStyle   = style.color;
        layer.context.strokeStyle = style.lineColor;
        layer.context.lineWidth   = style.lineWidth;

        layer.context.strokeRect(x, y, style.width, style.height);
        layer.context.fillRect(x, y, style.width, style.height);
    };

    this.drawCircle = function(layer, style) {
        var radius = style.width;

        layer.context.fillStyle = style.color;

        layer.context.beginPath();
        layer.context.arc(style.x, style.y, radius, 0, 2 * Math.PI, false);
        layer.context.closePath();
        layer.context.fill();
    };

    this.getUniqueId = function() {
        return this.uid++;
    };
}