function Animations() {
    this.queue      = {};
    this.state      = {};

    this.state.idle = function(key, queue) {
        var item   = queue.item;

        item.idle();
    };

    this.state.move = function(key, queue) {
        var item   = queue.item;
        var target = queue.target;

        item.move(target);
    };

    this.state.attack = function(key, queue) {
        var item            = queue.item;
        var itemAttackRange = {
            'x': item.x - item.range / 2,
            'y': item.y - item.range / 2,
            'width': item.width + item.range,
            'height': item.height + item.range
        };

        var target          = queue.target;
        var isColliding     = game.collisions.isColliding(itemAttackRange, target);

        if(isColliding) {
            item.attack(target);
        } else {
            item.move(target);
        }

    };

    this.state.attackIdle = function(key, queue) {

    };

    this.state.guard = function(key, queue) {

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