function Particles() {
    this.queue  = [];
    this.uid    = 0;

    this.new = function(lifeSpan, layer, typeToDraw, style, endStyle) {
        var name         = 'Particle' + this.getUniqueId();
        this.queue[name] = {
            'lifeSpan': lifeSpan,
            'layer': layer,
            'typeToDraw': typeToDraw,
            'style': style
        };
        endStyle && (this.queue[name].endStyle = endStyle);

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
            var style = this.animateStyles(particle.style, particle.endStyle, particle.lifeSpan);

            particle.layer.context.save();
            particle.typeToDraw(particle.layer, style);
            particle.layer.context.restore();
        }
    };

    this.drawRectangle = function(layer, style) {
        var color                   = game.particles.defaultColor(style.color);
        var lineColor               = game.particles.defaultColor(style.lineColor);
        var shadowColor             = game.particles.defaultColor(style.shadowColor);
        var x                       = style.center ? style.x - style.width / 2 : style.x;
        var y                       = style.center ? style.y - style.height / 2 : style.y;
        
        color                       = game.particles.defaultColor(color);
        lineColor                   = game.particles.defaultColor(lineColor);
        shadowColor                 = game.particles.defaultColor(shadowColor);
        
        layer.context.shadowColor   = game.particles.getColor(shadowColor.r, shadowColor.g, shadowColor.b, shadowColor.a);
        layer.context.shadowBlur    = style.shadowBlur;
        layer.context.shadowOffsetX = style.shadowX;
        layer.context.shadowOffsetY = style.shadowY;
        
        layer.context.lineWidth     = style.lineWidth;
        layer.context.strokeStyle   = game.particles.getColor(lineColor.r, lineColor.g, lineColor.b, lineColor.a);
        layer.context.strokeRect(x, y, style.width, style.height);
        
        layer.context.fillStyle     = game.particles.getColor(color.r, color.g, color.b, color.a);
        layer.context.fillRect(x, y, style.width, style.height);
    };

    this.drawCircle = function(layer, style) {
        var color                   = game.particles.defaultColor(style.color);
        var lineColor               = game.particles.defaultColor(style.lineColor);
        var shadowColor             = game.particles.defaultColor(style.shadowColor);

        layer.context.shadowColor   = game.particles.getColor(shadowColor.r, shadowColor.g, shadowColor.b, shadowColor.a);
        layer.context.shadowBlur    = style.shadowBlur;
        layer.context.shadowOffsetX = style.shadowX;
        layer.context.shadowOffsetY = style.shadowY;
        
        layer.context.beginPath();
        layer.context.arc(style.x, style.y, style.radius, 0, 2 * Math.PI, false);
        layer.context.closePath();
        
        layer.context.lineWidth     = style.lineWidth;
        layer.context.strokeStyle   = game.particles.getColor(lineColor.r, lineColor.g, lineColor.b, lineColor.a);
        layer.context.stroke();
        
        layer.context.fillStyle     = game.particles.getColor(color.r, color.g, color.b, color.a);
        layer.context.fill();
    };

    this.animateStyles = function(style, endStyle, lifeSpan) {
        if(endStyle !== undefined) {
            for(var key in style) {
                style = this.incrementStyle(key, style, endStyle, lifeSpan);
            }

            for(var key in style.color) {
                style.color = this.incrementStyle(key, style.color, endStyle.color, lifeSpan);
            }

            for(var key in style.lineColor) {
                style.lineColor = this.incrementStyle(key, style.lineColor, endStyle.lineColor, lifeSpan);
            }
        }

        return style;
    };

    this.incrementStyle = function(key, style, endStyle, lifeSpan) {
        var rate = style[key] / (lifeSpan * game.FPS) * endStyle[key];
        rate === 0 && (rate = 1);

        (style[key] > endStyle[key]) && (style[key] -= rate);
        (style[key] < endStyle[key]) && (style[key] += rate);

        return style;
    };

    this.getColor = function(r, g, b, a) {
        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
    };
    
    this.defaultColor = function(color) {
        color === undefined && (color = { 'r': 0, 'g': 0, 'b': 0, 'a': 0 });
        
        return color;
    };

    this.getUniqueId = function() {
        return this.uid++;
    };
}