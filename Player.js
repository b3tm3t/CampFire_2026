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

    // 1. Accept the canvas size so we know where the walls are
    updatePos(canvasWidth, canvasHeight) {
        
        // 2. Calculate the "Half Width" (radius) 
        // Since you draw from the center, this is the distance from center to edge.
        let halfSize = this.width / 2;

        // 3. Calculate where the player WANTS to go next
        let nextX = this.map_x + Math.cos(this.currentAngle) * this.forwardVelocity / Map.cameraScale;
        let nextY = this.map_y + Math.sin(this.currentAngle) * this.forwardVelocity / Map.cameraScale;

        // 4. Horizontal Collision (Left and Right Walls)
        // logic: Is nextX greater than the left edge AND less than the right edge?
        if (nextX > halfSize && nextX < canvasWidth - halfSize) {
            this.map_x = nextX;
        }

        // 5. Vertical Collision (Top and Bottom Walls)
        // logic: Is nextY greater than the top edge AND less than the bottom edge?
        if (nextY > (133 + halfSize) && nextY < canvasHeight - halfSize) {
            this.map_y = nextY;
        }
    }

    eat(num) { // See how much you eat, and increase 
        
    }

    cameraPos() {

    }

    draw(ctx) { // Like refresh

        
        ctx.fillStyle = "#2ecc71";

        // 4. Draw the square CENTERED on (0,0)
        // We use -width/2 so the center of the square is the rotation point

        let headNode = this.wormNodes[0];

        let screenX = headNode.width / 2 * Map.cameraScale;
        let screenY = headNode.width / 2 * Map.cameraScale;

        ctx.fillRect(this.map_x-screenX, this.map_y-screenY, screenX, screenY);

        ctx.restore(); // 5. Restore the canvas to how it was before
        
    }





    

    

}