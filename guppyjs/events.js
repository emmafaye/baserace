function Events() {
    this.time   = new Date().getTime();
    this.second = 1000;
    this.queue  = [];

    // Creates an event to be executed in x amount of seconds.
    this.new = function(name, delay, repeat, functionToExecute) {
        this.queue[name] = {
            'delay': delay * this.second,
            'time': this.time,
            'repeat': repeat,
            'functionToExecute': functionToExecute
        };
    };

    this.remove = function(key) {
        delete this.queue[key];
    };

    this.process = function() {
        this.time = new Date().getTime();

        for(var key in this.queue) {
            var event = this.queue[key];

            if(event.delay + event.time - this.time <= 0) {
                event.functionToExecute();

                event.repeat && (event.time = this.time);
                event.repeat === false && this.remove(key);
            }
        }
    };

}