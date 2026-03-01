export class Map {
    // Materials
    static NOTHING = 0;
    static DIRT = 1;

    static cameraScale = 3; 

    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.cameraScale = Map.cameraScale;

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
        // VISUAL UPDATE: Cut a hole in the image
        this.shadowCtx.globalCompositeOperation = 'destination-out'; // "Eraser Mode"
        this.shadowCtx.beginPath();
        this.shadowCtx.arc(pos_x, pos_y, radius, 0, Math.PI * 2);
        this.shadowCtx.fill();
        this.shadowCtx.globalCompositeOperation = 'source-over'; // Reset to "Drawing Mode"
    }

    draw(ctx) {
        // We just draw the image we created in the constructor
        // Because index.html handles the Zoom/Camera, we just draw at 0,0
        ctx.drawImage(this.shadowCanvas, 0, 0);
    }
}