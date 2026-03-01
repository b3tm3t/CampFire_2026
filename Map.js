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

        // 1. Logic Grid (Used for collisions/physics)
        this.grid = new Int8Array(width * height);
        this.grid.fill(1); // Fill logic with dirt

        // 2. Visual Buffer (The "Shadow Canvas")
        // We create an invisible canvas to hold the drawing of the map
        this.shadowCanvas = document.createElement('canvas');
        this.shadowCanvas.width = width;
        this.shadowCanvas.height = height;
        this.shadowCtx = this.shadowCanvas.getContext('2d');

        // 3. Draw the initial DIRT onto the Shadow Canvas ONCE
        this.shadowCtx.fillStyle = "#8B4513";
        this.shadowCtx.fillRect(0, 0, width, height);
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
        // 1. Update the Logic Grid (Math)
        for (let x = -radius; x < radius; x++) {
            for (let y = -radius; y < radius; y++) { 
                if ((x ** 2 + y **2 ) ** (1/2) < radius) {
                    this.setTile(Math.floor(pos_x + x), Math.floor(pos_y + y), Map.NOTHING);
                }
            }
        }

        // 2. Update the Visuals (The Image)
        // Instead of redrawing the whole map, we just erase this circle from the image
        this.shadowCtx.globalCompositeOperation = 'destination-out'; // This makes drawing "erase"
        this.shadowCtx.beginPath();
        this.shadowCtx.arc(pos_x, pos_y, radius, 0, Math.PI * 2);
        this.shadowCtx.fill();
        this.shadowCtx.globalCompositeOperation = 'source-over'; // Reset to normal drawing
    }

    draw(ctx) {
        // SUPER FAST: We just draw the pre-rendered image!
        // No loops, no math, just one image copy.
        ctx.drawImage(this.shadowCanvas, 0, 0);
    }
}