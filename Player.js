

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

    angleTurning = 1;

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
        
        let dx = input.ArrowRight - input.ArrowLeft;
        let dy = input.ArrowDown - input.ArrowUp;

        if (dx !== 0 || dy !== 0) {

            let desiredAngle = Math.atan2(dy, dx);

            let diff = (desiredAngle - this.currentAngle);
            
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;

            if (Math.abs(diff) < (Math.PI / 180) * this.angleTurning) {
                this.currentAngle = desiredAngle;
            } else {
                this.currentAngle += diff > 0 ? step : -step;
            }
        }

    }
    
    calculateVelocity(input) {
        if (input.ArrowLeft || input.ArrowRight || input.ArrowUp || input.ArrowDown) {
            this.forwardVelocity++;
        } else {
            this.forwardVelocity--;
        }

        this.forwardVelocity = Math.max(0, Math.min(10, this.forwardVelocity));
        
    }

    updatePos() {
        this.pos_x += Math.cos(this.currentAngle) * this.forwardVelocity;
        this.pos_y += Math.sin(this.currentAngle) * this.forwardVelocity;

    }

    

    draw(ctx) {
        ctx.fillStyle = "#2ecc71"; // Green like your button
        ctx.fillRect(this.pos_x, this.pos_y, this.width, this.width);
    }





    

    

}