import { Player } from "./Player";

class Node {
    pos_x = 0;
    pos_y = 0;

    posInPlayer = 0;
    width = 0;
    player;

    color;

    REGULAR = "#FC8168";
    RING = "#FC9F8D";

    constructor(pos_x, pos_y, width, posInPlayer, player, color) {
        this.pos_x = pos_x;
        this.pos_y = pos_y;

        this.width = width;

        this.posInPlayer = posInPlayer;
        this.player = player;

    }

    update() {
        if (this.player.length < 5) {
            this.width = this.determineSegmentWidthBaby();
        } else if ((5 <= this.player.length) || (this.player.length < 10)) {
            this.width = this.determineSegmentWidthMedium();
        } else {
            this.width = this.determineSegmentWidthBig();
        }


    }

    determineSegmentWidthBaby() {

        let referenceSegment = this.posInPlayer * 100 / this.player.length;

        if (referenceSegment < 30) {
            return 3;
        }

        if (referenceSegment < 70) {
            return 4;
        }

        return 3;
    }

    determineSegmentWidthMedium() {

        let referenceSegment = this.posInPlayer * 100 / this.player.length;

        if (referenceSegment < 15) {
            return 3;
        }

        if (referenceSegment < 30) {
            return 4;
        }

        if (referenceSegment < 40) {
            return 5;
        }

        if (referenceSegment < 85) {
            return 4;
        }

        return 3;
    }

    determineSegmentWidthBig() {

        let referenceSegment = this.posInPlayer * 100 / this.player.length;

        if (referenceSegment < 15) {
            return 4;
        }

        if (referenceSegment < 30) {
            return 5;
        }

        if (referenceSegment < 40) {
            return 6;
        }

        if (referenceSegment < 85) {
            return 5;
        }

        return 4;
    }



    moveTo(pos_x, pos_y) {
        this.pos_x = pos_x;
        this.pos_y = pos_y;
    }
}