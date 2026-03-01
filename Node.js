import { Player } from "./Player.js";

export class Node {
    pos_x = 0;
    pos_y = 0;

    posInPlayer = 0;
    width = 0;
    player;

    color;

    REGULAR = "#FC8168";
    RING = "#FC9F8D";



    constructor(pos_x, pos_y, posInPlayer, player) {
        this.pos_x = pos_x;
        this.pos_y = pos_y;

        this.posInPlayer = posInPlayer;
        this.player = player;

        this.update();

    }

    update() {
        if (this.player.length < 5) {
            this.width = this.determineSegmentWidthBaby();
        } else if ((5 <= this.player.length) && (this.player.length < 10)) {
            this.width = this.determineSegmentWidthMedium();
        } else {
            this.width = this.determineSegmentWidthBig();
        }


    }

    determineSegmentWidthBaby() {

        let referenceSegment = this.posInPlayer * 100 / this.player.length;

        if (referenceSegment < 30) {
            this.color = this.REGULAR;
            return 3;
            
        }

        if (referenceSegment < 70) {
            this.color = this.REGULAR;
            return 4;
        }

        this.color = this.REGULAR;
        return 3;
    }

    determineSegmentWidthMedium() {

        let referenceSegment = this.posInPlayer * 100 / this.player.length;

        if (referenceSegment < 15) {
            this.color = this.REGULAR;
            return 3;
        }

        if (referenceSegment < 30) {
            this.color = this.RING;
            return 4;
        }

        if (referenceSegment < 40) {
            this.color = this.REGULAR;
            
            return 5;
        }

        if (referenceSegment < 85) {
            this.color = this.REGULAR;
            return 4;
        }

        this.color = this.REGULAR;
        return 3;
    }

    determineSegmentWidthBig() {

        let referenceSegment = this.posInPlayer * 100 / this.player.length;

        if (referenceSegment < 15) {
            this.color = this.REGULAR;
            return 4;
        }

        if (referenceSegment < 30) {
            this.color = this.RING;
            return 5;
        }

        if (referenceSegment < 40) {
            this.color = this.REGULAR;
            return 6;
        }

        if (referenceSegment < 85) {
            this.color = this.REGULAR;
            return 5;
        }

        this.color = this.REGULAR;
        return 4;
    }



    moveTo(pos_x, pos_y) {
        this.pos_x = pos_x;
        this.pos_y = pos_y;
    }
}