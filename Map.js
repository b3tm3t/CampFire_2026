class Map {
    // Materials
    static NOTHING = 0;
    static DIRT = 1;
    static CLAY = 2;
    static WATER = 3;
    static ROAD = 4;
    static ROCK = 5;

    static SEWAGE_WALL = 5;
    // Consumables
    static POOP = 10;
    static TRASH = 20;

    scale = 20; // How much pixels wide each thing is

    constructor(width, height) {
        this.width = width;
        this.height = height;
        const grid = new Int8Array(width * height);

    }

    setTile(x, y, value) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.grid[(y * this.width) + x] = value;
        }
    }

    changeScale(newScale) {
        this.scale = newScale;
    }

    dig(pos_x, pos_y, radius) { // Int x, int y, int radius
        for (let x = -radius; x < radius; x++) {
            for (let y = -radius; y < radius; y++) { 
                this.setTile(pos_x, pos_y, NOTHING);
            }
        }
    }

    draw(ctx) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const tile = this.grid[(y * this.width) + x];

                if (tile === Map.DIRT) {
                    ctx.fillStyle = "#8B4513"; // SaddleBrown color for dirt
                    ctx.fillRect(
                        x * this.scale, 
                        y * this.scale, 
                        this.scale, 
                        this.scale
                    );
                }
            }
        }
    }

    

}