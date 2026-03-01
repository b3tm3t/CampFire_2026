import { Map } from './Map.js';

export class Player {
    // Materials
    map_x = 0;
    map_y = 0;
    
    // Movement Properties
    speed = 0;
    width = 0;
    currentAngle = 0;
    health = 0;
    
    angleTurning = 3; 
    forwardVelocity = 0;
    secondsSurvived = 0;
    
    constructor(map_x, map_y, speed, width, health, length, map) {
        this.map_x = map_x;
        this.map_y = map_y;
        this.speed = speed;
        this.width = width;
        this.health = health;
        this.length = length;
        this.map = map;
        
        this.wormNodes = new Array(1);
        this.wormNodes=[]; 
        for (let i=0; i<this.length; i++){
            this.wormNodes.push({ x: this.map_x, y: this.map_y });
        } 
        this.dirtStomach = 0; // Tracks how much dirt we've eaten
        this.growthThreshold = 2000; // How much dirt equals 1 new segment 
    }
    
    calculateAngle(input) { 
        let right = input.ArrowRight || input.d;
        let left  = input.ArrowLeft  || input.a;
        let down  = input.ArrowDown  || input.s;
        let up    = input.ArrowUp    || input.w;
        
        let dx = (right ? 1 : 0) - (left ? 1 : 0);
        let dy = (down ? 1 : 0) - (up ? 1 : 0);
        
        if (dx !== 0 || dy !== 0) {
            let desiredAngle = Math.atan2(dy, dx);
            let diff = desiredAngle - this.currentAngle;
            
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI)  diff -= Math.PI * 2;
            
            let step = (Math.PI / 180) * this.angleTurning;
            
            if (Math.abs(diff) < step) {
                this.currentAngle = desiredAngle;
            } else {
                this.currentAngle += (diff > 0 ? step : -step);
            }
        }
    }
    
    calculateVelocity(input) {
        let isMoving = input.ArrowRight || input.d || input.ArrowLeft || input.a || 
        input.ArrowDown || input.s || input.ArrowUp || input.w;
        
        if (isMoving) {
            this.forwardVelocity += 0.5; 
        } else {
            this.forwardVelocity *= 0.9; 
        }
        this.forwardVelocity = Math.max(0, Math.min(this.speed, this.forwardVelocity));
    }
    
    updatePos(worldWidth, worldHeight) {
        let r = this.width / 2; 
        
        let nextX = this.map_x + Math.cos(this.currentAngle) * this.forwardVelocity;
        let nextY = this.map_y + Math.sin(this.currentAngle) * this.forwardVelocity;
        
        if (nextX > r && nextX < worldWidth - r) {
            this.map_x = nextX;
        }
        
        if (nextY > (310 + r) && nextY < worldHeight - r) {
            this.map_y = nextY;
        }
        
        // 1. Sync the Head (Node 0) to the Player's position
        if(this.wormNodes[0]) {
            this.wormNodes[0].x = this.map_x;
            this.wormNodes[0].y = this.map_y;
        }
        
        // 2. Drag the Body (Nodes 1 to End)
        // Each node follows the one before it
        let spacing = this.width / 2; // Overlap amount (smaller number = tighter body)
        
        for (let i = 1; i < this.wormNodes.length; i++) {
            let prev = this.wormNodes[i - 1];
            let curr = this.wormNodes[i];
            
            // Calculate angle from Current -> Previous
            let dx = prev.x - curr.x;
            let dy = prev.y - curr.y;
            let angle = Math.atan2(dy, dx);
            
            // Move Current to be exactly 'spacing' distance away from Previous
            // Only move if they are too far apart
            let dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist > spacing) {
                curr.x = prev.x - Math.cos(angle) * spacing;
                curr.y = prev.y - Math.sin(angle) * spacing;
            }
        }
    }
    
    draw(ctx) {
        // Draw from tail to head (so head is on top)
        for (let i = this.wormNodes.length - 1; i >= 0; i--) {
            let node = this.wormNodes[i];
            
            ctx.save();
            ctx.translate(node.x, node.y);
            
            // Draw Circle
            ctx.beginPath();
            ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
            ctx.fillStyle = (i === 0) ? "#2ecc71" : "#27ae60"; // Head is lighter green
            ctx.fill();
            
            // Optional: Eyes on the Head only
            if (i === 0) {
                ctx.rotate(this.currentAngle);
                ctx.fillStyle = "black";
                ctx.fillRect(5, -5, 5, 5); // Right eye
                ctx.fillRect(5, 5, 5, 5);  // Left eye
            }
            
            ctx.restore();
        }
    }
    grow() {
        // 1. Find the very last node (the tail)
        let tail = this.wormNodes[this.wormNodes.length - 1];
        
        // 2. Add a new node at the exact same spot as the tail
        // It will naturally drift apart as you move
        this.wormNodes.push({
            x: tail.x,
            y: tail.y
        });
        
        // Note: Because we are using simple objects for nodes now (from previous step), 
        // we push {x, y}. If you are still using the Node class, use: new Node(tail.x, tail.y, this.width, this)
    }
}