import {numpy as np} from 'numpy';

class Map {
    // Materials
    static NOTHING = 0;
    static DIRT = 1;
    static CLAY = 2;
    static WATER = 3;
    static ROAD = 4;
    static ROCK = 5;

    static SEWAGE_WALL = 5;
    // Consumables
    static POOP = 10;
    static TRASH = 20;

    constructor(width, height) {
        this.width = width;
        this.height = height;
        const grid = new Int8Array(width * height);

    }

    setTile(x, y, value) {
        grid[(y * width) + x] = value;
    }

    dig(pos_x, pos_y, radius) { // Int x, int y, int radius
        for (let x = -radius; x < radius; x++) {
            for (let y = -radius; y < radius; y++) { 
                this.setTile(pos_x, pos_y, NOTHING);
            }
        }
    }

    

}