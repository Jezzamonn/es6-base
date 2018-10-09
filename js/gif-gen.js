import Controller from './controller.js';
import Canvas from 'canvas';
import fs from 'fs';
import GIFEncoder from 'gifencoder';

const width = 500;
const height = 500;
const fps = 60;

function renderFrame(context, controller) {
    context.resetTransform();
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    // Set origin to middle.
    context.translate(canvas.width / 2, canvas.height / 2);
    
    controller.render(context);
}

const canvas = new Canvas(width, height);
const context = canvas.getContext('2d');
const controller = new Controller();
controller.update(0);

const encoder = new GIFEncoder(width, height);
encoder.createReadStream().pipe(fs.createWriteStream('test.gif'))
encoder.start();
encoder.setRepeat(0);
encoder.setDelay(1000 / fps);
encoder.setQuality(10);

while (true) {
    renderFrame(context, controller);
    encoder.addFrame(context);

    const lastAnimAmt = controller.animAmt;
    controller.update(1 / fps);
    if (controller.animAmt < lastAnimAmt) {
        break;
    }
}

encoder.finish();
