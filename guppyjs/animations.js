function Animations() {
    this.queue      = {};
    this.state      = {};

    this.state.idle = function() {};

    this.state.move = function(key, queue) {
        var item   = queue.item;
        var target = queue.target;

        item.move(key, item, target);
    };

    this.state.attack = function(key, queue) {
        var item   = queue.item;
        var target = queue.target;
        var isColliding = game.collisions.isColliding(queue.item, queue.target);

        if(isColliding) {
//            game.events.new(item.name + '.attacking', 1, true, function() {
                item.attack(key, target);
//            });
        } else {
            item.move(key, item, target);
        }

    };

    // Add animation to queue to be processed.
    this.new = function(item, target, action) {
        this.queue[item.name] = {
            'item': item,
            'target': target,
            'x': target.x - (item.width / 2),
            'y': target.y - (item.height / 2),
            'action': action
        };
    };

    this.remove = function(key) {
        delete this.queue[key];
    };

    this.changeState = function(key, state) {
        this.queue[key].action = state;
    };

    this.numberOfQueuedItems = function() {
        return Object.keys(this.queue).length;
    };

    // Processed the queued action items.
    this.process = function() {
        var refreshCanvas = this.numberOfQueuedItems() !== 0;

        refreshCanvas && game.foreground.context.clearRect(0, 0, game.foreground.width, game.foreground.height);
        refreshCanvas && game.background.context.clearRect(0, 0, game.background.width, game.background.height);

        for(var key in this.queue) {
            var queue = this.queue[key];

            queue.action(key, queue);
            queue.item.render();
        }

        // Mouse selection is populated with a rectangle to draw when
        // mouseClicked is true, otherwise it is populated with an empty function.
        game.controls.mouse.selection.render();

    };
}