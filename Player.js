import { Node } from './Node.js';
import { Map } from './Map.js'

export class Player {
    // Materials
    map_x = 0;
    map_y = 0;

    speed = 0;
    width = 0;

    currentAngle = 0;
    health = 0;
    
    // Adjusted turning speed for better control
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
        
        this.wormNodes = new Array(1);

        this.wormNodes[0] = new Node(map_x, map_y, 1, this);

        this.map = map;

    }

    calculateAngle(input) { 
        // 1. Check for Arrow Keys OR WASD
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
            this.forwardVelocity += 0.2;
        } else {
            this.forwardVelocity *= 0.9; // Friction
        }
        this.forwardVelocity = Math.max(0, Math.min(this.speed, this.forwardVelocity));
    }

    // 1. Accept the canvas size so we know where the walls are
    updatePos(canvasWidth, canvasHeight) {
        
        let halfSize = this.width / 2;

        // FIXED: Do not divide by cameraScale. Velocity should be consistent regardless of zoom.
        let nextX = this.map_x + Math.cos(this.currentAngle) * this.forwardVelocity;
        let nextY = this.map_y + Math.sin(this.currentAngle) * this.forwardVelocity;

        if (nextX > halfSize && nextX < canvasWidth - halfSize) {
            this.map_x = nextX;
        }

        if (nextY > (290 + halfSize) && nextY < canvasHeight - halfSize) {
            this.map_y = nextY;
        }
    }

    eat(num) { 
        
    }

    cameraPos() {

    }

    draw(ctx) { 
        
        ctx.fillStyle = "#2ecc71";

        // FIXED: Don't multiply by cameraScale here. 
        // index.html already scales the whole world.
        let halfW = this.width / 2;

        // Draw centered on map_x/map_y
        ctx.fillRect(this.map_x - halfW, this.map_y - halfW, this.width, this.width);

        // Removed ctx.restore() because there was no ctx.save() in this function
        // The save/restore is handled in index.html
    }
}