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
        
        this.wormNodes = new Array(1);
        this.wormNodes[0] = new Node(map_x, map_y, width, this); 
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

        if(this.wormNodes[0]) {
            this.wormNodes[0].x = this.map_x;
            this.wormNodes[0].y = this.map_y;
        }
    }

    draw(ctx) { 
        ctx.save(); 
        ctx.translate(this.map_x, this.map_y);
        ctx.rotate(this.currentAngle);

        ctx.fillStyle = "#2ecc71"; 
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "black";
        ctx.fillRect(5, -5, 5, 5);

        ctx.restore(); 
    }
}