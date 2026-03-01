import { Map } from './Map.js';
import { Node } from './Node.js';

export class Player {
    // Materials
    map_x = 0;
    map_y = 0;
    
    // Movement Properties
    speed = 0;
    width = 0;
    currentAngle = 0;
    health = 0;
    velocityDampened = false;
    
    angleTurning = 6; 
    forwardVelocity = 0;
    tempVel = 0;
    
    constructor(map_x, map_y, speed, width, health, length, map) {
        this.map_x = map_x;
        this.map_y = map_y;
        this.speed = speed;
        this.width = width;
        this.health = health;
        this.length = length;
        this.map = map;
        
        this.wormNodes = []; 
        for (let i = 0; i < this.length; i++) {
            this.wormNodes.push(new Node(this.map_x, this.map_y, i, this));
        }
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
            this.tempVel += 0.5; 
        } else {
            this.tempVel *= 0.9; 
        }
        if (this.velocityDampened) {
            this.forwardVelocity = this.tempVel * 0.1;
        } else {
            this.forwardVelocity = this.tempVel;
        }
        this.forwardVelocity = Math.max(0, Math.min(this.speed, this.forwardVelocity));
    }
    
    updatePos(worldWidth, worldHeight) { 
        let r = this.width / 2; 
        let nextX = this.map_x + Math.cos(this.currentAngle) * this.forwardVelocity;
        let nextY = this.map_y + Math.sin(this.currentAngle) * this.forwardVelocity;
        
        if (nextX > r && nextX < worldWidth - r) { this.map_x = nextX; }
        if (nextY > (310 + r) && nextY < worldHeight - r) { this.map_y = nextY; }
        
        // Sync Head Node
        if(this.wormNodes[0]) {
            this.wormNodes[0].pos_x = this.map_x;
            this.wormNodes[0].pos_y = this.map_y;
            this.wormNodes[0].update(); 
        }
        
        let spacing = this.width / 2; 
        
        for (let i = 1; i < this.wormNodes.length; i++) {
            let prev = this.wormNodes[i - 1];
            let curr = this.wormNodes[i];
            
            let dx = prev.pos_x - curr.pos_x;
            let dy = prev.pos_y - curr.pos_y;
            let angle = Math.atan2(dy, dx);
            let dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist > spacing) {
                curr.pos_x = prev.pos_x - Math.cos(angle) * spacing;
                curr.pos_y = prev.pos_y - Math.sin(angle) * spacing;
            }

            curr.update();
        }
    }   
    
    draw(ctx) { 
        // Draw starting from tail to head
        for (let i = this.wormNodes.length - 1; i >= 0; i--) { 
            let node = this.wormNodes[i];
            
            ctx.save();
            ctx.translate(node.pos_x, node.pos_y);
            
            ctx.beginPath();
            ctx.arc(0, 0, node.width, 0, Math.PI * 2);
            ctx.fillStyle = node.color; 
            ctx.fill();
            
            if (i === 0) { 
                ctx.save();
                ctx.rotate(this.currentAngle);
                ctx.fillStyle = "black";
                ctx.fillRect(5, -5, 5, 5); 
                ctx.fillRect(5, 5, 5, 5);  
                ctx.restore(); 
                
                ctx.fillStyle = "red";
                ctx.fillRect(-25, -40, 50, 6);
                let hpPercent = this.health / 100; 
                ctx.fillStyle = "#00ff00";
                ctx.fillRect(-25, -40, 50 * hpPercent, 6);
                ctx.strokeStyle = "black";
                ctx.lineWidth = 1;
                ctx.strokeRect(-25, -40, 50, 6);
            }
            
            ctx.restore();
        }
    }        

    grow() {
        let tail = this.wormNodes[this.wormNodes.length - 1];
        // Create new node at the tail's position
        // The index is the current length
        let newNode = new Node(tail.pos_x, tail.pos_y, this.wormNodes.length, this);
        this.wormNodes.push(newNode);
        
        // Update length property
        this.length = this.wormNodes.length;
    }
}