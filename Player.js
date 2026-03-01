export class Player {
    pos_x = 0;
    pos_y = 0;
    speed = 0;
    width = 0;
    currentAngle = 0;
    health = 0;
    
    // Adjusted turning speed for better control
    angleTurning = 3; 
    forwardVelocity = 0;

    constructor(pos_x, pos_y, speed, width, health) {
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.speed = speed;
        this.width = width;
        this.health = health;
    }

    calculateAngle(input) { 
        // 1. Check for Arrow Keys OR WASD
        // (This makes sure it works regardless of which keys you press)
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
        // Check if ANY movement key is pressed
        let isMoving = input.ArrowRight || input.d || input.ArrowLeft || input.a || 
                       input.ArrowDown || input.s || input.ArrowUp || input.w;

        if (isMoving) {
            this.forwardVelocity += 0.2;
        } else {
            this.forwardVelocity *= 0.9; // Friction
        }
        this.forwardVelocity = Math.max(0, Math.min(this.speed, this.forwardVelocity));
    }

    // UPDATED: Now accepts worldWidth/Height instead of canvas size
    updatePos(worldWidth, worldHeight) {
        let nextX = this.pos_x + Math.cos(this.currentAngle) * this.forwardVelocity;
        let nextY = this.pos_y + Math.sin(this.currentAngle) * this.forwardVelocity;

        let r = this.width / 2;

        // Check collision against the WORLD size (3000), not the screen size
        if (nextX > r && nextX < worldWidth - r) {
            this.pos_x = nextX;
        }
        if (nextY > (291+r) && nextY < worldHeight - r) {
            this.pos_y = nextY;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.pos_x, this.pos_y);
        ctx.rotate(this.currentAngle);
        
        ctx.fillStyle = "#2ecc71";
        ctx.fillRect(-this.width / 2, -this.width / 2, this.width, this.width);
        
        // Added a small "eye" so you can see rotation
        ctx.fillStyle = "black";
        ctx.fillRect(5, -5, 5, 5); 

        ctx.restore();
    }
}