

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

        this.speed = 0;
        
        this.wormNodes = new Array(1);

    }

    calculateAngle(input) { 
        
        let leftRight = input.ArrowLeft - input.ArrowRight;
        let upDown = input.ArrowUp - input.ArrowDown;

        let desiredAngle = Math.atan(upDown/leftRight);

        let angleDiff = (desiredAngle - this.currentAngle) % (Math.PI * 2); 

        if (angleDiff > Math.PI) { // Turn clockwise
            this.currentAngle += (Math.PI)/180 * this.angleTurning;
        } else { // Turn anti-clockwise
            this.currentAngle -= (Math.PI)/180 * this.angleTurning;
        }

    }
    
    calculateVelocity(input) {

    }

    

    draw(ctx) {
        ctx.fillStyle = "#2ecc71"; // Green like your button
        ctx.fillRect(this.pos_x, this.pos_y, this.width, this.width);
    }





    

    

}