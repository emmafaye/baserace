function Sprites() {
    this.load = function(location) {
        var image = new Image();
        
        image.src = location;
        
        return image;
    };
}