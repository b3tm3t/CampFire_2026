import { Node } from './Node.js';
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
        
        // Initialize Head Node
        this.wormNodes = new Array(1);
        // Assuming Node(x, y, size, owner)
        this.wormNodes[0] = new Node(map_x, map_y, width, this); 
    }

    calculateAngle(input) { 
        // 1. Check keys (Arrow keys or WASD)
        let right = input.ArrowRight || input.d;
        let left  = input.ArrowLeft  || input.a;
        let down  = input.ArrowDown  || input.s;
        let up    = input.ArrowUp    || input.w;

        let dx = (right ? 1 : 0) - (left ? 1 : 0);
        let dy = (down ? 1 : 0) - (up ? 1 : 0);

        // 2. Turn towards the desired direction
        if (dx !== 0 || dy !== 0) {
            let desiredAngle = Math.atan2(dy, dx);
            let diff = desiredAngle - this.currentAngle;
            
            // Normalize angle to -PI to +PI
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI)  diff -= Math.PI * 2;

            let step = (Math.PI / 180) * this.angleTurning;

            // Smooth turning
            if (Math.abs(diff) < step) {
                this.currentAngle = desiredAngle;
            } else {
                this.currentAngle += (diff > 0 ? step : -step);
            }
        }
    }
    
    calculateVelocity(input) {
        // Accelerate if any key is pressed
        let isMoving = input.ArrowRight || input.d || input.ArrowLeft || input.a || 
                       input.ArrowDown || input.s || input.ArrowUp || input.w;

        if (isMoving) {
            this.forwardVelocity += 0.5; 
        } else {
            this.forwardVelocity *= 0.9; // Friction to stop
        }
        // Cap speed between 0 and max speed
        this.forwardVelocity = Math.max(0, Math.min(this.speed, this.forwardVelocity));
    }

    // Accepts World Size (not Canvas Size) to calculate collisions
    updatePos(worldWidth, worldHeight) {
        
        let r = this.width / 2; // Radius

        // Calculate next position based on angle and speed
        // Note: We do NOT divide by cameraScale here. Physics should be consistent.
        let nextX = this.map_x + Math.cos(this.currentAngle) * this.forwardVelocity;
        let nextY = this.map_y + Math.sin(this.currentAngle) * this.forwardVelocity;

        // --- X Axis Collision (Left/Right Walls) ---
        if (nextX > r && nextX < worldWidth - r) {
            this.map_x = nextX;
        }

        // --- Y Axis Collision (Top/Bottom Walls) ---
        // Top Wall: 133 pixels down + radius
        if (nextY > (290 + r) && nextY < worldHeight - r) {
            this.map_y = nextY;
        }

        // Sync the Node Head with the Player Position
        if(this.wormNodes[0]) {
            this.wormNodes[0].x = this.map_x;
            this.wormNodes[0].y = this.map_y;
        }
    }

    draw(ctx) { 
        ctx.save(); // Save context state

        // 1. Move the drawing cursor to the Player's World Position
        ctx.translate(this.map_x, this.map_y);

        // 2. Rotate the entire context
        ctx.rotate(this.currentAngle);

        ctx.fillStyle = "#2ecc71"; // Green

        // 3. Draw the square CENTERED at (0,0) relative to the translation
        // This makes the square rotate around its own center
        ctx.fillRect(-this.width / 2, -this.width / 2, this.width, this.width);

        // Optional: Draw a small "Eye" to see which way is forward
        ctx.fillStyle = "black";
        ctx.fillRect(5, -5, 5, 5);

        ctx.restore(); // Restore context state
    }
}