

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
    breath = 10;

    secondsSurvived = 0;
    

    constructor(pos_x, pos_y, speed, width, health) {
        this.pos_x = pos_x;
        this.pos_y = pos_y;

        this.speed = speed;
        this.width = width;

        this.health = health;

        speed = 0;

        const grid = new Int8Array(width * height);

    }

    readInput(input) {
        if (input.ArrowUp) this.y -= this.speed;
        if (input.ArrowDown) this.y += this.speed;
        if (input.ArrowLeft) this.x -= this.speed;
        if (input.ArrowRight) this.x += this.speed;

    }

    

    

}