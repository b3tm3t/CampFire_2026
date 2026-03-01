import { Map } from './Map.js';
import { Node } from './Node.js';

export class Player {
    // Materials
    map_x = 0;
    map_y = 0;
    
    // Movement Properties
    maxSpeed = 0;
    width = 0;
    currentAngle = 0;
    health = 0;

    air;

    // Tasks

    touchedTopLeftCorner = false;
    touchedTopRightCorner = false;
    
    angleTurning = 6; 
    forwardVelocity = 0;
    
    // --- NEW: Cooldown to prevent instant death ---
    damageCooldown = 0;
    
    constructor(map_x, map_y, maxSpeed, width, health, length, map) {
        this.map_x = map_x;
        this.map_y = map_y;
        this.maxSpeed = maxSpeed;
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
    
    calculateVelocity(input, dirtDug) {
        let isMoving = input.ArrowRight || input.d || input.ArrowLeft || input.a || 
        input.ArrowDown || input.s || input.ArrowUp || input.w;
        
        if (isMoving) {
            this.forwardVelocity += 0.5; 
        } else {
            this.forwardVelocity -= 0.5; 
        }
        
        // Your logic for dirt friction:
        // Change /150 to /1000
        this.forwardVelocity = Math.max(0, Math.min(this.maxSpeed, this.forwardVelocity - dirtDug/175)); 
    }
    
    // --- UPDATED: Now accepts 'rocks' to check collisions ---
    updatePos(worldWidth, worldHeight, rocks) { 
        let r = this.width / 2; 
        
        // 1. Calculate projected position
        let nextX = this.map_x + Math.cos(this.currentAngle) * this.forwardVelocity;
        let nextY = this.map_y + Math.sin(this.currentAngle) * this.forwardVelocity;
        
        // 2. Reduce damage cooldown
        if (this.damageCooldown > 0) this.damageCooldown--;
        
        // 3. Check Rock Collisions
        let hitRock = false;
        
        // Only check collision if rocks exist
        if (rocks && rocks.length > 0) {
            for (let rock of rocks) {
                let dx = nextX - rock.x;
                let dy = nextY - rock.y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                
                // Collision check (Rock Radius + Worm Radius)
                if (dist < (rock.size + r)) {
                    hitRock = true;
                    
                    // Take Damage
                    if (this.damageCooldown === 0) {
                        this.health -= 10; 
                        console.log("Ouch! Health:", this.health);
                        this.damageCooldown = 60; // 1 second invulnerability
                        
                        // Bounce back effect
                        this.forwardVelocity = -2; 
                    }
                    break; 
                }
            }
        }
        
        // 4. Move only if safe
        if (!hitRock) {
            if (nextX > r && nextX < worldWidth - r) { this.map_x = nextX; }
            if (nextY > (310 + r) && nextY < worldHeight - r) { this.map_y = nextY; }
        } else {
            // Stop forward movement if hitting a rock
            if (this.forwardVelocity > 0) this.forwardVelocity = 0;
        }
        
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

    drown() {
        if (this.map_y > this.map.rainLevel) { // If it is deeper down in the 
            this.air -= 1;
        } else {
            this.air += 1;
        }

        this.air = Math.max(Math.min(100, this.air), 0);

        if (this.air == 0) {
            health --;
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
            
            // --- UPDATED: Visual feedback for damage ---
            // If cooldown is active and this is the head (i===0), draw white
            if (this.damageCooldown > 0 && i === 0) {
                ctx.fillStyle = "white"; 
            } else {
                ctx.fillStyle = node.color; 
            }
            
            ctx.fill();
            
            if (i === 0) { 
                ctx.save();
                ctx.rotate(this.currentAngle);
                ctx.fillStyle = "black";
                ctx.fillRect(5, -5, 5, 5); 
                ctx.fillRect(5, 5, 5, 5);  
                ctx.restore(); 
                
                // Health Bar
                ctx.fillStyle = "red";
                ctx.fillRect(-25, -40, 50, 6);
                let hpPercent = Math.max(0, this.health / 100); 
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
        let newNode = new Node(tail.pos_x, tail.pos_y, this.wormNodes.length, this);
        this.wormNodes.push(newNode);
        
        // Update length property
        this.length = this.wormNodes.length;
    }

    detectCornersTouched() {
        if ((this.map_y) < 330) {
            
            if (this.map_x < 40) {
                this.touchedTopLeftCorner = true;
            } else if (this.map_x > this.map.width - 30) {
                this.touchedTopRightCorner = true;
            }
            
        }

        console.log("Topsoils: ", this.touchedTopLeftCorner + " " + this.touchedTopRightCorner);
    }
}   