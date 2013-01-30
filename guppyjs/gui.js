function GUI() {
    this.elements = [];

    this.new = function(name, type, style) {
        this.elements[name] = {
            'type': type,
            'style': style
        };
    };

    this.remove = function(name) {
        delete this.elements[name];
    };

    this.modal = function(style) {
        game.foreground.context.fillStyle = style.color;
        game.foreground.context.fillRect(0, 0, game.foreground.width, game.foreground.height);
    };


    this.text = function(style) {
        game.foreground.context.font      = style.size +'px ' + style.font;
        game.foreground.context.fillStyle = style.color;
        game.foreground.context.fillText(style.text, style.x, style.y);
    };

    this.process = function() {
        for(var key in this.elements) {
            var element = this.elements[key];

            element.type(element.style);
        }
    };
}