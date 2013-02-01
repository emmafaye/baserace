function Collisions() {
    this.items = [];

    // Add an item to the list of items for checking collisions.
    this.new = function(item) {
        this.items[item.name] = item;
    };

    this.remove = function(key) {
        delete this.items[key];
    };

    this.hasCollision = function(item) {
        var isColliding = false;

        if(this.items.indexOf(item)) {
            for(var key in this.items) {
                var hasSameName = this.items[key].name === item.name;

                if(hasSameName === false && this.isColliding(item, this.items[key])) {
                    isColliding = true;
                    break;
                }
            }
        }

        return isColliding;
    };

    this.numberOfItems = function() {
        return Object.keys(this.items).length;
    };

    this.isColliding = function(item, itemTwo) {
        return item.x < (itemTwo.x + itemTwo.width) &&
               item.y < (itemTwo.y + itemTwo.height) &&
               itemTwo.x < (item.x + item.width) &&
               itemTwo.y < (item.y + item.height);
    };

    this.inProximity = function(item, enemyUnits) {
        var result        = false;
        var unitProximity = {
            'x': item.x - item.lineOfSight / 2,
            'y': item.y - item.lineOfSight / 2,
            'width': item.width + item.lineOfSight,
            'height': item.height + item.lineOfSight
        };

        for(var key in enemyUnits) {
            var enemyUnit   = enemyUnits[key];
            var inProximity = this.isColliding(unitProximity, enemyUnit);

            if(inProximity) {
                result = enemyUnit;
                break;
            }
        }
        return result;
    };
}