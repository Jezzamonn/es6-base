export default class Controller {

    constructor() {
        this.animAmt = 0;
        this.period = 3;
    }

    /**
     * Simulate time passing.
     *
     * @param {number} dt Time since the last frame, in seconds 
     */
    update(dt) {
        this.animAmt += dt / this.period;
        this.animAmt %= 1;
    }

    /**
     * Render the current state of the controller.
     *
     * @param {!CanvasRenderingContext2D} context
     */
    render(context) {
        context.beginPath();
        context.fillStyle = 'black';
        context.moveTo(0, 0);
        context.arc(0, 0, 100, 0, 2 * Math.PI * this.animAmt);
        context.fill();

        context.scale(10, 10);
        context.fillText(this.period * this.animAmt, 0, 0);
    }

}
