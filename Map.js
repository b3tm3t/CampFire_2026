export class Map {
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

    static cameraScale = 3; // How much pixels wide each tile is

    constructor(width, height) {
        this.width = width;
        this.height = height;
        
        // Fix: Make the static scale available to the instance so index.html can read 'map.cameraScale'
        this.cameraScale = Map.cameraScale;

        this.grid = new Int8Array(width * height);

        this.grid.fill(1); 

    }

    setTile(x, y, value) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.grid[(y * this.width) + x] = value;
        }
    }

    changeScale(newScale) {
        this.cameraScale = newScale;
    }

    dig(pos_x, pos_y, radius) { // Int x, int y, int radius
        for (let x = -radius; x < radius; x++) {
            for (let y = -radius; y < radius; y++) { 

                if ((x ** 2 + y **2 ) ** (1/2) < radius) {

                    this.setTile(pos_x + x, pos_y + y, Map.NOTHING);

                    console.log("Positions: ", pos_x + " " + pos_y)
                }
            }
        }
    }

    draw(ctx) {
        // Note: Because index.html handles the ctx.scale, we draw at 1x1 size here
        // and let the main canvas scale it up.
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const tile = this.grid[(y * this.width) + x];

                if (tile == Map.DIRT) {

                    ctx.fillStyle = "#8B4513"; 
                    // Draw 1 unit wide, let index.html handle the Zoom
                    ctx.fillRect(x, y, 1, 1);
                }
            }
        }
    }
}