export class Map {
    // Materials
    static NOTHING = 0;
    static DIRT = 1;
    
    static cameraScale = 3; 

    rainLevel;

    isRaining;
    
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
        // 4. Stats for Depth
        this.lowestDugY = 310; // Start at the surface level
    }
    
    dig(pos_x, pos_y, radius) { 
        let dirtDug = 0; 
        
        // 1. Calculate the area to check (Absolute Coordinates)
        let startX = Math.floor(pos_x - radius);
        let endX   = Math.ceil(pos_x + radius);
        let startY = Math.floor(pos_y - radius);
        let endY   = Math.ceil(pos_y + radius);
        
        // Make sure we don't check outside the map
        startX = Math.max(0, startX);
        endX   = Math.min(this.width, endX);
        startY = Math.max(0, startY);
        endY   = Math.min(this.height, endY);
        
        // 2. Loop through the pixels
        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) { 
                
                // Check if inside the circle radius
                let dx = x - pos_x;
                let dy = y - pos_y;
                
                if ((dx * dx + dy * dy) < (radius * radius)) {
                    
                    let idx = (y * this.width) + x;
                    
                    // Check if there is dirt here
                    if (this.grid[idx] === Map.DIRT) {
                        Worm.velocityDampened = true; // Dampen velocity when digging
                        this.grid[idx] = Map.NOTHING; // Remove it
                        dirtDug++; 
                        this.dirtRemoved++; // Track for percentage
                        
                        // --- FIX: TRACK DEPTH ---
                        // Since 'y' is now the absolute coordinate (e.g. 600),
                        // this check will work correctly.
                        if (y > this.lowestDugY) {
                            this.lowestDugY = y;
                        }
                    }
                }
            }
        }
        
        // 3. Update the Visuals
        if (dirtDug > 0) {
            this.shadowCtx.globalCompositeOperation = 'destination-out';
            this.shadowCtx.beginPath();
            this.shadowCtx.arc(pos_x, pos_y, radius, 0, Math.PI * 2);
            this.shadowCtx.fill();
            this.shadowCtx.globalCompositeOperation = 'source-over';
        }
        
        return dirtDug; 
    }
    
    draw(ctx, worldWidth) {
        // We just draw the image we created in the constructor
        // Because index.html handles the Zoom/Camera, we just draw at 0,0

        if (this.isRaining) {
            ctx.fillRect(0, this.rainLevel, worldWidth, this.lowestDugY);
        }
        
        ctx.drawImage(this.shadowCanvas, 0, 0);
    }

    startRain() {
        this.rainLevel = this.lowestDugY;
        this.isRaining = true;
    }

    getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

}