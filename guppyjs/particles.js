function Particles() {
    this.queue  = [];

    this.new = function(lifeSpan, layer, typeToDraw, style) {
        var name         = 'Particle' + this.numberOfParticles();
        this.queue[name] = {
            'lifeSpan': lifeSpan,
            'layer': layer,
            'typeToDraw': typeToDraw,
            'style': style
        };
    };

    this.remove = function(key) {
        delete this.queue[key];
    };

    this.process = function() {

        for(var key in this.queue) {
            var particle = this.queue[key];

            particle.typeToDraw(particle.layer, particle.style);

            game.events.new(particle.name, particle.lifeSpan, false, function() {
                game.particles.remove(key);
            });
        }
    };

    this.drawRectangle = function(layer, style) {
        layer.context.fillStyle   = style.color;
        layer.context.strokeStyle = style.lineColor;
        layer.context.lineWidth   = style.lineWidth;

        layer.context.strokeRect(style.x, style.y, style.width, style.height);
    };

    this.drawCircle = function(layer, style) {
        var radius = style.width * 2;

        layer.context.fillStyle = style.color;

        layer.context.beginPath();
        layer.context.arc(style.x, style.y, radius, 0, 2 * Math.PI, false);
        layer.context.closePath();
        layer.context.fill();
    };

    this.numberOfParticles = function() {
        return Object.keys(this.queue).length;
    };
}