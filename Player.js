

export class Player {
    // Materials
    pos_x = 0;
    pos_y = 0;

    speed = 0;
    width = 0;

    currentAngle = 0;

    length = 1;
    health = 0;
    breath = 300;

    angleTurning = 5;
    desiredAngle = 0;

    forwardVelocity = 0;

    secondsSurvived = 0;
    

    constructor(pos_x, pos_y, speed, width, health) {
        this.pos_x = pos_x;
        this.pos_y = pos_y;

        this.speed = speed;
        this.width = width;

        this.health = health;
        
        this.wormNodes = new Array(1);

    }

    calculateAngle(input) { 
        /*
        let dx = input.ArrowRight - input.ArrowLeft;
        let dy = input.ArrowDown - input.ArrowUp;

        if (dx !== 0 || dy !== 0) {
            
            this.desiredAngle = Math.atan(dy, dx);

            let diff = this.desiredAngle - this.currentAngle;
            
            // 1. Normalize the difference so it's between -PI and PI
            // This ensures the worm always takes the shortest turn
            if (diff < -Math.PI) diff += Math.PI * 2;
            if (diff > Math.PI)  diff -= Math.PI * 2;

            let step = (Math.PI / 180) * this.angleTurning;

            if (Math.abs(diff) < step) {
                // We are close enough to just snap to the target
                this.currentAngle = this.desiredAngle;
            } else {
                // 2. If diff is positive, turn clockwise. If negative, turn counter-clockwise.
                if (diff > 0) {
                    console.log("Direction", "Clockwise ");
                    this.currentAngle += step;
                } else {
                    console.log("Direction", "CounterClockwise ");
                    this.currentAngle -= step;
                }
            }

        }
        */
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

    updatePos() {
        this.pos_x += Math.cos(this.currentAngle) * this.forwardVelocity;
        this.pos_y += Math.sin(this.currentAngle) * this.forwardVelocity;

    }

    

    draw(ctx) { // Like refresh

        ctx.save(); // 1. Save the current canvas state (no rotation)

        // 2. Move the "origin" (0,0) to the player's position
        ctx.translate(this.pos_x, this.pos_y);

        // 3. Rotate the canvas to the current angle
        ctx.rotate(this.currentAngle);

        ctx.fillStyle = "#2ecc71";

        // 4. Draw the square CENTERED on (0,0)
        // We use -width/2 so the center of the square is the rotation point
        ctx.fillRect(-this.width / 2, -this.width / 2, this.width, this.width);

        ctx.restore(); // 5. Restore the canvas to how it was before
        
    }





    

    

}