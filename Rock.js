export class Rock {
    x;
    y;
    size;
    points = []; // <--- FIXED: Defined here so it exists
    color;
    
    constructor(x, y, size){
        this.x = x; // <--- FIXED: Using 'x' to match draw()
        this.y = y; // <--- FIXED: Using 'y' to match draw()
        this.size = size;
        
        // Random grey color
        const shade = Math.floor(Math.random() * 50 + 80); 
        this.color = `rgb(${shade}, ${shade}, ${shade})`;
        
        this.generateShape(size);
    }
    
    generateShape(baseRadius) {
        // Clear points just in case
        this.points = [];
        
        const numVertices = Math.floor(Math.random() * 7) + 8;
        
        for (let i = 0; i < numVertices; i++) {
            const angle = (i / numVertices) * (Math.PI * 2);
            const variance = (Math.random() * 0.8) + 0.6;
            const currentRadius = baseRadius * variance;
            
            const px = Math.cos(angle) * currentRadius;
            const py = Math.sin(angle) * currentRadius;
            
            this.points.push({ x: px, y: py });
        }
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y); // <--- works now because this.x exists
        
        ctx.beginPath();
        if(this.points.length > 0) {
            ctx.moveTo(this.points[0].x, this.points[0].y);
            for (let i = 1; i < this.points.length; i++) {
                ctx.lineTo(this.points[i].x, this.points[i].y);
            }
        }
        ctx.closePath(); 
        
        ctx.fillStyle = this.color;
        ctx.fill();
        
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.restore();
    }
}