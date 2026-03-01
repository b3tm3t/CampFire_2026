export class Map {
    // Materials
    static NOTHING = 0;
    static DIRT = 1;
    
    static cameraScale = 3; 
    
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.cameraScale = Map.cameraScale;
        // --- FIX: CREATE THE LOGIC GRID ---
        this.grid = new Int8Array(width * height);
        this.grid.fill(1); // Fill everything with dirt (1) initially
        
        // Clear the sky (top 310 pixels) so we don't dig air
        for(let i = 0; i < width * 310; i++) {
            this.grid[i] = Map.NOTHING;
            // 3. Stats for Percentage
            // Total area minus the sky area (310px height)
            this.totalDirtPixels = width * (height - 310);
            this.dirtRemoved = 0;
        }
        
        // 1. Visual Buffer (The "Shadow Canvas")
        // This acts as a permanent layer we draw ONCE and then update
        this.shadowCanvas = document.createElement('canvas');
        this.shadowCanvas.width = width;
        this.shadowCanvas.height = height;
        this.shadowCtx = this.shadowCanvas.getContext('2d');
        
        // 2. Fill the whole thing with Brown
        this.shadowCtx.fillStyle = "#8B4513";
        this.shadowCtx.fillRect(0, 310, width, height);
    }
    
    dig(pos_x, pos_y, radius) { 
        let dirtDug = 0; // Counter
        
        // 1. Update the Logic Grid & Count Dirt
        for (let x = -radius; x < radius; x++) {
            for (let y = -radius; y < radius; y++) { 
                if ((x ** 2 + y **2 ) ** (1/2) < radius) {
                    
                    // Calculate exact array index
                    let gridX = Math.floor(pos_x + x);
                    let gridY = Math.floor(pos_y + y);
                    let idx = (gridY * this.width) + gridX;
                    
                    // Only count if we are actually removing DIRT (not empty space)
                    if (this.grid[idx] === Map.DIRT) {
                        this.grid[idx] = Map.NOTHING;
                        dirtDug++; 
                        this.dirtRemoved++; // <--- Add this line to track global progress 
                    }
                }
            }
        }
        
        // 2. Update the Visuals
        if (dirtDug > 0) {
            this.shadowCtx.globalCompositeOperation = 'destination-out';
            this.shadowCtx.beginPath();
            this.shadowCtx.arc(pos_x, pos_y, radius, 0, Math.PI * 2);
            this.shadowCtx.fill();
            this.shadowCtx.globalCompositeOperation = 'source-over';
        }
        
        return dirtDug; // Send this number back to the game!
    }
    
    draw(ctx) {
        // We just draw the image we created in the constructor
        // Because index.html handles the Zoom/Camera, we just draw at 0,0
        ctx.drawImage(this.shadowCanvas, 0, 0);
    }
}