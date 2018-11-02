export default class Controller {

	constructor() {
		this.animAmt = 0;
		this.period = 5;
	}

	/**
	 * @param {Number} dt Time in seconds since last update
	 */
	update(dt) {
		this.animAmt += dt / this.period;
	}

	/**
	 * @param {CanvasRenderingContext2D} context 
	 */
	render(context) {
		// TODO: Some rendering logic
	}

}
