

class Player {
    // Materials
    pos_x = 0;
    pos_y = 0;

    speed = 0;
    width = 0;

    angleVectorX = 0;
    angleVectorY = 0;

    length = 1;
    health = 0;
    breath = 300;

    secondsSurvived = 0;
    

    constructor(pos_x, pos_y, speed, width, health) {
        this.pos_x = pos_x;
        this.pos_y = pos_y;

        this.speed = speed;
        this.width = width;

        this.health = health;

        speed = 0;
        
        wormNodes = new Array(1);

    }

    readInput(input) {
        if (input.ArrowUp) this.pos_y -= this.speed;
        if (input.ArrowDown) this.pos_y += this.speed;
        if (input.ArrowLeft) this.pos_x -= this.speed;
        if (input.ArrowRight) this.pos_x += this.speed;


    }



    

    

}