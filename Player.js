import { Node } from './Node.js';

export class Player {
    // Materials
    pos_x = 0;
    pos_y = 0;

    speed = 0;
    width = 0;

    cameraScale = 20; // How much width is increased

    currentAngle = 0;

    length = 1;
    health = 0;
    breath = 300;

    angleTurning = 5;
    desiredAngle = 0;

    forwardVelocity = 0;

    secondsSurvived = 0;
    

    constructor(pos_x, pos_y, speed, width, health, length) {
        this.pos_x = pos_x;
        this.pos_y = pos_y;

        this.speed = speed;
        this.width = width;

        this.health = health;
        this.length = length;
        
        this.wormNodes = new Array(1);

        this.wormNodes[0] = new Node(pos_x, pos_y, 1, this);

    }

    calculateAngle(input) { 
        
        // Safer boolean math
        let dx = (input.d ? 1 : 0) - (input.a ? 1 : 0);
        let dy = (input.s ? 1 : 0) - (input.w ? 1 : 0);

        if (dx !== 0 || dy !== 0) {
            
            // ERROR 1 FIXED: Added the '2'
            this.desiredAngle = Math.atan2(dy, dx); 

            let diff = this.desiredAngle - this.currentAngle;
            
            // ERROR 2 FIXED: Changed 'if' to 'while' to handle multiple spins
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI)  diff -= Math.PI * 2;

            let step = (Math.PI / 180) * this.angleTurning;

            if (Math.abs(diff) < step) {
                this.currentAngle = this.desiredAngle;
            } else {
                if (diff > 0) {
                    console.log("Direction", "Clockwise");
                    this.currentAngle += step;
                } else {
                    console.log("Direction", "CounterClockwise");
                    this.currentAngle -= step;
                }
            }
        }

    }
    
    calculateVelocity(input) {
        if (input.a || input.d || input.w || input.s) {
            this.forwardVelocity++;
        } else {
            this.forwardVelocity--;
        }

        this.forwardVelocity = Math.max(0, Math.min(5, this.forwardVelocity));
        
    }

    // 1. Accept the canvas size so we know where the walls are
    updatePos(canvasWidth, canvasHeight) {
        
        // 2. Calculate the "Half Width" (radius) 
        // Since you draw from the center, this is the distance from center to edge.
        let halfSize = this.width / 2;

        // 3. Calculate where the player WANTS to go next
        let nextX = this.pos_x + Math.cos(this.currentAngle) * this.forwardVelocity;
        let nextY = this.pos_y + Math.sin(this.currentAngle) * this.forwardVelocity;

        // 4. Horizontal Collision (Left and Right Walls)
        // logic: Is nextX greater than the left edge AND less than the right edge?
        if (nextX > halfSize && nextX < canvasWidth - halfSize) {
            this.pos_x = nextX;
        }

        // 5. Vertical Collision (Top and Bottom Walls)
        // logic: Is nextY greater than the top edge AND less than the bottom edge?
        if (nextY > (133 + halfSize) && nextY < canvasHeight - halfSize) {
            this.pos_y = nextY;
        }
    }

    eat(num) { // See how much you eat, and increase 

    }

    draw(ctx) { // Like refresh

        
        ctx.fillStyle = "#2ecc71";

        // 4. Draw the square CENTERED on (0,0)
        // We use -width/2 so the center of the square is the rotation point

        let headNode = this.wormNodes[0];

        let screenX = headNode.width / 2 * this.cameraScale;
        let screenY = headNode.width / 2 * this.cameraScale;

        ctx.fillRect(this.pos_x-screenX, this.pos_y-screenY, screenX, screenY);

        ctx.restore(); // 5. Restore the canvas to how it was before
        
    }





    

    

}