import { Player } from "./Player.js";

export class Node {
    pos_x = 0;
    pos_y = 0;

    posInPlayer = 0;
    width = 0;
    player;

    color;

    referenceSegment;

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

        this.referenceSegment = this.posInPlayer * 100 / (this.player.length - 1);

        if (this.referenceSegment < 30) {
            this.color = this.REGULAR;
            return 15;
            
        }

        if (this.referenceSegment < 50) {
            this.color = this.REGULAR;
            return 18;
        }

        this.color = this.REGULAR;
        return 15;
    }

    determineSegmentWidthMedium() {

        this.referenceSegment = this.posInPlayer * 100 / this.player.length;

        if (this.referenceSegment < 15) {
            this.color = this.REGULAR;
            return 15;
        }

        if (this.referenceSegment < 30) {
            this.color = this.RING;
            return 20;
        }

        if (this.referenceSegment < 40) {
            this.color = this.REGULAR;
            
            return 15;
        }

        if (this.referenceSegment < 85) {
            this.color = this.REGULAR;
            return 15;
        }

        this.color = this.REGULAR;
        return 15;
    }

    determineSegmentWidthBig() {

        this.referenceSegment = this.posInPlayer * 100 / this.player.length;

        if (this.referenceSegment < 15) {
            this.color = this.REGULAR;
            return 15;
        }

        if (this.referenceSegment < 30) {
            this.color = this.RING;
            return 20;
        }

        if (this.referenceSegment < 40) {
            this.color = this.REGULAR;
            return 15;
        }

        if (this.referenceSegment < 85) {
            this.color = this.REGULAR;
            return 15;
        }

        this.color = this.REGULAR;
        return 15;
    }

}