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

    static cameraScale = 3; 

    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.cameraScale = Map.cameraScale;

        this.grid = new Int8Array(width * height);
        
        // 1. FILL WITH DIRT (This creates the brown background)
        // If you want empty space, change this to 0 (NOTHING)
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

    dig(pos_x, pos_y, radius) { 
        for (let x = -radius; x < radius; x++) {
            for (let y = -radius; y < radius; y++) { 
                if ((x ** 2 + y **2 ) ** (1/2) < radius) {
                    this.setTile(Math.floor(pos_x + x), Math.floor(pos_y + y), Map.NOTHING);
                }
            }
        }
    }

    // UPDATED: Now accepts camera info to optimize drawing
    draw(ctx, camX, camY, canvasWidth, canvasHeight) {
        
        // 1. Calculate the Visible Area (Culling)
        // We only want to draw loops from the left side of the screen to the right side
        // The "+1" and "buffer" are to prevent flickering at the edges
        const buffer = 2; 

        let startX = Math.floor(camX) - buffer;
        let startY = Math.floor(camY) - buffer;
        
        let endX = startX + (canvasWidth / this.cameraScale) + (buffer * 2);
        let endY = startY + (canvasHeight / this.cameraScale) + (buffer * 2);

        // 2. Clamp values so we don't look outside the map array
        startX = Math.max(0, startX);
        startY = Math.max(0, startY);
        endX = Math.min(this.width, endX);
        endY = Math.min(this.height, endY);

        // 3. The Optimized Loop
        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                
                const tile = this.grid[(y * this.width) + x];

                if (tile !== Map.NOTHING) {
                    if (tile == Map.DIRT) ctx.fillStyle = "#8B4513";
                    else if (tile == Map.CLAY) ctx.fillStyle = "#A0522D";
                    
                    // Draw the tile
                    // Note: We create a 1.05 width to slightly overlap and prevent 
                    // tiny "cracks" (grid lines) between tiles when zooming.
                    ctx.fillRect(x, y, 1.05, 1.05);
                }
            }
        }
    }
}